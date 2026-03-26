import { UserProfile } from "@/types";

export function estimateDailyCalories(user: UserProfile): number {
  const { age, weight, height, gender } = user;
  if (age <= 0 || weight <= 0 || height <= 0) return 1800;

  const baseBmr =
    gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : gender === "female"
        ? 10 * weight + 6.25 * height - 5 * age - 161
        : 10 * weight + 6.25 * height - 5 * age - 78;

  const sedentaryTdee = baseBmr * 1.3;
  const diabetesFriendlyTarget = sedentaryTdee * 0.9;
  return Math.round(Math.min(2600, Math.max(1300, diabetesFriendlyTarget)));
}

export function recommendedDailyTargets(user: UserProfile): {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
} {
  const calories = estimateDailyCalories(user);

  // Diabetes-friendly distribution (moderate carbs, higher protein/fat balance)
  const carbsKcal = calories * 0.35;
  const proteinKcal = calories * 0.30;
  const fatKcal = calories * 0.35;

  const carbs = Math.round(carbsKcal / 4);
  const protein = Math.round(proteinKcal / 4);
  const fat = Math.round(fatKcal / 9);
  const fiber = Math.round(Math.max(25, calories / 1000 * 14));

  return { calories, protein, fat, carbs, fiber };
}
