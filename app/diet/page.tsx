"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";

function TopTabs() {
  return (
    <div className="inline-flex items-end">
      <Link
        href="/generator"
        className="rounded-t-xl border border-brand-border border-b-brand-border bg-brand-bg/40 px-5 py-2.5 text-sm font-medium text-brand-text/70 transition hover:bg-white hover:text-brand-text"
      >
        Generator
      </Link>
      <Link
        href="/recipes"
        className="rounded-t-xl border border-brand-border border-b-brand-border bg-brand-bg/40 px-5 py-2.5 text-sm font-medium text-brand-text/70 transition hover:bg-white hover:text-brand-text"
      >
        Recipes
      </Link>
      <span className="relative -mb-px rounded-t-xl border border-brand-border bg-white px-5 py-2.5 text-sm font-semibold text-brand-text">
        Diet
      </span>
      <Link
        href="/custom-plate"
        className="rounded-t-xl border border-brand-border border-b-brand-border bg-brand-bg/40 px-5 py-2.5 text-sm font-medium text-brand-text/70 transition hover:bg-white hover:text-brand-text"
      >
        Custom plate
      </Link>
    </div>
  );
}

const principles = [
  {
    icon: (
      <svg viewBox="0 0 40 40" className="size-9 shrink-0" fill="none">
        <circle cx="20" cy="20" r="20" fill="#EAF5EF" />
        <rect x="13" y="17" width="14" height="6" rx="3" fill="#2D7A51" opacity=".2" />
        <path d="M12 20h16M20 12v16" stroke="#2D7A51" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Control carbohydrates",
    body: "Aim for 45–60 g of carbs per meal. Spread intake evenly across the day to prevent blood-sugar spikes.",
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" className="size-9 shrink-0" fill="none">
        <circle cx="20" cy="20" r="20" fill="#FFF4E8" />
        <path d="M14 28c0-6 12-6 12-12" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="20" cy="13" r="3" fill="#D97706" opacity=".8" />
      </svg>
    ),
    title: "Prioritise fibre",
    body: "Target 25–35 g of fibre daily. Fibre slows glucose absorption and reduces post-meal peaks.",
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" className="size-9 shrink-0" fill="none">
        <circle cx="20" cy="20" r="20" fill="#EEF2FF" />
        <path d="M15 28V18a5 5 0 0 1 10 0v10" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M13 28h14" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Eat lean protein",
    body: "Protein does not raise blood sugar and aids satiety. Choose chicken, fish, eggs, tofu, or legumes at every meal.",
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" className="size-9 shrink-0" fill="none">
        <circle cx="20" cy="20" r="20" fill="#FDF2F8" />
        <path d="M20 13c-4.5 4-7 8-4 11s8 1 8-3-3-8 0-11" stroke="#DB2777" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="20" cy="26" rx="4" ry="2.5" fill="#DB2777" opacity=".2" />
      </svg>
    ),
    title: "Choose healthy fats",
    body: "Olive oil, avocado, nuts, and fatty fish reduce cardiovascular risk and slow digestion.",
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" className="size-9 shrink-0" fill="none">
        <circle cx="20" cy="20" r="20" fill="#FEF9C3" />
        <circle cx="20" cy="20" r="7" stroke="#CA8A04" strokeWidth="2.5" />
        <path d="M20 14v6l4 2" stroke="#CA8A04" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Eat on a regular schedule",
    body: "Three balanced meals a day keep glucose stable. Skipping meals leads to overeating and sharp glucose swings.",
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" className="size-9 shrink-0" fill="none">
        <circle cx="20" cy="20" r="20" fill="#FEF2F2" />
        <path d="M14 20h12M14 16h12M14 24h8" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
        <line x1="25" y1="22" x2="28" y2="26" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
        <line x1="28" y1="22" x2="25" y2="26" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Limit sugar & refined carbs",
    body: "Sugary drinks, white bread, pastries, and white rice cause rapid blood-sugar spikes. Swap for whole-grain alternatives.",
  },
];

