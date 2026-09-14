import { GeneratedMeal, Ingredient, Macros } from "@/types";

/** High glycemic load starts at this value (standard per-meal thresholds). */
export const GL_HIGH_THRESHOLD = 20;
export const GL_LOW_MAX = 10;
/** Do not show a GL badge when the dish has almost no carbohydrate. */
export const NEAR_ZERO_CARBS_G = 5;
/** Hide the GL badge when less than this share of carbs has a known GI. */
export const GI_COVERAGE_MIN = 0.8;

function getPortionFactor(ingredient: Ingredient): number {
  const grams = ingredient.portionGrams ?? 100;
  return grams / 100;
}

export function sumCalories(ingredients: Ingredient[]): number {
  return Number(
    ingredients
      .reduce((acc, ingredient) => acc + ingredient.calories * getPortionFactor(ingredient), 0)
      .toFixed(1)
  );
}

export function sumMacros(ingredients: Ingredient[]): Macros {
  return {
    protein: Number(
      ingredients
        .reduce((acc, ingredient) => acc + ingredient.protein * getPortionFactor(ingredient), 0)
        .toFixed(1)
    ),
    fat: Number(
      ingredients
        .reduce((acc, ingredient) => acc + ingredient.fat * getPortionFactor(ingredient), 0)
        .toFixed(1)
    ),
    carbs: Number(
      ingredients
        .reduce((acc, ingredient) => acc + ingredient.carbs * getPortionFactor(ingredient), 0)
        .toFixed(1)
    )
  };
}

export function sumFiber(ingredients: Ingredient[]): number {
  return Number(
    ingredients
      .reduce(
        (acc, ingredient) => acc + (ingredient.fiber ?? 0) * getPortionFactor(ingredient),
        0
      )
      .toFixed(1)
  );
}

/** Available (non-fiber) carbohydrate grams in this portion. */
export function availableCarbsGrams(ingredient: Ingredient): number {
  const per100 = Math.max(0, ingredient.carbs - (ingredient.fiber ?? 0));
  return per100 * getPortionFactor(ingredient);
}

function ingredientGiIsKnown(ingredient: Ingredient): boolean {
  const availablePer100 = Math.max(0, ingredient.carbs - (ingredient.fiber ?? 0));
  if (availablePer100 < 1) return true;
  return ingredient.glycemicIndex > 0;
}

export function giCoverageRatio(ingredients: Ingredient[]): number {
  const total = ingredients.reduce((acc, ingredient) => acc + availableCarbsGrams(ingredient), 0);
  if (total <= 0) return 1;
  const covered = ingredients.reduce((acc, ingredient) => {
    if (!ingredientGiIsKnown(ingredient)) return acc;
    return acc + availableCarbsGrams(ingredient);
  }, 0);
  return covered / total;
}

/**
 * Kept for engine internals. Not shown in the UI — a composite GI is only an estimate.
 * Near-zero-carb dishes return 0 instead of a meaningless average of ingredient GIs.
 */
export function glycemicIndexAverage(ingredients: Ingredient[]): number {
  if (ingredients.length === 0) return 0;

  const totalCarbs = ingredients.reduce(
    (acc, ingredient) => acc + ingredient.carbs * getPortionFactor(ingredient),
    0
  );
  if (totalCarbs < NEAR_ZERO_CARBS_G) return 0;

  const weightedGi = ingredients.reduce((acc, ingredient) => {
    const ingredientCarbs = ingredient.carbs * getPortionFactor(ingredient);
    const weight = ingredientCarbs / totalCarbs;
    return acc + ingredient.glycemicIndex * weight;
  }, 0);

  return Number(weightedGi.toFixed(1));
}

export function isVegetarianMeal(ingredients: Ingredient[]): boolean {
  return ingredients.every((ingredient) => ingredient.vegetarian);
}

export function isVeganMeal(ingredients: Ingredient[]): boolean {
  const nonVeganNames = new Set(["eggs", "egg whites", "greek yogurt", "cottage cheese", "feta cheese"]);
  return ingredients.every(
    (ingredient) => ingredient.vegetarian && !nonVeganNames.has(ingredient.name.toLowerCase())
  );
}

/**
 * Glycemic load on the current portion: Σ(GI × available carbs g) / 100.
 * Not rounded — round only grams in the UI.
 */
export function glycemicLoad(ingredients: Ingredient[]): number {
  return ingredients.reduce((acc, ingredient) => {
    return acc + (ingredient.glycemicIndex * availableCarbsGrams(ingredient)) / 100;
  }, 0);
}

export function glycemicLoadLabel(gl: number): "low" | "medium" | "high" {
  if (gl <= GL_LOW_MAX) return "low";
  if (gl < GL_HIGH_THRESHOLD) return "medium";
  return "high";
}

export function glycemicLoadRangeLabel(gl: number): "Low" | "Medium" | "High" {
  const level = glycemicLoadLabel(gl);
  if (level === "low") return "Low";
  if (level === "medium") return "Medium";
  return "High";
}

export function shouldShowGlycemicLoadBadge(ingredients: Ingredient[]): boolean {
  if (sumMacros(ingredients).carbs < NEAR_ZERO_CARBS_G) return false;
  return giCoverageRatio(ingredients) >= GI_COVERAGE_MIN;
}

export function isHighGlycemicLoad(gl: number): boolean {
  return gl >= GL_HIGH_THRESHOLD;
}

export function validateMeal(meal: GeneratedMeal, maxCarbs: number): boolean {
  return meal.macros.carbs <= maxCarbs && meal.glycemicLoad < GL_HIGH_THRESHOLD;
}
