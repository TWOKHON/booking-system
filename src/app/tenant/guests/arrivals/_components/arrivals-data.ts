export type ArrivalStatus =
  | "Due In"
  | "Arrived"
  | "Early"
  | "Delayed"
  | "VIP";

export type RoomReadiness = "Ready" | "Inspecting" | "Dirty" | "Blocked";

export type ArrivalGuest = {
  id: string;
  roomId: string | null;
  guestName: string;
  reservationCode: string;
  room: string;
  roomType: string;
  arrivalTime: string;
  arrivalDate: string;
  nights: number;
  party: string;
  status: ArrivalStatus;
  roomReadiness: RoomReadiness;
  balance: string;
  balanceCents: number;
  notes: string;
};

export const arrivalStatuses: ArrivalStatus[] = [
  "Due In",
  "Arrived",
  "Early",
  "Delayed",
  "VIP",
];

export const roomReadinessOptions: RoomReadiness[] = [
  "Ready",
  "Inspecting",
  "Dirty",
  "Blocked",
];
