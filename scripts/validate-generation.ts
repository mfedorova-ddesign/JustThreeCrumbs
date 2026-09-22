import { generateMealPlan } from "../lib/generator/engine";
import {
  assertMealCopySafeForAllergies,
  normalizeAllergySet
} from "../lib/generator/meal-copy";
import { recommendedDailyTargets } from "../lib/generator/targets";
import { GL_HIGH_THRESHOLD } from "../lib/nutrition/calc";
import { DayPlan, GeneratedMeal, UserProfile } from "../types";

function assertCondition(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

function totalsForDay(day: DayPlan) {
  const meals = [day.breakfast, day.lunch, day.dinner, day.snack, day.extraSnack].filter(
    Boolean
  ) as GeneratedMeal[];
  return meals.reduce(
    (acc, meal) => {
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

function allergySet(allergies: string[]): Set<string> {
  return normalizeAllergySet(allergies);
}

function validatePlan(profile: UserProfile, days: number, options: { checkMacros?: boolean } = {}) {
  const checkMacros = options.checkMacros !== false;
  const plan = generateMealPlan(profile, days);
  const allergies = allergySet(profile.allergies);
  const targets = recommendedDailyTargets(profile);

  plan.days.forEach((day) => {
    const totals = totalsForDay(day);
    const meals = [day.breakfast, day.lunch, day.dinner, day.snack, day.extraSnack].filter(
      Boolean
    ) as GeneratedMeal[];

    meals.forEach((meal) => {
      if (profile.dietType === "vegetarian") {
        assertCondition(
          meal.ingredients.every((ingredient) => ingredient.vegetarian),
          `Non-vegetarian ingredient found in vegetarian profile: ${meal.name}`
        );
      }
      meal.ingredients.forEach((ingredient) => {
        if (!ingredient.allergens?.length) return;
        ingredient.allergens.forEach((allergen) => {
          assertCondition(
            !allergies.has(allergen.toLowerCase()),
            `Allergen "${allergen}" found for profile in meal: ${meal.name}`
          );
        });
      });

      assertMealCopySafeForAllergies(meal.name, meal.instructions, profile.allergies, meal.ingredients);

      assertCondition(
        meal.glycemicLoad < GL_HIGH_THRESHOLD,
        `High glycemic load in generated meal "${meal.name}": ${meal.glycemicLoad}`
      );
    });

    if (checkMacros) {
      assertCondition(
        totals.calories >= targets.calories * 0.9 && totals.calories <= targets.calories * 1.1,
        `Calories out of range for day ${day.day}: ${totals.calories} vs target ${targets.calories}`
      );
      assertCondition(
        totals.carbs >= targets.carbs * 0.9 && totals.carbs <= targets.carbs * 1.1,
        `Carbs out of range for day ${day.day}: ${totals.carbs} vs target ${targets.carbs}`
      );
      assertCondition(
        totals.protein >= targets.protein * 0.55 && totals.protein <= targets.protein * 1.6,
        `Protein out of range for day ${day.day}: ${totals.protein} vs target ${targets.protein}`
      );
    }

    const templateIds = meals.filter((m) => !m.skipped).map((m) => m.templateId);
    assertCondition(
      new Set(templateIds).size === templateIds.length,
      `Repeated dish on day ${day.day}: ${templateIds.join(", ")}`
    );
  });
}

function main() {
  const regularProfile: UserProfile = {
    age: 34,
    weight: 74,
    height: 168,
    condition: "type2_diabetes",
    dietType: "regular",
    allergies: ["none"],
    additionalPreferences: ""
  };
  const vegetarianProfile: UserProfile = {
    age: 29,
    weight: 61,
    height: 170,
    condition: "type2_diabetes",
    dietType: "vegetarian",
    allergies: ["fish", "dairy"],
    additionalPreferences: ""
  };
  const criticalAllergyProfile: UserProfile = {
    age: 40,
    weight: 78,
    height: 172,
    gender: "female",
    condition: "type2_diabetes",
    dietType: "regular",
    allergies: ["Dairy", "Eggs", "Fish"],
    additionalPreferences: ""
  };

  validatePlan(regularProfile, 7);
  validatePlan(vegetarianProfile, 7, { checkMacros: false });

  // Acceptance: ten generated weeks with Dairy + Eggs + Fish — no allergen words in titles/steps
  for (let week = 0; week < 10; week += 1) {
    validatePlan(criticalAllergyProfile, 7, { checkMacros: false });
  }

  process.stdout.write("Generation validation passed (including 10 allergy weeks).\n");
}

main();
