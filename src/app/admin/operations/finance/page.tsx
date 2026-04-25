import { TuroInsightCard } from "../../dashboard/_components/TuroInsightCard";
import { financeRecords } from "./_components/finance-data";
import { FinanceSummary } from "./_components/finance-summary";
import { FinanceTable } from "./_components/finance-table";

const insights =
  "Finance operations are moving today, but 3 resort ledgers still carry payout or reconciliation holds and 2 high-balance guest accounts need collection follow-up before close.";

const Page = () => {
  return (
    <div className="space-y-6">
      <TuroInsightCard message={insights} />

      <FinanceSummary data={financeRecords} />
      <FinanceTable />
    </div>
  );
};

export default Page;
