import type { LucideIcon } from "lucide-react";
import {
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

export type RolesMetric = {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
};

export type RoleTemplate = {
  name: string;
  audience: string;
  seatCount: string;
  coverage: number;
  summary: string;
  permissions: string[];
  tone: string;
};

export type PermissionGroup = {
  label: string;
  permissions: {
    name: string;
    ownerAdmin: boolean;
    operationsLead: boolean;
    financeManager: boolean;
    supportAgent: boolean;
  }[];
};

export type AccessAssignment = {
  name: string;
  role: string;
  scope: string;
  status: string;
  initials: string;
  note: string;
};

export type ReviewItem = {
  title: string;
  meta: string;
  status: string;
};

export const rolesMetrics: RolesMetric[] = [
  {
    title: "Active role templates",
    value: "6",
    change: "2 updated this month",
    icon: UsersRound,
  },
  {
    title: "Privileged accounts",
    value: "14",
    change: "3 require scope review",
    icon: KeyRound,
  },
  {
    title: "MFA coverage",
    value: "92%",
    change: "4 users still pending",
    icon: ShieldCheck,
  },
  {
    title: "Approval controls",
    value: "Enabled",
    change: "Role edits need admin sign-off",
    icon: LockKeyhole,
  },
];

export const roleTemplates: RoleTemplate[] = [
  {
    name: "Platform Owner",
    audience: "Executive / Super Admin",
    seatCount: "3 seats",
    coverage: 100,
    summary:
      "Full platform visibility across tenants, billing, integrations, audit history, and system settings.",
    permissions: ["Tenant management", "Billing controls", "Audit access"],
    tone:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
  },
  {
    name: "Operations Lead",
    audience: "Resort Operations",
    seatCount: "9 seats",
    coverage: 82,
    summary:
      "Operational control across front desk, housekeeping, maintenance, and scheduling without billing ownership.",
    permissions: ["Room readiness", "Staff coordination", "Workflow triggers"],
    tone:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300",
  },
  {
    name: "Finance Manager",
    audience: "Accounting / Collections",
    seatCount: "5 seats",
    coverage: 76,
    summary:
      "Focused access to payouts, invoices, subscription health, and collection workflows across assigned tenants.",
    permissions: ["Invoice review", "Payout release", "Payment health"],
    tone:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300",
  },
  {
    name: "Support Agent",
    audience: "Tenant Success / Support",
    seatCount: "11 seats",
    coverage: 64,
    summary:
      "Message, review, and troubleshooting access with audit visibility kept read-only for escalations.",
    permissions: ["Guest messaging", "Notification review", "Read-only logs"],
    tone:
      "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-300",
  },
];

export const permissionGroups: PermissionGroup[] = [
  {
    label: "Core platform",
    permissions: [
      {
        name: "Manage tenant accounts",
        ownerAdmin: true,
        operationsLead: false,
        financeManager: false,
        supportAgent: false,
      },
      {
        name: "Edit system settings",
        ownerAdmin: true,
        operationsLead: false,
        financeManager: false,
        supportAgent: false,
      },
      {
        name: "View audit history",
        ownerAdmin: true,
        operationsLead: true,
        financeManager: true,
        supportAgent: true,
      },
    ],
  },
  {
    label: "Operations and bookings",
    permissions: [
      {
        name: "Manage room readiness",
        ownerAdmin: true,
        operationsLead: true,
        financeManager: false,
        supportAgent: false,
      },
      {
        name: "Approve schedule changes",
        ownerAdmin: true,
        operationsLead: true,
        financeManager: false,
        supportAgent: false,
      },
      {
        name: "Review guest communications",
        ownerAdmin: true,
        operationsLead: true,
        financeManager: false,
        supportAgent: true,
      },
    ],
  },
  {
    label: "Billing and finance",
    permissions: [
      {
        name: "Release tenant payouts",
        ownerAdmin: true,
        operationsLead: false,
        financeManager: true,
        supportAgent: false,
      },
      {
        name: "Manage invoices",
        ownerAdmin: true,
        operationsLead: false,
        financeManager: true,
        supportAgent: false,
      },
      {
        name: "View payment exceptions",
        ownerAdmin: true,
        operationsLead: false,
        financeManager: true,
        supportAgent: true,
      },
    ],
  },
];

export const accessAssignments: AccessAssignment[] = [
  {
    name: "Kyle Andre",
    role: "Platform Owner",
    scope: "All tenants",
    status: "Healthy",
    initials: "KA",
    note: "Most recent approval for system branding and integration policy.",
  },
  {
    name: "Andrea Ramos",
    role: "Operations Lead",
    scope: "Batangas cluster",
    status: "Review",
    initials: "AR",
    note: "Access expansion request includes maintenance escalation workflows.",
  },
  {
    name: "Miguel Santos",
    role: "Finance Manager",
    scope: "Enterprise tenants",
    status: "Healthy",
    initials: "MS",
    note: "Payout and invoice approvals are aligned to current finance policy.",
  },
  {
    name: "Trisha Lim",
    role: "Support Agent",
    scope: "Messaging and reviews",
    status: "Watch",
    initials: "TL",
    note: "Needs MFA completion before broader communications access is restored.",
  },
];

export const reviewQueue: ReviewItem[] = [
  {
    title: "3 privileged accounts need scope review",
    meta: "Two legacy admins still retain billing controls beyond current role policy.",
    status: "Needs review",
  },
  {
    title: "4 users still pending MFA completion",
    meta: "Support and finance access should stay limited until second factor is enabled.",
    status: "Follow-up",
  },
  {
    title: "Next quarterly access audit in 9 days",
    meta: "Prepare role export, approval notes, and tenant exception history before review.",
    status: "Scheduled",
  },
];

export const governanceNotes = [
  {
    title: "Least-privilege by default",
    detail:
      "New role templates should open with the smallest practical access footprint, then expand only when ownership is explicit.",
  },
  {
    title: "Approval checkpoints",
    detail:
      "Role changes affecting billing, audit history, or tenant management should require a second admin approval before publishing.",
  },
  {
    title: "Tenant-safe overrides",
    detail:
      "Local exceptions can exist for resort operations, but they should remain visible in the central review log.",
  },
];
