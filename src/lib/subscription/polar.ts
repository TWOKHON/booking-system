import type { PlanKey } from "@/types";

export type PaidPlanKey = Exclude<PlanKey, "free_trial">;
export type BillingFrequency = "monthly" | "yearly";

const polarProductEnvKeys: Record<PaidPlanKey, Record<BillingFrequency, string>> = {
  starter: {
    monthly: "POLAR_PRODUCT_STARTER_MONTHLY",
    yearly: "POLAR_PRODUCT_STARTER_YEARLY",
  },
  growth: {
    monthly: "POLAR_PRODUCT_GROWTH_MONTHLY",
    yearly: "POLAR_PRODUCT_GROWTH_YEARLY",
  },
  enterprise: {
    monthly: "POLAR_PRODUCT_ENTERPRISE_MONTHLY",
    yearly: "POLAR_PRODUCT_ENTERPRISE_YEARLY",
  },
};

export function getPolarServer() {
  return process.env.POLAR_SERVER === "production" ? "production" : "sandbox";
}

export function getPolarProductId(plan: PaidPlanKey, billing: BillingFrequency) {
  return process.env[polarProductEnvKeys[plan][billing]];
}

export function getPolarCheckoutPlanPath(input: {
  plan: PlanKey;
  billing: BillingFrequency;
}) {
  const params = new URLSearchParams({
    plan: input.plan,
    billing: input.plan === "free_trial" ? "monthly" : input.billing,
  });

  return input.plan === "free_trial"
    ? `/auth/sign-up?userType=tenant&${params.toString()}`
    : `/api/polar/checkout-plan?${params.toString()}`;
}
