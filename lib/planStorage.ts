import { MealPlan } from "@/types";

export function planSessionKey(planId: string): string {
  return `jtc_plan_${planId}`;
}

export function persistPlanToSession(plan: MealPlan): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(planSessionKey(plan.id), JSON.stringify(plan));
  } catch {
    // quota / private mode
  }
}

export function readPlanFromSession(planId: string): MealPlan | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(planSessionKey(planId));
    if (!raw) return null;
    return JSON.parse(raw) as MealPlan;
  } catch {
    return null;
  }
}
