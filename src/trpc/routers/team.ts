import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { isWithinStaffSeatLimit } from "@/lib/subscription/entitlements";

const teamRoleValues = [
  "OWNER_ADMIN",
  "MANAGER",
  "FRONT_DESK",
  "HOUSEKEEPING",
  "MAINTENANCE",
] as const;

const inviteStatusValues = ["ACCEPTED", "PENDING"] as const;

const teamMemberInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(120),
  email: z.string().trim().email("A valid email is required.").max(190),
  role: z.enum(teamRoleValues),
  status: z.enum(inviteStatusValues).default("PENDING"),
});

function buildInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 4);
}

function requireTenantProfile(ctx: {
  currentUser: {
    role: "ADMIN" | "TENANT" | "CUSTOMER";
    tenantProfile: {
      id: string;
      subscriptionPlan: "FREE_TRIAL" | "STARTER" | "GROWTH" | "ENTERPRISE";
    } | null;
  } | null;
}) {
  if (!ctx.currentUser || ctx.currentUser.role !== "TENANT") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Only tenant users can manage team access.",
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

export const teamRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const tenantProfile = requireTenantProfile(ctx);

    const members = await ctx.db.tenantTeamMember.findMany({
      where: {
        tenantProfileId: tenantProfile.id,
      },
      orderBy: [{ updatedAt: "desc" }, { name: "asc" }],
    });

    return members.map((member) => ({
      id: member.id,
      name: member.name ?? "Unnamed team member",
      initials:
        member.initials?.trim() || buildInitials(member.name ?? member.email),
      email: member.email,
      role: member.role,
      status: member.status,
      updatedAt: member.updatedAt,
    }));
  }),

  create: protectedProcedure
    .input(teamMemberInputSchema)
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);
      const normalizedEmail = input.email.trim().toLowerCase();

      const existingMember = await ctx.db.tenantTeamMember.findFirst({
        where: {
          tenantProfileId: tenantProfile.id,
          email: normalizedEmail,
        },
      });

      if (existingMember) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A team member with that email already exists.",
        });
      }

      const currentSeatCount = await ctx.db.tenantTeamMember.count({
        where: {
          tenantProfileId: tenantProfile.id,
        },
      });

      if (
        !isWithinStaffSeatLimit({
          plan: tenantProfile.subscriptionPlan,
          currentSeatCount,
        })
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This plan has reached its staff seat limit.",
        });
      }

      const member = await ctx.db.tenantTeamMember.create({
        data: {
          tenantProfileId: tenantProfile.id,
          name: input.name.trim(),
          initials: buildInitials(input.name.trim()),
          email: normalizedEmail,
          role: input.role,
          status: input.status,
        },
      });

      return {
        id: member.id,
        name: member.name ?? "Unnamed team member",
        initials:
          member.initials?.trim() || buildInitials(member.name ?? member.email),
        email: member.email,
        role: member.role,
        status: member.status,
        updatedAt: member.updatedAt,
      };
    }),

  update: protectedProcedure
    .input(
      teamMemberInputSchema.extend({
        id: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);
      const normalizedEmail = input.email.trim().toLowerCase();

      const existingMember = await ctx.db.tenantTeamMember.findFirst({
        where: {
          id: input.id,
          tenantProfileId: tenantProfile.id,
        },
      });

      if (!existingMember) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team member not found.",
        });
      }

      const duplicateMember = await ctx.db.tenantTeamMember.findFirst({
        where: {
          tenantProfileId: tenantProfile.id,
          email: normalizedEmail,
          id: {
            not: existingMember.id,
          },
        },
      });

      if (duplicateMember) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A team member with that email already exists.",
        });
      }

      const member = await ctx.db.tenantTeamMember.update({
        where: {
          id: existingMember.id,
        },
        data: {
          name: input.name.trim(),
          initials: buildInitials(input.name.trim()),
          email: normalizedEmail,
          role: input.role,
          status: input.status,
        },
      });

      return {
        id: member.id,
        name: member.name ?? "Unnamed team member",
        initials:
          member.initials?.trim() || buildInitials(member.name ?? member.email),
        email: member.email,
        role: member.role,
        status: member.status,
        updatedAt: member.updatedAt,
      };
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);

      const existingMember = await ctx.db.tenantTeamMember.findFirst({
        where: {
          id: input.id,
          tenantProfileId: tenantProfile.id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });

      if (!existingMember) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team member not found.",
        });
      }

      await ctx.db.tenantTeamMember.delete({
        where: { id: existingMember.id },
      });

      return existingMember;
    }),
});
