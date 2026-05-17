import type { ReactNode } from "react";
import {
  BedDoubleIcon,
  BotIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  GlobeIcon,
  HelpCircleIcon,
  HouseIcon,
  LayoutGridIcon,
  MessageSquareMoreIcon,
  Settings2Icon,
  SparklesIcon,
  TagsIcon,
  UsersIcon,
  WrenchIcon,
} from "lucide-react";

export type TenantSidebarNavItem = {
  title: string;
  path?: string;
  icon?: ReactNode;
  isActive?: boolean;
  hasActiveSubItem?: boolean;
  subItems?: TenantSidebarNavItem[];
};

export type TenantSidebarNavGroup = {
  label?: string;
  items: TenantSidebarNavItem[];
};

const isPathActive = (pathname: string, path?: string) => {
  if (!path || path === "#" || path.startsWith("#")) {
    return false;
  }

  if (path === "/") {
    return pathname === path;
  }

  return pathname === path || pathname.startsWith(`${path}/`);
};

const getBestMatchedPath = (pathname: string, items: TenantSidebarNavItem[]) => {
  const matches = items
    .filter((item) => isPathActive(pathname, item.path))
    .map((item) => item.path)
    .filter((path): path is string => Boolean(path))
    .sort((a, b) => b.length - a.length);

  return matches[0];
};

export const tenantNavGroups: TenantSidebarNavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        path: "/tenant/dashboard",
        icon: <LayoutGridIcon />,
      },
    ],
  },
  {
    label: "Guest Journey",
    items: [
      {
        title: "Reservations",
        path: "#",
        icon: <CalendarDaysIcon />,
        subItems: [
          { title: "Booking Calendar", path: "/tenant/reservations/calendar" },
          { title: "Reservation Board", path: "/tenant/reservations/bookings" },
          { title: "Check-in & Check-out", path: "/tenant/reservations/check-in-out" },
        ],
      },
      {
        title: "Guest Experience",
        path: "#",
        icon: <UsersIcon />,
        subItems: [
          { title: "Today’s Arrivals", path: "/tenant/guests/arrivals" },
          { title: "Guest Requests", path: "/tenant/guests/requests" },
          { title: "Guest CRM", path: "/tenant/guests/crm" },
        ],
      },
      {
        title: "Operations",
        path: "#",
        icon: <WrenchIcon />,
        subItems: [
          { title: "Housekeeping", path: "/tenant/operations/housekeeping" },
          { title: "Maintenance", path: "/tenant/operations/maintenance" },
          { title: "Staff Task Board", path: "/tenant/operations/tasks" },
        ],
      },
    ],
  },
  {
    label: "Growth & Revenue",
    items: [
      {
        title: "Revenue Tools",
        path: "#",
        icon: <CreditCardIcon />,
        subItems: [
          { title: "Rates & Availability", path: "/tenant/revenue/rates" },
          { title: "Packages & Upsells", path: "/tenant/revenue/packages" },
          { title: "Revenue Reports", path: "/tenant/revenue/reports" },
        ],
      },
      {
        title: "Distribution",
        path: "#",
        icon: <GlobeIcon />,
        subItems: [
          { title: "Website Funnel", path: "/tenant/channels/website" },
          { title: "AI Concierge", path: "/tenant/channels/chatbot" },
        ],
      },
      {
        title: "Property Settings",
        path: "#",
        icon: <Settings2Icon />,
        subItems: [
          { title: "Property Setup", path: "/tenant/settings/property" },
          { title: "Rooms & Inventory", path: "/tenant/settings/rooms" },
          { title: "Services Offered", path: "/tenant/settings/services" },
          { title: "Team Access", path: "/tenant/settings/team" },
          { title: "Automations", path: "/tenant/settings/automations" },
        ],
      },
    ],
  },
];

export const tenantFooterNavLinks: TenantSidebarNavItem[] = [
  {
    title: "Help & Training",
    path: "/tenant/help",
    icon: <HelpCircleIcon />,
  },
];

export const tenantNavLinks: TenantSidebarNavItem[] = [
  ...tenantNavGroups.flatMap((group) =>
    group.items.flatMap((item) =>
      item.subItems?.length ? [item, ...item.subItems] : [item],
    ),
  ),
  ...tenantFooterNavLinks,
];

export const getTenantNavGroups = (
  pathname: string,
): TenantSidebarNavGroup[] =>
  tenantNavGroups.map((group) => ({
    ...group,
    items: group.items.map((item) => {
      const bestSubItemPath = getBestMatchedPath(pathname, item.subItems ?? []);
      const activeSubItems =
        item.subItems?.map((subItem) => ({
          ...subItem,
          isActive: subItem.path === bestSubItemPath,
        })) ?? [];

      return {
        ...item,
        isActive: isPathActive(pathname, item.path),
        hasActiveSubItem: activeSubItems.some((subItem) => subItem.isActive),
        subItems: activeSubItems.length ? activeSubItems : item.subItems,
      };
    }),
  }));

export const getTenantFooterNavLinks = (pathname: string): TenantSidebarNavItem[] =>
  tenantFooterNavLinks.map((item) => ({
    ...item,
    isActive: isPathActive(pathname, item.path),
  }));

export const getActiveTenantNavItem = (
  pathname: string,
): TenantSidebarNavItem | undefined =>
  [...tenantNavLinks]
    .filter((item) => isPathActive(pathname, item.path))
    .sort((a, b) => (b.path?.length ?? 0) - (a.path?.length ?? 0))[0];

export type TenantWorkspacePath =
  | "/tenant/dashboard"
  | "/tenant/reservations/calendar"
  | "/tenant/reservations/bookings"
  | "/tenant/reservations/check-in-out"
  | "/tenant/guests/arrivals"
  | "/tenant/guests/requests"
  | "/tenant/guests/crm"
  | "/tenant/operations/housekeeping"
  | "/tenant/operations/maintenance"
  | "/tenant/operations/tasks"
  | "/tenant/revenue/rates"
  | "/tenant/revenue/packages"
  | "/tenant/revenue/reports"
  | "/tenant/channels/website"
  | "/tenant/channels/chatbot"
  | "/tenant/settings/property"
  | "/tenant/settings/rooms"
  | "/tenant/settings/services"
  | "/tenant/settings/team"
  | "/tenant/settings/automations"
  | "/tenant/help";

type TenantMetric = {
  label: string;
  value: string;
  detail: string;
};

type TenantPanelItem = {
  title: string;
  meta: string;
  status: string;
};

type TenantWorkspaceContent = {
  eyebrow: string;
  title: string;
  description: string;
  primaryAction: string;
  secondaryAction: string;
  metrics: TenantMetric[];
  spotlightTitle: string;
  spotlightBody: string;
  spotlightPoints: string[];
  panels: {
    title: string;
    description: string;
    items: TenantPanelItem[];
  }[];
};

