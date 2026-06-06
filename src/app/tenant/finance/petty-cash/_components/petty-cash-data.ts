export type PettyCashStatus =
  | "REQUESTED"
  | "APPROVED"
  | "RELEASED"
  | "LIQUIDATED"
  | "REJECTED";

export type PettyCashRow = {
  id: string;
  requestedAt: string;
  neededBy: string;
  requester: string;
  department: string;
  category: string;
  purpose: string;
  reference: string;
  amountCents: number;
  releasedCents: number;
  liquidatedCents: number;
  status: PettyCashStatus;
  custodian: string;
  notes: string;
  updatedAt: string;
};

export const pettyCashStatusLabels: Record<PettyCashStatus, string> = {
  REQUESTED: "Requested",
  APPROVED: "Approved",
  RELEASED: "Released",
  LIQUIDATED: "Liquidated",
  REJECTED: "Rejected",
};

export function formatPettyCashMoney(cents: number) {
  return `₱${(cents / 100).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
