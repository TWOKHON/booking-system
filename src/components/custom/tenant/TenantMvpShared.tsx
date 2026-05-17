import type { ReactNode } from "react";
import {
  BedDoubleIcon,
  BotIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  GlobeIcon,
  HelpCircleIcon,
  HouseIcon,
  LayoutGridIcon,
  MessageSquareMoreIcon,
  Settings2Icon,
  SparklesIcon,
  TagsIcon,
  UsersIcon,
  WrenchIcon,
} from "lucide-react";
import { tenantWorkspaceContent as legacyTenantWorkspaceContent } from "@/components/custom/tenant/TenantAppShared";

export type TenantSidebarNavItem = {
  title: string;
  path?: string;
  icon?: ReactNode;
  isActive?: boolean;
  hasActiveSubItem?: boolean;
  subItems?: TenantSidebarNavItem[];
};

export type TenantSidebarNavGroup = {
  label?: string;
  items: TenantSidebarNavItem[];
};

type LegacyTenantWorkspacePath = keyof typeof legacyTenantWorkspaceContent;
type TenantWorkspaceContent =
  (typeof legacyTenantWorkspaceContent)[LegacyTenantWorkspacePath];

export type TenantMvpFeaturePath =
  | "/tenant/foundation/trial"
  | "/tenant/foundation/billing"
  | "/tenant/foundation/users"
  | "/tenant/foundation/rbac"
  | "/tenant/sales/inquiries"
  | "/tenant/sales/follow-ups"
  | "/tenant/sales/invoices"
  | "/tenant/sales/confirmations"
  | "/tenant/finance/cash-flow"
  | "/tenant/finance/petty-cash"
  | "/tenant/finance/accounting"
  | "/tenant/hr/attendance"
  | "/tenant/marketing/analytics"
  | "/tenant/web/builder"
  | "/tenant/web/assets"
  | "/tenant/web/domains"
  | "/tenant/web/publish"
  | "/tenant/analytics/kpi"
  | "/tenant/analytics/advanced"
  | "/tenant/analytics/properties"
  | "/tenant/ai/recommendations"
  | "/tenant/ai/forecast"
  | "/tenant/integrations/paymongo"
  | "/tenant/integrations/notifications"
  | "/tenant/integrations/discord";

export type TenantWorkspacePath =
  | LegacyTenantWorkspacePath
  | TenantMvpFeaturePath;

const isPathActive = (pathname: string, path?: string) => {
  if (!path || path === "#" || path.startsWith("#")) {
    return false;
  }

  if (path === "/") {
    return pathname === path;
  }

  return pathname === path || pathname.startsWith(`${path}/`);
};

const getBestMatchedPath = (pathname: string, items: TenantSidebarNavItem[]) => {
  const matches = items
    .filter((item) => isPathActive(pathname, item.path))
    .map((item) => item.path)
    .filter((path): path is string => Boolean(path))
    .sort((a, b) => b.length - a.length);

  return matches[0];
};

export const tenantNavGroups: TenantSidebarNavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        path: "/tenant/dashboard",
        icon: <LayoutGridIcon />,
      },
      {
        title: "KPI Dashboard",
        path: "/tenant/analytics/kpi",
        icon: <SparklesIcon />,
      },
    ],
  },
  {
    label: "Foundation & Access",
    items: [
      {
        title: "Workspace Access",
        path: "#",
        icon: <Settings2Icon />,
        subItems: [
          { title: "Trial & Plan State", path: "/tenant/foundation/trial" },
          { title: "Billing & Renewals", path: "/tenant/foundation/billing" },
          { title: "Users & Seats", path: "/tenant/foundation/users" },
          { title: "Roles & Access", path: "/tenant/foundation/rbac" },
        ],
      },
    ],
  },
  {
    label: "Booking & Sales",
    items: [
      {
        title: "Reservations",
        path: "#",
        icon: <CalendarDaysIcon />,
        subItems: [
          { title: "Booking Calendar", path: "/tenant/reservations/calendar" },
          { title: "Reservation Board", path: "/tenant/reservations/bookings" },
          { title: "Check-in & Check-out", path: "/tenant/reservations/check-in-out" },
          { title: "Inquiries Inbox", path: "/tenant/sales/inquiries" },
          { title: "Follow-Ups & Priority", path: "/tenant/sales/follow-ups" },
          { title: "Invoices & Down Payment", path: "/tenant/sales/invoices" },
          { title: "Confirmations", path: "/tenant/sales/confirmations" },
        ],
      },
      {
        title: "Guest Experience",
        path: "#",
        icon: <UsersIcon />,
        subItems: [
          { title: "Today's Arrivals", path: "/tenant/guests/arrivals" },
          { title: "Guest Requests", path: "/tenant/guests/requests" },
          { title: "Guest CRM", path: "/tenant/guests/crm" },
        ],
      },
    ],
  },
  {
    label: "Finance, HR & Ops",
    items: [
      {
        title: "Finance",
        path: "#",
        icon: <CreditCardIcon />,
        subItems: [
          { title: "Cash Flow Lifecycle", path: "/tenant/finance/cash-flow" },
          { title: "Petty Cash", path: "/tenant/finance/petty-cash" },
          { title: "Accounting", path: "/tenant/finance/accounting" },
        ],
      },
      {
        title: "Operations",
        path: "#",
        icon: <WrenchIcon />,
        subItems: [
          { title: "HR & Attendance", path: "/tenant/hr/attendance" },
          { title: "Housekeeping", path: "/tenant/operations/housekeeping" },
          { title: "Maintenance", path: "/tenant/operations/maintenance" },
          { title: "Staff Task Board", path: "/tenant/operations/tasks" },
        ],
      },
    ],
  },
  {
    label: "Website & Marketing",
    items: [
      {
        title: "Website Builder",
        path: "#",
        icon: <GlobeIcon />,
        subItems: [
          { title: "Builder Workspace", path: "/tenant/web/builder" },
          { title: "Sections & Assets", path: "/tenant/web/assets" },
          { title: "Domains & DNS", path: "/tenant/web/domains" },
          { title: "Publish Center", path: "/tenant/web/publish" },
          { title: "Website Funnel", path: "/tenant/channels/website" },
        ],
      },
      {
        title: "Marketing",
        path: "#",
        icon: <SparklesIcon />,
        subItems: [
          { title: "Marketing Analytics", path: "/tenant/marketing/analytics" },
          { title: "Rates & Availability", path: "/tenant/revenue/rates" },
          { title: "Packages & Upsells", path: "/tenant/revenue/packages" },
          { title: "Revenue Reports", path: "/tenant/revenue/reports" },
        ],
      },
    ],
  },
  {
    label: "AI & Growth",
    items: [
      {
        title: "Analytics & AI",
        path: "#",
        icon: <BotIcon />,
        subItems: [
          { title: "Advanced Analytics", path: "/tenant/analytics/advanced" },
          { title: "Multi-Property", path: "/tenant/analytics/properties" },
          { title: "Smart Recommendations", path: "/tenant/ai/recommendations" },
          { title: "AI Concierge", path: "/tenant/channels/chatbot" },
          { title: "Revenue Forecasting", path: "/tenant/ai/forecast" },
        ],
      },
      {
        title: "Property Controls",
        path: "#",
        icon: <Settings2Icon />,
        subItems: [
          { title: "Property Setup", path: "/tenant/settings/property" },
          { title: "Rooms & Inventory", path: "/tenant/settings/rooms" },
          { title: "Channel Setup", path: "/tenant/settings/channels" },
          { title: "Services Offered", path: "/tenant/settings/services" },
          { title: "Team Access", path: "/tenant/settings/team" },
          { title: "Automations", path: "/tenant/settings/automations" },
        ],
      },
    ],
  },
  {
    label: "Payments & Integrations",
    items: [
      {
        title: "Integrations",
        path: "#",
        icon: <MessageSquareMoreIcon />,
        subItems: [
          { title: "PayMongo", path: "/tenant/integrations/paymongo" },
          { title: "Notifications", path: "/tenant/integrations/notifications" },
          { title: "Discord", path: "/tenant/integrations/discord" },
        ],
      },
    ],
  },
];

export const tenantFooterNavLinks: TenantSidebarNavItem[] = [
  {
    title: "Help & Training",
    path: "/tenant/help",
    icon: <HelpCircleIcon />,
  },
];