const foodGroups = [
  {
    color: "bg-[#EAF5EF] border-[#CDE7D7]",
    label: "Eat freely",
    labelColor: "text-[#2D7A51]",
    dot: "bg-[#2D7A51]",
    items: [
      "Non-starchy vegetables — broccoli, spinach, cauliflower, zucchini, peppers",
      "Leafy greens — arugula, kale, lettuce",
      "Mushrooms & cucumbers",
      "Herbs & spices",
      "Water, unsweetened tea & coffee",
    ],
  },
  {
    color: "bg-[#FFF8EC] border-[#FDDFA0]",
    label: "In moderation",
    labelColor: "text-[#B45309]",
    dot: "bg-[#D97706]",
    items: [
      "Whole grains — oats, quinoa, brown rice, buckwheat",
      "Legumes — lentils, chickpeas, black beans",
      "Lean protein — chicken, fish, eggs, tofu",
      "Low-fat dairy — Greek yogurt, cottage cheese",
      "Low-GI fruits — apple, pear, grapefruit, berries",
      "Healthy fats — avocado, olive oil, nuts (small portions)",
    ],
  },
  {
    color: "bg-[#FEF2F2] border-[#FECACA]",
    label: "Limit or avoid",
    labelColor: "text-[#DC2626]",
    dot: "bg-[#DC2626]",
    items: [
      "Sugary drinks — soda, juice, energy drinks",
      "White bread, white rice, regular pasta",
      "Pastries, cakes, cookies, candy",
      "Processed meats & fried foods",
      "Alcohol",
      "High-GI fruits in large amounts — watermelon, dates, ripe banana",
    ],
  },
];

const giFoods = [
  { label: "Lentils", gi: 32, color: "#2D7A51" },
  { label: "Greek yogurt", gi: 35, color: "#2D7A51" },
  { label: "Apple", gi: 38, color: "#2D7A51" },
  { label: "Buckwheat", gi: 45, color: "#2D7A51" },
  { label: "Brown rice", gi: 55, color: "#2D7A51" },
  { label: "Oatmeal", gi: 57, color: "#D97706" },
  { label: "Whole wheat bread", gi: 68, color: "#D97706" },
  { label: "White rice", gi: 72, color: "#DC2626" },
  { label: "White bread", gi: 75, color: "#DC2626" },
  { label: "Cornflakes", gi: 81, color: "#DC2626" },
];

