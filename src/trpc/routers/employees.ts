import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

const createEmployeeSchema = z.object({
  fullName: z.string().trim().min(2, "Employee name is required.").max(120),
  roleTitle: z.string().trim().min(1).max(120).optional().or(z.literal("")),
  department: z.string().trim().min(1).max(120).optional().or(z.literal("")),
  defaultShift: z.string().trim().min(1).max(120).optional().or(z.literal("")),
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
      message: "Only tenant users can manage employees.",
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

export const employeesRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const tenantProfile = requireTenantProfile(ctx);

    const employees = await ctx.db.tenantEmployee.findMany({
      where: {
        tenantProfileId: tenantProfile.id,
        isActive: true,
      },
      orderBy: [{ updatedAt: "desc" }, { fullName: "asc" }],
      select: {
        id: true,
        fullName: true,
        roleTitle: true,
        department: true,
        defaultShift: true,
        updatedAt: true,
      },
    });

    return employees.map((employee) => ({
      id: employee.id,
      fullName: employee.fullName,
      roleTitle: employee.roleTitle ?? "",
      department: employee.department ?? "",
      defaultShift: employee.defaultShift ?? "",
      updatedAt: employee.updatedAt,
    }));
  }),

  create: protectedProcedure
    .input(createEmployeeSchema)
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);

      const fullName = input.fullName.trim();
      const roleTitle = input.roleTitle?.trim() || null;
      const department = input.department?.trim() || null;
      const defaultShift = input.defaultShift?.trim() || null;

      const existingEmployee = await ctx.db.tenantEmployee.findFirst({
        where: {
          tenantProfileId: tenantProfile.id,
          fullName,
          isActive: true,
        },
        select: { id: true },
      });

      if (existingEmployee) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "An employee with that name already exists.",
        });
      }

      const employee = await ctx.db.tenantEmployee.create({
        data: {
          tenantProfileId: tenantProfile.id,
          fullName,
          roleTitle,
          department,
          defaultShift,
        },
        select: {
          id: true,
          fullName: true,
          roleTitle: true,
          department: true,
          defaultShift: true,
          updatedAt: true,
        },
      });

      return {
        id: employee.id,
        fullName: employee.fullName,
        roleTitle: employee.roleTitle ?? "",
        department: employee.department ?? "",
        defaultShift: employee.defaultShift ?? "",
        updatedAt: employee.updatedAt,
      };
    }),
});

