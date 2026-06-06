import {
  Bath,
  Bolt,
  BriefcaseBusiness,
  Droplets,
  MonitorCog,
  Snowflake,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type MaintenanceStatus =
  | "Draft"
  | "Open"
  | "In Progress"
  | "Completed"
  | "Overdue";

export type MaintenancePriority = "Low" | "Medium" | "High";

export type MaintenanceType =
  | "Plumbing"
  | "Electrical"
  | "HVAC"
  | "Equipment"
  | "General"
  | "IT / Network";

export type MaintenanceRequest = {
  id: string;
  requestNumber: string;
  reportedAt: string;
  roomArea: string;
  type: MaintenanceType;
  title: string;
  description: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  assignee: string;
  initials: string;
  dueDate: string;
  propertyArea: string;
  location: string;
  category: string;
  asset: string;
  reportedBy: string;
  contactNumber: string;
  preferredDate: string;
  preferredTime: string;
  urgent: boolean;
};

export const maintenanceTypes: MaintenanceType[] = [
  "Plumbing",
  "Electrical",
  "HVAC",
  "Equipment",
  "General",
  "IT / Network",
];

export const maintenanceStatuses: MaintenanceStatus[] = [
  "Draft",
  "Open",
  "In Progress",
  "Completed",
  "Overdue",
];

export const maintenancePriorities: MaintenancePriority[] = [
  "Low",
  "Medium",
  "High",
];

export const maintenanceAssignees = [
  "Juan Dela Cruz",
  "Pedro Garcia",
  "Ana Reyes",
  "Maria Santos",
];

export const maintenanceTypeMeta: Record<
  MaintenanceType,
  { icon: LucideIcon; color: string; badge: string }
> = {
  Plumbing: {
    icon: Bath,
    color: "#2563eb",
    badge: "bg-blue-50 text-blue-700",
  },
  Electrical: {
    icon: Bolt,
    color: "#f59e0b",
    badge: "bg-amber-50 text-amber-700",
  },
  HVAC: {
    icon: Snowflake,
    color: "#0284c7",
    badge: "bg-sky-50 text-sky-700",
  },
  Equipment: {
    icon: BriefcaseBusiness,
    color: "#7c3aed",
    badge: "bg-violet-50 text-violet-700",
  },
  General: {
    icon: Droplets,
    color: "#71717a",
    badge: "bg-zinc-100 text-zinc-700",
  },
  "IT / Network": {
    icon: MonitorCog,
    color: "#64748b",
    badge: "bg-slate-100 text-slate-700",
  },
};

export const preventiveItems = [
  {
    title: "AC Filter Replacement",
    meta: "Jun 3, 2026 - 6 assets",
  },
  {
    title: "Fire Extinguisher Inspection",
    meta: "Jun 5, 2026 - 12 assets",
  },
  {
    title: "Generator Test Run",
    meta: "Jun 10, 2026 - 1 asset",
  },
  {
    title: "Water Tank Cleaning",
    meta: "Jun 12, 2026 - 2 assets",
  },
];

export const maintenanceAlerts = [
  { label: "Overdue requests", value: 4, tone: "bg-red-500" },
  { label: "High priority open", value: 3, tone: "bg-orange-500" },
  { label: "Preventive due soon", value: 2, tone: "bg-blue-500" },
  { label: "Asset offline", value: 1, tone: "bg-zinc-400" },
];
