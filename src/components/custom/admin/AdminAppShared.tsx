
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
  hasActiveSubItem?: boolean;
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

const getBestMatchedPath = (pathname: string, items: SidebarNavItem[]) => {
  const matches = items
    .filter((item) => isPathActive(pathname, item.path))
    .map((item) => item.path)
    .filter((path): path is string => Boolean(path))
    .sort((a, b) => b.length - a.length);

  return matches[0];
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
          { title: "Booking Schedule", path: "/admin/resorts/calendar" },
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
          { title: "Human Resources", path: "/admin/operations/hr" },
          { title: "Human Resources", path: "/admin/operations/hr" },
          { title: "Human Resources", path: "/admin/operations/hr" },
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

export const getFooterNavLinks = (pathname: string): SidebarNavItem[] =>
  footerNavLinks.map((item) => ({
    ...item,
    isActive: isPathActive(pathname, item.path),
  }));
