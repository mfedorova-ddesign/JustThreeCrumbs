import { recommendedDailyTargets } from "@/lib/generator/targets";
import { composeMealCopy, normalizeAllergySet } from "@/lib/generator/meal-copy";
import { INGREDIENTS } from "@/lib/ingredients/data";
import {
  GL_HIGH_THRESHOLD,
  glycemicIndexAverage,
  glycemicLoad,
  isVeganIngredient,
  isVeganMeal,
  isVegetarianMeal,
  sumCalories,
  sumFiber,
  sumMacros
} from "@/lib/nutrition/calc";
import { FIXED_RECIPES } from "@/lib/recipes/data";
import { recipeVegan, recipeVegetarian } from "@/lib/recipes/insights";
import { DayPlan, GeneratedMeal, Ingredient, MealPlan, MealType, Recipe, RecipeIngredientRule, UserProfile } from "@/types";

const ingredientByName = new Map(INGREDIENTS.map((ingredient) => [ingredient.name, ingredient]));

/** Day calorie/carb totals must stay within this band of profile targets. */
const DAY_TARGET_TOLERANCE = 0.1;

const recipeSequenceByMealType: Record<MealType, string[]> = {
  breakfast: [
    "recipe-shakshuka-toast",
    "recipe-eggs-benedict-avocado",
    "recipe-omelet-goat-cheese",
    "recipe-chia-pudding-berries",
    "recipe-savory-oats-eggs",
    "recipe-yogurt-berries-nuts",
    "recipe-protein-salad-plate"
  ],
  lunch: [
    "recipe-green-curry",
    "recipe-legume-soup",
    "recipe-broccoli-cheddar-soup",
    "recipe-ribeye-herb-butter",
    "recipe-salmon-caper-sauce",
    "recipe-caesar-salad-keto",
    "recipe-duck-orange",
    "recipe-cauliflower-steak-harissa",
    "recipe-protein-salad-plate",
    "recipe-buckwheat-skillet",
    "recipe-lemon-herb-bake",
    "recipe-herb-baked-fish",
    "recipe-tuna-salad",
    "recipe-baked-eggplant",
    "recipe-borscht-style"
  ],
  dinner: [
    "recipe-ribeye-herb-butter",
    "recipe-salmon-caper-sauce",
    "recipe-caesar-salad-keto",
    "recipe-duck-orange",
    "recipe-cauliflower-steak-harissa",
    "recipe-buckwheat-skillet",
    "recipe-green-curry",
    "recipe-legume-soup",
    "recipe-broccoli-cheddar-soup",
    "recipe-herb-baked-fish",
    "recipe-lemon-herb-bake",
    "recipe-tuna-salad",
    "recipe-baked-eggplant",
    "recipe-borscht-style",
    "recipe-protein-salad-plate"
  ],
  snack: [
    "recipe-snack-tuna-cup",
    "recipe-snack-egg-cucumber",
    "recipe-snack-hummus-veggies",
    "recipe-snack-yogurt-berry",
    "recipe-snack-apple-cottage",
    "recipe-snack-chocolate-nuts",
    "recipe-keto-chocolate-truffles",
    "recipe-keto-panna-cotta",
    "recipe-keto-mascarpone-mousse",
    "recipe-keto-brownies",
    "recipe-chia-pudding-berries",
    "recipe-protein-salad-plate"
  ]
};

export type RecipeSelectionOptions = {
  recipes?: Recipe[];
  favoriteRecipeIds?: string[];
  skippedRecipeIds?: string[];
};

function mealCalorieShare(mealType: MealType): number {
  const shares: Record<MealType, number> = {
    breakfast: 0.27,
    lunch: 0.35,
    dinner: 0.23,
    snack: 0.15
  };
  return shares[mealType];
}

function mealTargetFromDaily(
  daily: { calories: number; protein: number; fat: number; carbs: number; fiber: number },
  mealType: MealType
): { calories: number; protein: number; fat: number; carbs: number; fiber: number } {
  const share = mealCalorieShare(mealType);
  return {
    calories: daily.calories * share,
    protein: daily.protein * share,
    fat: daily.fat * share,
    carbs: daily.carbs * share,
    fiber: daily.fiber * share
  };
}

function getAllergySet(user: UserProfile): Set<string> {
  return normalizeAllergySet(user.allergies);
}

