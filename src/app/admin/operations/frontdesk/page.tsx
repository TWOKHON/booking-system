import { TuroInsightCard } from "../../dashboard/_components/TuroInsightCard";
import { FrontdeskSummary } from "./_components/frontdesk-summary";
import { frontdeskRecords } from "./_components/frontdesk-data";
import { FrontdeskTable } from "./_components/frontdesk-table";

const insights =
  "Front desk activity is moving today, but 4 guest files still need payment or ID clearance and 3 arrivals are waiting on room readiness before check-in can close.";

const Page = () => {
  return (
    <div className="space-y-6">
      <TuroInsightCard message={insights} />

      <FrontdeskSummary data={frontdeskRecords} />
      <FrontdeskTable />
    </div>
  );
};

export default Page;
