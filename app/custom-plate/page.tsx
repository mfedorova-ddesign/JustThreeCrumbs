"use client";

import { INGREDIENTS } from "@/lib/ingredients/data";
import { useGeneratorStore } from "@/lib/generator/store";
import { recommendedDailyTargets } from "@/lib/generator/targets";
import { giLabel, glycemicLoadLabel } from "@/lib/nutrition/calc";
import { Ingredient, IngredientCategory } from "@/types";
import { Minus, Plus, Shuffle, Trash2, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import { useId, useMemo, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

type SectionId = "vegetables" | "protein" | "carbs" | "fats";
type PlateEntry = { ingredient: Ingredient; grams: number };
type Sections = Record<SectionId, PlateEntry[]>;

// ── Section config ────────────────────────────────────────────────────────────

const SECTIONS: Record<SectionId, {
  label: string;
  hint: string;
  svgFill: string;
  activeBg: string;
  activeText: string;
  activeBorder: string;
  categories: IngredientCategory[];
}> = {
  vegetables: {
    label: "Vegetables",
    hint: "½ plate — non-starchy",
    svgFill: "#2D7A51",
    activeBg: "bg-[#EAF5EF]",
    activeText: "text-[#2D7A51]",
    activeBorder: "border-[#2D7A51]",
    categories: ["vegetables"],
  },
  protein: {
    label: "Protein",
    hint: "¼ plate — lean sources",
    svgFill: "#F97316",
    activeBg: "bg-[#FFF4E8]",
    activeText: "text-[#C2410C]",
    activeBorder: "border-[#F97316]",
    categories: ["protein"],
  },
  carbs: {
    label: "Complex carbs",
    hint: "¼ plate — whole grains",
    svgFill: "#FBBF24",
    activeBg: "bg-[#FFFBEB]",
    activeText: "text-[#92400E]",
    activeBorder: "border-[#FBBF24]",
    categories: ["carbs"],
  },
  fats: {
    label: "Fats",
    hint: "Small amount — oils, nuts, avocado",
    svgFill: "#818CF8",
    activeBg: "bg-[#EEF2FF]",
    activeText: "text-[#4F46E5]",
    activeBorder: "border-[#818CF8]",
    categories: ["fats"],
  },
};

const SECTION_ORDER: SectionId[] = ["vegetables", "protein", "carbs", "fats"];

// ── TopTabs ───────────────────────────────────────────────────────────────────

function TopTabs() {
  return (
    <div className="inline-flex items-end flex-wrap">
      {(["Generator", "Recipes", "Diet"] as const).map((label) => (
        <Link
          key={label}
          href={`/${label.toLowerCase()}`}
          className="rounded-t-xl border border-brand-border border-b-brand-border bg-brand-bg/40 px-4 py-2.5 text-sm font-medium text-brand-text/70 transition hover:bg-white hover:text-brand-text"
        >
          {label}
        </Link>
      ))}
      <span className="relative -mb-px rounded-t-xl border border-brand-border bg-white px-4 py-2.5 text-sm font-semibold text-brand-text">
        Custom plate
      </span>
    </div>
  );
}

// ── Nutrition helpers ──────────────────────────────────────────────────────────

function entryNutrition(e: PlateEntry) {
  const f = e.grams / 100;
  return {
    calories: e.ingredient.calories * f,
    protein: e.ingredient.protein * f,
    fat: e.ingredient.fat * f,
    carbs: e.ingredient.carbs * f,
    fiber: (e.ingredient.fiber ?? 0) * f,
  };
}

function totalNutrition(sections: Sections) {
  const all = SECTION_ORDER.flatMap((s) => sections[s]);
  let cal = 0, prot = 0, fat = 0, carbs = 0, fiber = 0, giNum = 0, giDen = 0;
  for (const e of all) {
    const n = entryNutrition(e);
    cal += n.calories; prot += n.protein; fat += n.fat; carbs += n.carbs; fiber += n.fiber;
    giNum += e.ingredient.glycemicIndex * e.grams; giDen += e.grams;
  }
  const gi = giDen > 0 ? Math.round(giNum / giDen) : 0;
  const gl = Number(((gi * carbs) / 100).toFixed(1));
  return {
    calories: Math.round(cal),
    protein: Math.round(prot * 10) / 10,
    fat: Math.round(fat * 10) / 10,
    carbs: Math.round(carbs * 10) / 10,
    fiber: Math.round(fiber * 10) / 10,
    gi, gl,
  };
}

function suggestGrams(ing: Ingredient, section: SectionId, mealTarget: { protein: number; carbs: number }): number {
  if (section === "vegetables") return 150;
  if (section === "fats") return ing.calories > 700 ? 10 : 20;
  if (section === "protein") {
    const rate = ing.protein / 100;
    if (rate < 0.03) return 120;
    return Math.round(Math.min(350, Math.max(50, (mealTarget.protein * 0.65) / rate)));
  }
  // carbs
  const rate = ing.carbs / 100;
  if (rate < 0.05) return 100;
  return Math.round(Math.min(220, Math.max(40, (mealTarget.carbs * 0.55) / rate)));
}

function cap(n: number, dec = 1) { return Math.round(n * 10 ** dec) / 10 ** dec; }
function pct(val: number, target: number) { return target > 0 ? Math.min(100, Math.round((val / target) * 100)) : 0; }
function displayName(name: string) { return name.charAt(0).toUpperCase() + name.slice(1); }

/** Protein: modest overshoot is OK — only treat as “over” well above meal target */
const PROTEIN_OVER_TARGET_MULTIPLIER = 1.2;

/** True when current amount is above meal target (show red glow). Use `multiplier` > 1 to allow a buffer (protein). */
function isOverTarget(value: number, target: number, multiplier = 1): boolean {
  return target > 0 && value > target * multiplier + 1e-6;
}

const overValueClassName = "font-semibold text-red-600 animate-pulse";

function overValueStyle(): CSSProperties {
  return {
    textShadow: "0 0 10px rgba(248, 113, 113, 0.95), 0 0 20px rgba(220, 38, 38, 0.6)",
  };
}

function clampGrams(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.round(value));
}

/** Full-sector template (grey); brand colour fills only the angular / radial portion given by nutrient % */
const PLATE_NEUTRAL_HEX = "#B4B8C4";

/** Coloured wedge: west → north along outer rim (carbs quadrant), p = 0–100 */
function partialCarbsColoredPath(p: number): string | null {
  if (p <= 0) return null;
  if (p >= 100) return "M110 110 L10 110 A100 100 0 0 1 110 10 Z";
  const u = p / 100;
  const endA = Math.PI + (Math.PI / 2) * u;
  const ex = 110 + 100 * Math.cos(endA);
  const ey = 110 + 100 * Math.sin(endA);
  return `M110 110 L10 110 A100 100 0 0 1 ${ex} ${ey} Z`;
}

/** Coloured wedge: west → south along outer rim (protein quadrant), p = 0–100 */
function partialProteinColoredPath(p: number): string | null {
  if (p <= 0) return null;
  if (p >= 100) return "M110 110 L10 110 A100 100 0 0 0 110 210 Z";
  const u = p / 100;
  const endA = Math.PI - (Math.PI / 2) * u;
  const ex = 110 + 100 * Math.cos(endA);
  const ey = 110 + 100 * Math.sin(endA);
  return `M110 110 L10 110 A100 100 0 0 0 ${ex} ${ey} Z`;
}

/** Coloured wedge: north → east → south along outer rim (right half), p = 0–100 of 180° */
function partialVegetablesColoredPath(p: number): string | null {
  if (p <= 0) return null;
  if (p >= 100) return "M110 110 L110 10 A100 100 0 0 1 210 110 A100 100 0 0 1 110 210 Z";
  const u = p / 100;
  const endA = -Math.PI / 2 + Math.PI * u;
  const ex = 110 + 100 * Math.cos(endA);
  const ey = 110 + 100 * Math.sin(endA);
  return `M110 110 L110 10 A100 100 0 0 1 ${ex} ${ey} Z`;
}

function sectionTotals(sections: Sections, sid: SectionId) {
  return sections[sid].reduce(
    (acc, e) => {
      const n = entryNutrition(e);
      acc.calories += n.calories;
      acc.protein += n.protein;
      acc.carbs += n.carbs;
      acc.fat += n.fat;
      acc.fiber += n.fiber;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );
}

/**
 * 0–100: how close this section’s nutrients are to the meal target (plate-style weights for veg).
 * No ingredients → 0 (full neutral grey).
 */
function sectionNutrientFillPercent(
  sid: SectionId,
  sections: Sections,
  mealTarget: { calories: number; protein: number; carbs: number; fat: number; fiber: number }
): number {
  if (sections[sid].length === 0) return 0;
  const s = sectionTotals(sections, sid);
  switch (sid) {
    case "vegetables": {
      const calT = Math.max(1, mealTarget.calories * 0.5);
      const fibT = Math.max(1, mealTarget.fiber * 0.45);
      return Math.min(100, Math.round((pct(s.calories, calT) + pct(s.fiber, fibT)) / 2));
    }
    case "protein":
      return pct(s.protein, Math.max(1, mealTarget.protein));
    case "carbs":
      return pct(s.carbs, Math.max(1, mealTarget.carbs));
    case "fats":
      return pct(s.fat, Math.max(1, mealTarget.fat));
    default:
      return 0;
  }
}

// ── Plate SVG ──────────────────────────────────────────────────────────────────

function PlateSVG({
  sections,
  activeSection,
  onSectionClick,
  mealTarget,
}: {
  sections: Sections;
  activeSection: SectionId;
  onSectionClick: (s: SectionId) => void;
  mealTarget: { calories: number; protein: number; carbs: number; fat: number; fiber: number };
}) {
  const fatsGradId = `fatsg-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const pCarbs = sectionNutrientFillPercent("carbs", sections, mealTarget);
  const pVeg = sectionNutrientFillPercent("vegetables", sections, mealTarget);
  const pProt = sectionNutrientFillPercent("protein", sections, mealTarget);
  const pFats = sectionNutrientFillPercent("fats", sections, mealTarget);

  const dCarbsColor = partialCarbsColoredPath(pCarbs);
  const dVegColor = partialVegetablesColoredPath(pVeg);
  const dProtColor = partialProteinColoredPath(pProt);

  /** White sector seams only — never stroke filled wedges (stroke bleeds inward on radial edges and “erases” protein). */
  const seamW = 2.5;

  return (
    <svg viewBox="0 0 220 220" className="w-full max-w-[240px]" aria-label="Plate diagram">
      {/* Shadow */}
      <ellipse cx="110" cy="216" rx="90" ry="5" fill="#00000014" />
      {/* Outer rim — white fill so sector arcs (r=100) do not show a grey band outside the orange/green/yellow */}
      <circle cx="110" cy="110" r="104" fill="white" stroke="#E5E7EB" strokeWidth="3" />

      {/*
        Donut-style plate:
        · Grey full wedge + brand-coloured partial wedge (nutrient % = angular fill of that sector)
        · Fats: radial fill from centre outward by same %
      */}

      {/* Carbs — top-left 25% */}
      <g className="cursor-pointer" onClick={() => onSectionClick("carbs")}>
        <path d="M110 110 L10 110 A100 100 0 0 1 110 10 Z" fill={PLATE_NEUTRAL_HEX} stroke="none" />
        {dCarbsColor ? <path d={dCarbsColor} fill={SECTIONS.carbs.svgFill} stroke="none" /> : null}
      </g>
      {activeSection === "carbs" && (
        <path d="M110 110 L10 110 A100 100 0 0 1 110 10 Z" fill="none" stroke="#A16207" strokeWidth="2.5" strokeDasharray="5 4" opacity="0.55" />
      )}

      {/* Vegetables — right half 50% */}
      <g className="cursor-pointer" onClick={() => onSectionClick("vegetables")}>
        <path d="M110 110 L110 10 A100 100 0 0 1 210 110 A100 100 0 0 1 110 210 Z" fill={PLATE_NEUTRAL_HEX} stroke="none" />
        {dVegColor ? <path d={dVegColor} fill={SECTIONS.vegetables.svgFill} stroke="none" /> : null}
      </g>
      {activeSection === "vegetables" && (
        <path
          d="M110 110 L110 10 A100 100 0 0 1 210 110 A100 100 0 0 1 110 210 Z"
          fill="none"
          stroke="#166534"
          strokeWidth="2.5"
          strokeDasharray="6 4"
          opacity="0.55"
        />
      )}

      {/* Protein — bottom-left 25% (west→south arc must use sweep=0) */}
      <g className="cursor-pointer" onClick={() => onSectionClick("protein")}>
        <path d="M110 110 L10 110 A100 100 0 0 0 110 210 Z" fill={PLATE_NEUTRAL_HEX} stroke="none" />
        {dProtColor ? <path d={dProtColor} fill={SECTIONS.protein.svgFill} stroke="none" /> : null}
      </g>
      {activeSection === "protein" && (
        <path d="M110 110 L10 110 A100 100 0 0 0 110 210 Z" fill="none" stroke="#9A3412" strokeWidth="2.5" strokeDasharray="5 4" opacity="0.55" />
      )}

      {/* Sector seams (on top of fills, under fats disc) */}
      <g stroke="white" strokeWidth={seamW} strokeLinecap="round" pointerEvents="none">
        <line x1="110" y1="10" x2="110" y2="210" />
        <line x1="10" y1="110" x2="110" y2="110" />
      </g>

      {/* Fats — radial coloured fill grows from centre with nutrient % */}
      <g className="cursor-pointer" onClick={() => onSectionClick("fats")}>
        {pFats <= 0 ? (
          <circle cx="110" cy="110" r="33.5" fill={PLATE_NEUTRAL_HEX} stroke="none" />
        ) : pFats >= 100 ? (
          <circle cx="110" cy="110" r="33.5" fill={SECTIONS.fats.svgFill} stroke="none" />
        ) : (
          <>
            <defs>
              <radialGradient id={fatsGradId} gradientUnits="userSpaceOnUse" cx={110} cy={110} r={33.5}>
                <stop offset="0%" stopColor={SECTIONS.fats.svgFill} />
                <stop offset={`${pFats}%`} stopColor={SECTIONS.fats.svgFill} />
                <stop offset={`${pFats}%`} stopColor={PLATE_NEUTRAL_HEX} />
                <stop offset="100%" stopColor={PLATE_NEUTRAL_HEX} />
              </radialGradient>
            </defs>
            <circle cx="110" cy="110" r="33.5" fill={`url(#${fatsGradId})`} stroke="none" />
          </>
        )}
      </g>
      {activeSection === "fats" && (
        <circle
          cx="110"
          cy="110"
          r="33.5"
          fill="none"
          stroke="#4338CA"
          strokeWidth="2"
          strokeDasharray="5 3"
          opacity="0.55"
        />
      )}

      {/* Labels on ring — light shadow keeps text readable on muted grey fills */}
      <text
        x="178"
        y="100"
        textAnchor="middle"
        fontSize="9"
        fontWeight="700"
        fill="white"
        opacity=".96"
        style={{ pointerEvents: "none", textShadow: "0 1px 2px rgb(0 0 0 / 0.35)" }}
      >
        Vegetables
      </text>
      <text
        x="178"
        y="113"
        textAnchor="middle"
        fontSize="8"
        fill="white"
        opacity=".88"
        style={{ pointerEvents: "none", textShadow: "0 1px 2px rgb(0 0 0 / 0.35)" }}
      >
        50%
      </text>

      <text
        x="62"
        y="78"
        textAnchor="middle"
        fontSize="9"
        fontWeight="700"
        fill="white"
        opacity=".96"
        style={{ pointerEvents: "none", textShadow: "0 1px 2px rgb(0 0 0 / 0.35)" }}
      >
        Carbs
      </text>
      <text
        x="62"
        y="91"
        textAnchor="middle"
        fontSize="9"
        fill="white"
        opacity=".88"
        style={{ pointerEvents: "none", textShadow: "0 1px 2px rgb(0 0 0 / 0.35)" }}
      >
        25%
      </text>

      <text
        x="62"
        y="158"
        textAnchor="middle"
        fontSize="9"
        fontWeight="700"
        fill="white"
        opacity=".96"
        style={{ pointerEvents: "none", textShadow: "0 1px 2px rgb(0 0 0 / 0.35)" }}
      >
        Protein
      </text>
      <text
        x="62"
        y="171"
        textAnchor="middle"
        fontSize="9"
        fill="white"
        opacity=".88"
        style={{ pointerEvents: "none", textShadow: "0 1px 2px rgb(0 0 0 / 0.35)" }}
      >
        25%
      </text>

      <text
        x="110"
        y="114"
        textAnchor="middle"
        fontSize="9"
        fontWeight="700"
        fill="white"
        opacity=".98"
        style={{ pointerEvents: "none", textShadow: "0 1px 2px rgb(0 0 0 / 0.35)" }}
      >
        Fats
      </text>
    </svg>
  );
}

