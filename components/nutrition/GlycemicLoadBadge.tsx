import { glycemicLoadRangeLabel } from "@/lib/nutrition/calc";

export const GL_BADGE_TOOLTIP =
  "Estimated from the dish ingredients. Individual glucose response can differ — use your own readings as the guide.";

type GlycemicLoadBadgeProps = {
  glycemicLoad: number;
  className?: string;
};

export function GlycemicLoadBadge({ glycemicLoad, className = "" }: GlycemicLoadBadgeProps) {
  const level = glycemicLoadRangeLabel(glycemicLoad);
  const tone =
    level === "Low"
      ? "border-[#CDE7D7] bg-[#EAF5EF] text-[#2D7A51]"
      : level === "Medium"
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : "border-red-200 bg-red-50 text-red-700";

  return (
    <span
      title={GL_BADGE_TOOLTIP}
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${tone} ${className}`.trim()}
    >
      GL {level}
    </span>
  );
}
