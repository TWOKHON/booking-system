import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

const discordEventScopeValues = [
  "BOOKINGS",
  "OPERATIONS",
  "FINANCE",
  "OWNER_ALERTS",
  "CUSTOM",
] as const;

const discordChannelInputSchema = z.object({
  channelLabel: z
    .string()
    .trim()
    .min(1, "Channel name is required.")
    .max(120, "Channel name is too long."),
  eventScope: z.enum(discordEventScopeValues),
  webhookUrl: z
    .string()
    .trim()
    .url("Webhook URL must be a valid URL.")
    .refine(
      (value) =>
        value.startsWith("https://discord.com/api/webhooks/") ||
        value.startsWith("https://discordapp.com/api/webhooks/"),
      "Use a valid Discord webhook URL.",
    ),
  note: z.string().trim().max(240, "Note is too long.").optional().nullable(),
});

const discordChannelUpdateSchema = z.object({
  id: z.string().min(1),
  channelLabel: z
    .string()
    .trim()
    .min(1, "Channel name is required.")
    .max(120, "Channel name is too long."),
  eventScope: z.enum(discordEventScopeValues),
  note: z.string().trim().max(240, "Note is too long.").optional().nullable(),
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
      message: "Only tenant users can manage Discord channels.",
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

function mapDiscordChannelRecord(channel: {
  id: string;
  channelLabel: string;
  eventScope:
    | "BOOKINGS"
    | "OPERATIONS"
    | "FINANCE"
    | "OWNER_ALERTS"
    | "CUSTOM";
  webhookUrl: string;
  note: string | null;
  isActive: boolean;
  updatedAt: Date;
}) {
  return {
    id: channel.id,
    channelLabel: channel.channelLabel,
    eventScope: channel.eventScope,
    webhookUrl: channel.webhookUrl,
    webhookReference: maskDiscordWebhookUrl(channel.webhookUrl),
    note: channel.note,
    isActive: channel.isActive,
    updatedAt: channel.updatedAt,
  };
}

function maskDiscordWebhookUrl(webhookUrl: string) {
  try {
    const url = new URL(webhookUrl);
    const pathParts = url.pathname.split("/").filter(Boolean);
    const id = pathParts.at(-2) ?? "";
    const token = pathParts.at(-1) ?? "";
    const shortId = id ? `${id.slice(0, 4)}...${id.slice(-4)}` : "unknown";
    const shortToken = token
      ? `${token.slice(0, 6)}...${token.slice(-4)}`
      : "hidden";
    return `${url.host}/.../${shortId}/${shortToken}`;
  } catch {
    return "Discord webhook";
  }
}

export const discordRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const tenantProfile = requireTenantProfile(ctx);

    const channels = await ctx.db.tenantDiscordChannel.findMany({
      where: {
        tenantProfileId: tenantProfile.id,
        isActive: true,
      },
      orderBy: [{ eventScope: "asc" }, { updatedAt: "desc" }],
    });

    return channels.map(mapDiscordChannelRecord);
  }),

  create: protectedProcedure
    .input(discordChannelInputSchema)
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);

      try {
        const channel = await ctx.db.tenantDiscordChannel.create({
          data: {
            tenantProfileId: tenantProfile.id,
            channelLabel: input.channelLabel,
            eventScope: input.eventScope,
            webhookUrl: input.webhookUrl,
            note: input.note?.trim() || null,
            isActive: true,
          },
        });

        return mapDiscordChannelRecord(channel);
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes(
            "tenant_discord_channel_tenantProfileId_channelLabel_key",
          )
        ) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "A Discord channel with that name already exists.",
          });
        }

        throw error;
      }
    }),

  update: protectedProcedure
    .input(discordChannelUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);

      const existingChannel = await ctx.db.tenantDiscordChannel.findFirst({
        where: {
          id: input.id,
          tenantProfileId: tenantProfile.id,
          isActive: true,
        },
      });

      if (!existingChannel) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Discord channel not found.",
        });
      }

      try {
        const channel = await ctx.db.tenantDiscordChannel.update({
          where: {
            id: existingChannel.id,
          },
          data: {
            channelLabel: input.channelLabel,
            eventScope: input.eventScope,
            note: input.note?.trim() || null,
          },
        });

        return mapDiscordChannelRecord(channel);
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes(
            "tenant_discord_channel_tenantProfileId_channelLabel_key",
          )
        ) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "A Discord channel with that name already exists.",
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

      const existingChannel = await ctx.db.tenantDiscordChannel.findFirst({
        where: {
          id: input.id,
          tenantProfileId: tenantProfile.id,
          isActive: true,
        },
        select: {
          id: true,
          channelLabel: true,
          webhookUrl: true,
        },
      });

      if (!existingChannel) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Discord channel not found.",
        });
      }

      const remoteDelete = fetch(existingChannel.webhookUrl, {
        method: "DELETE",
      }).catch(() => null);

      await ctx.db.tenantDiscordChannel.update({
        where: {
          id: existingChannel.id,
        },
        data: {
          isActive: false,
        },
      });

      await remoteDelete;

      return existingChannel;
    }),
});
