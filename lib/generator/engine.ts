import { INGREDIENTS } from "@/lib/ingredients/data";
import { glycemicIndexAverage, sumCalories, sumMacros, validateMeal } from "@/lib/nutrition/calc";
import { TEMPLATES } from "@/lib/templates/data";
import { DayPlan, DietType, GeneratedMeal, Ingredient, MealPlan, MealType, Template, UserProfile } from "@/types";

const templateSequenceByMealType: Record<MealType, string[]> = {
  breakfast: ["egg-dish", "chia-pudding"],
  lunch: ["vegetable-curry", "legume-soup", "quinoa-salad", "warm-bowl", "fish-dish", "baked-chicken"],
  dinner: ["warm-bowl", "vegetable-curry", "legume-soup", "fish-dish", "baked-chicken"],
  snack: ["chia-pudding", "quinoa-salad"]
};

function isTemplateAllowed(template: Template, dietType: DietType): boolean {
  if (dietType === "regular") return true;
  const includesAnimalProtein = template.ingredientSlots.protein.some((name) =>
    ["chicken breast", "salmon"].includes(name)
  );
  return !includesAnimalProtein;
}

function isIngredientAllowed(ingredient: Ingredient, user: UserProfile): boolean {
  if (user.dietType === "vegetarian" && !ingredient.vegetarian) return false;
  const allergySet = new Set(user.allergies.map((allergy) => allergy.toLowerCase().trim()));
  if (!ingredient.allergens?.length) return true;
  return !ingredient.allergens.some((allergen) => allergySet.has(allergen.toLowerCase()));
}

function pickFromSlot(slot: string[], user: UserProfile, usedNames: Set<string>): Ingredient[] {
  if (slot.length === 0) return [];
  const candidates = slot
    .map((name) => INGREDIENTS.find((ingredient) => ingredient.name === name))
    .filter((ingredient): ingredient is Ingredient => Boolean(ingredient))
    .filter((ingredient) => isIngredientAllowed(ingredient, user));

  if (candidates.length === 0) return [];

  const uniqueCandidate = candidates.find((candidate) => !usedNames.has(candidate.name));
  const picked = uniqueCandidate ?? candidates[0];
  usedNames.add(picked.name);
  return [picked];
}

export function selectTemplate(
  mealType: MealType,
  user: UserProfile,
  dayIndex: number
): Template {
  const orderedIds = templateSequenceByMealType[mealType];
  const matchingTemplates = orderedIds
    .map((id) => TEMPLATES.find((template) => template.id === id))
    .filter((template): template is Template => Boolean(template))
    .filter((template) => template.mealTypes.includes(mealType))
    .filter((template) => isTemplateAllowed(template, user.dietType));

  if (matchingTemplates.length === 0) {
    throw new Error(`No template available for ${mealType}`);
  }

  return matchingTemplates[dayIndex % matchingTemplates.length];
}

export function generateMeal(
  template: Template,
  mealType: MealType,
  user: UserProfile,
  dayIndex: number
): GeneratedMeal {
  const usedNames = new Set<string>();
  const ingredients = [
    ...pickFromSlot(template.ingredientSlots.protein, user, usedNames),
    ...pickFromSlot(template.ingredientSlots.vegetables, user, usedNames),
    ...pickFromSlot(template.ingredientSlots.carbs, user, usedNames),
    ...pickFromSlot(template.ingredientSlots.fats, user, usedNames),
    ...pickFromSlot(template.ingredientSlots.liquid, user, usedNames),
    ...pickFromSlot(template.ingredientSlots.spices, user, usedNames)
  ];

  const calories = sumCalories(ingredients);
  const macros = sumMacros(ingredients);
  const glycemicIndex = glycemicIndexAverage(ingredients);

  let meal: GeneratedMeal = {
    id: `${template.id}-${mealType}-${dayIndex}`,
    name: `${template.name} ${mealType[0].toUpperCase()}${mealType.slice(1)}`,
    templateId: template.id,
    mealType,
    ingredients,
    calories,
    macros,
    glycemicIndex,
    instructions: template.cookingSteps
  };

  if (!validateMeal(meal, template.constraints.maxCarbs)) {
    const reducedIngredients = meal.ingredients.filter((ingredient) => ingredient.category !== "carbs");
    meal = {
      ...meal,
      ingredients: reducedIngredients,
      calories: sumCalories(reducedIngredients),
      macros: sumMacros(reducedIngredients),
      glycemicIndex: glycemicIndexAverage(reducedIngredients)
    };
  }

  return meal;
}

function generateDayPlan(user: UserProfile, dayIndex: number): DayPlan {
  const breakfastTemplate = selectTemplate("breakfast", user, dayIndex);
  const lunchTemplate = selectTemplate("lunch", user, dayIndex + 1);
  const dinnerTemplate = selectTemplate("dinner", user, dayIndex + 2);
  const snackTemplate = selectTemplate("snack", user, dayIndex);

  return {
    day: dayIndex + 1,
    breakfast: generateMeal(breakfastTemplate, "breakfast", user, dayIndex),
    lunch: generateMeal(lunchTemplate, "lunch", user, dayIndex),
    dinner: generateMeal(dinnerTemplate, "dinner", user, dayIndex),
    snack: generateMeal(snackTemplate, "snack", user, dayIndex)
  };
}

export function generateMealPlan(user: UserProfile, days: number): MealPlan {
  const normalizedDays = [1, 3, 7].includes(days) ? days : 1;
  const dayPlans = Array.from({ length: normalizedDays }, (_, dayIndex) =>
    generateDayPlan(user, dayIndex)
  );

  return {
    id: `plan-${Date.now()}`,
    createdAt: new Date().toISOString(),
    userProfile: user,
    days: dayPlans
  };
}
