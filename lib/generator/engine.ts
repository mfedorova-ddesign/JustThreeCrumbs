import { INGREDIENTS } from "@/lib/ingredients/data";
import {
  diabeticScore,
  glycemicIndexAverage,
  isVeganMeal,
  isVegetarianMeal,
  sumCalories,
  sumFiber,
  sumMacros,
  validateMeal
} from "@/lib/nutrition/calc";
import { recommendedDailyTargets } from "@/lib/generator/targets";
import { TEMPLATES } from "@/lib/templates/data";
import { DayPlan, GeneratedMeal, Ingredient, MealPlan, MealType, Template, UserProfile } from "@/types";

const templateSequenceByMealType: Record<MealType, string[]> = {
  breakfast: [
    "author-shakshuka-toast",
    "author-chia-pudding-berries",
    "author-savory-oatmeal-eggs",
    "author-yogurt-berries-nuts",
    "author-protein-salad-plate"
  ],
  lunch: [
    "author-green-curry",
    "author-legume-soup",
    "author-protein-salad-plate",
    "author-buckwheat-skillet",
    "author-lemon-herb-chicken",
    "author-herb-baked-fish",
    "author-tuna-salad-corn",
    "author-baked-eggplant-tomato",
    "author-borscht-style"
  ],
  dinner: [
    "author-buckwheat-skillet",
    "author-green-curry",
    "author-legume-soup",
    "author-herb-baked-fish",
    "author-lemon-herb-chicken",
    "author-tuna-salad-corn",
    "author-baked-eggplant-tomato",
    "author-borscht-style",
    "author-protein-salad-plate"
  ],
  snack: [
    "author-snack-tuna-yogurt",
    "author-snack-egg-cucumber",
    "author-snack-hummus-veggies",
    "author-snack-yogurt-berry-chia",
    "author-snack-apple-cottage",
    "author-snack-chocolate-nuts",
    "author-chia-pudding-berries",
    "author-protein-salad-plate"
  ]
};

const glycemicIndexThresholdByLevel = {
  low: 55,
  medium: 69,
  high: 100
} as const;

const slotKeys = ["protein", "vegetables", "carbs", "fats", "liquid", "spices"] as const;

function isTemplateAllowed(template: Template, user: UserProfile): boolean {
  for (const key of slotKeys) {
    const rules = template.slotRules[key];
    if (rules.min === 0) continue;
    const names = template.ingredientSlots[key];
    const candidates = names
      .map((name) => INGREDIENTS.find((ingredient) => ingredient.name === name))
      .filter((ingredient): ingredient is Ingredient => Boolean(ingredient))
      .filter((ingredient) => isIngredientAllowed(ingredient, user))
      .filter((ingredient) => user.dietType !== "vegetarian" || ingredient.vegetarian);
    if (candidates.length < rules.min) return false;
  }
  return true;
}

function isIngredientAllowed(ingredient: Ingredient, user: UserProfile): boolean {
  if (user.dietType === "vegetarian" && !ingredient.vegetarian) return false;
  const allergySet = new Set<string>();
  for (const raw of user.allergies.map((a) => a.toLowerCase().trim()).filter((a) => a && a !== "none")) {
    allergySet.add(raw);
    if (raw === "milk") allergySet.add("dairy");
    if (raw === "dairy") allergySet.add("milk");
    if (raw === "tree nut") allergySet.add("tree nuts");
    if (raw === "tree nuts") allergySet.add("tree nut");
  }
  if (!ingredient.allergens?.length) return true;
  return !ingredient.allergens.some((allergen) => allergySet.has(allergen.toLowerCase()));
}