export const tenantNavLinks: TenantSidebarNavItem[] = [
  ...tenantNavGroups.flatMap((group) =>
    group.items.flatMap((item) =>
      item.subItems?.length ? [item, ...item.subItems] : [item],
    ),
  ),
  ...tenantFooterNavLinks,
];

export const getTenantNavGroups = (
  pathname: string,
): TenantSidebarNavGroup[] =>
  tenantNavGroups.map((group) => ({
    ...group,
    items: group.items.map((item) => {
      const bestSubItemPath = getBestMatchedPath(pathname, item.subItems ?? []);
      const activeSubItems =
        item.subItems?.map((subItem) => ({
          ...subItem,
          isActive: subItem.path === bestSubItemPath,
        })) ?? [];

      return {
        ...item,
        isActive: isPathActive(pathname, item.path),
        hasActiveSubItem: activeSubItems.some((subItem) => subItem.isActive),
        subItems: activeSubItems.length ? activeSubItems : item.subItems,
      };
    }),
  }));

export const getTenantFooterNavLinks = (pathname: string): TenantSidebarNavItem[] =>
  tenantFooterNavLinks.map((item) => ({
    ...item,
    isActive: isPathActive(pathname, item.path),
  }));

export const getActiveTenantNavItem = (
  pathname: string,
): TenantSidebarNavItem | undefined =>
  [...tenantNavLinks]
    .filter((item) => isPathActive(pathname, item.path))
    .sort((a, b) => (b.path?.length ?? 0) - (a.path?.length ?? 0))[0];

export const tenantMvpExpansionContent: Record<
  TenantMvpFeaturePath,
  TenantWorkspaceContent
