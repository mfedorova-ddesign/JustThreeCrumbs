import { GeneratedMeal, Ingredient, Macros } from "@/types";

export function sumCalories(ingredients: Ingredient[]): number {
  return Number(
    ingredients.reduce((acc, ingredient) => acc + ingredient.calories, 0).toFixed(1)
  );
}

export function sumMacros(ingredients: Ingredient[]): Macros {
  return {
    protein: Number(
      ingredients.reduce((acc, ingredient) => acc + ingredient.protein, 0).toFixed(1)
    ),
    fat: Number(
      ingredients.reduce((acc, ingredient) => acc + ingredient.fat, 0).toFixed(1)
    ),
    carbs: Number(
      ingredients.reduce((acc, ingredient) => acc + ingredient.carbs, 0).toFixed(1)
    )
  };
}

export function glycemicIndexAverage(ingredients: Ingredient[]): number {
  if (ingredients.length === 0) return 0;

  const totalCarbs = ingredients.reduce((acc, ingredient) => acc + ingredient.carbs, 0);
  if (totalCarbs === 0) return 0;

  const weightedGi = ingredients.reduce((acc, ingredient) => {
    const weight = ingredient.carbs / totalCarbs;
    return acc + ingredient.glycemicIndex * weight;
  }, 0);

  return Number(weightedGi.toFixed(1));
}

export function validateMeal(meal: GeneratedMeal, maxCarbs: number): boolean {
  return meal.macros.carbs <= maxCarbs && meal.glycemicIndex <= 55;
}
