-- CreateEnum
CREATE TYPE "TenantSubscriptionPlan" AS ENUM ('STARTER');

-- CreateEnum
CREATE TYPE "TenantBillingCycle" AS ENUM ('MONTHLY');

-- CreateEnum
CREATE TYPE "TenantTeamRole" AS ENUM ('OWNER_ADMIN', 'MANAGER', 'FRONT_DESK', 'HOUSEKEEPING', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "TenantInviteStatus" AS ENUM ('ACCEPTED', 'PENDING');

-- CreateEnum
CREATE TYPE "TenantCommunicationChannelType" AS ENUM ('IN_APP', 'EMAIL', 'SMS', 'PUSH');

-- CreateEnum
CREATE TYPE "TenantNotificationCategory" AS ENUM ('RESERVATIONS', 'GUEST_MESSAGES', 'OPERATIONAL_ALERTS', 'PAYMENTS', 'MARKETING');

-- CreateEnum
CREATE TYPE "TenantNotificationFrequency" AS ENUM ('INSTANT', 'DAILY', 'WEEKLY');

-- AlterTable
ALTER TABLE "tenant_profile" ADD COLUMN     "barangay" TEXT,
ADD COLUMN     "billingAddress" TEXT,
ADD COLUMN     "billingCity" TEXT,
ADD COLUMN     "billingCountry" TEXT DEFAULT 'Philippines',
ADD COLUMN     "billingCycle" "TenantBillingCycle" NOT NULL DEFAULT 'MONTHLY',
ADD COLUMN     "billingEmail" TEXT,
ADD COLUMN     "billingPhoneCountryCode" TEXT DEFAULT '+63',
ADD COLUMN     "billingPhoneNumber" TEXT,
ADD COLUMN     "billingPostalCode" TEXT,
ADD COLUMN     "billingStateProvince" TEXT,
ADD COLUMN     "businessName" TEXT,
ADD COLUMN     "fullAddress" TEXT,
ADD COLUMN     "municipality" TEXT,
ADD COLUMN     "onboardingCompletedAt" TIMESTAMP(3),
ADD COLUMN     "onboardingCurrentStep" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "propertyType" TEXT,
ADD COLUMN     "province" TEXT,
ADD COLUMN     "region" TEXT,
ADD COLUMN     "shortDescription" TEXT,
ADD COLUMN     "website" TEXT,
DROP COLUMN "subscriptionPlan",
ADD COLUMN     "subscriptionPlan" "TenantSubscriptionPlan" NOT NULL DEFAULT 'STARTER';

-- CreateTable
CREATE TABLE "tenant_team_member" (
    "id" TEXT NOT NULL,
    "tenantProfileId" TEXT NOT NULL,
    "name" TEXT,
    "initials" TEXT,
    "email" TEXT NOT NULL,
    "role" "TenantTeamRole" NOT NULL,
    "status" "TenantInviteStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_team_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_communication_channel" (
    "id" TEXT NOT NULL,
    "tenantProfileId" TEXT NOT NULL,
    "channel" "TenantCommunicationChannelType" NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_communication_channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_notification_preference" (
    "id" TEXT NOT NULL,
    "tenantProfileId" TEXT NOT NULL,
    "category" "TenantNotificationCategory" NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "frequency" "TenantNotificationFrequency" NOT NULL DEFAULT 'INSTANT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_notification_preference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tenant_team_member_tenantProfileId_idx" ON "tenant_team_member"("tenantProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_team_member_tenantProfileId_email_role_key" ON "tenant_team_member"("tenantProfileId", "email", "role");

-- CreateIndex
CREATE INDEX "tenant_communication_channel_tenantProfileId_idx" ON "tenant_communication_channel"("tenantProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_communication_channel_tenantProfileId_channel_key" ON "tenant_communication_channel"("tenantProfileId", "channel");

-- CreateIndex
CREATE INDEX "tenant_notification_preference_tenantProfileId_idx" ON "tenant_notification_preference"("tenantProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_notification_preference_tenantProfileId_category_key" ON "tenant_notification_preference"("tenantProfileId", "category");

-- AddForeignKey
ALTER TABLE "tenant_team_member" ADD CONSTRAINT "tenant_team_member_tenantProfileId_fkey" FOREIGN KEY ("tenantProfileId") REFERENCES "tenant_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_communication_channel" ADD CONSTRAINT "tenant_communication_channel_tenantProfileId_fkey" FOREIGN KEY ("tenantProfileId") REFERENCES "tenant_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_notification_preference" ADD CONSTRAINT "tenant_notification_preference_tenantProfileId_fkey" FOREIGN KEY ("tenantProfileId") REFERENCES "tenant_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