export default function DietPage() {
  const router = useRouter();

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
        <h1 className="text-3xl font-semibold text-brand-text">Diet Guide</h1>
        <p className="mt-1 text-sm text-brand-text/65">
          Core nutrition principles for managing Type 2 Diabetes through food.
        </p>
        <div className="mt-5">
          <TopTabs />
        </div>
        <div className="h-px w-full bg-brand-border" />

        <div className="mt-8 space-y-8">

          {/* Plate Method */}
          <section className="rounded-2xl border border-brand-border bg-white p-6 shadow-soft sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-text/45">The foundation</p>
            <h2 className="mt-1 text-xl font-semibold text-brand-text">The Diabetes Plate Method</h2>
            <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-brand-text/65">
              Fill your plate in this proportion at every main meal — it naturally controls carbs without counting.
            </p>

            <div className="mt-6 flex flex-col items-center gap-8 sm:flex-row sm:items-start">
              <svg viewBox="0 0 220 220" className="size-48 shrink-0 sm:size-52" aria-hidden="true">
                <ellipse cx="110" cy="215" rx="90" ry="6" fill="#00000010" />
                <circle cx="110" cy="110" r="104" fill="white" stroke="#E5E7EB" strokeWidth="2" />
                <path d="M110 110 L110 10 A100 100 0 0 1 110 210 Z" fill="#2D7A51" opacity=".85" />
                <path d="M110 110 L110 210 A100 100 0 0 1 10 110 Z" fill="#F97316" opacity=".8" />
                <path d="M110 110 L10 110 A100 100 0 0 1 110 10 Z" fill="#FBBF24" opacity=".85" />
                <line x1="110" y1="10" x2="110" y2="210" stroke="white" strokeWidth="3" />
                <line x1="10" y1="110" x2="110" y2="110" stroke="white" strokeWidth="2" />
                <circle cx="110" cy="110" r="26" fill="white" />
                <text x="110" y="118" textAnchor="middle" fontSize="20" fill="#9CA3AF">🍽</text>
                <text x="173" y="106" textAnchor="middle" fontSize="11" fontWeight="700" fill="white">Vegetables</text>
                <text x="173" y="119" textAnchor="middle" fontSize="10" fill="white" opacity=".9">50%</text>
                <text x="60" y="155" textAnchor="middle" fontSize="10" fontWeight="700" fill="white">Protein</text>
                <text x="60" y="167" textAnchor="middle" fontSize="10" fill="white" opacity=".9">25%</text>
                <text x="57" y="63" textAnchor="middle" fontSize="10" fontWeight="700" fill="white" opacity=".95">Carbs</text>
                <text x="57" y="75" textAnchor="middle" fontSize="10" fill="white" opacity=".85">25%</text>
              </svg>

              <div className="flex flex-col gap-4">
                {[
                  { color: "bg-[#2D7A51]", title: "½ plate — Non-starchy vegetables", desc: "Broccoli, spinach, zucchini, peppers, cauliflower. High in fibre, low in carbs." },
                  { color: "bg-[#F97316]", title: "¼ plate — Lean protein", desc: "Chicken, fish, eggs, tofu, legumes. Keeps you full and does not spike blood sugar." },
                  { color: "bg-[#FBBF24]", title: "¼ plate — Quality carbs", desc: "Brown rice, buckwheat, quinoa, sweet potato, whole-grain bread. Choose low-GI options." },
                ].map((row) => (
                  <div key={row.title} className="flex gap-3">
                    <div className={`mt-0.5 h-4 w-4 shrink-0 rounded ${row.color}`} />
                    <div>
                      <p className="text-sm font-semibold text-brand-text">{row.title}</p>
                      <p className="mt-0.5 text-[13px] leading-relaxed text-brand-text/60">{row.desc}</p>
                    </div>
                  </div>
                ))}
                <p className="rounded-xl border border-brand-border bg-brand-bg/60 px-3 py-2 text-[13px] text-brand-text/65">
                  Add a glass of water and optionally a small portion of low-fat dairy or a piece of low-GI fruit.
                </p>
              </div>
            </div>
          </section>

          {/* 6 Principles */}
          <section>
            <h2 className="text-xl font-semibold text-brand-text">6 core principles</h2>
            <p className="mt-1 text-sm text-brand-text/65">Apply these every day for stable blood glucose.</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {principles.map((p) => (
                <div key={p.title} className="flex gap-3 rounded-2xl border border-brand-border bg-white p-4 shadow-soft">
                  {p.icon}
                  <div>
                    <p className="text-sm font-semibold text-brand-text">{p.title}</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-brand-text/65">{p.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* GI + GL */}
          <section className="rounded-2xl border border-brand-border bg-white p-6 shadow-soft sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-text/45">Key metrics used in this app</p>
            <h2 className="mt-1 text-xl font-semibold text-brand-text">Glycemic Index & Glycemic Load</h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {/* GI */}
              <div className="rounded-xl border border-brand-border bg-brand-bg/40 p-4">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800">GI</span>
                  <p className="font-semibold text-brand-text">Glycemic Index</p>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-brand-text/65">
                  Measures how quickly a <strong>single food</strong> raises blood glucose on a scale of 0–100.
                  Useful for comparing individual ingredients, but does not account for portion size.
                </p>
                <div className="mt-3">
                  <div className="relative h-3.5 w-full overflow-hidden rounded-full" style={{ background: "linear-gradient(to right, #16a34a, #84cc16, #facc15, #f97316, #dc2626)" }}>
                    <div className="absolute inset-y-0 left-[55%] w-px bg-white/60" />
                    <div className="absolute inset-y-0 left-[69%] w-px bg-white/60" />
                  </div>
                  <div className="mt-1.5 flex gap-3 text-[11px] text-brand-text/60">
                    <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-sm bg-[#16a34a]" />≤55 Low</span>
                    <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-sm bg-[#D97706]" />56–69 Medium</span>
                    <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-sm bg-[#DC2626]" />≥70 High</span>
                  </div>
                </div>
              </div>

              {/* GL */}
              <div className="rounded-xl border border-[#CDE7D7] bg-[#EAF5EF] p-4">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-brand-primary px-2 py-0.5 text-[11px] font-bold text-white">GL</span>
                  <p className="font-semibold text-brand-text">Glycemic Load</p>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-brand-text/65">
                  The clinically superior metric. GL = GI × carbs (g) ÷ 100.
                  It accounts for both the <strong>quality and quantity</strong> of carbs in a meal.
                  Watermelon has a high GI (72) but low GL (4) — a small portion barely affects blood sugar.
                </p>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[12px]">
                  {[
                    { label: "Low", range: "≤ 10", bg: "bg-[#EAF5EF] border-[#CDE7D7]", text: "text-[#2D7A51]" },
                    { label: "Medium", range: "11–19", bg: "bg-amber-50 border-amber-200", text: "text-amber-700" },
                    { label: "High", range: "≥ 20", bg: "bg-red-50 border-red-200", text: "text-red-700" },
                  ].map((item) => (
                    <div key={item.label} className={`rounded-lg border px-2 py-2 ${item.bg}`}>
                      <div className={`font-bold ${item.text}`}>{item.label}</div>
                      <div className="text-brand-text/60">{item.range}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-text/45">GI of common foods</p>
              {giFoods.map((food) => (
                <div key={food.label} className="flex items-center gap-3">
                  <span className="w-36 shrink-0 text-[13px] text-brand-text/75">{food.label}</span>
                  <div className="relative h-5 flex-1 overflow-hidden rounded-md bg-brand-bg">
                    <div className="h-full rounded-md" style={{ width: `${food.gi}%`, backgroundColor: food.color, opacity: 0.8 }} />
                    <span className="absolute inset-y-0 left-2 flex items-center text-[11px] font-semibold text-white drop-shadow-sm">{food.gi}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-brand-border bg-brand-bg/60 px-4 py-3 text-[13px] leading-relaxed text-brand-text/70">
              <strong className="text-brand-text">How JustThreeCrumbs uses these:</strong> Every generated meal shows both GI (quality of carbs) and GL (actual impact on blood sugar). GL is the primary indicator — a meal with GL ≤ 10 is considered low-impact regardless of the GI of individual ingredients.
            </div>
          </section>

          {/* Food groups */}
          <section>
            <h2 className="text-xl font-semibold text-brand-text">What to put on your plate</h2>
            <p className="mt-1 text-sm text-brand-text/65">A practical reference for everyday grocery shopping and meal planning.</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {foodGroups.map((group) => (
                <div key={group.label} className={`rounded-2xl border p-5 ${group.color}`}>
                  <div className="flex items-center gap-2">
                    <span className={`inline-block h-2.5 w-2.5 rounded-full ${group.dot}`} />
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${group.labelColor}`}>{group.label}</span>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {group.items.map((item) => (
                      <li key={item} className="flex gap-2 text-[13px] leading-snug text-brand-text/80">
                        <span className="mt-px shrink-0 text-[10px] opacity-50">▸</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Daily targets */}
          <section className="rounded-2xl border border-brand-border bg-white p-6 shadow-soft sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-text/45">Daily targets</p>
            <h2 className="mt-1 text-xl font-semibold text-brand-text">Your macros at a glance</h2>
            <p className="mt-1.5 text-sm text-brand-text/65">Approximate values for an average adult managing Type 2 Diabetes. Adjust with your doctor.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Carbohydrates", value: "130–180 g", sub: "45–50% of calories", bar: 48, color: "#FBBF24" },
                { label: "Protein", value: "60–90 g", sub: "20–25% of calories", bar: 22, color: "#F97316" },
                { label: "Fat", value: "50–70 g", sub: "25–30% of calories", bar: 27, color: "#4F46E5" },
                { label: "Fibre", value: "25–35 g", sub: "Minimum daily target", bar: 30, color: "#2D7A51" },
              ].map((m) => (
                <div key={m.label} className="rounded-xl border border-brand-border bg-brand-bg/40 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-text/50">{m.label}</p>
                  <p className="mt-1 text-2xl font-bold text-brand-text">{m.value}</p>
                  <p className="text-[12px] text-brand-text/55">{m.sub}</p>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-brand-border/50">
                    <div className="h-full rounded-full" style={{ width: `${m.bar}%`, backgroundColor: m.color }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-2xl border border-brand-primary/25 bg-[#EAF5EF] p-8 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-primary/70">Ready to eat well?</p>
            <h2 className="mt-2 text-xl font-semibold text-brand-text">Generate your personalised meal plan</h2>
            <p className="mx-auto mt-1.5 max-w-md text-sm text-brand-text/65">
              Every plan in JustThreeCrumbs is built around these principles — low GI, balanced macros, and diabetes-safe ingredients.
            </p>
            <Link
              href="/generator"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-primary px-6 py-3 text-[14px] font-semibold text-white shadow-soft transition hover:opacity-90"
            >
              Go to Generator →
            </Link>
          </section>

        </div>
      </main>
    </div>
  );
}
