import { generateMealPlan } from "../lib/generator/engine";
import { recommendedDailyTargets } from "../lib/generator/targets";
import { DayPlan, GeneratedMeal, UserProfile } from "../types";

function assertCondition(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

function totalsForDay(day: DayPlan) {
  const meals = [day.breakfast, day.lunch, day.dinner, day.snack, day.extraSnack].filter(Boolean) as GeneratedMeal[];
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
  const out = new Set<string>();
  allergies.map((a) => a.toLowerCase().trim()).forEach((a) => {
    if (!a || a === "none") return;
    out.add(a);
    if (a === "milk") out.add("dairy");
    if (a === "dairy") out.add("milk");
    if (a === "tree nut") out.add("tree nuts");
    if (a === "tree nuts") out.add("tree nut");
  });
  return out;
}

function validatePlan(profile: UserProfile, days: number) {
  const plan = generateMealPlan(profile, days);
  const allergies = allergySet(profile.allergies);
  const targets = recommendedDailyTargets(profile);

  plan.days.forEach((day) => {
    const totals = totalsForDay(day);
    const meals = [day.breakfast, day.lunch, day.dinner, day.snack, day.extraSnack].filter(Boolean) as GeneratedMeal[];

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
    });

    // We do not force exact targets, but generation should be reasonably close.
    assertCondition(
      totals.calories >= targets.calories * 0.75 && totals.calories <= targets.calories * 1.35,
      `Calories out of range for day ${day.day}: ${totals.calories} vs target ${targets.calories}`
    );
    assertCondition(
      totals.protein >= targets.protein * 0.65 && totals.protein <= targets.protein * 1.45,
      `Protein out of range for day ${day.day}: ${totals.protein} vs target ${targets.protein}`
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

  validatePlan(regularProfile, 7);
  validatePlan(vegetarianProfile, 7);
  process.stdout.write("Generation validation passed.\n");
}

main();
