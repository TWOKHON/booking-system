-- CreateEnum
CREATE TYPE "TenantCashFlowDirection" AS ENUM ('INCOME', 'EXPENSE');

-- CreateEnum
CREATE TYPE "TenantCashFlowType" AS ENUM ('DEPOSIT', 'BALANCE', 'REFUND', 'PETTY_CASH', 'BANK_MATCH');

-- CreateEnum
CREATE TYPE "TenantCashFlowStatus" AS ENUM ('COLLECTED', 'PENDING', 'OVERDUE', 'RECONCILED');

-- CreateTable
CREATE TABLE "tenant_cash_flow_record" (
    "id" TEXT NOT NULL,
    "tenantProfileId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "direction" "TenantCashFlowDirection" NOT NULL,
    "type" "TenantCashFlowType" NOT NULL,
    "guestOrVendor" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "expectedCents" INTEGER NOT NULL,
    "collectedCents" INTEGER NOT NULL DEFAULT 0,
    "status" "TenantCashFlowStatus" NOT NULL DEFAULT 'PENDING',
    "owner" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_cash_flow_record_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tenant_cash_flow_record_tenantProfileId_date_idx" ON "tenant_cash_flow_record"("tenantProfileId", "date");

-- CreateIndex
CREATE INDEX "tenant_cash_flow_record_tenantProfileId_status_idx" ON "tenant_cash_flow_record"("tenantProfileId", "status");

-- CreateIndex
CREATE INDEX "tenant_cash_flow_record_tenantProfileId_direction_idx" ON "tenant_cash_flow_record"("tenantProfileId", "direction");

-- AddForeignKey
ALTER TABLE "tenant_cash_flow_record" ADD CONSTRAINT "tenant_cash_flow_record_tenantProfileId_fkey" FOREIGN KEY ("tenantProfileId") REFERENCES "tenant_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
