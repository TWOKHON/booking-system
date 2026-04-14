import type { FeatureValue } from "@/types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPlusDividerIndex(
  planKey: string,
  features: { values: Record<string, FeatureValue> }[],
): number | null {
  const planOrder = ["free_trial", "starter", "growth", "enterprise"];
  const planIndex = planOrder.indexOf(planKey);
  if (planIndex === 0) return null;
  const prevPlan = planOrder[planIndex - 1];

  for (let i = 0; i < features.length; i++) {
    const prevValue = features[i].values[prevPlan];
    const currValue = features[i].values[planKey];
    if (prevValue === false && currValue !== false) {
      return i;
    }
  }
  return null;
}
