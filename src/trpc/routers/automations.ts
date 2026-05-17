import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

const automationDomainValues = [
  "RESERVATIONS",
  "OPERATIONS",
  "COMMUNICATIONS",
  "REVENUE",
] as const;

const automationStatusValues = [
  "ACTIVE",
  "DRAFT",
  "REVIEW",
  "PAUSED",
] as const;

const automationBaseInputSchema = z.object({
  name: z.string().trim().min(1, "Workflow name is required.").max(120),
  domain: z.enum(automationDomainValues),
  triggerLabel: z
    .string()
    .trim()
    .min(1, "Trigger label is required.")
    .max(120),
  assignedTo: z.string().trim().max(120).optional().or(z.literal("")),
  note: z.string().trim().max(320).optional().or(z.literal("")),
  priority: z.boolean().default(false),
});

const automationCreateInputSchema = automationBaseInputSchema;

const automationUpdateInputSchema = automationBaseInputSchema.extend({
  status: z.enum(automationStatusValues),
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
      message: "Only tenant users can manage automations.",
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

function mapWorkflowRecord(
  workflow: {
    id: string;
    name: string;
    domain: "RESERVATIONS" | "OPERATIONS" | "COMMUNICATIONS" | "REVENUE";
    status: "ACTIVE" | "DRAFT" | "REVIEW" | "PAUSED";
    triggerLabel: string;
    assignedTo: string | null;
    note: string | null;
    priority: boolean;
    runVolume: number;
    successRate: number;
    updatedAt: Date;
  },
) {
  return {
    id: workflow.id,
    name: workflow.name,
    domain: workflow.domain,
    status: workflow.status,
    triggerLabel: workflow.triggerLabel,
    assignedTo: workflow.assignedTo ?? "Unassigned",
    note: workflow.note ?? "",
    priority: workflow.priority,
    runVolume: workflow.runVolume,
    successRate: workflow.successRate,
    updatedAt: workflow.updatedAt,
  };
}

export const automationsRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const tenantProfile = requireTenantProfile(ctx);

    const workflows = await ctx.db.tenantAutomationWorkflow.findMany({
      where: {
        tenantProfileId: tenantProfile.id,
      },
      orderBy: [{ updatedAt: "desc" }, { name: "asc" }],
    });

    return workflows.map(mapWorkflowRecord);
  }),

  getById: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);

      const workflow = await ctx.db.tenantAutomationWorkflow.findFirst({
        where: {
          id: input.id,
          tenantProfileId: tenantProfile.id,
        },
      });

      if (!workflow) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Automation workflow not found.",
        });
      }

      return mapWorkflowRecord(workflow);
    }),

  create: protectedProcedure
    .input(automationCreateInputSchema)
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);

      try {
        const workflow = await ctx.db.tenantAutomationWorkflow.create({
          data: {
            tenantProfileId: tenantProfile.id,
            name: input.name,
            domain: input.domain,
            status: "ACTIVE",
            triggerLabel: input.triggerLabel,
            assignedTo: input.assignedTo?.trim() || null,
            note: input.note?.trim() || null,
            priority: input.priority,
          },
        });

        return mapWorkflowRecord(workflow);
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes(
            "tenant_automation_workflow_tenantProfileId_name_key",
          )
        ) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "A workflow with that name already exists.",
          });
        }

        throw error;
      }
    }),

  update: protectedProcedure
    .input(
      automationUpdateInputSchema.extend({
        id: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);

      const existingWorkflow = await ctx.db.tenantAutomationWorkflow.findFirst({
        where: {
          id: input.id,
          tenantProfileId: tenantProfile.id,
        },
      });

      if (!existingWorkflow) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Automation workflow not found.",
        });
      }

      try {
        const workflow = await ctx.db.tenantAutomationWorkflow.update({
          where: {
            id: existingWorkflow.id,
          },
          data: {
            name: input.name,
            domain: input.domain,
            status: input.status,
            triggerLabel: input.triggerLabel,
            assignedTo: input.assignedTo?.trim() || null,
            note: input.note?.trim() || null,
            priority: input.priority,
          },
        });

        return mapWorkflowRecord(workflow);
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes(
            "tenant_automation_workflow_tenantProfileId_name_key",
          )
        ) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "A workflow with that name already exists.",
          });
        }

        throw error;
      }
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);

      const existingWorkflow = await ctx.db.tenantAutomationWorkflow.findFirst({
        where: {
          id: input.id,
          tenantProfileId: tenantProfile.id,
        },
        select: {
          id: true,
          name: true,
          status: true,
        },
      });

      if (!existingWorkflow) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Automation workflow not found.",
        });
      }

      await ctx.db.tenantAutomationWorkflow.delete({
        where: {
          id: existingWorkflow.id,
        },
      });

      return existingWorkflow;
    }),
});
