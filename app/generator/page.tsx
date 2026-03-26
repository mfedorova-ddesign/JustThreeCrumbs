"use client";

import { Button } from "@/components/ui/Button";
import { useGeneratorStore } from "@/lib/generator/store";
import jsPDF from "jspdf";
import Link from "next/link";
import { useState } from "react";

type MealTab = "ingredients" | "instructions";

export default function GeneratorPage() {
  const { planDays, generatePlan, latestPlan } = useGeneratorStore();
  const [selectedPlanRange, setSelectedPlanRange] = useState<1 | 3 | 7>(planDays);
  const [mealPlan, setMealPlan] = useState(latestPlan);
  const [loading, setLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(Boolean(latestPlan));
  const [activeTabs, setActiveTabs] = useState<Record<string, MealTab>>({});
  const [expandedMeals, setExpandedMeals] = useState<Record<string, boolean>>({});

  function exportPlan() {
    if (!mealPlan) return;

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
      const meals = [day.breakfast, day.lunch, day.dinner];
      const totals = meals.reduce(
        (acc, meal) => {
          acc.calories += meal.calories;
          acc.protein += meal.macros.protein;
          acc.fat += meal.macros.fat;
          acc.carbs += meal.macros.carbs;
          return acc;
        },
        { calories: 0, carbs: 0, protein: 0, fat: 0 }
      );

      ensureSpace(48);
      y += 6;
      writeLine(`Day ${day.day}`, { bold: true, size: 14 });
      writeLine(
        `Summary: ${Math.round(totals.calories)} kcal | Carbs ${Math.round(totals.carbs)}g | Protein ${Math.round(
          totals.protein
        )}g | Fat ${Math.round(totals.fat)}g`
      );
      y += 4;

      meals.forEach((meal) => {
        ensureSpace(64);
        writeLine(`${meal.mealType[0].toUpperCase() + meal.mealType.slice(1)}: ${meal.name}`, {
          bold: true
        });
        writeLine(
          `Calories ${Math.round(meal.calories)} | Carbs ${Math.round(meal.macros.carbs)}g | Protein ${Math.round(
            meal.macros.protein
          )}g | Fat ${Math.round(meal.macros.fat)}g`
        );
        writeLine("Ingredients:");
        meal.ingredients.slice(0, 10).forEach((ing) => {
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
    setActiveTabs({});
    setExpandedMeals({});
    setLoading(false);
  }

  async function onGenerateMealPlan() {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const plan = generatePlan(selectedPlanRange);
    setMealPlan(plan);
    setHasGenerated(true);
    const nextTabs: Record<string, MealTab> = {};
    if (plan.days[0]) {
      [plan.days[0].breakfast, plan.days[0].lunch, plan.days[0].dinner].forEach((meal) => {
        nextTabs[meal.id] = "ingredients";
      });
    }
    setActiveTabs(nextTabs);
    setExpandedMeals({});
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Header aligned with other pages */}
      <header className="w-full border-b border-brand-border bg-white">
        <div className="mx-auto w-full max-w-[1280px] px-4 py-4 md:px-8">
          <Link href="/" className="inline-block">
            <img src="/images/logo-full.png" alt="JustThreeCrumbs" className="h-8 w-auto" />
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1280px] px-4 pb-10 pt-4 md:px-8 md:pb-14">
        <h1 className="text-[30px] leading-[1.3] font-medium text-brand-text sm:text-[36px] md:text-[40px] md:leading-[1.6]">
          Generate Your Meal Plan
        </h1>
        <p className="mt-2 text-[14px] leading-[1.6] text-brand-text/70">
          Create personalized, diabetes-friendly meals for the week
        </p>

        {/* Controls row */}
        <div className="mt-4 flex flex-wrap items-center justify-start gap-3">
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
              value={selectedPlanRange}
              onChange={(e) => setSelectedPlanRange(Number(e.target.value) as 1 | 3 | 7)}
              disabled={loading}
              className="h-9 min-w-[120px] rounded-xl border border-brand-border bg-white px-3 text-[14px] leading-[1.6] text-brand-text focus:outline-none focus:ring-4 focus:ring-brand-primary/20"
            >
              <option value={1}>1 day</option>
              <option value={3}>3 days</option>
              <option value={7}>1 week</option>
            </select>
          </div>

          <Button
            type="button"
            variant="primary"
            className="h-9"
            onClick={onGenerateMealPlan}
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
              {loading ? "Generating..." : "Generate Meal Plan"}
            </span>
          </Button>

          {hasGenerated ? (
            <button
              type="button"
              className="inline-flex h-11 items-center gap-2 rounded-[14px] border border-[#D9D9D4] bg-[#F1F1EF] px-5 text-[14px] leading-[1.2] font-medium text-brand-text transition-colors hover:bg-[#ECECE8] focus:outline-none focus:ring-4 focus:ring-brand-primary/15"
              onClick={exportPlan}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-brand-text/85"
              >
                <path d="M12 3v12" />
                <path d="m7 10 5 5 5-5" />
                <path d="M5 21h14" />
              </svg>
              Export Plan
            </button>
          ) : null}

          {hasGenerated ? (
            <Button
              type="button"
              variant="secondary"
              className="h-9"
              onClick={backToGeneratorStart}
            >
              Back to Start
            </Button>
          ) : null}
        </div>

        {/* Empty state */}
        {!hasGenerated && !loading ? (
          <div className="mt-6 rounded-xl border border-brand-border bg-white p-8 sm:p-14">
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
                <path d="M6 18h12" />
                <path d="M18 18v-3a3 3 0 0 0-3-3h-1a3 3 0 0 0-3 3v3" />
                <path d="M13 12a4 4 0 1 0-6 0" />
                <path d="M5 15a3 3 0 0 1 0-6 4 4 0 0 1 7-2" />
                <path d="M19 9a3 3 0 0 1 0 6" />
              </svg>
            </div>
            <h3 className="mt-4 text-[24px] leading-[1.6] font-medium text-brand-text text-center">
              Ready to create your meal plan?
            </h3>
            <p className="mt-4 text-[14px] leading-[1.6] text-brand-text/70 text-center">
              Click &quot;Generate Meal Plan&quot; to get started with your personalized daily meals
            </p>
          </div>
        ) : loading ? (
          <div className="mt-6 space-y-4">
            <div className="h-[120px] animate-pulse rounded-xl border border-brand-border bg-[#EAF5EF]" />
            <div className="h-[220px] animate-pulse rounded-xl border border-brand-border bg-white" />
            <div className="h-[220px] animate-pulse rounded-xl border border-brand-border bg-white" />
            <div className="h-[220px] animate-pulse rounded-xl border border-brand-border bg-white" />
          </div>
        ) : (
          <>
            <div className="mt-4 space-y-4">
              {mealPlan?.days.map((day) => {
                const dayMeals = [day.breakfast, day.lunch, day.dinner];
                const daySummary = dayMeals.reduce(
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
                  <section key={day.day} className="space-y-3 rounded-xl border border-brand-border bg-[#FAFAF8] p-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-[24px] leading-[1.6] font-medium text-brand-text">
                        Day {day.day}
                      </h2>
                      <div className="text-[14px] leading-[1.6] text-brand-text/70">
                        {Math.round(daySummary.calories)} kcal
                      </div>
                    </div>

                    <div className="rounded-xl bg-[#DDEFE8] px-4 py-4 sm:px-5">
                      <div className="text-[14px] leading-[1.6] font-medium text-brand-text/70">
                        Nutrition Summary (Day {day.day})
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
                        <div>
                          <div className="text-[12px] leading-[1.6] font-medium text-brand-text/60">
                            Calories
                          </div>
                          <div className="mt-1 text-[14px] leading-[1.6] font-medium text-brand-text">
                            {Math.round(daySummary.calories)}
                          </div>
                        </div>
                        <div>
                          <div className="text-[12px] leading-[1.6] font-medium text-brand-text/60">
                            Carbs
                          </div>
                          <div className="mt-1 text-[14px] leading-[1.6] font-medium text-brand-text">
                            {Math.round(daySummary.carbs)}g
                          </div>
                        </div>
                        <div>
                          <div className="text-[12px] leading-[1.6] font-medium text-brand-text/60">
                            Proteins
                          </div>
                          <div className="mt-1 text-[14px] leading-[1.6] font-medium text-brand-text">
                            {Math.round(daySummary.protein)}g
                          </div>
                        </div>
                        <div>
                          <div className="text-[12px] leading-[1.6] font-medium text-brand-text/60">
                            Fat
                          </div>
                          <div className="mt-1 text-[14px] leading-[1.6] font-medium text-brand-text">
                            {Math.round(daySummary.fat)}g
                          </div>
                        </div>
                      </div>
                    </div>

                    {dayMeals.map((meal) => {
                      const isExpanded = Boolean(expandedMeals[meal.id]);

                      return (
                        <div
                          key={meal.id}
                          className="rounded-xl border border-brand-border bg-white p-0 overflow-hidden transition-shadow hover:shadow-sm"
                        >
                          <div
                            role="button"
                            tabIndex={0}
                            className="cursor-pointer"
                            onClick={() =>
                              setExpandedMeals((state) => ({ ...state, [meal.id]: !state[meal.id] }))
                            }
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                setExpandedMeals((state) => ({ ...state, [meal.id]: !state[meal.id] }));
                              }
                            }}
                          >
                            <div className="flex flex-col gap-3 p-4 sm:flex-row sm:gap-4">
                              <div
                                className={`flex-none rounded-xl bg-brand-bg border border-brand-border flex items-center justify-center ${
                                  isExpanded
                                    ? "h-[180px] w-full sm:h-[160px] sm:w-[240px]"
                                    : "h-[110px] w-full sm:w-[160px]"
                                }`}
                              >
                            {/* Placeholder "plug" symbol for dish image */}
                            <svg
                              width={isExpanded ? 56 : 40}
                              height={isExpanded ? 56 : 40}
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              stroke="#9CA3AF"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M12 22v-5" />
                              <path d="M9 8V2" />
                              <path d="M15 8V2" />
                              <path d="M5 8h14v3a7 7 0 0 1-7 7h0a7 7 0 0 1-7-7V8Z" />
                            </svg>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <span className="inline-flex rounded bg-[#FFF4E8] px-2 py-1 text-[12px] leading-[1.6] font-semibold text-[#E6A756]">
                                  {meal.mealType[0].toUpperCase() + meal.mealType.slice(1)}
                                </span>
                                <h3 className="mt-1 text-[18px] leading-[1.5] font-medium text-brand-text">
                                  {meal.name}
                                </h3>
                              </div>
                              <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-brand-border text-brand-text/60">
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className={`transition-transform ${isExpanded ? "rotate-180" : "rotate-0"}`}
                                >
                                  <path d="m6 9 6 6 6-6" />
                                </svg>
                              </span>
                            </div>

                            <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
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

                            <div className="mt-2 flex flex-wrap items-center gap-3 text-[12px] leading-[1.6] text-brand-text/60">
                              <span>⏱ 25 mins</span>
                              <span>🍽 1 serving</span>
                            </div>

                            {isExpanded ? (
                              <>
                                <div className="mt-3 border-t border-brand-border" />
                                <div className="mt-3 flex items-center gap-6">
                                  <button
                                    type="button"
                                    className={`text-[14px] leading-[1.6] ${
                                      (activeTabs[meal.id] ?? "ingredients") === "ingredients"
                                        ? "font-medium text-brand-text"
                                        : "text-brand-text/60"
                                    }`}
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      setActiveTabs((state) => ({ ...state, [meal.id]: "ingredients" }));
                                    }}
                                  >
                                    Ingredients
                                  </button>
                                  <button
                                    type="button"
                                    className={`text-[14px] leading-[1.6] ${
                                      (activeTabs[meal.id] ?? "ingredients") === "instructions"
                                        ? "font-medium text-brand-text"
                                        : "text-brand-text/60"
                                    }`}
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      setActiveTabs((state) => ({ ...state, [meal.id]: "instructions" }));
                                    }}
                                  >
                                    Instructions
                                  </button>
                                </div>

                                <div className="mt-3 grid grid-cols-1 gap-6">
                                  <div>
                                    {(activeTabs[meal.id] ?? "ingredients") === "ingredients" ? (
                                      <ul className="mt-1 space-y-1 list-disc pl-5 text-[14px] leading-[1.6] text-brand-text/80">
                                        {meal.ingredients.slice(0, 6).map((ing) => (
                                          <li key={ing.name}>{ing.name}</li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <ol className="mt-1 space-y-1 list-decimal pl-5 text-[14px] leading-[1.6] text-brand-text/80">
                                        {meal.instructions.slice(0, 5).map((step, stepIdx) => (
                                          <li key={`${meal.id}-${stepIdx}`}>{step}</li>
                                        ))}
                                      </ol>
                                    )}
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="mt-2 text-[12px] leading-[1.6] text-brand-text/55">
                                Click card to view ingredients and instructions
                              </div>
                            )}
                          </div>
                        </div>
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
    </div>
  );
}
