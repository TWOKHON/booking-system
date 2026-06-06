export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED";

export type LeaveApplication = {
  id: string;
  employee: {
    id: string;
    fullName: string;
    department: string;
  };
  leaveType: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  days: number;
  status: LeaveStatus;
  reason: string;
  requestedAt: string; // ISO
  decidedAt: string | null; // ISO
  updatedAt: string; // ISO
};
