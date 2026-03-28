import { GeneratedMeal } from "@/types";
import Link from "next/link";

type MealCardProps = {
  meal: GeneratedMeal;
  planId: string;
};

export function MealCard({ meal, planId }: MealCardProps) {
  return (
    <div className="rounded-xl border border-brand-border bg-white p-4 transition-shadow hover:shadow-sm sm:p-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:gap-4">
        <div>
          <h3 className="text-lg font-medium text-brand-text sm:text-xl">{meal.name}</h3>
          <p className="text-sm text-brand-text/70 line-clamp-3">
            {meal.ingredients.map((i) => i.name).join(", ")}
          </p>
        </div>
        <span className="rounded-full bg-brand-bg px-3 py-1 text-sm font-medium text-brand-primary">
          GI {meal.glycemicIndex}
        </span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-brand-text/80 sm:grid-cols-4">
        <p>{meal.calories} kcal</p>
        <p>P {meal.macros.protein}g</p>
        <p>F {meal.macros.fat}g</p>
        <p>C {meal.macros.carbs}g</p>
      </div>
      <Link
        href={`/plan/${planId}?meal=${meal.id}`}
        className="mt-4 inline-block text-sm font-medium text-brand-primary underline"
      >
        View full recipe
      </Link>
    </div>
  );
}
