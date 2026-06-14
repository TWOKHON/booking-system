import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PRICING_PLANS } from "@/constants";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  getTenantEntitlements,
  type SubscriptionPlan,
  type SubscriptionStatus,
} from "@/lib/subscription/entitlements";
import { getActivePolarSubscriptionForExternalCustomer } from "@/lib/subscription/polar";
import { BillingWorkspaceView } from "./_components/BillingWorkspaceView";
import type { BillingRecord, BillingRecordStatus } from "./_components/billing-data";

type BillingCycle = "MONTHLY" | "YEARLY";

function formatDate(value: Date | null | undefined) {
  if (!value) return null;

  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

function daysUntil(value: Date | null | undefined) {
  if (!value) return null;

  return Math.max(0, Math.ceil((value.getTime() - Date.now()) / 86_400_000));
}

function planKeyFromDb(plan: SubscriptionPlan) {
  if (plan === "FREE_TRIAL") return "free_trial";
  if (plan === "STARTER") return "starter";
  if (plan === "GROWTH") return "growth";
  return "enterprise";
}

function readablePlan(plan: SubscriptionPlan) {
  if (plan === "FREE_TRIAL") return "Free Trial";
  if (plan === "STARTER") return "Starter";
  if (plan === "GROWTH") return "Growth";
  return "Enterprise";
}

function planFromPolarProductId(productId: string | null | undefined) {
  if (productId === process.env.POLAR_PRODUCT_STARTER_MONTHLY) return "STARTER" as const;
  if (productId === process.env.POLAR_PRODUCT_STARTER_YEARLY) return "STARTER" as const;
  if (productId === process.env.POLAR_PRODUCT_GROWTH_MONTHLY) return "GROWTH" as const;
  if (productId === process.env.POLAR_PRODUCT_GROWTH_YEARLY) return "GROWTH" as const;
  if (productId === process.env.POLAR_PRODUCT_ENTERPRISE_MONTHLY) return "ENTERPRISE" as const;
  if (productId === process.env.POLAR_PRODUCT_ENTERPRISE_YEARLY) return "ENTERPRISE" as const;
  return null;
}

function billingCycleFromPolarInterval(interval: string | undefined) {
  return interval === "year" ? ("YEARLY" as const) : ("MONTHLY" as const);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(value);
}

function getPlanAmount(plan: SubscriptionPlan, billingCycle: BillingCycle) {
  const pricingPlan = PRICING_PLANS.find((item) => item.key === planKeyFromDb(plan));

  if (!pricingPlan) {
    return 0;
  }

  return billingCycle === "YEARLY"
    ? pricingPlan.yearlyPrice ?? pricingPlan.price * 12
    : pricingPlan.price;
}

function getPriceLabel(plan: SubscriptionPlan, billingCycle: BillingCycle) {
  const amount = getPlanAmount(plan, billingCycle);

  if (amount === 0) {
    return "No subscription charge";
  }

  return `${formatCurrency(amount)} / ${billingCycle === "YEARLY" ? "year" : "month"}`;
}

function mapStatusToRecordStatus(
  status: SubscriptionStatus,
  plan: SubscriptionPlan,
): BillingRecordStatus {
  if (status === "TRIALING" || plan === "FREE_TRIAL") return "TRIALING";
  if (status === "ACTIVE") return "UPCOMING";
  if (status === "PAST_DUE") return "PAST_DUE";
  if (status === "CANCELED" || status === "REVOKED" || status === "SUSPENDED") {
    return "CANCELED";
  }
  return "PENDING";
}

function buildBillingRecords(input: {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  trialStartedAt: Date | null;
  trialEndsAt: Date | null;
  currentPeriodEnd: Date | null;
  createdAt: Date;
}): BillingRecord[] {
  const planName = readablePlan(input.plan);
  const amount = getPlanAmount(input.plan, input.billingCycle);
  const dueDate =
    formatDate(input.currentPeriodEnd) ??
    formatDate(input.trialEndsAt) ??
    formatDate(input.createdAt) ??
    "Pending";

  const records: BillingRecord[] = [
    {
      id: `sub-${input.plan.toLowerCase()}-${input.billingCycle.toLowerCase()}`,
      description:
        input.plan === "FREE_TRIAL"
          ? "Free trial access"
          : `${planName} subscription renewal`,
      plan: planName,
      billingCycle: input.billingCycle === "YEARLY" ? "Yearly" : "Monthly",
      amount,
      status: mapStatusToRecordStatus(input.status, input.plan),
      dueDate,
      paidAt: input.status === "ACTIVE" ? formatDate(input.createdAt) : null,
      source: "Polar",
      invoiceUrl: null,
    },
  ];

  if (input.trialStartedAt) {
    records.push({
      id: "trial-start",
      description: "Trial workspace created",
      plan: "Free Trial",
      billingCycle: "7-day trial",
      amount: 0,
      status: "TRIALING",
      dueDate: formatDate(input.trialEndsAt) ?? "Pending",
      paidAt: formatDate(input.trialStartedAt),
      source: "ResortCloud",
      invoiceUrl: null,
    });
  }

  return records;
}

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/auth/sign-in");
  }

  const currentUser = await db.appUser.findUnique({
    where: { authUserId: session.user.id },
    include: {
      tenantProfile: {
        include: {
          teamMembers: true,
          domains: true,
          paymentAccounts: {
            where: { isActive: true },
            orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
          },
        },
      },
    },
  });

  if (!currentUser?.tenantProfile || currentUser.role !== "TENANT") {
    redirect("/tenant/dashboard");
  }

  const tenantProfile = currentUser.tenantProfile;
  let plan = tenantProfile.subscriptionPlan as SubscriptionPlan;
  let status = tenantProfile.subscriptionStatus as SubscriptionStatus;
  let billingCycle = tenantProfile.billingCycle;
  let currentPeriodEnd = tenantProfile.currentPeriodEnd;

  if (status === "PENDING" && plan !== "FREE_TRIAL") {
    const activePolarSubscription = await getActivePolarSubscriptionForExternalCustomer(
      currentUser.authUserId,
    );

    if (activePolarSubscription) {
      const polarPlan = planFromPolarProductId(activePolarSubscription.productId);
      const resolvedPlan = polarPlan ?? plan;
      const resolvedBillingCycle = billingCycleFromPolarInterval(
        activePolarSubscription.recurringInterval,
      );

      await db.tenantProfile.update({
        where: { appUserId: currentUser.authUserId },
        data: {
          subscriptionPlan: resolvedPlan,
          subscriptionStatus: "ACTIVE",
          billingCycle: resolvedBillingCycle,
          currentPeriodEnd: activePolarSubscription.currentPeriodEnd,
          polarCustomerId: activePolarSubscription.customerId,
          polarSubscriptionId: activePolarSubscription.id,
          polarProductId: activePolarSubscription.productId,
          suspendedAt: null,
        },
      });

      plan = resolvedPlan;
      status = "ACTIVE";
      billingCycle = resolvedBillingCycle;
      currentPeriodEnd = activePolarSubscription.currentPeriodEnd;
    }
  }

  const entitlements = getTenantEntitlements({
    plan,
    subscriptionStatus: status,
  });
  const ownerName =
    currentUser.displayName?.trim() || session.user.name?.trim() || "Resort Owner";
  const resortName =
    tenantProfile.resortName?.trim() ||
    tenantProfile.businessName?.trim() ||
    "your resort";
  const defaultPaymentAccount = tenantProfile.paymentAccounts[0]
    ? `${tenantProfile.paymentAccounts[0].accountLabel} · ${tenantProfile.paymentAccounts[0].providerName} ${tenantProfile.paymentAccounts[0].maskedDetails}`
    : null;

  return (
    <BillingWorkspaceView
      ownerName={ownerName}
      resortName={resortName}
      plan={plan}
      status={status}
      billingCycle={billingCycle}
      priceLabel={getPriceLabel(plan, billingCycle)}
      trialDaysRemaining={daysUntil(tenantProfile.trialEndsAt)}
      renewalDate={formatDate(currentPeriodEnd)}
      entitlements={entitlements}
      staffCount={tenantProfile.teamMembers.length}
      domainCount={tenantProfile.domains.length}
      defaultPaymentAccount={defaultPaymentAccount}
      records={buildBillingRecords({
        plan,
        status,
        billingCycle,
        trialStartedAt: tenantProfile.trialStartedAt,
        trialEndsAt: tenantProfile.trialEndsAt,
        currentPeriodEnd,
        createdAt: tenantProfile.createdAt,
      })}
    />
  );
}
