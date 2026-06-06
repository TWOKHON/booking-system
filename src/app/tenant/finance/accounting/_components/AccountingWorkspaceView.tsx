"use client";

import { useQuery } from "@tanstack/react-query";
import { TuroInsightCard } from "@/app/admin/dashboard/_components/TuroInsightCard";
import { useTRPC } from "@/trpc/client";
import { AccountingSummaryCards } from "./AccountingSummaryCards";
import { CashFlowSummaryTable } from "./CashFlowSummaryTable";
import type { AccountingSummaryData } from "./accounting-data";

type AccountingWorkspaceViewProps = {
  ownerName: string;
  resortName: string;
};

export function AccountingWorkspaceView({
  ownerName,
  resortName,
}: AccountingWorkspaceViewProps) {
  const trpc = useTRPC();
  const accountingQuery = useQuery(trpc.accounting.summary.queryOptions());
  const summary = accountingQuery.data ?? emptyAccountingSummary;
  const insightMessage = accountingQuery.isLoading
    ? `Loading the latest accounting summary for ${resortName}.`
    : summary.insight;

  return (
    <main className="flex flex-1 flex-col gap-4">
      <TuroInsightCard message={insightMessage} userName={ownerName} />
      <AccountingSummaryCards
        metrics={summary.metrics}
        isLoading={accountingQuery.isLoading}
      />
      <CashFlowSummaryTable
        categoryRows={summary.categoryRows}
        typeRows={summary.typeRows}
        isLoading={accountingQuery.isLoading}
      />
    </main>
  );
}

const emptyAccountingSummary: AccountingSummaryData = {
  periodLabel: "",
  insight: "",
  metrics: [
    {
      label: "Total Revenue",
      valueCents: 0,
      comparison: "Current period",
      trend: 0,
      tone: "green",
    },
    {
      label: "Total Expenses",
      valueCents: 0,
      comparison: "Current period",
      trend: 0,
      tone: "red",
    },
    {
      label: "Net Cash Flow",
      valueCents: 0,
      comparison: "Current period",
      trend: 0,
      tone: "blue",
    },
    {
      label: "Cash Position (Ending Balance)",
      valueCents: 0,
      comparison: "Current period",
      trend: 0,
      tone: "neutral",
    },
  ],
  categoryRows: [],
  typeRows: [],
};
