export type TaskStatus = "Pending" | "In Progress" | "Completed";

export type TaskPriority = "Low" | "Medium" | "High";

export type TaskType =
  | "Clean Room"
  | "Deep Clean"
  | "Inspect Room"
  | "Maintenance"
  | "Turn Down Service"
  | "Other";

export type StaffTask = {
  id: string;
  roomId?: string;
  employeeId?: string;
  roomNo: string;
  roomType: string;
  title: TaskType;
  description: string;
  status: TaskStatus;
  assignee: string;
  initials: string;
  priority: TaskPriority;
  dueLabel?: string;
  completedAt?: string;
  scheduleDate?: string;
  scheduleTime?: string;
  notifyAssignee?: boolean;
  reportedBy?: string;
  source?: string;
  notes?: string;
};

export const taskStatuses: TaskStatus[] = [
  "Pending",
  "In Progress",
  "Completed",
];

export const taskTypes: TaskType[] = [
  "Clean Room",
  "Deep Clean",
  "Inspect Room",
  "Maintenance",
  "Turn Down Service",
];
