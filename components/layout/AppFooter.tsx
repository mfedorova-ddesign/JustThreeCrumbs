import { MedicalDisclaimer } from "@/components/legal/MedicalDisclaimer";

export function AppFooter() {
  return (
    <footer className="bg-[#0A2B1C] py-5">
      <div className="mx-auto w-full max-w-[1120px] px-4 text-center md:px-8">
        <MedicalDisclaimer tone="footer" />
        <p className="mt-2 text-[12px] text-white/75">
          © {new Date().getFullYear()} JustThreeCrumbs. Personalized nutrition planning.
        </p>
      </div>
    </footer>
  );
}
