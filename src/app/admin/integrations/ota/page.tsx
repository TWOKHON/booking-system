import { TuroInsightCard } from "../../dashboard/_components/TuroInsightCard";
import { OtaSummary } from "./_components/ota-summary";
import { otaIntegrationRecords } from "./_components/ota-data";
import { OtaTable } from "./_components/ota-table";

const insights =
  "OTA connectivity is stable today, but 2 channel mappings still need review and 1 resort sync is delayed on inventory push after the last update window.";

const Page = () => {
  return (
    <div className="space-y-6">
      <TuroInsightCard message={insights} />
      <OtaSummary data={otaIntegrationRecords} />
      <OtaTable />
    </div>
  );
};

export default Page;