// ── Progress bar ──────────────────────────────────────────────────────────────

function MacroBar({
  label,
  value,
  target,
  unit,
  overMultiplier = 1,
}: {
  label: string;
  value: number;
  target: number;
  unit: string;
  /** e.g. 1.2 = red glow only if value > 120% of target (used for protein) */
  overMultiplier?: number;
}) {
  const p = pct(value, target);
  const color = p < 75 ? "bg-amber-400" : p <= 115 ? "bg-brand-primary" : "bg-red-500";
  const over = isOverTarget(value, target, overMultiplier);
  return (
    <div>
      <div className="flex justify-between text-[11px]">
        <span className="font-medium text-brand-text/70">{label}</span>
        <span
          className={over ? overValueClassName : "text-brand-text/50"}
          style={over ? overValueStyle() : undefined}
        >
          {cap(value)}
          {unit} / {target}
          {unit}
        </span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-brand-border">
        <div className={`h-full rounded-full transition-all duration-300 ${color}`} style={{ width: `${Math.min(100, p)}%` }} />
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function CustomPlatePage() {
  const { profile } = useGeneratorStore();
  const router = useRouter();

  const [mealsPerDay, setMealsPerDay] = useState(3);
  const [sections, setSections] = useState<Sections>({ vegetables: [], protein: [], carbs: [], fats: [] });
  const [activeSection, setActiveSection] = useState<SectionId>("protein");

  const dailyTargets = recommendedDailyTargets(profile);
  const mealTarget = {
    calories: Math.round(dailyTargets.calories / mealsPerDay),
    protein: Math.round(dailyTargets.protein / mealsPerDay),
    fat: Math.round(dailyTargets.fat / mealsPerDay),
    carbs: Math.round(dailyTargets.carbs / mealsPerDay),
    fiber: Math.round(dailyTargets.fiber / mealsPerDay),
  };

  const nutrition = useMemo(() => totalNutrition(sections), [sections]);
  const hasContent = SECTION_ORDER.some((s) => sections[s].length > 0);

  // Ingredients per section
  const availableIngredients = useMemo(() => {
    const map: Record<SectionId, Ingredient[]> = { vegetables: [], protein: [], carbs: [], fats: [] };
    for (const sid of SECTION_ORDER) {
      map[sid] = INGREDIENTS.filter((i) => SECTIONS[sid].categories.includes(i.category));
    }
    return map;
  }, []);

  function addIngredient(sid: SectionId, ing: Ingredient) {
    if (sections[sid].some((e) => e.ingredient.name === ing.name)) return;
    const grams = suggestGrams(ing, sid, mealTarget);
    setSections((prev) => ({ ...prev, [sid]: [...prev[sid], { ingredient: ing, grams }] }));
  }

  function removeIngredient(sid: SectionId, idx: number) {
    setSections((prev) => ({ ...prev, [sid]: prev[sid].filter((_, i) => i !== idx) }));
  }

  function adjustGrams(sid: SectionId, idx: number, delta: number) {
    setSections((prev) => ({
      ...prev,
      [sid]: prev[sid].map((e, i) => i === idx ? { ...e, grams: Math.max(5, Math.round(e.grams / 5) * 5 + delta) } : e),
    }));
  }

  function setGrams(sid: SectionId, idx: number, nextValue: number) {
    setSections((prev) => ({
      ...prev,
      [sid]: prev[sid].map((e, i) => (i === idx ? { ...e, grams: clampGrams(nextValue) } : e)),
    }));
  }

  function autoFill() {
    const next: Sections = { vegetables: [], protein: [], carbs: [], fats: [] };
    for (const sid of SECTION_ORDER) {
      const pool = availableIngredients[sid];
      if (pool.length > 0) {
        const ing = pool[Math.floor(Math.random() * pool.length)];
        next[sid] = [{ ingredient: ing, grams: suggestGrams(ing, sid, mealTarget) }];
      }
    }
    setSections(next);
  }

  function clearAll() {
    setSections({ vegetables: [], protein: [], carbs: [], fats: [] });
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      <header className="w-full border-b border-brand-border/90 bg-white">
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between px-4 py-4 md:px-8">
          <Link href="/" className="inline-block">
            <img src="/images/logo-full.png" alt="JustThreeCrumbs" className="h-8 w-auto" />
          </Link>
          <button
            type="button"
            title="Profile"
            aria-label="Profile"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-border/90 text-brand-text/80 transition-colors hover:bg-brand-bg hover:text-brand-text"
            onClick={() => router.push("/profile")}
          >
            <User className="size-[18px]" strokeWidth={2} />
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1280px] px-4 pb-14 pt-6 md:px-8">
        <h1 className="text-3xl font-semibold text-brand-text">Custom Plate</h1>
        <p className="mt-1 text-sm text-brand-text/65">
          Build your meal using the Harvard Plate method — balanced, personalised to your targets.
        </p>
        <div className="mt-5">
          <TopTabs />
        </div>
        <div className="h-px w-full bg-brand-border" />

        <div className="mt-6 grid gap-6 md:grid-cols-[260px_minmax(0,1fr)]">

          {/* ── Left: plate + controls ── */}
          <div className="flex flex-col items-center gap-5">
            <PlateSVG
              sections={sections}
              activeSection={activeSection}
              onSectionClick={setActiveSection}
              mealTarget={mealTarget}
            />

            {/* Meals per day */}
            <div className="w-full rounded-2xl border border-brand-border bg-white p-4 shadow-soft">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-text/45">Meals per day</p>
              <div className="mt-2 flex gap-2">
                {[2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setMealsPerDay(n)}
                    className={`flex-1 rounded-xl border py-2 text-sm font-semibold transition ${mealsPerDay === n ? "border-brand-primary bg-[#EAF5EF] text-brand-primary" : "border-brand-border bg-white text-brand-text/70 hover:bg-brand-bg"}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <p className="mt-2.5 text-[11px] text-brand-text/50">
                Meal target: <span className="font-semibold text-brand-text/70">{mealTarget.calories} kcal · P {mealTarget.protein}g · F {mealTarget.fat}g · C {mealTarget.carbs}g</span>
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex w-full gap-2">
              <button
                type="button"
                onClick={autoFill}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-brand-border bg-white px-3 py-2.5 text-[13px] font-medium text-brand-text/75 shadow-soft transition hover:bg-brand-bg"
              >
                <Shuffle className="size-3.5 shrink-0" strokeWidth={2} />
                Auto-fill
              </button>
              {hasContent && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-brand-border/80 bg-white px-3 py-2.5 text-[13px] font-medium text-brand-text/50 transition hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                >
                  <Trash2 className="size-3.5 shrink-0" strokeWidth={2} />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* ── Right: section pickers + summary ── */}
          <div className="space-y-4">

            {/* Section tabs */}
            <div className="flex gap-1 rounded-xl border border-brand-border bg-white p-1 shadow-soft">
              {SECTION_ORDER.map((sid) => {
                const meta = SECTIONS[sid];
                const isActive = activeSection === sid;
                const count = sections[sid].length;
                return (
                  <button
                    key={sid}
                    type="button"
                    onClick={() => setActiveSection(sid)}
                    className={`flex-1 rounded-lg py-2 text-[12px] font-semibold transition ${isActive ? `${meta.activeBg} ${meta.activeText}` : "text-brand-text/55 hover:bg-brand-bg"}`}
                  >
                    {meta.label.split(" ")[0]}
                    {count > 0 && <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-current/15 text-[10px]">{count}</span>}
                  </button>
                );
              })}
            </div>

            {/* Active section picker */}
            {SECTION_ORDER.map((sid) => {
              if (sid !== activeSection) return null;
              const meta = SECTIONS[sid];
              const pool = availableIngredients[sid];
              const selected = sections[sid];
              const selectedNames = new Set(selected.map((e) => e.ingredient.name));

              return (
                <div key={sid} className={`rounded-2xl border ${meta.activeBorder} bg-white p-4 shadow-soft`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-semibold ${meta.activeText}`}>{meta.label}</p>
                      <p className="text-[11px] text-brand-text/50">{meta.hint}</p>
                    </div>
                  </div>

                  {/* Add ingredient */}
                  <div className="mt-3">
                    <select
                      className="w-full rounded-xl border border-brand-border bg-brand-bg/50 px-3 py-2.5 text-[13px] text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-primary/30"
                      value=""
                      onChange={(e) => {
                        const ing = pool.find((i) => i.name === e.target.value);
                        if (ing) addIngredient(sid, ing);
                      }}
                    >
                      <option value="">+ Add ingredient…</option>
                      {pool
                        .filter((i) => !selectedNames.has(i.name))
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((i) => (
                          <option key={i.name} value={i.name}>{displayName(i.name)}</option>
                        ))}
                    </select>
                  </div>

                  {/* Selected ingredients */}
                  {selected.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {selected.map((entry, idx) => {
                        const n = entryNutrition(entry);
                        return (
                          <li key={entry.ingredient.name} className="flex items-center gap-2 rounded-xl border border-brand-border/70 bg-brand-bg/40 px-3 py-2">
                            <div className="min-w-0 flex-1">
                              <p className="text-[13px] font-semibold text-brand-text">{displayName(entry.ingredient.name)}</p>
                              <p className="text-[11px] text-brand-text/50">
                                {Math.round(n.calories)} kcal · P {cap(n.protein)}g · F {cap(n.fat)}g · C {cap(n.carbs)}g
                              </p>
                            </div>
                            <div className="flex shrink-0 items-center gap-1">
                              <button type="button" onClick={() => adjustGrams(sid, idx, -5)} className="flex h-6 w-6 items-center justify-center rounded-lg border border-brand-border text-brand-text/60 hover:bg-white">
                                <Minus className="size-3" strokeWidth={2.5} />
                              </button>
                              <div className="flex items-center">
                                <input
                                  inputMode="numeric"
                                  type="number"
                                  min={0}
                                  step={5}
                                  value={entry.grams}
                                  onChange={(event) => setGrams(sid, idx, Number(event.target.value))}
                                  className="w-14 rounded-lg border border-brand-border bg-white px-2 py-1 text-center text-[12px] font-semibold text-brand-text outline-none focus:ring-2 focus:ring-brand-primary/20"
                                />
                                <span className="ml-1 text-[12px] font-semibold text-brand-text/70">g</span>
                              </div>
                              <button type="button" onClick={() => adjustGrams(sid, idx, 5)} className="flex h-6 w-6 items-center justify-center rounded-lg border border-brand-border text-brand-text/60 hover:bg-white">
                                <Plus className="size-3" strokeWidth={2.5} />
                              </button>
                              <button type="button" onClick={() => removeIngredient(sid, idx)} className="ml-1 flex h-6 w-6 items-center justify-center rounded-lg text-brand-text/35 hover:bg-red-50 hover:text-red-600">
                                <Trash2 className="size-3" strokeWidth={2} />
                              </button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  {selected.length === 0 && (
                    <p className="mt-3 text-center text-[12px] text-brand-text/40">No ingredients added yet</p>
                  )}
                </div>
              );
            })}

            {/* Nutrition summary */}
            {hasContent && (
              <div className="rounded-2xl border border-brand-border bg-white p-4 shadow-soft">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-text/45">Plate nutrition</p>

                <div className="mt-3 space-y-2.5">
                  <MacroBar label="Calories" value={nutrition.calories} target={mealTarget.calories} unit=" kcal" />
                  <MacroBar
                    label="Protein"
                    value={nutrition.protein}
                    target={mealTarget.protein}
                    unit="g"
                    overMultiplier={PROTEIN_OVER_TARGET_MULTIPLIER}
                  />
                  <MacroBar label="Fat" value={nutrition.fat} target={mealTarget.fat} unit="g" />
                  <MacroBar label="Carbs" value={nutrition.carbs} target={mealTarget.carbs} unit="g" />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <div className="rounded-xl border border-brand-border bg-brand-bg/50 px-3 py-2 text-center">
                    <p className="text-[10px] text-brand-text/50">Fiber</p>
                    <p className="text-[13px] font-semibold text-brand-text">{nutrition.fiber}g</p>
                    <p className="text-[10px] text-brand-text/40">{pct(nutrition.fiber, mealTarget.fiber)}% of meal target</p>
                  </div>
                  <div className={`rounded-xl border px-3 py-2 text-center ${giLabel(nutrition.gi) === "low" ? "border-[#CDE7D7] bg-[#EAF5EF]" : giLabel(nutrition.gi) === "medium" ? "border-amber-200 bg-amber-50" : "border-red-200 bg-red-50"}`}>
                    <p className="text-[10px] text-brand-text/50">GI</p>
                    <p className={`text-[13px] font-semibold ${giLabel(nutrition.gi) === "low" ? "text-brand-primary" : giLabel(nutrition.gi) === "medium" ? "text-amber-700" : "text-red-700"}`}>{nutrition.gi}</p>
                    <p className="text-[10px] opacity-60">{giLabel(nutrition.gi)}</p>
                  </div>
                  <div className={`rounded-xl border px-3 py-2 text-center ${glycemicLoadLabel(nutrition.gl) === "low" ? "border-[#CDE7D7] bg-[#EAF5EF]" : glycemicLoadLabel(nutrition.gl) === "medium" ? "border-amber-200 bg-amber-50" : "border-red-200 bg-red-50"}`}>
                    <p className="text-[10px] text-brand-text/50">GL</p>
                    <p className={`text-[13px] font-semibold ${glycemicLoadLabel(nutrition.gl) === "low" ? "text-brand-primary" : glycemicLoadLabel(nutrition.gl) === "medium" ? "text-amber-700" : "text-red-700"}`}>{nutrition.gl}</p>
                    <p className="text-[10px] opacity-60">{glycemicLoadLabel(nutrition.gl)}</p>
                  </div>
                  <div className="rounded-xl border border-brand-border bg-brand-bg/50 px-3 py-2 text-center">
                    <p className="text-[10px] text-brand-text/50">Total</p>
                    <p
                      className={`text-[13px] ${isOverTarget(nutrition.calories, mealTarget.calories) ? overValueClassName : "font-semibold text-brand-text"}`}
                      style={isOverTarget(nutrition.calories, mealTarget.calories) ? overValueStyle() : undefined}
                    >
                      {nutrition.calories} kcal
                    </p>
                    <p
                      className={
                        isOverTarget(nutrition.calories, mealTarget.calories)
                          ? `text-[10px] ${overValueClassName}`
                          : "text-[10px] text-brand-text/40"
                      }
                      style={isOverTarget(nutrition.calories, mealTarget.calories) ? overValueStyle() : undefined}
                    >
                      {pct(nutrition.calories, mealTarget.calories)}% of target
                    </p>
                  </div>
                </div>

                {/* Over/under feedback */}
                {(() => {
                  const tips: { text: string; tone: "amber" | "red" }[] = [];
                  if (isOverTarget(nutrition.calories, mealTarget.calories)) {
                    tips.push({ text: "Calories are above this meal’s target", tone: "red" });
                  }
                  if (isOverTarget(nutrition.protein, mealTarget.protein, PROTEIN_OVER_TARGET_MULTIPLIER)) {
                    tips.push({ text: "Protein is well above this meal’s target", tone: "red" });
                  }
                  if (isOverTarget(nutrition.carbs, mealTarget.carbs)) {
                    tips.push({ text: "Carbs are above this meal’s target", tone: "red" });
                  }
                  if (isOverTarget(nutrition.fat, mealTarget.fat)) {
                    tips.push({ text: "Fat is above this meal’s target", tone: "red" });
                  }
                  if (pct(nutrition.protein, mealTarget.protein) < 70) tips.push({ text: "Add more protein", tone: "amber" });
                  if (pct(nutrition.carbs, mealTarget.carbs) > 120 && !isOverTarget(nutrition.carbs, mealTarget.carbs)) {
                    tips.push({ text: "Carbs are high — reduce portion", tone: "amber" });
                  }
                  if (pct(nutrition.fat, mealTarget.fat) > 130 && !isOverTarget(nutrition.fat, mealTarget.fat)) {
                    tips.push({ text: "Fat is high — reduce oils or fat portions", tone: "amber" });
                  }
                  if (sections.fats.length === 0) tips.push({ text: "Consider adding healthy fats (olive oil, nuts)", tone: "amber" });
                  if (nutrition.fiber < mealTarget.fiber * 0.5) tips.push({ text: "Low fiber — add more vegetables", tone: "amber" });
                  if (tips.length === 0) return null;
                  return (
                    <div className="mt-3 space-y-1.5">
                      {tips.map((tip) => (
                        <p
                          key={tip.text}
                          className={`flex items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] ${
                            tip.tone === "red"
                              ? "border-red-200 bg-red-50 text-red-800 [box-shadow:0_0_12px_rgb(254_202_202_/_0.9)_inset]"
                              : "border-amber-200 bg-amber-50 text-amber-800"
                          }`}
                        >
                          <span className="mt-0.5 shrink-0">{tip.tone === "red" ? "!" : "⚠"}</span> {tip.text}
                        </p>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}

            {!hasContent && (
              <div className="rounded-2xl border border-dashed border-brand-border/80 bg-white/60 p-8 text-center">
                <p className="text-sm text-brand-text/50">Pick ingredients from each section to build your plate and see the nutrition breakdown.</p>
                <button
                  type="button"
                  onClick={autoFill}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:opacity-90"
                >
                  <Shuffle className="size-4 shrink-0" strokeWidth={2} />
                  Auto-fill a plate
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
