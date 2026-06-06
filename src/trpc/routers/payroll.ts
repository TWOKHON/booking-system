import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

const createRunSchema = z.object({
  periodStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  periodEnd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
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
      message: "Only tenant users can manage payroll.",
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

const parseIsoDate = (dateIso: string) =>
  new Date(`${dateIso}T00:00:00.000Z`);

const toIso = (date: Date) => date.toISOString().slice(0, 10);

const eachDayIso = (startIso: string, endIso: string) => {
  const start = parseIsoDate(startIso);
  const end = parseIsoDate(endIso);
  const days: string[] = [];
  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    days.push(toIso(d));
  }
  return days;
};

function parseShiftMinutes(shift?: string | null) {
  if (!shift) return null;
  const match = shift.match(
    /^\s*(\d{2}):(\d{2})\s*-\s*(\d{2}):(\d{2})\s*$/
  );
  if (!match) return null;
  const [, sh, sm, eh, em] = match;
  const start = Number(sh) * 60 + Number(sm);
  const end = Number(eh) * 60 + Number(em);
  if (!Number.isFinite(start) || !Number.isFinite(end)) return null;
  if (end <= start) return null;
  return { start, end, minutes: end - start };
}

const centsMul = (cents: number, multiplier: number) =>
  Math.round(cents * multiplier);

export const payrollRouter = createTRPCRouter({
  listRuns: protectedProcedure.query(async ({ ctx }) => {
    const tenantProfile = requireTenantProfile(ctx);

    const runs = await ctx.db.tenantPayrollRun.findMany({
      where: { tenantProfileId: tenantProfile.id },
      orderBy: [{ createdAt: "desc" }],
      take: 25,
      select: {
        id: true,
        periodStart: true,
        periodEnd: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return runs.map((run) => ({
      id: run.id,
      periodStart: toIso(run.periodStart),
      periodEnd: toIso(run.periodEnd),
      status: run.status,
      createdAt: run.createdAt.toISOString(),
      updatedAt: run.updatedAt.toISOString(),
    }));
  }),

  getRun: protectedProcedure
    .input(z.object({ runId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);

      const run = await ctx.db.tenantPayrollRun.findFirst({
        where: {
          id: input.runId,
          tenantProfileId: tenantProfile.id,
        },
        include: {
          lines: {
            include: {
              employee: {
                select: {
                  id: true,
                  fullName: true,
                  department: true,
                  defaultShift: true,
                  hourlyRateCents: true,
                },
              },
            },
            orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
          },
        },
      });

      if (!run) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Payroll run not found." });
      }

      return {
        id: run.id,
        periodStart: toIso(run.periodStart),
        periodEnd: toIso(run.periodEnd),
        status: run.status,
        createdAt: run.createdAt.toISOString(),
        updatedAt: run.updatedAt.toISOString(),
        lines: run.lines.map((line) => ({
          id: line.id,
          employee: {
            id: line.employee.id,
            fullName: line.employee.fullName,
            department: line.employee.department ?? "",
            defaultShift: line.employee.defaultShift ?? "",
            hourlyRateCents: line.employee.hourlyRateCents ?? null,
          },
          regularMinutes: line.regularMinutes,
          overtimeMinutes: line.overtimeMinutes,
          undertimeMinutes: line.undertimeMinutes,
          holidayMinutes: line.holidayMinutes,
          grossPayCents: line.grossPayCents,
          deductionsCents: line.deductionsCents,
          netPayCents: line.netPayCents,
          status: line.status,
          notes: line.notes ?? "",
          updatedAt: line.updatedAt.toISOString(),
        })),
      };
    }),

  createRun: protectedProcedure
    .input(createRunSchema)
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);
      const start = parseIsoDate(input.periodStart);
      const end = parseIsoDate(input.periodEnd);

      if (end < start) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Period end cannot be before period start.",
        });
      }

      const employees = await ctx.db.tenantEmployee.findMany({
        where: {
          tenantProfileId: tenantProfile.id,
          isActive: true,
        },
        select: {
          id: true,
          fullName: true,
          department: true,
          defaultShift: true,
          hourlyRateCents: true,
        },
      });

      const holidays = await ctx.db.tenantHoliday.findMany({
        where: {
          tenantProfileId: tenantProfile.id,
          date: {
            gte: start,
            lte: end,
          },
        },
        select: {
          date: true,
          multiplier: true,
          name: true,
        },
      });

      const approvedLeave = await ctx.db.tenantLeaveApplication.findMany({
        where: {
          tenantProfileId: tenantProfile.id,
          status: "APPROVED",
          OR: [
            {
              startDate: { lte: end },
              endDate: { gte: start },
            },
          ],
        },
        select: {
          employeeId: true,
          startDate: true,
          endDate: true,
        },
      });

      const holidayByIso = new Map<string, { multiplier: number; name: string }>();
      for (const h of holidays) {
        holidayByIso.set(toIso(h.date), { multiplier: h.multiplier, name: h.name });
      }

      const leaveRangesByEmployee = new Map<string, { startIso: string; endIso: string }[]>();
      for (const leave of approvedLeave) {
        const list = leaveRangesByEmployee.get(leave.employeeId) ?? [];
        list.push({ startIso: toIso(leave.startDate), endIso: toIso(leave.endDate) });
        leaveRangesByEmployee.set(leave.employeeId, list);
      }

      const periodDays = eachDayIso(input.periodStart, input.periodEnd);

      const attendanceLogs = await ctx.db.tenantAttendanceLog.findMany({
        where: {
          tenantProfileId: tenantProfile.id,
          date: {
            gte: start,
            lte: end,
          },
          employeeId: {
            in: employees.map((e) => e.id),
          },
        },
        select: {
          employeeId: true,
          date: true,
          workedMinutes: true,
          overtimeMinutes: true,
          undertimeMinutes: true,
        },
      });

      const logByKey = new Map<string, (typeof attendanceLogs)[number]>();
      for (const log of attendanceLogs) {
        logByKey.set(`${log.employeeId}:${toIso(log.date)}`, log);
      }

      const run = await ctx.db.tenantPayrollRun.create({
        data: {
          tenantProfileId: tenantProfile.id,
          periodStart: start,
          periodEnd: end,
          status: "DRAFT",
        },
        select: {
          id: true,
          periodStart: true,
          periodEnd: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      const overtimeMultiplier = 1.25;

      const linesToCreate = employees.map((emp) => {
        const shift = parseShiftMinutes(emp.defaultShift);
        const hasRate = typeof emp.hourlyRateCents === "number" && emp.hourlyRateCents > 0;
        const paidShiftMinutes = shift?.minutes ?? 0;
        const leaveRanges = leaveRangesByEmployee.get(emp.id) ?? [];

        let regularMinutes = 0;
        let holidayMinutes = 0;
        let overtimeMinutes = 0;
        let undertimeMinutes = 0;

        let grossPayCents = 0;
        let deductionsCents = 0;
        let netPayCents = 0;
        let status: "READY" | "NEEDS_REVIEW" = "READY";
        const notes: string[] = [];

        if (!shift) {
          status = "NEEDS_REVIEW";
          notes.push("Missing or invalid shift (expected: HH:MM - HH:MM).");
        }
        if (!hasRate) {
          status = "NEEDS_REVIEW";
          notes.push("Missing hourly rate.");
        }

        for (const dayIso of periodDays) {
          const isOnLeave = leaveRanges.some(
            (r) => dayIso >= r.startIso && dayIso <= r.endIso
          );
          if (isOnLeave) continue;

          const holiday = holidayByIso.get(dayIso);
          const log = logByKey.get(`${emp.id}:${dayIso}`);
          const workedMinutes = log?.workedMinutes ?? paidShiftMinutes;
          const otMinutes = log?.overtimeMinutes ?? 0;
          const utMinutes = log?.undertimeMinutes ?? 0;

          overtimeMinutes += otMinutes;
          undertimeMinutes += utMinutes;

          if (holiday) {
            holidayMinutes += workedMinutes;
          } else {
            regularMinutes += workedMinutes;
          }
        }

        if (hasRate) {
          const hourlyRateCents = emp.hourlyRateCents as number;
          const baseCentsPerMinute = hourlyRateCents / 60;

          const regularPay = Math.round(regularMinutes * baseCentsPerMinute);
          const overtimePay = Math.round(
            overtimeMinutes * baseCentsPerMinute * overtimeMultiplier
          );

          let holidayPay = 0;
          for (const dayIso of periodDays) {
            const holiday = holidayByIso.get(dayIso);
            if (!holiday) continue;
            const isOnLeave = leaveRanges.some(
              (r) => dayIso >= r.startIso && dayIso <= r.endIso
            );
            if (isOnLeave) continue;

            const log = logByKey.get(`${emp.id}:${dayIso}`);
            const workedMinutes = log?.workedMinutes ?? paidShiftMinutes;
            // Double pay by default; multiplier stored per holiday.
            holidayPay += centsMul(
              Math.round(workedMinutes * baseCentsPerMinute),
              holiday.multiplier
            );
          }

          grossPayCents = regularPay + overtimePay + holidayPay;
          // undertime is treated as unpaid minutes deducted at base rate
          deductionsCents = Math.max(0, Math.round(undertimeMinutes * baseCentsPerMinute));
          netPayCents = Math.max(0, grossPayCents - deductionsCents);
        }

        return {
          payrollRunId: run.id,
          tenantProfileId: tenantProfile.id,
          employeeId: emp.id,
          regularMinutes,
          overtimeMinutes,
          undertimeMinutes,
          holidayMinutes,
          grossPayCents,
          deductionsCents,
          netPayCents,
          status,
          notes: notes.join(" "),
        };
      });

      if (linesToCreate.length) {
        await ctx.db.tenantPayrollLine.createMany({
          data: linesToCreate,
        });
      }

      return {
        id: run.id,
        periodStart: toIso(run.periodStart),
        periodEnd: toIso(run.periodEnd),
        status: run.status,
        createdAt: run.createdAt.toISOString(),
        updatedAt: run.updatedAt.toISOString(),
      };
    }),
});
