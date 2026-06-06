-- CreateEnum
CREATE TYPE "TenantArrivalStatus" AS ENUM ('DUE_IN', 'ARRIVED', 'EARLY', 'DELAYED', 'VIP');

-- CreateEnum
CREATE TYPE "TenantArrivalRoomReadiness" AS ENUM ('READY', 'INSPECTING', 'DIRTY', 'BLOCKED');

-- CreateTable
CREATE TABLE "tenant_arrival" (
    "id" TEXT NOT NULL,
    "tenantProfileId" TEXT NOT NULL,
    "roomId" TEXT,
    "guestName" TEXT NOT NULL,
    "reservationCode" TEXT NOT NULL,
    "roomLabel" TEXT NOT NULL,
    "roomType" TEXT NOT NULL,
    "arrivalAt" TIMESTAMP(3) NOT NULL,
    "nights" INTEGER NOT NULL DEFAULT 1,
    "party" TEXT NOT NULL,
    "status" "TenantArrivalStatus" NOT NULL DEFAULT 'DUE_IN',
    "roomReadiness" "TenantArrivalRoomReadiness" NOT NULL DEFAULT 'READY',
    "balanceCents" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_arrival_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tenant_arrival_tenantProfileId_arrivalAt_idx" ON "tenant_arrival"("tenantProfileId", "arrivalAt");

-- CreateIndex
CREATE INDEX "tenant_arrival_tenantProfileId_status_idx" ON "tenant_arrival"("tenantProfileId", "status");

-- CreateIndex
CREATE INDEX "tenant_arrival_roomId_idx" ON "tenant_arrival"("roomId");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_arrival_tenantProfileId_reservationCode_key" ON "tenant_arrival"("tenantProfileId", "reservationCode");

-- AddForeignKey
ALTER TABLE "tenant_arrival" ADD CONSTRAINT "tenant_arrival_tenantProfileId_fkey" FOREIGN KEY ("tenantProfileId") REFERENCES "tenant_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_arrival" ADD CONSTRAINT "tenant_arrival_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "tenant_room"("id") ON DELETE SET NULL ON UPDATE CASCADE;
