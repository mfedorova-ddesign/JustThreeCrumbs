"use client";

import { AppShell } from "@/components/layout/AppShell";
import { MealCard } from "@/components/meal/MealCard";
import { readPlanFromSession } from "@/lib/planStorage";
import { useGeneratorStore } from "@/lib/generator/store";
import { DayPlan, GeneratedMeal, MealPlan } from "@/types";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo } from "react";

function mealsOnDay(day: DayPlan) {
  return [day.breakfast, day.lunch, day.dinner, day.snack, day.extraSnack].filter(Boolean) as GeneratedMeal[];
}

function MealDetail({ day, mealId, planId }: { day: DayPlan; mealId: string; planId: string }) {
  const meal = mealsOnDay(day).find((entry) => entry.id === mealId);
  if (!meal) return null;

  return (
    <section className="mt-4 rounded-xl border border-brand-border bg-white p-4 sm:mt-6 sm:p-6">
      <h3 className="text-xl font-medium text-brand-text">{meal.name}</h3>
      <p className="mt-2 text-sm text-brand-text/70">
        Ingredients: {meal.ingredients.map((i) => i.name).join(", ")}
      </p>
      <ol className="mt-4 list-decimal space-y-1 pl-6 text-sm text-brand-text/80">
        {meal.instructions.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <Link href={`/plan/${planId}`} className="mt-4 inline-block text-sm text-brand-primary underline">
        Close recipe
      </Link>
    </section>
  );
}

function PlanPageInner() {
  const params = useParams();
  const planId = typeof params?.id === "string" ? params.id : "";
  const { latestPlan, setLatestPlan } = useGeneratorStore();
  const searchParams = useSearchParams();
  const selectedMealId = searchParams.get("meal");

  const sessionPlan = useMemo(
    () => (planId ? readPlanFromSession(planId) : null),
    [planId]
  );
  const plan: MealPlan | null = useMemo(() => {
    if (!planId) return null;
    if (latestPlan?.id === planId) return latestPlan;
    if (sessionPlan?.id === planId) return sessionPlan;
    return null;
  }, [planId, latestPlan, sessionPlan]);

  useEffect(() => {
    if (plan && plan.id === planId && latestPlan?.id !== planId) {
      setLatestPlan(plan);
    }
  }, [plan, planId, latestPlan?.id, setLatestPlan]);

  if (!planId) {
    return (
      <AppShell title="Plan not found" subtitle="This link is invalid.">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <Link href="/generator" className="text-brand-primary underline">
            Go to generator
          </Link>
        </div>
      </AppShell>
    );
  }

  if (!plan) {
    return (
      <AppShell title="Plan not found" subtitle="Generate a meal plan first, or open it from the same browser session.">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <Link href="/generator" className="text-brand-primary underline">
            Go to generator
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Your Meal Plan" subtitle="Structured meals from your diabetes-friendly recipe templates.">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Link
          href="/generator"
          className="inline-flex items-center rounded-xl border border-brand-border/90 bg-white px-4 py-2.5 text-sm font-medium text-brand-text shadow-soft transition hover:bg-brand-bg"
        >
          ← Edit in generator
        </Link>
        <span className="text-sm text-brand-text/55">Swap ingredients, regenerate meals, export PDF</span>
      </div>
      <div className="space-y-5 sm:space-y-6">
        {plan.days.map((day) => (
          <section key={day.day} className="space-y-3 rounded-2xl bg-brand-bg/50 p-2 sm:p-3">
            <h2 className="px-2 text-xl font-semibold text-slate-900">Day {day.day}</h2>
            {[day.breakfast, day.lunch, day.dinner, day.snack, ...(day.extraSnack ? [day.extraSnack] : [])].map(
              (meal) =>
                meal.skipped ? (
                  <div
                    key={meal.id}
                    className="rounded-xl border border-dashed border-brand-border/80 bg-white/80 px-4 py-3 text-sm text-brand-text/60"
                  >
                    One meal removed from this day&apos;s menu — use the generator to restore or replace it.
                  </div>
                ) : (
                  <MealCard key={meal.id} meal={meal} planId={plan.id} />
                )
            )}
            {selectedMealId ? (
              <MealDetail day={day} mealId={selectedMealId} planId={plan.id} />
            ) : null}
          </section>
        ))}
      </div>
    </AppShell>
  );
}

function PlanLoadingFallback() {
  return (
    <AppShell title="Your Meal Plan" subtitle="Loading…">
      <div className="space-y-4">
        <div className="h-10 max-w-md animate-pulse rounded-xl bg-brand-bg" />
        <div className="h-32 animate-pulse rounded-2xl bg-brand-bg" />
        <div className="h-32 animate-pulse rounded-2xl bg-brand-bg" />
      </div>
    </AppShell>
  );
}

export default function PlanPage() {
  return (
    <Suspense fallback={<PlanLoadingFallback />}>
      <PlanPageInner />
    </Suspense>
  );
}
