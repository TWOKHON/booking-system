import { z } from "zod";
import type { InvitedMember } from "../_components/wizard/types";

export const teamRoleOptions = [
  "Owner/Admin",
  "Manager",
  "Front Desk",
  "Housekeeping",
  "Maintenance",
] as const;

export const notificationKeys = [
  "reservations",
  "guestMessages",
  "operationalAlerts",
  "payments",
  "marketing",
] as const;

export const channelKeys = ["inApp", "email", "sms", "push"] as const;

export const frequencyOptions = ["instant", "daily", "weekly"] as const;

export type TeamRoleOption = (typeof teamRoleOptions)[number];
export type NotificationKey = (typeof notificationKeys)[number];
export type ChannelKey = (typeof channelKeys)[number];
export type NotificationFrequencyOption = (typeof frequencyOptions)[number];

export type OnboardingFormData = {
  property: {
    resortName: string;
    propertyType: string;
    fullAddress: string;
    region: string;
    province: string;
    municipality: string;
    barangay: string;
    phoneNumber: string;
    website: string;
    shortDescription: string;
  };
  planBilling: {
    subscriptionPlan: "free_trial" | "starter" | "growth" | "enterprise";
    billingCycle: "monthly" | "yearly";
    billingEmail: string;
    billingPhoneCountryCode: string;
    billingPhoneNumber: string;
    billingAddress: string;
    billingCity: string;
    billingStateProvince: string;
    billingPostalCode: string;
    billingCountry: string;
    paymentMethod: "credit_card" | "bank_transfer" | "e_wallet" | "cash_deposit";
    paymentAccountLabel: string;
    paymentProviderName: string;
    paymentAccountName: string;
    paymentMaskedDetails: string;
    cardholderName: string;
    cardBrand: string;
    cardLastFour: string;
    cardExpiry: string;
  };
  teamSetup: {
    members: InvitedMember[];
  };
  communication: {
    channels: Record<ChannelKey, boolean>;
    preferences: Record<
      NotificationKey,
      {
        enabled: boolean;
        frequency: NotificationFrequencyOption;
      }
    >;
  };
};

export const defaultOnboardingFormData: OnboardingFormData = {
  property: {
    resortName: "",
    propertyType: "",
    fullAddress: "",
    region: "",
    province: "",
    municipality: "",
    barangay: "",
    phoneNumber: "",
    website: "",
    shortDescription: "",
  },
  planBilling: {
    subscriptionPlan: "starter",
    billingCycle: "monthly",
    billingEmail: "",
    billingPhoneCountryCode: "+63",
    billingPhoneNumber: "",
    billingAddress: "",
    billingCity: "",
    billingStateProvince: "",
    billingPostalCode: "",
    billingCountry: "Philippines",
    paymentMethod: "credit_card",
    paymentAccountLabel: "Primary collection account",
    paymentProviderName: "",
    paymentAccountName: "",
    paymentMaskedDetails: "",
    cardholderName: "",
    cardBrand: "",
    cardLastFour: "",
    cardExpiry: "",
  },
  teamSetup: {
    members: [],
  },
  communication: {
    channels: {
      inApp: true,
      email: true,
      sms: false,
      push: true,
    },
    preferences: {
      reservations: { enabled: true, frequency: "instant" },
      guestMessages: { enabled: true, frequency: "instant" },
      operationalAlerts: { enabled: true, frequency: "instant" },
      payments: { enabled: true, frequency: "daily" },
      marketing: { enabled: true, frequency: "weekly" },
    },
  },
};

const invitedMemberSchema = z.object({
  initials: z.string().trim().min(1).max(4),
  name: z.string().trim().min(1).max(120),
  email: z.email().transform((value) => value.toLowerCase()),
  role: z.enum(teamRoleOptions),
  status: z.enum(["Accepted", "Pending"]),
});

export const onboardingFormSchema = z.object({
  property: z.object({
    resortName: z.string().trim().min(1, "Resort name is required."),
    propertyType: z.string().trim().min(1, "Property type is required."),
    fullAddress: z.string().trim().min(1, "Full address is required."),
    region: z.string().trim().min(1, "Region is required."),
    province: z.string().trim().min(1, "Province is required."),
    municipality: z.string().trim().min(1, "Municipality is required."),
    barangay: z.string().trim().min(1, "Barangay is required."),
    phoneNumber: z.string().trim().min(1, "Phone number is required."),
    website: z.string().trim().max(255).optional().transform((value) => value ?? ""),
    shortDescription: z.string().trim().max(200).optional().transform((value) => value ?? ""),
  }),
  planBilling: z.object({
    subscriptionPlan: z.enum(["free_trial", "starter", "growth", "enterprise"]),
    billingCycle: z.enum(["monthly", "yearly"]),
    billingEmail: z.string().trim(),
    billingPhoneCountryCode: z.string().trim().default("+63"),
    billingPhoneNumber: z.string().trim(),
    billingAddress: z.string().trim(),
    billingCity: z.string().trim(),
    billingStateProvince: z.string().trim(),
    billingPostalCode: z.string().trim(),
    billingCountry: z.string().trim().default("Philippines"),
    paymentMethod: z.enum([
      "credit_card",
      "bank_transfer",
      "e_wallet",
      "cash_deposit",
    ]),
    paymentAccountLabel: z.string().trim().max(120),
    paymentProviderName: z.string().trim().max(120),
    paymentAccountName: z.string().trim().max(120),
    paymentMaskedDetails: z.string().trim().max(120),
    cardholderName: z.string().trim(),
    cardBrand: z.string().trim(),
    cardLastFour: z.string().trim(),
    cardExpiry: z.string().trim(),
  }),
  teamSetup: z.object({
    members: z.array(invitedMemberSchema),
  }),
  communication: z.object({
    channels: z.object({
      inApp: z.boolean(),
      email: z.boolean(),
      sms: z.boolean(),
      push: z.boolean(),
    }),
    preferences: z.object({
      reservations: z.object({
        enabled: z.boolean(),
        frequency: z.enum(frequencyOptions),
      }),
      guestMessages: z.object({
        enabled: z.boolean(),
        frequency: z.enum(frequencyOptions),
      }),
      operationalAlerts: z.object({
        enabled: z.boolean(),
        frequency: z.enum(frequencyOptions),
      }),
      payments: z.object({
        enabled: z.boolean(),
        frequency: z.enum(frequencyOptions),
      }),
      marketing: z.object({
        enabled: z.boolean(),
        frequency: z.enum(frequencyOptions),
      }),
    }),
  }),
});

export const saveOnboardingPayloadSchema = z.object({
  data: onboardingFormSchema,
  currentStep: z.number().int().min(0).max(5),
});

export const onboardingLocalDraftSchema = z.object({
  version: z.literal(3),
  data: onboardingFormSchema,
  currentStep: z.number().int().min(0).max(5),
});

export const onboardingPlanSelectionSchema = z.object({
  plan: z.enum(["free_trial", "starter", "growth", "enterprise"]).optional(),
  billing: z.enum(["monthly", "yearly"]).optional(),
});
