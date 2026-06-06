import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

type RecommendationCategory =
  | "Pricing"
  | "Packaging"
  | "Promotion"
  | "Operations"
  | "Guest Experience";

type RecommendationPriority = "High" | "Medium" | "Low";
type RecommendationStatus = "Ready" | "Watch" | "Needs setup";

function requireTenantProfile(ctx: {
  currentUser: {
    role: "ADMIN" | "TENANT" | "CUSTOMER";
    tenantProfile: { id: string } | null;
  } | null;
}) {
  if (!ctx.currentUser || ctx.currentUser.role !== "TENANT") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Only tenant users can access recommendations.",
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
  title: string;
  category: RecommendationCategory;
  priority: RecommendationPriority;
  status: RecommendationStatus;
  recommendation: string;
  rationale: string;
  actionLabel: string;
  actionHref: string;
  updatedAt: Date;
}) {
  return input;
}

export const recommendationsRouter = createTRPCRouter({
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
    const sellableUnits = rooms.reduce(
      (sum, room) => sum + room.sellableUnits,
      0,
    );
    const averageNightlyRate =
      rooms.length > 0
        ? Math.round(
            rooms.reduce((sum, room) => sum + room.baseNightlyRate, 0) /
              rooms.length,
          )
        : 0;
    const serviceValue = services.reduce(
      (sum, service) => sum + service.basePrice,
      0,
    );
    const serviceCategories = new Set(
      services.map((service) => service.category.trim()).filter(Boolean),
    ).size;
    const hasDescriptionCoverage =
      services.length > 0 &&
      services.filter((service) => service.description?.trim().length).length >=
        Math.ceil(services.length / 2);

    const rows = [
      makeRow({
        id: "pricing-baseline",
        title: "Pricing baseline confidence",
        category: "Pricing",
        priority: averageNightlyRate > 0 ? "High" : "Medium",
        status:
          rooms.length >= 2 && averageNightlyRate > 0
            ? "Ready"
            : rooms.length >= 1
              ? "Watch"
              : "Needs setup",
        recommendation:
          averageNightlyRate > 0
            ? `Use PHP ${averageNightlyRate.toLocaleString("en-PH")} as the internal benchmark when comparing room value and future seasonal price shifts.`
            : "Add room records with nightly rates first so pricing guidance has a real baseline.",
        rationale:
          "AI pricing recommendations become more trustworthy when the property already has sellable room inventory and a consistent starting nightly rate.",
        actionLabel: "Open rooms",
        actionHref: "/tenant/settings/rooms",
        updatedAt: rooms[0]?.updatedAt ?? profile.updatedAt,
      }),
      makeRow({
        id: "package-depth",
        title: "Package design opportunity",
        category: "Packaging",
        priority: services.length >= 2 ? "High" : "Medium",
        status:
          services.length >= 2 && serviceCategories >= 2
            ? "Ready"
            : services.length === 1
              ? "Watch"
              : "Needs setup",
        recommendation:
          services.length >= 2
            ? `Bundle the strongest service categories together to create more valuable guest packages from your current PHP ${serviceValue.toLocaleString("en-PH")} service base.`
            : "Build at least two services so ResortCloud can suggest stronger room-and-service package combinations.",
        rationale:
          "Package recommendations depend on having enough guest offers and category variety to combine meaningfully.",
        actionLabel: "Open services",
        actionHref: "/tenant/settings/services",
        updatedAt: services[0]?.updatedAt ?? profile.updatedAt,
      }),
      makeRow({
        id: "promotion-readiness",
        title: "Promotion timing readiness",
        category: "Promotion",
        priority:
          enabledNotificationRules >= 3 && activeAutomations >= 1
            ? "High"
            : "Medium",
        status:
          enabledNotificationRules >= 3 &&
          enabledChannels >= 2 &&
          activeAutomations >= 1
            ? "Ready"
            : enabledNotificationRules >= 1
              ? "Watch"
              : "Needs setup",
        recommendation:
          enabledNotificationRules >= 3
            ? "Use current alert coverage and active workflows to test promo reminders, abandoned inquiries, or quieter booking windows."
            : "Set up more notifications and at least one automation so future promotion recommendations can be acted on quickly.",
        rationale:
          "Recommendations are only useful if the property can operationalize them through messaging and repeatable workflows.",
        actionLabel: "Open automations",
        actionHref: "/tenant/settings/automations",
        updatedAt: automations[0]?.updatedAt ?? profile.updatedAt,
      }),
      makeRow({
        id: "operations-capacity",
        title: "Operations capacity check",
        category: "Operations",
        priority: sellableUnits >= 4 ? "Medium" : "Low",
        status:
          acceptedTeamMembers >= 3 && sellableUnits >= 2
            ? "Ready"
            : acceptedTeamMembers >= 1
              ? "Watch"
              : "Needs setup",
        recommendation:
          acceptedTeamMembers >= 3
            ? `Your current ${acceptedTeamMembers} accepted team members should be enough to review AI suggestions before pushing them into live operations.`
            : "Strengthen team access first so recommendations have people who can actually review and execute them.",
        rationale:
          "Recommendations feel credible when there is enough accepted team coverage to evaluate and apply them safely.",
        actionLabel: "Open team access",
        actionHref: "/tenant/settings/team",
        updatedAt: teamMembers[0]?.updatedAt ?? profile.updatedAt,
      }),
      makeRow({
        id: "guest-experience-coverage",
        title: "Guest experience recommendation coverage",
        category: "Guest Experience",
        priority: hasDescriptionCoverage ? "Medium" : "Low",
        status:
          services.length > 0 && hasDescriptionCoverage
            ? "Ready"
            : services.length > 0
              ? "Watch"
              : "Needs setup",
        recommendation:
          hasDescriptionCoverage
            ? "Use service descriptions and guest-facing catalog details as the base for future upsell and concierge-style AI suggestions."
            : "Improve service descriptions so future recommendation outputs can be tied to clear guest-facing offers.",
        rationale:
          "The AI layer needs readable service and offer context before it can suggest guest experience improvements convincingly.",
        actionLabel: "Open services",
        actionHref: "/tenant/settings/services",
        updatedAt: services[0]?.updatedAt ?? profile.updatedAt,
      }),
      makeRow({
        id: "collection-confidence",
        title: "Revenue collection confidence",
        category: "Pricing",
        priority: hasDefaultPaymentAccount ? "High" : "Medium",
        status:
          activePaymentAccounts > 0 && hasDefaultPaymentAccount
            ? "Ready"
            : activePaymentAccounts > 0
              ? "Watch"
              : "Needs setup",
        recommendation:
          hasDefaultPaymentAccount
            ? "Keep the current default payment account stable so rate and promo recommendations can be executed with clear collection instructions."
            : "Set a default payment account first so pricing and collection-related suggestions stay operationally clear.",
        rationale:
          "Commercial recommendations are easier to act on when the property already has a clear default collection path.",
        actionLabel: "Open payment accounts",
        actionHref: "/tenant/integrations/payment-accounts",
        updatedAt: paymentAccounts[0]?.updatedAt ?? profile.updatedAt,
      }),
    ];

    const readyCount = rows.filter((row) => row.status === "Ready").length;
    const highPriorityCount = rows.filter(
      (row) => row.priority === "High",
    ).length;
    const watchCount = rows.filter((row) => row.status === "Watch").length;

    return {
      summary: {
        readyCount,
        highPriorityCount,
        watchCount,
        averageNightlyRate,
        serviceCatalogValue: serviceValue,
      },
      rows,
    };
  }),
});
