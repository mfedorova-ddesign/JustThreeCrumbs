"use client";

import { generateMealPlan } from "@/lib/generator/engine";
import { isProfileComplete } from "@/lib/generator/profile";
import { Condition, MealPlan, UserProfile } from "@/types";
import { create } from "zustand";

type GeneratorState = {
  isAuthenticated: boolean;
  profile: UserProfile;
  planDays: 1 | 3 | 7;
  latestPlan: MealPlan | null;
  onboardingStep: 1 | 2 | 3;
  continueAsGuest: () => void;
  setProfile: (profile: Partial<UserProfile>) => void;
  setPlanDays: (days: 1 | 3 | 7) => void;
  setOnboardingStep: (step: 1 | 2 | 3) => void;
  setConditionAndContinue: (condition: Condition) => void;
  generatePlan: (daysOverride?: 1 | 3 | 7) => MealPlan;
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
  isAuthenticated: false,
  profile: defaultProfile,
  planDays: 1,
  latestPlan: null,
  onboardingStep: 1,
  continueAsGuest: () => {
    set({
      isAuthenticated: true
    });
  },
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
  generatePlan: (daysOverride) => {
    const { profile, planDays, isAuthenticated } = get();
    if (!isAuthenticated) {
      throw new Error("Please start from create account or guest mode.");
    }
    if (!isProfileComplete(profile)) {
      throw new Error("Please complete your profile before generating a meal plan.");
    }
    const effectiveDays = daysOverride ?? planDays;
    const plan = generateMealPlan(profile, effectiveDays);
    set({ latestPlan: plan, planDays: effectiveDays });
    return plan;
  }
}));
