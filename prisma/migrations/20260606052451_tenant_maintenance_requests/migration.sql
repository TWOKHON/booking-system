-- CreateEnum
CREATE TYPE "TenantMaintenanceRequestStatus" AS ENUM ('DRAFT', 'OPEN', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE');

-- CreateEnum
CREATE TYPE "TenantMaintenanceRequestPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "TenantMaintenanceRequestType" AS ENUM ('PLUMBING', 'ELECTRICAL', 'HVAC', 'EQUIPMENT', 'GENERAL', 'IT_NETWORK');

-- CreateTable
CREATE TABLE "tenant_maintenance_request" (
    "id" TEXT NOT NULL,
    "tenantProfileId" TEXT NOT NULL,
    "roomId" TEXT,
    "employeeId" TEXT,
    "requestNumber" TEXT NOT NULL,
    "requestType" "TenantMaintenanceRequestType" NOT NULL,
    "priority" "TenantMaintenanceRequestPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "TenantMaintenanceRequestStatus" NOT NULL DEFAULT 'OPEN',
    "propertyArea" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "issueTitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "asset" TEXT,
    "reportedBy" TEXT NOT NULL,
    "contactNumber" TEXT,
    "preferredAt" TIMESTAMP(3),
    "urgent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "tenant_maintenance_request_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tenant_maintenance_request_tenantProfileId_status_idx" ON "tenant_maintenance_request"("tenantProfileId", "status");

-- CreateIndex
CREATE INDEX "tenant_maintenance_request_tenantProfileId_createdAt_idx" ON "tenant_maintenance_request"("tenantProfileId", "createdAt");

-- CreateIndex
CREATE INDEX "tenant_maintenance_request_roomId_idx" ON "tenant_maintenance_request"("roomId");

-- CreateIndex
CREATE INDEX "tenant_maintenance_request_employeeId_idx" ON "tenant_maintenance_request"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_maintenance_request_tenantProfileId_requestNumber_key" ON "tenant_maintenance_request"("tenantProfileId", "requestNumber");

-- AddForeignKey
ALTER TABLE "tenant_maintenance_request" ADD CONSTRAINT "tenant_maintenance_request_tenantProfileId_fkey" FOREIGN KEY ("tenantProfileId") REFERENCES "tenant_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_maintenance_request" ADD CONSTRAINT "tenant_maintenance_request_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "tenant_room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_maintenance_request" ADD CONSTRAINT "tenant_maintenance_request_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "tenant_employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
