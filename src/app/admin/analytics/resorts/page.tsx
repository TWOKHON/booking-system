import { Heading } from "@/components/custom/Heading";
import {
  Activity,
  BedDouble,
  Building2,
  Users,
} from "lucide-react";
import { ActiveResortTable } from "./_components/ActiveResortTable";
import { ActiveResortTrendChart } from "./_components/ActiveResortTrendChart";
import { ResortActivityHighlights } from "./_components/ResortActivityHighlights";
import { ResortActivitySidePanel } from "./_components/ResortActivitySidePanel";
import { ResortMetricCard } from "./_components/ResortMetricCard";

const metrics = [
  {
    title: "Active Resorts Today",
    value: "12",
    change: "+3 vs yesterday",
    meta: "Resorts with active bookings, operations queues, or staff check-ins",
    icon: Building2,
  },
  {
    title: "Live Occupancy Average",
    value: "78%",
    change: "+5.6% this week",
    meta: "Average occupancy across resorts currently showing activity",
    icon: BedDouble,
  },
  {
    title: "Tenant Activity Signals",
    value: "184",
    change: "52 new today",
    meta: "Booking updates, task movement, guest actions, and payment checkpoints",
    icon: Activity,
  },
  {
    title: "Staff Logged In",
    value: "96",
    change: "+11 shift starts",
    meta: "Front desk, housekeeping, accounting, and operations users active today",
    icon: Users,
  },
];

const trendData = [
  { period: "May", activeResorts: 7, bookings: 184, occupancy: 63 },
  { period: "Jun", activeResorts: 8, bookings: 212, occupancy: 66 },
  { period: "Jul", activeResorts: 9, bookings: 248, occupancy: 71 },
  { period: "Aug", activeResorts: 10, bookings: 236, occupancy: 69 },
  { period: "Sep", activeResorts: 10, bookings: 262, occupancy: 74 },
  { period: "Oct", activeResorts: 11, bookings: 281, occupancy: 76 },
  { period: "Nov", activeResorts: 11, bookings: 294, occupancy: 77 },
  { period: "Dec", activeResorts: 12, bookings: 328, occupancy: 81 },
  { period: "Jan", activeResorts: 9, bookings: 219, occupancy: 68 },
  { period: "Feb", activeResorts: 9, bookings: 226, occupancy: 70 },
  { period: "Mar", activeResorts: 11, bookings: 287, occupancy: 75 },
  { period: "Apr", activeResorts: 12, bookings: 314, occupancy: 78 },
];

const resortRows = [
  {
    resort: "Alrio Resort Batangas",
    tenant: "Alrio Hospitality Group",
    region: "Batangas",
    occupancy: "91%",
    bookingsToday: "18",
    operationsLoad: "12 tasks",
    staffActivity: "19 online",
    status: "Busy",
  },
  {
    resort: "Azure Palms Resort",
    tenant: "Azure Palms Hospitality",
    region: "Laguna",
    occupancy: "84%",
    bookingsToday: "11",
    operationsLoad: "8 tasks",
    staffActivity: "14 online",
    status: "Healthy",
  },
  {
    resort: "Casa Verde Private Villas",
    tenant: "Casa Verde Leisure",
    region: "Quezon",
    occupancy: "79%",
    bookingsToday: "9",
    operationsLoad: "10 tasks",
    staffActivity: "11 online",
    status: "Healthy",
  },
  {
    resort: "Harbor Mist Leisure Hub",
    tenant: "Harbor Mist Ventures",
    region: "Zambales",
    occupancy: "66%",
    bookingsToday: "5",
    operationsLoad: "14 tasks",
    staffActivity: "8 online",
    status: "Attention",
  },
  {
    resort: "Isla Jardin Suites",
    tenant: "Isla Jardin Retreats",
    region: "Palawan",
    occupancy: "73%",
    bookingsToday: "7",
    operationsLoad: "9 tasks",
    staffActivity: "10 online",
    status: "Healthy",
  },
];

const queues = [
  {
    label: "Resorts with unresolved turnover",
    value: "4 resorts",
    note: "Most delays are tied to same-day check-ins and housekeeping verification.",
  },
  {
    label: "Maintenance-heavy properties",
    value: "3 resorts",
    note: "Pool and HVAC issues are the main drivers of operations load today.",
  },
  {
    label: "Silent tenant workspaces",
    value: "2 tenants",
    note: "No staff activity detected after 10:00 AM despite confirmed arrivals on the calendar.",
  },
];

const tenantPulse = [
  { tenant: "Alrio Hospitality Group", value: "3 active resorts", share: "92%" },
  { tenant: "Azure Palms Hospitality", value: "2 active resorts", share: "71%" },
  { tenant: "Casa Verde Leisure", value: "2 active resorts", share: "64%" },
];

const highlights = [
  "Active resort traffic is strongest in multi-property tenants where front desk and housekeeping teams are consistently logging updates inside the platform.",
  "One tenant is showing healthy booking volume but low staff activity, which may indicate off-platform coordination or delayed operational updates.",
  "Housekeeping and maintenance queues remain the clearest indicators of which active resorts may need admin follow-up before guest readiness slips.",
];

const Page = () => {
  return (
    <div className="space-y-6">
      <Heading
        title="Active Resorts Analytics"
        description="Admin-wide view of resorts that currently show booking, staffing, or operations activity across active tenant workspaces."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <ResortMetricCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-10">
        <div className="space-y-6 lg:col-span-7">
          <ActiveResortTrendChart data={trendData} />
          <ActiveResortTable rows={resortRows} />
        </div>

        <div className="space-y-6 lg:col-span-3">
          <ResortActivitySidePanel queues={queues} tenantPulse={tenantPulse} />
          <ResortActivityHighlights items={highlights} />
        </div>
      </div>
    </div>
  );
};

export default Page;
