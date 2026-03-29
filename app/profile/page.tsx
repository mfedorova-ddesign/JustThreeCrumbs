"use client";

import { Button } from "@/components/ui/Button";
import { isProfileComplete } from "@/lib/generator/profile";
import { useGeneratorStore } from "@/lib/generator/store";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, profile, setProfile } = useGeneratorStore();
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth");
    }
  }, [isAuthenticated, router]);

  const canContinue = isProfileComplete(profile);

  useEffect(() => {
    if (canContinue && warningMessage) {
      setWarningMessage(null);
    }
  }, [canContinue, warningMessage]);

  const onNumberChange =
    (field: "age" | "weight" | "height") =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setProfile({ [field]: Number(event.target.value) });
    };

  const ALLERGY_CHIPS = [
    "Dairy",
    "Eggs",
    "Peanuts",
    "Tree Nuts",
    "Soy",
    "Wheat/Gluten",
    "Fish",
    "Shellfish",
    "Sesame",
    "None"
  ] as const;

  const toggleAllergyChip = (chip: (typeof ALLERGY_CHIPS)[number]) => {
    const current = profile.allergies ?? [];
    const hasChip = current.includes(chip);
    if (chip === "None") {
      setProfile({ allergies: hasChip ? [] : ["None"] });
      return;
    }
    const next = hasChip ? current.filter((x) => x !== chip) : [...current, chip];
    setProfile({ allergies: next.filter((x) => x !== "None") });
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-brand-bg">
      <header className="w-full border-b border-brand-border bg-white">
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between px-4 py-4 md:px-8">
          <button
            type="button"
            className="text-[14px] text-brand-text/70 hover:text-brand-text"
            onClick={() => router.push("/auth")}
          >
            ← Back
          </button>
          <img src="/images/logo-full.png" alt="JustThreeCrumbs" className="h-8 w-auto" />
          <div className="h-6 w-10" />
        </div>
      </header>

      <main className="mx-auto w-full max-w-[760px] px-4 py-8 md:px-8">
        <h1 className="text-[30px] font-medium text-brand-text">Profile Settings</h1>
        <p className="mt-2 text-[14px] text-brand-text/70">
          These values are used directly for personalized meal targets and generation.
        </p>

        <div className="mt-6 rounded-xl border border-brand-border bg-white p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block text-[14px] font-medium text-brand-text/80">
              Age *
              <input
                type="number"
                min={1}
                value={profile.age > 0 ? profile.age : ""}
                onChange={onNumberChange("age")}
                className="mt-1 w-full rounded-xl border border-brand-border px-4 py-2"
              />
            </label>
            <label className="block text-[14px] font-medium text-brand-text/80">
              Gender *
              <select
                value={profile.gender ?? ""}
                onChange={(event) => setProfile({ gender: event.target.value || undefined })}
                className="mt-1 w-full rounded-xl border border-brand-border px-4 py-2"
              >
                <option value="">Select gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label className="block text-[14px] font-medium text-brand-text/80">
              Weight (kg) *
              <input
                type="number"
                min={1}
                value={profile.weight > 0 ? profile.weight : ""}
                onChange={onNumberChange("weight")}
                className="mt-1 w-full rounded-xl border border-brand-border px-4 py-2"
              />
            </label>
            <label className="block text-[14px] font-medium text-brand-text/80">
              Height (cm) *
              <input
                type="number"
                min={1}
                value={profile.height > 0 ? profile.height : ""}
                onChange={onNumberChange("height")}
                className="mt-1 w-full rounded-xl border border-brand-border px-4 py-2"
              />
            </label>
          </div>

          <div className="mt-5">
            <div className="mb-2 text-[14px] font-medium text-brand-text/80">Health Condition *</div>
            <select
              value={profile.condition}
              onChange={(event) =>
                setProfile({
                  condition: event.target.value as typeof profile.condition
                })
              }
              className="w-full rounded-xl border border-brand-border bg-white px-4 py-2 text-[15px] text-brand-text focus:outline-none focus:ring-4 focus:ring-brand-primary/20"
            >
              <option value="type2_diabetes">Type 2 Diabetes (available now)</option>
            </select>
          </div>

          <div className="mt-5">
            <div className="mb-2 text-[14px] font-medium text-brand-text/80">Diet Type *</div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {(["regular", "vegetarian"] as const).map((diet) => (
                <button
                  key={diet}
                  type="button"
                  onClick={() => setProfile({ dietType: diet })}
                  className={`rounded-xl border px-4 py-3 text-left ${
                    profile.dietType === diet
                      ? "border-brand-primary bg-[#EAF5EF]"
                      : "border-brand-border bg-white"
                  }`}
                >
                  <div className="text-[15px] font-medium text-brand-text">
                    {diet === "regular" ? "Regular" : "Vegetarian"}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <div className="text-[14px] font-medium text-brand-text/80">Food Allergies *</div>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {ALLERGY_CHIPS.map((chip) => {
                const selected = profile.allergies.includes(chip);
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => toggleAllergyChip(chip)}
                    className={`rounded-xl border px-3 py-2 text-[13px] ${
                      selected
                        ? "border-brand-primary bg-[#EAF5EF] text-brand-primary"
                        : "border-brand-border bg-white text-brand-text/80"
                    }`}
                  >
                    {chip}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="mt-5 block text-[14px] font-medium text-brand-text/80">
            Additional Preferences
            <textarea
              value={profile.additionalPreferences ?? ""}
              onChange={(event) => setProfile({ additionalPreferences: event.target.value })}
              className="mt-1 min-h-[100px] w-full rounded-xl border border-brand-border px-4 py-2"
            />
          </label>

          <div className="mt-6">
            <Button
              type="button"
              variant="primary"
              className="w-full"
              onClick={() => {
                if (!canContinue) {
                  setWarningMessage(
                    "We need your profile details to create the most accurate and optimal meal plan for you."
                  );
                  return;
                }
                router.push("/generator");
              }}
            >
              Save Profile
            </Button>
            {warningMessage ? (
              <div className="mt-3 rounded-lg border border-[#E8B4B7] bg-[#FFF5F5] px-3 py-2 text-center text-[12px] text-[#A43B43]">
                {warningMessage}
              </div>
            ) : null}
            {!canContinue ? (
              <p className="mt-2 text-center text-[12px] text-brand-text/60">
                Fill required fields to unlock generation.
              </p>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
