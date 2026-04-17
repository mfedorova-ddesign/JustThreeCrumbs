"use client";

import { mealImageUrlForId } from "@/lib/design/mealImages";
import { useGeneratorStore } from "@/lib/generator/store";
import { FIXED_RECIPES } from "@/lib/recipes/data";
import { mealTypeLabels } from "@/lib/recipes/editor";
import { recipeAllergens, recipeNutrition, recipeVegan } from "@/lib/recipes/insights";
import { Recipe } from "@/types";
import { User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

function TopTabs() {
  return (
    <div className="inline-flex items-end">
      <Link
        href="/generator"
        className="rounded-t-xl border border-brand-border border-b-brand-border bg-brand-bg/40 px-5 py-2.5 text-sm font-medium text-brand-text/70 transition hover:bg-white hover:text-brand-text"
      >
        Generator
      </Link>
      <span className="relative -mb-px rounded-t-xl border border-brand-border bg-white px-5 py-2.5 text-sm font-semibold text-brand-text">
        Recipes
      </span>
    </div>
  );
}

export default function RecipesPage() {
  const router = useRouter();
  const { customRecipes, favoriteRecipeIds, skippedRecipeIds, toggleFavoriteRecipe, toggleSkipRecipe, deleteCustomRecipe } =
    useGeneratorStore();

  const [openedRecipeId, setOpenedRecipeId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [mealTypeFilters, setMealTypeFilters] = useState<Array<"all" | "breakfast" | "lunch" | "dinner" | "snack">>([
    "all"
  ]);
  const [veganOnly, setVeganOnly] = useState(false);
  const [sourceFilters, setSourceFilters] = useState<Array<"all" | "default" | "custom">>(["all"]);
  const [favoriteOnly, setFavoriteOnly] = useState(false);
  const [skippedOnly, setSkippedOnly] = useState(false);

  const allRecipes: Recipe[] = [
    ...customRecipes,
    ...FIXED_RECIPES.map((recipe) => ({ ...recipe, source: "default" as const }))
  ];
  const toggleMultiFilter = <T extends string>(selected: T[], value: T): T[] => {
    if (value === "all") return ["all" as T];
    const withoutAll = selected.filter((item) => item !== ("all" as T));
    const exists = withoutAll.includes(value);
    const next = exists ? withoutAll.filter((item) => item !== value) : [...withoutAll, value];
    return next.length > 0 ? next : ["all" as T];
  };

  const mealTypeCount = useMemo(() => {
    const byType = {
      breakfast: allRecipes.filter((recipe) => recipe.mealTypes.includes("breakfast")).length,
      lunch: allRecipes.filter((recipe) => recipe.mealTypes.includes("lunch")).length,
      dinner: allRecipes.filter((recipe) => recipe.mealTypes.includes("dinner")).length,
      snack: allRecipes.filter((recipe) => recipe.mealTypes.includes("snack")).length
    };
    return {
      all: allRecipes.length,
      ...byType
    };
  }, [allRecipes]);

  const sourceCount = useMemo(
    () => ({
      all: allRecipes.length,
      default: allRecipes.filter((recipe) => recipe.source === "default").length,
      custom: allRecipes.filter((recipe) => recipe.source === "custom").length
    }),
    [allRecipes]
  );

  const favoriteCount = favoriteRecipeIds.length;
  const skippedCount = skippedRecipeIds.length;
  const veganCount = useMemo(() => allRecipes.filter((recipe) => recipeVegan(recipe)).length, [allRecipes]);

  const visibleRecipes = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allRecipes.filter((recipe) => {
      const isFavorite = favoriteRecipeIds.includes(recipe.id);
      const isSkipped = skippedRecipeIds.includes(recipe.id);
      const matchesQuery =
        q.length === 0 ||
        recipe.name.toLowerCase().includes(q) ||
        recipe.ingredients.some((rule) => rule.primary.toLowerCase().includes(q));
      const matchesMealType =
        mealTypeFilters.includes("all") || recipe.mealTypes.some((mealType) => mealTypeFilters.includes(mealType));
      const matchesVegan = !veganOnly || recipeVegan(recipe);
      const matchesSource = sourceFilters.includes("all") || sourceFilters.includes(recipe.source ?? "default");
      const matchesFavorite = !favoriteOnly || isFavorite;
      const matchesSkipped = !skippedOnly || isSkipped;
      return matchesQuery && matchesMealType && matchesVegan && matchesSource && matchesFavorite && matchesSkipped;
    });
  }, [
    allRecipes,
    query,
    mealTypeFilters,
    veganOnly,
    sourceFilters,
    favoriteOnly,
    skippedOnly,
    favoriteRecipeIds,
    skippedRecipeIds
  ]);

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
        <h1 className="text-3xl font-semibold text-brand-text">Recipes Library</h1>
        <p className="mt-1 text-sm text-brand-text/65">
          Browse recipes, mark favorites, skip dishes, and manage your custom recipes.
        </p>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
          <TopTabs />
        </div>
        <div className="h-px w-full bg-brand-border" />

        <div className="mt-4 grid gap-0 md:grid-cols-[250px_minmax(0,1fr)]">
          <aside className="self-start px-1.5 py-1 md:sticky md:top-4">
            <div className="space-y-5 text-sm text-brand-text">
              <div>
                <p className="text-[13px] font-bold uppercase tracking-wide text-brand-text/75">Meal type</p>
                <div className="mt-2.5 space-y-2.5">
                  {(["all", "breakfast", "lunch", "dinner", "snack"] as const).map((value) => (
                    <label key={value} className="flex items-center gap-2 text-[13px] text-brand-text/80">
                      <input
                        type="checkbox"
                        checked={mealTypeFilters.includes(value)}
                        onChange={() => setMealTypeFilters((prev) => toggleMultiFilter(prev, value))}
                        className="h-4 w-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary/30"
                      />
                      {value === "all" ? `All meals (${mealTypeCount.all})` : `${mealTypeLabels[value]} (${mealTypeCount[value]})`}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[13px] font-bold uppercase tracking-wide text-brand-text/75">Source</p>
                <div className="mt-2.5 space-y-2.5">
                  {(["all", "default", "custom"] as const).map((value) => (
                    <label key={value} className="flex items-center gap-2 text-[13px] text-brand-text/80">
                      <input
                        type="checkbox"
                        checked={sourceFilters.includes(value)}
                        onChange={() => setSourceFilters((prev) => toggleMultiFilter(prev, value))}
                        className="h-4 w-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary/30"
                      />
                      {value === "all"
                        ? `All sources (${sourceCount.all})`
                        : value === "default"
                          ? `Default (${sourceCount.default})`
                          : `Custom (${sourceCount.custom})`}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[13px] font-bold uppercase tracking-wide text-brand-text/75">Options</p>
                <div className="mt-2.5 space-y-2.5">
                  <label className="flex items-center gap-2 text-[13px] text-brand-text/80">
                    <input
                      type="checkbox"
                      checked={veganOnly}
                      onChange={() => setVeganOnly((prev) => !prev)}
                      className="h-4 w-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary/30"
                    />
                    Vegan only ({veganCount})
                  </label>
                  <label className="flex items-center gap-2 text-[13px] text-brand-text/80">
                    <input
                      type="checkbox"
                      checked={favoriteOnly}
                      onChange={() => setFavoriteOnly((prev) => !prev)}
                      className="h-4 w-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary/30"
                    />
                    Favorites only ({favoriteCount})
                  </label>
                  <label className="flex items-center gap-2 text-[13px] text-brand-text/80">
                    <input
                      type="checkbox"
                      checked={skippedOnly}
                      onChange={() => setSkippedOnly((prev) => !prev)}
                      className="h-4 w-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary/30"
                    />
                    Skipped only ({skippedCount})
                  </label>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setMealTypeFilters(["all"]);
                  setSourceFilters(["all"]);
                  setVeganOnly(false);
                  setFavoriteOnly(false);
                  setSkippedOnly(false);
                }}
                className="rounded-xl border border-brand-border px-3 py-2 text-xs text-brand-text/75 hover:bg-brand-bg"
              >
                Reset filters
              </button>
            </div>
          </aside>

          <section className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search recipes..."
                className="h-10 min-w-[240px] flex-1 rounded-xl border border-brand-border bg-white px-3 text-sm text-brand-text"
              />
              <Link
                href="/recipes/new"
                className="inline-flex h-10 items-center rounded-xl bg-brand-primary px-4 text-sm font-semibold text-white shadow-soft transition hover:opacity-90"
              >
                Add recipe
              </Link>
            </div>

            <div className="mt-4 space-y-4">
              {visibleRecipes.map((recipe) => {
                const nutrition = recipeNutrition(recipe);
                const allergens = recipeAllergens(recipe);
                const vegan = recipeVegan(recipe);
                const favorite = favoriteRecipeIds.includes(recipe.id);
                const skipped = skippedRecipeIds.includes(recipe.id);
                const canEdit = recipe.source === "custom";
                const isOpen = openedRecipeId === recipe.id;

                return (
                  <article
                    key={recipe.id}
                    className="overflow-hidden rounded-xl border border-brand-border/80 bg-white shadow-soft transition-shadow hover:shadow-md"
                  >
                    <div className="flex">
                      <div className="relative h-[100px] w-[88px] shrink-0 sm:h-[108px] sm:w-[100px]">
                        <img src={mealImageUrlForId(recipe.id, recipe.imageUrl)} alt="" className="h-full w-full object-cover" loading="lazy" />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 px-3 py-2.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="inline-flex rounded-md bg-[#FFF4E8] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-accent">
                            {recipe.mealTypes.map((mealType) => mealTypeLabels[mealType]).join(" / ")}
                          </span>
                          {vegan ? (
                            <span className="inline-flex rounded-md bg-[#EAF5EF] px-2 py-0.5 text-[10px] font-semibold text-brand-primary">
                              Vegan
                            </span>
                          ) : null}
                        </div>
                        <h3 className="text-[15px] font-semibold leading-snug tracking-tight text-brand-text sm:text-base">
                          {recipe.name}
                        </h3>
                        <div className="scrollbar-none flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-brand-text/55">
                          <span>{Math.round(nutrition.calories)} kcal</span>
                          <span>·</span>
                          <span>P {Math.round(nutrition.protein)}g</span>
                          <span>·</span>
                          <span>F {Math.round(nutrition.fat)}g</span>
                          <span>·</span>
                          <span>C {Math.round(nutrition.carbs)}g</span>
                          <span>·</span>
                          <span>GI {nutrition.glycemicIndex}</span>
                          <span>·</span>
                          <span>Score {nutrition.diabeticScore}</span>
                        </div>
                        <p className="line-clamp-1 text-[11px] text-brand-primary/60">
                          Allergens: {allergens.length > 0 ? allergens.join(", ") : "None"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-1 border-t border-brand-border/70 bg-brand-bg/40 px-2 py-1.5">
                      <button
                        type="button"
                        onClick={() => setOpenedRecipeId((prev) => (prev === recipe.id ? null : recipe.id))}
                        className="inline-flex rounded-lg border border-brand-border/90 bg-white px-3 py-2 text-[12px] font-medium text-brand-text hover:bg-brand-bg"
                      >
                        {isOpen ? "Hide recipe" : "View recipe"}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleFavoriteRecipe(recipe.id)}
                        className={`inline-flex rounded-lg px-3 py-2 text-[12px] font-medium ${
                          favorite ? "bg-[#EAF5EF] text-brand-primary" : "text-brand-text/75 hover:bg-white"
                        }`}
                      >
                        {favorite ? "★ Favorite" : "☆ Favorite"}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleSkipRecipe(recipe.id)}
                        className={`inline-flex rounded-lg px-3 py-2 text-[12px] font-medium ${
                          skipped ? "bg-red-50 text-red-700" : "text-brand-text/75 hover:bg-white"
                        }`}
                      >
                        {skipped ? "Skipped" : "Skip"}
                      </button>

                      {canEdit ? (
                        <>
                          <Link
                            href={`/recipes/${recipe.id}/edit`}
                            className="inline-flex rounded-lg px-3 py-2 text-[12px] font-medium text-brand-text/75 hover:bg-white"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => deleteCustomRecipe(recipe.id)}
                            className="inline-flex rounded-lg px-3 py-2 text-[12px] font-medium text-red-700 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </>
                      ) : null}
                    </div>

                    {isOpen ? (
                      <section className="border-t border-brand-border/70 bg-white p-3 sm:p-4">
                        <h4 className="text-sm font-semibold text-brand-text">Ingredients</h4>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-brand-text/80">
                          {recipe.ingredients.map((rule, idx) => (
                            <li key={`${recipe.id}-ing-${idx}`}>
                              <span className="font-medium">{rule.label ?? rule.primary}</span>
                              {rule.alternatives?.length ? ` (alt: ${rule.alternatives.join(", ")})` : ""}
                              {rule.optional ? " [optional]" : ""}
                            </li>
                          ))}
                        </ul>
                        <h4 className="mt-3 text-sm font-semibold text-brand-text">Instructions</h4>
                        <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs text-brand-text/80">
                          {recipe.instructions.map((step, idx) => (
                            <li key={`${recipe.id}-step-${idx}`}>{step}</li>
                          ))}
                        </ol>
                      </section>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
