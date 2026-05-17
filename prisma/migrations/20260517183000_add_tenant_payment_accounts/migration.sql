-- CreateEnum
CREATE TYPE "TenantPaymentAccountType" AS ENUM ('CREDIT_CARD', 'BANK_ACCOUNT', 'E_WALLET');

-- CreateTable
CREATE TABLE "tenant_payment_account" (
    "id" TEXT NOT NULL,
    "tenantProfileId" TEXT NOT NULL,
    "accountLabel" TEXT NOT NULL,
    "accountType" "TenantPaymentAccountType" NOT NULL,
    "providerName" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "maskedDetails" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_payment_account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenant_payment_account_tenantProfileId_accountLabel_key" ON "tenant_payment_account"("tenantProfileId", "accountLabel");

-- CreateIndex
CREATE INDEX "tenant_payment_account_tenantProfileId_accountType_idx" ON "tenant_payment_account"("tenantProfileId", "accountType");

-- AddForeignKey
ALTER TABLE "tenant_payment_account" ADD CONSTRAINT "tenant_payment_account_tenantProfileId_fkey" FOREIGN KEY ("tenantProfileId") REFERENCES "tenant_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
