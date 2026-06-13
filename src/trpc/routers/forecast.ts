import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { getTenantEntitlements } from "@/lib/subscription/entitlements";

type ForecastCategory =
  | "Demand"
  | "Revenue"
  | "Operations"
  | "Commercial"
  | "Trust";

type ForecastPriority = "High" | "Medium" | "Low";
type ForecastStatus = "Ready" | "Watch" | "Needs setup";

function requireTenantProfile(ctx: {
  currentUser: {
    role: "ADMIN" | "TENANT" | "CUSTOMER";
    tenantProfile: { id: string } | null;
  } | null;
}) {
  if (!ctx.currentUser || ctx.currentUser.role !== "TENANT") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Only tenant users can access forecasting.",
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
  category: ForecastCategory;
  priority: ForecastPriority;
  status: ForecastStatus;
  forecastWindow: "30 days" | "60 days" | "90 days";
  forecastSignal: string;
  recommendation: string;
  rationale: string;
  actionLabel: string;
  actionHref: string;
  updatedAt: Date;
}) {
  return input;
}

export const forecastRouter = createTRPCRouter({
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

    const entitlements = getTenantEntitlements({
      plan: profile.subscriptionPlan,
      subscriptionStatus: profile.subscriptionStatus,
    });

    if (!entitlements.hasAiAccess) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "AI revenue forecasting requires the Enterprise plan.",
      });
    }

    const activeAutomations = automations.filter(
      (workflow) => workflow.status === "ACTIVE",
    ).length;
    const enabledNotificationRules = notificationPreferences.filter(
      (preference) => preference.enabled,
    ).length;
    const enabledChannels = communicationChannels.filter(
      (channel) => channel.enabled,
    ).length;
    const acceptedTeamMembers = teamMembers.filter(
      (member) => member.status === "ACCEPTED",
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
    const activePaymentAccounts = paymentAccounts.length;
    const hasDefaultPaymentAccount = paymentAccounts.some(
      (account) => account.isDefault,
    );
    const totalServiceValue = services.reduce(
      (sum, service) => sum + service.basePrice,
      0,
    );

    const forecast30Revenue = averageNightlyRate * Math.max(sellableUnits, 1) * 8;
    const forecast60Revenue = averageNightlyRate * Math.max(sellableUnits, 1) * 16;
    const forecast90Revenue = averageNightlyRate * Math.max(sellableUnits, 1) * 24;

    const rows = [
      makeRow({
        id: "demand-30",
        title: "30-day occupancy outlook baseline",
        category: "Demand",
        priority: rooms.length >= 2 ? "High" : "Medium",
        status:
          rooms.length >= 2 && sellableUnits >= 2
            ? "Ready"
            : rooms.length >= 1
              ? "Watch"
              : "Needs setup",
        forecastWindow: "30 days",
        forecastSignal: `${sellableUnits} sellable units / ${rooms.length} room records`,
        recommendation:
          rooms.length >= 2
            ? "Use the next 30 days as your most practical occupancy watch window and treat room-unit coverage as the baseline demand signal."
            : "Add more complete room inventory first so short-range occupancy forecasting has enough structure to be credible.",
        rationale:
          "Short-term forecasting depends most on room and unit coverage because those are the closest operational signals to actual occupancy behavior.",
        actionLabel: "Open rooms",
        actionHref: "/tenant/settings/rooms",
        updatedAt: rooms[0]?.updatedAt ?? profile.updatedAt,
      }),
      makeRow({
        id: "revenue-30",
        title: "30-day revenue forecast anchor",
        category: "Revenue",
        priority: averageNightlyRate > 0 ? "High" : "Medium",
        status:
          averageNightlyRate > 0 && sellableUnits > 0
            ? "Ready"
            : rooms.length > 0
              ? "Watch"
              : "Needs setup",
        forecastWindow: "30 days",
        forecastSignal:
          averageNightlyRate > 0
            ? `Approx. ${new Intl.NumberFormat("en-PH", {
                style: "currency",
                currency: "PHP",
                maximumFractionDigits: 0,
              }).format(forecast30Revenue)} modeled baseline`
            : "Nightly rate baseline missing",
        recommendation:
          averageNightlyRate > 0
            ? "Treat the next 30-day revenue baseline as a pricing confidence check before making rate or promo changes."
            : "Add room rates first so forecasted revenue can be tied to a real commercial baseline.",
        rationale:
          "Forecasting revenue without nightly rate baselines turns the model into guesswork, so pricing structure comes first.",
        actionLabel: "Open rooms",
        actionHref: "/tenant/settings/rooms",
        updatedAt: rooms[0]?.updatedAt ?? profile.updatedAt,
      }),
      makeRow({
        id: "revenue-60",
        title: "60-day commercial planning window",
        category: "Commercial",
        priority:
          services.length >= 2 && totalServiceValue > 0 ? "High" : "Medium",
        status:
          services.length >= 2 && averageNightlyRate > 0
            ? "Ready"
            : services.length > 0
              ? "Watch"
              : "Needs setup",
        forecastWindow: "60 days",
        forecastSignal:
          services.length > 0
            ? `${services.length} services / ${new Intl.NumberFormat("en-PH", {
                style: "currency",
                currency: "PHP",
                maximumFractionDigits: 0,
              }).format(forecast60Revenue)} modeled room baseline`
            : "No add-on catalog available yet",
        recommendation:
          services.length >= 2
            ? "Use the 60-day view for package and upsell planning because service catalog breadth adds more meaningful commercial lift to forecast scenarios."
            : "Expand the service catalog before relying on medium-term promo or package forecasts.",
        rationale:
          "The 60-day window is where rooms and services start combining into more strategic commercial planning rather than pure occupancy management.",
        actionLabel: "Open services",
        actionHref: "/tenant/settings/services",
        updatedAt: services[0]?.updatedAt ?? profile.updatedAt,
      }),
      makeRow({
        id: "operations-60",
        title: "60-day operations strain check",
        category: "Operations",
        priority: acceptedTeamMembers >= 3 ? "Medium" : "Low",
        status:
          acceptedTeamMembers >= 3 && activeAutomations >= 1
            ? "Ready"
            : acceptedTeamMembers >= 1
              ? "Watch"
              : "Needs setup",
        forecastWindow: "60 days",
        forecastSignal: `${acceptedTeamMembers} accepted team members / ${activeAutomations} active workflows`,
        recommendation:
          acceptedTeamMembers >= 3
            ? "Use the 60-day forecast to decide whether the current team and automation coverage can absorb higher occupancy windows."
            : "Strengthen team access and workflow coverage before trusting medium-range operational forecasts.",
        rationale:
          "A medium-term forecast only helps if the team can actually translate predicted demand into staffing and operations decisions.",
        actionLabel: "Open team access",
        actionHref: "/tenant/settings/team",
        updatedAt:
          teamMembers[0]?.updatedAt ??
          automations[0]?.updatedAt ??
          profile.updatedAt,
      }),
      makeRow({
        id: "revenue-90",
        title: "90-day cash confidence outlook",
        category: "Revenue",
        priority:
          hasDefaultPaymentAccount && enabledNotificationRules >= 3
            ? "High"
            : "Medium",
        status:
          activePaymentAccounts > 0 &&
          hasDefaultPaymentAccount &&
          enabledNotificationRules >= 3
            ? "Ready"
            : activePaymentAccounts > 0 || enabledNotificationRules > 0
              ? "Watch"
              : "Needs setup",
        forecastWindow: "90 days",
        forecastSignal:
          averageNightlyRate > 0
            ? `${new Intl.NumberFormat("en-PH", {
                style: "currency",
                currency: "PHP",
                maximumFractionDigits: 0,
              }).format(forecast90Revenue)} modeled room baseline / ${enabledNotificationRules} live rules`
            : `${enabledNotificationRules} live rules / no room-rate baseline`,
        recommendation:
          hasDefaultPaymentAccount && enabledNotificationRules >= 3
            ? "Use the 90-day view to monitor whether expected revenue can actually be collected and followed through the current payment and reminder setup."
            : "Tighten default payment accounts and notification coverage before leaning on longer-range revenue forecasts.",
        rationale:
          "Longer-range forecasts become more useful when collection paths and reminder coverage already support follow-through on expected demand.",
        actionLabel: "Open payment accounts",
        actionHref: "/tenant/integrations/payment-accounts",
        updatedAt:
          paymentAccounts[0]?.updatedAt ??
          notificationPreferences[0]?.updatedAt ??
          profile.updatedAt,
      }),
      makeRow({
        id: "trust-loop",
        title: "Forecast trust loop readiness",
        category: "Trust",
        priority:
          activeAutomations >= 1 && enabledChannels >= 2 ? "Medium" : "Low",
        status:
          activeAutomations >= 1 &&
          enabledNotificationRules >= 3 &&
          enabledChannels >= 2
            ? "Ready"
            : activeAutomations > 0 || enabledNotificationRules > 0
              ? "Watch"
              : "Needs setup",
        forecastWindow: "90 days",
        forecastSignal: `${activeAutomations} workflows / ${enabledChannels} delivery channels`,
        recommendation:
          activeAutomations >= 1 && enabledChannels >= 2
            ? "Use current automations and alert channels to compare forecast signals against what the team actually sees and responds to over time."
            : "Build the operational feedback loop first so forecast accuracy can be trusted and reviewed, not just displayed.",
        rationale:
          "Forecast trust grows when predicted demand can be compared against actual team actions, reminders, and operational follow-through.",
        actionLabel: "Open notifications",
        actionHref: "/tenant/integrations/notifications",
        updatedAt:
          communicationChannels[0]?.updatedAt ??
          notificationPreferences[0]?.updatedAt ??
          automations[0]?.updatedAt ??
          profile.updatedAt,
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
        forecast30Revenue,
        forecast90Revenue,
      },
      rows,
    };
  }),
});
