import { MealPlan } from "@/types";

const LATEST_PLAN_ID_KEY = "jtc_latest_plan_id";

export function planStorageKey(planId: string): string {
  return `jtc_plan_${planId}`;
}

/** @deprecated use planStorageKey — kept for callers that imported the old name */
export function planSessionKey(planId: string): string {
  return planStorageKey(planId);
}

function canUseStorage(): boolean {
  return typeof window !== "undefined";
}

function writePlan(plan: MealPlan, storage: Storage): void {
  storage.setItem(planStorageKey(plan.id), JSON.stringify(plan));
  storage.setItem(LATEST_PLAN_ID_KEY, plan.id);
}

function readPlan(planId: string, storage: Storage): MealPlan | null {
  const raw = storage.getItem(planStorageKey(planId));
  if (!raw) return null;
  return JSON.parse(raw) as MealPlan;
}

/** Persist plan so hard refresh and new tabs can restore it (localStorage). */
export function persistPlanToSession(plan: MealPlan): void {
  if (!canUseStorage()) return;
  try {
    writePlan(plan, localStorage);
  } catch {
    // quota / private mode — try session as last resort
    try {
      writePlan(plan, sessionStorage);
    } catch {
      // ignore
    }
  }
}

export function readPlanFromSession(planId: string): MealPlan | null {
  if (!canUseStorage() || !planId) return null;
  try {
    const fromLocal = readPlan(planId, localStorage);
    if (fromLocal) return fromLocal;
  } catch {
    // ignore
  }
  try {
    const fromSession = readPlan(planId, sessionStorage);
    if (fromSession) {
      // Migrate older session-only plans into localStorage
      try {
        writePlan(fromSession, localStorage);
      } catch {
        // ignore
      }
      return fromSession;
    }
  } catch {
    // ignore
  }
  return null;
}

export function readLatestPlanFromStorage(): MealPlan | null {
  if (!canUseStorage()) return null;
  try {
    const id = localStorage.getItem(LATEST_PLAN_ID_KEY) ?? sessionStorage.getItem(LATEST_PLAN_ID_KEY);
    if (!id) return null;
    return readPlanFromSession(id);
  } catch {
    return null;
  }
}
