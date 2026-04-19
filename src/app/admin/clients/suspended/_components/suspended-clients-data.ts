import { tenantClients } from "../../_components/tenant-clients-data";

export type SuspendedClient = {
  id: string;
  tenantName: string;
  ownerName: string;
  ownerEmail: string;
  previousPlan: "Starter" | "Growth" | "Enterprise";
  suspensionReason:
    | "Failed Billing"
    | "Policy Review"
    | "Owner Request"
    | "Inactive Account";
  suspendedSince: string;
  balanceDue: number;
  properties: number;
  activeStaff: number;
  reviewStatus: "Pending Review" | "Resolved" | "Escalated";
  lastActivity: string;
  priority: boolean;
};

const baseSuspended = tenantClients.filter(
  (client) => client.status === "Suspended"
);

export const suspendedClients: SuspendedClient[] = [
  ...baseSuspended.map((client) => ({
    id: client.id,
    tenantName: client.tenantName,
    ownerName: client.ownerName,
    ownerEmail: client.ownerEmail,
    previousPlan: "Starter" as const,
    suspensionReason: "Failed Billing" as const,
    suspendedSince: "Apr 10, 2026",
    balanceDue: 6500,
    properties: client.properties,
    activeStaff: client.activeStaff,
    reviewStatus: "Pending Review" as const,
    lastActivity: client.lastActivity,
    priority: false,
  })),
  {
    id: "TEN-1013",
    tenantName: "Seacliff Garden Resort",
    ownerName: "Rafael Dominguez",
    ownerEmail: "rafael@seacliff.ph",
    previousPlan: "Growth",
    suspensionReason: "Policy Review",
    suspendedSince: "Apr 8, 2026",
    balanceDue: 18000,
    properties: 2,
    activeStaff: 3,
    reviewStatus: "Escalated",
    lastActivity: "6 days ago",
    priority: true,
  },
  {
    id: "TEN-1014",
    tenantName: "Crestline Bay Villas",
    ownerName: "Sheila Navarro",
    ownerEmail: "sheila@crestline.ph",
    previousPlan: "Enterprise",
    suspensionReason: "Owner Request",
    suspendedSince: "Apr 2, 2026",
    balanceDue: 0,
    properties: 3,
    activeStaff: 0,
    reviewStatus: "Resolved",
    lastActivity: "12 days ago",
    priority: false,
  },
  {
    id: "TEN-1015",
    tenantName: "Northshore Escape",
    ownerName: "Daniel Flores",
    ownerEmail: "daniel@northshore.ph",
    previousPlan: "Starter",
    suspensionReason: "Inactive Account",
    suspendedSince: "Apr 11, 2026",
    balanceDue: 9000,
    properties: 1,
    activeStaff: 1,
    reviewStatus: "Pending Review",
    lastActivity: "4 days ago",
    priority: true,
  },
];
