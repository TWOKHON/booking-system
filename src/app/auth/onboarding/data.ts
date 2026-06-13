import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getAppRedirectPath } from "@/lib/auth-redirect";
import { db } from "@/lib/db";
import { defaultOnboardingFormData, onboardingPlanSelectionSchema } from "./_lib/schema";
import { mapTenantProfileToFormData } from "./_lib/mappers";

export async function getTenantOnboardingPageData(input?: {
  plan?: string | string[];
  billing?: string | string[];
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/auth/sign-in");
  }

  const appUser = await db.appUser.findUnique({
    where: { authUserId: session.user.id },
    include: {
      tenantProfile: {
        include: {
          teamMembers: {
            orderBy: { createdAt: "asc" },
          },
          communicationChannels: true,
          notificationPreferences: true,
          paymentAccounts: {
            orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
          },
        },
      },
    },
  });

  if (!appUser) {
    redirect("/auth/sign-in");
  }

  if (appUser.role !== "TENANT") {
    redirect(
      getAppRedirectPath({
        role: appUser.role,
        tenantOnboardingStatus: appUser.tenantProfile?.onboardingStatus ?? null,
      }),
    );
  }

  const initialData = mapTenantProfileToFormData(appUser.tenantProfile) ?? defaultOnboardingFormData;
  const resolvedSelection = onboardingPlanSelectionSchema.safeParse({
    plan: Array.isArray(input?.plan) ? input?.plan[0] : input?.plan,
    billing: Array.isArray(input?.billing) ? input?.billing[0] : input?.billing,
  });

  if (resolvedSelection.success) {
    if (resolvedSelection.data.plan) {
      initialData.planBilling.subscriptionPlan = resolvedSelection.data.plan;
    }

    if (resolvedSelection.data.billing) {
      initialData.planBilling.billingCycle = resolvedSelection.data.billing;
    }
  }

  return {
    initialData,
    initialStep: appUser.tenantProfile?.onboardingCurrentStep ?? 0,
    storageKey: `tenant-onboarding-draft:${appUser.authUserId}`,
  };
}
