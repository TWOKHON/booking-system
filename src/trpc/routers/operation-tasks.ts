import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

type OperationTaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";
type OperationTaskPriority = "LOW" | "MEDIUM" | "HIGH";
type OperationTaskType =
  | "CLEAN_ROOM"
  | "DEEP_CLEAN"
  | "INSPECT_ROOM"
  | "MAINTENANCE"
  | "TURN_DOWN_SERVICE"
  | "OTHER";

const taskTypeLabels: Record<OperationTaskType, string> = {
  CLEAN_ROOM: "Clean Room",
  DEEP_CLEAN: "Deep Clean",
  INSPECT_ROOM: "Inspect Room",
  MAINTENANCE: "Maintenance",
  TURN_DOWN_SERVICE: "Turn Down Service",
  OTHER: "Other",
};

const statusLabels: Record<OperationTaskStatus, string> = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

const priorityLabels: Record<OperationTaskPriority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

const labelToTaskType = {
  "Clean Room": "CLEAN_ROOM",
  "Deep Clean": "DEEP_CLEAN",
  "Inspect Room": "INSPECT_ROOM",
  Maintenance: "MAINTENANCE",
  "Turn Down Service": "TURN_DOWN_SERVICE",
  Other: "OTHER",
} as const;

const labelToPriority = {
  Low: "LOW",
  Medium: "MEDIUM",
  High: "HIGH",
} as const;

const labelToStatus = {
  Pending: "PENDING",
  "In Progress": "IN_PROGRESS",
  Completed: "COMPLETED",
} as const;

const taskInputSchema = z.object({
  taskType: z.enum([
    "Clean Room",
    "Deep Clean",
    "Inspect Room",
    "Maintenance",
    "Turn Down Service",
    "Other",
  ]),
  priority: z.enum(["Low", "Medium", "High"]),
  roomId: z.string().trim().min(1),
  employeeId: z.string().trim().min(1),
  description: z.string().trim().min(3).max(500),
  scheduleDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),
  scheduleTime: z.string().regex(/^\d{2}:\d{2}$/).optional().or(z.literal("")),
  notifyAssignee: z.boolean().default(false),
  reportedBy: z.string().trim().min(1).max(120),
  source: z.string().trim().max(120).optional(),
  notes: z.string().trim().max(300).optional(),
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
      message: "Only tenant users can manage operation tasks.",
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

const initialsFromName = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "NA";

const parseScheduleAt = (date?: string, time?: string) => {
  if (!date) {
    return null;
  }

  return new Date(`${date}T${time || "09:00"}:00.000+08:00`);
};

const toDateInput = (date: Date | null) =>
  date ? date.toISOString().slice(0, 10) : "";

const toTimeInput = (date: Date | null) =>
  date
    ? new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Manila",
      }).format(date)
    : "";

const toTimeLabel = (date: Date | null) =>
  date
    ? new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Manila",
      }).format(date)
    : undefined;

function serializeTask(row: {
  id: string;
  roomId: string | null;
  employeeId: string | null;
  roomNo: string;
  roomType: string;
  taskType: OperationTaskType;
  description: string;
  status: OperationTaskStatus;
  assignee: string;
  initials: string;
  priority: OperationTaskPriority;
  scheduleAt: Date | null;
  notifyAssignee: boolean;
  reportedBy: string;
  source: string | null;
  notes: string | null;
  completedAt: Date | null;
}) {
  return {
    id: row.id,
    roomId: row.roomId ?? "",
    employeeId: row.employeeId ?? "",
    roomNo: row.roomNo,
    roomType: row.roomType,
    title: taskTypeLabels[row.taskType] as
      | "Clean Room"
      | "Deep Clean"
      | "Inspect Room"
      | "Maintenance"
      | "Turn Down Service"
      | "Other",
    description: row.description,
    status: statusLabels[row.status] as "Pending" | "In Progress" | "Completed",
    assignee: row.assignee,
    initials: row.initials,
    priority: priorityLabels[row.priority] as "Low" | "Medium" | "High",
    dueLabel:
      row.status === "IN_PROGRESS" && row.scheduleAt
        ? `ETA ${toTimeLabel(row.scheduleAt)}`
        : row.scheduleAt
          ? toTimeLabel(row.scheduleAt)
          : undefined,
    completedAt: row.completedAt ? toTimeLabel(row.completedAt) : undefined,
    scheduleDate: toDateInput(row.scheduleAt),
    scheduleTime: toTimeInput(row.scheduleAt),
    notifyAssignee: row.notifyAssignee,
    reportedBy: row.reportedBy,
    source: row.source ?? "",
    notes: row.notes ?? "",
  };
}

