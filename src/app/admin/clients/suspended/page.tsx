import { TuroInsightCard } from "../../dashboard/_components/TuroInsightCard";
import { SuspendedClientsSummary } from "./_components/suspended-clients-summary";
import { suspendedClients } from "./_components/suspended-clients-data";
import { SuspendedClientsTable } from "./_components/suspended-clients-table";

const insights =
  "Suspended accounts are limited today, but 2 cases still carry unpaid balances and 1 policy review remains escalated for admin action.";

const Page = () => {
  return (
    <div className="space-y-6">
      <TuroInsightCard message={insights} />

      <SuspendedClientsSummary data={suspendedClients} />
      <SuspendedClientsTable />
    </div>
  );
};

export default Page;
