import { recommendedDailyTargets } from "@/lib/generator/targets";
import { INGREDIENTS } from "@/lib/ingredients/data";
import {
  diabeticScore,
  glycemicIndexAverage,
  isVeganMeal,
  isVegetarianMeal,
  sumCalories,
  sumFiber,
  sumMacros
} from "@/lib/nutrition/calc";
import { FIXED_RECIPES } from "@/lib/recipes/data";
import { DayPlan, GeneratedMeal, Ingredient, MealPlan, MealType, Recipe, RecipeIngredientRule, UserProfile } from "@/types";

const glycemicIndexThresholdByLevel = {
  low: 55,
  medium: 69,
  high: 100
} as const;

const ingredientByName = new Map(INGREDIENTS.map((ingredient) => [ingredient.name, ingredient]));

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
  const allergySet = new Set<string>();
  for (const raw of user.allergies.map((a) => a.toLowerCase().trim()).filter((a) => a && a !== "none")) {
    allergySet.add(raw);
    if (raw === "milk") allergySet.add("dairy");
    if (raw === "dairy") allergySet.add("milk");
    if (raw === "tree nut") allergySet.add("tree nuts");
    if (raw === "tree nuts") allergySet.add("tree nut");
  }
  return allergySet;
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
  offset: number
): string | null {
  const names = [rule.primary, ...(rule.alternatives ?? [])];
  const allowed = names.filter((name) => {
    const ingredient = ingredientByName.get(name);
    return ingredient ? isIngredientAllowed(ingredient, user, allergySet) : false;
  });
  if (allowed.length === 0) return rule.optional ? null : null;
  return allowed[offset % allowed.length];
}

