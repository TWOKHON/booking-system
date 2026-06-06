import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

type ArrivalStatus = "DUE_IN" | "ARRIVED" | "EARLY" | "DELAYED" | "VIP";
type ArrivalReadiness = "READY" | "INSPECTING" | "DIRTY" | "BLOCKED";

const statusLabels: Record<ArrivalStatus, string> = {
  DUE_IN: "Due In",
  ARRIVED: "Arrived",
  EARLY: "Early",
  DELAYED: "Delayed",
  VIP: "VIP",
};

const labelToStatus = {
  "Due In": "DUE_IN",
  Arrived: "ARRIVED",
  Early: "EARLY",
  Delayed: "DELAYED",
  VIP: "VIP",
} as const;

const readinessLabels: Record<ArrivalReadiness, string> = {
  READY: "Ready",
  INSPECTING: "Inspecting",
  DIRTY: "Dirty",
  BLOCKED: "Blocked",
};

const labelToReadiness = {
  Ready: "READY",
  Inspecting: "INSPECTING",
  Dirty: "DIRTY",
  Blocked: "BLOCKED",
} as const;

type ArrivalStatusLabel = keyof typeof labelToStatus;
type ArrivalReadinessLabel = keyof typeof labelToReadiness;

function requireTenantProfile(ctx: {
  currentUser: {
    role: "ADMIN" | "TENANT" | "CUSTOMER";
    tenantProfile: { id: string } | null;
  } | null;
}) {
  if (!ctx.currentUser || ctx.currentUser.role !== "TENANT") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Only tenant users can manage arrivals.",
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

const pesoFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: "Asia/Manila",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "Asia/Manila",
});

function formatBalance(cents: number) {
  return pesoFormatter.format(cents / 100);
}

function serializeArrival(row: {
  id: string;
  roomId: string | null;
  guestName: string;
  reservationCode: string;
  roomLabel: string;
  roomType: string;
  arrivalAt: Date;
  nights: number;
  party: string;
  status: ArrivalStatus;
  roomReadiness: ArrivalReadiness;
  balanceCents: number;
  notes: string | null;
}) {
  return {
    id: row.id,
    roomId: row.roomId,
    guestName: row.guestName,
    reservationCode: row.reservationCode,
    room: row.roomLabel,
    roomType: row.roomType,
    arrivalTime: timeFormatter.format(row.arrivalAt),
    arrivalDate: dateFormatter.format(row.arrivalAt),
    nights: row.nights,
    party: row.party,
    status: statusLabels[row.status] as ArrivalStatusLabel,
    roomReadiness: readinessLabels[row.roomReadiness] as ArrivalReadinessLabel,
    balance: formatBalance(row.balanceCents),
    balanceCents: row.balanceCents,
    notes: row.notes ?? "-",
  };
}

const arrivalInputSchema = z.object({
  guestName: z.string().trim().min(1, "Guest name is required.").max(160),
  reservationCode: z.string().trim().max(80).optional().or(z.literal("")),
  roomId: z.string().min(1).optional().or(z.literal("")),
  roomLabel: z.string().trim().max(120).optional().or(z.literal("")),
  roomType: z.string().trim().max(120).optional().or(z.literal("")),
  arrivalAt: z.coerce.date(),
  nights: z.number().int().min(1).max(365),
  party: z.string().trim().min(1, "Party is required.").max(120),
  status: z.enum(["Due In", "Arrived", "Early", "Delayed", "VIP"]).default("Due In"),
  roomReadiness: z
    .enum(["Ready", "Inspecting", "Dirty", "Blocked"])
    .default("Ready"),
  balanceCents: z.number().int().min(0).max(100_000_000).default(0),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

const arrivalDateFilterSchema = z
  .object({
    date: z.coerce.date().optional(),
  })
  .optional();

function getArrivalDateWhere(date?: Date) {
  if (!date) return {};

  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return {
    arrivalAt: {
      gte: start,
      lt: end,
    },
  };
}

async function generateReservationCode(ctx: {
  db: {
    tenantArrival: {
      count: (args: { where: { tenantProfileId: string } }) => Promise<number>;
    };
  };
}, tenantProfileId: string) {
  const year = new Date().getFullYear();
  const count = await ctx.db.tenantArrival.count({
    where: { tenantProfileId },
  });

  return `RSV-${year}-${String(count + 1).padStart(4, "0")}`;
}

async function resolveRoomData(ctx: {
  db: {
    tenantRoom: {
      findFirst: (args: {
        where: { id: string; tenantProfileId: string; isActive: true };
        select: { id: true; roomName: true; category: true };
      }) => Promise<{ id: string; roomName: string; category: string } | null>;
    };
  };
}, tenantProfileId: string, input: {
  roomId?: string;
  roomLabel?: string;
  roomType?: string;
}) {
  if (input.roomId) {
    const room = await ctx.db.tenantRoom.findFirst({
      where: {
        id: input.roomId,
        tenantProfileId,
        isActive: true,
      },
      select: {
        id: true,
        roomName: true,
        category: true,
      },
    });

    if (!room) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Room not found.",
      });
    }

    return {
      roomId: room.id,
      roomLabel: room.roomName,
      roomType: room.category,
    };
  }

  return {
    roomId: null,
    roomLabel: input.roomLabel?.trim() || "Unassigned",
    roomType: input.roomType?.trim() || "Unassigned",
  };
}

