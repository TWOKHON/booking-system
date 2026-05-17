CREATE TABLE "tenant_room_image" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "altText" TEXT,
    "caption" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_room_image_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "tenant_room_image_roomId_sortOrder_idx" ON "tenant_room_image"("roomId", "sortOrder");

ALTER TABLE "tenant_room_image"
ADD CONSTRAINT "tenant_room_image_roomId_fkey"
FOREIGN KEY ("roomId") REFERENCES "tenant_room"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
