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
import { useGeneratorStore } from "@/lib/generator/store";
import { GeneratedMeal, Ingredient, MealPlan } from "@/types";
import jsPDF from "jspdf";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type MealTab = "ingredients" | "instructions";
type IngredientPickerState = { mealId: string; ingredientIndex: number } | null;
type RemovedIngredientsState = Record<string, Record<number, boolean>>;

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
  const { profile, isAuthenticated, planDays, generatePlan, latestPlan } = useGeneratorStore();
  const router = useRouter();
  const [selectedPlanRange, setSelectedPlanRange] = useState<1 | 3 | 7>(planDays);
  const [mealPlan, setMealPlan] = useState(latestPlan);
  const [loading, setLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(Boolean(latestPlan));
  const [activeTabs, setActiveTabs] = useState<Record<string, MealTab>>({});
  const [activeIngredientPicker, setActiveIngredientPicker] = useState<IngredientPickerState>(null);
  const [removedIngredients, setRemovedIngredients] = useState<RemovedIngredientsState>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [openedMealId, setOpenedMealId] = useState<string | null>(null);
  const recommendedTargets = recommendedDailyTargets(profile);

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
    if (isProfileComplete(profile)) return;
    setToastMessage("Complete onboarding data before generating a meal plan.");
    const timer = window.setTimeout(() => router.push("/profile"), 1200);
    return () => window.clearTimeout(timer);
  }, [profile, router]);

  function onIngredientReplace(mealId: string, ingredientIndex: number, nextIngredientName: string) {
    const replacement = ingredientByName.get(nextIngredientName.toLowerCase());
    if (!replacement) return;

    setMealPlan((previousPlan) => {
      if (!previousPlan) return previousPlan;

      return updateMealInPlan(previousPlan, mealId, (meal) => {
        const nextIngredients = meal.ingredients.map((ingredient, index) =>
          index === ingredientIndex
            ? {
                ...replacement,
                portionGrams: ingredient.portionGrams ?? replacement.portionGrams
              }
            : ingredient
        );
        return recalculateMeal({
          ...meal,
          ingredients: nextIngredients
        }, removedIngredients[mealId] ?? {});
      });
    });

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

      setMealPlan((previousPlan) => {
        if (!previousPlan) return previousPlan;

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
      const meals = [day.breakfast, day.lunch, day.dinner, day.snack, day.extraSnack].filter(
        Boolean
      ) as GeneratedMeal[];
      const totals = meals.reduce(
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

      meals.forEach((meal) => {
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
    setActiveTabs({});
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

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    let plan;
    try {
      plan = generatePlan(selectedPlanRange);
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
    const nextTabs: Record<string, MealTab> = {};
    if (plan.days[0]) {
      [plan.days[0].breakfast, plan.days[0].lunch, plan.days[0].dinner, plan.days[0].snack].forEach((meal) => {
        nextTabs[meal.id] = "ingredients";
      });
      if (plan.days[0].extraSnack) nextTabs[plan.days[0].extraSnack.id] = "ingredients";
    }
    setActiveTabs(nextTabs);
    setActiveIngredientPicker(null);
    setRemovedIngredients({});
    setOpenedMealId(null);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Header aligned with other pages */}
      <header className="w-full border-b border-brand-border bg-white">
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between px-4 py-4 md:px-8">
          <Link href="/" className="inline-block">
            <img src="/images/logo-full.png" alt="JustThreeCrumbs" className="h-8 w-auto" />
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              title="Profile"
              aria-label="Profile"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-border text-brand-text/75 transition-colors hover:bg-brand-bg hover:text-brand-text"
              onClick={() => router.push("/profile")}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21a8 8 0 0 0-16 0" />
                <circle cx="12" cy="8" r="4" />
              </svg>
            </button>
          </div>
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

        <div className="mt-4 rounded-xl border border-brand-border bg-[#EAF5EF] px-4 py-3">
          <div className="text-[13px] font-semibold text-brand-primary">Recommended daily targets</div>
          <div className="mt-2 grid grid-cols-2 gap-3 text-[13px] text-brand-text sm:grid-cols-5">
            <div><span className="text-brand-text/60">Calories:</span> {recommendedTargets.calories} kcal</div>
            <div><span className="text-brand-text/60">Protein:</span> {recommendedTargets.protein}g</div>
            <div><span className="text-brand-text/60">Fat:</span> {recommendedTargets.fat}g</div>
            <div><span className="text-brand-text/60">Carbs:</span> {recommendedTargets.carbs}g</div>
            <div><span className="text-brand-text/60">Fiber:</span> {recommendedTargets.fiber}g</div>
          </div>
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
                const dayMeals = [day.breakfast, day.lunch, day.dinner, day.snack, day.extraSnack].filter(
                  Boolean
                ) as GeneratedMeal[];
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
                      return (
                        <div
                          key={meal.id}
                          className="rounded-xl border border-brand-border bg-white p-0 overflow-hidden transition-shadow hover:shadow-sm"
                        >
                          <div
                            role="button"
                            tabIndex={0}
                            className="cursor-pointer"
                            onClick={() => setOpenedMealId(meal.id)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                setOpenedMealId(meal.id);
                              }
                            }}
                          >
                            <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:gap-4">
                              <div
                                className="flex h-[84px] w-full flex-none items-center justify-center rounded-xl border border-brand-border bg-brand-bg sm:w-[120px]"
                              >
                                <svg
                                  width={30}
                                  height={30}
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
                                    {meal.isVegan ? (
                                      <span className="ml-2 inline-flex rounded bg-[#EAF5EF] px-2 py-1 text-[12px] leading-[1.6] font-semibold text-brand-primary">
                                        Vegan
                                      </span>
                                    ) : meal.isVegetarian ? (
                                      <span className="ml-2 inline-flex rounded bg-[#EEF2FF] px-2 py-1 text-[12px] leading-[1.6] font-semibold text-[#4F46E5]">
                                        Vegetarian
                                      </span>
                                    ) : null}
                                    <h3 className="mt-1 text-[16px] leading-[1.4] font-medium text-brand-text">
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
                                    <div className="text-[12px] leading-[1.6] text-brand-text/60">GI</div>
                                    <div className="text-[14px] leading-[1.6] font-medium text-brand-text">
                                      {meal.glycemicIndex}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-[12px] leading-[1.6] text-brand-text/60">Score</div>
                                    <div className="text-[14px] leading-[1.6] font-medium text-brand-text">
                                      {meal.diabeticScore}/10
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="mt-2 rounded-lg bg-brand-bg px-3 py-2 text-[12px] leading-[1.6] text-brand-text/60">
                              Click card to view full recipe
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

      {openedMealId ? (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4 animate-[fadeIn_180ms_ease-out]"
          onClick={() => setOpenedMealId(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-brand-border bg-white p-5 shadow-xl animate-[modalIn_220ms_cubic-bezier(0.16,1,0.3,1)]"
            onClick={(event) => event.stopPropagation()}
          >
            {(() => {
              const meal = getMealById(openedMealId);
              if (!meal) return null;

              return (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex rounded bg-[#FFF4E8] px-2 py-1 text-[12px] font-semibold text-[#E6A756]">
                          {meal.mealType[0].toUpperCase() + meal.mealType.slice(1)}
                        </span>
                        {meal.isVegan ? (
                          <span className="inline-flex rounded bg-[#EAF5EF] px-2 py-1 text-[12px] font-semibold text-brand-primary">
                            Vegan
                          </span>
                        ) : meal.isVegetarian ? (
                          <span className="inline-flex rounded bg-[#EEF2FF] px-2 py-1 text-[12px] font-semibold text-[#4F46E5]">
                            Vegetarian
                          </span>
                        ) : null}
                      </div>
                      <h3 className="mt-2 text-[22px] font-medium text-brand-text">{meal.name}</h3>
                    </div>
                    <button
                      type="button"
                      aria-label="Close recipe"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-brand-border text-brand-text/70 hover:bg-brand-bg"
                      onClick={() => setOpenedMealId(null)}
                    >
                      ×
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-lg border border-brand-border bg-[#FAFAF8] px-3 py-2"><div className="text-[12px] text-brand-text/60">Calories</div><div className="font-medium">{Math.round(meal.calories)}</div></div>
                    <div className="rounded-lg border border-brand-border bg-[#FAFAF8] px-3 py-2"><div className="text-[12px] text-brand-text/60">Carbs</div><div className="font-medium">{Math.round(meal.macros.carbs)}g</div></div>
                    <div className="rounded-lg border border-brand-border bg-[#FAFAF8] px-3 py-2"><div className="text-[12px] text-brand-text/60">Protein</div><div className="font-medium">{Math.round(meal.macros.protein)}g</div></div>
                    <div className="rounded-lg border border-brand-border bg-[#FAFAF8] px-3 py-2"><div className="text-[12px] text-brand-text/60">Fat</div><div className="font-medium">{Math.round(meal.macros.fat)}g</div></div>
                    <div className="rounded-lg border border-brand-border bg-[#FAFAF8] px-3 py-2"><div className="text-[12px] text-brand-text/60">Fiber</div><div className="font-medium">{Math.round(meal.fiber)}g</div></div>
                    <div className="rounded-lg border border-brand-border bg-[#FAFAF8] px-3 py-2"><div className="text-[12px] text-brand-text/60">GI</div><div className="font-medium">{meal.glycemicIndex}</div></div>
                    <div className="rounded-lg border border-[#CDE7D7] bg-[#EAF5EF] px-3 py-2"><div className="text-[12px] text-brand-text/60">Diabetes Score</div><div className="font-medium text-brand-primary">{meal.diabeticScore}/10</div></div>
                  </div>

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
                </>
              );
            })()}
          </div>
        </div>
      ) : null}

      {toastMessage ? (
        <div className="fixed bottom-5 right-5 z-50 rounded-lg border border-brand-border bg-white px-3 py-2 text-[13px] text-brand-text shadow-lg">
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
