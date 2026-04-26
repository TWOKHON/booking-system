import { TuroInsightCard } from "../../dashboard/_components/TuroInsightCard";
import { invoiceRecords } from "./_components/invoices-data";
import { InvoicesSummary } from "./_components/invoices-summary";
import { InvoicesTable } from "./_components/invoices-table";

const insights =
  "Invoices are flowing as expected today, but 4 automatic subscription billings still need follow-up and 3 manual add-on charges are waiting to be issued to tenant accounts.";

const Page = () => {
  return (
    <div className="space-y-6">
      <TuroInsightCard message={insights} />
      <InvoicesSummary data={invoiceRecords} />
      <InvoicesTable />
    </div>
  );
};

export default Page;