function isIngredientAllowed(ingredient: Ingredient, user: UserProfile, allergySet: Set<string>): boolean {
  if (user.dietType === "vegetarian" && !ingredient.vegetarian) return false;
  if (!ingredient.allergens?.length) return true;
  return !ingredient.allergens.some((allergen) => allergySet.has(allergen.toLowerCase()));
}

function getIngredientPortionGrams(ingredient: Ingredient, mealType: MealType): number {
  const byCategory: Record<Ingredient["category"], number> = {
    protein: mealType === "snack" ? 80 : 130,
    vegetables: mealType === "snack" ? 80 : 120,
    carbs: mealType === "snack" ? 35 : 70,
    fats: mealType === "snack" ? 8 : 12,
    liquid: mealType === "snack" ? 80 : 120,
    spices: 3
  };
  const byName: Record<string, number> = {
    eggs: 100,
    "egg whites": 120,
    "chia seeds": 20,
    "olive oil": 10,
    tahini: 12,
    "almond butter": 12,
    "greek yogurt": mealType === "snack" ? 100 : 120,
    "unsweetened almond milk": mealType === "snack" ? 120 : 180,
    "light coconut milk": 80,
    "lemon juice": 15,
    turmeric: 3,
    cinnamon: 3,
    cumin: 3,
    paprika: 3,
    "black pepper": 2,
    garlic: 5,
    oregano: 2,
    vanilla: 2,
    berries: mealType === "snack" ? 60 : 80,
    oats: mealType === "snack" ? 35 : 55,
    "sourdough bread": 45,
    "brown rice": mealType === "snack" ? 50 : 80,
    tuna: mealType === "snack" ? 90 : 120,
    hummus: mealType === "snack" ? 45 : 55,
    "cottage cheese": mealType === "snack" ? 90 : 110,
    apple: mealType === "snack" ? 70 : 90,
    corn: mealType === "snack" ? 50 : 70,
    "dark chocolate": mealType === "snack" ? 18 : 22,
    almonds: mealType === "snack" ? 22 : 30
  };
  return byName[ingredient.name] ?? byCategory[ingredient.category];
}

function clampPortion(ingredient: Ingredient, grams: number): number {
  const bounds: Record<Ingredient["category"], { min: number; max: number }> = {
    protein: { min: 70, max: 280 },
    vegetables: { min: 60, max: 280 },
    carbs: { min: 20, max: 150 },
    fats: { min: 4, max: 24 },
    liquid: { min: 30, max: 220 },
    spices: { min: 1, max: 6 }
  };
  const range = bounds[ingredient.category];
  return Math.round(Math.max(range.min, Math.min(range.max, grams)));
}

function scaleCategoryPortions(
  ingredients: Ingredient[],
  categories: Ingredient["category"][],
  factor: number
): Ingredient[] {
  return ingredients.map((ingredient) => {
    if (!categories.includes(ingredient.category)) return ingredient;
    const current = ingredient.portionGrams ?? 100;
    return { ...ingredient, portionGrams: clampPortion(ingredient, current * factor) };
  });
}

function scaleIngredientsToCalorieTarget(
  ingredients: Ingredient[],
  mealType: MealType,
  targetCalories: number
): Ingredient[] {
  const baseCalories = sumCalories(ingredients);
  if (baseCalories <= 0) return ingredients;
  const rawScale = targetCalories / baseCalories;
  const scale = Math.max(0.75, Math.min(1.85, rawScale));
  return ingredients.map((ingredient) => {
    const current = ingredient.portionGrams ?? getIngredientPortionGrams(ingredient, mealType);
    const shouldStayStable = ingredient.category === "spices";
    return {
      ...ingredient,
      portionGrams: shouldStayStable ? current : Math.round(current * scale)
    };
  });
}

function fitMealToTarget(
  ingredients: Ingredient[],
  target: { calories: number; protein: number; fat: number; carbs: number; fiber: number }
): Ingredient[] {
  let current = ingredients;
  for (let i = 0; i < 4; i += 1) {
    const macros = sumMacros(current);
    const calories = sumCalories(current);
    const fiber = sumFiber(current);
    if (macros.protein < target.protein * 0.9) {
      current = scaleCategoryPortions(current, ["protein"], 1.18);
    } else if (macros.protein > target.protein * 1.15) {
      current = scaleCategoryPortions(current, ["protein"], 0.92);
    }
    if (macros.carbs > target.carbs * 1.12) {
      current = scaleCategoryPortions(current, ["carbs"], 0.88);
    } else if (macros.carbs < target.carbs * 0.88) {
      current = scaleCategoryPortions(current, ["carbs"], 1.08);
    }
    if (macros.fat > target.fat * 1.15) {
      current = scaleCategoryPortions(current, ["fats"], 0.9);
    } else if (macros.fat < target.fat * 0.85) {
      current = scaleCategoryPortions(current, ["fats"], 1.1);
    }
    if (fiber < target.fiber * 0.85) {
      current = scaleCategoryPortions(current, ["vegetables"], 1.12);
    }
    if (calories > target.calories * 1.1) {
      current = scaleCategoryPortions(current, ["carbs", "fats"], 0.92);
    } else if (calories < target.calories * 0.9) {
      current = scaleCategoryPortions(current, ["protein", "carbs", "vegetables"], 1.12);
    }
  }
  return current;
}

