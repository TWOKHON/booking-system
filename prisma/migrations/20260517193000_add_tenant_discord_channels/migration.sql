-- CreateEnum
CREATE TYPE "TenantDiscordEventScope" AS ENUM (
  'BOOKINGS',
  'OPERATIONS',
  'FINANCE',
  'OWNER_ALERTS',
  'CUSTOM'
);

-- CreateTable
CREATE TABLE "tenant_discord_channel" (
  "id" TEXT NOT NULL,
  "tenantProfileId" TEXT NOT NULL,
  "channelLabel" TEXT NOT NULL,
  "eventScope" "TenantDiscordEventScope" NOT NULL,
  "webhookUrl" TEXT NOT NULL,
  "note" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "tenant_discord_channel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenant_discord_channel_tenantProfileId_channelLabel_key"
ON "tenant_discord_channel"("tenantProfileId", "channelLabel");

-- CreateIndex
CREATE INDEX "tenant_discord_channel_tenantProfileId_eventScope_idx"
ON "tenant_discord_channel"("tenantProfileId", "eventScope");

-- AddForeignKey
ALTER TABLE "tenant_discord_channel"
ADD CONSTRAINT "tenant_discord_channel_tenantProfileId_fkey"
FOREIGN KEY ("tenantProfileId") REFERENCES "tenant_profile"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
