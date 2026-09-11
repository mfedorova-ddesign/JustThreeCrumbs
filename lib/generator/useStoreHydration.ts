"use client";

import { useGeneratorStore } from "@/lib/generator/store";
import { useEffect } from "react";

/** Ensures zustand persist finishes before auth/plan gates run (Next.js SSR-safe). */
export function useStoreHydration(): boolean {
  const hasHydrated = useGeneratorStore((state) => state._hasHydrated);

  useEffect(() => {
    const markReady = () => {
      useGeneratorStore.getState().setHasHydrated(true);
    };

    const unsub = useGeneratorStore.persist.onFinishHydration(markReady);

    if (useGeneratorStore.persist.hasHydrated()) {
      markReady();
    } else {
      Promise.resolve(useGeneratorStore.persist.rehydrate()).finally(markReady);
    }

    // Failsafe: never leave the UI spinning if hydration stalls
    const timeout = window.setTimeout(markReady, 1500);
    return () => {
      unsub();
      window.clearTimeout(timeout);
    };
  }, []);

  return hasHydrated;
}