function pickIngredientName(
  rule: RecipeIngredientRule,
  user: UserProfile,
  allergySet: Set<string>,
  offset: number,
  dietLock?: { vegan: boolean; vegetarian: boolean }
): string | null {
  const names = [rule.primary, ...(rule.alternatives ?? [])];
  const allowed = names.filter((name) => {
    const ingredient = ingredientByName.get(name);
    if (!ingredient || !isIngredientAllowed(ingredient, user, allergySet)) return false;
    if (dietLock?.vegan && !isVeganIngredient(ingredient)) return false;
    if (dietLock?.vegetarian && !ingredient.vegetarian) return false;
    return true;
  });
  if (allowed.length === 0) return null;
  // Prefer the recipe primary so library tags stay aligned with the plated dish when possible.
  if (allowed.includes(rule.primary) && offset % 3 !== 0) return rule.primary;
  return allowed[offset % allowed.length];
}

function recipeAllowedForUser(recipe: Recipe, user: UserProfile): boolean {
  const allergySet = getAllergySet(user);
  const dietLock = { vegan: recipeVegan(recipe), vegetarian: recipeVegetarian(recipe) };
  return recipe.ingredients.every((rule) => {
    const names = [rule.primary, ...(rule.alternatives ?? [])];
    const hasAny = names.some((name) => {
      const ingredient = ingredientByName.get(name);
      if (!ingredient || !isIngredientAllowed(ingredient, user, allergySet)) return false;
      if (dietLock.vegan && !isVeganIngredient(ingredient)) return false;
      if (dietLock.vegetarian && !ingredient.vegetarian) return false;
      return true;
    });
    return rule.optional || hasAny;
  });
}

function resolveRecipeIngredients(
  recipe: Recipe,
  user: UserProfile,
  mealType: MealType,
  seed: number
): { ingredient: Ingredient; alternatives: string[] }[] {
  const allergySet = getAllergySet(user);
  const dietLock = { vegan: recipeVegan(recipe), vegetarian: recipeVegetarian(recipe) };
  const selected: { ingredient: Ingredient; alternatives: string[] }[] = [];
  for (let i = 0; i < recipe.ingredients.length; i += 1) {
    const rule = recipe.ingredients[i];
    const pickedName = pickIngredientName(rule, user, allergySet, seed + i * 37, dietLock);
    if (!pickedName) continue;
    const ingredient = ingredientByName.get(pickedName);
    if (!ingredient) continue;
    const ruleNames = [rule.primary, ...(rule.alternatives ?? [])];
    const alternatives = ruleNames.filter((name) => {
      const option = ingredientByName.get(name);
      if (!option) return false;
      if (dietLock.vegan && !isVeganIngredient(option)) return false;
      if (dietLock.vegetarian && !option.vegetarian) return false;
      return true;
    });
    selected.push({
      ingredient: { ...ingredient, portionGrams: getIngredientPortionGrams(ingredient, mealType) },
      alternatives
    });
  }
  return selected;
}

function capGlycemicLoad(ingredients: Ingredient[]): Ingredient[] {
  let current = ingredients;
  for (let i = 0; i < 10; i += 1) {
    if (glycemicLoad(current) < GL_HIGH_THRESHOLD) return current;
    current = scaleCategoryPortions(current, ["carbs"], 0.8);
    if (i >= 4) {
      current = current.map((ingredient) => {
        if (ingredient.category !== "carbs" || ingredient.glycemicIndex <= 55) return ingredient;
        const grams = ingredient.portionGrams ?? 100;
        return { ...ingredient, portionGrams: Math.max(20, Math.round(grams * 0.85)) };
      });
    }
  }
  return current;
}

