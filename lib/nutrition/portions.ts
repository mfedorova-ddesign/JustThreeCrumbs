import { Ingredient } from "@/types";

/** Each generated meal is one plated serving for the person. */
export const MEAL_SERVINGS = 1;

export function ingredientPortionGrams(ingredient: Ingredient): number {
  return Math.round(ingredient.portionGrams ?? 100);
}

export function formatIngredientWithGrams(ingredient: Ingredient, label?: string): string {
  return `${label ?? ingredient.name} ${ingredientPortionGrams(ingredient)}g`;
}

export function mealServingSizeGrams(ingredients: Ingredient[]): number {
  return Math.round(
    ingredients.reduce((sum, ingredient) => sum + (ingredient.portionGrams ?? 100), 0)
  );
}

export function formatMealServingMeta(ingredients: Ingredient[]): string {
  const size = mealServingSizeGrams(ingredients);
  const label = MEAL_SERVINGS === 1 ? "1 serving" : `${MEAL_SERVINGS} servings`;
  return `${label} · ${size}g`;
}
