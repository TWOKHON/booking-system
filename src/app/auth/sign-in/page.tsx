import { SignInView } from "./_components/SignInView";

type SearchParams = Promise<{
  email?: string | string[];
  plan?: string | string[];
  billing?: string | string[];
  checkout?: string | string[];
}>;

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  return (
    <SignInView
      initialEmail={Array.isArray(params.email) ? params.email[0] : params.email}
      selectedPlan={Array.isArray(params.plan) ? params.plan[0] : params.plan}
      selectedBilling={Array.isArray(params.billing) ? params.billing[0] : params.billing}
      checkoutIntent={Array.isArray(params.checkout) ? params.checkout[0] : params.checkout}
    />
  );
}
