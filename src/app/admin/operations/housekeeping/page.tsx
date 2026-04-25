import { TuroInsightCard } from "../../dashboard/_components/TuroInsightCard";
import { HousekeepingSummary } from "./_components/housekeeping-summary";
import { housekeepingRecords } from "./_components/housekeeping-data";
import { HousekeepingTable } from "./_components/housekeeping-table";

const insights =
  "Housekeeping flow is moving, but 4 rooms are still waiting on cleaning or inspection and 2 blocked tasks could delay same-day arrivals if maintenance handoff slips.";

const Page = () => {
  return (
    <div className="space-y-6">
      <TuroInsightCard message={insights} />

      <HousekeepingSummary data={housekeepingRecords} />
      <HousekeepingTable />
    </div>
  );
};

export default Page;
