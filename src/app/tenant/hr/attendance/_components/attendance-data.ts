export type AttendanceStatus = "Present" | "Late" | "On Leave" | "Absent";

export type AttendanceRecord = {
  id: string;
  date: string; // YYYY-MM-DD
  employee: string;
  role: string;
  department: string;
  shift: string;
  checkIn: string;
  checkOut: string;
  hours: string;
  status: AttendanceStatus;
  note: string;
};
