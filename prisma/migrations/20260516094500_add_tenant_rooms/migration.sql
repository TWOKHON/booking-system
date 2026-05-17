CREATE TABLE "tenant_room" (
    "id" TEXT NOT NULL,
    "tenantProfileId" TEXT NOT NULL,
    "roomName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "sellableUnits" INTEGER NOT NULL,
    "baseNightlyRate" INTEGER NOT NULL,
    "zone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_room_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "tenant_room_tenantProfileId_idx" ON "tenant_room"("tenantProfileId");

CREATE UNIQUE INDEX "tenant_room_tenantProfileId_roomName_key" ON "tenant_room"("tenantProfileId", "roomName");

ALTER TABLE "tenant_room"
ADD CONSTRAINT "tenant_room_tenantProfileId_fkey"
FOREIGN KEY ("tenantProfileId") REFERENCES "tenant_profile"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
