-- CreateEnum
CREATE TYPE "TenantAutomationDomain" AS ENUM ('RESERVATIONS', 'OPERATIONS', 'COMMUNICATIONS', 'REVENUE');

-- CreateEnum
CREATE TYPE "TenantAutomationStatus" AS ENUM ('ACTIVE', 'DRAFT', 'REVIEW', 'PAUSED');

-- CreateTable
CREATE TABLE "tenant_automation_workflow" (
    "id" TEXT NOT NULL,
    "tenantProfileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" "TenantAutomationDomain" NOT NULL,
    "status" "TenantAutomationStatus" NOT NULL DEFAULT 'DRAFT',
    "triggerLabel" TEXT NOT NULL,
    "assignedTo" TEXT,
    "note" TEXT,
    "priority" BOOLEAN NOT NULL DEFAULT false,
    "runVolume" INTEGER NOT NULL DEFAULT 0,
    "successRate" INTEGER NOT NULL DEFAULT 100,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_automation_workflow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenant_automation_workflow_tenantProfileId_name_key" ON "tenant_automation_workflow"("tenantProfileId", "name");

-- CreateIndex
CREATE INDEX "tenant_automation_workflow_tenantProfileId_status_idx" ON "tenant_automation_workflow"("tenantProfileId", "status");

-- AddForeignKey
ALTER TABLE "tenant_automation_workflow" ADD CONSTRAINT "tenant_automation_workflow_tenantProfileId_fkey" FOREIGN KEY ("tenantProfileId") REFERENCES "tenant_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
