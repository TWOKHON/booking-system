import {
  Baby,
  BellRing,
  Car,
  ConciergeBell,
  Sparkles,
  Utensils,
  Wifi,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type GuestRequestStatus =
  | "New"
  | "Acknowledged"
  | "In Progress"
  | "Completed"
  | "Escalated";

export type GuestRequestPriority = "Low" | "Medium" | "High" | "Urgent";

export type GuestRequestType =
  | "Amenity"
  | "Dining"
  | "Transport"
  | "Housekeeping"
  | "Maintenance"
  | "Concierge"
  | "Connectivity";

export type GuestRequest = {
  id: string;
  roomId: string | null;
  requestNumber: string;
  guestName: string;
  room: string;
  type: GuestRequestType;
  title: string;
  detail: string;
  priority: GuestRequestPriority;
  status: GuestRequestStatus;
  assignedTo: string;
  initials: string;
  requestedAt: string;
  dueBy: string;
  waitMinutes: number;
  revenueTag: string;
};

export const requestStatuses: GuestRequestStatus[] = [
  "New",
  "Acknowledged",
  "In Progress",
  "Completed",
  "Escalated",
];

export const requestPriorities: GuestRequestPriority[] = [
  "Low",
  "Medium",
  "High",
  "Urgent",
];

export const requestTypes: GuestRequestType[] = [
  "Amenity",
  "Dining",
  "Transport",
  "Housekeeping",
  "Maintenance",
  "Concierge",
  "Connectivity",
];

export const requestTypeMeta: Record<
  GuestRequestType,
  { icon: LucideIcon; badge: string }
> = {
  Amenity: { icon: Baby, badge: "bg-blue-50 text-blue-700" },
  Dining: { icon: Utensils, badge: "bg-amber-50 text-amber-700" },
  Transport: { icon: Car, badge: "bg-violet-50 text-violet-700" },
  Housekeeping: { icon: Sparkles, badge: "bg-green-50 text-green-700" },
  Maintenance: { icon: BellRing, badge: "bg-red-50 text-red-700" },
  Concierge: { icon: ConciergeBell, badge: "bg-zinc-100 text-zinc-700" },
  Connectivity: { icon: Wifi, badge: "bg-cyan-50 text-cyan-700" },
};
