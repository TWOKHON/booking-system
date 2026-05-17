CREATE TABLE "tenant_service" (
  "id" TEXT NOT NULL,
  "tenantProfileId" TEXT NOT NULL,
  "serviceName" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "basePrice" INTEGER NOT NULL,
  "unitLabel" TEXT,
  "availability" TEXT,
  "description" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "tenant_service_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "tenant_service_tenantProfileId_serviceName_key"
ON "tenant_service"("tenantProfileId", "serviceName");

CREATE INDEX "tenant_service_tenantProfileId_idx"
ON "tenant_service"("tenantProfileId");

ALTER TABLE "tenant_service"
ADD CONSTRAINT "tenant_service_tenantProfileId_fkey"
FOREIGN KEY ("tenantProfileId") REFERENCES "tenant_profile"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
