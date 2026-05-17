import { OnboardingWizard } from "./_components/OnboardingWizard";
import { getTenantOnboardingPageData } from "./data";

type SearchParams = Promise<{
  plan?: string | string[];
  billing?: string | string[];
}>;

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const { initialData, initialStep, storageKey } = await getTenantOnboardingPageData(params);

  return (
    <OnboardingWizard
      initialData={initialData}
      initialStep={initialStep}
      storageKey={storageKey}
    />
  );
}
