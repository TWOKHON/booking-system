import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Bot,
  Building2,
  FileCheck2,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";

export type PolicyCategory =
  | "all"
  | "general"
  | "tenant"
  | "security"
  | "ai"
  | "billing";

export type PolicyMetric = {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
};

export type PolicyRecord = {
  id: string;
  name: string;
  category: Exclude<PolicyCategory, "all">;
  owner: string;
  scope: string;
  status: "Active" | "Review" | "Draft";
  updated: string;
  note: string;
};

export type PolicyReviewItem = {
  title: string;
  meta: string;
  status: string;
};

export const policyMetrics: PolicyMetric[] = [
  {
    title: "Active policies",
    value: "18",
    change: "3 updated this quarter",
    icon: FileCheck2,
  },
  {
    title: "Security controls",
    value: "6",
    change: "1 awaiting approval",
    icon: ShieldCheck,
  },
  {
    title: "Tenant rulesets",
    value: "5",
    change: "All core tenants covered",
    icon: Building2,
  },
  {
    title: "AI governance",
    value: "Ready",
    change: "Prompt and usage policy live",
    icon: Bot,
  },
];

export const policyCategories: {
  value: PolicyCategory;
  label: string;
  icon: LucideIcon;
}[] = [
  { value: "all", label: "All policies", icon: SlidersHorizontal },
  { value: "general", label: "General policy", icon: BadgeCheck },
  { value: "tenant", label: "Tenant policy", icon: Building2 },
  { value: "security", label: "Security", icon: ShieldCheck },
  { value: "ai", label: "AI policy", icon: Bot },
  { value: "billing", label: "Billing", icon: FileCheck2 },
];

export const policyRecords: PolicyRecord[] = [
  {
    id: "POL-101",
    name: "Platform Operations Baseline",
    category: "general",
    owner: "Admin Operations",
    scope: "Platform-wide",
    status: "Active",
    updated: "May 2, 2026",
    note: "Defines default workflow expectations, escalation paths, and admin operating coverage.",
  },
  {
    id: "POL-102",
    name: "Resort Content and Branding Standard",
    category: "general",
    owner: "Brand Governance",
    scope: "Guest-facing surfaces",
    status: "Review",
    updated: "Apr 29, 2026",
    note: "Covers content quality, upload approvals, and consistency across booking surfaces.",
  },
  {
    id: "POL-201",
    name: "Tenant Workspace Provisioning Policy",
    category: "tenant",
    owner: "Tenant Success",
    scope: "All tenant accounts",
    status: "Active",
    updated: "May 1, 2026",
    note: "Controls workspace setup, initial role assignment, and onboarding obligations for new tenants.",
  },
  {
    id: "POL-202",
    name: "Temporary Tenant Override Policy",
    category: "tenant",
    owner: "Platform Governance",
    scope: "Exception-based",
    status: "Draft",
    updated: "Apr 27, 2026",
    note: "Documents how temporary resort-level exceptions are requested, time-boxed, and logged.",
  },
  {
    id: "POL-301",
    name: "Privileged Access and MFA Requirement",
    category: "security",
    owner: "Security Office",
    scope: "Elevated roles",
    status: "Active",
    updated: "May 4, 2026",
    note: "Requires MFA, approval checkpoints, and periodic review for billing and audit-capable roles.",
  },
  {
    id: "POL-302",
    name: "Audit Log Retention Policy",
    category: "security",
    owner: "Security Office",
    scope: "Platform-wide",
    status: "Active",
    updated: "Apr 30, 2026",
    note: "Specifies retention windows, access boundaries, and export handling for audit records.",
  },
  {
    id: "POL-401",
    name: "AI Assistant Usage Policy",
    category: "ai",
    owner: "AI Governance",
    scope: "Support and operations teams",
    status: "Active",
    updated: "May 3, 2026",
    note: "Defines permitted AI assistance, human review boundaries, and prohibited automation shortcuts.",
  },
  {
    id: "POL-402",
    name: "Prompt and Guest Data Handling",
    category: "ai",
    owner: "AI Governance",
    scope: "AI-enabled workflows",
    status: "Review",
    updated: "Apr 26, 2026",
    note: "Covers redaction expectations, prompt hygiene, and safe handling of guest-sensitive data.",
  },
  {
    id: "POL-501",
    name: "Payout Release Approval Policy",
    category: "billing",
    owner: "Finance Control",
    scope: "Finance workflows",
    status: "Active",
    updated: "May 1, 2026",
    note: "Establishes required approvals, reconciliation checks, and release conditions for tenant payouts.",
  },
  {
    id: "POL-502",
    name: "Invoice Exception and Write-off Policy",
    category: "billing",
    owner: "Finance Control",
    scope: "Billing exceptions",
    status: "Draft",
    updated: "Apr 24, 2026",
    note: "Defines the review path for disputed invoices, manual adjustments, and approved write-offs.",
  },
];

export const policyReviewQueue: PolicyReviewItem[] = [
  {
    title: "2 draft policies still need executive approval",
    meta: "Temporary tenant overrides and invoice exception handling are waiting for final sign-off.",
    status: "Needs review",
  },
  {
    title: "AI guest-data handling policy is under revision",
    meta: "Prompt redaction and review language should be aligned before wider rollout.",
    status: "In progress",
  },
  {
    title: "Quarterly policy export due next week",
    meta: "Prepare category tables, owner changes, and revision notes for the governance archive.",
    status: "Scheduled",
  },
];

export const policyGuidance = [
  {
    title: "Keep ownership explicit",
    detail:
      "Every policy should have one clear operational owner so revisions, escalations, and approvals do not drift.",
  },
  {
    title: "Review high-risk categories first",
    detail:
      "Security, AI, and billing policies should move through the strictest approval path before general rollout.",
  },
  {
    title: "Avoid hidden tenant exceptions",
    detail:
      "Local overrides can be allowed, but they should remain visible in the central policy archive and review queue.",
  },
];
