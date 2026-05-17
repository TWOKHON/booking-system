import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

const channelValues = ["IN_APP", "EMAIL", "SMS", "PUSH"] as const;
const categoryValues = [
  "RESERVATIONS",
  "GUEST_MESSAGES",
  "OPERATIONAL_ALERTS",
  "PAYMENTS",
  "MARKETING",
] as const;
const frequencyValues = ["INSTANT", "DAILY", "WEEKLY"] as const;

type ChannelValue = (typeof channelValues)[number];
type CategoryValue = (typeof categoryValues)[number];
type FrequencyValue = (typeof frequencyValues)[number];

const defaultChannels: Array<{ channel: ChannelValue; enabled: boolean }> = [
  { channel: "IN_APP", enabled: true },
  { channel: "EMAIL", enabled: true },
  { channel: "SMS", enabled: false },
  { channel: "PUSH", enabled: true },
];

const defaultPreferences: Array<{
  category: CategoryValue;
  enabled: boolean;
  frequency: FrequencyValue;
}> = [
  { category: "RESERVATIONS", enabled: true, frequency: "INSTANT" },
  { category: "GUEST_MESSAGES", enabled: true, frequency: "INSTANT" },
  { category: "OPERATIONAL_ALERTS", enabled: true, frequency: "INSTANT" },
  { category: "PAYMENTS", enabled: true, frequency: "DAILY" },
  { category: "MARKETING", enabled: false, frequency: "WEEKLY" },
];

function requireTenantProfile(ctx: {
  currentUser: {
    role: "ADMIN" | "TENANT" | "CUSTOMER";
    tenantProfile: { id: string } | null;
  } | null;
}) {
  if (!ctx.currentUser || ctx.currentUser.role !== "TENANT") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Only tenant users can manage notifications.",
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

export const notificationsRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const tenantProfile = requireTenantProfile(ctx);

    await ctx.db.$transaction(async (tx) => {
      const existingChannels = await tx.tenantCommunicationChannel.findMany({
        where: { tenantProfileId: tenantProfile.id },
        select: { channel: true },
      });

      const missingChannels = defaultChannels.filter(
        (channel) =>
          !existingChannels.some(
            (existing) => existing.channel === channel.channel,
          ),
      );

      if (missingChannels.length > 0) {
        await tx.tenantCommunicationChannel.createMany({
          data: missingChannels.map((channel) => ({
            tenantProfileId: tenantProfile.id,
            channel: channel.channel,
            enabled: channel.enabled,
          })),
        });
      }

      const existingPreferences = await tx.tenantNotificationPreference.findMany({
        where: { tenantProfileId: tenantProfile.id },
        select: { category: true },
      });

      const missingPreferences = defaultPreferences.filter(
        (preference) =>
          !existingPreferences.some(
            (existing) => existing.category === preference.category,
          ),
      );

      if (missingPreferences.length > 0) {
        await tx.tenantNotificationPreference.createMany({
          data: missingPreferences.map((preference) => ({
            tenantProfileId: tenantProfile.id,
            category: preference.category,
            enabled: preference.enabled,
            frequency: preference.frequency,
          })),
        });
      }
    });

    const [channels, preferences] = await Promise.all([
      ctx.db.tenantCommunicationChannel.findMany({
        where: {
          tenantProfileId: tenantProfile.id,
        },
        orderBy: { channel: "asc" },
      }),
      ctx.db.tenantNotificationPreference.findMany({
        where: {
          tenantProfileId: tenantProfile.id,
        },
        orderBy: { category: "asc" },
      }),
    ]);

    return {
      channels: channels.map((channel) => ({
        id: channel.id,
        channel: channel.channel,
        enabled: channel.enabled,
        updatedAt: channel.updatedAt,
      })),
      preferences: preferences.map((preference) => ({
        id: preference.id,
        category: preference.category,
        enabled: preference.enabled,
        frequency: preference.frequency,
        updatedAt: preference.updatedAt,
      })),
    };
  }),

  updateChannels: protectedProcedure
    .input(
      z.object({
        channels: z
          .array(
            z.object({
              channel: z.enum(channelValues),
              enabled: z.boolean(),
            }),
          )
          .min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);

      await ctx.db.$transaction(
        input.channels.map((channel) =>
          ctx.db.tenantCommunicationChannel.upsert({
            where: {
              tenantProfileId_channel: {
                tenantProfileId: tenantProfile.id,
                channel: channel.channel,
              },
            },
            update: {
              enabled: channel.enabled,
            },
            create: {
              tenantProfileId: tenantProfile.id,
              channel: channel.channel,
              enabled: channel.enabled,
            },
          }),
        ),
      );

      return { success: true };
    }),

  updatePreference: protectedProcedure
    .input(
      z.object({
        category: z.enum(categoryValues),
        enabled: z.boolean(),
        frequency: z.enum(frequencyValues),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);

      const preference = await ctx.db.tenantNotificationPreference.upsert({
        where: {
          tenantProfileId_category: {
            tenantProfileId: tenantProfile.id,
            category: input.category,
          },
        },
        update: {
          enabled: input.enabled,
          frequency: input.frequency,
        },
        create: {
          tenantProfileId: tenantProfile.id,
          category: input.category,
          enabled: input.enabled,
          frequency: input.frequency,
        },
      });

      return {
        id: preference.id,
        category: preference.category,
        enabled: preference.enabled,
        frequency: preference.frequency,
        updatedAt: preference.updatedAt,
      };
    }),
});
