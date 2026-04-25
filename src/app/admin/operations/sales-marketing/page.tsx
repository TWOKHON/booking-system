import { TuroInsightCard } from "../../dashboard/_components/TuroInsightCard";
import { salesRecords } from "./_components/sales-data";
import { SalesSummary } from "./_components/sales-summary";
import { SalesTable } from "./_components/sales-table";

const insights =
  "Sales and marketing activity is active today, but 3 high-value leads still need proposal follow-up and 2 campaign-driven inquiries could slip if approvals are not cleared this afternoon.";

const Page = () => {
  return (
    <div className="space-y-6">
      <TuroInsightCard message={insights} />

      <SalesSummary data={salesRecords} />
      <SalesTable />
    </div>
  );
};

export default Page;
