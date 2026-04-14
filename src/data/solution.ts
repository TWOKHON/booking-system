import { cache } from "react";

const solutionContent = {
  hero: {
    eyebrow: "ResortCloud Solution",
    title: "The operating layer for modern private resort teams.",
    description:
      "ResortCloud replaces disconnected booking tools, finance trackers, website builders, and support handoffs with one system designed around how resort businesses actually run.",
    highlights: [
      "Reservations, finance, HR, and website publishing in one workspace",
      "Built for private resort operators and multi-role teams",
      "Ready to scale from trial mode to AI-enabled operations",
    ],
  },
  problemFrames: [
    {
      title: "Scattered operations",
      body: "Bookings, follow-ups, cash logs, and team updates often live in separate apps or spreadsheets, creating delays and duplicate work.",
    },
    {
      title: "Weak handoffs",
      body: "Sales, Admin, HR, Finance, and Operations lose shared context when each team manages work in isolation.",
    },
    {
      title: "Slow guest response",
      body: "Without a connected system, inquiries, payment confirmations, and public website updates take longer than they should.",
    },
  ],
  pillars: [
    {
      id: "01",
      title: "One command center across departments",
      body: "Keep bookings, staff actions, cash movement, and guest communication visible inside one tenant workspace.",
      bullets: [
        "Shared records across Sales, Admin, HR, Accounting, and Operations",
        "Role-based views without duplicating data entry",
        "Fewer manual status updates across teams",
      ],
      stat: "10 server-enforced roles",
    },
    {
      id: "02",
      title: "A guest journey that stays connected",
      body: "From inquiry to check-in, ResortCloud keeps the website, booking logic, invoicing, and notifications in sync.",
      bullets: [
        "Inquiry capture and follow-up built into booking workflows",
        "Down payment links and invoice generation tied to reservations",
        "Website publishing and custom domains managed from the same product",
      ],
      stat: "1 platform from lead to stay",
    },
    {
      id: "03",
      title: "Built to move from control to intelligence",
      body: "Start with clean operational foundations, then layer in analytics, recommendations, chatbot support, and forecasting.",
      bullets: [
        "Advanced reporting for Growth and Enterprise plans",
        "AI-assisted inquiry tagging and marketing insights",
        "Forecasting and guest support tools for larger properties",
      ],
      stat: "30 / 60 / 90-day forecasting",
    },
  ],
  workflow: [
    {
      stage: "Capture",
      title: "Capture demand fast",
      body: "Centralize inquiries, sales follow-ups, and priority scoring before a guest ever confirms a stay.",
    },
    {
      stage: "Lock",
      title: "Lock the reservation cleanly",
      body: "Connect availability, invoicing, and down payment collection so confirmations happen with less back-and-forth.",
    },
    {
      stage: "Unify",
      title: "Run the property smoothly",
      body: "Move from check-in readiness to cash tracking, task management, staff coordination, and KPI visibility.",
    },
    {
      stage: "Optimize",
      title: "Scale with better decisions",
      body: "Use analytics, multi-property support, and AI features to improve forecasting, marketing, and conversion efficiency.",
    },
    {
      stage: "Deploy",
      title: "Publish and activate the guest experience",
      body: "Launch your website, connect your domain, and keep public booking touchpoints aligned with your internal operations.",
    },
  ],
  modules: [
    {
      title: "Booking and inquiry workflow",
      summary:
        "A structured front-office workflow for inquiries, reservations, status changes, invoicing, and payment checkpoints.",
      details: [
        "Availability board with color-based booking states",
        "Follow-up history, assigned agent ownership, and priority automation",
        "Invoice creation and payment flow tied directly to each reservation",
      ],
    },
    {
      title: "Finance and operational visibility",
      summary:
        "Track how cash moves, who handled it, and what still needs review while keeping day-to-day resort operations aligned.",
      details: [
        "Cash lifecycle tracking from collection to bank verification",
        "Petty cash, reconciliation, and liquidation support",
        "Operational queues for housekeeping, maintenance, and admin review",
      ],
    },
    {
      title: "Website, publishing, and brand control",
      summary:
        "Launch a guest-facing booking website with your brand, your domain, and your booking data already connected.",
      details: [
        "No-code website builder tuned for resort use cases",
        "Custom domain search, purchase, DNS, and SSL handled in-product",
        "Subdomain preview and publish controls without technical setup",
      ],
    },
  ],
  outcomes: [
    "Shorter time between inquiry and confirmed booking",
    "Clearer team accountability across departments",
    "Less duplicate work between operations and finance",
    "A better public booking experience for guests",
  ],
  cta: {
    title: "See how the full solution fits your property operations.",
    body: "Compare plans, review the ecosystem, and explore how ResortCloud can become the single system behind your resort team.",
  },
};

export type SolutionContent = typeof solutionContent;

export const getSolutionContent = cache(async () => solutionContent);
