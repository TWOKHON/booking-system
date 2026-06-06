import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

type RequestStatus =
  | "NEW"
  | "ACKNOWLEDGED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "ESCALATED";
type RequestPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
type RequestType =
  | "AMENITY"
  | "DINING"
  | "TRANSPORT"
  | "HOUSEKEEPING"
  | "MAINTENANCE"
  | "CONCIERGE"
  | "CONNECTIVITY";

const statusLabels: Record<RequestStatus, string> = {
  NEW: "New",
  ACKNOWLEDGED: "Acknowledged",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  ESCALATED: "Escalated",
};

const labelToStatus = {
  New: "NEW",
  Acknowledged: "ACKNOWLEDGED",
  "In Progress": "IN_PROGRESS",
  Completed: "COMPLETED",
  Escalated: "ESCALATED",
} as const;

const priorityLabels: Record<RequestPriority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
};

const labelToPriority = {
  Low: "LOW",
  Medium: "MEDIUM",
  High: "HIGH",
  Urgent: "URGENT",
} as const;

const typeLabels: Record<RequestType, string> = {
  AMENITY: "Amenity",
  DINING: "Dining",
  TRANSPORT: "Transport",
  HOUSEKEEPING: "Housekeeping",
  MAINTENANCE: "Maintenance",
  CONCIERGE: "Concierge",
  CONNECTIVITY: "Connectivity",
};

const labelToType = {
  Amenity: "AMENITY",
  Dining: "DINING",
  Transport: "TRANSPORT",
  Housekeeping: "HOUSEKEEPING",
  Maintenance: "MAINTENANCE",
  Concierge: "CONCIERGE",
  Connectivity: "CONNECTIVITY",
} as const;

type RequestStatusLabel = keyof typeof labelToStatus;
type RequestPriorityLabel = keyof typeof labelToPriority;
type RequestTypeLabel = keyof typeof labelToType;

const requestDateFilterSchema = z
  .object({
    date: z.coerce.date().optional(),
  })
  .optional();

const requestInputSchema = z.object({
  guestName: z.string().trim().min(1, "Guest name is required.").max(160),
  roomId: z.string().min(1).optional().or(z.literal("")),
  roomLabel: z.string().trim().max(120).optional().or(z.literal("")),
  type: z.enum([
    "Amenity",
    "Dining",
    "Transport",
    "Housekeeping",
    "Maintenance",
    "Concierge",
    "Connectivity",
  ]),
  title: z.string().trim().min(1, "Request title is required.").max(160),
  detail: z.string().trim().min(1, "Request details are required.").max(700),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]).default("Medium"),
  status: z
    .enum(["New", "Acknowledged", "In Progress", "Completed", "Escalated"])
    .default("New"),
  assignedTo: z.string().trim().min(1).max(120).default("Front Desk"),
  requestedAt: z.coerce.date().optional(),
  dueAt: z.coerce.date().optional(),
  revenueTag: z.string().trim().max(80).optional().or(z.literal("")),
});

function requireTenantProfile(ctx: {
  currentUser: {
    role: "ADMIN" | "TENANT" | "CUSTOMER";
    tenantProfile: { id: string } | null;
  } | null;
}) {
  if (!ctx.currentUser || ctx.currentUser.role !== "TENANT") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Only tenant users can manage guest requests.",
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

function getDateWhere(date?: Date) {
  if (!date) return {};

  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return {
    requestedAt: {
      gte: start,
      lt: end,
    },
  };
}

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: "Asia/Manila",
});

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "FD";
}

function getWaitMinutes(requestedAt: Date, status: RequestStatus) {
  if (status === "COMPLETED") return 0;

  return Math.max(0, Math.round((Date.now() - requestedAt.getTime()) / 60_000));
}

function serializeRequest(row: {
  id: string;
  roomId: string | null;
  requestNumber: string;
  guestName: string;
  roomLabel: string;
  requestType: RequestType;
  title: string;
  detail: string;
  priority: RequestPriority;
  status: RequestStatus;
  assignedTo: string;
  initials: string;
  requestedAt: Date;
  dueAt: Date | null;
  revenueTag: string;
}) {
  return {
    id: row.id,
    roomId: row.roomId,
    requestNumber: row.requestNumber,
    guestName: row.guestName,
    room: row.roomLabel,
    type: typeLabels[row.requestType] as RequestTypeLabel,
    title: row.title,
    detail: row.detail,
    priority: priorityLabels[row.priority] as RequestPriorityLabel,
    status: statusLabels[row.status] as RequestStatusLabel,
    assignedTo: row.assignedTo,
    initials: row.initials,
    requestedAt: timeFormatter.format(row.requestedAt),
    dueBy: row.dueAt ? timeFormatter.format(row.dueAt) : "-",
    waitMinutes: getWaitMinutes(row.requestedAt, row.status),
    revenueTag: row.revenueTag || "-",
  };
}

