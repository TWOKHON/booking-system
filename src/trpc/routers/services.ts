import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

const serviceInputSchema = z.object({
  serviceName: z.string().trim().min(1, "Service name is required.").max(120),
  category: z.string().trim().min(1, "Category is required.").max(80),
  price: z.number().int().min(0).max(10_000_000),
  unitLabel: z.string().trim().max(80).optional().or(z.literal("")),
  availability: z.string().trim().max(120).optional().or(z.literal("")),
  description: z.string().trim().max(500).optional().or(z.literal("")),
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
      message: "Only tenant users can manage services.",
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

export const servicesRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const tenantProfile = requireTenantProfile(ctx);

    const services = await ctx.db.tenantService.findMany({
      where: {
        tenantProfileId: tenantProfile.id,
        isActive: true,
      },
      orderBy: [{ updatedAt: "desc" }, { serviceName: "asc" }],
    });

    return services.map((service) => ({
      id: service.id,
      serviceName: service.serviceName,
      category: service.category,
      price: service.basePrice,
      unitLabel: service.unitLabel ?? "per service",
      availability: service.availability ?? "By request",
      description: service.description ?? "",
      updatedAt: service.updatedAt,
    }));
  }),

  create: protectedProcedure
    .input(serviceInputSchema)
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);

      try {
        const service = await ctx.db.tenantService.create({
          data: {
            tenantProfileId: tenantProfile.id,
            serviceName: input.serviceName,
            category: input.category,
            basePrice: input.price,
            unitLabel: input.unitLabel?.trim() ? input.unitLabel.trim() : "per service",
            availability: input.availability?.trim() ? input.availability.trim() : "By request",
            description: input.description?.trim() ? input.description.trim() : null,
            isActive: true,
          },
        });

        return {
          id: service.id,
          serviceName: service.serviceName,
          category: service.category,
          price: service.basePrice,
          unitLabel: service.unitLabel ?? "per service",
          availability: service.availability ?? "By request",
          description: service.description ?? "",
          updatedAt: service.updatedAt,
        };
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes("tenant_service_tenantProfileId_serviceName_key")
        ) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "A service with that name already exists.",
          });
        }

        throw error;
      }
    }),

  update: protectedProcedure
    .input(
      serviceInputSchema.extend({
        id: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);

      const existingService = await ctx.db.tenantService.findFirst({
        where: {
          id: input.id,
          tenantProfileId: tenantProfile.id,
          isActive: true,
        },
      });

      if (!existingService) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Service not found.",
        });
      }

      try {
        const service = await ctx.db.tenantService.update({
          where: { id: existingService.id },
          data: {
            serviceName: input.serviceName,
            category: input.category,
            basePrice: input.price,
            unitLabel: input.unitLabel?.trim() ? input.unitLabel.trim() : "per service",
            availability: input.availability?.trim() ? input.availability.trim() : "By request",
            description: input.description?.trim() ? input.description.trim() : null,
          },
        });

        return {
          id: service.id,
          serviceName: service.serviceName,
          category: service.category,
          price: service.basePrice,
          unitLabel: service.unitLabel ?? "per service",
          availability: service.availability ?? "By request",
          description: service.description ?? "",
          updatedAt: service.updatedAt,
        };
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes("tenant_service_tenantProfileId_serviceName_key")
        ) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "A service with that name already exists.",
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

      const existingService = await ctx.db.tenantService.findFirst({
        where: {
          id: input.id,
          tenantProfileId: tenantProfile.id,
          isActive: true,
        },
        select: {
          id: true,
          serviceName: true,
        },
      });

      if (!existingService) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Service not found.",
        });
      }

      await ctx.db.tenantService.delete({
        where: { id: existingService.id },
      });

      return existingService;
    }),
});
