import { redirect } from "next/navigation";
import { getTenantBuilderContext } from "../_lib/get-tenant-builder-context";
import { SiteBuilderView } from "./_components/SiteBuilderView";

type TenantSiteBuilderPageProps = {
  params: Promise<{ siteId: string }>;
  searchParams: Promise<{ template?: string }>;
};

export default async function TenantSiteBuilderPage({
  params,
  searchParams,
}: TenantSiteBuilderPageProps) {
  const { siteId } = await params;
  const { template } = await searchParams;
  const context = await getTenantBuilderContext();

  if (siteId !== context.siteId) {
    redirect(`/tenant/web/builder/${context.siteId}`);
  }

  return <SiteBuilderView {...context} templateSlug={template} />;
}
