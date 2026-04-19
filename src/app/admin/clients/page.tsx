import { TenantClientsSummary } from "./_components/tenant-clients-summary";
import {
  tenantClients,
} from "./_components/tenant-clients-data";
import { TenantClientsTable } from "./_components/tenant-clients-table";
import { TuroInsightCard } from "../dashboard/_components/TuroInsightCard";

const insights =
  "Tenant activity is steady today, but 3 accounts need billing review and 2 trial workspaces are nearing inactivity over this month.";

const Page = () => {
  return (
    <div className="space-y-6">
      <TuroInsightCard message={insights} />

      <TenantClientsSummary data={tenantClients} />
      <TenantClientsTable />
    </div>
  );
};

export default Page;
