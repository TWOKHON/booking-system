import { getTenantBuilderContext } from "../builder/_lib/get-tenant-builder-context";
import { DomainsWorkspaceView } from "./_components/DomainsWorkspaceView";

export default async function Page() {
  const { ownerName, resortName } = await getTenantBuilderContext();

  return <DomainsWorkspaceView userName={ownerName} resortName={resortName} />;
}
