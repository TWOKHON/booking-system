-- CreateTable
CREATE TABLE "tenant_employee" (
    "id" TEXT NOT NULL,
    "tenantProfileId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "roleTitle" TEXT,
    "department" TEXT,
    "defaultShift" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_section" (
    "id" TEXT NOT NULL,
    "tenantProfileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_asset" (
    "id" TEXT NOT NULL,
    "tenantProfileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_domain" (
    "id" TEXT NOT NULL,
    "tenantProfileId" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "type" TEXT NOT NULL DEFAULT 'MANAGED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "tenant_domain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_site_builder" (
    "id" TEXT NOT NULL,
    "tenantProfileId" TEXT NOT NULL,
    "draftData" JSONB,
    "publishedData" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_site_builder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tenant_employee_tenantProfileId_idx" ON "tenant_employee"("tenantProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_employee_tenantProfileId_fullName_key" ON "tenant_employee"("tenantProfileId", "fullName");

-- CreateIndex
CREATE INDEX "tenant_section_tenantProfileId_idx" ON "tenant_section"("tenantProfileId");

-- CreateIndex
CREATE INDEX "tenant_asset_tenantProfileId_idx" ON "tenant_asset"("tenantProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_domain_domain_key" ON "tenant_domain"("domain");

-- CreateIndex
CREATE INDEX "tenant_domain_tenantProfileId_idx" ON "tenant_domain"("tenantProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_site_builder_tenantProfileId_key" ON "tenant_site_builder"("tenantProfileId");

-- AddForeignKey
ALTER TABLE "tenant_employee" ADD CONSTRAINT "tenant_employee_tenantProfileId_fkey" FOREIGN KEY ("tenantProfileId") REFERENCES "tenant_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_section" ADD CONSTRAINT "tenant_section_tenantProfileId_fkey" FOREIGN KEY ("tenantProfileId") REFERENCES "tenant_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_asset" ADD CONSTRAINT "tenant_asset_tenantProfileId_fkey" FOREIGN KEY ("tenantProfileId") REFERENCES "tenant_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_domain" ADD CONSTRAINT "tenant_domain_tenantProfileId_fkey" FOREIGN KEY ("tenantProfileId") REFERENCES "tenant_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_site_builder" ADD CONSTRAINT "tenant_site_builder_tenantProfileId_fkey" FOREIGN KEY ("tenantProfileId") REFERENCES "tenant_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
