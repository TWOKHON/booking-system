import { BuilderWorkspaceView } from "./_components/BuilderWorkspaceView";
import { getTenantBuilderContext } from "./_lib/get-tenant-builder-context";

export default async function Page() {
  const {
    siteId,
    ownerName,
    resortName,
    previewUrl,
    roomCount,
    serviceCount,
  } = await getTenantBuilderContext();

  return (
    <BuilderWorkspaceView
      siteId={siteId}
      ownerName={ownerName}
      resortName={resortName}
      previewUrl={previewUrl}
      roomCount={roomCount}
      serviceCount={serviceCount}
    />
  );
}
