export type PayrollStatus = "READY" | "NEEDS_REVIEW" | "BLOCKED";

export type PayrollRow = {
  id: string;
  employee: {
    id: string;
    fullName: string;
    department: string;
    defaultShift: string;
    hourlyRateCents: number | null;
  };
  regularMinutes: number;
  overtimeMinutes: number;
  undertimeMinutes: number;
  holidayMinutes: number;
  grossPayCents: number;
  deductionsCents: number;
  netPayCents: number;
  status: PayrollStatus;
  notes: string;
};
