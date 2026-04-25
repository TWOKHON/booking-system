import { TuroInsightCard } from "../../dashboard/_components/TuroInsightCard";
import { MaintenanceSummary } from "./_components/maintenance-summary";
import { maintenanceRecords } from "./_components/maintenance-data";
import { MaintenanceTable } from "./_components/maintenance-table";

const insights =
  "Maintenance demand is elevated today, with 4 high-risk tickets still active and 2 rooms held out of order until parts and verification are completed.";

const Page = () => {
  return (
    <div className="space-y-6">
      <TuroInsightCard message={insights} />

      <MaintenanceSummary data={maintenanceRecords} />
      <MaintenanceTable />
    </div>
  );
};

export default Page;
