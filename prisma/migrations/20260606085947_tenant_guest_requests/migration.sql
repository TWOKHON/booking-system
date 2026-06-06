-- CreateEnum
CREATE TYPE "TenantGuestRequestStatus" AS ENUM ('NEW', 'ACKNOWLEDGED', 'IN_PROGRESS', 'COMPLETED', 'ESCALATED');

-- CreateEnum
CREATE TYPE "TenantGuestRequestPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "TenantGuestRequestType" AS ENUM ('AMENITY', 'DINING', 'TRANSPORT', 'HOUSEKEEPING', 'MAINTENANCE', 'CONCIERGE', 'CONNECTIVITY');

-- CreateTable
CREATE TABLE "tenant_guest_request" (
    "id" TEXT NOT NULL,
    "tenantProfileId" TEXT NOT NULL,
    "roomId" TEXT,
    "employeeId" TEXT,
    "requestNumber" TEXT NOT NULL,
    "guestName" TEXT NOT NULL,
    "roomLabel" TEXT NOT NULL,
    "requestType" "TenantGuestRequestType" NOT NULL,
    "title" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "priority" "TenantGuestRequestPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "TenantGuestRequestStatus" NOT NULL DEFAULT 'NEW',
    "assignedTo" TEXT NOT NULL,
    "initials" TEXT NOT NULL,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueAt" TIMESTAMP(3),
    "revenueTag" TEXT NOT NULL DEFAULT '-',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_guest_request_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tenant_guest_request_tenantProfileId_requestedAt_idx" ON "tenant_guest_request"("tenantProfileId", "requestedAt");

-- CreateIndex
CREATE INDEX "tenant_guest_request_tenantProfileId_status_idx" ON "tenant_guest_request"("tenantProfileId", "status");

-- CreateIndex
CREATE INDEX "tenant_guest_request_tenantProfileId_priority_idx" ON "tenant_guest_request"("tenantProfileId", "priority");

-- CreateIndex
CREATE INDEX "tenant_guest_request_roomId_idx" ON "tenant_guest_request"("roomId");

-- CreateIndex
CREATE INDEX "tenant_guest_request_employeeId_idx" ON "tenant_guest_request"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_guest_request_tenantProfileId_requestNumber_key" ON "tenant_guest_request"("tenantProfileId", "requestNumber");

-- AddForeignKey
ALTER TABLE "tenant_guest_request" ADD CONSTRAINT "tenant_guest_request_tenantProfileId_fkey" FOREIGN KEY ("tenantProfileId") REFERENCES "tenant_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_guest_request" ADD CONSTRAINT "tenant_guest_request_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "tenant_room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_guest_request" ADD CONSTRAINT "tenant_guest_request_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "tenant_employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
