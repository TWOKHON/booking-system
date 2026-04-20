export type ResortCalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  resortName: string;
  tenantName: string;
  roomName: string;
  guestName: string;
  status: "Confirmed" | "Checked In" | "Checkout" | "Blocked";
  source: "Direct" | "OTA" | "Admin";
};

export const resortCalendarEvents: ResortCalendarEvent[] = [
  {
    id: "CAL-5001",
    title: "Andrea Santos",
    start: "2026-04-20",
    end: "2026-04-23",
    resortName: "Alrio Resort Batangas",
    tenantName: "Alrio Hospitality Group",
    roomName: "Family Villa 2",
    guestName: "Andrea Santos",
    status: "Confirmed",
    source: "Direct",
  },
  {
    id: "CAL-5002",
    title: "Michael Reyes",
    start: "2026-04-20T14:00:00",
    end: "2026-04-20T16:00:00",
    resortName: "Azure Cliff Suites",
    tenantName: "Azure Palms Hospitality",
    roomName: "Casita 8",
    guestName: "Michael Reyes",
    status: "Blocked",
    source: "Admin",
  },
  {
    id: "CAL-5003",
    title: "Claire Dizon",
    start: "2026-04-20",
    end: "2026-04-22",
    resortName: "Azure Palms Resort",
    tenantName: "Azure Palms Hospitality",
    roomName: "Garden Suite 4",
    guestName: "Claire Dizon",
    status: "Checked In",
    source: "OTA",
  },
  {
    id: "CAL-5004",
    title: "Paolo Navarro",
    start: "2026-04-21",
    end: "2026-04-24",
    resortName: "Blue Reef Escapes",
    tenantName: "Blue Reef Escapes",
    roomName: "Coral Family 1",
    guestName: "Paolo Navarro",
    status: "Confirmed",
    source: "Direct",
  },
  {
    id: "CAL-5005",
    title: "Angela Yap",
    start: "2026-04-21",
    end: "2026-04-22",
    resortName: "Bayfront Hideaway",
    tenantName: "Bayfront Hideaway",
    roomName: "Bayfront Suite 5",
    guestName: "Angela Yap",
    status: "Confirmed",
    source: "Admin",
  },
  {
    id: "CAL-5006",
    title: "Rina Torres",
    start: "2026-04-22T11:00:00",
    end: "2026-04-22T12:00:00",
    resortName: "Isla Jardin Suites",
    tenantName: "Isla Jardin Retreats",
    roomName: "Isla Deluxe 2",
    guestName: "Rina Torres",
    status: "Checkout",
    source: "Direct",
  },
  {
    id: "CAL-5007",
    title: "Blue Reef Group",
    start: "2026-04-22",
    end: "2026-04-25",
    resortName: "Blue Reef Escapes",
    tenantName: "Blue Reef Escapes",
    roomName: "Reef Suite 6",
    guestName: "Blue Reef Group",
    status: "Confirmed",
    source: "OTA",
  },
  {
    id: "CAL-5008",
    title: "Maintenance Hold",
    start: "2026-04-23",
    end: "2026-04-24",
    resortName: "Coral Peak Resorts",
    tenantName: "Coral Peak Resorts",
    roomName: "Peak Villa 2",
    guestName: "Maintenance Hold",
    status: "Blocked",
    source: "Admin",
  },
  {
    id: "CAL-5009",
    title: "Casa Verde Family",
    start: "2026-04-24",
    end: "2026-04-27",
    resortName: "Casa Verde Private Villas",
    tenantName: "Casa Verde Leisure",
    roomName: "Verde Villa 3",
    guestName: "Casa Verde Family",
    status: "Confirmed",
    source: "Direct",
  },
  {
    id: "CAL-5010",
    title: "Weekend Stay",
    start: "2026-04-25",
    end: "2026-04-27",
    resortName: "Alrio Ridge Villas",
    tenantName: "Alrio Hospitality Group",
    roomName: "Ridge Suite 1",
    guestName: "Weekend Stay",
    status: "Confirmed",
    source: "OTA",
  },
];

export const calendarStatusMeta = [
  { label: "Confirmed", tone: "bg-blue-500" },
  { label: "Checked In", tone: "bg-emerald-500" },
  { label: "Checkout", tone: "bg-amber-500" },
  { label: "Blocked", tone: "bg-rose-500" },
];