function enforceRecipeConstraints(
  ingredients: Ingredient[],
  recipe: Recipe,
  target: { calories: number; protein: number; fat: number; carbs: number; fiber: number }
): Ingredient[] {
  let current = ingredients;
  const dropOptionalCarbNames = new Set(
    recipe.ingredients
      .filter((rule) => rule.optional && rule.category === "carbs")
      .map((rule) => rule.primary)
  );
  for (let i = 0; i < 4; i += 1) {
    const carbs = sumMacros(current).carbs;
    const gl = glycemicLoad(current);
    if (carbs <= recipe.constraints.maxCarbs && gl < GL_HIGH_THRESHOLD) break;
    if (dropOptionalCarbNames.size > 0) {
      current = current.filter((ingredient) => !dropOptionalCarbNames.has(ingredient.name));
    }
    if (sumMacros(current).carbs > recipe.constraints.maxCarbs) {
      current = scaleCategoryPortions(current, ["carbs"], 0.84);
    }
    if (glycemicLoad(current) >= GL_HIGH_THRESHOLD) {
      current = current.filter((ingredient) => ingredient.category !== "carbs" || ingredient.glycemicIndex <= 55);
      current = scaleCategoryPortions(current, ["carbs"], 0.88);
    }
    current = fitMealToTarget(current, target);
  }
  return capGlycemicLoad(current);
}

function buildMeal(
  recipe: Recipe,
  mealType: MealType,
  dayIndex: number,
  seed: number,
  resolved: { ingredient: Ingredient; alternatives: string[] }[],
  allergySet: Set<string>
): GeneratedMeal {
  const ingredients = resolved.map((r) => r.ingredient);
  const { name, instructions } = composeMealCopy({
    ingredients,
    recipe,
    sourceInstructions: recipe.instructions,
    allergySet
  });
  return {
    id: `${recipe.id}-${mealType}-${dayIndex}-${Math.abs(seed % 100000)}`,
    name,
    templateId: recipe.id,
    mealType,
    ingredients,
    ruleAlternatives: resolved.map((r) => r.alternatives),
    calories: sumCalories(ingredients),
    macros: sumMacros(ingredients),
    fiber: sumFiber(ingredients),
    glycemicIndex: glycemicIndexAverage(ingredients),
    glycemicLoad: glycemicLoad(ingredients),
    // Library tags stay identical to generated-plan tags for the same recipe.
    isVegetarian: recipeVegetarian(recipe),
    isVegan: recipeVegan(recipe),
    instructions
  };
}

function selectRecipe(
  mealType: MealType,
  user: UserProfile,
  dayIndex: number,
  seed: number,
  excludedRecipeIds: string[] = [],
  options: RecipeSelectionOptions = {}
): Recipe {
  const recipeSource = options.recipes && options.recipes.length > 0 ? options.recipes : FIXED_RECIPES;
  const skipped = new Set(options.skippedRecipeIds ?? []);
  const favorites = new Set(options.favoriteRecipeIds ?? []);
  const orderedIds = recipeSequenceByMealType[mealType];
  const basePool = orderedIds
    .map((id) => recipeSource.find((recipe) => recipe.id === id))
    .filter((recipe): recipe is Recipe => Boolean(recipe))
    .filter((recipe) => recipe.mealTypes.includes(mealType))
    .filter((recipe) => recipeAllowedForUser(recipe, user))
    .filter((recipe) => !excludedRecipeIds.includes(recipe.id))
    .filter((recipe) => !skipped.has(recipe.id));
  const customPool = recipeSource.filter(
    (recipe) =>
      !orderedIds.includes(recipe.id) &&
      recipe.mealTypes.includes(mealType) &&
      recipeAllowedForUser(recipe, user) &&
      !excludedRecipeIds.includes(recipe.id) &&
      !skipped.has(recipe.id)
  );
  const allEligible = [...(basePool.length > 0 ? basePool : recipeSource.filter(
    (recipe) =>
      recipe.mealTypes.includes(mealType) &&
      recipeAllowedForUser(recipe, user) &&
      !excludedRecipeIds.includes(recipe.id) &&
      !skipped.has(recipe.id)
  )), ...customPool];
  if (allEligible.length === 0) {
    throw new Error(`No recipe available for ${mealType} and current dietary constraints.`);
  }
  const weighted = [
    ...allEligible,
    ...allEligible.filter((recipe) => favorites.has(recipe.id)),
    ...allEligible.filter((recipe) => favorites.has(recipe.id))
  ];
  const index = Math.abs(dayIndex + seed) % weighted.length;
  return weighted[index];
}

