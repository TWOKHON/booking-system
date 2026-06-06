export type AccountingSummaryMetric = {
  label: string;
  valueCents: number;
  comparison: string;
  trend: number;
  tone: "green" | "red" | "blue" | "neutral";
};

export type CashFlowSummaryRow = {
  id: string;
  label: string;
  inflowCents: number;
  outflowCents: number;
  netCents: number;
  percentOfTotal: string;
  group: "revenue" | "expense" | "net";
  icon: "building" | "service" | "tag" | "receipt" | "users" | "basket" | "more";
};

export type AccountingSummaryData = {
  periodLabel: string;
  metrics: AccountingSummaryMetric[];
  categoryRows: CashFlowSummaryRow[];
  typeRows: CashFlowSummaryRow[];
  insight: string;
};

export function formatAccountingMoney(cents: number) {
  const sign = cents < 0 ? "-" : "";
  const amount = Math.abs(cents) / 100;

  return `${sign}${new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    currencyDisplay: "symbol",
  }).format(amount)}`;
}

export function formatAccountingTableMoney(cents: number) {
  if (cents === 0) {
    return "-";
  }

  const formatted = formatAccountingMoney(Math.abs(cents));

  return cents < 0 ? `(${formatted})` : formatted;
}
