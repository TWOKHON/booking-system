import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

type PropertiesAnalyticsCategory =
  | "Portfolio"
  | "Commercial"
  | "Operations"
  | "Finance"
  | "Communications";

type PropertiesAnalyticsStatus = "Ready" | "Watch" | "Upgrade needed";

function requireTenantProfile(ctx: {
  currentUser: {
    role: "ADMIN" | "TENANT" | "CUSTOMER";
    tenantProfile: { id: string } | null;
  } | null;
}) {
  if (!ctx.currentUser || ctx.currentUser.role !== "TENANT") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Only tenant users can access multi-property analytics.",
    });
  }

  if (!ctx.currentUser.tenantProfile) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Tenant profile not found.",
    });
  }

  return ctx.currentUser.tenantProfile;
}

function makeRow(input: {
  id: string;
  metric: string;
  category: PropertiesAnalyticsCategory;
  status: PropertiesAnalyticsStatus;
  currentValue: string;
  note: string;
  actionLabel: string;
  actionHref: string;
  updatedAt: Date;
}) {
  return input;
}

function getPropertyAllowance(
  plan: "FREE_TRIAL" | "STARTER" | "GROWTH" | "ENTERPRISE",
) {
  switch (plan) {
    case "GROWTH":
      return 2;
    case "ENTERPRISE":
      return 3;
    default:
      return 1;
  }
}

