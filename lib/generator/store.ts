"use client";

import { generateMealPlan } from "@/lib/generator/engine";
import { isProfileComplete } from "@/lib/generator/profile";
import { FIXED_RECIPES } from "@/lib/recipes/data";
import { Condition, MealPlan, Recipe, UserProfile } from "@/types";
import { create } from "zustand";

type GeneratorState = {
  isAuthenticated: boolean;
  profile: UserProfile;
  planDays: 1 | 3 | 7;
  latestPlan: MealPlan | null;
  customRecipes: Recipe[];
  favoriteRecipeIds: string[];
  skippedRecipeIds: string[];
  onboardingStep: 1 | 2 | 3;
  continueAsGuest: () => void;
  setProfile: (profile: Partial<UserProfile>) => void;
  setPlanDays: (days: 1 | 3 | 7) => void;
  setOnboardingStep: (step: 1 | 2 | 3) => void;
  setConditionAndContinue: (condition: Condition) => void;
  setLatestPlan: (plan: MealPlan | null) => void;
  addCustomRecipe: (recipe: Omit<Recipe, "id" | "source">) => string;
  updateCustomRecipe: (id: string, patch: Partial<Omit<Recipe, "id" | "source">>) => void;
  deleteCustomRecipe: (id: string) => void;
  toggleFavoriteRecipe: (id: string) => void;
  toggleSkipRecipe: (id: string) => void;
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
  customRecipes: [],
  favoriteRecipeIds: [],
  skippedRecipeIds: [],
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
  setLatestPlan: (plan) => set({ latestPlan: plan }),
  addCustomRecipe: (recipe) => {
    const id = `custom-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    set((state) => ({
      customRecipes: [...state.customRecipes, { ...recipe, id, source: "custom" }]
    }));
    return id;
  },
  updateCustomRecipe: (id, patch) =>
    set((state) => ({
      customRecipes: state.customRecipes.map((recipe) =>
        recipe.id === id ? { ...recipe, ...patch, source: "custom", id } : recipe
      )
    })),
  deleteCustomRecipe: (id) =>
    set((state) => ({
      customRecipes: state.customRecipes.filter((recipe) => recipe.id !== id),
      favoriteRecipeIds: state.favoriteRecipeIds.filter((recipeId) => recipeId !== id),
      skippedRecipeIds: state.skippedRecipeIds.filter((recipeId) => recipeId !== id)
    })),
  toggleFavoriteRecipe: (id) =>
    set((state) => {
      const exists = state.favoriteRecipeIds.includes(id);
      return {
        favoriteRecipeIds: exists
          ? state.favoriteRecipeIds.filter((recipeId) => recipeId !== id)
          : [...state.favoriteRecipeIds, id]
      };
    }),
  toggleSkipRecipe: (id) =>
    set((state) => {
      const exists = state.skippedRecipeIds.includes(id);
      return {
        skippedRecipeIds: exists
          ? state.skippedRecipeIds.filter((recipeId) => recipeId !== id)
          : [...state.skippedRecipeIds, id]
      };
    }),
  generatePlan: (daysOverride) => {
    const { profile, planDays, isAuthenticated, customRecipes, favoriteRecipeIds, skippedRecipeIds } = get();
    if (!isAuthenticated) {
      throw new Error("Please start from create account or guest mode.");
    }
    if (!isProfileComplete(profile)) {
      throw new Error("Please complete your profile before generating a meal plan.");
    }
    const effectiveDays = daysOverride ?? planDays;
    const plan = generateMealPlan(profile, effectiveDays, {
      recipes: [...FIXED_RECIPES, ...customRecipes],
      favoriteRecipeIds,
      skippedRecipeIds
    });
    set({ latestPlan: plan, planDays: effectiveDays });
    return plan;
  }
}));
