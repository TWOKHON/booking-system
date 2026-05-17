import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

type AdvancedAnalyticsCategory =
  | "Commercial"
  | "Operations"
  | "Finance"
  | "Communications"
  | "Growth";

type AdvancedAnalyticsStatus = "Ready" | "Watch" | "Needs setup";

function requireTenantProfile(ctx: {
  currentUser: {
    role: "ADMIN" | "TENANT" | "CUSTOMER";
    tenantProfile: { id: string } | null;
  } | null;
}) {
  if (!ctx.currentUser || ctx.currentUser.role !== "TENANT") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Only tenant users can access advanced analytics.",
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
  category: AdvancedAnalyticsCategory;
  status: AdvancedAnalyticsStatus;
  currentValue: string;
  note: string;
  actionLabel: string;
  actionHref: string;
  updatedAt: Date;
}) {
  return input;
}

export const advancedAnalyticsRouter = createTRPCRouter({
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

    const acceptedTeamMembers = teamMembers.filter(
      (member) => member.status === "ACCEPTED",
    );
    const activePaymentAccounts = paymentAccounts.length;
    const hasDefaultPaymentAccount = paymentAccounts.some(
      (account) => account.isDefault,
    );
    const enabledNotificationRules = notificationPreferences.filter(
      (preference) => preference.enabled,
    );
    const enabledChannels = communicationChannels.filter(
      (channel) => channel.enabled,
    );
    const activeAutomations = automations.filter(
      (workflow) => workflow.status === "ACTIVE",
    );
    const sellableUnits = rooms.reduce(
      (total, room) => total + room.sellableUnits,
      0,
    );
    const serviceValue = services.reduce(
      (total, service) => total + service.basePrice,
      0,
    );

    const requiredProfileFields = [
      profile.resortName,
      profile.propertyType,
      profile.fullAddress,
      profile.region,
      profile.province,
      profile.municipality,
      profile.barangay,
      profile.phoneNumber,
      profile.billingEmail,
    ];
    const completedProfileFields = requiredProfileFields.filter(
      (value) => typeof value === "string" && value.trim().length > 0,
    ).length;

    const rows = [
      makeRow({
        id: "property-coverage",
        metric: "Property profile coverage",
        category: "Commercial",
        status:
          completedProfileFields >= requiredProfileFields.length
            ? "Ready"
            : completedProfileFields >= 6
              ? "Watch"
              : "Needs setup",
        currentValue: `${completedProfileFields}/${requiredProfileFields.length} core fields complete`,
        note:
          "Advanced reporting becomes more reliable when the resort identity, address, and billing contact details are complete.",
        actionLabel: "Open property setup",
        actionHref: "/tenant/settings/property",
        updatedAt: profile.updatedAt,
      }),
      makeRow({
        id: "inventory-depth",
        metric: "Inventory depth",
        category: "Operations",
        status:
          rooms.length > 0 && sellableUnits > 0
            ? "Ready"
            : rooms.length > 0
              ? "Watch"
              : "Needs setup",
        currentValue: `${rooms.length} room records / ${sellableUnits} sellable units`,
        note:
          "Room coverage drives occupancy, demand pacing, and direct booking analytics across the tenant workspace.",
        actionLabel: "Open rooms",
        actionHref: "/tenant/settings/rooms",
        updatedAt: rooms[0]?.updatedAt ?? profile.updatedAt,
      }),
      makeRow({
        id: "service-catalog",
        metric: "Upsell catalog value",
        category: "Commercial",
        status: services.length > 0 ? "Ready" : "Needs setup",
        currentValue: `${services.length} services / PHP ${serviceValue.toLocaleString("en-PH")}`,
        note:
          "Guest add-ons and service pricing give advanced analytics more surface area for conversion and revenue insights.",
        actionLabel: "Open services",
        actionHref: "/tenant/settings/services",
        updatedAt: services[0]?.updatedAt ?? profile.updatedAt,
      }),
      makeRow({
        id: "team-readiness",
        metric: "Team access readiness",
        category: "Operations",
        status:
          acceptedTeamMembers.length >= 2
            ? "Ready"
            : acceptedTeamMembers.length === 1
              ? "Watch"
              : "Needs setup",
        currentValue: `${acceptedTeamMembers.length} accepted / ${teamMembers.length} total records`,
        note:
          "Advanced dashboards are more useful when the right managers and operators already have accepted workspace access.",
        actionLabel: "Open team access",
        actionHref: "/tenant/settings/team",
        updatedAt: teamMembers[0]?.updatedAt ?? profile.updatedAt,
      }),
      makeRow({
        id: "payment-readiness",
        metric: "Payment collection readiness",
        category: "Finance",
        status:
          activePaymentAccounts > 0 && hasDefaultPaymentAccount
            ? "Ready"
            : activePaymentAccounts > 0
              ? "Watch"
              : "Needs setup",
        currentValue: `${activePaymentAccounts} payment accounts / ${hasDefaultPaymentAccount ? "default set" : "no default yet"}`,
        note:
          "Finance analytics and settlement visibility are more usable when at least one payment account is active and marked as the team default.",
        actionLabel: "Open payment accounts",
        actionHref: "/tenant/integrations/payment-accounts",
        updatedAt: paymentAccounts[0]?.updatedAt ?? profile.updatedAt,
      }),
      makeRow({
        id: "notification-coverage",
        metric: "Alert delivery coverage",
        category: "Communications",
        status:
          enabledNotificationRules.length >= 3 && enabledChannels.length >= 2
            ? "Ready"
            : enabledNotificationRules.length > 0
              ? "Watch"
              : "Needs setup",
        currentValue: `${enabledNotificationRules.length} enabled rules / ${enabledChannels.length} live channels`,
        note:
          "Advanced analytics becomes easier to operationalize when alerting rules and delivery channels are already configured.",
        actionLabel: "Open notifications",
        actionHref: "/tenant/integrations/notifications",
        updatedAt:
          notificationPreferences[0]?.updatedAt ??
          communicationChannels[0]?.updatedAt ??
          profile.updatedAt,
      }),
      makeRow({
        id: "automation-coverage",
        metric: "Automation coverage",
        category: "Growth",
        status:
          activeAutomations.length >= 2
            ? "Ready"
            : activeAutomations.length === 1
              ? "Watch"
              : "Needs setup",
        currentValue: `${activeAutomations.length} active workflows / ${automations.length} total automations`,
        note:
          "Growth-tier reporting and performance review is stronger once routine booking, finance, or communication workflows are automated.",
        actionLabel: "Open automations",
        actionHref: "/tenant/settings/automations",
        updatedAt: automations[0]?.updatedAt ?? profile.updatedAt,
      }),
    ];

    const readyCount = rows.filter((row) => row.status === "Ready").length;
    const watchCount = rows.filter((row) => row.status === "Watch").length;

    return {
      summary: {
        readyCount,
        watchCount,
        sellableUnits,
        activeWorkflowCount: activeAutomations.length,
        enabledNotificationRuleCount: enabledNotificationRules.length,
      },
      rows,
    };
  }),
});
