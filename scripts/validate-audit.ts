import { generateMealPlan } from "../lib/generator/engine";
import { recommendedDailyTargets } from "../lib/generator/targets";
import { GL_HIGH_THRESHOLD, isVeganMeal } from "../lib/nutrition/calc";
import { mealFitsDiet } from "../lib/nutrition/diet";
import { FIXED_RECIPES } from "../lib/recipes/data";
import { recipeAllergens, recipeVegan, recipeVegetarian } from "../lib/recipes/insights";
import { DayPlan, GeneratedMeal, MealPlan, UserProfile } from "../types";

const DAY_TARGET_TOLERANCE = 0.1;
const PLANS_PER_DIET = 17;
const NON_VEGAN_ALLERGENS = new Set(["dairy", "egg", "fish", "shellfish"]);

function assertCondition(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

function mealsOnDay(day: DayPlan): GeneratedMeal[] {
  return [day.breakfast, day.lunch, day.dinner, day.snack, day.extraSnack].filter(
    (meal): meal is GeneratedMeal => meal != null && !meal.skipped
  );
}

function totalsForDay(day: DayPlan) {
  return mealsOnDay(day).reduce(
    (acc, meal) => {
      acc.calories += meal.calories;
      acc.carbs += meal.macros.carbs;
      return acc;
    },
    { calories: 0, carbs: 0 }
  );
}

function withinBand(actual: number, target: number): boolean {
  return actual >= target * (1 - DAY_TARGET_TOLERANCE) && actual <= target * (1 + DAY_TARGET_TOLERANCE);
}

function recipeById(id: string) {
  return FIXED_RECIPES.find((recipe) => recipe.id === id);
}

/** Library catalog must not claim vegan while declaring animal allergens on the default plate. */
function assertLibraryVeganAllergens() {
  for (const recipe of FIXED_RECIPES) {
    if (!recipeVegan(recipe)) continue;
    for (const allergen of recipeAllergens(recipe)) {
      assertCondition(
        !NON_VEGAN_ALLERGENS.has(allergen.toLowerCase()),
        `Vegan-tagged "${recipe.name}" has allergen "${allergen}" on the default plate`
      );
    }
  }
}

function assertPlan(profile: UserProfile, plan: MealPlan) {
  const targets = recommendedDailyTargets(profile);

  plan.days.forEach((day) => {
    const meals = mealsOnDay(day);
    const templateIds = meals.map((meal) => meal.templateId);
    assertCondition(
      new Set(templateIds).size === templateIds.length,
      `Repeated dish on day ${day.day}: ${templateIds.join(", ")}`
    );

    meals.forEach((meal) => {
      assertCondition(
        meal.glycemicLoad < GL_HIGH_THRESHOLD,
        `GL ${meal.glycemicLoad.toFixed(1)} >= ${GL_HIGH_THRESHOLD} for "${meal.name}"`
      );

      assertCondition(
        mealFitsDiet(meal.ingredients, profile.dietType),
        `Diet "${profile.dietType}" violated in "${meal.name}": ${meal.ingredients
          .map((ingredient) => ingredient.name)
          .join(", ")}`
      );

      const recipe = recipeById(meal.templateId);
      assertCondition(Boolean(recipe), `Unknown recipe template ${meal.templateId}`);
      if (!recipe) return;

      assertCondition(
        meal.isVegan === recipeVegan(recipe),
        `Vegan tag mismatch for "${recipe.name}": library=${recipeVegan(recipe)} plan=${meal.isVegan}`
      );
      assertCondition(
        meal.isVegetarian === recipeVegetarian(recipe),
        `Vegetarian tag mismatch for "${recipe.name}": library=${recipeVegetarian(recipe)} plan=${meal.isVegetarian}`
      );

      if (meal.isVegan) {
        assertCondition(
          isVeganMeal(meal.ingredients),
          `Vegan-tagged "${meal.name}" contains non-vegan ingredients: ${meal.ingredients
            .map((ingredient) => ingredient.name)
            .join(", ")}`
        );
        for (const ingredient of meal.ingredients) {
          for (const allergen of ingredient.allergens ?? []) {
            assertCondition(
              !NON_VEGAN_ALLERGENS.has(allergen.toLowerCase()),
              `Vegan-tagged "${meal.name}" includes allergen "${allergen}" via ${ingredient.name}`
            );
          }
        }
      }
    });

    const totals = totalsForDay(day);
    assertCondition(
      withinBand(totals.calories, targets.calories),
      `Day ${day.day} calories ${Math.round(totals.calories)} outside ±10% of ${targets.calories}`
    );
    assertCondition(
      withinBand(totals.carbs, targets.carbs),
      `Day ${day.day} carbs ${Math.round(totals.carbs)} outside ±10% of ${targets.carbs}`
    );
  });
}

const baseBody = {
  age: 34,
  weight: 74,
  height: 168,
  gender: "female" as const,
  condition: "type2_diabetes" as const,
  allergies: ["none"],
  additionalPreferences: ""
};

const dietProfiles: { label: string; profile: UserProfile }[] = [
  { label: "omnivore", profile: { ...baseBody, dietType: "omnivore" } },
  {
    label: "vegetarian",
    profile: { ...baseBody, age: 29, weight: 61, height: 170, dietType: "vegetarian" }
  },
  {
    label: "vegan",
    profile: { ...baseBody, age: 31, weight: 64, height: 166, dietType: "vegan" }
  },
  {
    label: "pescatarian",
    profile: { ...baseBody, age: 36, weight: 70, height: 172, dietType: "pescatarian" }
  },
  {
    label: "seagan",
    profile: { ...baseBody, age: 33, weight: 66, height: 169, dietType: "seagan" }
  },
  {
    label: "allergy-restricted",
    profile: {
      age: 40,
      weight: 78,
      height: 172,
      gender: "male",
      condition: "type2_diabetes",
      dietType: "omnivore",
      allergies: ["Dairy", "Eggs", "Fish"],
      additionalPreferences: ""
    }
  }
];

function main() {
  assertLibraryVeganAllergens();

  let plansChecked = 0;
  for (const { label, profile } of dietProfiles) {
    for (let i = 0; i < PLANS_PER_DIET; i += 1) {
      const plan = generateMealPlan(profile, 7);
      assertPlan(profile, plan);
      plansChecked += 1;
    }
    process.stdout.write(`Audit OK: ${PLANS_PER_DIET} × 7-day plans for ${label}\n`);
  }

  assertCondition(plansChecked >= 100, `Expected at least 100 plans, got ${plansChecked}`);
  process.stdout.write(
    `Audit assertions passed on ${plansChecked} generated plans across ${dietProfiles.length} diet profiles.\n`
  );
}

main();
