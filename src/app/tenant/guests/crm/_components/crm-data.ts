export type GuestSegment =
  | "VIP"
  | "Returning"
  | "Family"
  | "Corporate"
  | "At Risk"
  | "New";

export type GuestLifecycle = "Active" | "Upcoming" | "Dormant" | "Win-back";

export type GuestProfile = {
  id: string;
  guestName: string;
  email: string;
  phone: string;
  segment: GuestSegment;
  lifecycle: GuestLifecycle;
  lastStay: string;
  nextStay: string;
  totalStays: number;
  lifetimeValue: string;
  lifetimeValueCents: number;
  preference: string;
  nextAction: string;
  owner: string;
  initials: string;
};

export const guestSegments: GuestSegment[] = [
  "VIP",
  "Returning",
  "Family",
  "Corporate",
  "At Risk",
  "New",
];

export const guestLifecycles: GuestLifecycle[] = [
  "Active",
  "Upcoming",
  "Dormant",
  "Win-back",
];
