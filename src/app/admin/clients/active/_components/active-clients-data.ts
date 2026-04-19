import { tenantClients } from "../../_components/tenant-clients-data";

export type ActiveClient = {
  id: string;
  tenantName: string;
  ownerName: string;
  ownerEmail: string;
  plan: "Starter" | "Growth" | "Enterprise";
  subscriptionStatus: "Healthy" | "At Risk";
  billingCycle: "Monthly" | "Annual";
  properties: number;
  activeStaff: number;
  monthlyRevenue: number;
  renewalDate: string;
  supportTier: "Standard" | "Priority" | "Dedicated";
  paymentHealth: "Paid" | "Review";
  lastActivity: string;
  priority: boolean;
};

const renewalDates: Record<string, string> = {
  "TEN-1001": "Apr 28, 2026",
  "TEN-1002": "Apr 24, 2026",
  "TEN-1003": "May 15, 2026",
  "TEN-1004": "Apr 22, 2026",
  "TEN-1005": "Apr 30, 2026",
  "TEN-1007": "May 6, 2026",
  "TEN-1008": "Apr 27, 2026",
  "TEN-1011": "May 2, 2026",
  "TEN-1012": "Apr 25, 2026",
};

const billingCycles: Record<string, "Monthly" | "Annual"> = {
  "TEN-1001": "Monthly",
  "TEN-1002": "Monthly",
  "TEN-1003": "Annual",
  "TEN-1004": "Monthly",
  "TEN-1005": "Monthly",
  "TEN-1007": "Monthly",
  "TEN-1008": "Annual",
  "TEN-1011": "Monthly",
  "TEN-1012": "Monthly",
};

const supportTiers: Record<string, "Standard" | "Priority" | "Dedicated"> = {
  "TEN-1001": "Dedicated",
  "TEN-1002": "Priority",
  "TEN-1003": "Priority",
  "TEN-1004": "Standard",
  "TEN-1005": "Priority",
  "TEN-1007": "Standard",
  "TEN-1008": "Dedicated",
  "TEN-1011": "Priority",
  "TEN-1012": "Dedicated",
};

const paymentHealth: Record<string, "Paid" | "Review"> = {
  "TEN-1001": "Paid",
  "TEN-1002": "Paid",
  "TEN-1003": "Paid",
  "TEN-1004": "Review",
  "TEN-1005": "Paid",
  "TEN-1007": "Paid",
  "TEN-1008": "Paid",
  "TEN-1011": "Paid",
  "TEN-1012": "Review",
};

export const activeClients: ActiveClient[] = tenantClients
  .filter(
    (client) => client.plan !== "Trial" && client.status !== "Suspended"
  )
  .map((client) => ({
    id: client.id,
    tenantName: client.tenantName,
    ownerName: client.ownerName,
    ownerEmail: client.ownerEmail,
    plan: client.plan as ActiveClient["plan"],
    subscriptionStatus: client.status === "At Risk" ? "At Risk" : "Healthy",
    billingCycle: billingCycles[client.id],
    properties: client.properties,
    activeStaff: client.activeStaff,
    monthlyRevenue: client.monthlyRevenue,
    renewalDate: renewalDates[client.id],
    supportTier: supportTiers[client.id],
    paymentHealth: paymentHealth[client.id],
    lastActivity: client.lastActivity,
    priority: client.priority,
  }));
