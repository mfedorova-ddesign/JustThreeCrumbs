"use client";

import { Button } from "@/components/ui/Button";
import { useGeneratorStore } from "@/lib/generator/store";
import { useMemo, useState } from "react";

export default function GeneratorPage() {
  const { planDays, generatePlan, latestPlan, profile } = useGeneratorStore();
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const daysCount = latestPlan?.days.length ?? planDays;
  const dayOptions = useMemo(() => {
    const baseNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return Array.from({ length: daysCount }, (_, idx) => {
      const dayNum = idx + 1;
      const name = baseNames[idx % baseNames.length];
      return { idx, label: `Day ${dayNum} - ${name}` };
    });
  }, [daysCount]);

  const selectedDay = latestPlan?.days[selectedDayIndex] ?? null;
  const selectedDayMeals = selectedDay
    ? [selectedDay.breakfast, selectedDay.lunch, selectedDay.dinner, selectedDay.snack]
    : [];

  const dailyNutrition = useMemo(() => {
    if (!selectedDay) return null;
    const totals = selectedDayMeals.reduce(
      (acc, meal) => {
        acc.calories += meal.calories;
        acc.protein += meal.macros.protein;
        acc.fat += meal.macros.fat;
        acc.carbs += meal.macros.carbs;
        return acc;
      },
      { calories: 0, carbs: 0, protein: 0, fat: 0 }
    );
    return totals;
  }, [selectedDay, selectedDayMeals]);

  const conditionLabel = profile.condition === "type2_diabetes" ? "Type 2 Diabetes" : "Condition";

  function exportPlan() {
    if (!latestPlan) return;
    const payload = { ...latestPlan, userProfile: latestPlan.userProfile };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `justthreecrumbs-plan-${latestPlan.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Mockup header bar */}
      <div className="mx-auto w-full max-w-[1280px] px-4 pt-4 md:px-8">
        <div className="flex items-center justify-between">
          <div className="text-[16px] leading-[1.6] font-medium text-brand-text">
            JustThreeCrumbs
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-white/70 px-3 py-1 text-[12px] leading-[1.6] font-semibold text-brand-primary border border-brand-border">
              {conditionLabel}
            </span>
            <span className="text-[14px] leading-[1.6] text-brand-text/70">Hi, kjhu!</span>
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-[1280px] px-4 pb-14 pt-3 md:px-8">
        <h1 className="text-[40px] leading-[1.6] font-medium text-brand-text">Generate Your Meal Plan</h1>
        <p className="mt-2 text-[14px] leading-[1.6] text-brand-text/70">
          Create personalized, diabetes-friendly meals for the week
        </p>

        {/* Controls row */}
        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="inline-flex items-center gap-3">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-brand-bg">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#066835"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </span>

            <select
              value={selectedDayIndex}
              onChange={(e) => setSelectedDayIndex(Number(e.target.value))}
              disabled={!latestPlan}
              className="h-9 rounded-xl border border-brand-border bg-white px-3 text-[14px] leading-[1.6] text-brand-text focus:outline-none focus:ring-4 focus:ring-brand-primary/20"
            >
              {dayOptions.map((opt) => (
                <option key={opt.idx} value={opt.idx}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="primary"
              className="h-9"
              onClick={() => {
                generatePlan();
                setSelectedDayIndex(0);
              }}
            >
              <span className="inline-flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2l1.5 6L20 10l-6.5 2L12 18l-1.5-6L4 10l6.5-2L12 2z" />
                </svg>
                Generate Meal Plan
              </span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="h-9"
              onClick={exportPlan}
            >
              Export Plan
            </Button>
          </div>
        </div>

        {/* Empty state */}
        {!latestPlan ? (
          <div className="mt-6 rounded-xl border border-brand-border bg-white p-14">
            <div className="flex items-center justify-center">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 20h8" />
                <path d="M12 2c-2.2 2-3 4-3 6 0 2.5 1.2 4.5 3 6 1.8-1.5 3-3.5 3-6 0-2-0.8-4-3-6Z" />
                <path d="M5 16c0 3 2 5 7 6 5-1 7-3 7-6" />
              </svg>
            </div>
            <h3 className="mt-4 text-[24px] leading-[1.6] font-medium text-brand-text text-center">
              Ready to create your meal plan?
            </h3>
            <p className="mt-4 text-[14px] leading-[1.6] text-brand-text/70 text-center">
              Click &quot;Generate Meal Plan&quot; to get started with your personalized daily meals
            </p>
          </div>
        ) : (
          <>
            {/* Daily summary */}
            <div className="mt-5 rounded-xl bg-[#DDEFE8] px-6 py-4">
              <div className="text-[14px] leading-[1.6] font-medium text-brand-text/70">
                Daily Nutrition Summary
              </div>
              {dailyNutrition ? (
                <div className="mt-3 grid grid-cols-4 gap-6">
                  <div>
                    <div className="text-[12px] leading-[1.6] font-medium text-brand-text/60">
                      Calories
                    </div>
                    <div className="mt-1 text-[14px] leading-[1.6] font-medium text-brand-text">
                      {Math.round(dailyNutrition.calories)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[12px] leading-[1.6] font-medium text-brand-text/60">
                      Carbs
                    </div>
                    <div className="mt-1 text-[14px] leading-[1.6] font-medium text-brand-text">
                      {Math.round(dailyNutrition.carbs)}g
                    </div>
                  </div>
                  <div>
                    <div className="text-[12px] leading-[1.6] font-medium text-brand-text/60">
                      Proteins
                    </div>
                    <div className="mt-1 text-[14px] leading-[1.6] font-medium text-brand-text">
                      {Math.round(dailyNutrition.protein)}g
                    </div>
                  </div>
                  <div>
                    <div className="text-[12px] leading-[1.6] font-medium text-brand-text/60">
                      Fat
                    </div>
                    <div className="mt-1 text-[14px] leading-[1.6] font-medium text-brand-text">
                      {Math.round(dailyNutrition.fat)}g
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Meal list */}
            <div className="mt-4 space-y-4">
              {selectedDayMeals.map((meal, idx) => (
                <div key={meal.id} className="rounded-xl border border-brand-border bg-white p-0 overflow-hidden">
                  <div className="flex gap-4 p-5">
                    <img
                      src="/images/hero.png"
                      alt={meal.name}
                      className="h-[160px] w-[240px] flex-none rounded-xl object-cover"
                    />

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-[16px] leading-[1.6] text-brand-text/70 text-[12px]">
                            {/* keep line for serving text in mockup */}
                            1 serving
                          </div>
                          <h3 className="mt-1 text-[20px] leading-[1.6] font-medium text-brand-text">
                            {meal.name}
                          </h3>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-4 gap-4">
                        <div>
                          <div className="text-[12px] leading-[1.6] text-brand-text/60">Calories</div>
                          <div className="text-[14px] leading-[1.6] font-medium text-brand-text">
                            {Math.round(meal.calories)}
                          </div>
                        </div>
                        <div>
                          <div className="text-[12px] leading-[1.6] text-brand-text/60">Carbs</div>
                          <div className="text-[14px] leading-[1.6] font-medium text-brand-text">
                            {Math.round(meal.macros.carbs)}g
                          </div>
                        </div>
                        <div>
                          <div className="text-[12px] leading-[1.6] text-brand-text/60">Protein</div>
                          <div className="text-[14px] leading-[1.6] font-medium text-brand-text">
                            {Math.round(meal.macros.protein)}g
                          </div>
                        </div>
                        <div>
                          <div className="text-[12px] leading-[1.6] text-brand-text/60">Fat</div>
                          <div className="text-[14px] leading-[1.6] font-medium text-brand-text">
                            {Math.round(meal.macros.fat)}g
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-6">
                        <div>
                          <div className="text-[12px] leading-[1.6] font-medium text-brand-text/60">
                            Ingredients
                          </div>
                          <ul className="mt-2 space-y-1 text-[14px] leading-[1.6] text-brand-text/80">
                            {meal.ingredients.slice(0, 5).map((ing) => (
                              <li key={ing.name}>{ing.name}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="text-[12px] leading-[1.6] font-medium text-brand-text/60">
                            Instructions
                          </div>
                          <ol className="mt-2 space-y-1 list-decimal pl-5 text-[14px] leading-[1.6] text-brand-text/80">
                            {meal.instructions.slice(0, 3).map((step, stepIdx) => (
                              <li key={`${meal.id}-${stepIdx}`}>{step}</li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