function pickFromSlot(
  slot: string[],
  user: UserProfile,
  usedNames: Set<string>,
  desiredCount: number,
  offset: number
): Ingredient[] {
  if (slot.length === 0) return [];
  const candidates = slot
    .map((name) => INGREDIENTS.find((ingredient) => ingredient.name === name))
    .filter((ingredient): ingredient is Ingredient => Boolean(ingredient))
    .filter((ingredient) => isIngredientAllowed(ingredient, user));

  if (candidates.length === 0) return [];

  const targetCount = Math.min(desiredCount, candidates.length);
  const selected: Ingredient[] = [];
  const startIndex = offset % candidates.length;

  for (let i = 0; i < candidates.length && selected.length < targetCount; i += 1) {
    const candidate = candidates[(startIndex + i) % candidates.length];
    if (usedNames.has(candidate.name)) continue;
    selected.push(candidate);
    usedNames.add(candidate.name);
  }

  if (selected.length < targetCount) {
    for (let i = 0; i < candidates.length && selected.length < targetCount; i += 1) {
      const candidate = candidates[(startIndex + i) % candidates.length];
      selected.push(candidate);
    }
  }

  return selected;
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
    almonds: mealType === "snack" ? 22 : 30,
    tempeh: 85,
    onion: 55,
    carrot: 65,
    celery: 85,
    cabbage: 110,
    beets: 85,
    "feta cheese": 35,
    ginger: 4
  };

  return byName[ingredient.name] ?? byCategory[ingredient.category];
}

function withPortions(ingredients: Ingredient[], mealType: MealType): Ingredient[] {
  return ingredients.map((ingredient) => ({
    ...ingredient,
    portionGrams: getIngredientPortionGrams(ingredient, mealType)
  }));
}

