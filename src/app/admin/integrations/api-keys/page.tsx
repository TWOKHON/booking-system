import { TuroInsightCard } from "../../dashboard/_components/TuroInsightCard";
import { ApiKeysSummary } from "./_components/api-keys-summary";
import { apiKeyRecords } from "./_components/api-keys-data";
import { ApiKeysTable } from "./_components/api-keys-table";

const insights =
  "API access is mostly clean today, but 3 keys are nearing rotation and 1 sandbox credential still has broader scope than the current integration policy allows.";

const Page = () => {
  return (
    <div className="space-y-6">
      <TuroInsightCard message={insights} />
      <ApiKeysSummary data={apiKeyRecords} />
      <ApiKeysTable />
    </div>
  );
};

export default Page;
