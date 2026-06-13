-- CreateEnum
CREATE TYPE "TenantSubscriptionStatus" AS ENUM ('PENDING', 'TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELED', 'REVOKED', 'SUSPENDED');

-- AlterTable
ALTER TABLE "tenant_profile"
ADD COLUMN     "subscriptionStatus" "TenantSubscriptionStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "trialStartedAt" TIMESTAMP(3),
ADD COLUMN     "trialEndsAt" TIMESTAMP(3),
ADD COLUMN     "currentPeriodEnd" TIMESTAMP(3),
ADD COLUMN     "suspendedAt" TIMESTAMP(3),
ADD COLUMN     "stripeCustomerId" TEXT,
ADD COLUMN     "stripeSubscriptionId" TEXT,
ADD COLUMN     "polarCustomerId" TEXT,
ADD COLUMN     "polarSubscriptionId" TEXT,
ADD COLUMN     "polarProductId" TEXT;

-- Backfill free-trial tenants so existing data has a meaningful status.
UPDATE "tenant_profile"
SET "subscriptionStatus" = 'TRIALING'
WHERE "subscriptionPlan" = 'FREE_TRIAL';
