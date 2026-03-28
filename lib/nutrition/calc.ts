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
  if (totalCarbs === 0) return 0;

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

export function diabeticScore(ingredients: Ingredient[]): number {
  const macros = sumMacros(ingredients);
  const fiber = sumFiber(ingredients);
  const gi = glycemicIndexAverage(ingredients);
  const calories = sumCalories(ingredients);

  const giPenalty = Math.max(0, (gi - 40) / 4.5);
  const carbPenalty = Math.max(0, (macros.carbs - 35) / 10);
  const fiberBonus = Math.min(2, fiber / 6);
  const proteinBonus = Math.min(1.5, macros.protein / 20);
  const caloriePenalty = calories > 750 ? (calories - 750) / 200 : 0;

  const score = 7.5 + fiberBonus + proteinBonus - giPenalty - carbPenalty - caloriePenalty;
  return Number(Math.max(1, Math.min(10, score)).toFixed(1));
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
