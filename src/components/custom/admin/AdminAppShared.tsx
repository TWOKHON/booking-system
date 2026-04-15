
import type { ReactNode } from "react";
import {
  LayoutGridIcon,
  BarChart3Icon,
  CalendarDaysIcon,
  ClipboardListIcon,
  MessageSquareIcon,
  UsersIcon,
  CreditCardIcon,
  PlugIcon,
  SettingsIcon,
  HelpCircleIcon,
} from "lucide-react";

export type SidebarNavItem = {
  title: string;
  path?: string;
  icon?: ReactNode;
  isActive?: boolean;
  subItems?: SidebarNavItem[];
};

export type SidebarNavGroup = {
  label?: string;
  items: SidebarNavItem[];
};

/**
 * ===============================
 * SIDEBAR NAV GROUPS (SaaS Admin)
 * ===============================
 */
export const navGroups: SidebarNavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        path: "#/dashboard",
        icon: <LayoutGridIcon />,
        isActive: true,
      },
      {
        title: "Platform Analytics",
        path: "#/analytics",
        icon: <BarChart3Icon />,
        subItems: [
          { title: "Overview", path: "#/analytics" },
          { title: "Revenue (SaaS)", path: "#/analytics/revenue" },
          { title: "Active Resorts", path: "#/analytics/resorts" },
          { title: "Subscriptions", path: "#/analytics/subscriptions" },
          { title: "System Usage", path: "#/analytics/usage" },
        ],
      },
    ],
  },

  {
    label: "Clients & Resorts",
    items: [
      {
        title: "Resort Clients",
        path: "#/clients",
        icon: <UsersIcon />,
        subItems: [
          { title: "All Clients", path: "#/clients" },
          { title: "Active Subscriptions", path: "#/clients/active" },
          { title: "Trial Users", path: "#/clients/trials" },
          { title: "Suspended", path: "#/clients/suspended" },
        ],
      },
      {
        title: "Resort Management",
        path: "#/resorts",
        icon: <CalendarDaysIcon />,
        subItems: [
          { title: "All Resorts", path: "#/resorts" },
          { title: "Rooms & Units", path: "#/resorts/rooms" },
          { title: "Rates & Pricing", path: "#/resorts/rates" },
          { title: "Availability Calendar", path: "#/resorts/calendar" },
        ],
      },
    ],
  },

  {
    label: "Reservations & Operations",
    items: [
      {
        title: "Reservations",
        path: "#/reservations",
        icon: <CalendarDaysIcon />,
        subItems: [
          { title: "All Bookings", path: "#/reservations" },
          { title: "Calendar View", path: "#/reservations/calendar" },
          { title: "Pending Approvals", path: "#/reservations/pending" },
          { title: "Cancellations", path: "#/reservations/cancellations" },
        ],
      },
      {
        title: "Operations",
        path: "#/operations",
        icon: <ClipboardListIcon />,
        subItems: [
          { title: "Front Desk", path: "#/operations/frontdesk" },
          { title: "Housekeeping", path: "#/operations/housekeeping" },
          { title: "Maintenance", path: "#/operations/maintenance" },
          { title: "Amenities & Services", path: "#/operations/amenities" },
        ],
      },
    ],
  },

  {
    label: "Engagement",
    items: [
      {
        title: "Communication",
        path: "#/communications",
        icon: <MessageSquareIcon />,
        subItems: [
          { title: "Guest Messaging", path: "#/communications/messages" },
          { title: "Notifications", path: "#/communications/notifications" },
          { title: "Email & SMS", path: "#/communications/email-sms" },
          { title: "Reviews & Ratings", path: "#/communications/reviews" },
        ],
      },
      {
        title: "Guest CRM",
        path: "#/crm",
        icon: <UsersIcon />,
        subItems: [
          { title: "Guest Profiles", path: "#/crm" },
          { title: "Stay History", path: "#/crm/history" },
          { title: "Loyalty Programs", path: "#/crm/loyalty" },
          { title: "Segments & Tags", path: "#/crm/segments" },
        ],
      },
    ],
  },

  {
    label: "Billing & Platform",
    items: [
      {
        title: "Subscriptions & Plans",
        path: "#/subscriptions",
        icon: <CreditCardIcon />,
        subItems: [
          { title: "Plans", path: "#/subscriptions/plans" },
          { title: "Client Billing", path: "#/subscriptions/billing" },
          { title: "Invoices", path: "#/subscriptions/invoices" },
          { title: "Transactions", path: "#/subscriptions/transactions" },
        ],
      },
      {
        title: "Integrations",
        path: "#/integrations",
        icon: <PlugIcon />,
        subItems: [
          { title: "Payment Gateways", path: "#/integrations/payments" },
          { title: "OTA & Channels", path: "#/integrations/ota" },
          { title: "API Keys", path: "#/integrations/api-keys" },
          { title: "Webhooks", path: "#/integrations/webhooks" },
        ],
      },
      {
        title: "System Settings",
        path: "#/settings",
        icon: <SettingsIcon />,
        subItems: [
          { title: "Platform Branding", path: "#/settings/branding" },
          { title: "User Roles & Access", path: "#/settings/roles" },
          { title: "Taxes & Policies", path: "#/settings/policies" },
          { title: "Audit Logs", path: "#/settings/audit" },
        ],
      },
    ],
  },
];

/**
 * ===============================
 * FOOTER NAV
 * ===============================
 */
export const footerNavLinks: SidebarNavItem[] = [
  {
    title: "Help & Docs",
    path: "#/help",
    icon: <HelpCircleIcon />,
  },
];

/**
 * ===============================
 * FLATTENED NAV LINKS (for routing/search)
 * ===============================
 */
export const navLinks: SidebarNavItem[] = [
  ...navGroups.flatMap((group) =>
    group.items.flatMap((item) =>
      item.subItems?.length ? [item, ...item.subItems] : [item]
    )
  ),
  ...footerNavLinks,
];