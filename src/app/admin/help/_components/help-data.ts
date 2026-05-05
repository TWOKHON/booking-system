import type { LucideIcon } from "lucide-react";
import {
  BookOpenText,
  Bot,
  LifeBuoy,
  MessageSquareText,
  Settings2,
  ShieldCheck,
} from "lucide-react";

export type HelpMetric = {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
};

export type QuickLink = {
  title: string;
  description: string;
  cta: string;
  icon: LucideIcon;
};

export type HelpCategory = {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  articles: {
    question: string;
    answer: string;
  }[];
};

export const helpMetrics: HelpMetric[] = [
  {
    title: "Knowledge articles",
    value: "42",
    change: "6 updated this month",
    icon: BookOpenText,
  },
  {
    title: "Open support guides",
    value: "12",
    change: "Focused on billing and access",
    icon: LifeBuoy,
  },
  {
    title: "Security references",
    value: "8",
    change: "MFA and audit topics live",
    icon: ShieldCheck,
  },
  {
    title: "AI assistance guides",
    value: "5",
    change: "Prompt and review playbooks ready",
    icon: Bot,
  },
];

export const quickLinks: QuickLink[] = [
  {
    title: "Getting Started",
    description:
      "Walk through the core admin workspace, tenant controls, and daily platform monitoring routines.",
    cta: "Open onboarding docs",
    icon: Settings2,
  },
  {
    title: "Contact Support",
    description:
      "Escalate workflow issues, billing concerns, or urgent platform access questions to the support team.",
    cta: "Start support request",
    icon: MessageSquareText,
  },
  {
    title: "Platform Playbooks",
    description:
      "Read internal operating guides for branding, policies, integrations, and access governance.",
    cta: "Browse playbooks",
    icon: BookOpenText,
  },
];

export const helpCategories: HelpCategory[] = [
  {
    id: "workspace",
    label: "Workspace Basics",
    description:
      "Core orientation for admins working across dashboards, settings, and platform controls.",
    icon: Settings2,
    articles: [
      {
        question: "How do I navigate the main admin workspace?",
        answer:
          "Use the left sidebar to move between analytics, client, operations, integrations, and settings areas. Each page is grouped by platform function so teams can stay inside their core workflow.",
      },
      {
        question: "Where should I update shared branding or policy controls?",
        answer:
          "Branding, roles, policies, and audit history all live under System Settings. These pages are designed as admin workspaces with governance context and should be the first stop for shared platform rules.",
      },
      {
        question: "What should I review at the start of each day?",
        answer:
          "Start with the dashboard and any Turo insight cards across settings pages. They summarize the highest-priority follow-ups before you move into deeper operational or governance work.",
      },
    ],
  },
  {
    id: "tenant",
    label: "Tenant and Resort Help",
    description:
      "Support guidance for tenant setup, resort operations, and client-level concerns.",
    icon: LifeBuoy,
    articles: [
      {
        question: "How do I onboard a new tenant workspace?",
        answer:
          "Create the tenant under Resort Clients, confirm the subscription plan, then assign the initial role template and workspace policies before handing over the environment.",
      },
      {
        question: "How do temporary tenant overrides work?",
        answer:
          "Temporary overrides should be kept narrow, time-boxed, and visible in your central governance views. Use them only when a resort-specific operational need cannot be handled by an existing platform template.",
      },
      {
        question: "Where can I help a resort team with messaging or branding issues?",
        answer:
          "Use the Communication section for live messaging and notifications, then switch to Branding settings for any shared visual or asset rules that affect guest-facing surfaces.",
      },
    ],
  },
  {
    id: "security",
    label: "Security and Access",
    description:
      "Help articles for role control, audit visibility, MFA, and elevated access handling.",
    icon: ShieldCheck,
    articles: [
      {
        question: "When should elevated access require a second approval?",
        answer:
          "Any changes that expand billing, audit, or tenant-management permissions should go through a second admin review before they are considered safe to publish.",
      },
      {
        question: "Where do I review unusual logins or privileged actions?",
        answer:
          "Use the Audit Logs page to review actor identity, action, area, IP address, and event timestamp. Combine it with the roles page when the event involves access expansion or elevated controls.",
      },
      {
        question: "What if a team member has not completed MFA?",
        answer:
          "Keep their access scoped down until MFA is enabled. Elevated roles should never remain broad if second-factor requirements are still incomplete.",
      },
    ],
  },
  {
    id: "ai",
    label: "AI and Automation",
    description:
      "Practical help for AI usage, prompt policy, and automation review workflows.",
    icon: Bot,
    articles: [
      {
        question: "What is the safe way to use AI inside admin workflows?",
        answer:
          "AI should support summaries, drafting, and internal recommendations, but sensitive guest or billing actions still need clear human review before final approval.",
      },
      {
        question: "Where do I check AI policy rules?",
        answer:
          "The Policies page includes AI-specific governance entries covering prompt handling, review boundaries, and guest-data protection standards.",
      },
      {
        question: "How do I know when an automation needs closer review?",
        answer:
          "Watch for retries, failed webhooks, unusual message volume, or any flow that affects billing, guest communication, or access control. Those should be inspected before the automation is considered healthy again.",
      },
    ],
  },
];
