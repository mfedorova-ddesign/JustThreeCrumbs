"use client";

import { Button } from "@/components/ui/Button";
import { useGeneratorStore } from "@/lib/generator/store";
import { useRouter } from "next/navigation";
import { ChangeEvent } from "react";

export default function OnboardingPage() {
  const { profile, setProfile, onboardingStep, setConditionAndContinue } =
    useGeneratorStore();
  const router = useRouter();

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
    // If selecting a real allergy, remove "None".
    setProfile({ allergies: next.filter((x) => x !== "None") });
  };

  return (
    <div className="min-h-screen bg-brand-bg">
      <header className="w-full border-b border-brand-border bg-white">
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between px-4 py-4 md:px-8">
          <button
            type="button"
            className="text-[14px] leading-[1.6] font-normal text-brand-text/70 hover:text-brand-text"
            onClick={() => router.push("/")}
          >
            ← Back
          </button>
          <img src="/images/logo-full.png" alt="JustThreeCrumbs" className="h-8 w-auto" />
          <div className="h-6 w-10" />
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1280px] px-4 py-8 md:px-8 md:py-14">
        {onboardingStep === 1 ? (
          <div className="text-center">
            <div className="mx-auto inline-flex items-center rounded-full bg-[#EAF5EF] px-5 py-2 text-[14px] leading-[1.6] font-normal text-brand-primary">
              Step 1 of 3
            </div>

            <h2 className="mt-6 text-[30px] font-medium leading-tight text-brand-text sm:text-[34px] md:mt-7 md:text-[40px]">
              Select Your Health Condition
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-[16px] leading-[1.6] text-brand-text/70">
              Choose your medical condition to receive a personalized meal plan tailored to your
              specific dietary needs
            </p>

            <div className="mt-8 md:mt-10">
              <div className="mx-auto w-full max-w-[760px] rounded-xl border border-brand-border bg-white p-4 shadow-sm sm:p-6 md:p-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#EAF5EF] sm:h-16 sm:w-16">
                    {/* Lucide heart-pulse (medical-themed) */}
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      stroke="#066835"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
                      <path d="M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
                    </svg>
                  </div>

                  <div className="flex-1 text-left">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-[20px] leading-[1.6] font-medium text-brand-text">
                        Type 2 Diabetes
                      </h3>
                      <span className="inline-flex items-center rounded-full bg-[#EAF5EF] px-3 py-1 text-[14px] leading-[1.6] font-normal text-brand-primary">
                        Available Now
                      </span>
                    </div>

                    <p className="mt-2 text-[16px] leading-[1.6] text-brand-text/70">
                      Get personalized meal plans designed to help manage blood sugar levels, maintain
                      healthy weight, and support overall wellness with diabetes-friendly recipes.
                    </p>

                    <ul className="mt-4 grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2">
                      {[
                        "Low glycemic index meals",
                        "Portion-controlled recipes",
                        "Balanced carbohydrates",
                        "Heart-healthy options"
                      ].map((text) => (
                        <li
                          key={text}
                          className="flex items-center gap-2 text-[16px] leading-[1.6] text-brand-text/80"
                        >
                          <span className="inline-flex h-[20px] w-[20px] items-center justify-center rounded-full border-2 border-brand-primary">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-brand-primary"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </span>
                          {text}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6">
                      <Button
                        type="button"
                        variant="primary"
                        onClick={() => setConditionAndContinue("type2_diabetes")}
                        className="mx-auto w-full sm:w-[310px]"
                      >
                        Continue with Type 2 Diabetes
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="mt-10 text-[24px] leading-[1.6] font-medium text-brand-text">
              More Conditions Coming Soon
            </h3>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-[1280px] px-0 pb-10 pt-6 sm:px-4 sm:pt-8 md:px-8 md:pb-14 md:pt-10">
            <div className="text-center">
              <div className="mx-auto inline-flex items-center rounded-full bg-[#EAF5EF] px-5 py-2 text-[12px] font-semibold text-brand-primary">
                Final Step
              </div>

              <h2 className="mt-4 text-[30px] font-medium leading-tight text-brand-text sm:mt-5 sm:text-[36px] md:text-[40px]">
                Tell us about yourself
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-[14px] leading-[1.6] text-brand-text/70">
                This helps us create your personalized meal plan tailored to your specific needs
              </p>

              <div className="mx-auto mt-5 w-full max-w-[260px]">
                <div className="relative h-4">
                  <div className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 bg-brand-primary" />
                  <div className="absolute left-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-brand-primary" />
                  <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-primary" />
                  <div className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-brand-primary" />
                </div>
                <div className="mt-1 inline-flex items-center rounded-full border border-brand-border bg-white px-6 py-1 text-[12px] font-semibold text-brand-text/50">
                  Step 3 of 3
                </div>
              </div>
            </div>

            <div className="mt-8 mx-auto w-full max-w-[760px] rounded-xl border border-brand-border bg-white p-4 shadow-sm sm:p-6 md:mt-10 md:p-7">
              <div className="pb-5">
                <div className="flex items-center gap-2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="#066835"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <h3 className="text-[20px] leading-[1.6] font-medium text-brand-text">
                    Personal Information
                  </h3>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 sm:mt-6 sm:grid-cols-2">
                  <label className="block text-[14px] leading-[1.6] font-medium text-brand-text/80">
                    Age <span className="text-brand-primary">*</span>
                    <input
                      type="number"
                      min={1}
                      value={profile.age > 0 ? profile.age : ""}
                      placeholder="e.g., 45"
                      onChange={onNumberChange("age")}
                      className="mt-1 w-full rounded-xl border border-brand-border bg-white px-4 py-2 text-[16px] leading-[1.6] text-brand-text placeholder:text-brand-text/40 focus:outline-none focus:ring-4 focus:ring-brand-primary/20"
                    />
                  </label>

                  <label className="block text-[14px] leading-[1.6] font-medium text-brand-text/80">
                    Gender <span className="text-brand-primary">*</span>
                    <select
                      value={profile.gender ?? ""}
                      onChange={(event) =>
                        setProfile({ gender: event.target.value || undefined })
                      }
                      className="mt-1 w-full rounded-xl border border-brand-border bg-white px-4 py-2 text-[16px] leading-[1.6] text-brand-text focus:outline-none focus:ring-4 focus:ring-brand-primary/20"
                    >
                      <option value="">Select gender</option>
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="other">Other</option>
                    </select>
                  </label>

                  <label className="block text-[14px] leading-[1.6] font-medium text-brand-text/80">
                    Weight (kg) <span className="text-brand-primary">*</span>
                    <input
                      type="number"
                      min={1}
                      value={profile.weight > 0 ? profile.weight : ""}
                      placeholder="e.g., 75"
                      onChange={onNumberChange("weight")}
                      className="mt-1 w-full rounded-xl border border-brand-border bg-white px-4 py-2 text-[16px] leading-[1.6] text-brand-text placeholder:text-brand-text/40 focus:outline-none focus:ring-4 focus:ring-brand-primary/20"
                    />
                  </label>

                  <label className="block text-[14px] leading-[1.6] font-medium text-brand-text/80">
                    Height (cm) <span className="text-brand-primary">*</span>
                    <input
                      type="number"
                      min={1}
                      value={profile.height > 0 ? profile.height : ""}
                      placeholder="e.g., 170"
                      onChange={onNumberChange("height")}
                      className="mt-1 w-full rounded-xl border border-brand-border bg-white px-4 py-2 text-[16px] leading-[1.6] text-brand-text placeholder:text-brand-text/40 focus:outline-none focus:ring-4 focus:ring-brand-primary/20"
                    />
                  </label>
                </div>
              </div>

              <div className="h-[1px] bg-brand-border" />

              <div className="pt-5">
                <div className="flex items-center gap-2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="#066835"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 19c0-5 4-9 8-9s8 4 8 9" />
                    <path d="M12 10V3" />
                    <path d="M8 7h8" />
                  </svg>
                  <h3 className="text-[20px] leading-[1.6] font-medium text-brand-text">
                    Health &amp; Dietary Information
                  </h3>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-5">
                  <label className="block text-[14px] leading-[1.6] font-medium text-brand-text/80">
                    Medical Condition <span className="text-brand-primary">*</span>
                    <select
                      value={profile.condition}
                      onChange={(event) =>
                        setProfile({
                          condition: event.target.value as typeof profile.condition
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-brand-border bg-white px-4 py-2 text-[16px] leading-[1.6] text-brand-text focus:outline-none focus:ring-4 focus:ring-brand-primary/20"
                    >
                      <option value="type2_diabetes">Type 2 Diabetes</option>
                    </select>
                  </label>

                  <div>
                    <div className="mb-3 text-[14px] font-medium leading-[1.6] text-brand-text/80">
                      Diet Type <span className="text-brand-primary">*</span>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => setProfile({ dietType: "regular" })}
                        className={`rounded-xl border px-4 py-4 text-left transition focus:outline-none focus:ring-4 focus:ring-brand-primary/20 ${
                          profile.dietType === "regular"
                            ? "border-brand-primary bg-[#EAF5EF]"
                            : "border-brand-border bg-white hover:bg-brand-bg"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[20px]">🥔</span>
                          <div className="text-[16px] font-medium leading-[1.6] text-brand-text">
                            Regular
                          </div>
                        </div>
                        <div className="mt-2 text-[14px] leading-[1.6] text-brand-text/60">
                          Includes plant foods
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setProfile({ dietType: "vegetarian" })}
                        className={`rounded-xl border px-4 py-4 text-left transition focus:outline-none focus:ring-4 focus:ring-brand-primary/20 ${
                          profile.dietType === "vegetarian"
                            ? "border-brand-primary bg-[#EAF5EF]"
                            : "border-brand-border bg-white hover:bg-brand-bg"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[20px]">🥬</span>
                          <div className="text-[16px] font-medium leading-[1.6] text-brand-text">
                            Vegetarian
                          </div>
                        </div>
                        <div className="mt-2 text-[14px] leading-[1.6] text-brand-text/60">
                          Plant-based meals
                        </div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="text-[14px] leading-[1.6] font-medium text-brand-text/80">
                      Food Allergies <span className="text-brand-primary">*</span>
                    </div>
                    <div className="mt-1 text-[14px] leading-[1.6] text-brand-text/60">
                      Select all that apply
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {ALLERGY_CHIPS.map((chip) => {
                        const selected = profile.allergies.includes(chip);
                        return (
                          <button
                            key={chip}
                            type="button"
                            onClick={() => toggleAllergyChip(chip)}
                            className={`rounded-xl border px-3 py-2 text-[14px] leading-[1.6] transition focus:outline-none focus:ring-4 focus:ring-brand-primary/20 ${
                              selected
                                ? "border-brand-primary bg-[#EAF5EF] text-brand-primary"
                                : "border-brand-border bg-white text-brand-text/80 hover:bg-brand-bg"
                            }`}
                          >
                            {chip}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <label className="block text-[14px] leading-[1.6] font-medium text-brand-text/80">
                    Additional Preferences{" "}
                    <span className="font-normal text-brand-text/60">(Optional)</span>
                    <textarea
                      value={profile.additionalPreferences ?? ""}
                      onChange={(event) =>
                        setProfile({ additionalPreferences: event.target.value })
                      }
                      placeholder="E.g., I don’t like spicy food, prefer quick meals, etc."
                      className="mt-1 min-h-[110px] w-full rounded-xl border border-brand-border bg-white px-4 py-2 text-[16px] leading-[1.6] text-brand-text placeholder:text-brand-text/40 focus:outline-none focus:ring-4 focus:ring-brand-primary/20"
                    />
                  </label>
                </div>
              </div>

              <div className="mt-7">
                <button
                  type="button"
                  className="w-full rounded-xl bg-brand-primary px-6 py-3 text-[14px] font-semibold text-white hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-brand-primary/20"
                  onClick={() => router.push("/generator")}
                >
                  Complete Setup &amp; Generate Meal Plan &gt;
                </button>
              </div>

              <div className="mt-6 rounded-xl border border-brand-border bg-white px-6 py-4 text-[14px] leading-[1.6] text-brand-text/70">
                <div className="flex items-start gap-3">
                  <span className="mt-[2px] inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#EAF5EF]">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      stroke="#066835"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 17v-5" />
                      <circle cx="12" cy="7" r="2" />
                      <path d="M5 21h14" />
                    </svg>
                  </span>
                  <span>
                    Your health information is private and secure. We use this data only to
                    personalize your meal plans.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
