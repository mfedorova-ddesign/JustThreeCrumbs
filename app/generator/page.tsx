"use client";

import { Button } from "@/components/ui/Button";
import { INGREDIENTS } from "@/lib/ingredients/data";
import { INGREDIENT_HEALTH_FACTS } from "@/lib/ingredients/healthFacts";
import { INGREDIENT_SUBSTITUTIONS } from "@/lib/ingredients/substitutions";
import { isProfileComplete } from "@/lib/generator/profile";
import { recommendedDailyTargets } from "@/lib/generator/targets";
import {
  diabeticScore,
  glycemicIndexAverage,
  isVeganMeal,
  isVegetarianMeal,
  sumCalories,
  sumFiber,
  sumMacros
} from "@/lib/nutrition/calc";
import { generateMealPlanAsync, regenerateSingleMeal } from "@/lib/generator/engine";
import { persistPlanToSession } from "@/lib/planStorage";
import { FIXED_RECIPES } from "@/lib/recipes/data";
import { useGeneratorStore } from "@/lib/generator/store";
import { mealImageUrlForId } from "@/lib/design/mealImages";
import { DayPlan, GeneratedMeal, Ingredient, MealPlan, MealType } from "@/types";
import {
  ChevronRight,
  Download,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Trash2,
  User,
  UtensilsCrossed,
  X
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type IngredientPickerState = { mealId: string; ingredientIndex: number } | null;
type RemovedIngredientsState = Record<string, Record<number, boolean>>;

type DayMealSlot = "breakfast" | "lunch" | "dinner" | "snack" | "extraSnack";

function getOtherTemplateIdsOnDay(day: DayPlan, slot: DayMealSlot): string[] {
  const order: DayMealSlot[] = ["breakfast", "lunch", "dinner", "snack", "extraSnack"];
  const ids: string[] = [];
  for (const s of order) {
    if (s === slot) continue;
    const m = day[s];
    if (m && !m.skipped) ids.push(m.templateId);
  }
  return ids;
}

function replaceMealInDaySlot(
  plan: MealPlan,
  dayNumber: number,
  slot: DayMealSlot,
  meal: GeneratedMeal
): MealPlan {
  return {
    ...plan,
    days: plan.days.map((d) => (d.day === dayNumber ? { ...d, [slot]: meal } : d))
  };
}

function findMealSlotMeta(
  plan: MealPlan,
  mealId: string
): { dayNumber: number; slot: DayMealSlot; mealType: MealType; isExtraSnack: boolean } | null {
  for (const d of plan.days) {
    const rows: { slot: DayMealSlot; mealType: MealType; isExtraSnack?: boolean }[] = [
      { slot: "breakfast", mealType: "breakfast" },
      { slot: "lunch", mealType: "lunch" },
      { slot: "dinner", mealType: "dinner" },
      { slot: "snack", mealType: "snack" }
    ];
    if (d.extraSnack) rows.push({ slot: "extraSnack", mealType: "snack", isExtraSnack: true });
    for (const r of rows) {
      const m = d[r.slot];
      if (m?.id === mealId) {
        return {
          dayNumber: d.day,
          slot: r.slot,
          mealType: r.mealType,
          isExtraSnack: Boolean(r.isExtraSnack)
        };
      }
    }
  }
  return null;
}

const ingredientByName = new Map(
  INGREDIENTS.map((ingredient) => [ingredient.name.toLowerCase(), ingredient])
);

function getSubstituteOptions(ingredientName: string): string[] {
  const key = ingredientName.toLowerCase();
  const options = INGREDIENT_SUBSTITUTIONS[key] ?? [];
  return options.filter((option) => ingredientByName.has(option.toLowerCase()));
}

function getHealthFact(ingredientName: string): string | null {
  const lower = ingredientName.toLowerCase();
  return INGREDIENT_HEALTH_FACTS[lower] ?? null;
}

function updateMealInPlan(
  plan: MealPlan,
  mealId: string,
  updater: (meal: GeneratedMeal) => GeneratedMeal
): MealPlan {
  return {
    ...plan,
    days: plan.days.map((day) => {
      const meals = {
        breakfast: day.breakfast,
        lunch: day.lunch,
        dinner: day.dinner,
        snack: day.snack,
        extraSnack: day.extraSnack
      };

      const nextMeals = Object.fromEntries(
        Object.entries(meals).map(([key, meal]) => [
          key,
          meal && meal.id === mealId ? updater(meal) : meal
        ])
      ) as typeof meals;

      return { ...day, ...nextMeals };
    })
  };
}

function recalculateMeal(meal: GeneratedMeal, removedMap: Record<number, boolean> = {}): GeneratedMeal {
  const activeIngredients = meal.ingredients.filter((_, index) => !removedMap[index]);
  return {
    ...meal,
    calories: sumCalories(activeIngredients),
    macros: sumMacros(activeIngredients),
    fiber: sumFiber(activeIngredients),
    glycemicIndex: glycemicIndexAverage(activeIngredients),
    diabeticScore: diabeticScore(activeIngredients),
    isVegetarian: isVegetarianMeal(activeIngredients),
    isVegan: isVeganMeal(activeIngredients)
  };
}

export default function GeneratorPage() {
  const {
    profile,
    isAuthenticated,
    planDays,
    latestPlan,
    setLatestPlan,
    setPlanDays,
    customRecipes,
    favoriteRecipeIds,
    skippedRecipeIds
  } = useGeneratorStore();
  const router = useRouter();
  const [selectedPlanRange, setSelectedPlanRange] = useState<1 | 3 | 7>(planDays);
  const [mealPlan, setMealPlan] = useState(latestPlan);
  const [loading, setLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(Boolean(latestPlan));
  const [activeIngredientPicker, setActiveIngredientPicker] = useState<IngredientPickerState>(null);
  const [removedIngredients, setRemovedIngredients] = useState<RemovedIngredientsState>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [openedMealId, setOpenedMealId] = useState<string | null>(null);
  const recommendedTargets = recommendedDailyTargets(profile);

  function commitPlan(updater: (prev: MealPlan) => MealPlan) {
    setMealPlan((prev) => {
      if (!prev) return prev;
      const next = updater(prev);
      // Zustand must not update during React's setState updater (same render cycle).
      queueMicrotask(() => {
        setLatestPlan(next);
        persistPlanToSession(next);
      });
      return next;
    });
  }

  function removeMealFromMenu(mealId: string) {
    commitPlan((p) => updateMealInPlan(p, mealId, (m) => ({ ...m, skipped: true })));
    setOpenedMealId((open) => (open === mealId ? null : open));
    setToastMessage("Removed from menu");
  }

  function restoreMealToMenu(mealId: string) {
    commitPlan((p) => updateMealInPlan(p, mealId, (m) => ({ ...m, skipped: false })));
    setToastMessage("Restored to menu");
  }

  function regenerateMealSlot(
    dayNumber: number,
    slot: DayMealSlot,
    mealType: MealType,
    isExtraSnack: boolean
  ) {
    let previousMealId: string | undefined;
    commitPlan((p) => {
      const day = p.days.find((d) => d.day === dayNumber);
      if (!day) return p;
      const current = day[slot];
      if (current) previousMealId = current.id;
      const excluded = getOtherTemplateIdsOnDay(day, slot);
      const dayIndex = dayNumber - 1;
      const seed = (Date.now() % 500_000) + Math.floor(Math.random() * 500_000);
      const newMeal = regenerateSingleMeal(profile, mealType, dayIndex, seed, {
        excludedTemplateIds: excluded,
        isExtraSnack,
        selection: {
          recipes: [...FIXED_RECIPES, ...customRecipes],
          favoriteRecipeIds,
          skippedRecipeIds
        }
      });
      return replaceMealInDaySlot(p, dayNumber, slot, newMeal);
    });
    if (previousMealId) {
      setRemovedIngredients((prev) => {
        const next = { ...prev };
        delete next[previousMealId!];
        return next;
      });
    }
    setOpenedMealId(null);
    setToastMessage("Dish regenerated");
  }

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 2200);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (isProfileComplete(profile)) return;
    setToastMessage("Complete onboarding data before generating a meal plan.");
    const timer = window.setTimeout(() => router.push("/profile"), 1200);
    return () => window.clearTimeout(timer);
  }, [isAuthenticated, profile, router]);

  function onIngredientReplace(mealId: string, ingredientIndex: number, nextIngredientName: string) {
    const replacement = ingredientByName.get(nextIngredientName.toLowerCase());
    if (!replacement) return;

    commitPlan((previousPlan) =>
      updateMealInPlan(previousPlan, mealId, (meal) => {
        const nextIngredients = meal.ingredients.map((ingredient, index) =>
          index === ingredientIndex
            ? {
                ...replacement,
                portionGrams: ingredient.portionGrams ?? replacement.portionGrams
              }
            : ingredient
        );
        return recalculateMeal(
          {
            ...meal,
            ingredients: nextIngredients
          },
          removedIngredients[mealId] ?? {}
        );
      })
    );

    setRemovedIngredients((previous) => ({
      ...previous,
      [mealId]: {
        ...(previous[mealId] ?? {}),
        [ingredientIndex]: false
      }
    }));

    setToastMessage(`Replaced ${mealPlan?.days
      .flatMap((day) => [day.breakfast, day.lunch, day.dinner, day.snack])
      .find((meal) => meal.id === mealId)
      ?.ingredients[ingredientIndex]?.name ?? "ingredient"} -> ${nextIngredientName}`);
    setActiveIngredientPicker(null);
  }

  function toggleIngredientRemoved(mealId: string, ingredientIndex: number) {
    setRemovedIngredients((previous) => {
      const currentlyRemoved = Boolean(previous[mealId]?.[ingredientIndex]);
      const nextRemovedForMeal: Record<number, boolean> = {
        ...(previous[mealId] ?? {}),
        [ingredientIndex]: !currentlyRemoved
      };

      commitPlan((previousPlan) => {
        const targetMeal = previousPlan.days
          .flatMap((day) => [day.breakfast, day.lunch, day.dinner, day.snack])
          .find((meal) => meal.id === mealId);

        if (!targetMeal) return previousPlan;

        return updateMealInPlan(previousPlan, mealId, () =>
          recalculateMeal(targetMeal, nextRemovedForMeal)
        );
      });

      return {
        ...previous,
        [mealId]: nextRemovedForMeal
      };
    });
  }

  function getVisibleIngredients(meal: GeneratedMeal): Ingredient[] {
    const removedMap = removedIngredients[meal.id] ?? {};
    return meal.ingredients.filter((_, index) => !removedMap[index]);
  }

  function getIngredientRemoved(mealId: string, ingredientIndex: number): boolean {
    return Boolean(removedIngredients[mealId]?.[ingredientIndex]);
  }

  function getMealById(mealId: string): GeneratedMeal | null {
    if (!mealPlan) return null;
    for (const day of mealPlan.days) {
      for (const meal of [day.breakfast, day.lunch, day.dinner, day.snack, day.extraSnack]) {
        if (!meal) continue;
        if (meal.id === mealId) return meal;
      }
    }
    return null;
  }

  async function exportPlan() {
    if (!mealPlan) return;

    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginX = 40;
    const maxTextWidth = pageWidth - marginX * 2;
    const lineHeight = 16;
    let y = 48;

    const ensureSpace = (needed = lineHeight) => {
      if (y + needed > pageHeight - 40) {
        doc.addPage();
        y = 48;
      }
    };

    const writeLine = (text: string, options?: { bold?: boolean; size?: number }) => {
      ensureSpace();
      doc.setFont("helvetica", options?.bold ? "bold" : "normal");
      doc.setFontSize(options?.size ?? 11);
      doc.text(text, marginX, y);
      y += lineHeight;
    };

    const writeParagraph = (text: string, indent = 0) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const wrapped = doc.splitTextToSize(text, maxTextWidth - indent) as string[];
      wrapped.forEach((line) => {
        ensureSpace();
        doc.text(line, marginX + indent, y);
        y += lineHeight;
      });
    };

    writeLine("JustThreeCrumbs Meal Plan", { bold: true, size: 16 });
    writeLine(`Plan ID: ${mealPlan.id}`);
    writeLine(`Generated: ${new Date().toLocaleString()}`);
    y += 6;

    mealPlan.days.forEach((day) => {
      const meals = [day.breakfast, day.lunch, day.dinner, day.snack, day.extraSnack].filter(
        Boolean
      ) as GeneratedMeal[];
      const activeMeals = meals.filter((m) => !m.skipped);
      const totals = activeMeals.reduce(
        (acc, meal) => {
          acc.calories += meal.calories;
          acc.protein += meal.macros.protein;
          acc.fat += meal.macros.fat;
          acc.carbs += meal.macros.carbs;
          acc.fiber += meal.fiber;
          return acc;
        },
        { calories: 0, carbs: 0, protein: 0, fat: 0, fiber: 0 }
      );

      ensureSpace(48);
      y += 6;
      writeLine(`Day ${day.day}`, { bold: true, size: 14 });
      writeLine(
        `Summary: ${Math.round(totals.calories)} kcal | Carbs ${Math.round(totals.carbs)}g | Protein ${Math.round(
          totals.protein
        )}g | Fat ${Math.round(totals.fat)}g | Fiber ${Math.round(totals.fiber)}g`
      );
      y += 4;

      activeMeals.forEach((meal) => {
        ensureSpace(64);
        writeLine(`${meal.mealType[0].toUpperCase() + meal.mealType.slice(1)}: ${meal.name}`, {
          bold: true
        });
        writeLine(
          `Calories ${Math.round(meal.calories)} | Carbs ${Math.round(meal.macros.carbs)}g | Protein ${Math.round(
            meal.macros.protein
          )}g | Fat ${Math.round(meal.macros.fat)}g | Fiber ${Math.round(meal.fiber)}g`
        );
        writeLine(`GI ${meal.glycemicIndex} | Diabetes Score ${meal.diabeticScore}/10`);
        writeLine("Ingredients:");
        meal.ingredients.forEach((ing) => {
          writeParagraph(`- ${ing.name}`, 12);
        });
        writeLine("Instructions:");
        meal.instructions.slice(0, 8).forEach((step, index) => {
          writeParagraph(`${index + 1}. ${step}`, 12);
        });
        y += 6;
      });
    });

    doc.save(`justthreecrumbs-plan-${mealPlan.id}.pdf`);
  }

  function backToGeneratorStart() {
    setHasGenerated(false);
    setMealPlan(null);
    setLatestPlan(null);
    setActiveIngredientPicker(null);
    setRemovedIngredients({});
    setOpenedMealId(null);
    setLoading(false);
  }

  async function onGenerateMealPlan() {
    if (!isProfileComplete(profile)) {
      setToastMessage("Complete onboarding data before generating a meal plan.");
      router.push("/profile");
      return;
    }

    if (!isAuthenticated) {
      setToastMessage("Please sign in or continue as guest first.");
      router.push("/auth");
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 80));

    let plan: MealPlan;
    try {
      plan = await generateMealPlanAsync(profile, selectedPlanRange, {
        recipes: [...FIXED_RECIPES, ...customRecipes],
        favoriteRecipeIds,
        skippedRecipeIds
      });
      setLatestPlan(plan);
      setPlanDays(selectedPlanRange);
      persistPlanToSession(plan);
    } catch (error) {
      setLoading(false);
      setToastMessage(
        error instanceof Error ? error.message : "Unable to generate plan. Complete onboarding data."
      );
      router.push("/profile");
      return;
    }
    setMealPlan(plan);
    setHasGenerated(true);
    setActiveIngredientPicker(null);
    setRemovedIngredients({});
    setOpenedMealId(null);
    setLoading(false);
    requestAnimationFrame(() => {
      document.getElementById("plan-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Header aligned with other pages */}
      <header className="w-full border-b border-brand-border/90 bg-white">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-3.5 md:max-w-[1280px] md:px-8">
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

      <main className="mx-auto w-full max-w-3xl px-4 pb-12 pt-5 md:max-w-[1280px] md:px-8 md:pb-16 md:pt-6">
        <h1 className="text-2xl font-semibold leading-tight tracking-tight text-brand-text sm:text-3xl">
          Meal plan generator
        </h1>
        <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-brand-text/65 sm:text-[15px]">
          Personalized, diabetes-aware meals — pick a length, generate once, then open recipes or fine-tune.
        </p>
        <div className="mt-5">
          <div className="inline-flex items-end">
            <span className="relative -mb-px rounded-t-xl border border-brand-border bg-white px-5 py-2.5 text-sm font-semibold text-brand-text">
              Generator
            </span>
            <Link
              href="/recipes"
              className="rounded-t-xl border border-brand-border border-b-brand-border bg-brand-bg/40 px-5 py-2.5 text-sm font-medium text-brand-text/70 transition hover:bg-white hover:text-brand-text"
            >
              Recipes
            </Link>
          </div>
          <div className="h-px w-full bg-brand-border" />
        </div>

        <section className="mt-6 rounded-2xl border border-brand-border/90 bg-white p-4 shadow-soft sm:p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-text/45">Plan length</p>
          <div className="mt-3 flex rounded-xl bg-brand-bg p-1">
            {([1, 3, 7] as const).map((d) => (
              <button
                key={d}
                type="button"
                disabled={loading}
                onClick={() => setSelectedPlanRange(d)}
                className={`flex-1 rounded-lg py-2.5 text-center text-[13px] font-medium transition sm:text-sm ${
                  selectedPlanRange === d
                    ? "bg-white text-brand-text shadow-sm"
                    : "text-brand-text/50 hover:text-brand-text/80"
                }`}
              >
                {d === 1 ? "1 day" : d === 3 ? "3 days" : "1 week"}
              </button>
            ))}
          </div>

          <Button
            type="button"
            variant="primary"
            className="mt-4 h-12 w-full rounded-xl text-[15px] font-semibold shadow-soft"
            onClick={onGenerateMealPlan}
            disabled={loading}
          >
            <span className="inline-flex items-center justify-center gap-2">
              <Sparkles className="size-[18px]" strokeWidth={2} />
              {loading ? "Generating…" : "Generate meal plan"}
            </span>
          </Button>

          {hasGenerated ? (
            <div className="mt-4 grid gap-2 border-t border-brand-border/70 pt-4 sm:grid-cols-2">
              <button
                type="button"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-brand-border/90 bg-white text-[14px] font-medium text-brand-text transition hover:bg-brand-bg"
                onClick={() => void exportPlan()}
              >
                <Download className="size-4" strokeWidth={2} />
                Export PDF
              </button>
              <button
                type="button"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-transparent bg-brand-bg text-[14px] font-medium text-brand-text/90 transition hover:bg-brand-border/30"
                onClick={backToGeneratorStart}
              >
                <RotateCcw className="size-4" strokeWidth={2} />
                Start over
              </button>
            </div>
          ) : null}
        </section>

        <div className="mt-5 rounded-2xl border border-brand-border/80 bg-[#EAF5EF]/90 px-3 py-3 sm:px-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-primary/90">
            Your daily targets
          </p>
          <div className="scrollbar-none mt-2 flex gap-2 overflow-x-auto pb-0.5 sm:grid sm:grid-cols-5 sm:overflow-visible">
            {[
              { label: "Cal", value: `${recommendedTargets.calories} kcal` },
              { label: "Protein", value: `${recommendedTargets.protein}g` },
              { label: "Fat", value: `${recommendedTargets.fat}g` },
              { label: "Carbs", value: `${recommendedTargets.carbs}g` },
              { label: "Fiber", value: `${recommendedTargets.fiber}g` }
            ].map((row) => (
              <div
                key={row.label}
                className="shrink-0 rounded-xl border border-brand-primary/15 bg-white/80 px-3 py-2 text-[12px] sm:text-center"
              >
                <div className="text-[10px] font-medium uppercase tracking-wide text-brand-text/45">{row.label}</div>
                <div className="mt-0.5 font-semibold text-brand-text">{row.value}</div>
              </div>
            ))}
          </div>
        </div>

        {!hasGenerated && !loading ? (
          <div className="mt-6 rounded-2xl border border-dashed border-brand-border/90 bg-white/80 p-8 text-center sm:p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-bg">
              <UtensilsCrossed className="size-7 text-brand-primary/80" strokeWidth={1.75} />
            </div>
            <h3 className="mt-4 text-lg font-semibold tracking-tight text-brand-text sm:text-xl">
              Your plan will appear here
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-brand-text/60">
              Choose a length above, then generate a full day of balanced meals tailored to your profile.
            </p>
          </div>
        ) : loading ? (
          <div className="mt-6 space-y-3">
            <div className="h-24 animate-pulse rounded-2xl bg-brand-bg" />
            <div className="h-24 animate-pulse rounded-2xl bg-white shadow-soft" />
            <div className="h-24 animate-pulse rounded-2xl bg-white shadow-soft" />
            <div className="h-24 animate-pulse rounded-2xl bg-white shadow-soft" />
          </div>
        ) : (
          <>
            <div id="plan-results" className="mt-6 space-y-5 scroll-mt-4">
              {mealPlan?.days.map((day) => {
                const slotRows: {
                  slot: DayMealSlot;
                  mealType: MealType;
                  isExtraSnack?: boolean;
                }[] = [
                  { slot: "breakfast", mealType: "breakfast" },
                  { slot: "lunch", mealType: "lunch" },
                  { slot: "dinner", mealType: "dinner" },
                  { slot: "snack", mealType: "snack" }
                ];
                if (day.extraSnack) {
                  slotRows.push({ slot: "extraSnack", mealType: "snack", isExtraSnack: true });
                }

                const dayMealsAll = slotRows
                  .map((r) => day[r.slot])
                  .filter(Boolean) as GeneratedMeal[];
                const daySummary = dayMealsAll
                  .filter((m) => !m.skipped)
                  .reduce(
                    (acc, meal) => {
                      acc.calories += meal.calories;
                      acc.protein += meal.macros.protein;
                      acc.fat += meal.macros.fat;
                      acc.carbs += meal.macros.carbs;
                      return acc;
                    },
                    { calories: 0, carbs: 0, protein: 0, fat: 0 }
                  );

                return (
                  <section
                    key={day.day}
                    className="space-y-3 rounded-2xl border border-brand-border/90 bg-white p-4 shadow-soft sm:p-5"
                  >
                    <div className="flex flex-wrap items-end justify-between gap-2 border-b border-brand-border/60 pb-3">
                      <div>
                        <h2 className="text-lg font-semibold tracking-tight text-brand-text sm:text-xl">
                          Day {day.day}
                        </h2>
                        <p className="mt-0.5 text-[11px] text-brand-text/45">Visible meals only</p>
                      </div>
                      <p className="text-sm font-semibold text-brand-primary">
                        {Math.round(daySummary.calories)} kcal
                      </p>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-center">
                      {[
                        { k: "Cal", v: Math.round(daySummary.calories) },
                        { k: "C", v: `${Math.round(daySummary.carbs)}g` },
                        { k: "P", v: `${Math.round(daySummary.protein)}g` },
                        { k: "F", v: `${Math.round(daySummary.fat)}g` }
                      ].map((cell) => (
                        <div
                          key={cell.k}
                          className="rounded-lg bg-brand-bg/80 py-2 text-[11px] sm:text-xs"
                        >
                          <div className="font-medium text-brand-text/45">{cell.k}</div>
                          <div className="mt-0.5 font-semibold text-brand-text">{cell.v}</div>
                        </div>
                      ))}
                    </div>

                    {slotRows.map(({ slot, mealType, isExtraSnack }) => {
                      const meal = day[slot];
                      if (!meal) return null;

                      if (meal.skipped) {
                        return (
                          <div
                            key={meal.id}
                            className="rounded-xl border border-dashed border-brand-border/90 bg-brand-surface/50 p-3 sm:p-4"
                          >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <span className="inline-flex rounded bg-white px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand-text/55">
                                  {meal.mealType[0].toUpperCase() + meal.mealType.slice(1)}
                                </span>
                                <p className="mt-2 text-sm text-brand-text/60">Removed from menu</p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  className="rounded-lg border border-brand-border/90 bg-white px-3 py-2 text-[13px] font-medium text-brand-text hover:bg-brand-bg"
                                  onClick={() => restoreMealToMenu(meal.id)}
                                >
                                  Restore
                                </button>
                                <button
                                  type="button"
                                  className="rounded-lg bg-brand-primary px-3 py-2 text-[13px] font-medium text-white hover:opacity-90"
                                  onClick={() =>
                                    regenerateMealSlot(day.day, slot, mealType, Boolean(isExtraSnack))
                                  }
                                >
                                  New dish
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      const imgUrl = mealImageUrlForId(meal.id);

                      return (
                        <div
                          key={meal.id}
                          className="overflow-hidden rounded-xl border border-brand-border/80 bg-white shadow-soft transition-shadow hover:shadow-md"
                        >
                          <div
                            role="button"
                            tabIndex={0}
                            className="flex cursor-pointer text-left"
                            onClick={() => setOpenedMealId(meal.id)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                setOpenedMealId(meal.id);
                              }
                            }}
                          >
                            <div className="relative h-[100px] w-[88px] shrink-0 sm:h-[108px] sm:w-[100px]">
                              <img
                                src={imgUrl}
                                alt=""
                                className="h-full w-full object-cover"
                                loading="lazy"
                              />
                            </div>
                            <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 px-3 py-2.5">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="inline-flex rounded-md bg-[#FFF4E8] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-accent">
                                  {meal.mealType[0].toUpperCase() + meal.mealType.slice(1)}
                                </span>
                                {meal.isVegan ? (
                                  <span className="inline-flex rounded-md bg-[#EAF5EF] px-2 py-0.5 text-[10px] font-semibold text-brand-primary">
                                    Vegan
                                  </span>
                                ) : meal.isVegetarian ? (
                                  <span className="inline-flex rounded-md bg-[#EEF2FF] px-2 py-0.5 text-[10px] font-semibold text-[#4F46E5]">
                                    Vegetarian
                                  </span>
                                ) : null}
                              </div>
                              <h3 className="text-[15px] font-semibold leading-snug tracking-tight text-brand-text sm:text-base">
                                {meal.name}
                              </h3>
                              <div className="scrollbar-none flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-brand-text/55"> 
                                <span>{Math.round(meal.calories)} kcal</span>
                                <span>·</span>
                                <span>GI {meal.glycemicIndex}</span>
                                <span>·</span>
                                <span>Score {meal.diabeticScore}/10</span>
                              </div>
                              <p className="text-[11px] text-brand-primary/60">Tap for recipe</p>
                            </div>
                            <div className="flex shrink-0 items-center pr-2 text-brand-text/35">
                              <ChevronRight className="size-5" strokeWidth={2} />
                            </div>
                          </div>
                          <div className="flex items-center justify-end gap-1 border-t border-brand-border/70 bg-brand-bg/40 px-2 py-1.5">
                            <button
                              type="button"
                              title="Regenerate dish"
                              aria-label="Regenerate dish"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-brand-text/70 transition hover:bg-white hover:text-brand-text"
                              onClick={(e) => {
                                e.stopPropagation();
                                regenerateMealSlot(day.day, slot, mealType, Boolean(isExtraSnack));
                              }}
                            >
                              <RefreshCw className="size-4" strokeWidth={2} />
                            </button>
                            <button
                              type="button"
                              title="Remove from menu"
                              aria-label="Remove from menu"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-600/80 transition hover:bg-red-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeMealFromMenu(meal.id);
                              }}
                            >
                              <Trash2 className="size-4" strokeWidth={2} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </section>
                );
              })}
            </div>
          </>
        )}
      </main>

      {openedMealId ? (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-4 animate-[fadeIn_180ms_ease-out]"
          onClick={() => setOpenedMealId(null)}
        >
          <div
            className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-2xl border border-brand-border/90 bg-white shadow-2xl animate-[modalIn_220ms_cubic-bezier(0.16,1,0.3,1)] sm:rounded-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {(() => {
              const meal = getMealById(openedMealId);
              if (!meal) return null;
              const modalImg = mealImageUrlForId(meal.id);

              return (
                <>
                  <div className="relative h-40 w-full shrink-0 overflow-hidden sm:h-40">
                    <img src={modalImg} alt="" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <button
                      type="button"
                      aria-label="Close recipe"
                      className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-brand-text shadow"
                      onClick={() => setOpenedMealId(null)}
                    >
                      <X className="size-5" strokeWidth={2} />
                    </button>
                  </div>

                  <div className="p-4 sm:p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex rounded-md bg-[#FFF4E8] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand-accent">
                        {meal.mealType[0].toUpperCase() + meal.mealType.slice(1)}
                      </span>
                      {meal.isVegan ? (
                        <span className="inline-flex rounded-md bg-[#EAF5EF] px-2 py-0.5 text-[11px] font-semibold text-brand-primary">
                          Vegan
                        </span>
                      ) : meal.isVegetarian ? (
                        <span className="inline-flex rounded-md bg-[#EEF2FF] px-2 py-0.5 text-[11px] font-semibold text-[#4F46E5]">
                          Vegetarian
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-2 text-xl font-semibold leading-snug tracking-tight text-brand-text sm:text-2xl">
                      {meal.name}
                    </h3>

                  <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                    <div className="rounded-lg border border-brand-border bg-[#FAFAF8] px-3 py-2"><div className="text-[12px] text-brand-text/60">Calories</div><div className="font-medium">{Math.round(meal.calories)}</div></div>
                    <div className="rounded-lg border border-brand-border bg-[#FAFAF8] px-3 py-2"><div className="text-[12px] text-brand-text/60">Carbs</div><div className="font-medium">{Math.round(meal.macros.carbs)}g</div></div>
                    <div className="rounded-lg border border-brand-border bg-[#FAFAF8] px-3 py-2"><div className="text-[12px] text-brand-text/60">Protein</div><div className="font-medium">{Math.round(meal.macros.protein)}g</div></div>
                    <div className="rounded-lg border border-brand-border bg-[#FAFAF8] px-3 py-2"><div className="text-[12px] text-brand-text/60">Fat</div><div className="font-medium">{Math.round(meal.macros.fat)}g</div></div>
                    <div className="rounded-lg border border-brand-border bg-[#FAFAF8] px-3 py-2"><div className="text-[12px] text-brand-text/60">Fiber</div><div className="font-medium">{Math.round(meal.fiber)}g</div></div>
                    <div className="rounded-lg border border-brand-border bg-[#FAFAF8] px-3 py-2"><div className="text-[12px] text-brand-text/60">GI</div><div className="font-medium">{meal.glycemicIndex}</div></div>
                    <div className="rounded-lg border border-[#CDE7D7] bg-[#EAF5EF] px-3 py-2"><div className="text-[12px] text-brand-text/60">Diabetes Score</div><div className="font-medium text-brand-primary">{meal.diabeticScore}/10</div></div>
                  </div>

                  {mealPlan && !meal.skipped
                    ? (() => {
                        const meta = findMealSlotMeta(mealPlan, meal.id);
                        if (!meta) return null;
                        return (
                          <div className="mt-4 flex flex-wrap gap-2 border-t border-brand-border/80 pt-4">
                            <button
                              type="button"
                              className="inline-flex items-center gap-2 rounded-xl border border-brand-border/90 bg-white px-4 py-2.5 text-[13px] font-medium text-brand-text hover:bg-brand-bg"
                              onClick={() =>
                                regenerateMealSlot(
                                  meta.dayNumber,
                                  meta.slot,
                                  meta.mealType,
                                  meta.isExtraSnack
                                )
                              }
                            >
                              <RefreshCw className="size-4 shrink-0" strokeWidth={2} />
                              Regenerate
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50/80 px-4 py-2.5 text-[13px] font-medium text-red-700 hover:bg-red-100"
                              onClick={() => removeMealFromMenu(meal.id)}
                            >
                              <Trash2 className="size-4 shrink-0" strokeWidth={2} />
                              Remove
                            </button>
                          </div>
                        );
                      })()
                    : null}

                  <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <section className="rounded-xl border border-brand-border bg-[#FCFCFB] p-4">
                      <h4 className="text-[15px] font-semibold text-brand-text">Ingredients</h4>
                      <ul className="mt-2 space-y-2 list-disc pl-5 text-[14px] leading-[1.6] text-brand-text/80">
                        {meal.ingredients.map((ing, ingredientIndex) => {
                          const substituteOptions = getSubstituteOptions(ing.name);
                          const healthFact = getHealthFact(ing.name);
                          const isRemoved = getIngredientRemoved(meal.id, ingredientIndex);
                          const pickerOpen =
                            activeIngredientPicker?.mealId === meal.id &&
                            activeIngredientPicker.ingredientIndex === ingredientIndex;

                          return (
                            <li key={`${meal.id}-${ingredientIndex}-${ing.name}`}>
                              <div className="inline-flex items-center gap-2">
                                {healthFact ? (
                                  <span className="inline-flex items-center rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800">
                                    Fact
                                  </span>
                                ) : null}
                                <span className={`group relative ${isRemoved ? "line-through opacity-50" : ""}`}>
                                  {substituteOptions.length > 0 ? (
                                    <button
                                      type="button"
                                      className="text-brand-primary underline underline-offset-2 hover:text-brand-primary/80"
                                      onClick={() =>
                                        setActiveIngredientPicker((previous) =>
                                          previous?.mealId === meal.id && previous.ingredientIndex === ingredientIndex
                                            ? null
                                            : { mealId: meal.id, ingredientIndex }
                                        )
                                      }
                                    >
                                      {ing.name}
                                    </button>
                                  ) : (
                                    ing.name
                                  )}
                                  {healthFact ? (
                                    <span className="pointer-events-none absolute left-0 top-full z-20 mt-1 hidden w-64 rounded-md border border-brand-border bg-white p-2 text-[12px] leading-[1.4] text-brand-text shadow-md group-hover:block">
                                      {healthFact}
                                    </span>
                                  ) : null}
                                </span>

                                {pickerOpen ? (
                                  <select
                                    value=""
                                    className="h-8 rounded border border-brand-border bg-white px-2 text-[12px] text-brand-text"
                                    onChange={(event) => {
                                      if (!event.target.value) return;
                                      onIngredientReplace(meal.id, ingredientIndex, event.target.value);
                                    }}
                                  >
                                    <option value="">Replace with...</option>
                                    {substituteOptions.map((option) => (
                                      <option key={`${ing.name}-${option}`} value={option}>
                                        {option}
                                      </option>
                                    ))}
                                  </select>
                                ) : null}
                                <button
                                  type="button"
                                  aria-label={isRemoved ? "Restore ingredient" : "Remove ingredient"}
                                  className={`inline-flex h-6 w-6 items-center justify-center rounded border border-brand-border text-sm leading-none hover:bg-brand-bg ${
                                    isRemoved ? "text-brand-text/40" : "text-brand-text/70"
                                  }`}
                                  onClick={() => toggleIngredientRemoved(meal.id, ingredientIndex)}
                                >
                                  {isRemoved ? "↺" : "×"}
                                </button>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                      <div className="mt-3 text-[12px] text-brand-text/60">
                        Active ingredients: {getVisibleIngredients(meal).length}/{meal.ingredients.length}
                      </div>
                    </section>

                    <section className="rounded-xl border border-brand-border bg-[#FCFCFB] p-4">
                      <h4 className="text-[15px] font-semibold text-brand-text">Instructions</h4>
                      <ol className="mt-2 space-y-2 list-decimal pl-5 text-[14px] leading-[1.6] text-brand-text/80">
                        {meal.instructions.slice(0, 8).map((step, stepIdx) => (
                          <li key={`${meal.id}-${stepIdx}`}>{step}</li>
                        ))}
                      </ol>
                    </section>
                  </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      ) : null}

      {toastMessage ? (
        <div className="fixed bottom-5 left-1/2 z-50 max-w-[min(100vw-2rem,20rem)] -translate-x-1/2 rounded-xl border border-brand-border/90 bg-white px-4 py-2.5 text-center text-[13px] font-medium text-brand-text shadow-soft sm:bottom-6">
          {toastMessage}
        </div>
      ) : null}

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
