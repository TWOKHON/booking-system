import { TRPCError } from "@trpc/server";
import { UTApi } from "uploadthing/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

const utapi = new UTApi();

const roomInputSchema = z.object({
  roomName: z.string().trim().min(1, "Room name is required.").max(120),
  category: z.string().trim().min(1, "Category is required.").max(80),
  capacity: z.number().int().min(1).max(100),
  sellableUnits: z.number().int().min(1).max(500),
  rate: z.number().int().min(0).max(10_000_000),
  zone: z.string().trim().max(120).optional().or(z.literal("")),
});

const roomImageCreateInputSchema = z.object({
  fileKey: z.string().trim().min(1, "Uploaded file key is required."),
  imageUrl: z
    .string()
    .trim()
    .min(1, "Image upload is required.")
    .max(10_000_000, "Uploaded image is too large.")
    .refine(
      (value) =>
        value.startsWith("data:image/") ||
        value.startsWith("http://") ||
        value.startsWith("https://"),
      "Image must be an uploaded image or a valid URL.",
    ),
  caption: z.string().trim().max(240).optional().or(z.literal("")),
});

const roomImageUpdateInputSchema = roomImageCreateInputSchema.extend({
  sortOrder: z.number().int().min(0).max(10_000).optional(),
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
      message: "Only tenant users can manage rooms.",
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

export const roomsRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const tenantProfile = requireTenantProfile(ctx);

    const rooms = await ctx.db.tenantRoom.findMany({
      where: {
        tenantProfileId: tenantProfile.id,
        isActive: true,
      },
      orderBy: [
        { updatedAt: "desc" },
        { roomName: "asc" },
      ],
    });

    return rooms.map((room) => ({
      id: room.id,
      roomName: room.roomName,
      category: room.category,
      capacity: room.capacity,
      sellableUnits: room.sellableUnits,
      rate: room.baseNightlyRate,
      zone: room.zone ?? "Main Area",
      updatedAt: room.updatedAt,
    }));
  }),

  create: protectedProcedure
    .input(roomInputSchema)
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);

      try {
        const room = await ctx.db.tenantRoom.create({
          data: {
            tenantProfileId: tenantProfile.id,
            roomName: input.roomName,
            category: input.category,
            capacity: input.capacity,
            sellableUnits: input.sellableUnits,
            baseNightlyRate: input.rate,
            zone: input.zone?.trim() ? input.zone.trim() : "Main Area",
            isActive: true,
          },
        });

        return {
          id: room.id,
          roomName: room.roomName,
          category: room.category,
          capacity: room.capacity,
          sellableUnits: room.sellableUnits,
          rate: room.baseNightlyRate,
          zone: room.zone ?? "Main Area",
          updatedAt: room.updatedAt,
        };
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes("tenant_room_tenantProfileId_roomName_key")
        ) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "A room with that name already exists.",
          });
        }

        throw error;
      }
    }),

  update: protectedProcedure
    .input(
      roomInputSchema.extend({
        id: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);

      const existingRoom = await ctx.db.tenantRoom.findFirst({
        where: {
          id: input.id,
          tenantProfileId: tenantProfile.id,
          isActive: true,
        },
      });

      if (!existingRoom) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Room not found.",
        });
      }

      try {
        const room = await ctx.db.tenantRoom.update({
          where: { id: existingRoom.id },
          data: {
            roomName: input.roomName,
            category: input.category,
            capacity: input.capacity,
            sellableUnits: input.sellableUnits,
            baseNightlyRate: input.rate,
            zone: input.zone?.trim() ? input.zone.trim() : "Main Area",
          },
        });

        return {
          id: room.id,
          roomName: room.roomName,
          category: room.category,
          capacity: room.capacity,
          sellableUnits: room.sellableUnits,
          rate: room.baseNightlyRate,
          zone: room.zone ?? "Main Area",
          updatedAt: room.updatedAt,
        };
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes("tenant_room_tenantProfileId_roomName_key")
        ) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "A room with that name already exists.",
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

      const existingRoom = await ctx.db.tenantRoom.findFirst({
        where: {
          id: input.id,
          tenantProfileId: tenantProfile.id,
          isActive: true,
        },
        select: {
          id: true,
          images: {
            select: {
              fileKey: true,
            },
          },
          roomName: true,
        },
      });

      if (!existingRoom) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Room not found.",
        });
      }

      await ctx.db.tenantRoom.delete({
        where: { id: existingRoom.id },
      });

      const fileKeys = existingRoom.images
        .map((image) => image.fileKey)
        .filter((fileKey) => fileKey.length > 0);

      if (fileKeys.length > 0) {
        await utapi.deleteFiles(fileKeys);
      }

      return existingRoom;
    }),

  listImages: protectedProcedure
    .input(
      z.object({
        roomId: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);

      const room = await ctx.db.tenantRoom.findFirst({
        where: {
          id: input.roomId,
          tenantProfileId: tenantProfile.id,
          isActive: true,
        },
        select: {
          images: {
            orderBy: [
              { sortOrder: "asc" },
              { createdAt: "asc" },
            ],
          },
        },
      });

      if (!room) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Room not found.",
        });
      }

      return room.images;
    }),

  addImage: protectedProcedure
    .input(
      z.object({
        roomId: z.string().min(1),
        image: roomImageCreateInputSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);

      const room = await ctx.db.tenantRoom.findFirst({
        where: {
          id: input.roomId,
          tenantProfileId: tenantProfile.id,
          isActive: true,
        },
        select: { id: true },
      });

      if (!room) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Room not found.",
        });
      }

      return ctx.db.tenantRoomImage.create({
        data: {
          roomId: room.id,
          fileKey: input.image.fileKey,
          imageUrl: input.image.imageUrl,
          altText: null,
          caption: input.image.caption?.trim() || null,
          sortOrder: await ctx.db.tenantRoomImage.count({
            where: { roomId: room.id },
          }),
        },
      });
    }),

  updateImage: protectedProcedure
    .input(
      z.object({
        roomId: z.string().min(1),
        imageId: z.string().min(1),
        image: roomImageUpdateInputSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);

      const image = await ctx.db.tenantRoomImage.findFirst({
        where: {
          id: input.imageId,
          roomId: input.roomId,
          room: {
            tenantProfileId: tenantProfile.id,
            isActive: true,
          },
        },
        select: {
          id: true,
          fileKey: true,
        },
      });

      if (!image) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Room image not found.",
        });
      }

      return ctx.db.tenantRoomImage.update({
        where: { id: image.id },
        data: {
          fileKey: input.image.fileKey,
          imageUrl: input.image.imageUrl,
          altText: null,
          caption: input.image.caption?.trim() || null,
          ...(typeof input.image.sortOrder === "number"
            ? { sortOrder: input.image.sortOrder }
            : {}),
        },
      }).then(async (updatedImage) => {
        if (image.fileKey !== input.image.fileKey) {
          await utapi.deleteFiles(image.fileKey);
        }

        return updatedImage;
      });
    }),

  deleteImage: protectedProcedure
    .input(
      z.object({
        roomId: z.string().min(1),
        imageId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);

      const image = await ctx.db.tenantRoomImage.findFirst({
        where: {
          id: input.imageId,
          roomId: input.roomId,
          room: {
            tenantProfileId: tenantProfile.id,
            isActive: true,
          },
        },
        select: {
          id: true,
          caption: true,
          fileKey: true,
          imageUrl: true,
        },
      });

      if (!image) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Room image not found.",
        });
      }

      await ctx.db.tenantRoomImage.delete({
        where: { id: image.id },
      });

      await utapi.deleteFiles(image.fileKey);

      return image;
    }),

  reorderImages: protectedProcedure
    .input(
      z.object({
        roomId: z.string().min(1),
        orderedImageIds: z.array(z.string().min(1)).min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);

      const room = await ctx.db.tenantRoom.findFirst({
        where: {
          id: input.roomId,
          tenantProfileId: tenantProfile.id,
          isActive: true,
        },
        select: {
          id: true,
          images: {
            select: { id: true },
          },
        },
      });

      if (!room) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Room not found.",
        });
      }

      const existingIds = room.images.map((image) => image.id).sort();
      const incomingIds = [...input.orderedImageIds].sort();

      if (
        existingIds.length !== incomingIds.length ||
        existingIds.some((id, index) => id !== incomingIds[index])
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Image ordering payload is invalid.",
        });
      }

      await ctx.db.$transaction(
        input.orderedImageIds.map((imageId, index) =>
          ctx.db.tenantRoomImage.update({
            where: { id: imageId },
            data: { sortOrder: index },
          }),
        ),
      );

      return { success: true };
    }),
});
