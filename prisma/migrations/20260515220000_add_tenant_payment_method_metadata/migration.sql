CREATE TYPE "public"."TenantPaymentMethod" AS ENUM (
  'CREDIT_CARD',
  'BANK_TRANSFER',
  'E_WALLET',
  'CASH_DEPOSIT'
);

ALTER TABLE "public"."tenant_profile"
ADD COLUMN "paymentMethod" "public"."TenantPaymentMethod" DEFAULT 'CREDIT_CARD',
ADD COLUMN "cardholderName" TEXT,
ADD COLUMN "cardBrand" TEXT,
ADD COLUMN "cardLastFour" TEXT,
ADD COLUMN "cardExpiry" TEXT;
