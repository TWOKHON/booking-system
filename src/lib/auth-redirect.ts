type AuthRole = "ADMIN" | "TENANT" | "CUSTOMER";
type TenantOnboardingStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

export function getAppRedirectPath(input: {
  role: AuthRole;
  tenantOnboardingStatus?: TenantOnboardingStatus | null;
}) {
  const { role, tenantOnboardingStatus } = input;

  if (role === "ADMIN") {
    return "/admin";
  }

  if (role === "TENANT") {
    return tenantOnboardingStatus === "COMPLETED"
      ? "/tenant"
      : "/auth/onboarding";
  }

  return "/";
}