export const arrivalsRouter = createTRPCRouter({
  list: protectedProcedure.input(arrivalDateFilterSchema).query(async ({ ctx, input }) => {
    const tenantProfile = requireTenantProfile(ctx);

    const rows = await ctx.db.tenantArrival.findMany({
      where: {
        tenantProfileId: tenantProfile.id,
        ...getArrivalDateWhere(input?.date),
      },
      orderBy: [{ arrivalAt: "asc" }, { createdAt: "asc" }],
    });

    return rows.map(serializeArrival);
  }),

  summary: protectedProcedure.input(arrivalDateFilterSchema).query(async ({ ctx, input }) => {
    const tenantProfile = requireTenantProfile(ctx);
    const rows = await ctx.db.tenantArrival.findMany({
      where: {
        tenantProfileId: tenantProfile.id,
        ...getArrivalDateWhere(input?.date),
      },
      orderBy: [{ arrivalAt: "asc" }, { createdAt: "asc" }],
    });
    const arrivals = rows.map(serializeArrival);
    const totalArrivals = arrivals.length;
    const arrived = arrivals.filter((arrival) => arrival.status === "Arrived").length;
    const roomsReady = arrivals.filter(
      (arrival) => arrival.roomReadiness === "Ready",
    ).length;
    const openBalances = arrivals.filter(
      (arrival) => arrival.balanceCents > 0,
    ).length;
    const vipArrivals = arrivals.filter((arrival) => arrival.status === "VIP").length;
    const delayed = arrivals.filter((arrival) => arrival.status === "Delayed").length;
    const roomsNotReady = arrivals.filter(
      (arrival) => arrival.roomReadiness !== "Ready",
    ).length;

    return {
      totalArrivals,
      arrived,
      roomsReady,
      openBalances,
      vipArrivals,
      delayed,
      roomsNotReady,
      readyPercent: totalArrivals
        ? Math.round((roomsReady / totalArrivals) * 100)
        : 0,
      arrivalPercent: totalArrivals
        ? Math.round((arrived / totalArrivals) * 100)
        : 0,
      alerts: [
        { label: "Rooms not ready", value: roomsNotReady, tone: "bg-amber-500" },
        { label: "Open balances", value: openBalances, tone: "bg-red-500" },
        { label: "VIP arrivals", value: vipArrivals, tone: "bg-violet-500" },
      ],
      timeline: arrivals.slice(0, 6).map((arrival) => ({
        time: arrival.arrivalTime,
        label: arrival.status === "Arrived" ? "Arrived" : "Due arrival",
        detail: `${arrival.guestName}, Room ${arrival.room}`,
      })),
      notReady: arrivals.filter((arrival) => arrival.roomReadiness !== "Ready"),
    };
  }),

  create: protectedProcedure.input(arrivalInputSchema).mutation(async ({ ctx, input }) => {
    const tenantProfile = requireTenantProfile(ctx);
    const roomData = await resolveRoomData(ctx, tenantProfile.id, {
      roomId: input.roomId || undefined,
      roomLabel: input.roomLabel || undefined,
      roomType: input.roomType || undefined,
    });
    const reservationCode =
      input.reservationCode?.trim() ||
      (await generateReservationCode(ctx, tenantProfile.id));

    try {
      const row = await ctx.db.tenantArrival.create({
        data: {
          tenantProfileId: tenantProfile.id,
          reservationCode,
          guestName: input.guestName,
          roomId: roomData.roomId,
          roomLabel: roomData.roomLabel,
          roomType: roomData.roomType,
          arrivalAt: input.arrivalAt,
          nights: input.nights,
          party: input.party,
          status: labelToStatus[input.status],
          roomReadiness: labelToReadiness[input.roomReadiness],
          balanceCents: input.balanceCents,
          notes: input.notes?.trim() || null,
        },
      });

      return serializeArrival(row);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("tenant_arrival_tenantProfileId_reservationCode_key")
      ) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A reservation with that code already exists.",
        });
      }

      throw error;
    }
  }),

  markArrived: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);
      const existing = await ctx.db.tenantArrival.findFirst({
        where: {
          id: input.id,
          tenantProfileId: tenantProfile.id,
        },
        select: { id: true },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Arrival not found.",
        });
      }

      const row = await ctx.db.tenantArrival.update({
        where: { id: existing.id },
        data: { status: "ARRIVED" },
      });

      return serializeArrival(row);
    }),

  markNextArrived: protectedProcedure.mutation(async ({ ctx }) => {
    const tenantProfile = requireTenantProfile(ctx);
    const existing = await ctx.db.tenantArrival.findFirst({
      where: {
        tenantProfileId: tenantProfile.id,
        status: { in: ["DUE_IN", "EARLY", "DELAYED", "VIP"] },
      },
      orderBy: [{ arrivalAt: "asc" }, { createdAt: "asc" }],
      select: { id: true, guestName: true },
    });

    if (!existing) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No pending arrivals to check in.",
      });
    }

    const row = await ctx.db.tenantArrival.update({
      where: { id: existing.id },
      data: { status: "ARRIVED" },
    });

    return serializeArrival(row);
  }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        status: z.enum(["Due In", "Arrived", "Early", "Delayed", "VIP"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);
      const existing = await ctx.db.tenantArrival.findFirst({
        where: {
          id: input.id,
          tenantProfileId: tenantProfile.id,
        },
        select: { id: true },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Arrival not found.",
        });
      }

      const row = await ctx.db.tenantArrival.update({
        where: { id: existing.id },
        data: { status: labelToStatus[input.status] },
      });

      return serializeArrival(row);
    }),
});
