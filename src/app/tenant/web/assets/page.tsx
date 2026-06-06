import { getTenantBuilderContext } from "../builder/_lib/get-tenant-builder-context";
import { AssetsWorkspaceView } from "./_components/AssetsWorkspaceView";

export default async function Page() {
  const {
    siteId,
    ownerName,
    resortName,
  } = await getTenantBuilderContext();

  return (
    <AssetsWorkspaceView 
      siteId={siteId}
      userName={ownerName} 
      resortName={resortName} 
    />
  );
}
