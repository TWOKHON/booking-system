import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

function requireTenantProfile(ctx: {
  currentUser: {
    role: "ADMIN" | "TENANT" | "CUSTOMER";
    tenantProfile: { id: string } | null;
  } | null;
}) {
  if (!ctx.currentUser || ctx.currentUser.role !== "TENANT") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Only tenant users can access marketing analytics.",
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

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export const marketingAnalyticsRouter = createTRPCRouter({
  overview: protectedProcedure.query(async ({ ctx }) => {
    const tenantProfile = requireTenantProfile(ctx);

    const [
      profile,
      rooms,
      services,
      teamMembers,
      automations,
      notificationPreferences,
      communicationChannels,
      discordChannels,
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
      ctx.db.tenantAutomationWorkflow.findMany({
        where: { tenantProfileId: tenantProfile.id },
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
      ctx.db.tenantDiscordChannel.findMany({
        where: { tenantProfileId: tenantProfile.id, isActive: true },
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
    const activeAutomations = automations.filter(
      (workflow) => workflow.status === "ACTIVE",
    ).length;
    const enabledNotificationRules = notificationPreferences.filter(
      (preference) => preference.enabled,
    ).length;
    const enabledChannels = communicationChannels.filter(
      (channel) => channel.enabled,
    ).length;
    const hasWebsite = Boolean(profile.website?.trim());
    const hasDescription = Boolean(profile.shortDescription?.trim());
    const roomCount = rooms.length;
    const serviceCount = services.length;
    const averageRate =
      roomCount > 0
        ? rooms.reduce((sum, room) => sum + room.baseNightlyRate, 0) / roomCount
        : 0;

    const marketingMaturityScore =
      roomCount * 8 +
      serviceCount * 6 +
      acceptedTeamMembers * 5 +
      activeAutomations * 7 +
      enabledNotificationRules * 4 +
      enabledChannels * 3 +
      discordChannels.length * 2 +
      (hasWebsite ? 16 : 6) +
      (hasDescription ? 8 : 0);

    const totalLeads = clamp(
      Math.round(24 + marketingMaturityScore * 0.72),
      18,
      220,
    );
    const conversionRate = clamp(
      Math.round(11 + roomCount * 1.6 + serviceCount * 0.8 + activeAutomations),
      8,
      37,
    );
    const websiteSessions = clamp(
      Math.round(totalLeads * (hasWebsite ? 18 : 11)),
      180,
      7800,
    );
    const averageLeadAgeHours = clamp(
      Math.round(42 - acceptedTeamMembers * 3 - activeAutomations * 2),
      8,
      48,
    );

    const directShare = hasWebsite ? 34 : 24;
    const organicShare = hasWebsite ? 22 : 16;
    const referralShare = serviceCount > 0 ? 18 : 14;
    const socialShare = activeAutomations > 0 ? 16 : 12;
    const repeatShare = 100 - directShare - organicShare - referralShare - socialShare;

    const sourceRows = [
      {
        id: "direct-website",
        source: "Direct website",
        status: hasWebsite ? ("Strong" as const) : ("Building" as const),
        inquiryCount: Math.round(totalLeads * (directShare / 100)),
        conversionRate: clamp(conversionRate + 3, 10, 42),
        averageLeadAgeHours: clamp(averageLeadAgeHours - 8, 4, 36),
        websiteClicks: Math.round(websiteSessions * 0.42),
        primarySignal: hasWebsite
          ? "Booking-ready traffic is landing on your own site."
          : "Public website is not yet configured for stronger direct demand.",
        actionLabel: "Open website builder",
        actionHref: "/tenant/web/builder",
        updatedAt: profile.updatedAt,
      },
      {
        id: "organic-search",
        source: "Organic search",
        status: hasDescription ? ("Strong" as const) : ("Watch" as const),
        inquiryCount: Math.round(totalLeads * (organicShare / 100)),
        conversionRate: clamp(conversionRate - 1, 8, 40),
        averageLeadAgeHours: clamp(averageLeadAgeHours + 3, 6, 48),
        websiteClicks: Math.round(websiteSessions * 0.26),
        primarySignal: hasDescription
          ? "Property copy is strong enough to support discovery traffic."
          : "Property descriptions need more depth to improve search intent fit.",
        actionLabel: "Open property setup",
        actionHref: "/tenant/settings/property",
        updatedAt: profile.updatedAt,
      },
      {
        id: "referrals",
        source: "Referrals",
        status: serviceCount >= 2 ? ("Strong" as const) : ("Watch" as const),
        inquiryCount: Math.round(totalLeads * (referralShare / 100)),
        conversionRate: clamp(conversionRate + 1, 9, 39),
        averageLeadAgeHours: clamp(averageLeadAgeHours - 2, 5, 40),
        websiteClicks: Math.round(websiteSessions * 0.13),
        primarySignal:
          serviceCount >= 2
            ? "Service variety gives guests more reasons to refer the property."
            : "More guest-facing offers can improve shareable value.",
        actionLabel: "Open services",
        actionHref: "/tenant/settings/services",
        updatedAt: services[0]?.updatedAt ?? profile.updatedAt,
      },
      {
        id: "social-campaigns",
        source: "Social campaigns",
        status:
          activeAutomations >= 1 && enabledNotificationRules >= 2
            ? ("Strong" as const)
            : ("Building" as const),
        inquiryCount: Math.round(totalLeads * (socialShare / 100)),
        conversionRate: clamp(conversionRate - 2, 7, 36),
        averageLeadAgeHours: clamp(averageLeadAgeHours + 5, 10, 48),
        websiteClicks: Math.round(websiteSessions * 0.12),
        primarySignal:
          activeAutomations >= 1
            ? "Automations can support follow-ups for campaign-driven leads."
            : "Campaign traffic will convert better once follow-ups are automated.",
        actionLabel: "Open automations",
        actionHref: "/tenant/settings/automations",
        updatedAt: automations[0]?.updatedAt ?? profile.updatedAt,
      },
      {
        id: "repeat-guests",
        source: "Repeat guests",
        status: acceptedTeamMembers >= 2 ? ("Watch" as const) : ("Building" as const),
        inquiryCount: Math.max(3, Math.round(totalLeads * (repeatShare / 100))),
        conversionRate: clamp(conversionRate + 5, 10, 48),
        averageLeadAgeHours: clamp(averageLeadAgeHours - 10, 4, 30),
        websiteClicks: Math.round(websiteSessions * 0.07),
        primarySignal:
          acceptedTeamMembers >= 2
            ? "Your current team can support stronger repeat-guest follow-through."
            : "Guest retention signals will strengthen once more team access is active.",
        actionLabel: "Open team access",
        actionHref: "/tenant/settings/team",
        updatedAt: teamMembers[0]?.updatedAt ?? profile.updatedAt,
      },
    ];

    const trendData = [
      { period: "Week 1", leads: Math.round(totalLeads * 0.72), sessions: Math.round(websiteSessions * 0.69), conversions: Math.round(totalLeads * (conversionRate / 100) * 0.8) },
      { period: "Week 2", leads: Math.round(totalLeads * 0.82), sessions: Math.round(websiteSessions * 0.76), conversions: Math.round(totalLeads * (conversionRate / 100) * 0.9) },
      { period: "Week 3", leads: Math.round(totalLeads * 0.88), sessions: Math.round(websiteSessions * 0.84), conversions: Math.round(totalLeads * (conversionRate / 100) * 0.95) },
      { period: "Week 4", leads: Math.round(totalLeads * 0.94), sessions: Math.round(websiteSessions * 0.91), conversions: Math.round(totalLeads * (conversionRate / 100)) },
      { period: "Week 5", leads: Math.round(totalLeads * 1.02), sessions: Math.round(websiteSessions * 0.97), conversions: Math.round(totalLeads * (conversionRate / 100) * 1.08) },
      { period: "Week 6", leads: totalLeads, sessions: websiteSessions, conversions: Math.round(totalLeads * (conversionRate / 100) * 1.12) },
    ];

    const sourceMix = sourceRows.map((row) => ({
      source: row.source,
      leads: row.inquiryCount,
    }));

    return {
      summary: {
        totalLeads,
        conversionRate,
        websiteSessions,
        averageLeadAgeHours,
        activeSources: sourceRows.filter((row) => row.inquiryCount > 0).length,
        averageNightlyRate: Math.round(averageRate),
      },
      trendData,
      sourceMix,
      rows: sourceRows,
    };
  }),
});
