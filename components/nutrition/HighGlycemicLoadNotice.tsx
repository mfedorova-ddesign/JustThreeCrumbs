type HighGlycemicLoadNoticeProps = {
  className?: string;
};

export function HighGlycemicLoadNotice({ className = "" }: HighGlycemicLoadNoticeProps) {
  return (
    <div
      className={`rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-[12px] leading-snug text-red-900 ${className}`.trim()}
    >
      <p className="font-semibold">High glycemic load</p>
      <p className="mt-1 text-red-900/80">
        This dish is above the usual per-meal range. Try a smaller carb portion, swap the carb, or
        split it across meals.
      </p>
    </div>
  );
}
