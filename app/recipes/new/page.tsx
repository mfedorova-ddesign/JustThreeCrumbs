"use client";

import { Button } from "@/components/ui/Button";
import { buildRecipePayload, computeRecipeMetricsFromForm, makeEmptyRecipeForm, mealTypeLabels } from "@/lib/recipes/editor";
import { useGeneratorStore } from "@/lib/generator/store";
import { MealType } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function NewRecipePage() {
  const router = useRouter();
  const { addCustomRecipe } = useGeneratorStore();
  const [form, setForm] = useState(makeEmptyRecipeForm());
  const [error, setError] = useState<string | null>(null);
  const autoMetrics = useMemo(() => computeRecipeMetricsFromForm(form), [form]);

  const save = () => {
    const payload = buildRecipePayload(form);
    if (!payload) {
      setError("Fill name, meal types, ingredients, and instructions.");
      return;
    }
    addCustomRecipe(payload);
    router.push("/recipes");
  };

  return (
    <div className="min-h-screen bg-brand-bg">
      <header className="w-full border-b border-brand-border/90 bg-white">
        <div className="mx-auto flex w-full max-w-[960px] items-center justify-between px-4 py-4 md:px-8">
          <Link href="/recipes" className="text-[14px] text-brand-text/70 hover:text-brand-text">
            ← Back to recipes
          </Link>
          <img src="/images/logo-full.png" alt="JustThreeCrumbs" className="h-8 w-auto" />
          <div className="h-6 w-16" />
        </div>
      </header>

      <main className="mx-auto w-full max-w-[960px] px-4 py-8 md:px-8">
        <h1 className="text-2xl font-semibold text-brand-text">Add recipe</h1>
        <div className="mt-5 rounded-2xl border border-brand-border bg-white p-5 shadow-soft">
          <label className="text-sm font-medium text-brand-text/80">
            Dish name
            <input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-brand-border px-3 py-2"
            />
          </label>

          <div className="mt-4">
            <div className="mb-2 text-sm font-medium text-brand-text/80">Best for</div>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(mealTypeLabels) as MealType[]).map((mealType) => {
                const selected = form.mealTypes.includes(mealType);
                return (
                  <button
                    key={mealType}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        mealTypes: selected
                          ? prev.mealTypes.filter((item) => item !== mealType)
                          : [...prev.mealTypes, mealType]
                      }))
                    }
                    className={`rounded-xl border px-3 py-2 text-sm ${
                      selected
                        ? "border-brand-primary bg-[#EAF5EF] text-brand-primary"
                        : "border-brand-border bg-white text-brand-text/80"
                    }`}
                  >
                    {mealTypeLabels[mealType]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-medium text-brand-text/80">
              Ingredients (one per line)
              <textarea
                value={form.ingredientsText}
                onChange={(event) => setForm((prev) => ({ ...prev, ingredientsText: event.target.value }))}
                className="mt-1 min-h-[140px] w-full rounded-xl border border-brand-border px-3 py-2"
                placeholder={"eggs -> tofu, egg whites\nspinach\nolive oil [optional]"}
              />
            </label>
            <label className="text-sm font-medium text-brand-text/80">
              Instructions (one per line)
              <textarea
                value={form.instructionsText}
                onChange={(event) => setForm((prev) => ({ ...prev, instructionsText: event.target.value }))}
                className="mt-1 min-h-[140px] w-full rounded-xl border border-brand-border px-3 py-2"
                placeholder={"Step 1...\nStep 2..."}
              />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button type="button" onClick={save}>
              Save recipe
            </Button>
            {error ? <span className="text-sm text-red-700">{error}</span> : null}
          </div>

          <div className="mt-5 rounded-xl border border-brand-border/80 bg-brand-bg/50 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-text/45">
              Auto nutrition preview
            </p>
            {autoMetrics ? (
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-brand-text/80 sm:grid-cols-4">
                <div className="rounded-lg bg-white px-2 py-1">kcal: {Math.round(autoMetrics.calories)}</div>
                <div className="rounded-lg bg-white px-2 py-1">
                  P/F/C: {Math.round(autoMetrics.protein)}/{Math.round(autoMetrics.fat)}/{Math.round(autoMetrics.carbs)}
                </div>
                <div className="rounded-lg bg-white px-2 py-1">Fiber: {Math.round(autoMetrics.fiber)}g</div>
                <div className="rounded-lg bg-white px-2 py-1">
                  GI: {autoMetrics.glycemicIndex} | Score: {autoMetrics.diabeticScore}
                </div>
              </div>
            ) : (
              <p className="mt-2 text-xs text-brand-text/60">
                Fill required fields and valid ingredients to calculate kBJU, GI and diabetic score.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
