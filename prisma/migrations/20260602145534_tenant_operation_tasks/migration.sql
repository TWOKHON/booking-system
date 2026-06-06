-- CreateEnum
CREATE TYPE "TenantOperationTaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "TenantOperationTaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "TenantOperationTaskType" AS ENUM ('CLEAN_ROOM', 'DEEP_CLEAN', 'INSPECT_ROOM', 'MAINTENANCE', 'TURN_DOWN_SERVICE', 'OTHER');

-- CreateTable
CREATE TABLE "tenant_operation_task" (
    "id" TEXT NOT NULL,
    "tenantProfileId" TEXT NOT NULL,
    "roomNo" TEXT NOT NULL,
    "roomType" TEXT NOT NULL,
    "taskType" "TenantOperationTaskType" NOT NULL,
    "description" TEXT NOT NULL,
    "status" "TenantOperationTaskStatus" NOT NULL DEFAULT 'PENDING',
    "assignee" TEXT NOT NULL,
    "initials" TEXT NOT NULL,
    "priority" "TenantOperationTaskPriority" NOT NULL DEFAULT 'MEDIUM',
    "scheduleAt" TIMESTAMP(3),
    "notifyAssignee" BOOLEAN NOT NULL DEFAULT false,
    "reportedBy" TEXT NOT NULL DEFAULT 'Front Desk',
    "source" TEXT,
    "notes" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_operation_task_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tenant_operation_task_tenantProfileId_status_idx" ON "tenant_operation_task"("tenantProfileId", "status");

-- CreateIndex
CREATE INDEX "tenant_operation_task_tenantProfileId_scheduleAt_idx" ON "tenant_operation_task"("tenantProfileId", "scheduleAt");

-- CreateIndex
CREATE INDEX "tenant_operation_task_tenantProfileId_assignee_idx" ON "tenant_operation_task"("tenantProfileId", "assignee");

-- AddForeignKey
ALTER TABLE "tenant_operation_task" ADD CONSTRAINT "tenant_operation_task_tenantProfileId_fkey" FOREIGN KEY ("tenantProfileId") REFERENCES "tenant_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
