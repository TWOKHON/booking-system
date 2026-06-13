import { defaultOnboardingFormData, notificationKeys, type ChannelKey, type NotificationFrequencyOption, type NotificationKey, type OnboardingFormData, type TeamRoleOption } from "./schema";

type TenantTeamRole =
  | "OWNER_ADMIN"
  | "MANAGER"
  | "FRONT_DESK"
  | "HOUSEKEEPING"
  | "MAINTENANCE";
type TenantInviteStatus = "ACCEPTED" | "PENDING";
type TenantCommunicationChannelType = "IN_APP" | "EMAIL" | "SMS" | "PUSH";
type TenantNotificationCategory =
  | "RESERVATIONS"
  | "GUEST_MESSAGES"
  | "OPERATIONAL_ALERTS"
  | "PAYMENTS"
  | "MARKETING";
type TenantNotificationFrequency = "INSTANT" | "DAILY" | "WEEKLY";
type TenantSubscriptionPlan = "FREE_TRIAL" | "STARTER" | "GROWTH" | "ENTERPRISE";
type TenantBillingCycle = "MONTHLY" | "YEARLY";
type TenantPaymentMethod = "CREDIT_CARD" | "BANK_TRANSFER" | "E_WALLET" | "CASH_DEPOSIT";
type TenantPaymentAccountType = "CREDIT_CARD" | "BANK_ACCOUNT" | "E_WALLET";

type TenantProfileWithRelations = {
  resortName: string | null;
  propertyType: string | null;
  fullAddress: string | null;
  region: string | null;
  province: string | null;
  municipality: string | null;
  barangay: string | null;
  phoneNumber: string | null;
  website: string | null;
  shortDescription: string | null;
  subscriptionPlan: TenantSubscriptionPlan;
  billingCycle: TenantBillingCycle;
  businessName: string | null;
  billingEmail: string | null;
  billingPhoneCountryCode: string | null;
  billingPhoneNumber: string | null;
  billingAddress: string | null;
  billingCity: string | null;
  billingStateProvince: string | null;
  billingPostalCode: string | null;
  billingCountry: string | null;
  paymentMethod: TenantPaymentMethod | null;
  cardholderName: string | null;
  cardBrand: string | null;
  cardLastFour: string | null;
  cardExpiry: string | null;
  paymentAccounts: Array<{
    accountLabel: string;
    accountType: TenantPaymentAccountType;
    providerName: string;
    accountName: string;
    maskedDetails: string;
    isDefault: boolean;
    isActive: boolean;
  }>;
  teamMembers: Array<{
    initials: string | null;
    name: string | null;
    email: string;
    role: TenantTeamRole;
    status: TenantInviteStatus;
  }>;
  communicationChannels: Array<{
    channel: TenantCommunicationChannelType;
    enabled: boolean;
  }>;
  notificationPreferences: Array<{
    category: TenantNotificationCategory;
    enabled: boolean;
    frequency: TenantNotificationFrequency;
  }>;
};

const teamRoleToDb: Record<TeamRoleOption, TenantTeamRole> = {
  "Owner/Admin": "OWNER_ADMIN",
  Manager: "MANAGER",
  "Front Desk": "FRONT_DESK",
  Housekeeping: "HOUSEKEEPING",
  Maintenance: "MAINTENANCE",
};

const teamRoleFromDb: Record<TenantTeamRole, TeamRoleOption> = {
  OWNER_ADMIN: "Owner/Admin",
  MANAGER: "Manager",
  FRONT_DESK: "Front Desk",
  HOUSEKEEPING: "Housekeeping",
  MAINTENANCE: "Maintenance",
};

const inviteStatusToDb: Record<"Accepted" | "Pending", TenantInviteStatus> = {
  Accepted: "ACCEPTED",
  Pending: "PENDING",
};

const inviteStatusFromDb: Record<TenantInviteStatus, "Accepted" | "Pending"> = {
  ACCEPTED: "Accepted",
  PENDING: "Pending",
};

const channelToDb: Record<ChannelKey, TenantCommunicationChannelType> = {
  inApp: "IN_APP",
  email: "EMAIL",
  sms: "SMS",
  push: "PUSH",
};

const channelFromDb: Record<TenantCommunicationChannelType, ChannelKey> = {
  IN_APP: "inApp",
  EMAIL: "email",
  SMS: "sms",
  PUSH: "push",
};

const categoryToDb: Record<NotificationKey, TenantNotificationCategory> = {
  reservations: "RESERVATIONS",
  guestMessages: "GUEST_MESSAGES",
  operationalAlerts: "OPERATIONAL_ALERTS",
  payments: "PAYMENTS",
  marketing: "MARKETING",
};

const categoryFromDb: Record<TenantNotificationCategory, NotificationKey> = {
  RESERVATIONS: "reservations",
  GUEST_MESSAGES: "guestMessages",
  OPERATIONAL_ALERTS: "operationalAlerts",
  PAYMENTS: "payments",
  MARKETING: "marketing",
};

