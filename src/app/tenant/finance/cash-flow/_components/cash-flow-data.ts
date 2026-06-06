export type CashFlowDirection = "INCOME" | "EXPENSE";

export type CashFlowType =
  | "DEPOSIT"
  | "BALANCE"
  | "REFUND"
  | "PETTY_CASH"
  | "BANK_MATCH";

export type CashFlowStatus = "COLLECTED" | "PENDING" | "OVERDUE" | "RECONCILED";

export type CashFlowRow = {
  id: string;
  date: string;
  direction: CashFlowDirection;
  type: CashFlowType;
  guestOrVendor: string;
  reference: string;
  method: string;
  expectedCents: number;
  collectedCents: number;
  status: CashFlowStatus;
  owner: string;
  notes?: string;
};

export const cashFlowRows: CashFlowRow[] = [
  {
    id: "CF-1008",
    date: "2026-06-02",
    direction: "INCOME",
    type: "DEPOSIT",
    guestOrVendor: "Ramos family booking",
    reference: "BK-2026-1842",
    method: "GCash",
    expectedCents: 2850000,
    collectedCents: 2850000,
    status: "COLLECTED",
    owner: "Sales",
  },
  {
    id: "CF-1007",
    date: "2026-06-02",
    direction: "INCOME",
    type: "BALANCE",
    guestOrVendor: "Kaeli Monroe Lim",
    reference: "BK-2026-1838",
    method: "Bank transfer",
    expectedCents: 1845000,
    collectedCents: 0,
    status: "PENDING",
    owner: "Front Office",
  },
  {
    id: "CF-1006",
    date: "2026-06-01",
    direction: "EXPENSE",
    type: "PETTY_CASH",
    guestOrVendor: "Kitchen supplies",
    reference: "PC-2026-044",
    method: "Cash release",
    expectedCents: 650000,
    collectedCents: 650000,
    status: "RECONCILED",
    owner: "Accounting",
  },
  {
    id: "CF-1005",
    date: "2026-06-01",
    direction: "EXPENSE",
    type: "REFUND",
    guestOrVendor: "Lopez cancellation",
    reference: "RF-2026-021",
    method: "Maya",
    expectedCents: 420000,
    collectedCents: 0,
    status: "OVERDUE",
    owner: "Owner approval",
  },
  {
    id: "CF-1004",
    date: "2026-05-31",
    direction: "INCOME",
    type: "BANK_MATCH",
    guestOrVendor: "Weekend batch settlement",
    reference: "BNK-2026-099",
    method: "BPI",
    expectedCents: 5220000,
    collectedCents: 5220000,
    status: "RECONCILED",
    owner: "Accounting",
  },
  {
    id: "CF-1003",
    date: "2026-05-31",
    direction: "INCOME",
    type: "DEPOSIT",
    guestOrVendor: "Corporate retreat",
    reference: "BK-2026-1812",
    method: "Card",
    expectedCents: 7500000,
    collectedCents: 7500000,
    status: "COLLECTED",
    owner: "Sales",
  },
];

export const cashFlowTypeLabels: Record<CashFlowType, string> = {
  DEPOSIT: "Deposit",
  BALANCE: "Balance",
  REFUND: "Refund",
  PETTY_CASH: "Petty cash",
  BANK_MATCH: "Bank match",
};

export const cashFlowStatusLabels: Record<CashFlowStatus, string> = {
  COLLECTED: "Collected",
  PENDING: "Pending",
  OVERDUE: "Overdue",
  RECONCILED: "Reconciled",
};

export function formatCashFlowMoney(cents: number) {
  return `₱${(cents / 100).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
