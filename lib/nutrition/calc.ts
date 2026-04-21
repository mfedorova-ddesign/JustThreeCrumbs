import { GeneratedMeal, Ingredient, Macros } from "@/types";

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

export function glycemicIndexAverage(ingredients: Ingredient[]): number {
  if (ingredients.length === 0) return 0;

  const totalCarbs = ingredients.reduce(
    (acc, ingredient) => acc + ingredient.carbs * getPortionFactor(ingredient),
    0
  );
  if (totalCarbs === 0) {
    const simpleAverage =
      ingredients.reduce((acc, ingredient) => acc + ingredient.glycemicIndex, 0) / ingredients.length;
    return Number(simpleAverage.toFixed(1));
  }

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
 * Glycemic Load (GL = GI × carbs / 100).
 * Clinically validated metric used in diabetes management.
 * Low: ≤10 | Medium: 11–19 | High: ≥20
 */
export function glycemicLoad(ingredients: Ingredient[]): number {
  const gi = glycemicIndexAverage(ingredients);
  const macros = sumMacros(ingredients);
  return Number(((gi * macros.carbs) / 100).toFixed(1));
}

export function glycemicLoadLabel(gl: number): "low" | "medium" | "high" {
  if (gl <= 10) return "low";
  if (gl <= 19) return "medium";
  return "high";
}

const glycemicIndexThresholdByLevel = {
  low: 55,
  medium: 69,
  high: 100
} as const;

export function validateMeal(
  meal: GeneratedMeal,
  maxCarbs: number,
  glycemicIndexLevel: "low" | "medium" | "high" = "low"
): boolean {
  return (
    meal.macros.carbs <= maxCarbs &&
    meal.glycemicIndex <= glycemicIndexThresholdByLevel[glycemicIndexLevel]
  );
}
