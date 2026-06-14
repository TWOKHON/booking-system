export type BillingRecordStatus =
  | "TRIALING"
  | "PENDING"
  | "PAID"
  | "UPCOMING"
  | "PAST_DUE"
  | "CANCELED";

export type BillingRecord = {
  id: string;
  description: string;
  plan: string;
  billingCycle: string;
  amount: number;
  status: BillingRecordStatus;
  dueDate: string;
  paidAt: string | null;
  source: "Polar" | "ResortCloud";
  invoiceUrl: string | null;
};
