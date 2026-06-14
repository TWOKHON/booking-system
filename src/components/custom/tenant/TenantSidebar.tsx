"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { CalendarClockIcon, CrownIcon, SparklesIcon } from "lucide-react";
import { NavGroup } from "@/components/custom/admin/NavGroup";
import { getTenantNavGroups } from "@/components/custom/tenant/TenantMvpShared";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

type TenantSubscriptionPlan = "FREE_TRIAL" | "STARTER" | "GROWTH" | "ENTERPRISE";
type TenantSubscriptionStatus =
  | "PENDING"
  | "TRIALING"
  | "ACTIVE"
  | "PAST_DUE"
  | "CANCELED"
  | "REVOKED"
  | "SUSPENDED";
type TenantBillingCycle = "MONTHLY" | "YEARLY";

type TenantSubscriptionProfile = {
  subscriptionPlan: TenantSubscriptionPlan;
  subscriptionStatus: TenantSubscriptionStatus;
  billingCycle: TenantBillingCycle;
  trialEndsAt: Date | string | null;
  currentPeriodEnd: Date | string | null;
} | null;

function formatPlan(plan: TenantSubscriptionPlan | undefined) {
  if (plan === "FREE_TRIAL") return "Free Trial";
  if (plan === "STARTER") return "Starter";
  if (plan === "GROWTH") return "Growth";
  if (plan === "ENTERPRISE") return "Enterprise";
  return "Plan";
}

function formatStatus(status: TenantSubscriptionStatus | undefined) {
  if (status === "TRIALING") return "Trial active";
  if (status === "ACTIVE") return "Active";
  if (status === "PAST_DUE") return "Past due";
  if (status === "CANCELED") return "Canceled";
  if (status === "REVOKED") return "Revoked";
  if (status === "SUSPENDED") return "Suspended";
  return "Pending";
}

function daysUntil(value: Date | string | null | undefined) {
  if (!value) return null;

  const endDate = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(endDate.getTime())) {
    return null;
  }

  return Math.max(0, Math.ceil((endDate.getTime() - Date.now()) / 86_400_000));
}

function formatDate(value: Date | string | null | undefined) {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function SubscriptionFooterCard({
  tenantProfile,
}: {
  tenantProfile: TenantSubscriptionProfile;
}) {
  const plan = tenantProfile?.subscriptionPlan ?? "FREE_TRIAL";
  const status = tenantProfile?.subscriptionStatus ?? "TRIALING";
  const trialDaysRemaining = daysUntil(tenantProfile?.trialEndsAt);
  const renewalDate = formatDate(tenantProfile?.currentPeriodEnd);
  const isTrial = plan === "FREE_TRIAL" || status === "TRIALING";
  const detail = isTrial
    ? trialDaysRemaining === null
      ? "Trial period"
      : `${trialDaysRemaining} day${trialDaysRemaining === 1 ? "" : "s"} remaining`
    : renewalDate
      ? `${tenantProfile?.billingCycle === "YEARLY" ? "Yearly" : "Monthly"} · Renews ${renewalDate}`
      : `${tenantProfile?.billingCycle === "YEARLY" ? "Yearly" : "Monthly"} billing`;

  return (
    <a
      href="/tenant/foundation/billing"
      className={cn(
        "block rounded-lg border bg-card p-3 text-card-foreground shadow-xs transition-colors hover:bg-accent",
        "group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:size-9 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0",
      )}
      title={isTrial ? detail : `${formatPlan(plan)} plan`}
    >
      <div className="flex items-start gap-3 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:gap-0">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-background text-foreground">
          {isTrial ? (
            <CalendarClockIcon className="size-4" />
          ) : plan === "ENTERPRISE" ? (
            <CrownIcon className="size-4" />
          ) : (
            <SparklesIcon className="size-4" />
          )}
        </div>
        <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-medium leading-5">
              {formatPlan(plan)}
            </p>
            <span className="rounded-full border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              {formatStatus(status)}
            </span>
          </div>
          <p className="mt-1 truncate text-xs text-muted-foreground">{detail}</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full bg-foreground transition-all",
                isTrial ? "w-2/3" : "w-full",
              )}
            />
          </div>
        </div>
      </div>
    </a>
  );
}

export function TenantSidebar() {
  const pathname = usePathname();
  const trpc = useTRPC();
  const navGroups = getTenantNavGroups(pathname);
  const authProfileQuery = useQuery(trpc.auth.me.queryOptions());
  const tenantProfile =
    authProfileQuery.data?.profile?.role === "TENANT"
      ? authProfileQuery.data.profile.tenantProfile
      : null;

  return (
    <Sidebar
      className={cn(
        "*:data-[slot=sidebar-inner]:bg-background",
        "*:data-[slot=sidebar-inner]:dark:bg-[radial-gradient(60%_18%_at_10%_0%,--theme(--color-foreground/.08),transparent)]",
        "**:data-[slot=sidebar-menu-button]:[&>span]:text-foreground/75",
      )}
      collapsible="icon"
      variant="sidebar"
    >
      <SidebarHeader className="h-14 justify-center border-b px-2">
        <SidebarMenuButton asChild>
          <a href="/tenant/dashboard">
            <Image
              src="/main/logo-light.png"
              alt="ResortCloud"
              width={30}
              height={30}
              className="block dark:hidden"
            />
            <Image
              src="/main/logo-dark.png"
              alt="ResortCloud"
              width={30}
              height={30}
              className="hidden dark:block"
            />
            <span className="font-medium text-foreground!">ResortCloud</span>
          </a>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((group, index) => (
          <NavGroup key={`tenant-sidebar-group-${index}`} {...group} />
        ))}
      </SidebarContent>
      <SidebarFooter className="gap-0 border-t p-2">
        <SubscriptionFooterCard tenantProfile={tenantProfile} />
        <div className="px-4 pt-4 pb-2 transition-opacity group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:opacity-0">
          <p className="text-nowrap text-[9px] text-muted-foreground">
            © {new Date().getFullYear()} ResortCloud
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