export const tenantWorkspaceContent: Record<
  TenantWorkspacePath,
  TenantWorkspaceContent
> = {
  "/tenant/dashboard": {
    eyebrow: "Property snapshot",
    title: "Tenant command center",
    description:
      "Track live bookings, staff coordination, guest touchpoints, and revenue drivers for a single resort operation.",
    primaryAction: "Create reservation",
    secondaryAction: "Open operations board",
    metrics: [
      { label: "Occupied tonight", value: "71%", detail: "+8 rooms vs yesterday" },
      { label: "Arrivals today", value: "18", detail: "4 VIP, 2 early check-ins" },
      { label: "Open guest requests", value: "11", detail: "3 pending over 15 mins" },
      { label: "Projected room revenue", value: "₱184k", detail: "Weekend pace is +12%" },
    ],
    spotlightTitle: "Shift focus",
    spotlightBody:
      "Front desk and housekeeping are both pacing above target, but maintenance still has two unresolved room blockers before afternoon arrivals.",
    spotlightPoints: [
      "Prioritize villa 204 aircon repair before 2:00 PM",
      "Upsell breakfast bundles on 6 flexible leisure bookings",
      "Review chatbot follow-ups for abandoned direct bookings",
    ],
    panels: [
      {
        title: "Arrival watchlist",
        description: "Guests who need team attention before check-in.",
        items: [
          { title: "Santos Family", meta: "12:30 PM early arrival", status: "Prep room" },
          { title: "A. Delgado", meta: "Airport pickup requested", status: "Transport" },
          { title: "Bluewave Retreat", meta: "3 rooms under one booking", status: "Confirm IDs" },
        ],
      },
      {
        title: "Operations queue",
        description: "Tasks that shape today’s on-property experience.",
        items: [
          { title: "Pool deck setup", meta: "Assigned to AM crew", status: "In progress" },
          { title: "Spa linen restock", meta: "Due before 11:00 AM", status: "Queued" },
          { title: "Room 204 AC issue", meta: "Maintenance escalated", status: "Blocked" },
        ],
      },
      {
        title: "Revenue moments",
        description: "Short-term actions that can lift today’s yield.",
        items: [
          { title: "Weekend rate fence", meta: "6 standard rooms left", status: "Review" },
          { title: "Island tour upsell", meta: "32 arriving guests", status: "Send offer" },
          { title: "Direct-booking reminder", meta: "14 abandoned carts", status: "Automated" },
        ],
      },
    ],
  },
  "/tenant/reservations/calendar": {
    eyebrow: "Reservations",
    title: "Booking calendar",
    description:
      "Monitor room inventory, arrival/departure pressure, and channel pacing across the next seven days.",
    primaryAction: "Block dates",
    secondaryAction: "Sync channel inventory",
    metrics: [
      { label: "Rooms sold", value: "126", detail: "Next 7 days" },
      { label: "Avg. stay", value: "2.8 nights", detail: "Leisure-heavy mix" },
      { label: "Direct share", value: "38%", detail: "+5 pts vs last week" },
      { label: "Overbooking risk", value: "2 dates", detail: "Jun 14 and Jun 15" },
    ],
    spotlightTitle: "Calendar insight",
    spotlightBody:
      "Midweek occupancy is soft, but weekend demand is nearly sold out. The biggest opportunity is filling Tuesday and Wednesday gaps without discounting your premium room types.",
    spotlightPoints: [
      "Release 2 held rooms back into your direct booking inventory",
      "Open flexible check-in for Tuesday arrivals",
      "Bundle breakfast add-on instead of lowering BAR",
    ],
    panels: [
      {
        title: "Upcoming pressure dates",
        description: "Days where inventory or staffing needs closer attention.",
        items: [
          { title: "Friday, Jun 14", meta: "94% occupied", status: "High demand" },
          { title: "Saturday, Jun 15", meta: "2 villas left", status: "Close channels soon" },
          { title: "Wednesday, Jun 19", meta: "49% occupied", status: "Promote direct" },
        ],
      },
      {
        title: "Inventory adjustments",
        description: "Suggested changes based on pace and length-of-stay behavior.",
        items: [
          { title: "Garden Suites", meta: "Raise weekend BAR by 6%", status: "Suggested" },
          { title: "Standard Rooms", meta: "Open 1-night stays midweek", status: "Suggested" },
          { title: "Family Villas", meta: "Keep 2-night minimum", status: "Maintain" },
        ],
      },
      {
        title: "Channel pacing",
        description: "Where reservation momentum is coming from today.",
        items: [
          { title: "Direct website", meta: "11 new holds", status: "Leading" },
          { title: "Booking.com", meta: "8 new bookings", status: "Stable" },
          { title: "Messenger inquiries", meta: "5 pending quotes", status: "Follow up" },
        ],
      },
    ],
  },
  "/tenant/reservations/bookings": {
    eyebrow: "Reservations",
    title: "Reservation board",
    description:
      "Review new bookings, pending confirmations, and booking changes before they affect room allocation or arrivals.",
    primaryAction: "Add manual booking",
    secondaryAction: "Review pending confirmations",
    metrics: [
      { label: "New today", value: "23", detail: "Across all channels" },
      { label: "Pending payment", value: "7", detail: "Need follow-up before 6 PM" },
      { label: "Modified stays", value: "5", detail: "Room moves possible" },
      { label: "Cancellations", value: "3", detail: "2 direct, 1 OTA" },
    ],
    spotlightTitle: "Reservation focus",
    spotlightBody:
      "Most friction is in partial-payment reservations and last-minute date changes. Cleaning those up early prevents front-desk congestion later.",
    spotlightPoints: [
      "Confirm deposit reminders for same-day arrivals",
      "Reassign room blocks from canceled group hold",
      "Validate revised check-out dates before housekeeping handoff",
    ],
    panels: [
      {
        title: "Needs confirmation",
        description: "Bookings that should be resolved during this shift.",
        items: [
          { title: "Ref RC-1029", meta: "Deposit missing", status: "Call guest" },
          { title: "Ref RC-1034", meta: "Arrival time unknown", status: "Message guest" },
          { title: "Ref RC-1038", meta: "Special rate approval", status: "Manager review" },
        ],
      },
      {
        title: "Room allocation changes",
        description: "Reservation edits that may impact operations.",
        items: [
          { title: "Villa 6 upgrade", meta: "Honeymoon request", status: "Pending move" },
          { title: "Twin-to-king swap", meta: "Medical request", status: "Coordinate" },
          { title: "Group split booking", meta: "2 separate invoices", status: "Update folios" },
        ],
      },
      {
        title: "Recovery opportunities",
        description: "Places where the team can save or upsell a booking.",
        items: [
          { title: "Canceled family trip", meta: "Offer rebook credit", status: "Retention" },
          { title: "Late-booking lead", meta: "Push airport transfer", status: "Upsell" },
          { title: "Weekend extension", meta: "2-night add-on possible", status: "Offer" },
        ],
      },
    ],
  },
  "/tenant/reservations/check-in-out": {
    eyebrow: "Reservations",
    title: "Check-in & check-out control",
    description:
      "Coordinate room readiness, ID capture, payment completion, and departure turnover in one operations view.",
    primaryAction: "Start express check-in",
    secondaryAction: "Print departure list",
    metrics: [
      { label: "Check-ins due", value: "18", detail: "6 before 2 PM" },
      { label: "Check-outs due", value: "15", detail: "3 late checkout requests" },
      { label: "Ready rooms", value: "12", detail: "4 more cleaning now" },
      { label: "Incomplete folios", value: "4", detail: "Need payment review" },
    ],
    spotlightTitle: "Front desk pulse",
    spotlightBody:
      "Today’s risk isn’t volume, it’s sequencing. Your early arrivals will overlap with delayed check-outs, so room readiness and folio cleanup matter more than queue length.",
    spotlightPoints: [
      "Expedite clean-first list for early-arrival rooms",
      "Clear unpaid minibar balances before departures line up",
      "Use digital registration links for group arrivals",
    ],
    panels: [
      {
        title: "Early arrivals",
        description: "Guests who may arrive before rooms are fully turned.",
        items: [
          { title: "Luna Escapes Group", meta: "ETA 12:15 PM", status: "Offer lounge" },
          { title: "K. Ramos", meta: "Birthday stay", status: "Prioritize room" },
          { title: "M. Chua", meta: "Child with special bedding", status: "Coordinate" },
        ],
      },
      {
        title: "Departure blockers",
        description: "Items to clear before checkout windows peak.",
        items: [
          { title: "Room 312 folio mismatch", meta: "Spa add-on missing", status: "Fix billing" },
          { title: "Room 118 transport", meta: "Late airport transfer", status: "Confirm" },
          { title: "Room 207 minibar", meta: "Needs guest sign-off", status: "Resolve" },
        ],
      },
      {
        title: "Turnover coordination",
        description: "Cross-team work required to keep arrivals moving.",
        items: [
          { title: "Villa cluster A", meta: "Cleaning, linens, minibar", status: "All teams" },
          { title: "Poolside suites", meta: "Amenity refresh", status: "Housekeeping" },
          { title: "Family lofts", meta: "Extra beds requested", status: "Setup" },
        ],
      },
    ],
  },
  "/tenant/guests/arrivals": {
    eyebrow: "Guest experience",
    title: "Today’s arrivals",
    description:
      "Prepare personalized arrivals, transport details, room preferences, and welcome moments before guests step on property.",
    primaryAction: "Send arrival reminder",
    secondaryAction: "Export arrival manifest",
    metrics: [
      { label: "Arrivals", value: "18", detail: "Across 24 rooms" },
      { label: "VIP arrivals", value: "4", detail: "2 anniversaries, 1 influencer stay" },
      { label: "Special requests", value: "9", detail: "Dietary, transport, bedding" },
      { label: "Transport pickups", value: "6", detail: "3 confirmed, 3 pending" },
    ],
    spotlightTitle: "Arrival experience",
    spotlightBody:
      "The biggest differentiator today is personalization. Guests already shared preferences in pre-arrival messages, so surfacing them to the front desk and service teams will improve first impressions fast.",
    spotlightPoints: [
      "Pre-stage welcome notes for VIP rooms",
      "Align shuttle dispatch times with arrival ETAs",
      "Send room-ready SMS as soon as housekeeping clears units",
    ],
    panels: [
      {
        title: "VIP preparation",
        description: "Guests who should receive a more curated arrival flow.",
        items: [
          { title: "A. Mendoza", meta: "Anniversary setup requested", status: "Ready décor" },
          { title: "The Sol Travel Co.", meta: "Partner agency guest", status: "Manager greet" },
          { title: "N. Uy", meta: "Influencer content stay", status: "Coordinate shoot" },
        ],
      },
      {
        title: "Transport logistics",
        description: "Arrival movement to confirm before afternoon.",
        items: [
          { title: "Van 2 airport pickup", meta: "3 guests, 1 child seat", status: "Confirm" },
          { title: "Pier transfer", meta: "Boat ETA shifted", status: "Update desk" },
          { title: "Private car arrival", meta: "Parking space requested", status: "Reserve" },
        ],
      },
      {
        title: "Welcome moments",
        description: "Touches that can improve sentiment and reviews.",
        items: [
          { title: "Fresh coconut amenity", meta: "2 honeymoon rooms", status: "Prepare" },
          { title: "Kid welcome kit", meta: "4 family bookings", status: "Front desk" },
          { title: "Late-night snack tray", meta: "11:40 PM arrival", status: "Kitchen notify" },
        ],
      },
    ],
  },
  "/tenant/guests/requests": {
    eyebrow: "Guest experience",
    title: "Guest requests",
    description:
      "Handle in-stay service requests, response times, and escalations without losing visibility across teams.",
    primaryAction: "Create service ticket",
    secondaryAction: "Review escalations",
    metrics: [
      { label: "Open requests", value: "11", detail: "3 are waiting over 15 mins" },
      { label: "Avg. response", value: "9 mins", detail: "Down from 13 mins yesterday" },
      { label: "Escalated", value: "2", detail: "Both room-comfort related" },
      { label: "Resolved today", value: "26", detail: "Mostly dining and transport" },
    ],
    spotlightTitle: "Service quality note",
    spotlightBody:
      "Response speed is healthy overall, but unresolved comfort-related requests can shape review sentiment much more than simple volume metrics.",
    spotlightPoints: [
      "Escalate room-temperature complaints within 10 minutes",
      "Use templated replies for repeat transport questions",
      "Tag requests that can convert into paid add-ons",
    ],
    panels: [
      {
        title: "Needs attention",
        description: "Requests with the highest guest-experience impact.",
        items: [
          { title: "Room 204 AC concern", meta: "Guest called twice", status: "Escalated" },
          { title: "Villa 9 late dinner", meta: "Kitchen handoff missed", status: "Recover" },
          { title: "Room 118 birthday cake", meta: "6:30 PM service window", status: "Track" },
        ],
      },
      {
        title: "Fast-win requests",
        description: "Simple asks that can be cleared quickly.",
        items: [
          { title: "Extra bath towels", meta: "Room 221", status: "Dispatch" },
          { title: "Wi-Fi instructions", meta: "Room 102", status: "Send info" },
          { title: "Golf cart pickup", meta: "Pier transfer return", status: "Assign" },
        ],
      },
      {
        title: "Upsell openings",
        description: "Requests that can lead into additional revenue.",
        items: [
          { title: "Sunset dinner inquiry", meta: "Couple in villa 5", status: "Recommend package" },
          { title: "Massage availability", meta: "2 interested guests", status: "Offer spa" },
          { title: "Island hopping ask", meta: "Family of 4", status: "Bundle tour" },
        ],
      },
    ],
  },
  "/tenant/guests/crm": {
    eyebrow: "Guest experience",
    title: "Guest CRM",
    description:
      "Track repeat guests, booking patterns, preferences, and outreach opportunities that strengthen direct relationships.",
    primaryAction: "Create guest segment",
    secondaryAction: "Launch return-stay campaign",
    metrics: [
      { label: "Repeat guest share", value: "27%", detail: "Healthy for leisure mix" },
      { label: "High-value guests", value: "43", detail: "Stayed 3+ times or premium ADR" },
      { label: "Birthdays this month", value: "19", detail: "Good outreach target" },
      { label: "Win-back leads", value: "31", detail: "No stay in last 8 months" },
    ],
    spotlightTitle: "CRM opportunity",
    spotlightBody:
      "Your direct-booking upside is strongest with previous premium guests who haven’t returned recently. They already know the property, so well-timed outreach beats broad discounts.",
    spotlightPoints: [
      "Build a past-villa-guests segment for weekday offers",
      "Tag guests who consistently buy spa or transfer add-ons",
      "Use anniversary and birthday moments for personalized invites",
    ],
    panels: [
      {
        title: "Loyalty watchlist",
        description: "Guests worth a more curated relationship touch.",
        items: [
          { title: "J. Navarro", meta: "4 stays, high dining spend", status: "VIP nurture" },
          { title: "D. Villanueva", meta: "Booked direct twice", status: "Offer return perk" },
          { title: "The Arc Team", meta: "Annual retreat account", status: "Renewal outreach" },
        ],
      },
      {
        title: "Campaign ideas",
        description: "Simple outreach themes to test this month.",
        items: [
          { title: "Midweek escape", meta: "Target Manila couples", status: "Draft" },
          { title: "Family school-break stay", meta: "Target repeat families", status: "Build list" },
          { title: "Spa return package", meta: "Target wellness guests", status: "Review pricing" },
        ],
      },
      {
        title: "Preference signals",
        description: "Patterns the team should surface in future stays.",
        items: [
          { title: "Late checkout preference", meta: "8 frequent guests", status: "Flag" },
          { title: "Airport transfer buyers", meta: "Strong attach rate", status: "Default offer" },
          { title: "Garden-view requests", meta: "Often from older couples", status: "Segment" },
        ],
      },
    ],
  },
  "/tenant/operations/housekeeping": {
    eyebrow: "Operations",
    title: "Housekeeping board",
    description:
      "Coordinate room status, cleaning priorities, inspections, and linen readiness for smoother turnovers.",
    primaryAction: "Assign clean-first rooms",
    secondaryAction: "Open linen status",
    metrics: [
      { label: "Rooms to clean", value: "24", detail: "12 departure, 12 stayover" },
      { label: "Inspected ready", value: "12", detail: "4 are early-arrival rooms" },
      { label: "Linen risk", value: "2 categories", detail: "Bath mats and crib sheets" },
      { label: "Average turnaround", value: "41 mins", detail: "Improving vs 47 mins" },
    ],
    spotlightTitle: "Turnover priority",
    spotlightBody:
      "The housekeeping goal today is not total volume, it’s the order of execution. Early-arrival rooms and premium inventory should stay at the top of the stack.",
    spotlightPoints: [
      "Pull two attendants into villa turnovers before noon",
      "Inspect VIP rooms immediately after cleaning",
      "Restock linen gaps before second shift handoff",
    ],
    panels: [
      {
        title: "Clean-first list",
        description: "Rooms that matter most for arrival flow.",
        items: [
          { title: "Villa 6", meta: "Anniversary stay at 1 PM", status: "Priority" },
          { title: "Room 118", meta: "Family early arrival", status: "Priority" },
          { title: "Suite 204", meta: "Pending maintenance clear", status: "Hold" },
        ],
      },
      {
        title: "Inspection queue",
        description: "Units waiting for supervisor sign-off.",
        items: [
          { title: "Room 203", meta: "Deep clean completed", status: "Inspect" },
          { title: "Villa 4", meta: "Minibar restocked", status: "Inspect" },
          { title: "Suite 111", meta: "Extra bed installed", status: "Inspect" },
        ],
      },
      {
        title: "Supply watch",
        description: "Items that could slow down turnover later.",
        items: [
          { title: "Crib sheets", meta: "2 left in stock", status: "Replenish" },
          { title: "Pool towels", meta: "Laundry delayed", status: "Monitor" },
          { title: "Bathroom amenities", meta: "Premium set low", status: "Restock" },
        ],
      },
    ],
  },
  "/tenant/operations/maintenance": {
    eyebrow: "Operations",
    title: "Maintenance queue",
    description:
      "Track room blockers, preventive tasks, and recurring asset issues before they impact arrivals or reviews.",
    primaryAction: "Log issue",
    secondaryAction: "Review preventive tasks",
    metrics: [
      { label: "Open jobs", value: "8", detail: "2 room-blocking" },
      { label: "Preventive due", value: "14", detail: "This week" },
      { label: "Repeat issues", value: "3", detail: "Reopened in 30 days" },
      { label: "Mean time to resolve", value: "3.2 hrs", detail: "Down by 18 mins" },
    ],
    spotlightTitle: "Asset reliability",
    spotlightBody:
      "The urgent work is manageable, but repeated AC and plumbing issues point to a reliability pattern that should be addressed beyond one-off fixes.",
    spotlightPoints: [
      "Close room-blocking jobs before 2 PM arrival wave",
      "Review repeat failures by room cluster, not individual ticket",
      "Move low-risk preventive work to tomorrow if capacity is tight",
    ],
    panels: [
      {
        title: "Room blockers",
        description: "Issues that affect sellable inventory or guest comfort.",
        items: [
          { title: "Suite 204 AC", meta: "Guest arrival this afternoon", status: "Critical" },
          { title: "Villa 2 shower pressure", meta: "Reported at checkout", status: "Critical" },
          { title: "Room 315 balcony light", meta: "Safety concern", status: "Priority" },
        ],
      },
      {
        title: "Preventive schedule",
        description: "Work to protect uptime and room quality.",
        items: [
          { title: "Generator test", meta: "Due tomorrow 9 AM", status: "Scheduled" },
          { title: "Pool filtration check", meta: "Weekly routine", status: "Queued" },
          { title: "Kitchen cold storage", meta: "Monthly service", status: "Due" },
        ],
      },
      {
        title: "Repeat problem areas",
        description: "Patterns the property team should analyze.",
        items: [
          { title: "North wing AC strain", meta: "3 related tickets", status: "Investigate" },
          { title: "Garden villa plumbing", meta: "2 reopens", status: "Investigate" },
          { title: "Outdoor path lighting", meta: "Weather exposure", status: "Plan upgrade" },
        ],
      },
    ],
  },
  "/tenant/operations/tasks": {
    eyebrow: "Operations",
    title: "Staff task board",
    description:
      "Coordinate cross-department task execution for front office, housekeeping, maintenance, and guest services.",
    primaryAction: "Create task",
    secondaryAction: "Review overdue work",
    metrics: [
      { label: "Tasks due today", value: "37", detail: "11 cross-team handoffs" },
      { label: "Overdue", value: "5", detail: "Mostly low-risk admin items" },
      { label: "On-time completion", value: "91%", detail: "Above target" },
      { label: "Escalations", value: "2", detail: "Manager follow-up needed" },
    ],
    spotlightTitle: "Coordination view",
    spotlightBody:
      "Task volume is healthy. The main gap is handoff visibility between teams, especially when a front-desk promise depends on housekeeping or maintenance timing.",
    spotlightPoints: [
      "Flag inter-team tasks with stronger due-time visibility",
      "Group arrival-related tasks into one filtered lane",
      "Escalate tasks tied to same-day guest commitments",
    ],
    panels: [
      {
        title: "Cross-team handoffs",
        description: "Tasks where timing between teams matters most.",
        items: [
          { title: "Birthday room setup", meta: "Desk + housekeeping", status: "Due 4 PM" },
          { title: "Late checkout approval", meta: "Desk + housekeeping", status: "Confirm" },
          { title: "Room move for AC issue", meta: "Desk + maintenance", status: "Coordinate" },
        ],
      },
      {
        title: "Overdue tasks",
        description: "Items that should be cleared or rescheduled today.",
        items: [
          { title: "Reprint pool signage", meta: "Ops admin", status: "Overdue" },
          { title: "Vendor invoice upload", meta: "Finance support", status: "Overdue" },
          { title: "OTA photo review", meta: "Marketing support", status: "Overdue" },
        ],
      },
      {
        title: "Shift priorities",
        description: "Recommended focus for the current shift lead.",
        items: [
          { title: "Arrival readiness", meta: "Before noon", status: "Top priority" },
          { title: "Revenue follow-ups", meta: "After lunch", status: "Secondary" },
          { title: "Preventive admin", meta: "Low-demand window", status: "Later" },
        ],
      },
    ],
  },
  "/tenant/revenue/rates": {
    eyebrow: "Revenue tools",
    title: "Rates & availability",
    description:
      "Adjust price, inventory, and restrictions with the property’s direct and OTA booking pace in view.",
    primaryAction: "Update room rates",
    secondaryAction: "Review closeout rules",
    metrics: [
      { label: "ADR this month", value: "₱7,420", detail: "+6% vs last month" },
      { label: "Occupancy on books", value: "68%", detail: "Next 30 days" },
      { label: "Yield gap", value: "3 dates", detail: "Underrated weekends" },
      { label: "Direct conversion", value: "4.8%", detail: "Healthy but improvable" },
    ],
    spotlightTitle: "Yield note",
    spotlightBody:
      "Weekend demand is strong enough to support firmer rates, but weekday softness should be handled with packaging and fence strategy before raw discounting.",
    spotlightPoints: [
      "Lift weekend BAR on standard rooms first",
      "Keep premium villa pricing stable for perceived value",
      "Use direct-only bonuses for soft midweek demand",
    ],
    panels: [
      {
        title: "High-yield dates",
        description: "Stay windows where pricing may be too soft.",
        items: [
          { title: "Jun 14 to Jun 16", meta: "Festival spillover demand", status: "Raise rates" },
          { title: "Jun 28 weekend", meta: "Family travel pace rising", status: "Review" },
          { title: "Jul 5 holiday lead-in", meta: "Search volume up", status: "Watch closely" },
        ],
      },
      {
        title: "Restriction ideas",
        description: "Controls that can protect yield without hurting conversion.",
        items: [
          { title: "2-night minimum", meta: "Peak Saturday inventory", status: "Consider" },
          { title: "Close OTA basic room", meta: "Shift demand direct", status: "Test" },
          { title: "Advance purchase offer", meta: "Midweek soft dates", status: "Launch" },
        ],
      },
      {
        title: "Inventory strategy",
        description: "Recommended distribution decisions for current demand.",
        items: [
          { title: "Pool suites", meta: "Allocate more to direct", status: "Suggested" },
          { title: "Standard rooms", meta: "Keep OTA visibility broad", status: "Maintain" },
          { title: "Family villas", meta: "Protect for longer stays", status: "Hold" },
        ],
      },
    ],
  },
  "/tenant/revenue/packages": {
    eyebrow: "Revenue tools",
    title: "Packages & upsells",
    description:
      "Build higher-spend stays through bundled experiences, add-ons, and targeted pre-arrival offers.",
    primaryAction: "Create package",
    secondaryAction: "Launch add-on campaign",
    metrics: [
      { label: "Upsell conversion", value: "14%", detail: "Pre-arrival and in-stay combined" },
      { label: "Top package", value: "Spa weekend", detail: "Best attach rate this month" },
      { label: "Add-on revenue", value: "₱63k", detail: "Month to date" },
      { label: "Offer fatigue", value: "Low", detail: "Healthy open rates" },
    ],
    spotlightTitle: "Upsell opportunity",
    spotlightBody:
      "Guests are responding best to convenience and celebration offers, not generic discounts. The strongest opportunities are transport, dining, and occasion-based stays.",
    spotlightPoints: [
      "Bundle airport transfer with 2-night direct bookings",
      "Create family add-ons for school-break inventory",
      "Offer anniversary experiences before arrival, not at check-in",
    ],
    panels: [
      {
        title: "Best-performing offers",
        description: "Packages that are already proving demand.",
        items: [
          { title: "Spa weekend duo", meta: "12% attach rate", status: "Scale" },
          { title: "Sunset dinner package", meta: "High margin", status: "Promote" },
          { title: "Airport transfer add-on", meta: "Frequent convenience buy", status: "Keep default" },
        ],
      },
      {
        title: "New offer ideas",
        description: "Concepts aligned to current guest behavior.",
        items: [
          { title: "Remote work day-pass", meta: "Midweek local market", status: "Prototype" },
          { title: "Family weekend bundle", meta: "School break dates", status: "Price out" },
          { title: "Rainy-day indoor package", meta: "Low-weather resilience", status: "Draft" },
        ],
      },
      {
        title: "Delivery timing",
        description: "When guests are most likely to respond.",
        items: [
          { title: "Post-booking hour 1", meta: "Transport and upgrades", status: "Best window" },
          { title: "3 days before stay", meta: "Dining and spa", status: "Best window" },
          { title: "Check-in day", meta: "Low urgency add-ons only", status: "Selective" },
        ],
      },
    ],
  },
  "/tenant/revenue/reports": {
    eyebrow: "Revenue tools",
    title: "Revenue reports",
    description:
      "Understand booking pace, revenue mix, channel contribution, and profit-shaping trends without leaving the property workspace.",
    primaryAction: "Export monthly report",
    secondaryAction: "Compare to last month",
    metrics: [
      { label: "MTD revenue", value: "₱2.84M", detail: "+9% vs same period" },
      { label: "Direct revenue mix", value: "41%", detail: "Improving steadily" },
      { label: "OTA dependency", value: "46%", detail: "Still high on standard rooms" },
      { label: "Ancillary revenue", value: "₱312k", detail: "11% of total" },
    ],
    spotlightTitle: "Commercial summary",
    spotlightBody:
      "Overall revenue is healthy, but margin quality will improve most by lifting direct mix and ancillary attach rate rather than pushing occupancy alone.",
    spotlightPoints: [
      "Protect direct share on higher-value room types",
      "Expand ancillary offers with strongest profit contribution",
      "Audit OTA-heavy dates where direct demand also exists",
    ],
    panels: [
      {
        title: "Top revenue movers",
        description: "What is having the biggest financial impact right now.",
        items: [
          { title: "Weekend villas", meta: "ADR grew faster than occupancy", status: "Positive" },
          { title: "Spa bundles", meta: "High margin uplift", status: "Positive" },
          { title: "OTA standard rooms", meta: "Commission drag", status: "Watch" },
        ],
      },
      {
        title: "Channel mix notes",
        description: "How each acquisition path is contributing.",
        items: [
          { title: "Direct website", meta: "Best margin, improving conversion", status: "Strong" },
          { title: "Booking.com", meta: "High volume, lower yield", status: "Necessary" },
          { title: "Messenger inquiries", meta: "Small volume, high-close rate", status: "Promising" },
        ],
      },
      {
        title: "Next questions",
        description: "What the tenant team should explore next.",
        items: [
          { title: "Which room types drive most direct value?", meta: "Review segment mix", status: "Analyze" },
          { title: "Which packages improve profit, not just sales?", meta: "Compare margin", status: "Analyze" },
          { title: "Where are commissions highest by date?", meta: "Channel yield view", status: "Analyze" },
        ],
      },
    ],
  },
  "/tenant/channels/website": {
    eyebrow: "Distribution",
    title: "Website funnel",
    description:
      "Monitor the tenant’s direct booking path from landing-page interest to completed reservation.",
    primaryAction: "Edit hero offer",
    secondaryAction: "Review abandoned checkouts",
    metrics: [
      { label: "Sessions", value: "4.2k", detail: "Last 30 days" },
      { label: "Booking conversion", value: "4.8%", detail: "Above property baseline" },
      { label: "Abandoned checkouts", value: "46", detail: "Most on payment step" },
      { label: "Mobile share", value: "73%", detail: "Main traffic source" },
    ],
    spotlightTitle: "Direct booking insight",
    spotlightBody:
      "Interest is healthy, but checkout drop-off suggests friction in the final steps. Small clarity improvements can matter more than larger redesigns right now.",
    spotlightPoints: [
      "Simplify payment reassurance near checkout CTA",
      "Highlight best-rate promise earlier on mobile",
      "Trigger follow-up nudges for high-intent abandoned sessions",
    ],
    panels: [
      {
        title: "Drop-off checkpoints",
        description: "Where users are leaving the booking journey.",
        items: [
          { title: "Rate selection", meta: "Some confusion on inclusions", status: "Clarify" },
          { title: "Guest details form", meta: "Mobile friction", status: "Simplify" },
          { title: "Payment step", meta: "Highest abandonment", status: "Investigate" },
        ],
      },
      {
        title: "Content opportunities",
        description: "Elements that may strengthen direct conversion.",
        items: [
          { title: "Family package hero", meta: "Midweek soft dates", status: "Test" },
          { title: "Trust badge row", meta: "Checkout reassurance", status: "Add" },
          { title: "Guest review snippet", meta: "Rate-plan pages", status: "Reuse" },
        ],
      },
      {
        title: "Traffic highlights",
        description: "Signals that shape direct-booking strategy.",
        items: [
          { title: "Meta search referrals", meta: "High booking intent", status: "Growing" },
          { title: "Instagram traffic", meta: "High mobile share", status: "Promising" },
          { title: "Organic branded search", meta: "Strong close rate", status: "Protect" },
        ],
      },
    ],
  },
  "/tenant/channels/chatbot": {
    eyebrow: "Distribution",
    title: "AI concierge",
    description:
      "Manage the chatbot’s role in direct sales, pre-arrival guidance, and guest support with property-aware messaging.",
    primaryAction: "Review AI conversations",
    secondaryAction: "Tune reply rules",
    metrics: [
      { label: "Conversations", value: "312", detail: "Last 30 days" },
      { label: "Booking assists", value: "29", detail: "Helped before checkout" },
      { label: "Deflected questions", value: "61%", detail: "Without staff handoff" },
      { label: "Needs human handoff", value: "14%", detail: "Mostly pricing and transport" },
    ],
    spotlightTitle: "Automation note",
    spotlightBody:
      "The chatbot is already handling repetitive questions well. The next gain comes from giving it cleaner escalation rules and stronger property-specific upsell prompts.",
    spotlightPoints: [
      "Hand off rate-negotiation questions to staff sooner",
      "Offer transfers and spa when intent signals are clear",
      "Use pre-arrival FAQs to reduce front-desk message load",
    ],
    panels: [
      {
        title: "Frequent intents",
        description: "What guests most often ask the AI about.",
        items: [
          { title: "Check-in time", meta: "Repeated daily", status: "Handled well" },
          { title: "Room availability", meta: "High booking intent", status: "Important" },
          { title: "Airport transfers", meta: "Strong upsell angle", status: "Expand" },
        ],
      },
      {
        title: "Escalation gaps",
        description: "Where human takeover may need improvement.",
        items: [
          { title: "Custom rates for groups", meta: "AI should escalate faster", status: "Tune" },
          { title: "Complaint sentiment", meta: "Needs sentiment threshold", status: "Tune" },
          { title: "Unusual policy exceptions", meta: "Manual review required", status: "Tune" },
        ],
      },
      {
        title: "Revenue prompts",
        description: "Places where AI can support direct sales better.",
        items: [
          { title: "Offer transfer add-on", meta: "After booking-intent confirmation", status: "Enable" },
          { title: "Suggest spa package", meta: "Celebration-related inquiries", status: "Enable" },
          { title: "Promote direct perks", meta: "Rate comparison questions", status: "Enable" },
        ],
      },
    ],
  },
  "/tenant/settings/property": {
    eyebrow: "Property settings",
    title: "Property setup",
    description:
      "Maintain tenant-level property details, sellable inventory rules, service standards, and guest-facing operational settings.",
    primaryAction: "Update property details",
    secondaryAction: "Review service policies",
    metrics: [
      { label: "Room types", value: "8", detail: "With 3 active upsell paths" },
      { label: "Policy exceptions", value: "4", detail: "Need review this quarter" },
      { label: "Amenities listed", value: "27", detail: "Across your website and direct booking surfaces" },
      { label: "Content freshness", value: "82%", detail: "Some guest-facing details outdated" },
    ],
    spotlightTitle: "Setup quality",
    spotlightBody:
      "The tenant setup is mostly healthy, but stale content and policy mismatches can create unnecessary guest confusion across direct and channel surfaces.",
    spotlightPoints: [
      "Align child policy wording across all booking paths",
      "Review amenity descriptions before next marketing push",
      "Audit room-type inclusions against current operations reality",
    ],
    panels: [
      {
        title: "Needs review",
        description: "Property details that may be out of sync.",
        items: [
          { title: "Airport transfer hours", meta: "Website copy differs", status: "Update" },
          { title: "Pet policy wording", meta: "Front desk script changed", status: "Update" },
          { title: "Family room inclusions", meta: "Extra bed policy shifted", status: "Update" },
        ],
      },
      {
        title: "Inventory design",
        description: "Core structural settings the team should monitor.",
        items: [
          { title: "Villa category ladder", meta: "Strong upgrade path", status: "Healthy" },
          { title: "Standard room naming", meta: "A bit generic", status: "Improve" },
          { title: "Accessible room content", meta: "Needs more clarity", status: "Expand" },
        ],
      },
      {
        title: "Guest-facing operations",
        description: "Settings that affect booking confidence and arrival flow.",
        items: [
          { title: "Check-in policy", meta: "Works well for direct guests", status: "Maintain" },
          { title: "Deposit rules", meta: "Payment messaging can improve", status: "Refine" },
          { title: "Cancellation copy", meta: "Needs simpler wording", status: "Rewrite" },
        ],
      },
    ],
  },
  "/tenant/settings/rooms": {
    eyebrow: "Property settings",
    title: "Rooms & inventory",
    description:
      "Set up room types, assign sellable inventory, and keep booking-facing room details aligned with operations.",
    primaryAction: "Add room type",
    secondaryAction: "Review room inventory",
    metrics: [
      { label: "Room types", value: "8", detail: "Across villas, suites, and family units" },
      { label: "Sellable units", value: "34", detail: "2 currently blocked for maintenance" },
      { label: "Photo readiness", value: "76%", detail: "Some room galleries need updates" },
      { label: "Rate mapping", value: "6 connected", detail: "2 room types still need package links" },
    ],
    spotlightTitle: "Inventory structure",
    spotlightBody:
      "This area should make it easy for the tenant to create room categories, keep occupancy counts accurate, and maintain the details that flow into your direct booking surfaces.",
    spotlightPoints: [
      "Add new room types before opening them for sale",
      "Keep blocked or offline rooms visible to operations",
      "Align room names, occupancy, and inclusions across all direct booking paths",
    ],
    panels: [
      {
        title: "Room setup priorities",
        description: "Core pieces to configure before opening inventory.",
        items: [
          { title: "Room type creation", meta: "Name, capacity, bed setup, inclusions", status: "Primary" },
          { title: "Sellable count", meta: "Track available units per room type", status: "Primary" },
          { title: "Media and description", meta: "Support website trust-building and direct conversion", status: "Important" },
        ],
      },
      {
        title: "Inventory watchlist",
        description: "Areas where room setup often drifts over time.",
        items: [
          { title: "Blocked rooms", meta: "Keep maintenance closures up to date", status: "Review" },
          { title: "Occupancy rules", meta: "Check child and extra-bed limits", status: "Review" },
          { title: "Room naming", meta: "Use guest-friendly labels consistently", status: "Review" },
        ],
      },
      {
        title: "Recommended flow",
        description: "How tenants should usually work in this module.",
        items: [
          { title: "Create room type first", meta: "Then attach images and rates", status: "Suggested" },
          { title: "Attach pricing and services second", meta: "Once room details are stable", status: "Suggested" },
          { title: "Review inventory weekly", meta: "Especially before peak windows", status: "Suggested" },
        ],
      },
    ],
  },
  "/tenant/settings/services": {
    eyebrow: "Property settings",
    title: "Services offered",
    description:
      "Create and manage guest-facing services, experiences, and add-ons that can be referenced across operations, website content, and revenue workflows.",
    primaryAction: "Add service",
    secondaryAction: "Review service catalog",
    metrics: [
      { label: "Active services", value: "12", detail: "Dining, transfers, spa, and events" },
      { label: "Upsell-ready", value: "7", detail: "Can be attached to bookings today" },
      { label: "Needs pricing review", value: "3", detail: "Last updated over 90 days ago" },
      { label: "Website listed", value: "9", detail: "3 still internal-only" },
    ],
    spotlightTitle: "Service catalog quality",
    spotlightBody:
      "This area should help the tenant define what the resort actually offers, from transport and meals to spa and event add-ons, so those services stay consistent across teams and guest touchpoints.",
    spotlightPoints: [
      "Create services with clear pricing and availability notes",
      "Separate internal-only services from guest-visible offers",
      "Keep upsellable services easy to attach to bookings and messages",
    ],
    panels: [
      {
        title: "Service creation",
        description: "The core building blocks a tenant should define.",
        items: [
          { title: "Transport services", meta: "Airport, pier, and local shuttle offers", status: "Common" },
          { title: "Experiences and amenities", meta: "Spa, tours, cabanas, celebration add-ons", status: "Common" },
          { title: "Dining and convenience", meta: "Breakfast upgrades, packed meals, late snacks", status: "Common" },
        ],
      },
      {
        title: "Catalog checks",
        description: "Items that should stay accurate over time.",
        items: [
          { title: "Pricing freshness", meta: "Avoid outdated guest-facing service rates", status: "Review" },
          { title: "Availability windows", meta: "Match service hours with actual staffing", status: "Review" },
          { title: "Website visibility", meta: "Decide what guests should see publicly", status: "Review" },
        ],
      },
      {
        title: "Revenue opportunities",
        description: "How services strengthen the commercial side of the resort.",
        items: [
          { title: "Bundle services into packages", meta: "Support higher-value bookings", status: "Promote" },
          { title: "Attach to arrivals", meta: "Use pre-arrival upsell moments", status: "Promote" },
          { title: "Feed direct-booking content", meta: "Show what makes the resort more compelling", status: "Promote" },
        ],
      },
    ],
  },
  "/tenant/settings/team": {
    eyebrow: "Property settings",
    title: "Team access",
    description:
      "Control who can manage reservations, pricing, guest data, and operations inside the tenant workspace.",
    primaryAction: "Invite team member",
    secondaryAction: "Review permissions",
    metrics: [
      { label: "Active seats", value: "26", detail: "Across 5 departments" },
      { label: "Managers", value: "6", detail: "Full operational access" },
      { label: "Pending invites", value: "3", detail: "Front desk and marketing" },
      { label: "Permission exceptions", value: "2", detail: "Need policy review" },
    ],
    spotlightTitle: "Access governance",
    spotlightBody:
      "Your role setup is serviceable, but permission drift tends to happen around pricing, refunds, and guest-data visibility. Those deserve clearer boundaries.",
    spotlightPoints: [
      "Separate revenue permissions from basic reservations",
      "Limit refund and rate-override access to managers",
      "Standardize seasonal staff onboarding roles",
    ],
    panels: [
      {
        title: "Access reviews",
        description: "Users or roles that may need adjustment.",
        items: [
          { title: "Seasonal front desk profile", meta: "Too much reporting access", status: "Tighten" },
          { title: "Marketing support seat", meta: "Needs website-only scope", status: "Refine" },
          { title: "Finance backup account", meta: "Rarely used", status: "Audit" },
        ],
      },
      {
        title: "Team structure",
        description: "A simple view of how access is currently distributed.",
        items: [
          { title: "Front office", meta: "8 users", status: "Operational" },
          { title: "Housekeeping leads", meta: "5 users", status: "Task-focused" },
          { title: "Commercial managers", meta: "3 users", status: "Sensitive access" },
        ],
      },
      {
        title: "Onboarding gaps",
        description: "Access work that should be handled before the next hiring wave.",
        items: [
          { title: "Temporary role templates", meta: "Not yet standardized", status: "Create" },
          { title: "Cross-training scopes", meta: "Need backup permissions", status: "Plan" },
          { title: "Audit process", meta: "Manual today", status: "Automate later" },
        ],
      },
    ],
  },
  "/tenant/settings/automations": {
    eyebrow: "Property settings",
    title: "Automations",
    description:
      "Configure tenant-side triggers for guest messages, operational reminders, and revenue workflows.",
    primaryAction: "Create automation",
    secondaryAction: "Review failed runs",
    metrics: [
      { label: "Active automations", value: "18", detail: "Guest and ops combined" },
      { label: "Messages sent", value: "1.2k", detail: "Month to date" },
      { label: "Manual tasks saved", value: "47 hrs", detail: "Estimated team time" },
      { label: "Failure alerts", value: "2", detail: "Need rule review" },
    ],
    spotlightTitle: "Workflow maturity",
    spotlightBody:
      "The tenant is getting value from automation already, especially in reminders and messaging. The next step is linking automations more tightly to revenue and guest-intent moments.",
    spotlightPoints: [
      "Audit failed triggers before layering new rules",
      "Expand pre-arrival upsell flows for premium segments",
      "Automate more housekeeping alerts around arrival deadlines",
    ],
    panels: [
      {
        title: "High-value workflows",
        description: "Automations currently doing the most useful work.",
        items: [
          { title: "Pre-arrival reminder", meta: "Strong open rate", status: "Healthy" },
          { title: "Late-payment nudge", meta: "Reduces front-desk follow-up", status: "Healthy" },
          { title: "Departure housekeeping alert", meta: "Improves turnover timing", status: "Healthy" },
        ],
      },
      {
        title: "Needs attention",
        description: "Rules that may need tuning or debugging.",
        items: [
          { title: "Birthday offer trigger", meta: "One duplicate send reported", status: "Check" },
          { title: "Service reminder workflow", meta: "One direct-booking automation missed a trigger", status: "Check" },
          { title: "VIP welcome note", meta: "Missing one condition", status: "Check" },
        ],
      },
      {
        title: "Next automation ideas",
        description: "Useful flows the property can add later.",
        items: [
          { title: "Rainy-day activity recommendations", meta: "Weather-driven guest support", status: "Idea" },
          { title: "Soft-date direct offer sequence", meta: "Revenue support", status: "Idea" },
          { title: "Repeat-guest arrival prep", meta: "Experience support", status: "Idea" },
        ],
      },
    ],
  },
  "/tenant/help": {
    eyebrow: "Support",
    title: "Help & training",
    description:
      "Give tenant teams a home for SOPs, onboarding, quick fixes, and feature education without leaving the workspace.",
    primaryAction: "Open training guide",
    secondaryAction: "View release notes",
    metrics: [
      { label: "Saved guides", value: "24", detail: "Operations and system how-tos" },
      { label: "Top article", value: "Express check-in setup", detail: "Most viewed this week" },
      { label: "New features", value: "3", detail: "Available for tenant rollout" },
      { label: "Support escalations", value: "1", detail: "Open with platform team" },
    ],
    spotlightTitle: "Enablement focus",
    spotlightBody:
      "The strongest tenant teams usually reduce friction by documenting repeat actions well. That matters just as much as adding more features.",
    spotlightPoints: [
      "Create a short SOP set for new front-desk hires",
      "Keep rollout notes near the actual work area",
      "Tag issues that need platform support versus local process changes",
    ],
    panels: [
      {
        title: "Most useful guides",
        description: "Knowledge that teams are likely to use often.",
        items: [
          { title: "Managing same-day arrivals", meta: "Front office SOP", status: "Popular" },
          { title: "Rate updates for weekends", meta: "Revenue playbook", status: "Popular" },
          { title: "Housekeeping handoff workflow", meta: "Ops checklist", status: "Popular" },
        ],
      },
      {
        title: "Current rollout notes",
        description: "Features or processes the property is still adopting.",
        items: [
          { title: "AI concierge playbook", meta: "Needs staff alignment", status: "Rolling out" },
          { title: "Automated payment reminders", meta: "Monitoring guest reactions", status: "Rolling out" },
          { title: "New package templates", meta: "Commercial testing", status: "Rolling out" },
        ],
      },
      {
        title: "Support tracking",
        description: "Items the tenant may want to raise or revisit.",
        items: [
          { title: "Direct booking sync lag", meta: "Observed on one property setup", status: "Escalated" },
          { title: "Role-template request", meta: "For seasonal staffing", status: "Backlog" },
          { title: "Kiosk check-in idea", meta: "Future enhancement", status: "Backlog" },
        ],
      },
    ],
  },
};

export const tenantWorkspaceAccent = {
  icon: <HouseIcon className="size-3.5" />,
  label: "Tenant workspace",
  tag: <SparklesIcon className="size-3.5" />,
  chip: "Resort operations",
  secondaryTag: <BedDoubleIcon className="size-3.5" />,
  secondaryChip: "Guest journey",
  tertiaryTag: <TagsIcon className="size-3.5" />,
  tertiaryChip: "Yield & direct sales",
  quaternaryTag: <MessageSquareMoreIcon className="size-3.5" />,
  quaternaryChip: "Service quality",
  automationTag: <BotIcon className="size-3.5" />,
  automationChip: "Automation-ready",
};

