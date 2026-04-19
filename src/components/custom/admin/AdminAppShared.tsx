
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

const isPathActive = (pathname: string, path?: string) => {
  if (!path || path === "#" || path.startsWith("#")) {
    return false;
  }

  if (path === "/") {
    return pathname === path;
  }

  return pathname === path || pathname.startsWith(`${path}/`);
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
        path: "/admin/dashboard",
        icon: <LayoutGridIcon />,
      },
      {
        title: "Platform Analytics",
        path: "#",
        icon: <BarChart3Icon />,
        subItems: [
          { title: "Revenue", path: "/admin/analytics/revenue" },
          { title: "Active Resorts", path: "/admin/analytics/resorts" },
          { title: "Subscriptions", path: "/admin/analytics/subscriptions" },
          { title: "System Usage", path: "/admin/analytics/usage" },
        ],
      },
    ],
  },

  {
    label: "Clients & Resorts",
    items: [
      {
        title: "Resort Clients",
        path: "#",
        icon: <UsersIcon />,
        subItems: [
          { title: "All Clients", path: "/admin/clients" },
          { title: "Active Subscriptions", path: "/admin/clients/active" },
          { title: "Trial Users", path: "/admin/clients/trials" },
          { title: "Suspended", path: "/admin/clients/suspended" },
        ],
      },
      {
        title: "Resort Management",
        path: "#",
        icon: <CalendarDaysIcon />,
        subItems: [
          { title: "All Resorts", path: "/admin/resorts" },
          { title: "Rooms & Units", path: "/admin/resorts/rooms" },
          { title: "Rates & Pricing", path: "/admin/resorts/rates" },
          { title: "Availability Calendar", path: "/admin/resorts/calendar" },
        ],
      },
    ],
  },

  {
    label: "Reservations & Operations",
    items: [
      {
        title: "Reservations",
        path: "#",
        icon: <CalendarDaysIcon />,
        subItems: [
          { title: "All Bookings", path: "/admin/reservations" },
          { title: "Calendar View", path: "/admin/reservations/calendar" },
          { title: "Pending Approvals", path: "/admin/reservations/pending" },
          { title: "Cancellations", path: "/admin/reservations/cancellations" },
        ],
      },
      {
        title: "Operations",
        path: "#",
        icon: <ClipboardListIcon />,
        subItems: [
          { title: "Front Desk", path: "/admin/operations/frontdesk" },
          { title: "Housekeeping", path: "/admin/operations/housekeeping" },
          { title: "Maintenance", path: "/admin/operations/maintenance" },
          { title: "Amenities & Services", path: "/admin/operations/amenities" },
        ],
      },
    ],
  },

  {
    label: "Engagement",
    items: [
      {
        title: "Communication",
        path: "#",
        icon: <MessageSquareIcon />,
        subItems: [
          { title: "Guest Messaging", path: "/admin/communications/messages" },
          { title: "Notifications", path: "/admin/communications/notifications" },
          { title: "Email & SMS", path: "/admin/communications/email-sms" },
          { title: "Reviews & Ratings", path: "/admin/communications/reviews" },
        ],
      },
      {
        title: "Guest CRM",
        path: "#",
        icon: <UsersIcon />,
        subItems: [
          { title: "Guest Profiles", path: "/admin/crm" },
          { title: "Stay History", path: "/admin/crm/history" },
          { title: "Loyalty Programs", path: "/admin/crm/loyalty" },
          { title: "Segments & Tags", path: "/admin/crm/segments" },
        ],
      },
    ],
  },

  {
    label: "Billing & Platform",
    items: [
      {
        title: "Subscriptions & Plans",
        path: "#",
        icon: <CreditCardIcon />,
        subItems: [
          { title: "Plans", path: "/admin/subscriptions/plans" },
          { title: "Client Billing", path: "/admin/subscriptions/billing" },
          { title: "Invoices", path: "/admin/subscriptions/invoices" },
          { title: "Transactions", path: "/admin/subscriptions/transactions" },
        ],
      },
      {
        title: "Integrations",
        path: "#",
        icon: <PlugIcon />,
        subItems: [
          { title: "Payment Gateways", path: "/admin/integrations/payments" },
          { title: "OTA & Channels", path: "/admin/integrations/ota" },
          { title: "API Keys", path: "/admin/integrations/api-keys" },
          { title: "Webhooks", path: "/admin/integrations/webhooks" },
        ],
      },
      {
        title: "System Settings",
        path: "#settings",
        icon: <SettingsIcon />,
        subItems: [
          { title: "Platform Branding", path: "/admin/settings/branding" },
          { title: "User Roles & Access", path: "/admin/settings/roles" },
          { title: "Taxes & Policies", path: "/admin/settings/policies" },
          { title: "Audit Logs", path: "/admin/settings/audit" },
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
    path: "/admin/help",
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

export const getNavGroups = (pathname: string): SidebarNavGroup[] =>
  navGroups.map((group) => ({
    ...group,
    items: group.items.map((item) => {
      const activeSubItems =
        item.subItems?.map((subItem) => ({
          ...subItem,
          isActive: isPathActive(pathname, subItem.path),
        })) ?? [];

      return {
        ...item,
        isActive:
          isPathActive(pathname, item.path) ||
          activeSubItems.some((subItem) => subItem.isActive),
        subItems: activeSubItems.length ? activeSubItems : item.subItems,
      };
    }),
  }));

export const getFooterNavLinks = (pathname: string): SidebarNavItem[] =>
  footerNavLinks.map((item) => ({
    ...item,
    isActive: isPathActive(pathname, item.path),
  }));
