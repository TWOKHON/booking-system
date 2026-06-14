import { Webhooks } from "@polar-sh/nextjs";
import { db } from "@/lib/db";

type PolarMetadata = {
  plan?: string;
  billing?: string;
};

type PolarWebhookRecord = Record<string, unknown>;

function asRecord(value: unknown): PolarWebhookRecord | null {
  return value && typeof value === "object" ? (value as PolarWebhookRecord) : null;
}

function readString(record: PolarWebhookRecord | null, key: string) {
  const value = record?.[key];
  return typeof value === "string" ? value : null;
}

function readDate(record: PolarWebhookRecord | null, key: string) {
  const value = record?.[key];

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "string") {
    return new Date(value);
  }

  return null;
}

function readMetadata(record: PolarWebhookRecord | null): PolarMetadata {
  const metadata = asRecord(record?.metadata);
  return {
    plan: readString(metadata, "plan") ?? undefined,
    billing: readString(metadata, "billing") ?? undefined,
  };
}

function toPlan(value: string | undefined) {
  if (value === "starter") return "STARTER" as const;
  if (value === "growth") return "GROWTH" as const;
  if (value === "enterprise") return "ENTERPRISE" as const;
  return null;
}

function toBillingCycle(value: string | undefined) {
  return value === "yearly" ? ("YEARLY" as const) : ("MONTHLY" as const);
}

function readCustomerExternalId(data: PolarWebhookRecord | null) {
  const customer = asRecord(data?.customer);

  return (
    readString(data, "customerExternalId") ??
    readString(data, "customer_external_id") ??
    readString(customer, "externalId") ??
    readString(customer, "external_id")
  );
}

function readSubscriptionRecord(data: PolarWebhookRecord | null) {
  return asRecord(data?.subscription) ?? data;
}

async function syncSubscriptionFromPayload(
  payload: unknown,
  status: "ACTIVE" | "PAST_DUE" | "CANCELED" | "REVOKED",
) {
  const root = asRecord(payload);
  const data = asRecord(root?.data) ?? root;
  const subscription = readSubscriptionRecord(data);
  const metadata = readMetadata(subscription) ?? readMetadata(data);
  const customer = asRecord(data?.customer);
  const subscriptionCustomer = asRecord(subscription?.customer);
  const product = asRecord(data?.product) ?? asRecord(subscription?.product);
  const plan = toPlan(metadata.plan);
  const customerExternalId =
    readCustomerExternalId(data) ??
    readCustomerExternalId(subscription) ??
    readString(subscriptionCustomer, "externalId") ??
    readString(subscriptionCustomer, "external_id") ??
    undefined;

  if (!customerExternalId) {
    return;
  }

  await db.tenantProfile.updateMany({
    where: {
      appUserId: customerExternalId,
    },
    data: {
      ...(plan ? { subscriptionPlan: plan } : {}),
      billingCycle: toBillingCycle(metadata.billing),
      subscriptionStatus: status,
      currentPeriodEnd:
        readDate(subscription, "currentPeriodEnd") ??
        readDate(subscription, "current_period_end") ??
        readDate(data, "currentPeriodEnd") ??
        readDate(data, "current_period_end") ??
        undefined,
      polarCustomerId:
        readString(data, "customerId") ??
        readString(data, "customer_id") ??
        readString(subscription, "customerId") ??
        readString(subscription, "customer_id") ??
        readString(customer, "id") ??
        readString(subscriptionCustomer, "id") ??
        undefined,
      polarSubscriptionId:
        readString(subscription, "id") ??
        readString(data, "subscriptionId") ??
        readString(data, "subscription_id") ??
        undefined,
      polarProductId:
        readString(data, "productId") ??
        readString(data, "product_id") ??
        readString(subscription, "productId") ??
        readString(subscription, "product_id") ??
        readString(product, "id") ??
        undefined,
      suspendedAt: status === "REVOKED" ? new Date() : null,
    },
  });
}

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET ?? "",
  onSubscriptionCreated: async (payload) => {
    await syncSubscriptionFromPayload(payload, "ACTIVE");
  },
  onSubscriptionActive: async (payload) => {
    await syncSubscriptionFromPayload(payload, "ACTIVE");
  },
  onSubscriptionUpdated: async (payload) => {
    await syncSubscriptionFromPayload(payload, "ACTIVE");
  },
  onSubscriptionUncanceled: async (payload) => {
    await syncSubscriptionFromPayload(payload, "ACTIVE");
  },
  onSubscriptionCanceled: async (payload) => {
    await syncSubscriptionFromPayload(payload, "CANCELED");
  },
  onSubscriptionRevoked: async (payload) => {
    await syncSubscriptionFromPayload(payload, "REVOKED");
  },
  onOrderPaid: async (payload) => {
    await syncSubscriptionFromPayload(payload, "ACTIVE");
  },
});
