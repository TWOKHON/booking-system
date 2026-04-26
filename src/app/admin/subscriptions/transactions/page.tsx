import { TuroInsightCard } from "../../dashboard/_components/TuroInsightCard";
import { TransactionsSummary } from "./_components/transactions-summary";
import { transactionRecords } from "./_components/transactions-data";
import { TransactionsTable } from "./_components/transactions-table";

const insights =
  "Transaction activity is steady today, but 3 billing retries are still unresolved and 2 refund-related movements need confirmation before the ledger can fully close.";

const Page = () => {
  return (
    <div className="space-y-6">
      <TuroInsightCard message={insights} />
      <TransactionsSummary data={transactionRecords} />
      <TransactionsTable />
    </div>
  );
};

export default Page;
