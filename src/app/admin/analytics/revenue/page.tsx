import { Heading } from "@/components/custom/Heading";
import {
  Building2,
  CreditCard,
  Landmark,
  Wallet,
} from "lucide-react";
import { RevenueHighlights } from "./_components/RevenueHighlights";
import { RevenueMetricCard } from "./_components/RevenueMetricCard";
import { RevenueSidePanel } from "./_components/RevenueSidePanel";
import { RevenueTrendChart } from "./_components/RevenueTrendChart";
import { TenantRevenueTable } from "./_components/TenantRevenueTable";

const metrics = [
  {
    title: "Gross Tenant Revenue",
    value: "₱4,860,000",
    change: "+11.4% vs last month",
    meta: "Total processed bookings across all active tenants",
    icon: Landmark,
  },
  {
    title: "Platform Revenue",
    value: "₱486,400",
    change: "+9.8% vs last month",
    meta: "Fees, commissions, and revenue share retained by the platform",
    icon: Wallet,
  },
  {
    title: "Active Revenue Tenants",
    value: "8",
    change: "+2 newly billed",
    meta: "Tenants with booking activity in the current reporting cycle",
    icon: Building2,
  },
  {
    title: "Pending Payouts",
    value: "₱742,000",
    change: "3 payouts waiting release",
    meta: "Tenant remittances queued for admin review and release",
    icon: CreditCard,
  },
];

const revenueTrend = [
  { period: "May", gross: 590000, tenantNet: 525000, platformFees: 65000 },
  { period: "Jun", gross: 630000, tenantNet: 560000, platformFees: 70000 },
  { period: "Jul", gross: 710000, tenantNet: 632000, platformFees: 78000 },
  { period: "Aug", gross: 685000, tenantNet: 610000, platformFees: 75000 },
  { period: "Sep", gross: 760000, tenantNet: 678000, platformFees: 82000 },
  { period: "Oct", gross: 804000, tenantNet: 716000, platformFees: 88000 },
  { period: "Nov", gross: 845000, tenantNet: 753000, platformFees: 92000 },
  { period: "Dec", gross: 910000, tenantNet: 811000, platformFees: 99000 },
  { period: "Jan", gross: 734000, tenantNet: 653000, platformFees: 81000 },
  { period: "Feb", gross: 692000, tenantNet: 615000, platformFees: 77000 },
  { period: "Mar", gross: 808000, tenantNet: 719000, platformFees: 89000 },
  { period: "Apr", gross: 924000, tenantNet: 822000, platformFees: 102000 },
];

const tenantRows = [
  {
    tenant: "Alrio Resort Batangas",
    plan: "Enterprise",
    properties: 3,
    grossRevenue: "₱1,240,000",
    platformRevenue: "₱128,000",
    collectionRate: "96%",
    payoutStatus: "Scheduled",
  },
  {
    tenant: "Azure Palms Resort",
    plan: "Growth",
    properties: 2,
    grossRevenue: "₱924,000",
    platformRevenue: "₱92,400",
    collectionRate: "93%",
    payoutStatus: "Released",
  },
  {
    tenant: "Casa Verde Private Villas",
    plan: "Growth",
    properties: 2,
    grossRevenue: "₱818,000",
    platformRevenue: "₱80,700",
    collectionRate: "91%",
    payoutStatus: "Released",
  },
  {
    tenant: "Harbor Mist Leisure Hub",
    plan: "Starter",
    properties: 1,
    grossRevenue: "₱566,000",
    platformRevenue: "₱56,600",
    collectionRate: "88%",
    payoutStatus: "Review",
  },
  {
    tenant: "Isla Jardin Suites",
    plan: "Growth",
    properties: 2,
    grossRevenue: "₱472,000",
    platformRevenue: "₱47,200",
    collectionRate: "90%",
    payoutStatus: "Scheduled",
  },
];

const collections = [
  {
    label: "Unreconciled payments",
    value: "17 transactions",
    note: "Most are weekend deposits awaiting manual verification from 3 tenants.",
  },
  {
    label: "Next payout batch",
    value: "P742,000",
    note: "Release window is scheduled for April 22 after finance approval.",
  },
  {
    label: "Failed payment retries",
    value: "9 bookings",
    note: "High concentration from one tenant using card payments for direct bookings.",
  },
];

const topTenants = [
  { tenant: "Alrio Resort Batangas", value: "₱128,000", share: "88%" },
  { tenant: "Azure Palms Resort", value: "₱92,400", share: "74%" },
  { tenant: "Casa Verde Private Villas", value: "₱80,700", share: "64%" },
];

const highlights = [
  "April platform revenue is ahead of target, driven by stronger direct-booking volume from Enterprise and Growth tenants.",
  "One Starter tenant is holding the highest number of unreconciled deposits and should be reviewed before the next payout run.",
  "Collection performance is strongest among multi-property tenants, suggesting better payment follow-up discipline at scale.",
];

const Page = () => {
  return (
    <div className="space-y-6">
      <Heading
        title="Revenue Analytics"
        description="Admin-wide visibility into gross tenant revenue, platform earnings, payouts, and collection health across every resort tenant."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <RevenueMetricCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-10">
        <div className="space-y-6 xl:col-span-7">
          <RevenueTrendChart data={revenueTrend} />
          <TenantRevenueTable rows={tenantRows} />
        </div>

        <div className="space-y-6 xl:col-span-3">
          <RevenueSidePanel collections={collections} topTenants={topTenants} />
          <RevenueHighlights items={highlights} />
        </div>
      </div>
    </div>
  );
};

export default Page;
