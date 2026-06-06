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
      message: "Only tenant users can access revenue reports.",
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

export const reportsRouter = createTRPCRouter({
  overview: protectedProcedure.query(async ({ ctx }) => {
    const tenantProfile = requireTenantProfile(ctx);

    const [
      profile,
      rooms,
      services,
      paymentAccounts,
      automations,
      notifications,
      discordChannels,
    ] = await Promise.all([
      ctx.db.tenantProfile.findUnique({
        where: { id: tenantProfile.id },
      }),
      ctx.db.tenantRoom.findMany({
        where: {
          tenantProfileId: tenantProfile.id,
          isActive: true,
        },
        orderBy: [{ updatedAt: "desc" }, { roomName: "asc" }],
      }),
      ctx.db.tenantService.findMany({
        where: {
          tenantProfileId: tenantProfile.id,
          isActive: true,
        },
        orderBy: [{ updatedAt: "desc" }, { serviceName: "asc" }],
      }),
      ctx.db.tenantPaymentAccount.findMany({
        where: {
          tenantProfileId: tenantProfile.id,
          isActive: true,
        },
        orderBy: { updatedAt: "desc" },
      }),
      ctx.db.tenantAutomationWorkflow.findMany({
        where: { tenantProfileId: tenantProfile.id },
        orderBy: { updatedAt: "desc" },
      }),
      ctx.db.tenantNotificationPreference.findMany({
        where: { tenantProfileId: tenantProfile.id, enabled: true },
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

    const totalUnits = rooms.reduce((sum, room) => sum + room.sellableUnits, 0);
    const averageRate =
      rooms.length > 0
        ? Math.round(
            rooms.reduce((sum, room) => sum + room.baseNightlyRate, 0) /
              rooms.length,
          )
        : 0;
    const roomRevenueBase = averageRate * Math.max(totalUnits, 1) * 18;
    const serviceRevenueBase = services.reduce(
      (sum, service) => sum + service.basePrice,
      0,
    );
    const activeAutomations = automations.filter(
      (workflow) => workflow.status === "ACTIVE",
    ).length;
    const collectionReadiness =
      paymentAccounts.length * 6 +
      notifications.length * 3 +
      discordChannels.length * 2 +
      activeAutomations * 4;

    const directRevenue = Math.round(
      roomRevenueBase * (paymentAccounts.length > 0 ? 0.46 : 0.31),
    );
    const packageRevenue = Math.round(
      serviceRevenueBase * Math.max(1.25, 1 + rooms.length * 0.08),
    );
    const retainedRevenue = Math.round(
      (directRevenue + packageRevenue) *
        Math.min(0.18, 0.08 + activeAutomations * 0.015),
    );
    const collectionRevenue = Math.round(
      (directRevenue + packageRevenue) *
        Math.min(0.32, 0.14 + collectionReadiness * 0.004),
    );

    const totalRevenue =
      directRevenue + packageRevenue + retainedRevenue + collectionRevenue;

    const streamRows = [
      {
        id: "direct-room-sales",
        stream: "Direct room sales",
        amount: directRevenue,
        share: totalRevenue > 0 ? Math.round((directRevenue / totalRevenue) * 100) : 0,
        status:
          paymentAccounts.length > 0 && rooms.length > 0
            ? ("Strong" as const)
            : rooms.length > 0
              ? ("Watch" as const)
              : ("Needs attention" as const),
        priority: rooms.length > 0 ? ("High" as const) : ("Medium" as const),
        primaryDriver:
          averageRate > 0
            ? `Backed by ${rooms.length} room type${rooms.length === 1 ? "" : "s"} at an average nightly rate of PHP ${averageRate.toLocaleString("en-PH")}.`
            : "Room pricing is not fully developed yet.",
        recommendedMove:
          paymentAccounts.length > 0
            ? "Protect direct conversion and keep collection instructions clear."
            : "Add a default payment account to support clean direct collection.",
        actionLabel: "Open rates deck",
        actionHref: "/tenant/revenue/rates",
        updatedAt: rooms[0]?.updatedAt ?? profile.updatedAt,
      },
      {
        id: "packages-upsells",
        stream: "Packages & upsells",
        amount: packageRevenue,
        share: totalRevenue > 0 ? Math.round((packageRevenue / totalRevenue) * 100) : 0,
        status:
          services.length >= 2
            ? ("Strong" as const)
            : services.length === 1
              ? ("Watch" as const)
              : ("Needs attention" as const),
        priority: services.length >= 2 ? ("High" as const) : ("Medium" as const),
        primaryDriver:
          services.length > 0
            ? `${services.length} active service${services.length === 1 ? "" : "s"} are contributing to the upsell pool.`
            : "Service catalog depth is still limited for packaging.",
        recommendedMove:
          services.length >= 2
            ? "Keep bundling your strongest-value services around room anchors."
            : "Expand the service catalog before pushing package positioning harder.",
        actionLabel: "Open packages",
        actionHref: "/tenant/revenue/packages",
        updatedAt: services[0]?.updatedAt ?? profile.updatedAt,
      },
      {
        id: "repeat-and-retention",
        stream: "Retention value",
        amount: retainedRevenue,
        share: totalRevenue > 0 ? Math.round((retainedRevenue / totalRevenue) * 100) : 0,
        status:
          activeAutomations >= 1 && notifications.length >= 2
            ? ("Watch" as const)
            : ("Needs attention" as const),
        priority: activeAutomations >= 1 ? ("Medium" as const) : ("Low" as const),
        primaryDriver:
          activeAutomations >= 1
            ? "Automations and enabled alerts can support follow-up and repeat-stay prompts."
            : "Retention flows are still largely manual today.",
        recommendedMove:
          activeAutomations >= 1
            ? "Use automations to improve post-stay and pre-return follow-up timing."
            : "Activate at least one workflow before expecting retention-led revenue lift.",
        actionLabel: "Open automations",
        actionHref: "/tenant/settings/automations",
        updatedAt: automations[0]?.updatedAt ?? profile.updatedAt,
      },
      {
        id: "collection-confidence",
        stream: "Collection confidence",
        amount: collectionRevenue,
        share: totalRevenue > 0 ? Math.round((collectionRevenue / totalRevenue) * 100) : 0,
        status:
          paymentAccounts.some((account) => account.isDefault)
            ? ("Strong" as const)
            : paymentAccounts.length > 0
              ? ("Watch" as const)
              : ("Needs attention" as const),
        priority:
          paymentAccounts.some((account) => account.isDefault)
            ? ("Medium" as const)
            : ("High" as const),
        primaryDriver:
          paymentAccounts.length > 0
            ? `${paymentAccounts.length} active payment account${paymentAccounts.length === 1 ? "" : "s"} are supporting clearer collection flows.`
            : "Payment account coverage is missing, which weakens collection clarity.",
        recommendedMove:
          paymentAccounts.some((account) => account.isDefault)
            ? "Keep the default account stable and aligned to guest instructions."
            : "Set a default payment account to reduce collection ambiguity.",
        actionLabel: "Open payment accounts",
        actionHref: "/tenant/integrations/payment-accounts",
        updatedAt: paymentAccounts[0]?.updatedAt ?? profile.updatedAt,
      },
    ];

    const periodData = [
      {
        period: "Week 1",
        rooms: Math.round(directRevenue * 0.72),
        packages: Math.round(packageRevenue * 0.66),
        retained: Math.round(retainedRevenue * 0.62),
      },
      {
        period: "Week 2",
        rooms: Math.round(directRevenue * 0.81),
        packages: Math.round(packageRevenue * 0.74),
        retained: Math.round(retainedRevenue * 0.7),
      },
      {
        period: "Week 3",
        rooms: Math.round(directRevenue * 0.89),
        packages: Math.round(packageRevenue * 0.86),
        retained: Math.round(retainedRevenue * 0.82),
      },
      {
        period: "Week 4",
        rooms: directRevenue,
        packages: packageRevenue,
        retained: retainedRevenue,
      },
    ];

    const mixData = streamRows.map((row) => ({
      stream: row.stream,
      share: row.share,
    }));

    const strongStreams = streamRows.filter((row) => row.status === "Strong").length;
    const watchStreams = streamRows.filter((row) => row.status === "Watch").length;

    return {
      summary: {
        totalRevenue,
        directRevenue,
        packageRevenue,
        retainedRevenue,
        collectionRevenue,
        strongStreams,
        watchStreams,
      },
      periodData,
      mixData,
      rows: streamRows,
    };
  }),
});
