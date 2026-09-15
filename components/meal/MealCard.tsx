import { mealImageUrlForId } from "@/lib/design/mealImages";
import { MealServingMeta } from "@/components/meal/MealServingMeta";
import { MealNutritionStats } from "@/components/nutrition/MealNutritionStats";
import { formatIngredientWithGrams } from "@/lib/nutrition/portions";
import { GeneratedMeal } from "@/types";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

type MealCardProps = {
  meal: GeneratedMeal;
  planId: string;
};

export function MealCard({ meal, planId }: MealCardProps) {
  const imageUrl = mealImageUrlForId(meal.id);

  return (
    <article className="overflow-hidden rounded-2xl border border-brand-border/90 bg-white shadow-soft transition-shadow hover:shadow-md">
      <div className="flex gap-0 sm:gap-1">
        <div className="relative h-[100px] w-[88px] shrink-0 sm:h-[112px] sm:w-[100px]">
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between p-3 pr-2 sm:p-4 sm:pr-4">
          <div>
            <h3 className="text-[15px] font-semibold leading-snug tracking-tight text-brand-text sm:text-base">
              {meal.name}
            </h3>
            <MealServingMeta ingredients={meal.ingredients} className="mt-0.5 text-[11px] text-brand-text/50" />
            <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-brand-text/60 sm:text-[13px]">
              {meal.ingredients.map((i) => formatIngredientWithGrams(i)).join(", ")}
            </p>
          </div>
          <div className="mt-2">
            <MealNutritionStats
              carbs={meal.macros.carbs}
              fiber={meal.fiber}
              calories={meal.calories}
              glycemicLoad={meal.glycemicLoad}
              ingredients={meal.ingredients}
              showHighNotice
            />
          </div>
        </div>
        <Link
          href={`/plan/${planId}?meal=${meal.id}`}
          className="flex shrink-0 items-center self-stretch px-2 text-brand-primary hover:bg-brand-bg/80 sm:px-3"
          aria-label="View full recipe"
        >
          <ChevronRight className="size-5 sm:size-6" strokeWidth={2} />
        </Link>
      </div>
    </article>
  );
}
