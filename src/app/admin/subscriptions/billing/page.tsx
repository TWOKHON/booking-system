import { TuroInsightCard } from "../../dashboard/_components/TuroInsightCard";
import { BillingSummary } from "./_components/billing-summary";
import { billingRecords } from "./_components/billing-data";
import { BillingTable } from "./_components/billing-table";

const insights =
  "Billing is mostly on track today, but 5 tenant invoices are still open past their due window and 2 annual renewals need review before the next billing cycle locks.";

const Page = () => {
  return (
    <div className="space-y-6">
      <TuroInsightCard message={insights} />
      <BillingSummary data={billingRecords} />
      <BillingTable />
    </div>
  );
};

export default Page;
