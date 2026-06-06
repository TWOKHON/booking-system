import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

type RateSignal = "Lift" | "Hold" | "Watch";
type RatePosition = "Premium" | "Core" | "Value";

function requireTenantProfile(ctx: {
  currentUser: {
    role: "ADMIN" | "TENANT" | "CUSTOMER";
    tenantProfile: { id: string } | null;
  } | null;
}) {
  if (!ctx.currentUser || ctx.currentUser.role !== "TENANT") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Only tenant users can access rates.",
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

export const ratesRouter = createTRPCRouter({
  overview: protectedProcedure.query(async ({ ctx }) => {
    const tenantProfile = requireTenantProfile(ctx);

    const [profile, rooms, automations, notifications] = await Promise.all([
      ctx.db.tenantProfile.findUnique({
        where: { id: tenantProfile.id },
      }),
      ctx.db.tenantRoom.findMany({
        where: {
          tenantProfileId: tenantProfile.id,
          isActive: true,
        },
        orderBy: [{ baseNightlyRate: "desc" }, { updatedAt: "desc" }],
      }),
      ctx.db.tenantAutomationWorkflow.findMany({
        where: { tenantProfileId: tenantProfile.id },
        orderBy: { updatedAt: "desc" },
      }),
      ctx.db.tenantNotificationPreference.findMany({
        where: { tenantProfileId: tenantProfile.id, enabled: true },
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
    const highestRate = rooms[0]?.baseNightlyRate ?? 0;
    const lowestRate = rooms[rooms.length - 1]?.baseNightlyRate ?? 0;
    const activeAutomations = automations.filter(
      (workflow) => workflow.status === "ACTIVE",
    ).length;
    const notificationCoverage = notifications.length;

    const rows = rooms.map((room, index) => {
      const rateDelta = room.baseNightlyRate - averageRate;
      const position: RatePosition =
        room.baseNightlyRate >= averageRate * 1.18
          ? "Premium"
          : room.baseNightlyRate <= averageRate * 0.88
            ? "Value"
            : "Core";
      const demandBias = clamp(
        Math.round(
          room.sellableUnits * 2 +
            room.capacity * 3 +
            activeAutomations * 2 -
            index,
        ),
        2,
        28,
      );
      const signal: RateSignal =
        rateDelta < -500 && demandBias >= 12
          ? "Lift"
          : room.sellableUnits >= 4 && rateDelta > 900
            ? "Watch"
            : "Hold";
      const suggestedMove =
        signal === "Lift"
          ? "Test a firmer base rate for upcoming higher-intent demand."
          : signal === "Watch"
            ? "Protect conversion by pairing the rate with stronger value cues."
            : "Keep pricing steady and monitor pace before adjusting.";
      const floor = Math.max(0, room.baseNightlyRate - 600);
      const ceiling = room.baseNightlyRate + 900;

      return {
        id: room.id,
        roomName: room.roomName,
        category: room.category,
        rate: room.baseNightlyRate,
        sellableUnits: room.sellableUnits,
        capacity: room.capacity,
        zone: room.zone ?? "Main Area",
        position,
        signal,
        demandBias,
        recommendedBand: `PHP ${floor.toLocaleString("en-PH")} - PHP ${ceiling.toLocaleString("en-PH")}`,
        suggestedMove,
        actionLabel: "Open rooms",
        actionHref: "/tenant/settings/rooms",
        updatedAt: room.updatedAt,
      };
    });

    const chartData = rows.map((row) => ({
      roomName:
        row.roomName.length > 16 ? `${row.roomName.slice(0, 16)}…` : row.roomName,
      rate: row.rate,
      units: row.sellableUnits,
    }));

    const categoryMap = new Map<
      string,
      { rooms: number; avgRateTotal: number; units: number }
    >();

    for (const room of rooms) {
      const current = categoryMap.get(room.category) ?? {
        rooms: 0,
        avgRateTotal: 0,
        units: 0,
      };
      current.rooms += 1;
      current.avgRateTotal += room.baseNightlyRate;
      current.units += room.sellableUnits;
      categoryMap.set(room.category, current);
    }

    const categoryMix = Array.from(categoryMap.entries()).map(
      ([category, value]) => ({
        category,
        avgRate: Math.round(value.avgRateTotal / value.rooms),
        units: value.units,
      }),
    );

    const liftSignals = rows.filter((row) => row.signal === "Lift").length;
    const watchSignals = rows.filter((row) => row.signal === "Watch").length;

    return {
      summary: {
        roomCount: rooms.length,
        totalUnits,
        averageRate,
        highestRate,
        lowestRate,
        liftSignals,
        watchSignals,
        notificationCoverage,
      },
      chartData,
      categoryMix,
      rows,
    };
  }),
});