export const propertiesAnalyticsRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const tenantProfile = requireTenantProfile(ctx);

    const [
      profile,
      rooms,
      services,
      teamMembers,
      paymentAccounts,
      notificationPreferences,
      communicationChannels,
      automations,
    ] = await Promise.all([
      ctx.db.tenantProfile.findUnique({
        where: { id: tenantProfile.id },
      }),
      ctx.db.tenantRoom.findMany({
        where: { tenantProfileId: tenantProfile.id, isActive: true },
        orderBy: { updatedAt: "desc" },
      }),
      ctx.db.tenantService.findMany({
        where: { tenantProfileId: tenantProfile.id, isActive: true },
        orderBy: { updatedAt: "desc" },
      }),
      ctx.db.tenantTeamMember.findMany({
        where: { tenantProfileId: tenantProfile.id },
        orderBy: { updatedAt: "desc" },
      }),
      ctx.db.tenantPaymentAccount.findMany({
        where: { tenantProfileId: tenantProfile.id, isActive: true },
        orderBy: { updatedAt: "desc" },
      }),
      ctx.db.tenantNotificationPreference.findMany({
        where: { tenantProfileId: tenantProfile.id },
        orderBy: { updatedAt: "desc" },
      }),
      ctx.db.tenantCommunicationChannel.findMany({
        where: { tenantProfileId: tenantProfile.id },
        orderBy: { updatedAt: "desc" },
      }),
      ctx.db.tenantAutomationWorkflow.findMany({
        where: { tenantProfileId: tenantProfile.id },
        orderBy: { updatedAt: "desc" },
      }),
    ]);

    if (!profile) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Tenant profile not found.",
      });
    }

    const propertyAllowance = getPropertyAllowance(profile.subscriptionPlan);
    const currentPropertyCount = 1;
    const acceptedTeamMembers = teamMembers.filter(
      (member) => member.status === "ACCEPTED",
    ).length;
    const activePaymentAccounts = paymentAccounts.length;
    const hasDefaultPaymentAccount = paymentAccounts.some(
      (account) => account.isDefault,
    );
    const enabledNotificationRules = notificationPreferences.filter(
      (preference) => preference.enabled,
    ).length;
    const enabledChannels = communicationChannels.filter(
      (channel) => channel.enabled,
    ).length;
    const activeAutomations = automations.filter(
      (workflow) => workflow.status === "ACTIVE",
    ).length;
    const totalSellableUnits = rooms.reduce(
      (sum, room) => sum + room.sellableUnits,
      0,
    );

    const rows = [
      makeRow({
        id: "plan-entitlement",
        metric: "Portfolio plan entitlement",
        category: "Portfolio",
        status:
          profile.subscriptionPlan === "GROWTH" ||
          profile.subscriptionPlan === "ENTERPRISE"
            ? "Ready"
            : "Upgrade needed",
        currentValue: `${currentPropertyCount} of ${propertyAllowance} property slots available`,
        note:
          "Multi-property analytics only becomes meaningful once the subscription plan supports more than one property under the tenant account.",
        actionLabel: "Open billing",
        actionHref: "/tenant/foundation/billing",
        updatedAt: profile.updatedAt,
      }),
      makeRow({
        id: "property-standardization",
        metric: "Property setup standardization",
        category: "Commercial",
        status:
          profile.resortName &&
          profile.propertyType &&
          profile.fullAddress &&
          profile.billingEmail
            ? "Ready"
            : profile.resortName || profile.propertyType
              ? "Watch"
              : "Upgrade needed",
        currentValue: `${profile.resortName ? "named" : "unnamed"} / ${profile.fullAddress ? "addressed" : "address incomplete"}`,
        note:
          "Adding more properties later is easier when the base property identity, billing contact, and address structure are already clean and consistent.",
        actionLabel: "Open property setup",
        actionHref: "/tenant/settings/property",
        updatedAt: profile.updatedAt,
      }),
      makeRow({
        id: "inventory-readiness",
        metric: "Cross-property inventory readiness",
        category: "Operations",
        status:
          rooms.length >= 2 && totalSellableUnits >= 2
            ? "Ready"
            : rooms.length >= 1
              ? "Watch"
              : "Upgrade needed",
        currentValue: `${rooms.length} room records / ${totalSellableUnits} sellable units`,
        note:
          "A stronger room and unit structure on the first property makes future multi-property comparisons more trustworthy.",
        actionLabel: "Open rooms",
        actionHref: "/tenant/settings/rooms",
        updatedAt: rooms[0]?.updatedAt ?? profile.updatedAt,
      }),
      makeRow({
        id: "service-standardization",
        metric: "Service catalog portability",
        category: "Commercial",
        status:
          services.length >= 2 ? "Ready" : services.length === 1 ? "Watch" : "Upgrade needed",
        currentValue: `${services.length} reusable service offers`,
        note:
          "Properties are easier to compare when service structures and upsell offers already follow a consistent catalog model.",
        actionLabel: "Open services",
        actionHref: "/tenant/settings/services",
        updatedAt: services[0]?.updatedAt ?? profile.updatedAt,
      }),
      makeRow({
        id: "team-coverage",
        metric: "Shared team coverage",
        category: "Operations",
        status:
          acceptedTeamMembers >= 3
            ? "Ready"
            : acceptedTeamMembers >= 1
              ? "Watch"
              : "Upgrade needed",
        currentValue: `${acceptedTeamMembers} accepted team members`,
        note:
          "Portfolio operations require enough accepted team access to support managers, finance, and operations visibility across properties.",
        actionLabel: "Open team access",
        actionHref: "/tenant/settings/team",
        updatedAt: teamMembers[0]?.updatedAt ?? profile.updatedAt,
      }),
      makeRow({
        id: "finance-consistency",
        metric: "Finance consistency",
        category: "Finance",
        status:
          activePaymentAccounts > 0 && hasDefaultPaymentAccount
            ? "Ready"
            : activePaymentAccounts > 0
              ? "Watch"
              : "Upgrade needed",
        currentValue: `${activePaymentAccounts} payment accounts / ${hasDefaultPaymentAccount ? "default defined" : "default missing"}`,
        note:
          "Portfolio reporting benefits from a clean default payment path and consistent finance references before more properties are introduced.",
        actionLabel: "Open payment accounts",
        actionHref: "/tenant/integrations/payment-accounts",
        updatedAt: paymentAccounts[0]?.updatedAt ?? profile.updatedAt,
      }),
      makeRow({
        id: "alert-standardization",
        metric: "Alert standardization",
        category: "Communications",
        status:
          enabledNotificationRules >= 3 && enabledChannels >= 2
            ? "Ready"
            : enabledNotificationRules >= 1
              ? "Watch"
              : "Upgrade needed",
        currentValue: `${enabledNotificationRules} rules / ${enabledChannels} delivery channels`,
        note:
          "Portfolio oversight becomes more reliable when notification rules and delivery channels are already standardized on the first property.",
        actionLabel: "Open notifications",
        actionHref: "/tenant/integrations/notifications",
        updatedAt:
          notificationPreferences[0]?.updatedAt ??
          communicationChannels[0]?.updatedAt ??
          profile.updatedAt,
      }),
      makeRow({
        id: "workflow-portability",
        metric: "Workflow portability",
        category: "Portfolio",
        status:
          activeAutomations >= 2
            ? "Ready"
            : activeAutomations >= 1
              ? "Watch"
              : "Upgrade needed",
        currentValue: `${activeAutomations} active automation workflows`,
        note:
          "Well-structured workflows on one property are the easiest assets to replicate when the tenant expands into a second location.",
        actionLabel: "Open automations",
        actionHref: "/tenant/settings/automations",
        updatedAt: automations[0]?.updatedAt ?? profile.updatedAt,
      }),
    ];

    const readyCount = rows.filter((row) => row.status === "Ready").length;
    const watchCount = rows.filter((row) => row.status === "Watch").length;

    return {
      summary: {
        currentPropertyCount,
        propertyAllowance,
        readyCount,
        watchCount,
        activeWorkflowCount: activeAutomations,
      },
      rows,
    };
  }),
});