export const operationTasksRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const tenantProfile = requireTenantProfile(ctx);

    const rows = await ctx.db.tenantOperationTask.findMany({
      where: { tenantProfileId: tenantProfile.id },
      orderBy: [{ status: "asc" }, { priority: "desc" }, { createdAt: "desc" }],
      take: 200,
    });

    return rows.map(serializeTask);
  }),

  get: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);

      const row = await ctx.db.tenantOperationTask.findFirst({
        where: {
          id: input.id,
          tenantProfileId: tenantProfile.id,
        },
      });

      if (!row) {
        return null;
      }

      return serializeTask(row);
    }),

  create: protectedProcedure.input(taskInputSchema).mutation(async ({ ctx, input }) => {
    const tenantProfile = requireTenantProfile(ctx);
    const room = await ctx.db.tenantRoom.findFirst({
      where: {
        id: input.roomId,
        tenantProfileId: tenantProfile.id,
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

    const employee = await ctx.db.tenantEmployee.findFirst({
      where: {
        id: input.employeeId,
        tenantProfileId: tenantProfile.id,
        isActive: true,
      },
      select: {
        id: true,
        fullName: true,
      },
    });

    if (!employee) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Employee not found.",
      });
    }

    const row = await ctx.db.tenantOperationTask.create({
      data: {
        tenantProfileId: tenantProfile.id,
        roomId: room.id,
        employeeId: employee.id,
        taskType: labelToTaskType[input.taskType],
        priority: labelToPriority[input.priority],
        roomNo: room.roomName,
        roomType: room.category,
        description: input.description.trim(),
        status: "PENDING",
        assignee: employee.fullName,
        initials: initialsFromName(employee.fullName),
        scheduleAt: parseScheduleAt(input.scheduleDate, input.scheduleTime),
        notifyAssignee: input.notifyAssignee,
        reportedBy: input.reportedBy.trim(),
        source: input.source?.trim() || null,
        notes: input.notes?.trim() || null,
      },
    });

    return serializeTask(row);
  }),

  update: protectedProcedure
    .input(taskInputSchema.extend({ id: z.string().min(1), status: z.enum(["Pending", "In Progress", "Completed"]).optional() }))
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);

      const existing = await ctx.db.tenantOperationTask.findFirst({
        where: {
          id: input.id,
          tenantProfileId: tenantProfile.id,
        },
        select: { id: true },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found.",
        });
      }

      const room = await ctx.db.tenantRoom.findFirst({
        where: {
          id: input.roomId,
          tenantProfileId: tenantProfile.id,
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

      const employee = await ctx.db.tenantEmployee.findFirst({
        where: {
          id: input.employeeId,
          tenantProfileId: tenantProfile.id,
          isActive: true,
        },
        select: {
          id: true,
          fullName: true,
        },
      });

      if (!employee) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Employee not found.",
        });
      }

      const status = input.status ? labelToStatus[input.status] : undefined;
      const completedAt = status === "COMPLETED" ? new Date() : undefined;

      const row = await ctx.db.tenantOperationTask.update({
        where: { id: existing.id },
        data: {
          roomId: room.id,
          employeeId: employee.id,
          taskType: labelToTaskType[input.taskType],
          priority: labelToPriority[input.priority],
          roomNo: room.roomName,
          roomType: room.category,
          description: input.description.trim(),
          assignee: employee.fullName,
          initials: initialsFromName(employee.fullName),
          scheduleAt: parseScheduleAt(input.scheduleDate, input.scheduleTime),
          notifyAssignee: input.notifyAssignee,
          reportedBy: input.reportedBy.trim(),
          source: input.source?.trim() || null,
          notes: input.notes?.trim() || null,
          ...(status ? { status, completedAt } : {}),
        },
      });

      return serializeTask(row);
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        status: z.enum(["Pending", "In Progress", "Completed"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);

      const existing = await ctx.db.tenantOperationTask.findFirst({
        where: {
          id: input.id,
          tenantProfileId: tenantProfile.id,
        },
        select: { id: true },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found.",
        });
      }

      const status = labelToStatus[input.status];
      const row = await ctx.db.tenantOperationTask.update({
        where: { id: existing.id },
        data: {
          status,
          completedAt: status === "COMPLETED" ? new Date() : null,
        },
      });

      return serializeTask(row);
    }),
});
