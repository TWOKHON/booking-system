import { TRPCError } from "@trpc/server";
import type { InputJsonValue } from "@prisma/client/runtime/client";
import type { TRPCContext } from "@/trpc/init";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

const siteDataSchema = z.record(z.string(), z.unknown());

function toJsonInput(value: unknown): InputJsonValue {
  return value as InputJsonValue;
}

function requireTenantProfile(ctx: TRPCContext) {
  if (!ctx.currentUser || ctx.currentUser.role !== "TENANT") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Only tenant users can manage the site builder.",
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

export const siteBuilderRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const tenantProfile = requireTenantProfile(ctx);

    const siteBuilder = await ctx.db.tenantSiteBuilder.findUnique({
      where: {
        tenantProfileId: tenantProfile.id,
      },
    });

    return siteBuilder;
  }),

  saveDraft: protectedProcedure
    .input(z.object({ data: siteDataSchema }))
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);

      const siteBuilder = await ctx.db.tenantSiteBuilder.upsert({
        where: {
          tenantProfileId: tenantProfile.id,
        },
        update: {
          draftData: toJsonInput(input.data),
        },
        create: {
          tenantProfileId: tenantProfile.id,
          draftData: toJsonInput(input.data),
        },
      });

      return siteBuilder;
    }),

  publish: protectedProcedure
    .input(z.object({ data: siteDataSchema }))
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);

      const siteBuilder = await ctx.db.tenantSiteBuilder.upsert({
        where: {
          tenantProfileId: tenantProfile.id,
        },
        update: {
          publishedData: toJsonInput(input.data),
          draftData: toJsonInput(input.data), // Sync draft when publishing
        },
        create: {
          tenantProfileId: tenantProfile.id,
          publishedData: toJsonInput(input.data),
          draftData: toJsonInput(input.data),
        },
      });

      return siteBuilder;
    }),

  reset: protectedProcedure.mutation(async ({ ctx }) => {
    const tenantProfile = requireTenantProfile(ctx);
    console.log("[DEBUG_LOG] Resetting site for tenant:", tenantProfile.id);

    await ctx.db.tenantSiteBuilder.delete({
      where: {
        tenantProfileId: tenantProfile.id,
      },
    });

    return { success: true };
  }),

  getAssets: protectedProcedure.query(async ({ ctx }) => {
    const tenantProfile = requireTenantProfile(ctx);

    const assets = await ctx.db.tenantAsset.findMany({
      where: {
        tenantProfileId: tenantProfile.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return assets;
  }),

  addAsset: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        type: z.string(),
        size: z.string(),
        url: z.string(),
        publicId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);

      const asset = await ctx.db.tenantAsset.create({
        data: {
          tenantProfileId: tenantProfile.id,
          name: input.name,
          type: input.type,
          size: input.size,
          url: input.url,
          publicId: input.publicId,
        },
      });

      return asset;
    }),

  deleteAsset: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);

      await ctx.db.tenantAsset.delete({
        where: {
          id: input.id,
          tenantProfileId: tenantProfile.id,
        },
      });

      return { success: true };
    }),

  getSections: protectedProcedure.query(async ({ ctx }) => {
    const tenantProfile = requireTenantProfile(ctx);

    const sections = await ctx.db.tenantSection.findMany({
      where: {
        tenantProfileId: tenantProfile.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return sections;
  }),

  addSection: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        type: z.string(),
        content: z.unknown(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);

      const section = await ctx.db.tenantSection.create({
        data: {
          tenantProfileId: tenantProfile.id,
          name: input.name,
          type: input.type,
          content: toJsonInput(input.content),
        },
      });

      return section;
    }),

  deleteSection: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);

      await ctx.db.tenantSection.delete({
        where: {
          id: input.id,
          tenantProfileId: tenantProfile.id,
        },
      });

      return { success: true };
    }),

  getDomains: protectedProcedure.query(async ({ ctx }) => {
    const tenantProfile = requireTenantProfile(ctx);

    const domains = await ctx.db.tenantDomain.findMany({
      where: {
        tenantProfileId: tenantProfile.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return domains;
  }),

  addDomain: protectedProcedure
    .input(
      z.object({
        domain: z.string(),
        type: z.enum(["MANAGED", "EXTERNAL"]).default("MANAGED"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);

      const domain = await ctx.db.tenantDomain.create({
        data: {
          tenantProfileId: tenantProfile.id,
          domain: input.domain,
          type: input.type,
          status: input.type === "MANAGED" ? "PENDING" : "CONNECTING",
        },
      });

      return domain;
    }),

  deleteDomain: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);

      await ctx.db.tenantDomain.delete({
        where: {
          id: input.id,
          tenantProfileId: tenantProfile.id,
        },
      });

      return { success: true };
    }),
});