const frequencyToDb: Record<NotificationFrequencyOption, TenantNotificationFrequency> = {
  instant: "INSTANT",
  daily: "DAILY",
  weekly: "WEEKLY",
};

const frequencyFromDb: Record<TenantNotificationFrequency, NotificationFrequencyOption> = {
  INSTANT: "instant",
  DAILY: "daily",
  WEEKLY: "weekly",
};

const subscriptionPlanFromDb: Record<
  TenantSubscriptionPlan,
  "free_trial" | "starter" | "growth" | "enterprise"
> = {
  FREE_TRIAL: "free_trial",
  STARTER: "starter",
  GROWTH: "growth",
  ENTERPRISE: "enterprise",
};

const billingCycleFromDb: Record<TenantBillingCycle, "monthly" | "yearly"> = {
  MONTHLY: "monthly",
  YEARLY: "yearly",
};

const paymentMethodFromDb: Record<
  TenantPaymentMethod,
  "credit_card" | "bank_transfer" | "e_wallet" | "cash_deposit"
> = {
  CREDIT_CARD: "credit_card",
  BANK_TRANSFER: "bank_transfer",
  E_WALLET: "e_wallet",
  CASH_DEPOSIT: "cash_deposit",
};

const paymentMethodToDb: Record<
  "credit_card" | "bank_transfer" | "e_wallet" | "cash_deposit",
  TenantPaymentMethod
> = {
  credit_card: "CREDIT_CARD",
  bank_transfer: "BANK_TRANSFER",
  e_wallet: "E_WALLET",
  cash_deposit: "CASH_DEPOSIT",
};

export function mapTenantProfileToFormData(
  tenantProfile: TenantProfileWithRelations | null | undefined,
): OnboardingFormData {
  if (!tenantProfile) {
    return defaultOnboardingFormData;
  }

  const channels = { ...defaultOnboardingFormData.communication.channels };
  for (const channel of tenantProfile.communicationChannels) {
    channels[channelFromDb[channel.channel]] = channel.enabled;
  }

  const preferences = {
    ...defaultOnboardingFormData.communication.preferences,
  };

  for (const preference of tenantProfile.notificationPreferences) {
    preferences[categoryFromDb[preference.category]] = {
      enabled: preference.enabled,
      frequency: frequencyFromDb[preference.frequency],
    };
  }

  const members =
    tenantProfile.teamMembers.length > 0
      ? tenantProfile.teamMembers.map((member) => ({
          initials:
            member.initials ??
            member.email
              .slice(0, 2)
              .toUpperCase(),
          name: member.name ?? "Invited Member",
          email: member.email,
          role: teamRoleFromDb[member.role],
          status: inviteStatusFromDb[member.status],
        }))
      : [];

  return {
    property: {
      resortName: tenantProfile.resortName ?? "",
      propertyType: tenantProfile.propertyType ?? "",
      fullAddress: tenantProfile.fullAddress ?? "",
      region: tenantProfile.region ?? "",
      province: tenantProfile.province ?? "",
      municipality: tenantProfile.municipality ?? "",
      barangay: tenantProfile.barangay ?? "",
      phoneNumber: tenantProfile.phoneNumber ?? "",
      website: tenantProfile.website ?? "",
      shortDescription: tenantProfile.shortDescription ?? "",
    },
    planBilling: {
      subscriptionPlan: subscriptionPlanFromDb[tenantProfile.subscriptionPlan],
      billingCycle: billingCycleFromDb[tenantProfile.billingCycle],
      billingEmail: tenantProfile.billingEmail ?? "",
      billingPhoneCountryCode: tenantProfile.billingPhoneCountryCode ?? "+63",
      billingPhoneNumber: tenantProfile.billingPhoneNumber ?? "",
      billingAddress: tenantProfile.billingAddress ?? "",
      billingCity: tenantProfile.billingCity ?? "",
      billingStateProvince: tenantProfile.billingStateProvince ?? "",
      billingPostalCode: tenantProfile.billingPostalCode ?? "",
      billingCountry: tenantProfile.billingCountry ?? "Philippines",
      paymentMethod: tenantProfile.paymentMethod
        ? paymentMethodFromDb[tenantProfile.paymentMethod]
        : "credit_card",
      paymentAccountLabel:
        tenantProfile.paymentAccounts.find((account) => account.isDefault && account.isActive)
          ?.accountLabel ??
        tenantProfile.paymentAccounts.find((account) => account.isActive)?.accountLabel ??
        defaultOnboardingFormData.planBilling.paymentAccountLabel,
      paymentProviderName:
        tenantProfile.paymentAccounts.find((account) => account.isDefault && account.isActive)
          ?.providerName ??
        tenantProfile.paymentAccounts.find((account) => account.isActive)?.providerName ??
        "",
      paymentAccountName:
        tenantProfile.paymentAccounts.find((account) => account.isDefault && account.isActive)
          ?.accountName ??
        tenantProfile.paymentAccounts.find((account) => account.isActive)?.accountName ??
        "",
      paymentMaskedDetails:
        tenantProfile.paymentAccounts.find((account) => account.isDefault && account.isActive)
          ?.maskedDetails ??
        tenantProfile.paymentAccounts.find((account) => account.isActive)?.maskedDetails ??
        "",
      cardholderName: tenantProfile.cardholderName ?? "",
      cardBrand: tenantProfile.cardBrand ?? "",
      cardLastFour: tenantProfile.cardLastFour ?? "",
      cardExpiry: tenantProfile.cardExpiry ?? "",
    },
    teamSetup: {
      members,
    },
    communication: {
      channels,
      preferences,
    },
  };
}

