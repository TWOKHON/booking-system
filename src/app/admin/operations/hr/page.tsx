import { TuroInsightCard } from "../../dashboard/_components/TuroInsightCard";
import { hrRecords } from "./_components/hr-data";
import { HrSummary } from "./_components/hr-summary";
import { HrTable } from "./_components/hr-table";

const insights =
  "HR operations are active today, but 3 departments are still short on shift coverage and 2 employee cases need compliance review before roster changes can close.";

const Page = () => {
  return (
    <div className="space-y-6">
      <TuroInsightCard message={insights} />

      <HrSummary data={hrRecords} />
      <HrTable />
    </div>
  );
};

export default Page;