function generateMealFromRecipe(
  recipe: Recipe,
  mealType: MealType,
  user: UserProfile,
  dayIndex: number,
  seed: number,
  target: { calories: number; protein: number; fat: number; carbs: number; fiber: number }
): GeneratedMeal {
  const resolved = resolveRecipeIngredients(recipe, user, mealType, seed);
  if (resolved.length === 0) {
    throw new Error(`Recipe ${recipe.id} has no allowed ingredients for current profile.`);
  }
  let ingredients = resolved.map((r) => r.ingredient);
  ingredients = scaleIngredientsToCalorieTarget(ingredients, mealType, target.calories);
  ingredients = fitMealToTarget(ingredients, target);
  ingredients = enforceRecipeConstraints(ingredients, recipe, target);
  ingredients = capGlycemicLoad(ingredients);
  // Re-attach alternatives by name (enforceRecipeConstraints may remove some ingredients)
  const altsByName = new Map(resolved.map((r) => [r.ingredient.name, r.alternatives]));
  const scaledResolved = ingredients.map((ing) => ({
    ingredient: ing,
    alternatives: altsByName.get(ing.name) ?? []
  }));
  return buildMeal(recipe, mealType, dayIndex, seed, scaledResolved, getAllergySet(user));
}

export type RegenerateSingleMealOptions = {
  excludedTemplateIds?: string[];
  isExtraSnack?: boolean;
  selection?: RecipeSelectionOptions;
};

export function regenerateSingleMeal(
  user: UserProfile,
  mealType: MealType,
  dayIndex: number,
  variationSeed: number,
  options: RegenerateSingleMealOptions = {}
): GeneratedMeal {
  const dailyTargets = recommendedDailyTargets(user);
  let target: { calories: number; protein: number; fat: number; carbs: number; fiber: number };
  if (options.isExtraSnack) {
    target = {
      calories: dailyTargets.calories * 0.12,
      protein: dailyTargets.protein * 0.14,
      fat: dailyTargets.fat * 0.12,
      carbs: dailyTargets.carbs * 0.1,
      fiber: dailyTargets.fiber * 0.18
    };
  } else {
    target = mealTargetFromDaily(dailyTargets, mealType);
  }
  return generateMealPreferringLowGl(user, mealType, dayIndex, variationSeed, target, options);
}

function generateMealPreferringLowGl(
  user: UserProfile,
  mealType: MealType,
  dayIndex: number,
  seed: number,
  target: { calories: number; protein: number; fat: number; carbs: number; fiber: number },
  options: { excludedTemplateIds?: string[]; selection?: RecipeSelectionOptions } = {}
): GeneratedMeal {
  const excluded = [...(options.excludedTemplateIds ?? [])];
  let lastMeal: GeneratedMeal | null = null;
  for (let attempt = 0; attempt < 16; attempt += 1) {
    const recipe = selectRecipe(mealType, user, dayIndex, seed + attempt * 911, excluded, options.selection);
    const meal = {
      ...generateMealFromRecipe(recipe, mealType, user, dayIndex, seed + attempt * 911, target),
      skipped: false as const
    };
    lastMeal = meal;
    if (meal.glycemicLoad < GL_HIGH_THRESHOLD) return meal;
    excluded.push(recipe.id);
  }
  if (!lastMeal || lastMeal.glycemicLoad >= GL_HIGH_THRESHOLD) {
    throw new Error(`Unable to generate ${mealType} with glycemic load below ${GL_HIGH_THRESHOLD}.`);
  }
  return lastMeal;
}

function dayTotals(day: DayPlan): { calories: number; protein: number; fat: number; carbs: number; fiber: number } {
  const meals = [day.breakfast, day.lunch, day.dinner, day.snack, day.extraSnack].filter(
    Boolean
  ) as GeneratedMeal[];
  return meals.reduce(
    (acc, meal) => {
      if (meal.skipped) return acc;
      acc.calories += meal.calories;
      acc.protein += meal.macros.protein;
      acc.fat += meal.macros.fat;
      acc.carbs += meal.macros.carbs;
      acc.fiber += meal.fiber;
      return acc;
    },
    { calories: 0, protein: 0, fat: 0, carbs: 0, fiber: 0 }
  );
}

