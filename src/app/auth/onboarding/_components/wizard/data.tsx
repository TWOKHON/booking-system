import type { ComponentProps, ComponentType } from "react";
import {
  Bell,
  Building2,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  GraduationCap,
  Hotel,
  Landmark,
  Mail,
  MessageSquare,
  Shield,
  Users,
  Wrench,
} from "lucide-react";
import type { StepDefinition } from "./types";

type WizardIcon = ComponentType<{
  className?: string;
}>;

function BriefcaseIcon(props: ComponentProps<typeof Landmark>) {
  return <Landmark {...props} />;
}

export const steps: StepDefinition[] = [
  {
    title: "Welcome",
    subtitle: "Let's get you started",
  },
  {
    title: "Property Details",
    subtitle: "Add your resort information",
  },
  {
    title: "Team Setup",
    subtitle: "Invite your team members",
  },
  {
    title: "Plan & Billing",
    subtitle: "Review your plan and billing details",
  },
  {
    title: "Communication",
    subtitle: "Set up communication preferences",
  },
  {
    title: "Complete",
    subtitle: "You're all set!",
  },
];

export const defaultChannels = [
  {
    key: "inApp",
    title: "In-App Messages",
    description: "Receive and send messages within the platform.",
    icon: MessageSquare,
  },
  {
    key: "email",
    title: "Email Notifications",
    description: "Receive important updates and alerts via email.",
    icon: Mail,
  },
  {
    key: "sms",
    title: "SMS Notifications",
    description: "Receive critical alerts and notifications via SMS.",
    icon: Bell,
  },
  {
    key: "push",
    title: "Push Notifications",
    description: "Get notified on important updates in real time.",
    icon: Bell,
  },
] as const satisfies ReadonlyArray<{
  key: string;
  title: string;
  description: string;
  icon: WizardIcon;
}>;

export const notificationRows = [
  {
    key: "reservations",
    title: "Reservations & Bookings",
    description: "New bookings, modifications, cancellations",
    defaultFrequency: "instant",
  },
  {
    key: "guestMessages",
    title: "Guest Messages",
    description: "New messages from guests",
    defaultFrequency: "instant",
  },
  {
    key: "operationalAlerts",
    title: "Operational Alerts",
    description: "Tasks, maintenance and housekeeping updates",
    defaultFrequency: "instant",
  },
  {
    key: "payments",
    title: "Payments & Invoices",
    description: "Payment received, invoice due, etc.",
    defaultFrequency: "daily",
  },
  {
    key: "marketing",
    title: "Marketing & Promotions",
    description: "Tips, product updates and offers",
    defaultFrequency: "weekly",
  },
] as const;

export const roleSuggestions = [
  {
    title: "Owner/Admin",
    description: "Full access to manage all operations and settings.",
    icon: Shield,
  },
  {
    title: "Manager",
    description: "Manage daily operations, staff, and guest services.",
    icon: BriefcaseIcon,
  },
  {
    title: "Front Desk",
    description: "Handle reservations, check-ins/outs, and guest information.",
    icon: Bell,
  },
  {
    title: "Housekeeping",
    description: "Manage housekeeping tasks and room status.",
    icon: Building2,
  },
  {
    title: "Maintenance",
    description: "Manage maintenance requests and work orders.",
    icon: Wrench,
  },
] as const satisfies ReadonlyArray<{
  title: string;
  description: string;
  icon: WizardIcon;
}>;

export const summaryCards = [
  {
    title: "Property Details",
    subtitle: "Oceanview Resort, Beachfront Resort, Goa, India",
    icon: Hotel,
    stepIndex: 1,
  },
  {
    title: "Team Members",
    subtitle: "4 members added",
    icon: Users,
    stepIndex: 2,
  },
  {
    title: "Plan & Billing",
    subtitle: "Starter Plan (Monthly)",
    detail: "Next billing on June 15, 2026",
    icon: CreditCard,
    stepIndex: 3,
  },
  {
    title: "Communication",
    subtitle: "Email, In-App, Push Notifications",
    detail: "5 notification preferences set",
    icon: Bell,
    stepIndex: 4,
  },
] as const satisfies ReadonlyArray<{
  title: string;
  subtitle: string;
  detail?: string;
  icon: WizardIcon;
  stepIndex: number;
}>;

export const nextSteps = [
  {
    title: "Connect Booking Channels",
    description: "Sync with OTAs and increase bookings.",
    action: "Connect Now",
    icon: CalendarDays,
  },
  {
    title: "Set Up Your Profile",
    description: "Add branding and all important details.",
    action: "Go to Settings",
    icon: Users,
  },
  {
    title: "Watch a Quick Tour",
    description: "Learn how to use key features in minutes.",
    action: "Explore Now",
    icon: GraduationCap,
  },
] as const satisfies ReadonlyArray<{
  title: string;
  description: string;
  action: string;
  icon: WizardIcon;
}>;

export const welcomeItems = [
  {
    title: "Add your property details",
    description: "Tell us about your resort",
    icon: Hotel,
  },
  {
    title: "Invite your team",
    description: "Add team members and set their roles",
    icon: Users,
  },
  {
    title: "Review your plan",
    description: "Confirm your plan and billing information",
    icon: CreditCard,
  },
  {
    title: "Set communication preferences",
    description: "Configure how you and your guests communicate",
    icon: MessageSquare,
  },
  {
    title: "Finish onboarding",
    description: "Get started and explore your dashboard",
    icon: CheckCircle2,
  },
] as const satisfies ReadonlyArray<{
  title: string;
  description: string;
  icon: WizardIcon;
}>;
