import { SignUpView } from "./_components/SignUpView";

type SearchParams = Promise<{
  userType?: string | string[];
  plan?: string | string[];
  billing?: string | string[];
  checkout?: string | string[];
}>;

function resolveUserType(userType: string | string[] | undefined) {
  const value = (Array.isArray(userType) ? userType[0] : userType)
    ?.trim()
    .toUpperCase();

  if (value === "ADMIN") {
    return "admin" as const;
  }

  if (value === "TENANT") {
    return "tenant" as const;
  }

  return "customer" as const;
}

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  return (
    <SignUpView
      userType={resolveUserType(params.userType)}
      selectedPlan={Array.isArray(params.plan) ? params.plan[0] : params.plan}
      selectedBilling={Array.isArray(params.billing) ? params.billing[0] : params.billing}
      checkoutIntent={Array.isArray(params.checkout) ? params.checkout[0] : params.checkout}
    />
  );
}
