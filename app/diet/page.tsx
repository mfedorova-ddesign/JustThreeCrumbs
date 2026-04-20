import Link from "next/link";

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
    </div>
  );
}

const principles = [
  {
    icon: (
      <svg viewBox="0 0 40 40" className="size-10" fill="none">
        <circle cx="20" cy="20" r="20" fill="#EAF5EF" />
        <path d="M12 20h16M20 12v16" stroke="#2D7A51" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="13" y="17" width="14" height="6" rx="3" fill="#2D7A51" opacity=".15" />
      </svg>
    ),
    title: "Control carbohydrates",
    body: "Aim for 45–60 g of carbs per meal. Spread intake evenly across the day to prevent blood-sugar spikes. Count total carbs, not just sugar.",
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" className="size-10" fill="none">
        <circle cx="20" cy="20" r="20" fill="#FFF4E8" />
        <path d="M14 28c0-6 12-6 12-12" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="20" cy="13" r="3" fill="#D97706" opacity=".8" />
      </svg>
    ),
    title: "Prioritise fibre",
    body: "Target 25–35 g of fibre daily. Fibre slows glucose absorption, reduces post-meal peaks, and improves insulin sensitivity over time.",
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" className="size-10" fill="none">
        <circle cx="20" cy="20" r="20" fill="#EEF2FF" />
        <path d="M15 28V18a5 5 0 0 1 10 0v10" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M13 28h14" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Eat lean protein",
    body: "Protein does not raise blood sugar and aids satiety. Choose chicken breast, fish, eggs, tofu, legumes, and low-fat dairy at every meal.",
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" className="size-10" fill="none">
        <circle cx="20" cy="20" r="20" fill="#FDF2F8" />
        <path d="M20 13c-4.5 4-7 8-4 11s8 1 8-3-3-8 0-11" stroke="#DB2777" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="20" cy="26" rx="4" ry="2.5" fill="#DB2777" opacity=".2" />
      </svg>
    ),
    title: "Choose healthy fats",
    body: "Unsaturated fats (olive oil, avocado, nuts, fatty fish) slow digestion and reduce cardiovascular risk. Limit saturated and trans fats.",
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" className="size-10" fill="none">
        <circle cx="20" cy="20" r="20" fill="#FEF9C3" />
        <circle cx="20" cy="20" r="7" stroke="#CA8A04" strokeWidth="2.5" />
        <path d="M20 14v6l4 2" stroke="#CA8A04" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Eat on a regular schedule",
    body: "Three balanced meals a day (and optional small snacks) keep glucose levels stable. Skipping meals leads to overeating and sharp glucose swings.",
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" className="size-10" fill="none">
        <circle cx="20" cy="20" r="20" fill="#FEF2F2" />
        <path d="M14 20h12M14 16h12M14 24h8" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
        <circle cx="26" cy="24" r="3" fill="#DC2626" opacity=".7" />
        <path d="M24.8 22.8l2.4 2.4M27.2 22.8l-2.4 2.4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Limit sugar & refined carbs",
    body: "Sugar-sweetened drinks, white bread, pastries, and white rice cause rapid blood-sugar spikes. Replace with whole-grain alternatives.",
  },
];

