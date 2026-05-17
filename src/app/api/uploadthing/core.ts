import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const f = createUploadthing();

export const utapi = new UTApi();

export const uploadRouter = {
  roomImageUploader: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .input(
      z.object({
        roomId: z.string().min(1),
      }),
    )
    .middleware(async ({ req, input }) => {
      const session = await auth.api.getSession({
        headers: req.headers,
      });

      if (!session?.user?.id) {
        throw new UploadThingError("You need to sign in to upload room images.");
      }

      const appUser = await db.appUser.findUnique({
        where: { authUserId: session.user.id },
        include: {
          tenantProfile: true,
        },
      });

      if (!appUser?.tenantProfile || appUser.role !== "TENANT") {
        throw new UploadThingError("Only tenant users can upload room images.");
      }

      const room = await db.tenantRoom.findFirst({
        where: {
          id: input.roomId,
          tenantProfileId: appUser.tenantProfile.id,
          isActive: true,
        },
        select: {
          id: true,
        },
      });

      if (!room) {
        throw new UploadThingError("Room not found.");
      }

      return {
        roomId: room.id,
        tenantProfileId: appUser.tenantProfile.id,
        uploaderUserId: session.user.id,
      };
    })
    .onUploadComplete(async ({ file, metadata }) => {
      return {
        roomId: metadata.roomId,
        imageUrl: file.ufsUrl,
        fileKey: file.key,
      };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
