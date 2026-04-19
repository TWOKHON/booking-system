import { Heading } from "@/components/custom/Heading";
import {
  Activity,
  LogIn,
  MousePointerClick,
  Workflow,
} from "lucide-react";
import { TenantUsageTable } from "./_components/TenantUsageTable";
import { UsageHighlights } from "./_components/UsageHighlights";
import { UsageMetricCard } from "./_components/UsageMetricCard";
import { UsageSidePanel } from "./_components/UsageSidePanel";
import { UsageTrendChart } from "./_components/UsageTrendChart";

const metrics = [
  {
    title: "Active Tenant Workspaces",
    value: "10",
    change: "+2 vs last month",
    meta: "Tenants with sustained staff usage and workflow movement this month",
    icon: Activity,
  },
  {
    title: "Staff Logins Today",
    value: "168",
    change: "+21 since yesterday",
    meta: "Authenticated staff sessions across tenant dashboards today",
    icon: LogIn,
  },
  {
    title: "Workflow Events",
    value: "1,482",
    change: "+14.7% this week",
    meta: "Bookings, task updates, approvals, messages, and financial actions recorded",
    icon: Workflow,
  },
  {
    title: "Feature Interaction Rate",
    value: "74%",
    change: "+5.1% vs last month",
    meta: "Share of active tenants using 3 or more core modules in the same period",
    icon: MousePointerClick,
  },
];

const trendData = [
  { period: "May", activeTenants: 5, staffLogins: 640, workflowEvents: 4200 },
  { period: "Jun", activeTenants: 6, staffLogins: 710, workflowEvents: 4680 },
  { period: "Jul", activeTenants: 7, staffLogins: 824, workflowEvents: 5390 },
  { period: "Aug", activeTenants: 7, staffLogins: 801, workflowEvents: 5120 },
  { period: "Sep", activeTenants: 8, staffLogins: 918, workflowEvents: 6030 },
  { period: "Oct", activeTenants: 8, staffLogins: 972, workflowEvents: 6480 },
  { period: "Nov", activeTenants: 9, staffLogins: 1044, workflowEvents: 7020 },
  { period: "Dec", activeTenants: 9, staffLogins: 1110, workflowEvents: 7480 },
  { period: "Jan", activeTenants: 8, staffLogins: 896, workflowEvents: 5890 },
  { period: "Feb", activeTenants: 8, staffLogins: 924, workflowEvents: 6110 },
  { period: "Mar", activeTenants: 9, staffLogins: 1072, workflowEvents: 7180 },
  { period: "Apr", activeTenants: 10, staffLogins: 1186, workflowEvents: 7920 },
];

const tenantRows = [
  {
    tenant: "Alrio Hospitality Group",
    mostUsedModule: "Reservations",
    staffLogins: "34",
    workflowEvents: "328",
    responseRate: "97%",
    lastActive: "5 mins ago",
    status: "Engaged",
  },
  {
    tenant: "Azure Palms Hospitality",
    mostUsedModule: "Operations",
    staffLogins: "27",
    workflowEvents: "244",
    responseRate: "91%",
    lastActive: "9 mins ago",
    status: "Engaged",
  },
  {
    tenant: "Casa Verde Leisure",
    mostUsedModule: "Guest CRM",
    staffLogins: "19",
    workflowEvents: "180",
    responseRate: "88%",
    lastActive: "14 mins ago",
    status: "Active",
  },
  {
    tenant: "Harbor Mist Ventures",
    mostUsedModule: "Reservations",
    staffLogins: "11",
    workflowEvents: "82",
    responseRate: "73%",
    lastActive: "38 mins ago",
    status: "Light",
  },
  {
    tenant: "Isla Jardin Retreats",
    mostUsedModule: "Finance",
    staffLogins: "16",
    workflowEvents: "126",
    responseRate: "84%",
    lastActive: "21 mins ago",
    status: "Active",
  },
  {
    tenant: "Sunridge Coves",
    mostUsedModule: "Website Builder",
    staffLogins: "8",
    workflowEvents: "44",
    responseRate: "69%",
    lastActive: "1 hr ago",
    status: "Light",
  },
];

const adoption = [
  {
    label: "Multi-module tenants",
    value: "7 tenants",
    note: "These workspaces are actively using reservations, operations, finance, and guest communication together.",
  },
  {
    label: "Low-engagement tenants",
    value: "3 tenants",
    note: "Activity remains limited to basic booking updates with weak cross-module adoption.",
  },
  {
    label: "Peak usage window",
    value: "9:00 AM - 1:00 PM",
    note: "Front desk, housekeeping, and finance actions are most concentrated during this period.",
  },
];

const modulePulse = [
  { module: "Reservations", usage: "Used by 10 tenants", share: "92%" },
  { module: "Operations", usage: "Used by 8 tenants", share: "76%" },
  { module: "Guest CRM", usage: "Used by 6 tenants", share: "58%" },
  { module: "Finance", usage: "Used by 5 tenants", share: "48%" },
];

const highlights = [
  "Reservations remains the strongest adoption driver, but tenants with the healthiest daily usage also pair it with operations and finance workflows.",
  "A few workspaces are logging in regularly without producing many workflow events, which may point to incomplete adoption or off-platform coordination.",
  "Cross-module usage is highest among multi-property tenants, suggesting deeper product stickiness when more departments operate from the same workspace.",
];

const Page = () => {
  return (
    <div className="space-y-6">
      <Heading
        title="System Usage Analytics"
        description="Admin-wide visibility into how tenant teams are using the platform across logins, workflow activity, and module adoption."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <UsageMetricCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-10">
        <div className="space-y-6 xl:col-span-7">
          <UsageTrendChart data={trendData} />
          <TenantUsageTable rows={tenantRows} />
        </div>

        <div className="space-y-6 xl:col-span-3">
          <UsageSidePanel adoption={adoption} modulePulse={modulePulse} />
          <UsageHighlights items={highlights} />
        </div>
      </div>
    </div>
  );
};

export default Page;
