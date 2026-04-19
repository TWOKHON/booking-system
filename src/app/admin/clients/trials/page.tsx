import { TuroInsightCard } from "../../dashboard/_components/TuroInsightCard";
import { TrialClientsSummary } from "./_components/trial-clients-summary";
import { trialClients } from "./_components/trial-clients-data";
import { TrialClientsTable } from "./_components/trial-clients-table";

const insights =
  "Trial activity is steady today, but 2 workspaces are nearing expiry and 1 account still has not reached the payments setup stage.";

const Page = () => {
  return (
    <div className="space-y-6">
      <TuroInsightCard message={insights} />

      <TrialClientsSummary data={trialClients} />
      <TrialClientsTable />
    </div>
  );
};

export default Page;
