-- CreateEnum
CREATE TYPE "TenantGuestSegment" AS ENUM ('VIP', 'RETURNING', 'FAMILY', 'CORPORATE', 'AT_RISK', 'NEW');

-- CreateEnum
CREATE TYPE "TenantGuestLifecycle" AS ENUM ('ACTIVE', 'UPCOMING', 'DORMANT', 'WIN_BACK');

-- CreateTable
CREATE TABLE "tenant_guest_profile" (
    "id" TEXT NOT NULL,
    "tenantProfileId" TEXT NOT NULL,
    "guestName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "segment" "TenantGuestSegment" NOT NULL DEFAULT 'NEW',
    "lifecycle" "TenantGuestLifecycle" NOT NULL DEFAULT 'ACTIVE',
    "lastStayAt" TIMESTAMP(3),
    "nextStayAt" TIMESTAMP(3),
    "totalStays" INTEGER NOT NULL DEFAULT 0,
    "lifetimeValueCents" INTEGER NOT NULL DEFAULT 0,
    "preference" TEXT,
    "nextAction" TEXT,
    "owner" TEXT NOT NULL DEFAULT 'Front Desk',
    "initials" TEXT NOT NULL DEFAULT 'FD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_guest_profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tenant_guest_profile_tenantProfileId_segment_idx" ON "tenant_guest_profile"("tenantProfileId", "segment");

-- CreateIndex
CREATE INDEX "tenant_guest_profile_tenantProfileId_lifecycle_idx" ON "tenant_guest_profile"("tenantProfileId", "lifecycle");

-- CreateIndex
CREATE INDEX "tenant_guest_profile_tenantProfileId_nextStayAt_idx" ON "tenant_guest_profile"("tenantProfileId", "nextStayAt");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_guest_profile_tenantProfileId_email_key" ON "tenant_guest_profile"("tenantProfileId", "email");

-- AddForeignKey
ALTER TABLE "tenant_guest_profile" ADD CONSTRAINT "tenant_guest_profile_tenantProfileId_fkey" FOREIGN KEY ("tenantProfileId") REFERENCES "tenant_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
