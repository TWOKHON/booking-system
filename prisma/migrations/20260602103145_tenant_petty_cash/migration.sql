-- CreateEnum
CREATE TYPE "TenantPettyCashStatus" AS ENUM ('REQUESTED', 'APPROVED', 'RELEASED', 'LIQUIDATED', 'REJECTED');

-- CreateTable
CREATE TABLE "tenant_petty_cash_request" (
    "id" TEXT NOT NULL,
    "tenantProfileId" TEXT NOT NULL,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "neededBy" TIMESTAMP(3) NOT NULL,
    "requester" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "releasedCents" INTEGER NOT NULL DEFAULT 0,
    "liquidatedCents" INTEGER NOT NULL DEFAULT 0,
    "status" "TenantPettyCashStatus" NOT NULL DEFAULT 'REQUESTED',
    "custodian" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_petty_cash_request_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tenant_petty_cash_request_tenantProfileId_status_idx" ON "tenant_petty_cash_request"("tenantProfileId", "status");

-- CreateIndex
CREATE INDEX "tenant_petty_cash_request_tenantProfileId_neededBy_idx" ON "tenant_petty_cash_request"("tenantProfileId", "neededBy");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_petty_cash_request_tenantProfileId_reference_key" ON "tenant_petty_cash_request"("tenantProfileId", "reference");

-- AddForeignKey
ALTER TABLE "tenant_petty_cash_request" ADD CONSTRAINT "tenant_petty_cash_request_tenantProfileId_fkey" FOREIGN KEY ("tenantProfileId") REFERENCES "tenant_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
