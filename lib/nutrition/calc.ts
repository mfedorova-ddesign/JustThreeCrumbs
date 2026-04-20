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
  if (totalCarbs === 0) {
    const simpleAverage =
      ingredients.reduce((acc, ingredient) => acc + ingredient.glycemicIndex, 0) / ingredients.length;
    return Number(simpleAverage.toFixed(1));
  }

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

  // Glycemic load (GL = GI × carbs / 100) is clinically more relevant than GI alone
  // for predicting post-meal blood glucose response.
  const glycemicLoad = (gi * macros.carbs) / 100;

  // Penalties — raise these for meals that are harder to manage with type 2 diabetes
  const glPenalty = Math.max(0, (glycemicLoad - 10) / 3.5);   // GL ≤ 10 is low, > 20 is high
  const carbPenalty = Math.max(0, (macros.carbs - 30) / 12);  // excess carbs over 30 g
  const caloriePenalty = calories > 650 ? (calories - 650) / 220 : 0;

  // Bonuses — reward meal properties that help control blood glucose
  const fiberBonus = Math.min(2.5, fiber / 3.5);             // fibre slows glucose absorption
  const proteinBonus = Math.min(1.5, macros.protein / 15);   // protein aids satiety & glucose regulation
  const fatBonus = Math.min(0.5, macros.fat / 25);           // fats slow digestion slightly

  const score = 5.0 + fiberBonus + proteinBonus + fatBonus - glPenalty - carbPenalty - caloriePenalty;
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
