import { cache } from "react";

const companyContent = {
  hero: {
    eyebrow: "About ResortCloud",
    title: "We are building the operating system resort teams actually need.",
    description:
      "ResortCloud exists to replace fragmented resort workflows with a platform that feels clear, coordinated, and ready for real daily operations. We design for private resort owners, operators, and growing hospitality teams who need one system they can trust.",
    highlights: [
      "Built around how resort teams really coordinate bookings, payments, staff, and guest communication",
      "Focused on practical operations first, with AI layered in where it genuinely saves time",
      "Designed to help smaller teams operate with more clarity and less tool sprawl",
    ],
  },
  about: {
    eyebrow: "About us",
    title: "Building a calmer future for resort operations.",
    paragraphs: [
      "Founded around the realities of private resort management, ResortCloud was shaped by one simple frustration: too much daily work still depends on disconnected tools, manual follow-ups, and fragile handoffs.",
      "We are building a platform that lets resort teams run bookings, payments, staffing, publishing, and internal coordination from one clear operating layer.",
    ],
  },
  snapshot: {
    label: "Company snapshot",
    items: [
      {
        label: "Headquarters focus",
        value: "Philippines hospitality operations",
      },
      {
        label: "Core belief",
        value: "Operational clarity beats software overload",
      },
      {
        label: "Platform direction",
        value: "Bookings, finance, HR, websites, and AI in one stack",
      },
    ],
  },
  stats: [
    {
      value: "1",
      label: "Connected platform for bookings, finance, HR, and websites",
    },
    {
      value: "10",
      label: "Server-enforced user roles designed for resort teams",
    },
    {
      value: "24/7",
      label: "Mindset for guest-facing systems that cannot afford delays",
    },
  ],
  mission: {
    title: "Our mission",
    quote:
      '"To remove the friction behind resort operations so teams can focus more on guests, service, and growth."',
    body: [
      "We believe hospitality software should feel calm, precise, and dependable. ResortCloud is built to reduce the noise created by disconnected tools and replace it with one clear operational flow.",
      "That means giving resort teams software that supports bookings, payments, staffing, publishing, and decision-making without forcing them to manage complexity in the background.",
    ],
    metrics: [
      {
        value: "1 platform",
        label: "For bookings, finance, HR, websites, and operations",
      },
      {
        value: "10 roles",
        label: "Structured access across departments and responsibilities",
      },
    ],
  },
  story: {
    title: "Why we built ResortCloud",
    paragraphs: [
      "Most resort businesses do not fail because they lack effort. They struggle because operations are split across chat threads, spreadsheets, booking notes, manual payment follow-ups, and disconnected public websites.",
      "We saw a better path: one workspace where every team can see the same reservation truth, every payment checkpoint is easier to track, and every guest touchpoint feels more coordinated from inquiry to check-out.",
    ],
    callout:
      "We are not trying to add more software to the stack. We are trying to remove the need for five separate systems.",
  },
  principles: [
   
    {
      id: "02",
      title: "Keep the platform practical before making it clever",
      body: "We start with dependable operations, clean records, and role-based accountability, then add automation and AI where they create real leverage.",
    },
    {
      id: "03",
      title: "Build connected experiences across the business",
      body: "Public websites, reservations, cash tracking, staff coordination, and analytics should reinforce each other instead of living in silos.",
    },
  ],
  valuesIntro: {
    eyebrow: "Journey and values",
    title: "Helping resort teams focus on the work that matters most.",
    description:
      "We design software that removes avoidable friction, creates cleaner handoffs, and gives every department a better shared view of what is happening.",
    stats: [
      {
        value: "1 platform",
        label: "Connected operating layer",
      },
      {
        value: "5+ workflows",
        label: "Core resort functions aligned",
      },
      {
        value: "10 roles",
        label: "Structured team access",
      },
    ],
  },
  team: {
    eyebrow: "Our team",
    title: "A product mindset shaped by operations, hospitality, and execution.",
    description:
      "We are building for teams who need software that feels dependable in the middle of real daily work, not only in product demos.",
    members: [
      {
        name: "Jason Jhon Almonte",
        role: "Founder",
        accent: "from-zinc-800 to-zinc-900",
        image: "https://notus-agent-marketing-template.vercel.app/_next/image?url=%2Favatars%2Ftyler.png&w=1080&q=75",
      },
      {
        name: "Kyle Andre Lim",
        role: "Chief Technology Officer",
        accent: "from-zinc-800 to-zinc-900",
        image: "https://notus-agent-marketing-template.vercel.app/_next/image?url=%2Favatars%2Fmanu.png&w=1080&q=75",
      },
      {
        name: "Keno Villavicencio",
        role: "Chief Innovation Officer",
        accent: "from-zinc-800 to-zinc-900",
        image: "https://notus-agent-marketing-template.vercel.app/_next/image?url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1624561172888-ac93c696e10c%3Fq%3D80%26w%3D1289%26auto%3Dformat%26fit%3Dcrop%26ixlib%3Drb-4.1.0%26ixid%3DM3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%253D%253D&w=1080&q=75",
      },
    ],
  },
  careers: {
    eyebrow: "Careers",
    title: "Join us in rethinking how modern resort teams operate.",
    body: "Building a dependable hospitality platform takes thoughtful product work, operational curiosity, and people who care about making complex work feel simple.",
    benefits: [
      "Mission-led product work",
      "Cross-functional collaboration",
      "Long-term platform thinking",
    ],
    roles: [
      {
        title: "Frontend product engineer",
        meta: "Product UI / Remote-ready",
        description:
          "Help shape the booking, finance, and website experiences that resort teams use every day.",
      },
      {
        title: "Product designer",
        meta: "Systems UX / Remote-ready",
        description:
          "Design operational interfaces that balance speed, clarity, and role-based complexity.",
      },
      {
        title: "Platform engineer",
        meta: "Backend systems / Remote-ready",
        description:
          "Build the core platform foundations that keep workflows, permissions, and product modules connected.",
      },
    ],
  },
  operatingModel: [
    {
      eyebrow: "How we build",
      title: "Operational first",
      body: "We shape the platform around the daily rhythm of resort teams: inquiry handling, reservation approval, payment tracking, check-in readiness, and internal coordination.",
      bullets: [
        "Real workflows before abstract dashboards",
        "Clear ownership between departments",
        "Designed for less context switching",
      ],
    },
    {
      eyebrow: "How we ship",
      title: "Progressive rollout",
      body: "ResortCloud is designed to work for teams starting simple and for operators who want to grow into analytics, automation, forecasting, and AI-assisted support.",
      bullets: [
        "Foundations first, intelligence second",
        "Structured plans that scale with resort needs",
        "Features that stay aligned with operational maturity",
      ],
    },
    {
      eyebrow: "How we partner",
      title: "Long-term platform thinking",
      body: "We want resort operators to feel like they have a system that can grow with the business, not another tool they will outgrow in a year.",
      bullets: [
        "Multi-role collaboration built in",
        "Brand and website ownership kept in product",
        "A roadmap that supports growth, not just setup",
      ],
    },
  ],
  promise: {
    title: "The company promise behind the product",
    points: [
      "Make resort operations easier to understand at a glance",
      "Reduce the amount of manual coordination between teams",
      "Give operators more confidence in bookings, payments, and execution",
      "Keep the guest-facing experience aligned with internal workflows",
    ],
  },
  cta: {
    title: "See how our product vision turns into real resort workflows.",
    body: "Explore the solution, review the ecosystem, and compare the plans that bring ResortCloud into day-to-day operations.",
  },
};

export type CompanyContent = typeof companyContent;

export const getCompanyContent = cache(async () => companyContent);