export function mapFormDataToTenantProfileUpdate(data: OnboardingFormData) {
  const paymentAccount = mapPaymentAccount(data);

  return {
    profile: {
      resortName: data.property.resortName,
      propertyType: data.property.propertyType,
      fullAddress: data.property.fullAddress,
      region: data.property.region,
      province: data.property.province,
      municipality: data.property.municipality,
      barangay: data.property.barangay,
      phoneNumber: data.property.phoneNumber,
      website: data.property.website || null,
      shortDescription: data.property.shortDescription || null,
      billingEmail: data.planBilling.billingEmail || null,
      billingPhoneCountryCode: data.planBilling.billingPhoneCountryCode || "+63",
      billingPhoneNumber: data.planBilling.billingPhoneNumber || null,
      billingAddress: data.planBilling.billingAddress || null,
      billingCity: data.planBilling.billingCity || null,
      billingStateProvince: data.planBilling.billingStateProvince || null,
      billingPostalCode: data.planBilling.billingPostalCode || null,
      billingCountry: data.planBilling.billingCountry || "Philippines",
      paymentMethod: paymentMethodToDb[data.planBilling.paymentMethod],
      cardholderName:
        data.planBilling.paymentMethod === "credit_card"
          ? data.planBilling.cardholderName || null
          : null,
      cardBrand:
        data.planBilling.paymentMethod === "credit_card"
          ? data.planBilling.cardBrand || null
          : null,
      cardLastFour:
        data.planBilling.paymentMethod === "credit_card"
          ? data.planBilling.cardLastFour || null
          : null,
      cardExpiry:
        data.planBilling.paymentMethod === "credit_card"
          ? data.planBilling.cardExpiry || null
          : null,
    },
    paymentAccount,
    teamMembers: data.teamSetup.members.map((member) => ({
      name: member.name,
      initials: member.initials,
      email: member.email.toLowerCase(),
      role: teamRoleToDb[member.role as TeamRoleOption],
      status: inviteStatusToDb[member.status],
    })),
    communicationChannels: Object.entries(data.communication.channels).map(([key, enabled]) => ({
      channel: channelToDb[key as ChannelKey],
      enabled,
    })),
    notificationPreferences: notificationKeys.map((key) => ({
      category: categoryToDb[key],
      enabled: data.communication.preferences[key].enabled,
      frequency: frequencyToDb[data.communication.preferences[key].frequency],
    })),
  };
}

function mapPaymentAccount(data: OnboardingFormData) {
  if (data.planBilling.paymentMethod === "cash_deposit") {
    return null;
  }

  const accountType: TenantPaymentAccountType =
    data.planBilling.paymentMethod === "bank_transfer"
      ? "BANK_ACCOUNT"
      : data.planBilling.paymentMethod === "e_wallet"
        ? "E_WALLET"
        : "CREDIT_CARD";

  const accountLabel =
    data.planBilling.paymentAccountLabel ||
    (accountType === "BANK_ACCOUNT"
      ? "Primary bank account"
      : accountType === "E_WALLET"
        ? "Primary e-wallet"
        : "Primary card");

  const providerName =
    data.planBilling.paymentMethod === "credit_card"
      ? data.planBilling.cardBrand || data.planBilling.paymentProviderName || "Card"
      : data.planBilling.paymentProviderName;

  const accountName =
    data.planBilling.paymentMethod === "credit_card"
      ? data.planBilling.cardholderName
      : data.planBilling.paymentAccountName;

  const maskedDetails =
    data.planBilling.paymentMethod === "credit_card"
      ? data.planBilling.cardLastFour
        ? `•••• ${data.planBilling.cardLastFour}`
        : ""
      : data.planBilling.paymentMaskedDetails;

  if (!providerName || !accountName || !maskedDetails) {
    return null;
  }

  return {
    accountLabel,
    accountType,
    providerName,
    accountName,
    maskedDetails,
    isDefault: true,
    isActive: true,
  };
}