function dayLoss(
  day: DayPlan,
  targets: { calories: number; protein: number; fat: number; carbs: number; fiber: number }
): number {
  const totals = dayTotals(day);
  const rel = (actual: number, target: number) => Math.abs(actual - target) / Math.max(1, target);
  const overshoot = (actual: number, target: number) => Math.max(0, actual - target) / Math.max(1, target);
  const calorieTerm = rel(totals.calories, targets.calories);
  const proteinTerm = rel(totals.protein, targets.protein);
  const fatTerm = rel(totals.fat, targets.fat) + overshoot(totals.fat, targets.fat) * 0.35;
  const carbsTerm = rel(totals.carbs, targets.carbs) + overshoot(totals.carbs, targets.carbs) * 0.45;
  const fiberTerm = rel(totals.fiber, targets.fiber);
  return calorieTerm * 2.8 + proteinTerm * 1.4 + fatTerm * 0.9 + carbsTerm * 2.6 + fiberTerm * 1.2;
}

function needsExtraSnack(
  day: DayPlan,
  targets: { calories: number; protein: number; fat: number; carbs: number; fiber: number }
): boolean {
  const totals = dayTotals(day);
  return (
    totals.calories < targets.calories * 0.9 ||
    totals.carbs < targets.carbs * 0.9 ||
    totals.protein < targets.protein * 0.87 ||
    totals.fiber < targets.fiber * 0.8
  );
}

function dayWithinTargetBand(
  day: DayPlan,
  targets: { calories: number; protein: number; fat: number; carbs: number; fiber: number }
): boolean {
  const totals = dayTotals(day);
  const within = (actual: number, target: number) =>
    actual >= target * (1 - DAY_TARGET_TOLERANCE) && actual <= target * (1 + DAY_TARGET_TOLERANCE);
  return within(totals.calories, targets.calories) && within(totals.carbs, targets.carbs);
}

function hasUniqueRecipes(day: DayPlan): boolean {
  const meals = [day.breakfast, day.lunch, day.dinner, day.snack, day.extraSnack].filter(
    (meal): meal is GeneratedMeal => Boolean(meal) && !meal.skipped
  );
  const ids = meals.map((meal) => meal.templateId);
  return new Set(ids).size === ids.length;
}

function dayMealsUnderGl(day: DayPlan): boolean {
  return [day.breakfast, day.lunch, day.dinner, day.snack, day.extraSnack]
    .filter((meal): meal is GeneratedMeal => Boolean(meal) && !meal.skipped)
    .every((meal) => meal.glycemicLoad < GL_HIGH_THRESHOLD);
}

function isAcceptableDay(
  day: DayPlan,
  targets: { calories: number; protein: number; fat: number; carbs: number; fiber: number }
): boolean {
  return hasUniqueRecipes(day) && dayMealsUnderGl(day) && dayWithinTargetBand(day, targets);
}