> = {
  "/tenant/foundation/trial": {
    eyebrow: "Phase 1 - Foundation",
    title: "Trial and plan state",
    description:
      "Track the 7-day trial, plan conversion checkpoints, AdSense visibility, and account suspension rules from the owner workspace.",
    primaryAction: "Review trial status",
    secondaryAction: "Open billing policies",
    metrics: [
      { label: "Current plan", value: "Growth", detail: "Advanced analytics enabled" },
      { label: "Trial state", value: "Converted", detail: "Ads removed on activation" },
      { label: "Staff seats", value: "14 of 25", detail: "Within Growth limit" },
      { label: "Reminder cadence", value: "Day 5 / Day 7", detail: "Automated" },
    ],
    spotlightTitle: "Plan lifecycle",
    spotlightBody:
      "This module mirrors the MVP onboarding flow: sign-up, free trial, plan choice, Stripe billing, ad removal, and suspension fallback if the tenant does not convert.",
    spotlightPoints: [
      "Show trial countdown and conversion prompts clearly",
      "Surface seat limits and plan entitlements by tier",
      "Keep suspension and grace-period messaging visible to owners",
    ],
    panels: [
      {
        title: "Lifecycle checkpoints",
        description: "Milestones from account creation to paid activation.",
        items: [
          { title: "Tenant sign-up", meta: "Creates isolated tenant workspace", status: "Completed" },
          { title: "7-day trial", meta: "Starter-level access with ads", status: "Completed" },
          { title: "Paid plan activation", meta: "Stripe billing and RBAC enforcement", status: "Completed" },
        ],
      },
      {
        title: "Entitlement summary",
        description: "What changes when the tenant moves between plans.",
        items: [
          { title: "Starter", meta: "10 staff max, ad-free", status: "Available" },
          { title: "Growth", meta: "Advanced analytics and 2 properties", status: "Current" },
          { title: "Enterprise", meta: "AI suite and 3 domains", status: "Upgradeable" },
        ],
      },
      {
        title: "Plan safeguards",
        description: "Rules the workspace should communicate clearly.",
        items: [
          { title: "Trial reminders", meta: "Day 5 and Day 7 notices", status: "Enabled" },
          { title: "Suspension fallback", meta: "Data retained for 30 days", status: "Configured" },
          { title: "Ad removal", meta: "Immediate on paid activation", status: "Configured" },
        ],
      },
    ],
  },
  "/tenant/foundation/billing": {
    eyebrow: "Phase 1 - Foundation",
    title: "Billing and renewals",
    description:
      "Manage SaaS subscription billing, monthly or yearly plans, renewal reminders, and upgrade or downgrade history.",
    primaryAction: "Open billing profile",
    secondaryAction: "Review renewal reminders",
    metrics: [
      { label: "Billing cycle", value: "Yearly", detail: "Renews in 41 days" },
      { label: "SaaS payment rail", value: "Stripe", detail: "Separate from guest payments" },
      { label: "Renewal reminders", value: "7d / 1d", detail: "Owner receives both" },
      { label: "Last invoice", value: "PHP 28,990", detail: "Growth annual plan" },
    ],
    spotlightTitle: "Subscription controls",
    spotlightBody:
      "The tenant side should make subscription state legible without exposing platform complexity. Owners mainly need plan clarity, invoices, renewals, and change history.",
    spotlightPoints: [
      "Separate platform subscription billing from PayMongo guest payments",
      "Show yearly savings and upgrade benefits in-context",
      "Surface renewal reminders and grace state early",
    ],
    panels: [
      {
        title: "Current subscription",
        description: "What the owner should understand at a glance.",
        items: [
          { title: "Plan", meta: "Growth annual", status: "Active" },
          { title: "Next renewal", meta: "Auto-renews through Stripe", status: "Scheduled" },
          { title: "Change window", meta: "Upgrade anytime, downgrade end of term", status: "Allowed" },
        ],
      },
      {
        title: "Billing history",
        description: "Key records the frontend should surface.",
        items: [
          { title: "Subscription invoice", meta: "Platform fee only", status: "View" },
          { title: "Domain add-on", meta: "Starter-only paid domain path", status: "Conditional" },
          { title: "Plan changes", meta: "Upgrade and seat history", status: "Track" },
        ],
      },
      {
        title: "Reminder workflows",
        description: "Notification logic tied to renewals.",
        items: [
          { title: "Renewal reminder", meta: "7 days before billing", status: "Enabled" },
          { title: "Final reminder", meta: "1 day before billing", status: "Enabled" },
          { title: "Payment failure handling", meta: "Needs owner action", status: "Escalate" },
        ],
      },
    ],
  },
  "/tenant/foundation/users": {
    eyebrow: "Phase 1 - Foundation",
    title: "Users and seats",
    description:
      "Manage staff accounts, plan-based seat limits, activation state, and workspace access for tenant teams.",
    primaryAction: "Invite staff",
    secondaryAction: "Check seat usage",
    metrics: [
      { label: "Active users", value: "14", detail: "Across 6 roles" },
      { label: "Seat cap", value: "25", detail: "Growth plan limit" },
      { label: "Pending invites", value: "3", detail: "Front desk and finance" },
      { label: "Deactivated", value: "2", detail: "Retained for audit trail" },
    ],
    spotlightTitle: "Seat governance",
    spotlightBody:
      "The tenant owner needs a simple, trustworthy way to add or deactivate users while staying within plan limits and preserving auditability.",
    spotlightPoints: [
      "Display seat usage against plan limits everywhere invites happen",
      "Support create, edit, and deactivate flows cleanly",
      "Keep role assignment visible during onboarding and offboarding",
    ],
    panels: [
      {
        title: "Seat rules",
        description: "How access changes by plan tier.",
        items: [
          { title: "Trial", meta: "Up to 3 staff", status: "Restricted" },
          { title: "Starter", meta: "Up to 10 staff", status: "Supported" },
          { title: "Growth / Enterprise", meta: "25 or unlimited seats", status: "Supported" },
        ],
      },
      {
        title: "Account lifecycle",
        description: "Core frontend states this module should handle.",
        items: [
          { title: "Invited", meta: "Awaiting activation", status: "Pending" },
          { title: "Active", meta: "Has login and role", status: "Current" },
          { title: "Deactivated", meta: "Access removed, history retained", status: "Safe" },
        ],
      },
      {
        title: "Owner tasks",
        description: "Common actions this area should support.",
        items: [
          { title: "Add seasonal staff", meta: "Fast onboarding before peak periods", status: "Ready" },
          { title: "Swap role ownership", meta: "When managers change", status: "Ready" },
          { title: "Audit access quarterly", meta: "Tighten stale accounts", status: "Recommended" },
        ],
      },
    ],
  },
  "/tenant/foundation/rbac": {
    eyebrow: "Phase 1 - Foundation",
    title: "Roles and RBAC",
    description:
      "Map tenant roles to operational permissions with server-enforced boundaries across sales, HR, accounting, operations, and owner controls.",
    primaryAction: "Review role matrix",
    secondaryAction: "Open team access",
    metrics: [
      { label: "Roles in use", value: "7", detail: "Owner, Admin, Sales, HR, Ops, Accounting, Marketing" },
      { label: "Permission model", value: "Single-role", detail: "Exactly one role per user" },
      { label: "Owner scope", value: "Full tenant", detail: "Billing, domains, KPI, website" },
      { label: "Audit changes", value: "12", detail: "Last 30 days" },
    ],
    spotlightTitle: "Permission design",
    spotlightBody:
      "The MVP calls for strict server-side RBAC. On the tenant side, the UI should help owners understand responsibility boundaries rather than just expose switches.",
    spotlightPoints: [
      "Keep role descriptions tied to real module access",
      "Explain read-only auditor access separately from accountant access",
      "Highlight owner-only modules like KPI and billing",
    ],
    panels: [
      {
        title: "Core roles",
        description: "Role coverage reflected in the owner workspace.",
        items: [
          { title: "Tenant Owner / Superadmin", meta: "Full tenant control", status: "Critical" },
          { title: "Admin / Sales / HR", meta: "Department execution roles", status: "Operational" },
          { title: "Accounting / Marketing / Ops", meta: "Scoped functional access", status: "Operational" },
        ],
      },
      {
        title: "Sensitive permissions",
        description: "Areas owners should watch most closely.",
        items: [
          { title: "Billing and domains", meta: "Owner-level only", status: "Restricted" },
          { title: "Refund approval", meta: "Owner approval required", status: "Restricted" },
          { title: "KPI and performance views", meta: "Owner-facing summary", status: "Restricted" },
        ],
      },
      {
        title: "Role communication",
        description: "UI behaviors that keep RBAC easy to understand.",
        items: [
          { title: "Module badges", meta: "Show who can use each area", status: "Recommended" },
          { title: "Hidden actions", meta: "Do not tease unavailable controls", status: "Recommended" },
          { title: "Access audit history", meta: "Track permission changes", status: "Useful" },
        ],
      },
    ],
  },
  "/tenant/sales/inquiries": {
    eyebrow: "Phase 2 - Booking & Sales",
    title: "Inquiries inbox",
    description:
      "Centralize public intake-form leads, embeddable booking inquiries, assigned sales agents, and source tagging for every prospect.",
    primaryAction: "Open lead queue",
    secondaryAction: "Review follow-up rules",
    metrics: [
      { label: "Open leads", value: "28", detail: "Across all active sources" },
      { label: "Assigned today", value: "11", detail: "Auto-routed to sales agents" },
      { label: "Top source", value: "Website form", detail: "Highest direct-intent channel" },
      { label: "Stamped updates", value: "100%", detail: "Last follow-up tracked" },
    ],
    spotlightTitle: "Lead intake flow",
    spotlightBody:
      "This page represents the start of the booking process flow: inquiry received, agent assigned, and source captured so the resort owner can audit speed and quality.",
    spotlightPoints: [
      "Keep the intake form embeddable and tenant-specific",
      "Stamp every inquiry with source, assignee, and last follow-up",
      "Expose status history to Sales and Owner views",
    ],
    panels: [
      {
        title: "Lead routing",
        description: "What the inbox should communicate immediately.",
        items: [
          { title: "New inquiry intake", meta: "Public link or embed", status: "Supported" },
          { title: "Assigned sales agent", meta: "Clear ownership", status: "Visible" },
          { title: "Source tagging", meta: "Organic, referral, social, direct", status: "Tracked" },
        ],
      },
      {
        title: "Owner visibility",
        description: "Why this matters beyond sales operations.",
        items: [
          { title: "Lead aging", meta: "Spot stale opportunities early", status: "Useful" },
          { title: "Source performance", meta: "Inform marketing spend", status: "Useful" },
          { title: "Follow-up discipline", meta: "Protect conversion rate", status: "Useful" },
        ],
      },
      {
        title: "Key records",
        description: "Items this view should surface without drilling in.",
        items: [
          { title: "Inquiry details", meta: "Dates, rooms, contact, notes", status: "Core" },
          { title: "Follow-up timeline", meta: "Stamped interactions", status: "Core" },
          { title: "Priority and status", meta: "Hot, Warm, Cold lifecycle", status: "Core" },
        ],
      },
    ],
  },
  "/tenant/sales/follow-ups": {
    eyebrow: "Phase 2 - Booking & Sales",
    title: "Follow-ups and priority",
    description:
      "Operationalize Hot, Warm, and Cold inquiry handling with reminders, manual overrides, and aging visibility.",
    primaryAction: "Open priority queue",
    secondaryAction: "Review nurture cadence",
    metrics: [
      { label: "Hot leads", value: "7", detail: "Urgent alert state" },
      { label: "Warm leads", value: "13", detail: "Standard follow-up cadence" },
      { label: "Cold leads", value: "8", detail: "Periodic nurture schedule" },
      { label: "Manual overrides", value: "4", detail: "Toggled by sales lead" },
    ],
    spotlightTitle: "Priority engine",
    spotlightBody:
      "The MVP process flow depends on lead priority driving action automatically. The owner view should show whether the sales team is reacting correctly to urgency windows.",
    spotlightPoints: [
      "Hot leads trigger urgent alerts at 10 days or fewer",
      "Warm leads should carry active follow-up reminders",
      "Cold leads should stay nurtured instead of forgotten",
    ],
    panels: [
      {
        title: "Priority logic",
        description: "Rules captured directly from the MVP plan.",
        items: [
          { title: "Hot", meta: "10 days or fewer before stay", status: "Urgent alert" },
          { title: "Warm", meta: "11 to 30 days before stay", status: "Reminder" },
          { title: "Cold", meta: "More than 30 days", status: "Nurture" },
        ],
      },
      {
        title: "Owner checks",
        description: "What the tenant owner should monitor here.",
        items: [
          { title: "Aging by priority", meta: "Prevent valuable leads from stalling", status: "Monitor" },
          { title: "Override usage", meta: "Make sure manual changes are intentional", status: "Monitor" },
          { title: "Follow-up recency", meta: "Keep dates stamped and visible", status: "Monitor" },
        ],
      },
      {
        title: "Automation hooks",
        description: "Connected actions this page influences.",
        items: [
          { title: "Urgent alerts", meta: "Push or in-app for Hot leads", status: "Linked" },
          { title: "Reminder engine", meta: "Warm and Cold cadence", status: "Linked" },
          { title: "Availability updates", meta: "Supports sales board actions", status: "Linked" },
        ],
      },
    ],
  },
  "/tenant/sales/invoices": {
    eyebrow: "Phase 2 - Booking & Sales",
    title: "Invoices and down payment",
    description:
      "Handle personal or company invoices, 50% down payment links, and booking-linked payment compliance from one place.",
    primaryAction: "Generate invoice",
    secondaryAction: "Open PayMongo setup",
    metrics: [
      { label: "Invoice types", value: "2", detail: "Personal and company" },
      { label: "DP compliance", value: "92%", detail: "50% down payment target" },
      { label: "Pending DP", value: "5", detail: "Awaiting guest payment" },
      { label: "Policy window", value: "7 days", detail: "Full-payment cancellation rule" },
    ],
    spotlightTitle: "Payment confirmation path",
    spotlightBody:
      "This is where the booking flow becomes financially real. Every invoice should be tied to a booking, client profile, and the PayMongo payment state.",
    spotlightPoints: [
      "Support personal and company invoice modes",
      "Attach invoice, guest profile, and booking record together",
      "Make 50% DP status obvious before confirmation is granted",
    ],
    panels: [
      {
        title: "Invoice workflow",
        description: "Financial events tied to booking progression.",
        items: [
          { title: "Invoice generation", meta: "Created from booking context", status: "Core" },
          { title: "DP link", meta: "PayMongo payment URL", status: "Core" },
          { title: "Status update", meta: "Payment changes booking confirmation", status: "Core" },
        ],
      },
      {
        title: "Policy safeguards",
        description: "Rules the UI should communicate clearly.",
        items: [
          { title: "50% down payment required", meta: "Needed to confirm booking", status: "Enforced" },
          { title: "7-day cancellation window", meta: "Triggers full-payment rule", status: "Enforced" },
          { title: "Refund path", meta: "Manual with owner approval", status: "Controlled" },
        ],
      },
      {
        title: "Owner oversight",
        description: "Signals worth surfacing in the tenant view.",
        items: [
          { title: "Pending payments", meta: "Could block confirmed status", status: "Watch" },
          { title: "Invoice mix", meta: "Personal vs company demand", status: "Analyze" },
          { title: "Payment lag", meta: "Which agents or sources slow down", status: "Analyze" },
        ],
      },
    ],
  },
  "/tenant/sales/confirmations": {
    eyebrow: "Phase 2 - Booking & Sales",
    title: "Confirmation dispatch",
    description:
      "Track whether confirmed bookings have generated guest communications across email, SMS, and Discord-aware staff notifications.",
    primaryAction: "Send confirmation",
    secondaryAction: "Review notification templates",
    metrics: [
      { label: "Confirmed bookings", value: "19", detail: "This week" },
      { label: "Guest confirmations sent", value: "19", detail: "Email and SMS coverage" },
      { label: "Staff alerts", value: "14", detail: "Ops and sales aware" },
      { label: "Template health", value: "3 active", detail: "Booking, payment, cancellation" },
    ],
    spotlightTitle: "Post-payment communication",
    spotlightBody:
      "The process flow ends Phase 2 with confirmation sent. On the tenant side, owners need visibility into whether each booking actually triggered the right guest and staff communications.",
    spotlightPoints: [
      "Guest confirmation should include full stay details",
      "Relevant staff should receive the operational handoff signal",
      "Cancellation and balance reminders need distinct templates",
    ],
    panels: [
      {
        title: "Guest-facing sends",
        description: "Messages expected after booking milestones.",
        items: [
          { title: "Booking confirmation", meta: "Email and SMS", status: "Required" },
          { title: "DP reminder", meta: "If payment still pending", status: "Conditional" },
          { title: "Cancellation notice", meta: "When policy threshold is reached", status: "Conditional" },
        ],
      },
      {
        title: "Staff-facing awareness",
        description: "Internal notification flows that matter.",
        items: [
          { title: "Sales update", meta: "Lead moved to confirmed", status: "Expected" },
          { title: "Operations prep", meta: "New stay now actionable", status: "Expected" },
          { title: "Discord routing", meta: "Department channel trigger", status: "Optional" },
        ],
      },
      {
        title: "Template set",
        description: "Core message categories represented in MVP.",
        items: [
          { title: "Confirmation templates", meta: "Guest and staff variants", status: "Configured" },
          { title: "Payment reminders", meta: "DP and balance timing", status: "Configured" },
          { title: "Renewal and trial notices", meta: "Subscription lifecycle", status: "Separate" },
        ],
      },
    ],
  },
  "/tenant/finance/cash-flow": {
    eyebrow: "Phase 3 - Finance & Ops",
    title: "Cash flow lifecycle",
    description:
      "Visualize the operational handoff of on-site cash from collection through admin receipt, deposit, and bank verification.",
    primaryAction: "Open cash ledger",
    secondaryAction: "Review bank verification",
    metrics: [
      { label: "Tracked stages", value: "4", detail: "Operations to bank verification" },
      { label: "In-hand cash", value: "PHP 46k", detail: "Not yet deposited" },
      { label: "Pending verification", value: "3 entries", detail: "Accountant review needed" },
      { label: "Cycle time", value: "1.8 days", detail: "Ops to verified" },
    ],
    spotlightTitle: "Finance handoff flow",
    spotlightBody:
      "This page follows the process-flow exactly: cash collected by operations, handed to admin, deposited to owner, then verified against the bank statement by accounting.",
    spotlightPoints: [
      "Keep each cash state explicit and auditable",
      "Make handoff ownership clear at every stage",
      "Use cycle-time visibility to spot operational delay",
    ],
    panels: [
      {
        title: "Lifecycle states",
        description: "The end-to-end cash tracking sequence.",
        items: [
          { title: "With operations", meta: "Cash collected on-site", status: "Stage 1" },
          { title: "Handed to admin", meta: "Admin acknowledgment logged", status: "Stage 2" },
          { title: "Deposited and verified", meta: "Owner deposit plus accountant check", status: "Stages 3-4" },
        ],
      },
      {
        title: "Owner value",
        description: "Why this module matters beyond bookkeeping.",
        items: [
          { title: "Operational accountability", meta: "Trace who held cash when", status: "Strong" },
          { title: "Deposit discipline", meta: "Reduce lag between collection and banking", status: "Strong" },
          { title: "Audit readiness", meta: "Cleaner accounting review trail", status: "Strong" },
        ],
      },
      {
        title: "Frontend behaviors",
        description: "Useful interface patterns for this area.",
        items: [
          { title: "State timeline", meta: "Show each handoff chronologically", status: "Recommended" },
          { title: "Role stamps", meta: "Who updated each stage", status: "Recommended" },
          { title: "Exception flags", meta: "Highlight delayed deposits", status: "Recommended" },
        ],
      },
    ],
  },
  "/tenant/finance/petty-cash": {
    eyebrow: "Phase 3 - Finance & Ops",
    title: "Petty cash",
    description:
      "Support request, approval, rejection, closure, and replenishment tracking for controlled small-expense workflows.",
    primaryAction: "Create petty cash request",
    secondaryAction: "Review approval queue",
    metrics: [
      { label: "Open requests", value: "6", detail: "Pending or approved" },
      { label: "Approval path", value: "Owner aware", detail: "Status changes notify owner" },
      { label: "Closed this month", value: "18", detail: "Invoice received and closed" },
      { label: "Replenishments", value: "2", detail: "Triggered automatically" },
    ],
    spotlightTitle: "Controlled small spend",
    spotlightBody:
      "The petty cash module should feel simple for staff but strict for finance. The owner primarily needs traceability, status visibility, and replenishment awareness.",
    spotlightPoints: [
      "Support Pending, Approved or Rejected, then Closed states",
      "Allow broad request creation but controlled approval visibility",
      "Notify owner when replenishment thresholds are reached",
    ],
    panels: [
      {
        title: "Request states",
        description: "The lifecycle modeled in the MVP and process flow.",
        items: [
          { title: "Pending", meta: "Awaiting decision", status: "Open" },
          { title: "Approved / Rejected", meta: "Decision point for finance", status: "Control" },
          { title: "Closed", meta: "Receipt or invoice received", status: "Complete" },
        ],
      },
      {
        title: "Access expectations",
        description: "Which roles are most involved.",
        items: [
          { title: "Authorized staff", meta: "Can submit requests", status: "Allowed" },
          { title: "Accountant", meta: "Full read and write", status: "Primary" },
          { title: "Auditor", meta: "Read-only visibility", status: "Secondary" },
        ],
      },
      {
        title: "Owner notifications",
        description: "Signals this module should bubble upward.",
        items: [
          { title: "Status changes", meta: "Approved, rejected, closed", status: "Notify" },
          { title: "Replenishment alerts", meta: "Budget health", status: "Notify" },
          { title: "Outlier spending", meta: "Potential policy review", status: "Watch" },
        ],
      },
    ],
  },
  "/tenant/finance/accounting": {
    eyebrow: "Phase 3 - Finance & Ops",
    title: "Accounting and reconciliation",
    description:
      "Represent liquidation, cash flow reports, reconciliation, and bank matching inside the owner-facing tenant workspace.",
    primaryAction: "Open reconciliation",
    secondaryAction: "Review liquidation",
    metrics: [
      { label: "Accounting scope", value: "3 functions", detail: "Liquidation, cash flow, reconciliation" },
      { label: "Bank matches", value: "97%", detail: "Current reconciliation accuracy" },
      { label: "Auditor access", value: "Read-only", detail: "Role-enforced" },
      { label: "Pending mismatches", value: "2", detail: "Need accountant action" },
    ],
    spotlightTitle: "Finance control layer",
    spotlightBody:
      "Accounting on the tenant side is less about transaction entry and more about confidence: owners should be able to see whether records reconcile and exceptions are contained.",
    spotlightPoints: [
      "Separate accountant edit power from auditor read-only access",
      "Expose mismatches and unresolved liquidations quickly",
      "Tie finance records back to operations and booking context when helpful",
    ],
    panels: [
      {
        title: "Core functions",
        description: "Accounting capabilities defined in the MVP plan.",
        items: [
          { title: "Liquidation", meta: "Track expenses by period or event", status: "Included" },
          { title: "Cash flow report", meta: "Inflows versus outflows", status: "Included" },
          { title: "Reconciliation", meta: "Match system to bank records", status: "Included" },
        ],
      },
      {
        title: "Role boundaries",
        description: "How accounting roles should differ in the UI.",
        items: [
          { title: "Accountant", meta: "Full accounting controls", status: "Write" },
          { title: "Auditor", meta: "Read-only finance oversight", status: "Read" },
          { title: "Owner", meta: "Business-level visibility and approvals", status: "Review" },
        ],
      },
      {
        title: "Exception management",
        description: "Situations worth calling out in the frontend.",
        items: [
          { title: "Unmatched bank records", meta: "Needs investigation", status: "Flag" },
          { title: "Missing liquidation docs", meta: "Blocks closure", status: "Flag" },
          { title: "Delayed verification", meta: "May affect KPI cycle time", status: "Flag" },
        ],
      },
    ],
  },
  "/tenant/hr/attendance": {
    eyebrow: "Phase 3 - Finance & Ops",
    title: "HR and attendance",
    description:
      "Cover daily attendance, leave approvals, staff records, and exportable HR summaries for owner and HR roles.",
    primaryAction: "Open attendance report",
    secondaryAction: "Review leave queue",
    metrics: [
      { label: "Attendance mode", value: "Daily log", detail: "Clock-in and clock-out tracking" },
      { label: "Leave requests", value: "4", detail: "Pending decision this week" },
      { label: "Directory records", value: "26", detail: "Role, contact, department" },
      { label: "Export cadence", value: "Weekly / monthly", detail: "CSV-ready reports" },
    ],
    spotlightTitle: "HR visibility",
    spotlightBody:
      "The owner does not need payroll in MVP, but they do need clean visibility into attendance health, leave flow, and staffing stability by department.",
    spotlightPoints: [
      "Keep HR module visible only to HR and Owner roles",
      "Support both operational daily use and summary exports",
      "Feed attendance health into the KPI dashboard later",
    ],
    panels: [
      {
        title: "Attendance controls",
        description: "Core data points represented in this module.",
        items: [
          { title: "Clock-in / clock-out", meta: "Per staff per day", status: "Tracked" },
          { title: "Absence and tardiness", meta: "Department summary ready", status: "Tracked" },
          { title: "Export reports", meta: "Weekly and monthly CSV", status: "Available" },
        ],
      },
      {
        title: "Leave workflow",
        description: "Actions the tenant side should support.",
        items: [
          { title: "Request submission", meta: "Employee initiates", status: "Supported" },
          { title: "Approval flow", meta: "HR review and status", status: "Supported" },
          { title: "Balance tracking", meta: "Remaining leave visible", status: "Supported" },
        ],
      },
      {
        title: "Owner insights",
        description: "What should roll up into higher-level reporting.",
        items: [
          { title: "Department attendance trends", meta: "Spot chronic strain", status: "Useful" },
          { title: "Leave clustering", meta: "Protect operations coverage", status: "Useful" },
          { title: "Staff record health", meta: "Keep directory current", status: "Useful" },
        ],
      },
    ],
  },
  "/tenant/marketing/analytics": {
    eyebrow: "Phase 3 / 5 - Marketing",
    title: "Marketing analytics",
    description:
      "Track inquiry sources, conversion, lead aging, website counters, and growth insights that help owners direct spend.",
    primaryAction: "Open source report",
    secondaryAction: "Compare conversion trends",
    metrics: [
      { label: "Tracked sources", value: "4", detail: "Organic, referral, social, direct" },
      { label: "Lead conversion", value: "18%", detail: "Inquiry to confirmed" },
      { label: "Lead aging summary", value: "Healthy", detail: "Most leads touched within SLA" },
      { label: "Website traffic", value: "4.2k", detail: "Booking widget clicks also tracked" },
    ],
    spotlightTitle: "Growth instrumentation",
    spotlightBody:
      "Marketing on the tenant side should connect source quality, website behavior, and sales outcomes so owners can see where demand is really coming from.",
    spotlightPoints: [
      "Route new client form submissions from marketing to sales",
      "Keep count viewers and traffic summaries easy to scan",
      "Support advanced reporting for Growth and Enterprise tiers",
    ],
    panels: [
      {
        title: "Core reports",
        description: "Baseline analytics available across plans.",
        items: [
          { title: "Inquiries per period", meta: "Basic performance view", status: "All plans" },
          { title: "Conversion rate", meta: "Lead to booking health", status: "All plans" },
          { title: "Lead aging", meta: "Responsiveness by pipeline stage", status: "All plans" },
        ],
      },
      {
        title: "Advanced views",
        description: "Higher-tier reporting paths from the MVP.",
        items: [
          { title: "Custom date ranges", meta: "Flexible analysis", status: "Growth+" },
          { title: "Funnel analysis", meta: "See drop-off by step", status: "Growth+" },
          { title: "Export PDF / CSV", meta: "Owner sharing and archiving", status: "Growth+" },
        ],
      },
      {
        title: "Signals to connect",
        description: "Useful joins across modules.",
        items: [
          { title: "Inquiry source to conversion", meta: "Marketing effectiveness", status: "Link" },
          { title: "Website visits to booking clicks", meta: "Direct funnel health", status: "Link" },
          { title: "Lead aging to sales response", meta: "Operational growth insight", status: "Link" },
        ],
      },
    ],
  },
  "/tenant/web/builder": {
    eyebrow: "Phase 4 - Website Builder",
    title: "Builder workspace",
    description:
      "Control the no-code public resort site with toggleable sections, booking widget connection, and brand-aware editing.",
    primaryAction: "Open site builder",
    secondaryAction: "Preview subdomain",
    metrics: [
      { label: "Template foundation", value: "Resort-ready", detail: "Hero, About, Rooms, Gallery, Amenities, Contact" },
      { label: "Booking widget", value: "Connected", detail: "Auto-linked to reservation module" },
      { label: "Section controls", value: "Toggle + reorder", detail: "Owner-managed without code" },
      { label: "Preview URL", value: "tenant.resortcloud.app", detail: "Live before publish" },
    ],
    spotlightTitle: "No-code publishing core",
    spotlightBody:
      "This page represents the center of Phase 4: a tenant can shape their guest-facing site without code while still staying anchored to the booking engine.",
    spotlightPoints: [
      "Keep editing focused on brand and content, not technical setup",
      "Make the booking widget feel native to the public site",
      "Preserve preview-before-publish confidence for owners",
    ],
    panels: [
      {
        title: "Section architecture",
        description: "Default site areas called out in the MVP.",
        items: [
          { title: "Hero, About, Rooms", meta: "Top booking story structure", status: "Included" },
          { title: "Gallery and Amenities", meta: "Trust and experience builders", status: "Included" },
          { title: "Contact and Location", meta: "Last-mile conversion support", status: "Included" },
        ],
      },
      {
        title: "Builder controls",
        description: "Editing actions this workspace should surface.",
        items: [
          { title: "Toggle sections", meta: "Show or hide modules", status: "Supported" },
          { title: "Reorder sections", meta: "Change content flow", status: "Supported" },
          { title: "Live preview", meta: "See before going live", status: "Supported" },
        ],
      },
      {
        title: "Booking linkage",
        description: "How the website stays connected to operations.",
        items: [
          { title: "Embedded booking widget", meta: "Uses tenant reservation data", status: "Core" },
          { title: "Availability awareness", meta: "Public path anchored to system records", status: "Core" },
          { title: "Lead capture handoff", meta: "Supports direct inquiry generation", status: "Core" },
        ],
      },
    ],
  },
  "/tenant/web/assets": {
    eyebrow: "Phase 4 - Website Builder",
    title: "Sections and assets",
    description:
      "Manage logos, brand colors, typography, hero media, room galleries, and shared image assets for the tenant website.",
    primaryAction: "Open asset library",
    secondaryAction: "Review brand kit",
    metrics: [
      { label: "Brand controls", value: "4", detail: "Logo, colors, type, intro copy" },
      { label: "Asset library", value: "Reusable", detail: "Upload once, place anywhere" },
      { label: "Image handling", value: "Optimized", detail: "Compression and WebP before publish" },
      { label: "Room galleries", value: "Multi-image", detail: "Per room type with reordering" },
    ],
    spotlightTitle: "Visual publishing system",
    spotlightBody:
      "The website builder is only useful if owners can confidently manage their brand and images. This page turns the MVP asset requirements into a clean resort-owner workflow.",
    spotlightPoints: [
      "Treat the asset library as shared infrastructure, not a one-off uploader",
      "Support drag-to-reorder room photos and hero swaps easily",
      "Make typography and color changes feel immediate in preview",
    ],
    panels: [
      {
        title: "Brand customization",
        description: "Controls defined in the MVP plan.",
        items: [
          { title: "Logo and favicon", meta: "Replaces default branding", status: "Supported" },
          { title: "Primary, secondary, accent colors", meta: "Live UI updates", status: "Supported" },
          { title: "Typography pairings", meta: "Curated owner-safe options", status: "Supported" },
        ],
      },
      {
        title: "Image workflows",
        description: "How owners should work with media.",
        items: [
          { title: "Hero banner upload", meta: "Full-width landing visual", status: "Supported" },
          { title: "Rooms gallery", meta: "Multiple images per room type", status: "Supported" },
          { title: "General property gallery", meta: "Amenity and destination storytelling", status: "Supported" },
        ],
      },
      {
        title: "Publishing support",
        description: "Useful system behaviors around assets.",
        items: [
          { title: "Auto optimization", meta: "Compression and format conversion", status: "Enabled" },
          { title: "Shared asset reuse", meta: "Avoid duplicate uploads", status: "Enabled" },
          { title: "Preview-safe editing", meta: "Changes visible before publish", status: "Enabled" },
        ],
      },
    ],
  },
  "/tenant/web/domains": {
    eyebrow: "Phase 4 - Website Builder",
    title: "Domains and DNS",
    description:
      "Represent the built-in domain marketplace flow: search, purchase, automatic DNS configuration, SSL provisioning, and renewal reminders.",
    primaryAction: "Search domain",
    secondaryAction: "Review renewal policy",
    metrics: [
      { label: "Free trial domains", value: "0", detail: "Marketplace unavailable during trial" },
      { label: "Growth entitlement", value: "1 domain", detail: "Included in plan" },
      { label: "Enterprise entitlement", value: "3 domains", detail: "Included in plan" },
      { label: "Renewal reminders", value: "30d / 7d", detail: "Email-driven lifecycle" },
    ],
    spotlightTitle: "Invisible technical setup",
    spotlightBody:
      "The marketplace should feel like Search, Buy, Done to the tenant owner. DNS records, SSL, and registrar complexity stay behind the curtain.",
    spotlightPoints: [
      "Hide registrar credentials and infrastructure details from owners",
      "Show clear domain status messaging after purchase",
      "Tie entitlement and add-on rules to current plan cleanly",
    ],
    panels: [
      {
        title: "Purchase flow",
        description: "Tenant-visible steps from the MVP.",
        items: [
          { title: "Search domain", meta: "Real-time availability across TLDs", status: "Step 1" },
          { title: "Purchase domain", meta: "Platform charges saved payment method", status: "Step 2" },
          { title: "Activate and connect", meta: "DNS and SSL handled automatically", status: "Steps 3-5" },
        ],
      },
      {
        title: "Plan logic",
        description: "What the owner needs to know about eligibility.",
        items: [
          { title: "Trial", meta: "Marketplace unavailable", status: "Blocked" },
          { title: "Starter", meta: "Domain via paid add-on", status: "Optional" },
          { title: "Growth / Enterprise", meta: "Included domains by tier", status: "Included" },
        ],
      },
      {
        title: "Lifecycle management",
        description: "Statuses the frontend should communicate.",
        items: [
          { title: "Purchased - setting up", meta: "Registration in progress", status: "Transient" },
          { title: "Active - connecting", meta: "DNS and SSL provisioning", status: "Transient" },
          { title: "Live and renewing", meta: "Auto-renew with reminders", status: "Stable" },
        ],
      },
    ],
  },
  "/tenant/web/publish": {
    eyebrow: "Phase 4 - Website Builder",
    title: "Publish center",
    description:
      "Control subdomain preview, one-click publish or unpublish, and the final go-live state of the tenant site.",
    primaryAction: "Publish site",
    secondaryAction: "Open preview",
    metrics: [
      { label: "Preview mode", value: "Always on", detail: "Before public launch" },
      { label: "Publishing action", value: "One-click", detail: "Publish or unpublish" },
      { label: "Custom domain state", value: "Connected", detail: "Live-ready path" },
      { label: "Booking widget status", value: "Live sync", detail: "Reservation module attached" },
    ],
    spotlightTitle: "Go-live confidence",
    spotlightBody:
      "Owners should feel in control of when their site is public. The publish center is the last confidence checkpoint before direct bookings start flowing through the public site.",
    spotlightPoints: [
      "Keep preview and published states visually distinct",
      "Show domain and widget readiness before launch",
      "Allow safe unpublish without breaking underlying configuration",
    ],
    panels: [
      {
        title: "Readiness checks",
        description: "Signals owners should see before publishing.",
        items: [
          { title: "Brand assets complete", meta: "Logo, colors, media loaded", status: "Check" },
          { title: "Booking widget connected", meta: "Reservation data is live", status: "Check" },
          { title: "Domain / subdomain ready", meta: "Public address is configured", status: "Check" },
        ],
      },
      {
        title: "Publishing states",
        description: "Core modes the frontend should expose.",
        items: [
          { title: "Draft preview", meta: "Private working mode", status: "Safe" },
          { title: "Published", meta: "Public and bookable", status: "Live" },
          { title: "Unpublished", meta: "Taken offline intentionally", status: "Controlled" },
        ],
      },
      {
        title: "Launch support",
        description: "Helpful owner-facing prompts around go-live.",
        items: [
          { title: "Final content checklist", meta: "Reduce launch mistakes", status: "Useful" },
          { title: "Traffic readiness note", meta: "Encourage marketing sync", status: "Useful" },
          { title: "Post-launch metrics link", meta: "Send owners to website funnel", status: "Useful" },
        ],
      },
    ],
  },
  "/tenant/analytics/kpi": {
    eyebrow: "Phase 6 - KPI",
    title: "KPI dashboard",
    description:
      "Give the tenant owner a real-time performance summary across bookings, payments, cash handling, HR, website, and AI forecast accuracy.",
    primaryAction: "Open full KPI board",
    secondaryAction: "Compare periods",
    metrics: [
      { label: "Booking conversion", value: "18%", detail: "Inquiry to confirmed" },
      { label: "DP compliance", value: "92%", detail: "50% payment policy health" },
      { label: "Cash cycle time", value: "1.8 days", detail: "Operations to bank verified" },
      { label: "Website conversion", value: "4.8%", detail: "Visitor to booking widget conversion" },
    ],
    spotlightTitle: "Owner performance hub",
    spotlightBody:
      "The KPI dashboard is one of the most owner-specific modules in the MVP. It should summarize cross-department health rather than duplicate lower-level operational screens.",
    spotlightPoints: [
      "Combine sales, finance, HR, website, and AI indicators in one owner view",
      "Use this page as the north-star layer above daily modules",
      "Keep definitions tied to the actual process flow and payment policies",
    ],
    panels: [
      {
        title: "Commercial KPIs",
        description: "Core commercial measures called out in the MVP.",
        items: [
          { title: "Booking conversion rate", meta: "Inquiries to confirmed stays", status: "Core" },
          { title: "DP compliance", meta: "50% payment rule adherence", status: "Core" },
          { title: "Cancellation rate", meta: "Including 7-day policy impact", status: "Core" },
        ],
      },
      {
        title: "Operational KPIs",
        description: "Cross-team process health for owners.",
        items: [
          { title: "Cash collection cycle", meta: "Ops to bank verified", status: "Core" },
          { title: "Inquiry response time", meta: "Per sales agent", status: "Core" },
          { title: "HR attendance summary", meta: "Absence and tardiness by department", status: "Core" },
        ],
      },
      {
        title: "Digital KPIs",
        description: "Tenant website and AI-related owner views.",
        items: [
          { title: "Site visitors and widget clicks", meta: "Website builder performance", status: "Core" },
          { title: "Lead priority aging", meta: "Hot, Warm, Cold counts", status: "Core" },
          { title: "AI forecast accuracy", meta: "Enterprise only", status: "Conditional" },
        ],
      },
    ],
  },
  "/tenant/analytics/advanced": {
    eyebrow: "Phase 5 - Analytics",
    title: "Advanced analytics",
    description:
      "Expose custom date ranges, funnel analysis, export workflows, and higher-tier reporting for Growth and Enterprise tenants.",
    primaryAction: "Build analysis view",
    secondaryAction: "Export CSV or PDF",
    metrics: [
      { label: "Plan access", value: "Growth+", detail: "Feature-gated" },
      { label: "Date flexibility", value: "Custom", detail: "Owner-defined windows" },
      { label: "Exports", value: "PDF / CSV", detail: "Ready for stakeholder sharing" },
      { label: "Funnel views", value: "Booking + website", detail: "Drop-off analysis" },
    ],
    spotlightTitle: "Tiered reporting value",
    spotlightBody:
      "This module is where the product starts feeling more strategic for owners. It should go beyond snapshots and help them understand trends, funnels, and exportable reporting.",
    spotlightPoints: [
      "Gate the view by plan tier but explain the value clearly",
      "Use funnel views to connect sales and website behavior",
      "Make exports first-class for owners who share reports outside the app",
    ],
    panels: [
      {
        title: "Advanced capabilities",
        description: "What distinguishes this from standard reports.",
        items: [
          { title: "Custom date ranges", meta: "Flexible reporting periods", status: "Growth+" },
          { title: "Funnel analysis", meta: "Conversion step visibility", status: "Growth+" },
          { title: "Export workflows", meta: "PDF and CSV", status: "Growth+" },
        ],
      },
      {
        title: "Useful cuts",
        description: "Analyses owners are likely to run here.",
        items: [
          { title: "Source to booking funnel", meta: "Marketing and sales alignment", status: "High value" },
          { title: "Weekend demand windows", meta: "Commercial planning", status: "High value" },
          { title: "Department response patterns", meta: "Operational coaching", status: "High value" },
        ],
      },
      {
        title: "Gating cues",
        description: "Frontend hints around premium analytics.",
        items: [
          { title: "Growth access badge", meta: "Feature available on current plan", status: "Visible" },
          { title: "Enterprise expansion", meta: "AI metrics deepen the view", status: "Visible" },
          { title: "Upgrade callouts", meta: "For Starter accounts", status: "Contextual" },
        ],
      },
    ],
  },
  "/tenant/analytics/properties": {
    eyebrow: "Phase 5 - Analytics",
    title: "Multi-property",
    description:
      "Represent the Growth and Enterprise ability to manage more than one property under a single tenant account.",
    primaryAction: "Open property switcher",
    secondaryAction: "Review plan entitlement",
    metrics: [
      { label: "Current scope", value: "2 properties", detail: "Growth plan allowance" },
      { label: "Plan access", value: "Growth+", detail: "Not available on Starter" },
      { label: "Shared owner view", value: "Yes", detail: "Cross-property reporting expected" },
      { label: "Setup complexity", value: "Moderate", detail: "Needs strong tenant switching UX" },
    ],
    spotlightTitle: "Portfolio operations",
    spotlightBody:
      "Multi-property support changes the owner experience materially. The frontend should help owners stay oriented when comparing performance, inventory, and activity across properties.",
    spotlightPoints: [
      "Use a clear property context switcher in key views",
      "Make aggregate and per-property reporting both possible",
      "Tie property count limits to the active subscription plan",
    ],
    panels: [
      {
        title: "Plan entitlements",
        description: "How many properties each tier can manage.",
        items: [
          { title: "Starter", meta: "Single property only", status: "Restricted" },
          { title: "Growth", meta: "Up to 2 properties", status: "Supported" },
          { title: "Enterprise", meta: "Multi-property with AI suite", status: "Expanded" },
        ],
      },
      {
        title: "Frontend needs",
        description: "UX requirements this capability introduces.",
        items: [
          { title: "Property switcher", meta: "Always visible in context-heavy pages", status: "Required" },
          { title: "Portfolio summaries", meta: "Aggregate owner-level insight", status: "Required" },
          { title: "Scoped actions", meta: "Prevent editing wrong property", status: "Required" },
        ],
      },
      {
        title: "Owner questions",
        description: "Analyses this page should make easier.",
        items: [
          { title: "Which property converts best?", meta: "Commercial comparison", status: "Answerable" },
          { title: "Where is staffing strain highest?", meta: "Operational comparison", status: "Answerable" },
          { title: "Which site drives most direct demand?", meta: "Digital comparison", status: "Answerable" },
        ],
      },
    ],
  },
  "/tenant/ai/recommendations": {
    eyebrow: "Phase 5 - AI Suite",
    title: "AI smart recommendations",
    description:
      "Show Enterprise-only pricing, packaging, and promo suggestions based on booking history, seasonality, and booking pace.",
    primaryAction: "Review recommendations",
    secondaryAction: "Compare against reports",
    metrics: [
      { label: "Plan access", value: "Enterprise", detail: "Feature-flagged" },
      { label: "Decision domains", value: "Rates, promos, packages", detail: "Owner-facing guidance" },
      { label: "Data sources", value: "Bookings + seasonality", detail: "Historical and current patterns" },
      { label: "Action style", value: "Suggestive", detail: "Owner remains in control" },
    ],
    spotlightTitle: "Commercial decision support",
    spotlightBody:
      "The AI recommendation layer should help owners act faster without making the system feel opaque. The value is guidance, not blind automation.",
    spotlightPoints: [
      "Keep every recommendation traceable to business context",
      "Anchor suggestions in rates, packaging, and promotion windows",
      "Use Enterprise gating clearly but elegantly",
    ],
    panels: [
      {
        title: "Recommendation themes",
        description: "Where the AI is expected to help most.",
        items: [
          { title: "Optimal pricing", meta: "Rate suggestions by demand window", status: "Primary" },
          { title: "Room packaging", meta: "Bundle design guidance", status: "Primary" },
          { title: "Promo timing", meta: "When to push offers", status: "Primary" },
        ],
      },
      {
        title: "Owner trust cues",
        description: "How the interface should present AI outputs.",
        items: [
          { title: "Reasoning snippets", meta: "Why this recommendation exists", status: "Helpful" },
          { title: "Side-by-side metrics", meta: "Compare AI guidance to actual reports", status: "Helpful" },
          { title: "Manual adoption", meta: "Owner approves the action", status: "Safe" },
        ],
      },
      {
        title: "Plan framing",
        description: "How this fits into the wider tenant product story.",
        items: [
          { title: "Growth baseline", meta: "Advanced analytics without full AI", status: "Comparison" },
          { title: "Enterprise lift", meta: "Decision support on top of analytics", status: "Positioning" },
          { title: "Feature flags", meta: "Strictly controlled by tier", status: "Enforced" },
        ],
      },
    ],
  },
  "/tenant/ai/forecast": {
    eyebrow: "Phase 5 - AI Suite",
    title: "Revenue forecasting",
    description:
      "Predict 30, 60, and 90-day occupancy and revenue trends using history, pipeline, and seasonal behavior.",
    primaryAction: "Open forecast horizon",
    secondaryAction: "Compare predicted vs actual",
    metrics: [
      { label: "Forecast windows", value: "30 / 60 / 90", detail: "Rolling view" },
      { label: "Plan access", value: "Enterprise", detail: "AI suite only" },
      { label: "Input signals", value: "History + pipeline", detail: "Seasonality-aware" },
      { label: "Accuracy tracking", value: "KPI-linked", detail: "Predicted vs actual" },
    ],
    spotlightTitle: "Forward-looking owner view",
    spotlightBody:
      "Revenue forecasting becomes more valuable when the owner can compare predictions to reality and decide whether to adjust rates, campaigns, or staffing expectations.",
    spotlightPoints: [
      "Show forecast horizons in a business-readable way",
      "Connect predictions back to commercial actions like pricing and promos",
      "Track forecast accuracy in the KPI dashboard for trust",
    ],
    panels: [
      {
        title: "Forecast outputs",
        description: "What the AI should generate for owners.",
        items: [
          { title: "Occupancy outlook", meta: "30, 60, 90-day projections", status: "Core" },
          { title: "Revenue outlook", meta: "Gross trend expectations", status: "Core" },
          { title: "Demand pattern notes", meta: "Seasonality or pipeline context", status: "Core" },
        ],
      },
      {
        title: "Decision support",
        description: "How owners can use the forecast.",
        items: [
          { title: "Adjust rates", meta: "If demand outlook shifts", status: "Actionable" },
          { title: "Plan promotions", meta: "For softer windows", status: "Actionable" },
          { title: "Prepare operations", meta: "For expected occupancy swings", status: "Actionable" },
        ],
      },
      {
        title: "Trust loop",
        description: "What helps owners believe the forecast over time.",
        items: [
          { title: "Predicted vs actual", meta: "Accuracy view over time", status: "Track" },
          { title: "Business context", meta: "Reference lead pipeline and seasonality", status: "Explain" },
          { title: "No black box urgency", meta: "Recommendations stay owner-controlled", status: "Reassure" },
        ],
      },
    ],
  },
  "/tenant/integrations/paymongo": {
    eyebrow: "Phase 6 - Payments",
    title: "PayMongo integration",
    description:
      "Represent guest payment rails for 50% down payment links, balance requests, webhook updates, and refund controls.",
    primaryAction: "Open payment settings",
    secondaryAction: "Review webhook health",
    metrics: [
      { label: "Payment methods", value: "GCash, Maya, cards", detail: "Supported in MVP" },
      { label: "Webhook listener", value: "Active", detail: "Booking status auto-updates" },
      { label: "Refund control", value: "Owner approval", detail: "Manual accountant trigger" },
      { label: "Scope", value: "Guest payments", detail: "Separate from Stripe subscriptions" },
    ],
    spotlightTitle: "Guest payment backbone",
    spotlightBody:
      "This page should make PayMongo feel like the financial engine behind booking confirmation, not just a technical integration. Owners need visibility and confidence here.",
    spotlightPoints: [
      "Separate guest payments from platform subscription billing",
      "Use webhook health to reassure booking status integrity",
      "Keep refund rules explicit and controlled",
    ],
    panels: [
      {
        title: "Payment flow",
        description: "How PayMongo connects to booking milestones.",
        items: [
          { title: "50% DP link", meta: "Generated on booking", status: "Core" },
          { title: "Balance payment link", meta: "Triggered by schedule or policy", status: "Core" },
          { title: "Webhook update", meta: "Successful payment updates booking", status: "Core" },
        ],
      },
      {
        title: "Supported methods",
        description: "Guest-facing payment options in the MVP.",
        items: [
          { title: "GCash", meta: "Local convenience method", status: "Enabled" },
          { title: "Maya", meta: "Local convenience method", status: "Enabled" },
          { title: "Credit and debit cards", meta: "Broader payment acceptance", status: "Enabled" },
        ],
      },
      {
        title: "Control points",
        description: "Approvals and exceptions owners care about.",
        items: [
          { title: "Refund workflow", meta: "Accountant initiates, owner approves", status: "Controlled" },
          { title: "Transaction logging", meta: "Linked back to invoices", status: "Tracked" },
          { title: "Webhook failures", meta: "Could desync confirmation state", status: "Watch" },
        ],
      },
    ],
  },
  "/tenant/integrations/notifications": {
    eyebrow: "Phase 6 - Integrations",
    title: "Notifications",
    description:
      "Coordinate in-app push, email, and SMS notifications scoped by role and tied to booking, finance, and subscription events.",
    primaryAction: "Open notification rules",
    secondaryAction: "Review message templates",
    metrics: [
      { label: "Channels", value: "Push, email, SMS", detail: "Role and event scoped" },
      { label: "Trial reminders", value: "Day 5 / Day 7", detail: "Tenant conversion flow" },
      { label: "Renewal reminders", value: "7d / 1d", detail: "Subscription lifecycle" },
      { label: "Ops alerts", value: "Role-based", detail: "Only relevant staff notified" },
    ],
    spotlightTitle: "Role-aware communications",
    spotlightBody:
      "The MVP notification layer is broad: booking confirmations, payment reminders, petty cash alerts, KPI breaches, trial expiry, and renewals all live here.",
    spotlightPoints: [
      "Scope notifications tightly by role to reduce noise",
      "Treat owner alerts differently from staff operational alerts",
      "Keep lifecycle reminders visible for both guest and SaaS workflows",
    ],
    panels: [
      {
        title: "Operational alerts",
        description: "Notifications that support daily execution.",
        items: [
          { title: "Sales priority upgrades", meta: "Cold to Warm, Warm to Hot", status: "Push" },
          { title: "Housekeeping reminder", meta: "Admin to supervisor only", status: "Push" },
          { title: "Petty cash approval requests", meta: "Accounting workflow", status: "Push" },
        ],
      },
      {
        title: "Guest communications",
        description: "External messages owners rely on the platform to send.",
        items: [
          { title: "Booking confirmation", meta: "Full stay details", status: "Email + SMS" },
          { title: "Payment reminders", meta: "DP due and balance due", status: "Email + SMS" },
          { title: "Cancellation notices", meta: "Policy-triggered messaging", status: "Email + SMS" },
        ],
      },
      {
        title: "Lifecycle reminders",
        description: "Subscription and domain-related owner reminders.",
        items: [
          { title: "Trial expiry", meta: "Day 5 and Day 7", status: "Owner" },
          { title: "Subscription renewal", meta: "7 days and 1 day before", status: "Owner" },
          { title: "Domain renewal", meta: "30 days and 7 days before", status: "Owner" },
        ],
      },
    ],
  },
  "/tenant/integrations/discord": {
    eyebrow: "Phase 6 - Integrations",
    title: "Discord integration",
    description:
      "Map tenant webhook channels to bookings, operations, and finance events so internal teams stay informed without leaving Discord.",
    primaryAction: "Configure channel mapping",
    secondaryAction: "Review trigger events",
    metrics: [
      { label: "Department channels", value: "Bookings, Ops, Finance", detail: "Mapped by tenant owner" },
      { label: "Config model", value: "Webhook URL", detail: "Per channel" },
      { label: "Trigger set", value: "4 key events", detail: "Booking, cash, petty cash, KPI" },
      { label: "Role owner", value: "Tenant owner", detail: "Configures the integration" },
    ],
    spotlightTitle: "Department broadcast layer",
    spotlightBody:
      "Discord is a practical operations bridge in the MVP. The owner-facing UI should make setup simple and event coverage understandable without technical overhead.",
    spotlightPoints: [
      "Keep channel mapping department-specific",
      "Show exactly which system events post where",
      "Treat Discord as an operational awareness layer, not a source of truth",
    ],
    panels: [
      {
        title: "Mapped channels",
        description: "Examples from the MVP plan.",
        items: [
          { title: "#bookings", meta: "New confirmed booking alerts", status: "Common" },
          { title: "#operations", meta: "On-site and task-sensitive updates", status: "Common" },
          { title: "#finance", meta: "Cash and petty cash alerts", status: "Common" },
        ],
      },
      {
        title: "Trigger events",
        description: "System moments that can flow into Discord.",
        items: [
          { title: "Booking confirmed", meta: "Sales and operations awareness", status: "Trigger" },
          { title: "Cash status update", meta: "Finance visibility", status: "Trigger" },
          { title: "Petty cash request / KPI alert", meta: "Owner and department awareness", status: "Trigger" },
        ],
      },
      {
        title: "Owner controls",
        description: "How the tenant side should frame configuration.",
        items: [
          { title: "Webhook URL per channel", meta: "Simple mapping model", status: "Configurable" },
          { title: "Enable / disable triggers", meta: "Control noise by department", status: "Useful" },
          { title: "Test message path", meta: "Verify the integration quickly", status: "Useful" },
        ],
      },
    ],
  },
};

export const tenantWorkspaceRegistry: Record<
  TenantWorkspacePath,
  TenantWorkspaceContent
> = {
  ...legacyTenantWorkspaceContent,
  ...tenantMvpExpansionContent,
};

export const tenantWorkspaceAccent = {
  icon: <HouseIcon className="size-3.5" />,
  label: "Tenant workspace",
  tag: <SparklesIcon className="size-3.5" />,
  chip: "MVP-aligned",
  secondaryTag: <BedDoubleIcon className="size-3.5" />,
  secondaryChip: "Owner operations",
  tertiaryTag: <TagsIcon className="size-3.5" />,
  tertiaryChip: "Plan-aware features",
  quaternaryTag: <MessageSquareMoreIcon className="size-3.5" />,
  quaternaryChip: "Cross-team visibility",
  automationTag: <BotIcon className="size-3.5" />,
  automationChip: "Process-flow ready",
};
