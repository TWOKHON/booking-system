import { TuroInsightCard } from "../../dashboard/_components/TuroInsightCard";
import { ActiveClientsSummary } from "./_components/active-clients-summary";
import { activeClients } from "./_components/active-clients-data";
import { ActiveClientsTable } from "./_components/active-clients-table";

const insights =
  "Paid accounts are stable today, but 2 subscriptions need billing review and 3 renewals are approaching within the next cycle.";

const Page = () => {
  return (
    <div className="space-y-6">
      <TuroInsightCard message={insights} />

      <ActiveClientsSummary data={activeClients} />
      <ActiveClientsTable />
    </div>
  );
};

export default Page;
