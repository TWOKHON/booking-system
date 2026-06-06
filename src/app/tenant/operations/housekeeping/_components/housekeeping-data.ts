export type RoomStatus =
  | "Clean"
  | "Occupied (Dirty)"
  | "Vacant (Dirty)"
  | "Out of Order"
  | "Out of Service";

export type HousekeepingRoom = {
  id: string;
  roomId: string;
  roomNo: string;
  roomType: string;
  status: RoomStatus;
  occupancy: "Vacant" | "Occupied" | "-";
  assignedTo: string;
  lastCleaned: string;
  notes: string;
};

export type HousekeepingTaskStatus =
  | "Pending"
  | "In Progress"
  | "Completed"
  | "Overdue";

export type HousekeepingTaskSummary = {
  status: HousekeepingTaskStatus;
  count: number;
  percent: number;
};

export type RoomStatusSummary = {
  status: RoomStatus;
  count: number;
  percent: number;
};

export const roomStatusColors: Record<RoomStatus, string> = {
  Clean: "#2f8f2f",
  "Occupied (Dirty)": "#f97316",
  "Vacant (Dirty)": "#f5b400",
  "Out of Order": "#ef321d",
  "Out of Service": "#b8bdc7",
};

export const roomStatuses: RoomStatus[] = [
  "Clean",
  "Occupied (Dirty)",
  "Vacant (Dirty)",
  "Out of Order",
  "Out of Service",
];
