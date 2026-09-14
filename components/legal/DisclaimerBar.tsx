import { MEDICAL_DISCLAIMER } from "@/components/legal/MedicalDisclaimer";

/** Full-width strip meant to sit directly under the header, above the fold. */
export function DisclaimerBar() {
  return (
    <aside
      role="note"
      aria-label="Medical disclaimer"
      className="border-b border-amber-200/80 bg-[#FFF8EE]"
    >
      <div className="mx-auto w-full max-w-[1280px] px-4 py-2.5 md:px-8 xl:px-12">
        <p className="text-[12px] leading-snug text-brand-text/80 sm:text-[13px] sm:leading-relaxed">
          {MEDICAL_DISCLAIMER}
        </p>
      </div>
    </aside>
  );
}