async function generateRequestNumber(ctx: {
  db: {
    tenantGuestRequest: {
      count: (args: { where: { tenantProfileId: string } }) => Promise<number>;
    };
  };
}, tenantProfileId: string) {
  const year = new Date().getFullYear();
  const count = await ctx.db.tenantGuestRequest.count({
    where: { tenantProfileId },
  });

  return `GR-${year}-${String(count + 1).padStart(4, "0")}`;
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
}, tenantProfileId: string, input: { roomId?: string; roomLabel?: string }) {
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
      roomLabel: `${room.roomName} ${room.category}`,
    };
  }

  return {
    roomId: null,
    roomLabel: input.roomLabel?.trim() || "Unassigned",
  };
}

export const guestRequestsRouter = createTRPCRouter({
  list: protectedProcedure.input(requestDateFilterSchema).query(async ({ ctx, input }) => {
    const tenantProfile = requireTenantProfile(ctx);
    const rows = await ctx.db.tenantGuestRequest.findMany({
      where: {
        tenantProfileId: tenantProfile.id,
        ...getDateWhere(input?.date),
      },
      orderBy: [{ requestedAt: "desc" }, { createdAt: "desc" }],
    });

    return rows.map(serializeRequest);
  }),

  summary: protectedProcedure.input(requestDateFilterSchema).query(async ({ ctx, input }) => {
    const tenantProfile = requireTenantProfile(ctx);
    const rows = await ctx.db.tenantGuestRequest.findMany({
      where: {
        tenantProfileId: tenantProfile.id,
        ...getDateWhere(input?.date),
      },
      orderBy: [{ requestedAt: "desc" }, { createdAt: "desc" }],
    });
    const requests = rows.map(serializeRequest);
    const totalRequests = requests.length;
    const openRequests = requests.filter(
      (request) => request.status !== "Completed",
    ).length;
    const escalated = requests.filter(
      (request) => request.status === "Escalated",
    ).length;
    const waitingOverThirty = requests.filter(
      (request) => request.waitMinutes >= 30,
    ).length;
    const revenueRequests = requests.filter(
      (request) => request.revenueTag !== "-",
    ).length;
    const responsePercent = totalRequests
      ? Math.round(((totalRequests - waitingOverThirty) / totalRequests) * 100)
      : 0;

    return {
      totalRequests,
      openRequests,
      escalated,
      waitingOverThirty,
      revenueRequests,
      responsePercent,
      alerts: [
        { label: "Escalated requests", value: escalated, tone: "bg-red-500" },
        {
          label: "Waiting over 30 mins",
          value: waitingOverThirty,
          tone: "bg-amber-500",
        },
        {
          label: "Revenue opportunities",
          value: revenueRequests,
          tone: "bg-green-600",
        },
      ],
      responseQueue: [...requests]
        .filter((request) => request.status !== "Completed")
        .sort((a, b) => b.waitMinutes - a.waitMinutes)
        .slice(0, 4),
      revenueOpportunities: requests
        .filter((request) => request.revenueTag !== "-")
        .slice(0, 4),
    };
  }),

  create: protectedProcedure.input(requestInputSchema).mutation(async ({ ctx, input }) => {
    const tenantProfile = requireTenantProfile(ctx);
    const roomData = await resolveRoomData(ctx, tenantProfile.id, {
      roomId: input.roomId || undefined,
      roomLabel: input.roomLabel || undefined,
    });
    const requestNumber = await generateRequestNumber(ctx, tenantProfile.id);
    const row = await ctx.db.tenantGuestRequest.create({
      data: {
        tenantProfileId: tenantProfile.id,
        requestNumber,
        guestName: input.guestName,
        roomId: roomData.roomId,
        roomLabel: roomData.roomLabel,
        requestType: labelToType[input.type],
        title: input.title,
        detail: input.detail,
        priority: labelToPriority[input.priority],
        status: labelToStatus[input.status],
        assignedTo: input.assignedTo,
        initials: initials(input.assignedTo),
        requestedAt: input.requestedAt ?? new Date(),
        dueAt: input.dueAt ?? null,
        revenueTag: input.revenueTag?.trim() || "-",
      },
    });

    return serializeRequest(row);
  }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        status: z.enum([
          "New",
          "Acknowledged",
          "In Progress",
          "Completed",
          "Escalated",
        ]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);
      const existing = await ctx.db.tenantGuestRequest.findFirst({
        where: {
          id: input.id,
          tenantProfileId: tenantProfile.id,
        },
        select: { id: true },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Guest request not found.",
        });
      }

      const row = await ctx.db.tenantGuestRequest.update({
        where: { id: existing.id },
        data: {
          status: labelToStatus[input.status],
        },
      });

      return serializeRequest(row);
    }),

  acknowledgeAll: protectedProcedure
    .input(requestDateFilterSchema)
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);
      const result = await ctx.db.tenantGuestRequest.updateMany({
        where: {
          tenantProfileId: tenantProfile.id,
          status: "NEW",
          ...getDateWhere(input?.date),
        },
        data: {
          status: "ACKNOWLEDGED",
        },
      });

      return { count: result.count };
    }),
});
