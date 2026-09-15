import { formatMealServingMeta } from "@/lib/nutrition/portions";
import { Ingredient } from "@/types";

type MealServingMetaProps = {
  ingredients: Ingredient[];
  className?: string;
};

/** Serving count and plated weight — matches the nutrition figures on the card. */
export function MealServingMeta({ ingredients, className }: MealServingMetaProps) {
  return (
    <p className={className ?? "text-[12px] text-brand-text/55"}>
      {formatMealServingMeta(ingredients)}
    </p>
  );
}
