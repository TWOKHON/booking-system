-- CreateEnum
CREATE TYPE "TenantLeaveStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "tenant_leave_application" (
    "id" TEXT NOT NULL,
    "tenantProfileId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "leaveType" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "days" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "TenantLeaveStatus" NOT NULL DEFAULT 'PENDING',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decidedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_leave_application_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tenant_leave_application_tenantProfileId_status_idx" ON "tenant_leave_application"("tenantProfileId", "status");

-- CreateIndex
CREATE INDEX "tenant_leave_application_tenantProfileId_requestedAt_idx" ON "tenant_leave_application"("tenantProfileId", "requestedAt");

-- CreateIndex
CREATE INDEX "tenant_leave_application_employeeId_idx" ON "tenant_leave_application"("employeeId");

-- AddForeignKey
ALTER TABLE "tenant_leave_application" ADD CONSTRAINT "tenant_leave_application_tenantProfileId_fkey" FOREIGN KEY ("tenantProfileId") REFERENCES "tenant_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_leave_application" ADD CONSTRAINT "tenant_leave_application_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "tenant_employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
