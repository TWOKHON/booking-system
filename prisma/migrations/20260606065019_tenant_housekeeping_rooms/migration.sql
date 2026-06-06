-- CreateEnum
CREATE TYPE "TenantHousekeepingRoomStatus" AS ENUM ('CLEAN', 'OCCUPIED_DIRTY', 'VACANT_DIRTY', 'OUT_OF_ORDER', 'OUT_OF_SERVICE');

-- CreateEnum
CREATE TYPE "TenantHousekeepingOccupancy" AS ENUM ('VACANT', 'OCCUPIED', 'NONE');

-- CreateTable
CREATE TABLE "tenant_housekeeping_room" (
    "id" TEXT NOT NULL,
    "tenantProfileId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "employeeId" TEXT,
    "status" "TenantHousekeepingRoomStatus" NOT NULL DEFAULT 'CLEAN',
    "occupancy" "TenantHousekeepingOccupancy" NOT NULL DEFAULT 'VACANT',
    "assignedTo" TEXT,
    "lastCleanedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_housekeeping_room_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenant_housekeeping_room_roomId_key" ON "tenant_housekeeping_room"("roomId");

-- CreateIndex
CREATE INDEX "tenant_housekeeping_room_tenantProfileId_status_idx" ON "tenant_housekeeping_room"("tenantProfileId", "status");

-- CreateIndex
CREATE INDEX "tenant_housekeeping_room_employeeId_idx" ON "tenant_housekeeping_room"("employeeId");

-- AddForeignKey
ALTER TABLE "tenant_housekeeping_room" ADD CONSTRAINT "tenant_housekeeping_room_tenantProfileId_fkey" FOREIGN KEY ("tenantProfileId") REFERENCES "tenant_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_housekeeping_room" ADD CONSTRAINT "tenant_housekeeping_room_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "tenant_room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_housekeeping_room" ADD CONSTRAINT "tenant_housekeeping_room_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "tenant_employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
