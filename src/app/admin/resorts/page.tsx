import { TuroInsightCard } from "../dashboard/_components/TuroInsightCard";
import { ResortsSummary } from "./_components/resorts-summary";
import { resortRecords } from "./_components/resorts-data";
import { ResortsTable } from "./_components/resorts-table";

const insights =
  "Resort coverage is healthy today, but 3 properties still need setup or channel review and 2 high-revenue sites are carrying operational risk.";

const Page = () => {
  return (
    <div className="space-y-6">
      <TuroInsightCard message={insights} />

      <ResortsSummary data={resortRecords} />
      <ResortsTable />
    </div>
  );
};

export default Page;