function rebalanceDayMeals(
  day: DayPlan,
  targets: { calories: number; protein: number; fat: number; carbs: number; fiber: number }
): DayPlan {
  let current = day;
  const findRecipe = (templateId: string) => FIXED_RECIPES.find((recipe) => recipe.id === templateId);

  for (let pass = 0; pass < 14; pass += 1) {
    if (dayWithinTargetBand(current, targets)) break;

    const totals = dayTotals(current);
    const calorieRatio = targets.calories / Math.max(1, totals.calories);
    const carbRatio = targets.carbs / Math.max(1, totals.carbs);

    const rescaleMeal = (meal: GeneratedMeal, recipe: Recipe | undefined): GeneratedMeal => {
      let adjustedIngredients = meal.ingredients;

      if (Math.abs(1 - carbRatio) >= 0.04) {
        const carbScale = Math.max(0.72, Math.min(1.4, carbRatio));
        adjustedIngredients = scaleCategoryPortions(adjustedIngredients, ["carbs"], carbScale);
        if (carbRatio > 1.06) {
          adjustedIngredients = scaleCategoryPortions(
            adjustedIngredients,
            ["vegetables"],
            Math.min(1.22, 1 + (carbRatio - 1) * 0.55)
          );
        }
      }

      const mealShare = meal.calories / Math.max(1, totals.calories);
      const mealCalorieTarget = targets.calories * Math.max(0.08, mealShare);
      const localCalorieRatio = mealCalorieTarget / Math.max(1, sumCalories(adjustedIngredients));
      if (Math.abs(1 - localCalorieRatio) >= 0.04) {
        const calScale = Math.max(0.78, Math.min(1.28, localCalorieRatio));
        if (localCalorieRatio < 1) {
          adjustedIngredients = scaleCategoryPortions(adjustedIngredients, ["fats", "protein"], calScale);
        } else {
          adjustedIngredients = scaleCategoryPortions(
            adjustedIngredients,
            ["protein", "carbs", "vegetables", "fats", "liquid"],
            calScale
          );
        }
      } else if (Math.abs(1 - calorieRatio) >= 0.05) {
        adjustedIngredients = scaleCategoryPortions(
          adjustedIngredients,
          ["protein", "fats", "vegetables", "liquid"],
          Math.max(0.85, Math.min(1.2, calorieRatio))
        );
      }

      adjustedIngredients = capGlycemicLoad(adjustedIngredients);
      return {
        ...meal,
        ingredients: adjustedIngredients,
        calories: sumCalories(adjustedIngredients),
        macros: sumMacros(adjustedIngredients),
        fiber: sumFiber(adjustedIngredients),
        glycemicIndex: glycemicIndexAverage(adjustedIngredients),
        glycemicLoad: glycemicLoad(adjustedIngredients),
        isVegetarian: recipe ? recipeVegetarian(recipe) : isVegetarianMeal(adjustedIngredients),
        isVegan: recipe ? recipeVegan(recipe) : isVeganMeal(adjustedIngredients)
      };
    };

    current = {
      ...current,
      breakfast: rescaleMeal(current.breakfast, findRecipe(current.breakfast.templateId)),
      lunch: rescaleMeal(current.lunch, findRecipe(current.lunch.templateId)),
      dinner: rescaleMeal(current.dinner, findRecipe(current.dinner.templateId)),
      snack: rescaleMeal(current.snack, findRecipe(current.snack.templateId)),
      extraSnack: current.extraSnack
        ? rescaleMeal(current.extraSnack, findRecipe(current.extraSnack.templateId))
        : undefined
    };
  }
  return current;
}

function generateDayPlan(
  user: UserProfile,
  dayIndex: number,
  seed: number,
  options: RecipeSelectionOptions = {}
): DayPlan {
  const dailyTargets = recommendedDailyTargets(user);
  const usedRecipeIds = new Set<string>();

  const pick = (
    mealType: MealType,
    seedOffset: number,
    target: { calories: number; protein: number; fat: number; carbs: number; fiber: number }
  ) => {
    const meal = generateMealPreferringLowGl(user, mealType, dayIndex, seed + seedOffset, target, {
      excludedTemplateIds: [...usedRecipeIds],
      selection: options
    });
    usedRecipeIds.add(meal.templateId);
    return meal;
  };

  const dayPlan: DayPlan = {
    day: dayIndex + 1,
    breakfast: pick("breakfast", 11, mealTargetFromDaily(dailyTargets, "breakfast")),
    lunch: pick("lunch", 17, mealTargetFromDaily(dailyTargets, "lunch")),
    dinner: pick("dinner", 23, mealTargetFromDaily(dailyTargets, "dinner")),
    snack: pick("snack", 29, mealTargetFromDaily(dailyTargets, "snack"))
  };

  if (needsExtraSnack(dayPlan, dailyTargets)) {
    const carbsGap = Math.max(0, dailyTargets.carbs - dayTotals(dayPlan).carbs);
    dayPlan.extraSnack = pick("snack", 41, {
      calories: dailyTargets.calories * 0.12,
      protein: dailyTargets.protein * 0.14,
      fat: dailyTargets.fat * 0.12,
      carbs: Math.max(dailyTargets.carbs * 0.12, carbsGap * 0.85),
      fiber: dailyTargets.fiber * 0.18
    });
  }

  return rebalanceDayMeals(dayPlan, dailyTargets);
}

