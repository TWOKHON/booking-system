import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  BrushCleaning,
  Globe2,
  ImagePlus,
  Palette,
  Shield,
  Sparkles,
  SwatchBook,
} from "lucide-react";

export type BrandingMetric = {
  title: string;
  value: string;
  change: string;
  meta: string;
  icon: LucideIcon;
};

export type BrandingThemeOption = {
  label: string;
  value: string;
  note: string;
};

export type BrandingCheckpoint = {
  title: string;
  detail: string;
  tone: "healthy" | "watch";
};

export type BrandingChannel = {
  title: string;
  status: string;
  note: string;
};

export const brandingMetrics: BrandingMetric[] = [
  {
    title: "Active Brand Preset",
    value: "Alrio Signature",
    change: "Live across admin and guest flows",
    meta: "Primary visual system currently applied to resort-admin touchpoints.",
    icon: Palette,
  },
  {
    title: "Assets Synced",
    value: "14 files",
    change: "2 awaiting favicon export",
    meta: "Logo lockups, app icons, social banners, and email header assets.",
    icon: ImagePlus,
  },
  {
    title: "Tenant Coverage",
    value: "9 resorts",
    change: "100% aligned to master brand",
    meta: "All active tenant workspaces inherit the approved platform brand kit.",
    icon: Globe2,
  },
  {
    title: "Compliance Status",
    value: "Ready",
    change: "No contrast issues flagged",
    meta: "Current palette and typography pass the latest accessibility review.",
    icon: BadgeCheck,
  },
];

export const themeOptions: BrandingThemeOption[] = [
  {
    label: "Primary",
    value: "#537129",
    note: "Used for primary actions, active navigation, and key highlights.",
  },
  {
    label: "Accent",
    value: "#99A944",
    note: "Supports badges, progress states, and promotional surfaces.",
  },
  {
    label: "Canvas",
    value: "#F6F7F1",
    note: "Soft neutral used for section backgrounds and preview blocks.",
  },
  {
    label: "Ink",
    value: "#1E2A17",
    note: "Primary text tone for strong contrast and grounded headings.",
  },
];

export const rolloutCheckpoints: BrandingCheckpoint[] = [
  {
    title: "Guest booking touchpoints",
    detail:
      "Confirmation emails, payment pages, and public booking widgets reflect the latest logo and button colors.",
    tone: "healthy",
  },
  {
    title: "Tenant-admin shell",
    detail:
      "Sidebar highlights and dashboard surfaces are aligned, but login illustrations still need the revised favicon family.",
    tone: "watch",
  },
  {
    title: "Campaign templates",
    detail:
      "Email and social templates are ready for the May promo rollout with the approved resort signature palette.",
    tone: "healthy",
  },
];

export const publishingChannels: BrandingChannel[] = [
  {
    title: "Admin dashboard",
    status: "Live",
    note: "Current palette and product wordmark are already deployed.",
  },
  {
    title: "Guest booking pages",
    status: "Queued",
    note: "Next publish will update hero banner imagery and sticky CTA styling.",
  },
  {
    title: "Transactional emails",
    status: "Review",
    note: "Header logo export and footer social icons are pending final approval.",
  },
];

export const brandStory = [
  {
    title: "Visual direction",
    detail:
      "Warm resort greens, sand-toned neutrals, and grounded typography keep the platform premium without drifting away from hospitality.",
    icon: SwatchBook,
  },
  {
    title: "Experience intent",
    detail:
      "The admin shell should feel calm and operational, while guest-facing surfaces stay polished, trustworthy, and conversion-focused.",
    icon: Sparkles,
  },
  {
    title: "Governance",
    detail:
      "Shared tokens and locked asset sets help tenants stay inside approved brand rules even when campaign assets move quickly.",
    icon: Shield,
  },
  {
    title: "Refresh cycle",
    detail:
      "Quarterly reviews keep copy tone, imagery, and iconography aligned with current resort offers and seasonal campaigns.",
    icon: BrushCleaning,
  },
];
