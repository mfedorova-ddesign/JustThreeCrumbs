export const MEDICAL_DISCLAIMER =
  "JustThreeCrumbs is a meal-planning tool, not a medical device, and not a substitute for professional medical advice. The information provided is not intended to diagnose or treat diabetes. Please consult your doctor or a registered dietitian before making changes to your diet.";

type MedicalDisclaimerProps = {
  className?: string;
  tone?: "banner" | "plan" | "footer";
};

export function MedicalDisclaimer({ className = "", tone = "banner" }: MedicalDisclaimerProps) {
  if (tone === "footer") {
    return (
      <p className={`text-[12px] leading-relaxed text-white/85 ${className}`.trim()}>{MEDICAL_DISCLAIMER}</p>
    );
  }

  const toneClass =
    tone === "plan"
      ? "border-amber-300/90 bg-[#FFF8EE] px-3.5 py-3 sm:px-4"
      : "border-amber-200/90 bg-[#FFF8EE] px-3 py-2.5 sm:px-4";

  return (
    <aside
      role="note"
      aria-label="Medical disclaimer"
      className={`rounded-xl border text-[12px] leading-snug text-brand-text/80 sm:text-[13px] sm:leading-relaxed ${toneClass} ${className}`.trim()}
    >
      {MEDICAL_DISCLAIMER}
    </aside>
  );
}