const foodGroups = [
  {
    color: "bg-[#EAF5EF] border-[#CDE7D7]",
    label: "Eat freely",
    labelColor: "text-[#2D7A51]",
    dot: "bg-[#2D7A51]",
    items: [
      "Non-starchy vegetables (broccoli, spinach, cauliflower, zucchini, peppers)",
      "Leafy greens (arugula, kale, lettuce)",
      "Mushrooms & cucumbers",
      "Herbs & spices",
      "Water, unsweetened tea & coffee",
    ],
  },
  {
    color: "bg-[#FFF8EC] border-[#FDDFA0]",
    label: "Eat in moderation",
    labelColor: "text-[#B45309]",
    dot: "bg-[#D97706]",
    items: [
      "Whole grains (oats, quinoa, brown rice, buckwheat)",
      "Legumes (lentils, chickpeas, black beans)",
      "Lean protein (chicken breast, fish, eggs, tofu)",
      "Low-fat dairy (Greek yogurt, cottage cheese)",
      "Berries & low-GI fruits (apple, pear, grapefruit)",
      "Healthy fats (avocado, olive oil, nuts — small portions)",
    ],
  },
  {
    color: "bg-[#FEF2F2] border-[#FECACA]",
    label: "Limit or avoid",
    labelColor: "text-[#DC2626]",
    dot: "bg-[#DC2626]",
    items: [
      "Sugary drinks (soda, juice, energy drinks)",
      "White bread, white rice, regular pasta",
      "Pastries, cakes, cookies, candy",
      "Processed meats & full-fat fried foods",
      "Alcohol (raises then crashes glucose)",
      "High-GI fruits (watermelon, dates, ripe banana in large amounts)",
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
  return (
    <div className="min-h-screen bg-brand-bg">
      <header className="w-full border-b border-brand-border/90 bg-white">
        <div className="mx-auto flex w-full max-w-[960px] items-center justify-between px-4 py-4 md:px-8">
          <Link href="/generator" className="text-[14px] text-brand-text/70 hover:text-brand-text">
            ← Back
          </Link>
          <img src="/images/logo-full.png" alt="JustThreeCrumbs" className="h-8 w-auto" />
          <div className="h-6 w-16" />
        </div>
      </header>

      <main className="mx-auto w-full max-w-[960px] px-4 py-8 md:px-8">
        {/* Tabs */}
        <div>
          <TopTabs />
          <div className="h-px w-full bg-brand-border" />
        </div>

        {/* Hero */}
        <section className="mt-10 text-center">
          <span className="inline-block rounded-full border border-brand-primary/30 bg-[#EAF5EF] px-4 py-1 text-[13px] font-semibold text-brand-primary">
            Type 2 Diabetes Nutrition Guide
          </span>
          <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-brand-text sm:text-4xl">
            Eating well with<br />Type 2 Diabetes
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-brand-text/65">
            Managing blood sugar through diet is one of the most powerful tools available.
            Here are the core principles that guide every meal in JustThreeCrumbs.
          </p>
        </section>

        {/* Plate Method */}
        <section className="mt-12">
          <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-soft sm:p-8">
            <p className="text-center text-[11px] font-semibold uppercase tracking-wider text-brand-text/45">
              The foundation
            </p>
            <h2 className="mt-1 text-center text-xl font-bold text-brand-text">The Diabetes Plate Method</h2>
            <p className="mx-auto mt-2 max-w-lg text-center text-sm text-brand-text/60">
              Fill your plate in this proportion at every main meal — it naturally controls carbs without counting.
            </p>

            <div className="mt-8 flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:justify-center">
              {/* SVG Plate */}
              <div className="shrink-0">
                <svg viewBox="0 0 220 220" className="size-52 sm:size-60" aria-hidden="true">
                  {/* Plate shadow */}
                  <ellipse cx="110" cy="215" rx="90" ry="7" fill="#00000010" />
                  {/* Plate rim */}
                  <circle cx="110" cy="110" r="104" fill="white" stroke="#E5E7EB" strokeWidth="2" />
                  {/* 50% vegetables — top half */}
                  <path d="M110 110 L110 10 A100 100 0 0 1 110 210 Z" fill="#2D7A51" opacity=".85" />
                  {/* 25% protein — bottom-left quarter */}
                  <path d="M110 110 L110 210 A100 100 0 0 1 10 110 Z" fill="#F97316" opacity=".8" />
                  {/* 25% carbs — bottom-right quarter */}
                  <path d="M110 110 L10 110 A100 100 0 0 1 110 10 Z" fill="#FBBF24" opacity=".85" />
                  {/* Divider lines */}
                  <line x1="110" y1="10" x2="110" y2="210" stroke="white" strokeWidth="3" />
                  <line x1="10" y1="110" x2="210" y2="110" stroke="white" strokeWidth="2" />
                  {/* Center plate circle */}
                  <circle cx="110" cy="110" r="28" fill="white" />
                  {/* Fork & knife icon in center */}
                  <text x="110" y="118" textAnchor="middle" fontSize="22" fill="#9CA3AF">🍽</text>
                  {/* Labels */}
                  <text x="110" y="68" textAnchor="middle" fontSize="11" fontWeight="700" fill="white">Vegetables</text>
                  <text x="110" y="80" textAnchor="middle" fontSize="10" fill="white" opacity=".9">50%</text>
                  <text x="60" y="155" textAnchor="middle" fontSize="10" fontWeight="700" fill="white">Protein</text>
                  <text x="60" y="167" textAnchor="middle" fontSize="10" fill="white" opacity=".9">25%</text>
                  <text x="160" y="68" textAnchor="middle" fontSize="10" fontWeight="700" fill="white" opacity=".95">Carbs</text>
                  <text x="160" y="80" textAnchor="middle" fontSize="10" fill="white" opacity=".85">25%</text>
                </svg>
              </div>

              {/* Legend */}
              <div className="flex max-w-xs flex-col gap-4">
                <div className="flex gap-3">
                  <div className="mt-0.5 h-5 w-5 shrink-0 rounded-md bg-[#2D7A51]" />
                  <div>
                    <p className="font-semibold text-brand-text">½ plate — Non-starchy vegetables</p>
                    <p className="mt-0.5 text-sm text-brand-text/60">Broccoli, spinach, zucchini, peppers, cauliflower, salad greens. High in fibre, low in carbs.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="mt-0.5 h-5 w-5 shrink-0 rounded-md bg-[#F97316]" />
                  <div>
                    <p className="font-semibold text-brand-text">¼ plate — Lean protein</p>
                    <p className="mt-0.5 text-sm text-brand-text/60">Chicken, fish, eggs, tofu, legumes. Keeps you full and doesn't spike blood sugar.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="mt-0.5 h-5 w-5 shrink-0 rounded-md bg-[#FBBF24]" />
                  <div>
                    <p className="font-semibold text-brand-text">¼ plate — Quality carbs</p>
                    <p className="mt-0.5 text-sm text-brand-text/60">Brown rice, buckwheat, quinoa, sweet potato, whole-grain bread. Choose low-GI options.</p>
                  </div>
                </div>
                <div className="mt-1 rounded-xl border border-brand-border bg-brand-bg/60 px-3 py-2 text-[13px] text-brand-text/70">
                  Add a glass of water and optionally a small portion of low-fat dairy or a piece of fruit.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6 Principles */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-brand-text">6 core principles</h2>
          <p className="mt-1 text-sm text-brand-text/60">Apply these every day for stable blood glucose.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {principles.map((p) => (
              <div key={p.title} className="flex gap-4 rounded-2xl border border-brand-border bg-white p-5 shadow-soft">
                {p.icon}
                <div>
                  <p className="font-semibold leading-snug text-brand-text">{p.title}</p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-brand-text/65">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Glycemic Index */}
        <section className="mt-10">
          <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-soft sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-text/45">Key concept</p>
            <h2 className="mt-1 text-xl font-bold text-brand-text">Glycemic Index (GI)</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-brand-text/65">
              GI measures how quickly a food raises blood glucose on a scale of 0–100.
              The lower the GI, the slower and gentler the rise — which is exactly what we want.
            </p>

            {/* GI scale bar */}
            <div className="mt-6">
              <div className="relative h-5 w-full overflow-hidden rounded-full" style={{ background: "linear-gradient(to right, #16a34a, #84cc16, #facc15, #f97316, #dc2626)" }}>
                <div className="absolute inset-y-0 left-[55%] w-0.5 bg-white/70" />
                <div className="absolute inset-y-0 left-[69%] w-0.5 bg-white/70" />
              </div>
              <div className="mt-1.5 flex text-[11px] font-medium text-brand-text/60">
                <span className="flex-1 text-left">0</span>
                <span style={{ marginLeft: "calc(55% - 24px)" }} className="text-[#16a34a]">55</span>
                <span style={{ marginLeft: "calc(14% - 12px)" }} className="text-[#D97706]">69</span>
                <span className="flex-1 text-right">100</span>
              </div>
              <div className="mt-2 flex gap-4 text-[12px]">
                <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-sm bg-[#16a34a]" />Low GI (≤55) — best choice</span>
                <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-sm bg-[#D97706]" />Medium (56–69)</span>
                <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-sm bg-[#DC2626]" />High (≥70) — limit</span>
              </div>
            </div>

            {/* GI bar chart */}
            <div className="mt-6 space-y-2.5">
              {giFoods.map((food) => (
                <div key={food.label} className="flex items-center gap-3">
                  <span className="w-36 shrink-0 text-[13px] text-brand-text/80">{food.label}</span>
                  <div className="relative h-6 flex-1 overflow-hidden rounded-md bg-brand-bg">
                    <div
                      className="h-full rounded-md transition-all"
                      style={{ width: `${food.gi}%`, backgroundColor: food.color, opacity: 0.8 }}
                    />
                    <span className="absolute inset-y-0 left-2 flex items-center text-[12px] font-semibold text-white drop-shadow-sm">
                      {food.gi}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-[#CDE7D7] bg-[#EAF5EF] px-4 py-3 text-[13px] leading-relaxed text-[#2D7A51]">
              <strong>Tip:</strong> Combining high-GI foods with protein, fat, or fibre lowers the overall glycemic load of the meal. A plain potato is high-GI; the same potato with chicken and salad is much more manageable.
            </div>
          </div>
        </section>

        {/* Food groups */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-brand-text">What to put on your plate</h2>
          <p className="mt-1 text-sm text-brand-text/60">A practical reference for everyday grocery shopping and meal planning.</p>
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
                      <span className="mt-1 shrink-0 text-[10px]">▸</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Macros explainer */}
        <section className="mt-10">
          <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-soft sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-text/45">Daily targets</p>
            <h2 className="mt-1 text-xl font-bold text-brand-text">Your macros at a glance</h2>
            <p className="mt-2 text-sm text-brand-text/60">Approximate daily values for an average adult managing Type 2 Diabetes (adjust with your doctor).</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="mt-10 mb-12 rounded-2xl border border-brand-primary/25 bg-[#EAF5EF] p-8 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-primary/70">Ready to eat well?</p>
          <h2 className="mt-2 text-2xl font-bold text-brand-text">Generate your personalised meal plan</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-brand-text/65">
            Every plan in JustThreeCrumbs is built around these principles — low GI, balanced macros, and diabetes-safe ingredients.
          </p>
          <Link
            href="/generator"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-primary px-6 py-3 text-[14px] font-semibold text-white shadow-soft transition hover:opacity-90"
          >
            Go to Generator →
          </Link>
        </section>
      </main>
    </div>
  );
}
