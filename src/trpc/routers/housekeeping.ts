import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

type HousekeepingStatus =
  | "CLEAN"
  | "OCCUPIED_DIRTY"
  | "VACANT_DIRTY"
  | "OUT_OF_ORDER"
  | "OUT_OF_SERVICE";
type HousekeepingOccupancy = "VACANT" | "OCCUPIED" | "NONE";

const statusLabels: Record<HousekeepingStatus, string> = {
  CLEAN: "Clean",
  OCCUPIED_DIRTY: "Occupied (Dirty)",
  VACANT_DIRTY: "Vacant (Dirty)",
  OUT_OF_ORDER: "Out of Order",
  OUT_OF_SERVICE: "Out of Service",
};

type HousekeepingStatusLabel =
  | "Clean"
  | "Occupied (Dirty)"
  | "Vacant (Dirty)"
  | "Out of Order"
  | "Out of Service";
type TaskStatusLabel = "Pending" | "In Progress" | "Completed" | "Overdue";

const occupancyLabels: Record<HousekeepingOccupancy, string> = {
  VACANT: "Vacant",
  OCCUPIED: "Occupied",
  NONE: "-",
};

const labelToStatus = {
  Clean: "CLEAN",
  "Occupied (Dirty)": "OCCUPIED_DIRTY",
  "Vacant (Dirty)": "VACANT_DIRTY",
  "Out of Order": "OUT_OF_ORDER",
  "Out of Service": "OUT_OF_SERVICE",
} as const;

const labelToOccupancy = {
  Vacant: "VACANT",
  Occupied: "OCCUPIED",
  "-": "NONE",
} as const;

function requireTenantProfile(ctx: {
  currentUser: {
    role: "ADMIN" | "TENANT" | "CUSTOMER";
    tenantProfile: { id: string } | null;
  } | null;
}) {
  if (!ctx.currentUser || ctx.currentUser.role !== "TENANT") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Only tenant users can manage housekeeping.",
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

const formatDateTime = (date: Date | null) =>
  date
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Manila",
      }).format(date)
    : "-";

function serializeRoom(row: {
  id: string;
  room: {
    id: string;
    roomName: string;
    category: string;
  };
  status: HousekeepingStatus;
  occupancy: HousekeepingOccupancy;
  assignedTo: string | null;
  lastCleanedAt: Date | null;
  notes: string | null;
}) {
  return {
    id: row.id,
    roomId: row.room.id,
    roomNo: row.room.roomName,
    roomType: row.room.category,
    status: statusLabels[row.status] as
      | "Clean"
      | "Occupied (Dirty)"
      | "Vacant (Dirty)"
      | "Out of Order"
      | "Out of Service",
    occupancy: occupancyLabels[row.occupancy] as "Vacant" | "Occupied" | "-",
    assignedTo: row.assignedTo ?? "-",
    lastCleaned: formatDateTime(row.lastCleanedAt),
    notes: row.notes ?? "-",
  };
}

async function syncHousekeepingRooms(ctx: {
  db: {
    tenantRoom: {
      findMany: (args: {
        where: { tenantProfileId: string; isActive: true };
        select: { id: true } | { id: true; roomName: true; category: true };
      }) => Promise<Array<{ id: string }>>;
    };
    tenantHousekeepingRoom: {
      findMany: (args: {
        where: { tenantProfileId: string };
        select: { roomId: true };
      }) => Promise<Array<{ roomId: string }>>;
      createMany: (args: {
        data: Array<{ tenantProfileId: string; roomId: string }>;
        skipDuplicates: true;
      }) => Promise<unknown>;
    };
  };
}, tenantProfileId: string) {
  const [rooms, existingStates] = await Promise.all([
    ctx.db.tenantRoom.findMany({
      where: { tenantProfileId, isActive: true },
      select: { id: true },
    }),
    ctx.db.tenantHousekeepingRoom.findMany({
      where: { tenantProfileId },
      select: { roomId: true },
    }),
  ]);
  const existingRoomIds = new Set(existingStates.map((state) => state.roomId));
  const missingRooms = rooms.filter((room) => !existingRoomIds.has(room.id));

  if (missingRooms.length > 0) {
    await ctx.db.tenantHousekeepingRoom.createMany({
      data: missingRooms.map((room) => ({
        tenantProfileId,
        roomId: room.id,
      })),
      skipDuplicates: true,
    });
  }
}