function generateOptimizedDayPlan(
  user: UserProfile,
  dayIndex: number,
  baseSeed: number,
  options: RecipeSelectionOptions = {}
): DayPlan {
  const targets = recommendedDailyTargets(user);
  const attempts = 24;
  let best = generateDayPlan(user, dayIndex, baseSeed, options);
  let bestLoss = dayLoss(best, targets);
  let bestOk = isAcceptableDay(best, targets);

  for (let i = 1; i < attempts; i += 1) {
    const candidate = generateDayPlan(user, dayIndex, baseSeed + i * 9973 + dayIndex * 389, options);
    if (!hasUniqueRecipes(candidate) || !dayMealsUnderGl(candidate)) continue;
    const ok = dayWithinTargetBand(candidate, targets);
    const loss = dayLoss(candidate, targets);
    if (ok && !bestOk) {
      best = candidate;
      bestLoss = loss;
      bestOk = true;
      continue;
    }
    if (ok === bestOk && loss < bestLoss) {
      best = candidate;
      bestLoss = loss;
      bestOk = ok && dayMealsUnderGl(candidate) && hasUniqueRecipes(candidate);
    }
  }

  if (!hasUniqueRecipes(best)) {
    throw new Error(`Day ${dayIndex + 1} has a repeated dish.`);
  }
  if (!dayMealsUnderGl(best)) {
    throw new Error(`Day ${dayIndex + 1} contains a meal with glycemic load ≥ ${GL_HIGH_THRESHOLD}.`);
  }
  if (!dayWithinTargetBand(best, targets)) {
    const totals = dayTotals(best);
    throw new Error(
      `Day ${dayIndex + 1} outside ±10% targets (calories ${Math.round(totals.calories)}/` +
        `${targets.calories}, carbs ${Math.round(totals.carbs)}/${targets.carbs}).`
    );
  }
  return best;
}

function yieldToMain(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

async function generateOptimizedDayPlanAsync(
  user: UserProfile,
  dayIndex: number,
  baseSeed: number,
  options: RecipeSelectionOptions = {}
): Promise<DayPlan> {
  const targets = recommendedDailyTargets(user);
  const attempts = 24;
  await yieldToMain();
  let best = generateDayPlan(user, dayIndex, baseSeed, options);
  let bestLoss = dayLoss(best, targets);
  let bestOk = isAcceptableDay(best, targets);

  for (let i = 1; i < attempts; i += 1) {
    await yieldToMain();
    const candidate = generateDayPlan(user, dayIndex, baseSeed + i * 9973 + dayIndex * 389, options);
    if (!hasUniqueRecipes(candidate) || !dayMealsUnderGl(candidate)) continue;
    const ok = dayWithinTargetBand(candidate, targets);
    const loss = dayLoss(candidate, targets);
    if (ok && !bestOk) {
      best = candidate;
      bestLoss = loss;
      bestOk = true;
      continue;
    }
    if (ok === bestOk && loss < bestLoss) {
      best = candidate;
      bestLoss = loss;
      bestOk = ok && dayMealsUnderGl(candidate) && hasUniqueRecipes(candidate);
    }
  }

  if (!hasUniqueRecipes(best)) {
    throw new Error(`Day ${dayIndex + 1} has a repeated dish.`);
  }
  if (!dayMealsUnderGl(best)) {
    throw new Error(`Day ${dayIndex + 1} contains a meal with glycemic load ≥ ${GL_HIGH_THRESHOLD}.`);
  }
  if (!dayWithinTargetBand(best, targets)) {
    const totals = dayTotals(best);
    throw new Error(
      `Day ${dayIndex + 1} outside ±10% targets (calories ${Math.round(totals.calories)}/` +
        `${targets.calories}, carbs ${Math.round(totals.carbs)}/${targets.carbs}).`
    );
  }
  return best;
}

export async function generateMealPlanAsync(
  user: UserProfile,
  days: number,
  options: RecipeSelectionOptions = {}
): Promise<MealPlan> {
  const normalizedDays = [1, 3, 7].includes(days) ? days : 1;
  const planSeed = Math.floor(Math.random() * 1_000_000);
  const dayPlans: DayPlan[] = [];
  for (let dayIndex = 0; dayIndex < normalizedDays; dayIndex += 1) {
    await yieldToMain();
    dayPlans.push(await generateOptimizedDayPlanAsync(user, dayIndex, planSeed + dayIndex * 1237, options));
  }
  return {
    id: `plan-${Date.now()}`,
    createdAt: new Date().toISOString(),
    userProfile: user,
    days: dayPlans
  };
}

export function generateMealPlan(user: UserProfile, days: number, options: RecipeSelectionOptions = {}): MealPlan {
  const normalizedDays = [1, 3, 7].includes(days) ? days : 1;
  const planSeed = Math.floor(Math.random() * 1_000_000);
  const dayPlans = Array.from({ length: normalizedDays }, (_, dayIndex) =>
    generateOptimizedDayPlan(user, dayIndex, planSeed + dayIndex * 1237, options)
  );
  return {
    id: `plan-${Date.now()}`,
    createdAt: new Date().toISOString(),
    userProfile: user,
    days: dayPlans
  };
}
