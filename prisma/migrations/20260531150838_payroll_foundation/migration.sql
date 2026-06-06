-- CreateEnum
CREATE TYPE "TenantPayrollRunStatus" AS ENUM ('DRAFT', 'FINALIZED');

-- CreateEnum
CREATE TYPE "TenantPayrollLineStatus" AS ENUM ('READY', 'NEEDS_REVIEW');

-- AlterTable
ALTER TABLE "tenant_employee" ADD COLUMN     "hourlyRateCents" INTEGER;

-- CreateTable
CREATE TABLE "tenant_attendance_log" (
    "id" TEXT NOT NULL,
    "tenantProfileId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "checkInTime" TIMESTAMP(3),
    "checkOutTime" TIMESTAMP(3),
    "workedMinutes" INTEGER NOT NULL DEFAULT 0,
    "overtimeMinutes" INTEGER NOT NULL DEFAULT 0,
    "undertimeMinutes" INTEGER NOT NULL DEFAULT 0,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_attendance_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_holiday" (
    "id" TEXT NOT NULL,
    "tenantProfileId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "multiplier" DOUBLE PRECISION NOT NULL DEFAULT 2.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_holiday_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_payroll_run" (
    "id" TEXT NOT NULL,
    "tenantProfileId" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "status" "TenantPayrollRunStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_payroll_run_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_payroll_line" (
    "id" TEXT NOT NULL,
    "payrollRunId" TEXT NOT NULL,
    "tenantProfileId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "regularMinutes" INTEGER NOT NULL DEFAULT 0,
    "overtimeMinutes" INTEGER NOT NULL DEFAULT 0,
    "undertimeMinutes" INTEGER NOT NULL DEFAULT 0,
    "holidayMinutes" INTEGER NOT NULL DEFAULT 0,
    "grossPayCents" INTEGER NOT NULL DEFAULT 0,
    "deductionsCents" INTEGER NOT NULL DEFAULT 0,
    "netPayCents" INTEGER NOT NULL DEFAULT 0,
    "status" "TenantPayrollLineStatus" NOT NULL DEFAULT 'NEEDS_REVIEW',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_payroll_line_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tenant_attendance_log_tenantProfileId_date_idx" ON "tenant_attendance_log"("tenantProfileId", "date");

-- CreateIndex
CREATE INDEX "tenant_attendance_log_employeeId_date_idx" ON "tenant_attendance_log"("employeeId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_attendance_log_tenantProfileId_employeeId_date_key" ON "tenant_attendance_log"("tenantProfileId", "employeeId", "date");

-- CreateIndex
CREATE INDEX "tenant_holiday_tenantProfileId_date_idx" ON "tenant_holiday"("tenantProfileId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_holiday_tenantProfileId_date_key" ON "tenant_holiday"("tenantProfileId", "date");

-- CreateIndex
CREATE INDEX "tenant_payroll_run_tenantProfileId_createdAt_idx" ON "tenant_payroll_run"("tenantProfileId", "createdAt");

-- CreateIndex
CREATE INDEX "tenant_payroll_run_tenantProfileId_periodStart_periodEnd_idx" ON "tenant_payroll_run"("tenantProfileId", "periodStart", "periodEnd");

-- CreateIndex
CREATE INDEX "tenant_payroll_line_tenantProfileId_payrollRunId_idx" ON "tenant_payroll_line"("tenantProfileId", "payrollRunId");

-- CreateIndex
CREATE INDEX "tenant_payroll_line_employeeId_idx" ON "tenant_payroll_line"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_payroll_line_payrollRunId_employeeId_key" ON "tenant_payroll_line"("payrollRunId", "employeeId");

-- AddForeignKey
ALTER TABLE "tenant_attendance_log" ADD CONSTRAINT "tenant_attendance_log_tenantProfileId_fkey" FOREIGN KEY ("tenantProfileId") REFERENCES "tenant_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_attendance_log" ADD CONSTRAINT "tenant_attendance_log_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "tenant_employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_holiday" ADD CONSTRAINT "tenant_holiday_tenantProfileId_fkey" FOREIGN KEY ("tenantProfileId") REFERENCES "tenant_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_payroll_run" ADD CONSTRAINT "tenant_payroll_run_tenantProfileId_fkey" FOREIGN KEY ("tenantProfileId") REFERENCES "tenant_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_payroll_line" ADD CONSTRAINT "tenant_payroll_line_payrollRunId_fkey" FOREIGN KEY ("payrollRunId") REFERENCES "tenant_payroll_run"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_payroll_line" ADD CONSTRAINT "tenant_payroll_line_tenantProfileId_fkey" FOREIGN KEY ("tenantProfileId") REFERENCES "tenant_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_payroll_line" ADD CONSTRAINT "tenant_payroll_line_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "tenant_employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
