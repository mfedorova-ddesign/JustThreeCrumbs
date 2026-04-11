import { INGREDIENTS } from "@/lib/ingredients/data";
import { recipeNutrition } from "@/lib/recipes/insights";
import { MealType, Recipe, RecipeIngredientRule } from "@/types";

export type RecipeFormState = {
  name: string;
  mealTypes: MealType[];
  ingredientsText: string;
  instructionsText: string;
  maxCarbs: string;
  glycemicIndex: "low" | "medium" | "high";
};

const ingredientByName = new Map(INGREDIENTS.map((ingredient) => [ingredient.name.toLowerCase(), ingredient]));

export const mealTypeLabels: Record<MealType, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack"
};

export function makeEmptyRecipeForm(): RecipeFormState {
  return {
    name: "",
    mealTypes: ["lunch"],
    ingredientsText: "",
    instructionsText: "",
    maxCarbs: "45",
    glycemicIndex: "low"
  };
}

export function toRecipeForm(recipe: Recipe): RecipeFormState {
  return {
    name: recipe.name,
    mealTypes: recipe.mealTypes,
    ingredientsText: recipe.ingredients
      .map((rule) =>
        `${rule.primary}${rule.alternatives?.length ? ` -> ${rule.alternatives.join(", ")}` : ""}${
          rule.optional ? " [optional]" : ""
        }`
      )
      .join("\n"),
    instructionsText: recipe.instructions.join("\n"),
    maxCarbs: String(recipe.constraints.maxCarbs),
    glycemicIndex: recipe.constraints.glycemicIndex
  };
}

function parseIngredients(ingredientsText: string): RecipeIngredientRule[] {
  const lines = ingredientsText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const out: RecipeIngredientRule[] = [];
  lines.forEach((line) => {
    const optional = /\[optional\]/i.test(line);
    const clean = line.replace(/\[optional\]/gi, "").trim();
    const [left, right] = clean.split("->").map((part) => part.trim());
    const primaryIngredient = ingredientByName.get(left.toLowerCase());
    if (!primaryIngredient) return;
    const alternatives =
      right
        ?.split(",")
        .map((name) => name.trim())
        .filter(Boolean)
        .filter((name) => ingredientByName.has(name.toLowerCase())) ?? [];
    out.push({
      category: primaryIngredient.category,
      primary: primaryIngredient.name,
      alternatives: alternatives.map((name) => ingredientByName.get(name.toLowerCase())?.name ?? name),
      optional,
      adjustable: true
    });
  });
  return out;
}

export function buildRecipePayload(form: RecipeFormState): Omit<Recipe, "id" | "source"> | null {
  const ingredients = parseIngredients(form.ingredientsText);
  const instructions = form.instructionsText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  if (!form.name.trim() || form.mealTypes.length === 0 || ingredients.length === 0 || instructions.length === 0) {
    return null;
  }
  return {
    name: form.name.trim(),
    mealTypes: form.mealTypes,
    ingredients,
    constraints: {
      maxCarbs: Number(form.maxCarbs) > 0 ? Number(form.maxCarbs) : 45,
      glycemicIndex: form.glycemicIndex
    },
    instructions
  };
}

export function computeRecipeMetricsFromForm(form: RecipeFormState): ReturnType<typeof recipeNutrition> | null {
  const payload = buildRecipePayload(form);
  if (!payload) return null;
  const draftRecipe: Recipe = {
    id: "draft-recipe",
    source: "custom",
    ...payload
  };
  return recipeNutrition(draftRecipe);
}
