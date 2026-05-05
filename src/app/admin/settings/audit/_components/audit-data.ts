import type { LucideIcon } from "lucide-react";
import {
  Clock3,
  MapPinned,
  ShieldCheck,
  UserRoundCog,
} from "lucide-react";

export type AuditMetric = {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
};

export type AuditLogRecord = {
  id: string;
  actor: string;
  role: string;
  action: string;
  area: string;
  ipAddress: string;
  timestamp: string;
  status: "Recorded" | "Flagged" | "Review";
};

export const auditMetrics: AuditMetric[] = [
  {
    title: "Logged events today",
    value: "248",
    change: "18 elevated actions tracked",
    icon: Clock3,
  },
  {
    title: "Unique IP addresses",
    value: "31",
    change: "2 new locations since yesterday",
    icon: MapPinned,
  },
  {
    title: "Security-sensitive events",
    value: "12",
    change: "1 access escalation flagged",
    icon: ShieldCheck,
  },
  {
    title: "Admin actors active",
    value: "14",
    change: "Full coverage across core teams",
    icon: UserRoundCog,
  },
];

export const auditLogRecords: AuditLogRecord[] = [
  {
    id: "AUD-9101",
    actor: "Kyle Andre",
    role: "Platform Owner",
    action: "Updated platform branding preset",
    area: "Branding settings",
    ipAddress: "136.158.24.18",
    timestamp: "May 5, 2026 · 10:42 AM",
    status: "Recorded",
  },
  {
    id: "AUD-9102",
    actor: "Andrea Ramos",
    role: "Operations Lead",
    action: "Requested expanded maintenance role access",
    area: "Roles and access",
    ipAddress: "136.158.24.31",
    timestamp: "May 5, 2026 · 10:08 AM",
    status: "Review",
  },
  {
    id: "AUD-9103",
    actor: "Miguel Santos",
    role: "Finance Manager",
    action: "Approved tenant payout batch release",
    area: "Billing controls",
    ipAddress: "122.54.18.77",
    timestamp: "May 5, 2026 · 9:54 AM",
    status: "Recorded",
  },
  {
    id: "AUD-9104",
    actor: "Trisha Lim",
    role: "Support Agent",
    action: "Viewed guest messaging export log",
    area: "Communications",
    ipAddress: "122.54.18.90",
    timestamp: "May 5, 2026 · 9:31 AM",
    status: "Recorded",
  },
  {
    id: "AUD-9105",
    actor: "System Guard",
    role: "Security Monitor",
    action: "Flagged unusual login pattern on elevated account",
    area: "Authentication",
    ipAddress: "185.220.101.14",
    timestamp: "May 5, 2026 · 8:58 AM",
    status: "Flagged",
  },
  {
    id: "AUD-9106",
    actor: "Bianca Cruz",
    role: "Tenant Success",
    action: "Published revised tenant onboarding policy",
    area: "Policies archive",
    ipAddress: "103.75.88.23",
    timestamp: "May 5, 2026 · 8:41 AM",
    status: "Recorded",
  },
  {
    id: "AUD-9107",
    actor: "Rafael Ong",
    role: "API Administrator",
    action: "Rotated production OTA credential",
    area: "API keys",
    ipAddress: "45.64.12.201",
    timestamp: "May 5, 2026 · 8:17 AM",
    status: "Recorded",
  },
  {
    id: "AUD-9108",
    actor: "System Guard",
    role: "Security Monitor",
    action: "Queued MFA reminder for four elevated users",
    area: "Authentication",
    ipAddress: "10.20.14.5",
    timestamp: "May 5, 2026 · 7:55 AM",
    status: "Review",
  },
];
