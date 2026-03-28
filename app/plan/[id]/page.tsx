"use client";

import { AppShell } from "@/components/layout/AppShell";
import { MealCard } from "@/components/meal/MealCard";
import { useGeneratorStore } from "@/lib/generator/store";
import { DayPlan } from "@/types";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function MealDetail({ day, mealId, planId }: { day: DayPlan; mealId: string; planId: string }) {
  const meal = [day.breakfast, day.lunch, day.dinner, day.snack].find((entry) => entry.id === mealId);
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

export default function PlanPage() {
  const { latestPlan } = useGeneratorStore();
  const searchParams = useSearchParams();
  const selectedMealId = searchParams.get("meal");

  if (!latestPlan) {
    return (
      <AppShell title="Plan not found" subtitle="Generate a meal plan first to view results.">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <Link href="/generator" className="text-brand-primary underline">
            Go to generator
          </Link>
        </div>
      </AppShell>
    );
  }

  // Next.js route includes an id parameter; for MVP we display latest in-memory plan.
  return (
    <AppShell title="Your Meal Plan" subtitle="Structured meals from your diabetes-friendly recipe templates.">
      <div className="space-y-5 sm:space-y-6">
        {latestPlan.days.map((day) => (
          <section key={day.day} className="space-y-3 rounded-2xl bg-brand-bg/50 p-2 sm:p-3">
            <h2 className="px-2 text-xl font-semibold text-slate-900">Day {day.day}</h2>
            <MealCard meal={day.breakfast} planId={latestPlan.id} />
            <MealCard meal={day.lunch} planId={latestPlan.id} />
            <MealCard meal={day.dinner} planId={latestPlan.id} />
            <MealCard meal={day.snack} planId={latestPlan.id} />
            {selectedMealId ? (
              <MealDetail day={day} mealId={selectedMealId} planId={latestPlan.id} />
            ) : null}
          </section>
        ))}
      </div>
    </AppShell>
  );
}
