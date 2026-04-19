import { Heading } from "@/components/custom/Heading";
import {
  BarChart3,
  CreditCard,
  RefreshCcw,
  UserRoundPlus,
} from "lucide-react";
import { SubscriptionHighlights } from "./_components/SubscriptionHighlights";
import { SubscriptionMetricCard } from "./_components/SubscriptionMetricCard";
import { SubscriptionSidePanel } from "./_components/SubscriptionSidePanel";
import { SubscriptionTrendChart } from "./_components/SubscriptionTrendChart";
import { TenantSubscriptionTable } from "./_components/TenantSubscriptionTable";

const metrics = [
  {
    title: "Monthly Recurring Revenue",
    value: "₱186,000",
    change: "+12.2% vs last month",
    meta: "Recurring subscription revenue from all currently billed tenants",
    icon: BarChart3,
  },
  {
    title: "Active Paid Tenants",
    value: "9",
    change: "+2 upgraded this month",
    meta: "Tenant accounts on paid Starter, Growth, or Enterprise subscriptions",
    icon: CreditCard,
  },
  {
    title: "Renewals This Month",
    value: "6",
    change: "4 already settled",
    meta: "Subscriptions due for renewal within the current billing cycle",
    icon: RefreshCcw,
  },
  {
    title: "Trial Conversion Rate",
    value: "38%",
    change: "+6.4% vs last month",
    meta: "Share of trial tenants converted into paid subscription accounts",
    icon: UserRoundPlus,
  },
];

const trendData = [
  { period: "May", mrr: 94000, activeSubscriptions: 5, trialConversions: 1 },
  { period: "Jun", mrr: 98000, activeSubscriptions: 5, trialConversions: 1 },
  { period: "Jul", mrr: 112000, activeSubscriptions: 6, trialConversions: 2 },
  { period: "Aug", mrr: 121000, activeSubscriptions: 6, trialConversions: 2 },
  { period: "Sep", mrr: 129000, activeSubscriptions: 7, trialConversions: 2 },
  { period: "Oct", mrr: 138000, activeSubscriptions: 7, trialConversions: 1 },
  { period: "Nov", mrr: 149000, activeSubscriptions: 8, trialConversions: 2 },
  { period: "Dec", mrr: 163000, activeSubscriptions: 8, trialConversions: 2 },
  { period: "Jan", mrr: 154000, activeSubscriptions: 8, trialConversions: 1 },
  { period: "Feb", mrr: 158000, activeSubscriptions: 8, trialConversions: 1 },
  { period: "Mar", mrr: 171000, activeSubscriptions: 9, trialConversions: 2 },
  { period: "Apr", mrr: 186000, activeSubscriptions: 9, trialConversions: 3 },
];

const tenantRows = [
  {
    tenant: "Alrio Hospitality Group",
    plan: "Enterprise",
    billingCycle: "Monthly",
    mrr: "₱42,000",
    renewalDate: "Apr 28, 2026",
    properties: 3,
    status: "Active",
  },
  {
    tenant: "Azure Palms Hospitality",
    plan: "Growth",
    billingCycle: "Monthly",
    mrr: "₱28,000",
    renewalDate: "Apr 24, 2026",
    properties: 2,
    status: "Active",
  },
  {
    tenant: "Casa Verde Leisure",
    plan: "Growth",
    billingCycle: "Annual",
    mrr: "₱24,000",
    renewalDate: "May 15, 2026",
    properties: 2,
    status: "Active",
  },
  {
    tenant: "Harbor Mist Ventures",
    plan: "Starter",
    billingCycle: "Monthly",
    mrr: "₱9,000",
    renewalDate: "Apr 22, 2026",
    properties: 1,
    status: "At Risk",
  },
  {
    tenant: "Isla Jardin Retreats",
    plan: "Growth",
    billingCycle: "Monthly",
    mrr: "₱21,000",
    renewalDate: "Apr 30, 2026",
    properties: 2,
    status: "Active",
  },
  {
    tenant: "Sunridge Coves",
    plan: "Trial",
    billingCycle: "7-day trial",
    mrr: "₱0",
    renewalDate: "Apr 21, 2026",
    properties: 1,
    status: "Trial",
  },
];

const renewals = [
  {
    label: "Renewals due in 7 days",
    value: "4 tenants",
    note: "Two are on Growth plans and one Starter account is flagged for payment risk.",
  },
  {
    label: "Failed subscription charges",
    value: "2 accounts",
    note: "Both attempts were tied to expired cards and are waiting owner follow-up.",
  },
  {
    label: "Trials ending this week",
    value: "3 tenants",
    note: "One tenant has already crossed usage thresholds that suggest a high upgrade chance.",
  },
];

const planMix = [
  { plan: "Enterprise", tenants: "2 tenants", share: "26%" },
  { plan: "Growth", tenants: "4 tenants", share: "52%" },
  { plan: "Starter", tenants: "3 tenants", share: "39%" },
];

const highlights = [
  "Growth plan tenants remain the strongest subscription segment, contributing the largest share of recurring revenue and the most stable renewal behavior.",
  "Two upcoming renewals need attention because billing retries already failed before the renewal window closes.",
  "Trial accounts with strong booking and staff activity should be prioritized for upgrade campaigns before their trial period ends.",
];

const Page = () => {
  return (
    <div className="space-y-6">
      <Heading
        title="Subscriptions Analytics"
        description="Admin-wide visibility into recurring revenue, tenant plan performance, renewal health, and trial conversion across the SaaS platform."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <SubscriptionMetricCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-10">
        <div className="space-y-6 xl:col-span-7">
          <SubscriptionTrendChart data={trendData} />
          <TenantSubscriptionTable rows={tenantRows} />
        </div>

        <div className="space-y-6 xl:col-span-3">
          <SubscriptionSidePanel renewals={renewals} planMix={planMix} />
          <SubscriptionHighlights items={highlights} />
        </div>
      </div>
    </div>
  );
};

export default Page;
