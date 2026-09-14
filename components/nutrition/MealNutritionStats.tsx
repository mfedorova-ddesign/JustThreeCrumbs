import { Ingredient } from "@/types";
import { isHighGlycemicLoad, shouldShowGlycemicLoadBadge } from "@/lib/nutrition/calc";
import { GlycemicLoadBadge } from "@/components/nutrition/GlycemicLoadBadge";
import { HighGlycemicLoadNotice } from "@/components/nutrition/HighGlycemicLoadNotice";

type MealNutritionStatsProps = {
  carbs: number;
  fiber: number;
  calories?: number;
  protein?: number;
  fat?: number;
  glycemicLoad: number;
  ingredients: Ingredient[];
  variant?: "strip" | "detail";
  showHighNotice?: boolean;
};

export function MealNutritionStats({
  carbs,
  fiber,
  calories,
  protein,
  fat,
  glycemicLoad,
  ingredients,
  variant = "strip",
  showHighNotice = false
}: MealNutritionStatsProps) {
  const carbsG = Math.round(carbs);
  const fiberG = Math.round(fiber);
  const showBadge = shouldShowGlycemicLoadBadge(ingredients);
  const nearZeroCarbs = carbsG < 5;
  const showNotice = showHighNotice && showBadge && isHighGlycemicLoad(glycemicLoad);

  if (variant === "detail") {
    return (
      <div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          <div className="rounded-lg border border-brand-border bg-white px-3 py-2">
            <div className="text-[12px] text-brand-text/60">Carbs</div>
            <div className="text-lg font-semibold text-brand-text">{carbsG}g</div>
            {nearZeroCarbs ? (
              <div className="text-[10px] text-brand-text/45">Almost no carbs</div>
            ) : null}
          </div>
          <div className="rounded-lg border border-brand-border bg-white px-3 py-2">
            <div className="text-[12px] text-brand-text/60">Fiber</div>
            <div className="text-lg font-semibold text-brand-text">{fiberG}g</div>
          </div>
          {showBadge ? (
            <div className="flex items-center rounded-lg border border-brand-border bg-[#FAFAF8] px-3 py-2">
              <div>
                <div className="text-[12px] text-brand-text/60">Glycemic load</div>
                <div className="mt-1">
                  <GlycemicLoadBadge glycemicLoad={glycemicLoad} />
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-brand-border bg-[#FAFAF8] px-3 py-2">
              <div className="text-[12px] text-brand-text/60">Glycemic load</div>
              <div className="mt-1 text-[12px] text-brand-text/45">
                {nearZeroCarbs ? "Almost no carbs" : "Not estimated"}
              </div>
            </div>
          )}
          {typeof calories === "number" ? (
            <div className="rounded-lg border border-brand-border bg-[#FAFAF8] px-3 py-2">
              <div className="text-[12px] text-brand-text/60">Calories</div>
              <div className="font-medium">{Math.round(calories)}</div>
            </div>
          ) : null}
          {typeof protein === "number" ? (
            <div className="rounded-lg border border-brand-border bg-[#FAFAF8] px-3 py-2">
              <div className="text-[12px] text-brand-text/60">Protein</div>
              <div className="font-medium">{Math.round(protein)}g</div>
            </div>
          ) : null}
          {typeof fat === "number" ? (
            <div className="rounded-lg border border-brand-border bg-[#FAFAF8] px-3 py-2">
              <div className="text-[12px] text-brand-text/60">Fat</div>
              <div className="font-medium">{Math.round(fat)}g</div>
            </div>
          ) : null}
        </div>
        {showNotice ? <HighGlycemicLoadNotice className="mt-3" /> : null}
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-brand-text/55">
        <span className="font-semibold text-brand-text">
          Carbs {carbsG}g{nearZeroCarbs ? " · almost none" : ""}
        </span>
        <span>Fiber {fiberG}g</span>
        {showBadge ? <GlycemicLoadBadge glycemicLoad={glycemicLoad} /> : null}
        {typeof calories === "number" ? <span>{Math.round(calories)} kcal</span> : null}
        {typeof protein === "number" ? <span>P {Math.round(protein)}g</span> : null}
        {typeof fat === "number" ? <span>F {Math.round(fat)}g</span> : null}
      </div>
      {showNotice ? <HighGlycemicLoadNotice className="mt-2" /> : null}
    </div>
  );
}
