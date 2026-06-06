import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

const leaveStatusValues = ["PENDING", "APPROVED", "REJECTED"] as const;

const createLeaveSchema = z.object({
  employeeId: z.string().min(1),
  leaveType: z.string().trim().min(2).max(80),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.string().trim().min(4).max(1000),
});

const bulkUpdateSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
  status: z.enum(leaveStatusValues),
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
      message: "Only tenant users can manage leave applications.",
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

function parseIsoDate(dateIso: string) {
  // Normalize to UTC midnight to avoid timezone off-by-one in storage.
  return new Date(`${dateIso}T00:00:00.000Z`);
}

function diffDaysInclusive(start: Date, end: Date) {
  const ms = end.getTime() - start.getTime();
  return Math.floor(ms / (24 * 60 * 60 * 1000)) + 1;
}

export const leaveApplicationsRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const tenantProfile = requireTenantProfile(ctx);

    const rows = await ctx.db.tenantLeaveApplication.findMany({
      where: {
        tenantProfileId: tenantProfile.id,
      },
      orderBy: [{ requestedAt: "desc" }, { updatedAt: "desc" }],
      include: {
        employee: {
          select: {
            id: true,
            fullName: true,
            department: true,
          },
        },
      },
    });

    return rows.map((row) => ({
      id: row.id,
      employee: {
        id: row.employee.id,
        fullName: row.employee.fullName,
        department: row.employee.department ?? "",
      },
      leaveType: row.leaveType,
      startDate: row.startDate.toISOString().slice(0, 10),
      endDate: row.endDate.toISOString().slice(0, 10),
      days: row.days,
      reason: row.reason,
      status: row.status,
      requestedAt: row.requestedAt.toISOString(),
      decidedAt: row.decidedAt?.toISOString() ?? null,
      updatedAt: row.updatedAt.toISOString(),
    }));
  }),

  create: protectedProcedure
    .input(createLeaveSchema)
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);
      const start = parseIsoDate(input.startDate);
      const end = parseIsoDate(input.endDate);

      if (end < start) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "End date cannot be before start date.",
        });
      }

      const employee = await ctx.db.tenantEmployee.findFirst({
        where: {
          id: input.employeeId,
          tenantProfileId: tenantProfile.id,
          isActive: true,
        },
        select: { id: true },
      });

      if (!employee) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Employee not found.",
        });
      }

      const row = await ctx.db.tenantLeaveApplication.create({
        data: {
          tenantProfileId: tenantProfile.id,
          employeeId: input.employeeId,
          leaveType: input.leaveType.trim(),
          startDate: start,
          endDate: end,
          days: diffDaysInclusive(start, end),
          reason: input.reason.trim(),
          status: "PENDING",
        },
        include: {
          employee: {
            select: {
              id: true,
              fullName: true,
              department: true,
            },
          },
        },
      });

      return {
        id: row.id,
        employee: {
          id: row.employee.id,
          fullName: row.employee.fullName,
          department: row.employee.department ?? "",
        },
        leaveType: row.leaveType,
        startDate: row.startDate.toISOString().slice(0, 10),
        endDate: row.endDate.toISOString().slice(0, 10),
        days: row.days,
        reason: row.reason,
        status: row.status,
        requestedAt: row.requestedAt.toISOString(),
        decidedAt: row.decidedAt?.toISOString() ?? null,
        updatedAt: row.updatedAt.toISOString(),
      };
    }),

  bulkUpdateStatus: protectedProcedure
    .input(bulkUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);

      const found = await ctx.db.tenantLeaveApplication.findMany({
        where: {
          id: { in: input.ids },
          tenantProfileId: tenantProfile.id,
        },
        select: { id: true },
      });

      if (found.length !== input.ids.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "One or more leave applications were not found.",
        });
      }

      const decidedAt =
        input.status === "PENDING" ? null : new Date();

      const result = await ctx.db.tenantLeaveApplication.updateMany({
        where: {
          id: { in: input.ids },
          tenantProfileId: tenantProfile.id,
        },
        data: {
          status: input.status,
          decidedAt,
        },
      });

      return { updatedCount: result.count };
    }),
});