function mealCalorieShare(mealType: MealType): number {
  const shares: Record<MealType, number> = {
    breakfast: 0.27,
    lunch: 0.35,
    dinner: 0.23,
    snack: 0.15
  };
  return shares[mealType];
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

function buildMealFromIngredients(
  template: Template,
  mealType: MealType,
  dayIndex: number,
  ingredients: Ingredient[]
): GeneratedMeal {
  const calories = sumCalories(ingredients);
  const macros = sumMacros(ingredients);
  const fiber = sumFiber(ingredients);
  const glycemicIndex = glycemicIndexAverage(ingredients);
  const score = diabeticScore(ingredients);
  const isVegetarian = isVegetarianMeal(ingredients);
  const isVegan = isVeganMeal(ingredients);
  const selectedByCategory = {
    protein: ingredients
      .filter((ingredient) => ingredient.category === "protein")
      .map((ingredient) => ingredient.name)
      .join(", "),
    vegetables: ingredients
      .filter((ingredient) => ingredient.category === "vegetables")
      .map((ingredient) => ingredient.name)
      .join(", "),
    carbs: ingredients
      .filter((ingredient) => ingredient.category === "carbs")
      .map((ingredient) => ingredient.name)
      .join(", "),
    fats: ingredients
      .filter((ingredient) => ingredient.category === "fats")
      .map((ingredient) => ingredient.name)
      .join(", "),
    liquid: ingredients
      .filter((ingredient) => ingredient.category === "liquid")
      .map((ingredient) => ingredient.name)
      .join(", "),
    spices: ingredients
      .filter((ingredient) => ingredient.category === "spices")
      .map((ingredient) => ingredient.name)
      .join(", ")
  };

  return {
    id: `${template.id}-${mealType}-${dayIndex}`,
    name: composeMealName(template, selectedByCategory),
    templateId: template.id,
    mealType,
    ingredients,
    calories,
    macros,
    fiber,
    glycemicIndex,
    diabeticScore: score,
    isVegetarian,
    isVegan,
    instructions: template.cookingSteps.map((step) => applyStepTokens(step, selectedByCategory))
  };
}

function rebalanceDayMeals(
  day: DayPlan,
  targets: { calories: number; protein: number; fat: number; carbs: number; fiber: number }
): DayPlan {
  const baseMeals = [day.breakfast, day.lunch, day.dinner, day.snack, day.extraSnack].filter(
    Boolean
  ) as GeneratedMeal[];
  const totalCalories = baseMeals.reduce((acc, meal) => acc + meal.calories, 0);

  const ratio = targets.calories / Math.max(1, totalCalories);
  const boundedRatio = Math.max(0.9, Math.min(1.32, ratio));
  if (Math.abs(1 - boundedRatio) < 0.04) return day;

  const rescaleMeal = (meal: GeneratedMeal): GeneratedMeal => {
    const boosted = scaleCategoryPortions(
      meal.ingredients,
      ["protein", "carbs", "vegetables", "fats", "liquid"],
      boundedRatio
    );
    return buildMealFromIngredients(
      TEMPLATES.find((t) => t.id === meal.templateId) ?? TEMPLATES[0],
      meal.mealType,
      Number(meal.id.split("-").at(-1) ?? 0) || 0,
      boosted
    );
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

function needsExtraSnack(
  day: DayPlan,
  targets: { calories: number; protein: number; fat: number; carbs: number; fiber: number }
): boolean {
  const meals = [day.breakfast, day.lunch, day.dinner, day.snack];
  const totals = meals.reduce(
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

  return (
    totals.calories < targets.calories * 0.88 ||
    totals.protein < targets.protein * 0.87 ||
    totals.fiber < targets.fiber * 0.8
  );
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

function resolveSlotCount(min: number, max: number, seed: number): number {
  if (max <= min) return min;
  return min + (seed % (max - min + 1));
}

function applyStepTokens(step: string, selectedByCategory: Record<string, string>): string {
  return step.replace(/\{(protein|vegetables|carbs|fats|liquid|spices)\}/g, (_, key: string) => {
    const value = selectedByCategory[key] ?? "";
    return value || "selected ingredients";
  });
}

/** Cleans template artifacts: trailing ", and", empty list tails, dangling "and -". */
export function finalizeMealTitle(raw: string): string {
  let s = raw.replace(/\s+/g, " ").trim();
  s = s.replace(/,\s*,+/g, ", ");
  s = s.replace(/,\s*and\s*-\s*$/i, "");
  s = s.replace(/\s+and\s*-\s*$/i, "");
  s = s.replace(/,\s*and\s*$/i, "");
  s = s.replace(/\s+and\s*$/i, "");
  s = s.replace(/,\s*-\s*$/g, "");
  s = s.replace(/,\s*$/g, "");
  s = s.replace(/^\s*,\s*/g, "");
  return s.trim();
}

function composeMealName(template: Template, selectedByCategory: Record<string, string>): string {
  const raw = template.mealNamePattern.replace(
    /\{(protein|vegetables|carbs|fats|liquid|spices)\}/g,
    (_, key: string) => selectedByCategory[key] ?? ""
  );
  const finalized = finalizeMealTitle(raw);
  return finalized.length > 0 ? finalized : template.name;
}

export function selectTemplate(
  mealType: MealType,
  user: UserProfile,
  dayIndex: number,
  planSeed: number,
  excludedTemplateIds: string[] = []
): Template {
  const orderedIds = templateSequenceByMealType[mealType];
  const matchingTemplates = orderedIds
    .map((id) => TEMPLATES.find((template) => template.id === id))
    .filter((template): template is Template => Boolean(template))
    .filter((template) => template.mealTypes.includes(mealType))
    .filter((template) => isTemplateAllowed(template, user))
    .filter((template) => !excludedTemplateIds.includes(template.id));

  const fallbackTemplates = orderedIds
    .map((id) => TEMPLATES.find((template) => template.id === id))
    .filter((template): template is Template => Boolean(template))
    .filter((template) => template.mealTypes.includes(mealType))
    .filter((template) => isTemplateAllowed(template, user));

  if (matchingTemplates.length === 0 && fallbackTemplates.length === 0) {
    throw new Error(`No template available for ${mealType}`);
  }

  const pool = matchingTemplates.length > 0 ? matchingTemplates : fallbackTemplates;
  const index = (dayIndex + planSeed) % pool.length;
  return pool[index];
}

export function generateMeal(
  template: Template,
  mealType: MealType,
  user: UserProfile,
  dayIndex: number,
  planSeed: number,
  mealCalorieTarget: number,
  mealMacroTarget: { protein: number; fat: number; carbs: number; fiber: number }
): GeneratedMeal {
  const usedNames = new Set<string>();
  const mealSeed = dayIndex + mealType.length + template.id.length + planSeed;

  const proteins = pickFromSlot(
    template.ingredientSlots.protein,
    user,
    usedNames,
    resolveSlotCount(template.slotRules.protein.min, template.slotRules.protein.max, mealSeed + 1),
    mealSeed + 2
  );
  const vegetables = pickFromSlot(
    template.ingredientSlots.vegetables,
    user,
    usedNames,
    resolveSlotCount(template.slotRules.vegetables.min, template.slotRules.vegetables.max, mealSeed + 3),
    mealSeed + 4
  );
  const fats = pickFromSlot(
    template.ingredientSlots.fats,
    user,
    usedNames,
    resolveSlotCount(template.slotRules.fats.min, template.slotRules.fats.max, mealSeed + 5),
    mealSeed + 6
  );
  const liquid = pickFromSlot(
    template.ingredientSlots.liquid,
    user,
    usedNames,
    resolveSlotCount(template.slotRules.liquid.min, template.slotRules.liquid.max, mealSeed + 7),
    mealSeed + 8
  );
  const spices = pickFromSlot(
    template.ingredientSlots.spices,
    user,
    usedNames,
    resolveSlotCount(template.slotRules.spices.min, template.slotRules.spices.max, mealSeed + 9),
    mealSeed + 10
  );
  const carbs = pickFromSlot(
    template.ingredientSlots.carbs,
    user,
    usedNames,
    resolveSlotCount(template.slotRules.carbs.min, template.slotRules.carbs.max, mealSeed + 11),
    mealSeed + 12
  );

  let ingredients = withPortions(
    [...proteins, ...vegetables, ...carbs, ...fats, ...liquid, ...spices],
    mealType
  );
  ingredients = scaleIngredientsToCalorieTarget(ingredients, mealType, mealCalorieTarget);
  ingredients = fitMealToTarget(ingredients, {
    calories: mealCalorieTarget,
    protein: mealMacroTarget.protein,
    fat: mealMacroTarget.fat,
    carbs: mealMacroTarget.carbs,
    fiber: mealMacroTarget.fiber
  });

  const giLimit = glycemicIndexThresholdByLevel[template.constraints.glycemicIndex];
  const maxCarbs = template.constraints.maxCarbs;

  const canDropCarbs = carbs.length > template.slotRules.carbs.min;
  if (canDropCarbs) {
    const withCurrent = {
      macros: sumMacros(ingredients),
      glycemicIndex: glycemicIndexAverage(ingredients)
    };
    if (withCurrent.macros.carbs > maxCarbs || withCurrent.glycemicIndex > giLimit) {
      ingredients = ingredients.filter((ingredient) => ingredient.category !== "carbs");
    }
  }

  let meal: GeneratedMeal = buildMealFromIngredients(template, mealType, dayIndex, ingredients);

  if (!validateMeal(meal, template.constraints.maxCarbs, template.constraints.glycemicIndex)) {
    const reducedIngredients = meal.ingredients.filter((ingredient) => ingredient.category !== "carbs");
    meal = buildMealFromIngredients(template, mealType, dayIndex, reducedIngredients);
  }

  return meal;
}

export type RegenerateSingleMealOptions = {
  excludedTemplateIds?: string[];
  /** Use smaller targets for the optional extra snack row (same as full-plan generation). */
  isExtraSnack?: boolean;
};

/** Build one new meal for a slot (e.g. user clicked “Regenerate” on a single dish). */
export function regenerateSingleMeal(
  user: UserProfile,
  mealType: MealType,
  dayIndex: number,
  variationSeed: number,
  options: RegenerateSingleMealOptions = {}
): GeneratedMeal {
  const dailyTargets = recommendedDailyTargets(user);
  const excluded = options.excludedTemplateIds ?? [];
  const template = selectTemplate(mealType, user, dayIndex, variationSeed, excluded);

  let mealCalorieTarget: number;
  let mealMacroTarget: { protein: number; fat: number; carbs: number; fiber: number };

  if (options.isExtraSnack) {
    mealCalorieTarget = dailyTargets.calories * 0.12;
    mealMacroTarget = {
      protein: dailyTargets.protein * 0.14,
      fat: dailyTargets.fat * 0.12,
      carbs: dailyTargets.carbs * 0.1,
      fiber: dailyTargets.fiber * 0.18
    };
  } else {
    mealCalorieTarget = dailyTargets.calories * mealCalorieShare(mealType);
    mealMacroTarget = mealTargetFromDaily(dailyTargets, mealType);
  }

  const meal = generateMeal(
    template,
    mealType,
    user,
    dayIndex,
    variationSeed,
    mealCalorieTarget,
    mealMacroTarget
  );
  return { ...meal, skipped: false };
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

  const scorePenalty = [day.breakfast, day.lunch, day.dinner, day.snack, day.extraSnack]
    .filter(Boolean)
    .reduce(
      (acc, meal) =>
        acc +
        (meal!.skipped ? 0 : meal!.diabeticScore < 7 ? (7 - meal!.diabeticScore) * 0.06 : 0),
      0
    );

  return calorieTerm * 2.2 + proteinTerm * 1.9 + fatTerm * 1.1 + carbsTerm * 1.3 + fiberTerm * 1.6 + scorePenalty;
}

function generateDayPlan(user: UserProfile, dayIndex: number, planSeed: number): DayPlan {
  const usedTemplateIds = new Set<string>();
  const dailyTargets = recommendedDailyTargets(user);

  const breakfastTemplate = selectTemplate("breakfast", user, dayIndex, planSeed);
  usedTemplateIds.add(breakfastTemplate.id);

  const lunchTemplate = selectTemplate("lunch", user, dayIndex + 1, planSeed, [...usedTemplateIds]);
  usedTemplateIds.add(lunchTemplate.id);

  const dinnerTemplate = selectTemplate("dinner", user, dayIndex + 2, planSeed, [...usedTemplateIds]);
  usedTemplateIds.add(dinnerTemplate.id);

  const snackTemplate = selectTemplate("snack", user, dayIndex, planSeed, [...usedTemplateIds]);
  usedTemplateIds.add(snackTemplate.id);

  const rawDay: DayPlan = {
    day: dayIndex + 1,
    breakfast: generateMeal(
      breakfastTemplate,
      "breakfast",
      user,
      dayIndex,
      planSeed,
      dailyTargets.calories * mealCalorieShare("breakfast"),
      mealTargetFromDaily(dailyTargets, "breakfast")
    ),
    lunch: generateMeal(
      lunchTemplate,
      "lunch",
      user,
      dayIndex,
      planSeed,
      dailyTargets.calories * mealCalorieShare("lunch"),
      mealTargetFromDaily(dailyTargets, "lunch")
    ),
    dinner: generateMeal(
      dinnerTemplate,
      "dinner",
      user,
      dayIndex,
      planSeed,
      dailyTargets.calories * mealCalorieShare("dinner"),
      mealTargetFromDaily(dailyTargets, "dinner")
    ),
    snack: generateMeal(
      snackTemplate,
      "snack",
      user,
      dayIndex,
      planSeed,
      dailyTargets.calories * mealCalorieShare("snack"),
      mealTargetFromDaily(dailyTargets, "snack")
    )
  };

  if (needsExtraSnack(rawDay, dailyTargets)) {
    const extraSnackTemplate = selectTemplate(
      "snack",
      user,
      dayIndex + 3,
      planSeed,
      [...usedTemplateIds]
    );

    rawDay.extraSnack = generateMeal(
      extraSnackTemplate,
      "snack",
      user,
      dayIndex,
      planSeed + 13,
      dailyTargets.calories * 0.12,
      {
        protein: dailyTargets.protein * 0.14,
        fat: dailyTargets.fat * 0.12,
        carbs: dailyTargets.carbs * 0.1,
        fiber: dailyTargets.fiber * 0.18
      }
    );
  }

  return rebalanceDayMeals(rawDay, dailyTargets);
}

function generateOptimizedDayPlan(user: UserProfile, dayIndex: number, basePlanSeed: number): DayPlan {
  const targets = recommendedDailyTargets(user);
  /** Fewer attempts keeps the main thread responsive in the browser (was 16 × days). */
  const attempts = 5;
  let bestDay = generateDayPlan(user, dayIndex, basePlanSeed);
  let bestLoss = dayLoss(bestDay, targets);

  for (let i = 1; i < attempts; i += 1) {
    const candidateSeed = basePlanSeed + i * 9973 + dayIndex * 389;
    const candidate = generateDayPlan(user, dayIndex, candidateSeed);
    const candidateLoss = dayLoss(candidate, targets);
    if (candidateLoss < bestLoss) {
      bestDay = candidate;
      bestLoss = candidateLoss;
    }
  }

  return bestDay;
}

/** Lets the browser paint / handle input between heavy work (avoids tab freeze). */
function yieldToMain(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

async function generateOptimizedDayPlanAsync(
  user: UserProfile,
  dayIndex: number,
  basePlanSeed: number
): Promise<DayPlan> {
  const targets = recommendedDailyTargets(user);
  const attempts = 5;
  await yieldToMain();
  let bestDay = generateDayPlan(user, dayIndex, basePlanSeed);
  let bestLoss = dayLoss(bestDay, targets);

  for (let i = 1; i < attempts; i += 1) {
    await yieldToMain();
    const candidateSeed = basePlanSeed + i * 9973 + dayIndex * 389;
    const candidate = generateDayPlan(user, dayIndex, candidateSeed);
    const candidateLoss = dayLoss(candidate, targets);
    if (candidateLoss < bestLoss) {
      bestDay = candidate;
      bestLoss = candidateLoss;
    }
  }

  return bestDay;
}

/**
 * Same as {@link generateMealPlan} but yields to the main thread between days and
 * optimization attempts so the tab stays responsive during long runs in the browser.
 */
export async function generateMealPlanAsync(user: UserProfile, days: number): Promise<MealPlan> {
  const normalizedDays = [1, 3, 7].includes(days) ? days : 1;
  const planSeed = Math.floor(Math.random() * 1_000_000);
  const dayPlans: DayPlan[] = [];
  for (let dayIndex = 0; dayIndex < normalizedDays; dayIndex += 1) {
    await yieldToMain();
    dayPlans.push(await generateOptimizedDayPlanAsync(user, dayIndex, planSeed + dayIndex * 1237));
  }

  return {
    id: `plan-${Date.now()}`,
    createdAt: new Date().toISOString(),
    userProfile: user,
    days: dayPlans
  };
}

export function generateMealPlan(user: UserProfile, days: number): MealPlan {
  const normalizedDays = [1, 3, 7].includes(days) ? days : 1;
  const planSeed = Math.floor(Math.random() * 1_000_000);
  const dayPlans = Array.from({ length: normalizedDays }, (_, dayIndex) =>
    generateOptimizedDayPlan(user, dayIndex, planSeed + dayIndex * 1237)
  );

  return {
    id: `plan-${Date.now()}`,
    createdAt: new Date().toISOString(),
    userProfile: user,
    days: dayPlans
  };
}
