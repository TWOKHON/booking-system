import { cache } from "react";

type EcosystemMetric = {
  value: string;
  label: string;
  detail: string;
};

type EcosystemHowItWorksStep = {
  step: string;
  title: string;
  description: string;
};

type EcosystemModule = {
  title: string;
  summary: string;
  bullets: string[];
};

type EcosystemFlowStep = {
  step: string;
  title: string;
  tenantAction: string;
  platformAction: string;
};

type EcosystemFeature = {
  title: string;
  plan: string;
  description: string;
};

type EcosystemRole = {
  role: string;
  phase: string;
  responsibility: string;
};

type EcosystemRoadmapPhase = {
  phase: string;
  window: string;
  title: string;
  deliverables: string[];
};

const ecosystemContent = {
  hero: {
    eyebrow: "ResortCloud Ecosystem",
    title: "Every resort workflow, connected in one operating system.",
    description:
      "ResortCloud brings reservations, finance, HR, website publishing, domain management, AI, and guest communications into a single SaaS platform built for private resort operators in the Philippines.",
    pills: [
      "7-day free trial",
      "Ad-free on every paid plan",
      "Built-in domain marketplace",
    ],
  },
  metrics: [
    {
      value: "7 days",
      label: "free trial window",
      detail: "Starter-level access with up to 3 staff accounts for evaluation.",
    },
    {
      value: "3 tiers",
      label: "paid plans",
      detail: "Starter, Growth, and Enterprise scale from daily operations to AI.",
    },
    {
      value: "10 roles",
      label: "permission sets",
      detail: "Server-enforced RBAC keeps each team member focused on the right work.",
    },
    {
      value: "24 weeks",
      label: "MVP roadmap",
      detail: "Six sequential delivery phases cover the full ResortCloud rollout.",
    },
  ] satisfies EcosystemMetric[],
  howItWorks: [
    {
      step: "Step 1",
      title: "Configure",
      description:
        "Set up your resort profile, staff roles, pricing rules, and branded website foundation in one guided workspace.",
    },
    {
      step: "Step 2",
      title: "Connect",
      description:
        "Link bookings, inquiries, operations, and your custom domain so every module shares the same live data.",
    },
    {
      step: "Step 3",
      title: "Operate",
      description:
        "Run daily resort work from one system with analytics, AI-assisted workflows, and guest-ready publishing built in.",
    },
  ] satisfies EcosystemHowItWorksStep[],
  modules: [
    {
      title: "Booking and sales command center",
      summary:
        "Give Sales teams one place to track inquiries, availability, invoices, and follow-up priority before guests ever arrive.",
      bullets: [
        "Color-coded availability board for vacant, inquired, reserved, confirmed, and cancelled stays",
        "Client intake forms with follow-up logs, assigned sales agents, and status history",
        "50% down payment workflow with invoice generation and payment links",
      ],
    },
    {
      title: "Finance, HR, and resort operations",
      summary:
        "Replace scattered spreadsheets with structured cash tracking, attendance visibility, and role-specific operational queues.",
      bullets: [
        "Cash lifecycle from Operations to Admin to deposited and bank-verified",
        "Petty cash requests, liquidation, reconciliation, and owner alerts",
        "Attendance, leave management, staff records, and departmental reporting",
      ],
    },
    {
      title: "Website builder and domain marketplace",
      summary:
        "Publish a guest-facing resort website, connect a branded domain, and let ResortCloud handle the technical setup behind the scenes.",
      bullets: [
        "No-code builder with hero, rooms, gallery, amenities, contact, and booking widget sections",
        "Custom domains managed inside the platform with DNS and SSL handled automatically",
        "Subdomain preview and one-click publish or unpublish controls for each tenant site",
      ],
    },
    {
      title: "Growth analytics and AI services",
      summary:
        "Move from basic reporting to revenue forecasting, inquiry intelligence, and guest self-service as the business scales.",
      bullets: [
        "Advanced analytics, funnel reporting, and multi-property support on Growth and above",
        "Inquiry auto-tagging and marketing insight recommendations for higher-converting channels",
        "Enterprise AI suite with smart recommendations, guest chatbot, and forecasting",
      ],
    },
  ] satisfies EcosystemModule[],
  domainMarketplace: [
    {
      step: "01",
      title: "Search inside the dashboard",
      tenantAction:
        "The tenant searches for an available domain without leaving ResortCloud.",
      platformAction:
        "ResortCloud checks live availability across TLDs through a registrar API such as Namecheap or GoDaddy.",
    },
    {
      step: "02",
      title: "Purchase and confirm",
      tenantAction:
        "The tenant selects a domain and pays using the card on file.",
      platformAction:
        "The platform charges the tenant, applies the service fee, and registers the domain through the reseller account.",
    },
    {
      step: "03",
      title: "Provision and connect",
      tenantAction:
        "The tenant sees a simple setup status while the site is being connected.",
      platformAction:
        "DNS records, SSL provisioning, and website linking are configured automatically in the background.",
    },
    {
      step: "04",
      title: "Stay live and renewed",
      tenantAction:
        "The tenant manages the live domain from the same ResortCloud workspace.",
      platformAction:
        "ResortCloud monitors expiry, sends reminders, and auto-renews annually based on the active plan.",
    },
  ] satisfies EcosystemFlowStep[],
  aiFeatures: [
    {
      title: "Inquiry Auto-Tagging",
      plan: "Growth + Enterprise",
      description:
        "Classifies incoming leads by source, intent, and urgency so Sales can respond faster.",
    },
    {
      title: "Marketing Insights",
      plan: "Growth + Enterprise",
      description:
        "Highlights the highest-converting acquisition channels and where marketing spend should go next.",
    },
    {
      title: "Smart Booking Recommendations",
      plan: "Enterprise",
      description:
        "Suggests pricing, room packaging, and promotional timing from booking history and seasonality.",
    },
    {
      title: "AI Guest Chatbot",
      plan: "Enterprise",
      description:
        "Answers guest FAQs, checks availability, and routes visitors to the booking widget on the resort website.",
    },
    {
      title: "Revenue Forecasting",
      plan: "Enterprise",
      description:
        "Projects occupancy and revenue for the next 30, 60, and 90 days using historical and pipeline signals.",
    },
  ] satisfies EcosystemFeature[],
  accessRoles: [
    {
      role: "Platform Superadmin",
      phase: "Phase 1",
      responsibility:
        "Tenant provisioning, SaaS billing, domain orders, feature flags, and global support tools.",
    },
    {
      role: "Tenant Owner / Superadmin",
      phase: "Phase 1",
      responsibility:
        "Full tenant access across modules, website builder, billing, domains, KPI, and user management.",
    },
    {
      role: "Sales",
      phase: "Phase 1",
      responsibility:
        "Bookings, reservation follow-up, invoices, availability board, and inquiry assistance.",
    },
    {
      role: "Admin",
      phase: "Phase 1",
      responsibility:
        "Invoice entry, staff account management, cash tracking, and operational notifications.",
    },
    {
      role: "HR",
      phase: "Phase 2",
      responsibility:
        "Attendance, leave approvals, staff records, and recurring HR reports.",
    },
    {
      role: "Accounting and Operations",
      phase: "Phase 2",
      responsibility:
        "Cash flow, reconciliation, petty cash, housekeeping tasks, maintenance updates, and verification.",
    },
  ] satisfies EcosystemRole[],
  roadmap: [
    {
      phase: "01",
      window: "Weeks 1-3",
      title: "Foundation and tenant onboarding",
      deliverables: [
        "Multi-tenant architecture and plan-based feature enforcement",
        "7-day free trial activation with Stripe subscription billing",
        "Role-based authentication, dashboards, and user management",
      ],
    },
    {
      phase: "02",
      window: "Weeks 4-7",
      title: "Booking and sales operations",
      deliverables: [
        "Availability board, booking status flow, and intake forms",
        "Priority automation for hot, warm, and cold inquiries",
        "Invoice generation and sales chat inquiry assist",
      ],
    },
    {
      phase: "03",
      window: "Weeks 8-12",
      title: "Finance, HR, and operations",
      deliverables: [
        "Cash lifecycle tracking, petty cash, and reconciliation",
        "Attendance, leave management, and task-based ops views",
        "Marketing count viewer and analytics dashboard foundations",
      ],
    },
    {
      phase: "04",
      window: "Weeks 13-17",
      title: "Website builder and domains",
      deliverables: [
        "No-code resort site builder with brand controls and asset manager",
        "Subdomain preview and one-click publishing",
        "Integrated domain marketplace with DNS and SSL automation",
      ],
    },
    {
      phase: "05",
      window: "Weeks 18-20",
      title: "Advanced analytics and AI",
      deliverables: [
        "Advanced reporting and multi-property support",
        "AI recommendations, chatbot, and revenue forecasting",
        "Tier-based enforcement for Growth and Enterprise capabilities",
      ],
    },
    {
      phase: "06",
      window: "Weeks 21-24",
      title: "Payments, KPI, and integrations",
      deliverables: [
        "PayMongo payment links, webhook updates, and refund workflow",
        "KPI dashboard, Discord integration, and messaging templates",
        "End-to-end QA, UAT, deployment, and handover documentation",
      ],
    },
  ] satisfies EcosystemRoadmapPhase[],
  pricingSnapshot: [
    "Starter: PHP 1,499/month or PHP 14,990/year",
    "Growth: PHP 2,999/month or PHP 28,990/year",
    "Enterprise: PHP 4,999/month or PHP 47,990/year",
  ],
};

export type EcosystemContent = typeof ecosystemContent;

export const getEcosystemContent = cache(async () => ecosystemContent);
