"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { mapFormDataToTenantProfileUpdate } from "./_lib/mappers";
import { saveOnboardingPayloadSchema, type OnboardingFormData } from "./_lib/schema";

type ActionResult = {
  error?: string;
};

async function requireTenantUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("You need to sign in to continue.");
  }

  const appUser = await db.appUser.findUnique({
    where: { authUserId: session.user.id },
    include: {
      tenantProfile: true,
    },
  });

  if (!appUser || appUser.role !== "TENANT" || !appUser.tenantProfile) {
    throw new Error("Only tenant accounts can access onboarding.");
  }

  return appUser as typeof appUser & {
    tenantProfile: NonNullable<typeof appUser.tenantProfile>;
  };
}

export async function saveTenantOnboardingAction(input: {
  data: OnboardingFormData;
  currentStep: number;
}): Promise<ActionResult> {
  const payload = saveOnboardingPayloadSchema.safeParse(input);

  if (!payload.success) {
    return {
      error: payload.error.issues[0]?.message ?? "We couldn't save your onboarding details.",
    };
  }

  try {
    const appUser = await requireTenantUser();
    const mapped = mapFormDataToTenantProfileUpdate(payload.data.data);

    await db.$transaction(async (tx) => {
      await tx.tenantProfile.update({
        where: { appUserId: appUser.authUserId },
        data: {
          ...mapped.profile,
          onboardingStatus: payload.data.currentStep >= 1 ? "IN_PROGRESS" : "PENDING",
          onboardingCurrentStep: payload.data.currentStep,
        },
      });

      await tx.tenantTeamMember.deleteMany({
        where: { tenantProfileId: appUser.tenantProfile.id },
      });

      if (mapped.teamMembers.length > 0) {
        await tx.tenantTeamMember.createMany({
          data: mapped.teamMembers.map((member) => ({
            tenantProfileId: appUser.tenantProfile.id,
            ...member,
          })),
        });
      }

      await tx.tenantCommunicationChannel.deleteMany({
        where: { tenantProfileId: appUser.tenantProfile.id },
      });

      await tx.tenantCommunicationChannel.createMany({
        data: mapped.communicationChannels.map((channel) => ({
          tenantProfileId: appUser.tenantProfile.id,
          ...channel,
        })),
      });

      await tx.tenantNotificationPreference.deleteMany({
        where: { tenantProfileId: appUser.tenantProfile.id },
      });

      await tx.tenantNotificationPreference.createMany({
        data: mapped.notificationPreferences.map((preference) => ({
          tenantProfileId: appUser.tenantProfile.id,
          ...preference,
        })),
      });
    });

    return {};
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "We couldn't save your onboarding details right now.",
    };
  }
}

export async function completeTenantOnboardingAction(input: {
  data: OnboardingFormData;
}): Promise<void> {
  const payload = saveOnboardingPayloadSchema.safeParse({
    data: input.data,
    currentStep: 5,
  });

  if (!payload.success) {
    throw new Error(payload.error.issues[0]?.message ?? "Unable to complete onboarding.");
  }

  const appUser = await requireTenantUser();
  const mapped = mapFormDataToTenantProfileUpdate(payload.data.data);

  await db.$transaction(async (tx) => {
    await tx.tenantProfile.update({
      where: { appUserId: appUser.authUserId },
      data: {
        ...mapped.profile,
        onboardingStatus: "COMPLETED",
        onboardingCurrentStep: 5,
        onboardingCompletedAt: new Date(),
      },
    });

    await tx.tenantTeamMember.deleteMany({
      where: { tenantProfileId: appUser.tenantProfile.id },
    });

    if (mapped.teamMembers.length > 0) {
      await tx.tenantTeamMember.createMany({
        data: mapped.teamMembers.map((member) => ({
          tenantProfileId: appUser.tenantProfile.id,
          ...member,
        })),
      });
    }

    await tx.tenantCommunicationChannel.deleteMany({
      where: { tenantProfileId: appUser.tenantProfile.id },
    });

    await tx.tenantCommunicationChannel.createMany({
      data: mapped.communicationChannels.map((channel) => ({
        tenantProfileId: appUser.tenantProfile.id,
        ...channel,
      })),
    });

    await tx.tenantNotificationPreference.deleteMany({
      where: { tenantProfileId: appUser.tenantProfile.id },
    });

    await tx.tenantNotificationPreference.createMany({
      data: mapped.notificationPreferences.map((preference) => ({
        tenantProfileId: appUser.tenantProfile.id,
        ...preference,
      })),
    });
  });

  redirect("/tenant");
}
