import { INGREDIENTS } from "@/lib/ingredients/data";
import { glycemicIndexAverage, glycemicLoad, isVeganMeal, isVegetarianMeal, sumCalories, sumFiber, sumMacros } from "@/lib/nutrition/calc";
import { Ingredient, Recipe } from "@/types";

const ingredientByName = new Map(INGREDIENTS.map((ingredient) => [ingredient.name.toLowerCase(), ingredient]));

function defaultPortionByCategory(category: Ingredient["category"]): number {
  if (category === "spices") return 3;
  if (category === "fats") return 10;
  if (category === "carbs") return 70;
  if (category === "liquid") return 100;
  if (category === "vegetables") return 100;
  return 110;
}

export function resolveRecipeBaseIngredients(recipe: Recipe): Ingredient[] {
  return recipe.ingredients
    .filter((rule) => !rule.optional)
    .map((rule) => ingredientByName.get(rule.primary.toLowerCase()))
    .filter((ingredient): ingredient is Ingredient => Boolean(ingredient))
    .map((ingredient) => ({
      ...ingredient,
      portionGrams: ingredient.portionGrams ?? defaultPortionByCategory(ingredient.category)
    }));
}

export function recipeAllergens(recipe: Recipe): string[] {
  const allergens = new Set<string>();
  recipe.ingredients.forEach((rule) => {
    [rule.primary, ...(rule.alternatives ?? [])].forEach((name) => {
      const ingredient = ingredientByName.get(name.toLowerCase());
      ingredient?.allergens?.forEach((allergen) => allergens.add(allergen));
    });
  });
  return [...allergens].sort((a, b) => a.localeCompare(b));
}

export function recipeVegan(recipe: Recipe): boolean {
  const ingredients = resolveRecipeBaseIngredients(recipe);
  return ingredients.length > 0 && isVeganMeal(ingredients);
}

export function recipeVegetarian(recipe: Recipe): boolean {
  const ingredients = resolveRecipeBaseIngredients(recipe);
  return ingredients.length > 0 && isVegetarianMeal(ingredients);
}

export function recipeNutrition(recipe: Recipe): {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
  glycemicIndex: number;
  glycemicLoad: number;
} {
  const ingredients = resolveRecipeBaseIngredients(recipe);
  const macros = sumMacros(ingredients);
  return {
    calories: sumCalories(ingredients),
    protein: macros.protein,
    fat: macros.fat,
    carbs: macros.carbs,
    fiber: sumFiber(ingredients),
    glycemicIndex: glycemicIndexAverage(ingredients),
    glycemicLoad: glycemicLoad(ingredients)
  };
}
