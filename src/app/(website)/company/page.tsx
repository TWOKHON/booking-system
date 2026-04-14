import { getCompanyContent } from "@/data/company";
import { CompanyPageContent } from "./_components/CompanyPageContent";

export default async function Page() {
  const content = await getCompanyContent();

  return <CompanyPageContent content={content} />;
}