export const housekeepingRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const tenantProfile = requireTenantProfile(ctx);

    await syncHousekeepingRooms(ctx, tenantProfile.id);

    const rows = await ctx.db.tenantHousekeepingRoom.findMany({
      where: {
        tenantProfileId: tenantProfile.id,
        room: { isActive: true },
      },
      include: {
        room: {
          select: {
            id: true,
            roomName: true,
            category: true,
          },
        },
      },
      orderBy: [{ room: { roomName: "asc" } }],
    });

    return rows.map(serializeRoom);
  }),

  summary: protectedProcedure.query(async ({ ctx }) => {
    const tenantProfile = requireTenantProfile(ctx);

    await syncHousekeepingRooms(ctx, tenantProfile.id);

    const [rooms, tasks] = await Promise.all([
      ctx.db.tenantHousekeepingRoom.findMany({
        where: {
          tenantProfileId: tenantProfile.id,
          room: { isActive: true },
        },
        select: {
          status: true,
        },
      }),
      ctx.db.tenantOperationTask.findMany({
        where: {
          tenantProfileId: tenantProfile.id,
          taskType: {
            in: ["CLEAN_ROOM", "DEEP_CLEAN", "INSPECT_ROOM", "TURN_DOWN_SERVICE"],
          },
        },
        select: {
          status: true,
          scheduleAt: true,
        },
      }),
    ]);
    const totalRooms = rooms.length;
    const statusOrder: HousekeepingStatus[] = [
      "CLEAN",
      "OCCUPIED_DIRTY",
      "VACANT_DIRTY",
      "OUT_OF_ORDER",
      "OUT_OF_SERVICE",
    ];
    const roomStatusSummary = statusOrder.map((status) => {
      const count = rooms.filter((room) => room.status === status).length;

      return {
        status: statusLabels[status] as HousekeepingStatusLabel,
        count,
        percent: totalRooms ? Math.round((count / totalRooms) * 100) : 0,
      };
    });
    const now = new Date();
    const pending = tasks.filter((task) => task.status === "PENDING").length;
    const inProgress = tasks.filter((task) => task.status === "IN_PROGRESS").length;
    const completed = tasks.filter((task) => task.status === "COMPLETED").length;
    const overdue = tasks.filter(
      (task) =>
        task.status !== "COMPLETED" &&
        task.scheduleAt !== null &&
        task.scheduleAt < now,
    ).length;
    const totalTasks = pending + inProgress + completed + overdue;
    const taskSeed: Array<{ status: TaskStatusLabel; count: number }> = [
      { status: "Pending", count: pending },
      { status: "In Progress", count: inProgress },
      { status: "Completed", count: completed },
      { status: "Overdue", count: overdue },
    ];
    const taskSummary = taskSeed.map((task) => ({
      ...task,
      percent: totalTasks ? Math.round((task.count / totalTasks) * 100) : 0,
    }));

    return {
      totalRooms,
      roomStatusSummary,
      taskSummary,
    };
  }),

  updateRoom: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        status: z
          .enum([
            "Clean",
            "Occupied (Dirty)",
            "Vacant (Dirty)",
            "Out of Order",
            "Out of Service",
          ])
          .optional(),
        occupancy: z.enum(["Vacant", "Occupied", "-"]).optional(),
        assignedTo: z.string().trim().max(120).optional(),
        notes: z.string().trim().max(240).optional(),
        markCleaned: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);

      const existing = await ctx.db.tenantHousekeepingRoom.findFirst({
        where: {
          id: input.id,
          tenantProfileId: tenantProfile.id,
        },
        select: { id: true },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Housekeeping room not found.",
        });
      }

      const row = await ctx.db.tenantHousekeepingRoom.update({
        where: { id: existing.id },
        data: {
          ...(input.status ? { status: labelToStatus[input.status] } : {}),
          ...(input.occupancy
            ? { occupancy: labelToOccupancy[input.occupancy] }
            : {}),
          ...(typeof input.assignedTo === "string"
            ? { assignedTo: input.assignedTo.trim() || null }
            : {}),
          ...(typeof input.notes === "string"
            ? { notes: input.notes.trim() || null }
            : {}),
          ...(input.markCleaned ? { lastCleanedAt: new Date() } : {}),
        },
        include: {
          room: {
            select: {
              id: true,
              roomName: true,
              category: true,
            },
          },
        },
      });

      return serializeRoom(row);
    }),
});
