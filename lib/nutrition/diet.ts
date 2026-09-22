import { isVeganIngredient, isVeganMeal, isVegetarianMeal } from "@/lib/nutrition/calc";
import { DietType, Ingredient } from "@/types";

const SEAFOOD_ALLERGENS = new Set(["fish", "shellfish"]);

export const DIET_TYPE_OPTIONS: {
  id: DietType;
  label: string;
  description: string;
}[] = [
  {
    id: "omnivore",
    label: "Omnivore",
    description: "Everything — meat, fish, dairy, and plants"
  },
  {
    id: "vegetarian",
    label: "Vegetarian",
    description: "No meat or fish; dairy and eggs OK"
  },
  {
    id: "vegan",
    label: "Vegan",
    description: "Plant-based only — no animal products"
  },
  {
    id: "pescatarian",
    label: "Pescatarian",
    description: "Vegetarian plus fish and seafood"
  },
  {
    id: "seagan",
    label: "Seagan",
    description: "Vegan plus fish and seafood"
  }
];

/** Maps legacy stored values (e.g. "regular") onto current DietType ids. */
export function normalizeDietType(dietType: string | undefined | null): DietType {
  if (dietType === "regular") return "omnivore";
  if (
    dietType === "omnivore" ||
    dietType === "vegetarian" ||
    dietType === "vegan" ||
    dietType === "pescatarian" ||
    dietType === "seagan"
  ) {
    return dietType;
  }
  return "omnivore";
}

export function isSeafoodIngredient(ingredient: Ingredient): boolean {
  return (
    ingredient.allergens?.some((allergen) => SEAFOOD_ALLERGENS.has(allergen.toLowerCase())) ?? false
  );
}

/** Whether a single ingredient is allowed under the user's diet type. */
export function ingredientFitsDiet(ingredient: Ingredient, dietType: DietType | string): boolean {
  const diet = normalizeDietType(dietType);
  switch (diet) {
    case "omnivore":
      return true;
    case "vegetarian":
      return ingredient.vegetarian;
    case "vegan":
      return isVeganIngredient(ingredient);
    case "pescatarian":
      return ingredient.vegetarian || isSeafoodIngredient(ingredient);
    case "seagan":
      return isVeganIngredient(ingredient) || isSeafoodIngredient(ingredient);
    default:
      return true;
  }
}

export function mealFitsDiet(ingredients: Ingredient[], dietType: DietType | string): boolean {
  return ingredients.length > 0 && ingredients.every((ingredient) => ingredientFitsDiet(ingredient, dietType));
}

/**
 * Library recipe must match the diet's "default plate" identity (not just substitutable alts),
 * so vegetarian menus never surface fish-titled dishes via tofu swaps.
 */
export function recipeFitsDietType(
  dietType: DietType | string,
  baseIngredients: Ingredient[]
): boolean {
  if (baseIngredients.length === 0) return false;
  const diet = normalizeDietType(dietType);
  const isVegetarianPlate = isVegetarianMeal(baseIngredients);
  const isVeganPlate = isVeganMeal(baseIngredients);
  const hasSeafood = baseIngredients.some((ingredient) => isSeafoodIngredient(ingredient));

  switch (diet) {
    case "omnivore":
      return true;
    case "vegetarian":
      return isVegetarianPlate;
    case "vegan":
      return isVeganPlate;
    case "pescatarian":
      return isVegetarianPlate || hasSeafood;
    case "seagan":
      return isVeganPlate || hasSeafood;
    default:
      return true;
  }
}
