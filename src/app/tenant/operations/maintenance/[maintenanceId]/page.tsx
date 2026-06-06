import { MaintenanceFormView } from "../_components/MaintenanceFormView";

type PageProps = {
  params: Promise<{ maintenanceId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { maintenanceId } = await params;

  return <MaintenanceFormView maintenanceId={maintenanceId} />;
}
