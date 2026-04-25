export type SalesRecord = {
  id: string;
  leadName: string;
  resortName: string;
  tenantName: string;
  salesType:
    | "Room Booking"
    | "Group Stay"
    | "Wedding Event"
    | "Corporate Retreat"
    | "Day Tour"
    | "Amenity Package";
  pipelineStage:
    | "New Lead"
    | "Qualified"
    | "Proposal Sent"
    | "Negotiation"
    | "Confirmed"
    | "Lost";
  sourceChannel:
    | "Website"
    | "Walk-In"
    | "OTA"
    | "Facebook"
    | "Travel Agent"
    | "Referral";
  campaignName: string;
  attributionStatus: "Attributed" | "Needs Review" | "Untracked";
  followUpStatus: "On Track" | "Due Today" | "Overdue";
  quotedValue: number;
  targetStayOrEvent: string;
  salesOwner: string;
  salesNote: string;
  lastUpdated: string;
  priority: boolean;
};

export const salesRecords: SalesRecord[] = [
  {
    id: "SL-10101",
    leadName: "Andrea Santos Family Stay",
    resortName: "Alrio Resort Batangas",
    tenantName: "Alrio Hospitality Group",
    salesType: "Room Booking",
    pipelineStage: "Negotiation",
    sourceChannel: "Website",
    campaignName: "Summer Villa Escape",
    attributionStatus: "Attributed",
    followUpStatus: "Due Today",
    quotedValue: 42800,
    targetStayOrEvent: "May 3-5, 2026",
    salesOwner: "Kara Mendoza",
    salesNote: "Guest requested villa upgrade option before deposit release",
    lastUpdated: "7 mins ago",
    priority: true,
  },
  {
    id: "SL-10102",
    leadName: "Azure Wellness Group",
    resortName: "Azure Palms Resort",
    tenantName: "Azure Palms Hospitality",
    salesType: "Group Stay",
    pipelineStage: "Proposal Sent",
    sourceChannel: "Travel Agent",
    campaignName: "Wellness Group Push",
    attributionStatus: "Attributed",
    followUpStatus: "Due Today",
    quotedValue: 196000,
    targetStayOrEvent: "May 18-20, 2026",
    salesOwner: "Liza Ong",
    salesNote: "Awaiting rooming list and spa package confirmation",
    lastUpdated: "15 mins ago",
    priority: true,
  },
  {
    id: "SL-10103",
    leadName: "Casa Verde Wedding Inquiry",
    resortName: "Casa Verde Private Villas",
    tenantName: "Casa Verde Leisure",
    salesType: "Wedding Event",
    pipelineStage: "Qualified",
    sourceChannel: "Facebook",
    campaignName: "Beach Wedding Reels",
    attributionStatus: "Attributed",
    followUpStatus: "On Track",
    quotedValue: 312000,
    targetStayOrEvent: "June 21, 2026",
    salesOwner: "Mira Valdez",
    salesNote: "Venue ocular is scheduled for Saturday afternoon",
    lastUpdated: "10 mins ago",
    priority: false,
  },
  {
    id: "SL-10104",
    leadName: "Blue Reef Corporate Team",
    resortName: "Blue Reef Escapes",
    tenantName: "Blue Reef Escapes",
    salesType: "Corporate Retreat",
    pipelineStage: "Proposal Sent",
    sourceChannel: "Referral",
    campaignName: "B2B Retreat Outreach",
    attributionStatus: "Needs Review",
    followUpStatus: "Overdue",
    quotedValue: 248500,
    targetStayOrEvent: "May 27-29, 2026",
    salesOwner: "Janine Castro",
    salesNote: "Decision maker has not responded to transport add-on revision",
    lastUpdated: "23 mins ago",
    priority: true,
  },
  {
    id: "SL-10105",
    leadName: "Coral Peak Day Tour Batch",
    resortName: "Coral Peak Resorts",
    tenantName: "Coral Peak Resorts",
    salesType: "Day Tour",
    pipelineStage: "Confirmed",
    sourceChannel: "Travel Agent",
    campaignName: "Summer Team Excursions",
    attributionStatus: "Attributed",
    followUpStatus: "On Track",
    quotedValue: 73500,
    targetStayOrEvent: "May 12, 2026",
    salesOwner: "Mina Torres",
    salesNote: "Headcount and lunch inclusion already finalized",
    lastUpdated: "9 mins ago",
    priority: false,
  },
  {
    id: "SL-10106",
    leadName: "Bayfront Barkada Getaway",
    resortName: "Bayfront Hideaway",
    tenantName: "Bayfront Hideaway",
    salesType: "Room Booking",
    pipelineStage: "Qualified",
    sourceChannel: "Walk-In",
    campaignName: "Weekend Barkada Rate",
    attributionStatus: "Untracked",
    followUpStatus: "On Track",
    quotedValue: 28600,
    targetStayOrEvent: "May 9-10, 2026",
    salesOwner: "Noel Ramos",
    salesNote: "Guest comparing direct rate with OTA weekend promo",
    lastUpdated: "11 mins ago",
    priority: false,
  },
  {
    id: "SL-10107",
    leadName: "Isla Retreat Couples Package",
    resortName: "Isla Jardin Suites",
    tenantName: "Isla Jardin Retreats",
    salesType: "Amenity Package",
    pipelineStage: "New Lead",
    sourceChannel: "Website",
    campaignName: "Couples Recharge Bundle",
    attributionStatus: "Attributed",
    followUpStatus: "Due Today",
    quotedValue: 19800,
    targetStayOrEvent: "May 16, 2026",
    salesOwner: "Rica Flores",
    salesNote: "Lead asked for shuttle and spa bundle pricing",
    lastUpdated: "8 mins ago",
    priority: false,
  },
  {
    id: "SL-10108",
    leadName: "Peak Wellness Executive Stay",
    resortName: "Coral Peak Resorts",
    tenantName: "Coral Peak Resorts",
    salesType: "Corporate Retreat",
    pipelineStage: "Negotiation",
    sourceChannel: "Referral",
    campaignName: "Executive Wellness Push",
    attributionStatus: "Needs Review",
    followUpStatus: "Overdue",
    quotedValue: 154000,
    targetStayOrEvent: "June 3-4, 2026",
    salesOwner: "Mina Torres",
    salesNote: "Client is waiting for final billing schedule and boardroom inclusion",
    lastUpdated: "21 mins ago",
    priority: true,
  },
  {
    id: "SL-10109",
    leadName: "Azure Anniversary Dinner",
    resortName: "Azure Cliff Suites",
    tenantName: "Azure Palms Hospitality",
    salesType: "Amenity Package",
    pipelineStage: "Confirmed",
    sourceChannel: "Facebook",
    campaignName: "Anniversary Dining Ads",
    attributionStatus: "Attributed",
    followUpStatus: "On Track",
    quotedValue: 22400,
    targetStayOrEvent: "May 7, 2026",
    salesOwner: "Paula Ramos",
    salesNote: "Private dinner deck and floral package already approved",
    lastUpdated: "12 mins ago",
    priority: false,
  },
  {
    id: "SL-10110",
    leadName: "Wave Hall Product Launch",
    resortName: "Blue Reef Escapes",
    tenantName: "Blue Reef Escapes",
    salesType: "Corporate Retreat",
    pipelineStage: "Qualified",
    sourceChannel: "Referral",
    campaignName: "Event Venue Prospecting",
    attributionStatus: "Needs Review",
    followUpStatus: "Due Today",
    quotedValue: 268000,
    targetStayOrEvent: "June 14, 2026",
    salesOwner: "Janine Castro",
    salesNote: "Client requested final AV and breakout room pricing",
    lastUpdated: "16 mins ago",
    priority: true,
  },
];
