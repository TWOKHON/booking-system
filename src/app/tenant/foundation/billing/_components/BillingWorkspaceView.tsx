import Link from "next/link";
import {
  ArrowUpRightIcon,
  CalendarClockIcon,
  CreditCardIcon,
  FileDownIcon,
  GaugeIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "lucide-react";
import { TuroInsightCard } from "@/app/admin/dashboard/_components/TuroInsightCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { PlanEntitlements, SubscriptionPlan, SubscriptionStatus } from "@/lib/subscription/entitlements";
import { BillingTable } from "./BillingTable";
import type { BillingRecord } from "./billing-data";

type BillingWorkspaceViewProps = {
  ownerName: string;
  resortName: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  billingCycle: "MONTHLY" | "YEARLY";
  priceLabel: string;
  trialDaysRemaining: number | null;
  renewalDate: string | null;
  entitlements: PlanEntitlements;
  staffCount: number;
  domainCount: number;
  defaultPaymentAccount: string | null;
  records: BillingRecord[];
};

function readablePlan(plan: SubscriptionPlan) {
  if (plan === "FREE_TRIAL") return "Free Trial";
  if (plan === "STARTER") return "Starter";
  if (plan === "GROWTH") return "Growth";
  return "Enterprise";
}

function readableStatus(status: SubscriptionStatus) {
  if (status === "TRIALING") return "Trial active";
  if (status === "PAST_DUE") return "Past due";
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function statusTone(status: SubscriptionStatus) {
  if (status === "ACTIVE" || status === "TRIALING") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300";
  }

  if (status === "PENDING" || status === "PAST_DUE") {
    return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300";
  }

  return "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300";
}

export function BillingWorkspaceView({
  ownerName,
  resortName,
  plan,
  status,
  billingCycle,
  priceLabel,
  trialDaysRemaining,
  renewalDate,
  entitlements,
  staffCount,
  domainCount,
  defaultPaymentAccount,
  records,
}: BillingWorkspaceViewProps) {
  const isTrial = plan === "FREE_TRIAL" || status === "TRIALING";
  const staffLimit =
    entitlements.staffSeatLimit === null ? "Unlimited" : String(entitlements.staffSeatLimit);

  return (
    <main className="flex flex-1 flex-col gap-6">
      <TuroInsightCard
        message={`Manage ${resortName}'s ResortCloud subscription, invoices, renewal state, and plan limits from one billing workspace.`}
        userName={ownerName}
      />

      <section className="overflow-hidden rounded-xl border bg-[radial-gradient(circle_at_top_left,rgba(244,244,245,0.96),rgba(255,255,255,1)_46%,rgba(244,244,245,0.84))] p-5 shadow-sm dark:from-zinc-900 dark:to-background md:p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1.5">
                <CreditCardIcon className="size-3.5" />
                Subscription billing
              </Badge>
              <Badge variant="secondary">Polar</Badge>
              <Badge variant="secondary">Plan controls</Badge>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Billing & Renewals
            </h1>
            <p className="mt-3 text-sm text-muted-foreground md:text-base">
              Review your active plan, usage limits, trial timing, subscription renewal, and invoice access.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/api/polar/portal">
                Manage in Polar
                <ArrowUpRightIcon className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/pricing">Change plan</Link>
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="border bg-background/90 p-4">
            <div className="text-xs uppercase text-muted-foreground">
              Current plan
            </div>
            <div className="mt-3 text-2xl font-semibold">{readablePlan(plan)}</div>
            <div className="mt-2 text-sm text-muted-foreground">{priceLabel}</div>
          </div>
          <div className="border bg-background/90 p-4">
            <div className="text-xs uppercase text-muted-foreground">
              Subscription status
            </div>
            <div className="mt-3">
              <Badge variant="outline" className={statusTone(status)}>
                {readableStatus(status)}
              </Badge>
            </div>
            <div className="mt-3 text-sm text-muted-foreground">
              {isTrial
                ? trialDaysRemaining === null
                  ? "Trial timing unavailable"
                  : `${trialDaysRemaining} day${trialDaysRemaining === 1 ? "" : "s"} remaining`
                : renewalDate
                  ? `Renews ${renewalDate}`
                  : "Renewal date unavailable"}
            </div>
          </div>
          <div className="border bg-background/90 p-4">
            <div className="text-xs uppercase text-muted-foreground">
              Staff seats
            </div>
            <div className="mt-3 text-2xl font-semibold">
              {staffCount} / {staffLimit}
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              Seat limit enforced by plan.
            </div>
          </div>
          <div className="border bg-background/90 p-4">
            <div className="text-xs uppercase text-muted-foreground">
              Domain slots
            </div>
            <div className="mt-3 text-2xl font-semibold">
              {domainCount} / {entitlements.domainLimit}
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              Custom domain availability.
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border bg-background p-5 shadow-sm md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase text-muted-foreground">
                Plan summary
              </p>
              <h2 className="mt-2 text-xl font-semibold">
                {readablePlan(plan)} subscription
              </h2>
            </div>
            <Badge variant="outline" className={statusTone(status)}>
              {readableStatus(status)}
            </Badge>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            ResortCloud subscription billing is handled by Polar. Guest payment accounts remain separate under payment integrations.
          </p>
          <Separator className="my-5" />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <CalendarClockIcon className="size-4" />
                Billing cadence
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {billingCycle === "YEARLY" ? "Yearly subscription" : "Monthly subscription"}
              </p>
            </div>
            <div className="rounded-xl border p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <FileDownIcon className="size-4" />
                Invoice access
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Download invoices and receipts through Polar portal.
              </p>
            </div>
            <div className="rounded-xl border p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <GaugeIcon className="size-4" />
                Analytics
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {entitlements.hasAdvancedAnalyticsAccess
                  ? "Advanced analytics enabled"
                  : "Basic analytics only"}
              </p>
            </div>
            <div className="rounded-xl border p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <ShieldCheckIcon className="size-4" />
                Ads
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {entitlements.showAds ? "Trial ads may be shown" : "Ad-free workspace"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-background p-5 shadow-sm md:p-6">
          <div>
            <p className="text-xs uppercase text-muted-foreground">
              Payment setup
            </p>
            <h2 className="mt-2 text-xl font-semibold">Billing controls</h2>
          </div>
          <div className="mt-5 space-y-3">
            <div className="rounded-xl border p-4">
              <div className="flex items-start gap-3">
                <CreditCardIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Subscription payment method</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Managed in Polar portal for PCI-compliant subscription billing.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border p-4">
              <div className="flex items-start gap-3">
                <UsersIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Guest payment account</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {defaultPaymentAccount ?? "No default payment account connected yet."}
                  </p>
                </div>
              </div>
            </div>
            <Button asChild className="w-full h-10">
              <Link href="/api/polar/portal">Open Polar billing portal</Link>
            </Button>
            <Button asChild variant="outline" className="w-full h-10">
              <Link href="/tenant/integrations/payment-accounts">
                Manage guest payment accounts
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <BillingTable data={records} />
    </main>
  );
}

