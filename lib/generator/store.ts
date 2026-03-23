"use client";

import { generateMealPlan } from "@/lib/generator/engine";
import { Condition, MealPlan, UserProfile } from "@/types";
import { create } from "zustand";

type GeneratorState = {
  profile: UserProfile;
  planDays: 1 | 3 | 7;
  latestPlan: MealPlan | null;
  onboardingStep: 1 | 2 | 3;
  setProfile: (profile: Partial<UserProfile>) => void;
  setPlanDays: (days: 1 | 3 | 7) => void;
  setOnboardingStep: (step: 1 | 2 | 3) => void;
  setConditionAndContinue: (condition: Condition) => void;
  generatePlan: () => MealPlan;
};

const defaultProfile: UserProfile = {
  age: 0,
  weight: 0,
  height: 0,
  gender: undefined,
  condition: "type2_diabetes",
  dietType: "regular",
  allergies: [],
  additionalPreferences: ""
};

export const useGeneratorStore = create<GeneratorState>((set, get) => ({
  profile: defaultProfile,
  planDays: 1,
  latestPlan: null,
  onboardingStep: 1,
  setProfile: (profile) =>
    set((state) => ({
      profile: {
        ...state.profile,
        ...profile
      }
    })),
  setPlanDays: (days) => set({ planDays: days }),
  setOnboardingStep: (step) => set({ onboardingStep: step }),
  setConditionAndContinue: (condition) =>
    set((state) => ({
      profile: {
        ...state.profile,
        condition
      },
      onboardingStep: 3
    })),
  generatePlan: () => {
    const { profile, planDays } = get();
    const plan = generateMealPlan(profile, planDays);
    set({ latestPlan: plan });
    return plan;
  }
}));