function recipeAllowedForUser(recipe: Recipe, user: UserProfile): boolean {
  const allergySet = getAllergySet(user);
  return recipe.ingredients.every((rule) => {
    const names = [rule.primary, ...(rule.alternatives ?? [])];
    const hasAny = names.some((name) => {
      const ingredient = ingredientByName.get(name);
      return ingredient ? isIngredientAllowed(ingredient, user, allergySet) : false;
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
  const selected: { ingredient: Ingredient; alternatives: string[] }[] = [];
  for (let i = 0; i < recipe.ingredients.length; i += 1) {
    const rule = recipe.ingredients[i];
    const pickedName = pickIngredientName(rule, user, allergySet, seed + i * 37);
    if (!pickedName) continue;
    const ingredient = ingredientByName.get(pickedName);
    if (!ingredient) continue;
    // All valid names from this rule — including the picked one so the user can always swap back
    const ruleNames = [rule.primary, ...(rule.alternatives ?? [])];
    const alternatives = ruleNames.filter((name) => ingredientByName.has(name));
    selected.push({
      ingredient: { ...ingredient, portionGrams: getIngredientPortionGrams(ingredient, mealType) },
      alternatives
    });
  }
  return selected;
}

function enforceRecipeConstraints(
  ingredients: Ingredient[],
  recipe: Recipe,
  target: { calories: number; protein: number; fat: number; carbs: number; fiber: number }
): Ingredient[] {
  let current = ingredients;
  const giLimit = glycemicIndexThresholdByLevel[recipe.constraints.glycemicIndex];
  const dropOptionalCarbNames = new Set(
    recipe.ingredients
      .filter((rule) => rule.optional && rule.category === "carbs")
      .map((rule) => rule.primary)
  );
  const stats = () => ({
    carbs: sumMacros(current).carbs,
    gi: glycemicIndexAverage(current)
  });
  for (let i = 0; i < 3; i += 1) {
    const s = stats();
    if (s.carbs <= recipe.constraints.maxCarbs && s.gi <= giLimit) break;
    if (dropOptionalCarbNames.size > 0) {
      current = current.filter((ingredient) => !dropOptionalCarbNames.has(ingredient.name));
    }
    if (sumMacros(current).carbs > recipe.constraints.maxCarbs) {
      current = scaleCategoryPortions(current, ["carbs"], 0.84);
    }
    if (glycemicIndexAverage(current) > giLimit) {
      current = current.filter((ingredient) => ingredient.category !== "carbs" || ingredient.glycemicIndex <= 55);
      current = scaleCategoryPortions(current, ["carbs"], 0.9);
    }
    current = fitMealToTarget(current, target);
  }
  return current;
}

function buildMeal(
  recipe: Recipe,
  mealType: MealType,
  dayIndex: number,
  seed: number,
  resolved: { ingredient: Ingredient; alternatives: string[] }[]
): GeneratedMeal {
  const ingredients = resolved.map((r) => r.ingredient);
  return {
    id: `${recipe.id}-${mealType}-${dayIndex}-${Math.abs(seed % 100000)}`,
    name: recipe.name,
    templateId: recipe.id,
    mealType,
    ingredients,
    ruleAlternatives: resolved.map((r) => r.alternatives),
    calories: sumCalories(ingredients),
    macros: sumMacros(ingredients),
    fiber: sumFiber(ingredients),
    glycemicIndex: glycemicIndexAverage(ingredients),
    diabeticScore: diabeticScore(ingredients),
    isVegetarian: isVegetarianMeal(ingredients),
    isVegan: isVeganMeal(ingredients),
    instructions: recipe.instructions
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
  // Re-attach alternatives by name (enforceRecipeConstraints may remove some ingredients)
  const altsByName = new Map(resolved.map((r) => [r.ingredient.name, r.alternatives]));
  const scaledResolved = ingredients.map((ing) => ({
    ingredient: ing,
    alternatives: altsByName.get(ing.name) ?? []
  }));
  return buildMeal(recipe, mealType, dayIndex, seed, scaledResolved);
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
  const excluded = options.excludedTemplateIds ?? [];
  const recipe = selectRecipe(mealType, user, dayIndex, variationSeed, excluded, options.selection);
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
  return { ...generateMealFromRecipe(recipe, mealType, user, dayIndex, variationSeed, target), skipped: false };
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
  return calorieTerm * 2.2 + proteinTerm * 1.9 + fatTerm * 1.1 + carbsTerm * 1.3 + fiberTerm * 1.6;
}

function needsExtraSnack(
  day: DayPlan,
  targets: { calories: number; protein: number; fat: number; carbs: number; fiber: number }
): boolean {
  const totals = dayTotals(day);
  return (
    totals.calories < targets.calories * 0.88 ||
    totals.protein < targets.protein * 0.87 ||
    totals.fiber < targets.fiber * 0.8
  );
}

function rebalanceDayMeals(
  day: DayPlan,
  targets: { calories: number; protein: number; fat: number; carbs: number; fiber: number }
): DayPlan {
  const meals = [day.breakfast, day.lunch, day.dinner, day.snack, day.extraSnack].filter(Boolean) as GeneratedMeal[];
  const totalCalories = meals.reduce((acc, meal) => acc + meal.calories, 0);
  const ratio = targets.calories / Math.max(1, totalCalories);
  const boundedRatio = Math.max(0.9, Math.min(1.32, ratio));
  if (Math.abs(1 - boundedRatio) < 0.04) return day;
  const rescaleMeal = (meal: GeneratedMeal): GeneratedMeal => {
    const adjustedIngredients = scaleCategoryPortions(
      meal.ingredients,
      ["protein", "carbs", "vegetables", "fats", "liquid"],
      boundedRatio
    );
    return {
      ...meal,
      ingredients: adjustedIngredients,
      calories: sumCalories(adjustedIngredients),
      macros: sumMacros(adjustedIngredients),
      fiber: sumFiber(adjustedIngredients),
      glycemicIndex: glycemicIndexAverage(adjustedIngredients),
      diabeticScore: diabeticScore(adjustedIngredients),
      isVegetarian: isVegetarianMeal(adjustedIngredients),
      isVegan: isVeganMeal(adjustedIngredients)
    };
  };
  return {
    ...day,
    breakfast: rescaleMeal(day.breakfast),
    lunch: rescaleMeal(day.lunch),
    dinner: rescaleMeal(day.dinner),
    snack: rescaleMeal(day.snack),
    extraSnack: day.extraSnack ? rescaleMeal(day.extraSnack) : undefined
  };
}

function generateDayPlan(
  user: UserProfile,
  dayIndex: number,
  seed: number,
  options: RecipeSelectionOptions = {}
): DayPlan {
  const dailyTargets = recommendedDailyTargets(user);
  const usedRecipeIds = new Set<string>();

  const breakfastRecipe = selectRecipe("breakfast", user, dayIndex, seed, [...usedRecipeIds], options);
  usedRecipeIds.add(breakfastRecipe.id);
  const lunchRecipe = selectRecipe("lunch", user, dayIndex + 1, seed, [...usedRecipeIds], options);
  usedRecipeIds.add(lunchRecipe.id);
  const dinnerRecipe = selectRecipe("dinner", user, dayIndex + 2, seed, [...usedRecipeIds], options);
  usedRecipeIds.add(dinnerRecipe.id);
  const snackRecipe = selectRecipe("snack", user, dayIndex + 3, seed, [...usedRecipeIds], options);
  usedRecipeIds.add(snackRecipe.id);

  const dayPlan: DayPlan = {
    day: dayIndex + 1,
    breakfast: generateMealFromRecipe(
      breakfastRecipe,
      "breakfast",
      user,
      dayIndex,
      seed + 11,
      mealTargetFromDaily(dailyTargets, "breakfast")
    ),
    lunch: generateMealFromRecipe(
      lunchRecipe,
      "lunch",
      user,
      dayIndex,
      seed + 17,
      mealTargetFromDaily(dailyTargets, "lunch")
    ),
    dinner: generateMealFromRecipe(
      dinnerRecipe,
      "dinner",
      user,
      dayIndex,
      seed + 23,
      mealTargetFromDaily(dailyTargets, "dinner")
    ),
    snack: generateMealFromRecipe(
      snackRecipe,
      "snack",
      user,
      dayIndex,
      seed + 29,
      mealTargetFromDaily(dailyTargets, "snack")
    )
  };

  if (needsExtraSnack(dayPlan, dailyTargets)) {
    const extraSnackRecipe = selectRecipe("snack", user, dayIndex + 4, seed, [...usedRecipeIds], options);
    dayPlan.extraSnack = generateMealFromRecipe(
      extraSnackRecipe,
      "snack",
      user,
      dayIndex,
      seed + 41,
      {
        calories: dailyTargets.calories * 0.12,
        protein: dailyTargets.protein * 0.14,
        fat: dailyTargets.fat * 0.12,
        carbs: dailyTargets.carbs * 0.1,
        fiber: dailyTargets.fiber * 0.18
      }
    );
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
  const attempts = 5;
  let best = generateDayPlan(user, dayIndex, baseSeed, options);
  let bestLoss = dayLoss(best, targets);
  for (let i = 1; i < attempts; i += 1) {
    const candidate = generateDayPlan(user, dayIndex, baseSeed + i * 9973 + dayIndex * 389, options);
    const loss = dayLoss(candidate, targets);
    if (loss < bestLoss) {
      best = candidate;
      bestLoss = loss;
    }
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
  const attempts = 5;
  await yieldToMain();
  let best = generateDayPlan(user, dayIndex, baseSeed, options);
  let bestLoss = dayLoss(best, targets);
  for (let i = 1; i < attempts; i += 1) {
    await yieldToMain();
    const candidate = generateDayPlan(user, dayIndex, baseSeed + i * 9973 + dayIndex * 389, options);
    const loss = dayLoss(candidate, targets);
    if (loss < bestLoss) {
      best = candidate;
      bestLoss = loss;
    }
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
