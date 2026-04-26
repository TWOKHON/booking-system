import { TuroInsightCard } from "../../dashboard/_components/TuroInsightCard";
import { paymentIntegrationRecords } from "./_components/payments-data";
import { PaymentsSummary } from "./_components/payments-summary";
import { PaymentsTable } from "./_components/payments-table";

const insights =
  "Payment integrations are healthy overall, but 2 providers still need webhook review and 1 e-wallet channel is showing delayed settlement confirmation across tenant transactions.";

const Page = () => {
  return (
    <div className="space-y-6">
      <TuroInsightCard message={insights} />
      <PaymentsSummary data={paymentIntegrationRecords} />
      <PaymentsTable />
    </div>
  );
};

export default Page;
