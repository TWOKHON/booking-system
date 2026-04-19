import { tenantClients } from "../../_components/tenant-clients-data";

export type TrialClient = {
  id: string;
  tenantName: string;
  ownerName: string;
  ownerEmail: string;
  properties: number;
  activeStaff: number;
  location: string;
  trialStart: string;
  trialEnds: string;
  daysRemaining: number;
  onboardingStep: "Setup" | "Rooms" | "Payments" | "Launch Ready";
  usageLevel: "High" | "Moderate" | "Low";
  lastActivity: string;
  priority: boolean;
};

const trialMeta: Record<
  string,
  Pick<
    TrialClient,
    "trialStart" | "trialEnds" | "daysRemaining" | "onboardingStep" | "usageLevel"
  >
> = {
  "TEN-1006": {
    trialStart: "Apr 15, 2026",
    trialEnds: "Apr 22, 2026",
    daysRemaining: 3,
    onboardingStep: "Payments",
    usageLevel: "Moderate",
  },
  "TEN-1009": {
    trialStart: "Apr 14, 2026",
    trialEnds: "Apr 21, 2026",
    daysRemaining: 2,
    onboardingStep: "Rooms",
    usageLevel: "Low",
  },
};

export const trialClients: TrialClient[] = tenantClients
  .filter((client) => client.plan === "Trial" || client.status === "Trial")
  .map((client) => ({
    id: client.id,
    tenantName: client.tenantName,
    ownerName: client.ownerName,
    ownerEmail: client.ownerEmail,
    properties: client.properties,
    activeStaff: client.activeStaff,
    location: client.location,
    trialStart: trialMeta[client.id].trialStart,
    trialEnds: trialMeta[client.id].trialEnds,
    daysRemaining: trialMeta[client.id].daysRemaining,
    onboardingStep: trialMeta[client.id].onboardingStep,
    usageLevel: trialMeta[client.id].usageLevel,
    lastActivity: client.lastActivity,
    priority: client.priority,
  }));
