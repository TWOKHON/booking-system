import { AddOn, FaqCategory, PricingFeature, PricingPlan } from "@/types";

export const NAV_ITEMS = [
  {
    name: "Platform",
    link: "/",
  },
  {
    name: "Solution",
    link: "/solution",
  },
  {
    name: "Ecosystem",
    link: "/ecosystem",
  },
  {
    name: "Pricing",
    link: "/pricing",
  },
  {
    name: "Company",
    link: "/company",
  },
];

export const BRANDS = [
  { src: "/brands/next.jpg", alt: "Nextjs" },
  { src: "/brands/tailwindcss.svg", alt: "Tailwindcss" },
  { src: "/brands/intel.svg", alt: "Intel" },
  { src: "/brands/nvidia.svg", alt: "Nvidia" },
  { src: "/brands/altium.svg", alt: "Altium" },
  { src: "/brands/openai.webp", alt: "Openai" },
  { src: "/brands/oracle.webp", alt: "Oracle" },
  { src: "/brands/portola.png", alt: "Portola" },
  { src: "/brands/mysql.svg", alt: "Mysql" },
  { src: "/brands/node.svg", alt: "Node" },
  { src: "/brands/express.jpg", alt: "Express" },
  { src: "/brands/one-beyond.svg", alt: "Onebeyond" },
  { src: "/brands/planetscale.jpg", alt: "Planetscale" },
  { src: "/brands/furiosa.svg", alt: "Furiosa" },
  { src: "/brands/stravito.svg", alt: "Stravito" },
  { src: "/brands/wwt.svg", alt: "Wwt" },
  { src: "/brands/attom.svg", alt: "Attom" },
  { src: "/brands/characterai.png", alt: "Characterai" },
];

export const BENTO_FEATURES_DATA = [
  {
    name: "reservations.ts",
    body: "Handle guest bookings, availability, and scheduling in one centralized system designed for seamless reservation management.",
  },
  {
    name: "operations.xlsx",
    body: "Organize daily resort operations including staff coordination, task management, and service workflows efficiently.",
  },
  {
    name: "guests.json",
    body: "Store and manage guest information, preferences, and history to deliver a more personalized experience.",
  },
  {
    name: "payments.gpg",
    body: "Securely process and track payments, transactions, and billing records across all resort services.",
  },
  {
    name: "reports.txt",
    body: "Generate insights and analytics to monitor performance, revenue, and operational efficiency in real time.",
  },
];

export const TESTIMONIALS = [
  {
    quote: "Finally, everything is in one place",
    body: "Managing bookings, guests, and operations used to be chaotic. Now everything runs smoothly in one system.",
    name: "Juan Dela Cruz",
    image: "https://i.pravatar.cc/80?img=1",
  },
  {
    quote: "A game changer for our resort",
    body: "We reduced manual work and improved guest experience instantly after switching.",
    name: "Maria Santos",
    image: "https://i.pravatar.cc/80?img=2",
  },
  {
    quote: "No more switching between apps",
    body: "Everything we need—from reservations to reports—is finally centralized.",
    name: "Carlos Reyes",
    image: "https://i.pravatar.cc/80?img=3",
  },
  {
    quote: "Simple, powerful, and reliable",
    body: "The platform is easy to use but powerful enough to handle all our operations.",
    name: "Angela Bautista",
    image: "https://i.pravatar.cc/80?img=4",
  },
  {
    quote: "Our operations became seamless",
    body: "We now manage bookings, staff, and payments without any confusion.",
    name: "Mark Villanueva",
    image: "https://i.pravatar.cc/80?img=5",
  },
  {
    quote: "Saved us hours every day",
    body: "Automation and centralized workflows made our daily tasks much faster.",
    name: "Jasmine Garcia",
    image: "https://i.pravatar.cc/80?img=6",
  },
  {
    quote: "Perfect for growing resorts",
    body: "As our business expanded, this system scaled with us effortlessly.",
    name: "Rafael Mendoza",
    image: "https://i.pravatar.cc/80?img=7",
  },
  {
    quote: "Everything just works",
    body: "No more errors, no more double bookings—just smooth operations.",
    name: "Patricia Cruz",
    image: "https://i.pravatar.cc/80?img=8",
  },
  {
    quote: "Built for real resort needs",
    body: "It feels like this platform was designed specifically for our workflow.",
    name: "Kevin Torres",
    image: "https://i.pravatar.cc/80?img=9",
  },
  {
    quote: "From chaos to control",
    body: "We finally have full visibility over our operations and reservations.",
    name: "Nicole Ramos",
    image: "https://i.pravatar.cc/80?img=10",
  },
  {
    quote: "Guests noticed the difference",
    body: "Faster booking and better service improved our customer satisfaction.",
    name: "Daniel Flores",
    image: "https://i.pravatar.cc/80?img=11",
  },
  {
    quote: "Clean and intuitive system",
    body: "Even our staff quickly adapted because everything is straightforward.",
    name: "Karen Navarro",
    image: "https://i.pravatar.cc/80?img=12",
  },
  {
    quote: "One platform, total control",
    body: "We manage everything from a single dashboard—it’s incredibly efficient.",
    name: "Joshua Aquino",
    image: "https://i.pravatar.cc/80?img=13",
  },
  {
    quote: "Less stress, more productivity",
    body: "Our team can now focus on guests instead of paperwork.",
    name: "Michelle Castillo",
    image: "https://i.pravatar.cc/80?img=14",
  },
  {
    quote: "Reliable every single day",
    body: "We depend on it daily, and it never disappoints.",
    name: "Adrian Herrera",
    image: "https://i.pravatar.cc/80?img=15",
  },
  {
    quote: "Booking management made easy",
    body: "Handling reservations is now faster and more organized than ever.",
    name: "Samantha Lopez",
    image: "https://i.pravatar.cc/80?img=16",
  },
  {
    quote: "A must-have for resort owners",
    body: "If you run a resort, this system will make your life easier.",
    name: "Bryan Gutierrez",
    image: "https://i.pravatar.cc/80?img=17",
  },
  {
    quote: "Professional and efficient",
    body: "It helped us operate like a high-end resort with minimal effort.",
    name: "Camille Fernandez",
    image: "https://i.pravatar.cc/80?img=18",
  },
  {
    quote: "We finally feel organized",
    body: "Everything is structured, tracked, and easy to manage.",
    name: "Leo Dominguez",
    image: "https://i.pravatar.cc/80?img=19",
  },
  {
    quote: "Best decision we made",
    body: "Switching to this platform improved both operations and revenue.",
    name: "Trisha Salazar",
    image: "https://i.pravatar.cc/80?img=20",
  },
];

export const PEOPLE = [
  {
    id: 1,
    name: "John Doe",
    designation: "Software Engineer",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
  },
  {
    id: 2,
    name: "Robert Johnson",
    designation: "Product Manager",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 3,
    name: "Jane Smith",
    designation: "Data Scientist",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 4,
    name: "Emily Davis",
    designation: "UX Designer",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 5,
    name: "Tyler Durden",
    designation: "Soap Developer",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
  },
  {
    id: 6,
    name: "Dora",
    designation: "The Explorer",
    image:
      "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3534&q=80",
  },
];
export const YEARLY_DISCOUNT = 0.2;


export const PRICING_PLANS: PricingPlan[] = [
  {
    key: "free_trial",
    name: "Free Trial",
    price: 0,
    // isFree: true,
    description:
      "Try all core features risk-free for 7 days. No credit card required. Cancel anytime.",
    cta: "Start free trial",
  },
  {
    key: "starter",
    name: "Starter",
    price: 999,
    description:
      "Everything you need to manage bookings and run daily resort operations.",
    cta: "Get started",
  },
  {
    key: "growth",
    name: "Growth",
    price: 2499,
    includes: "Everything in Starter, plus:",
    description:
      "Scale your resort with advanced tools, multi-property support, and automation.",
    cta: "Get started",
    badge: "Popular",
    featured: true,
  },
  {
    key: "enterprise",
    name: "Enterprise",
    price: 5999,
    includes: "Everything in Growth, plus:",
    description:
      "Full-suite platform with AI, dedicated support, and enterprise-grade controls.",
    cta: "Get started",
  },
];

export const PRICING_FEATURES: PricingFeature[] = [
  // --- Core Operations ---
  {
    label: "Reservation Management",
    category: "Core Operations",
    highlight: true,
    values: {
      free_trial: true,
      starter: true,
      growth: true,
      enterprise: true,
    },
  },
  {
    label: "Sales Availability Board",
    category: "Core Operations",
    highlight: true,
    values: {
      free_trial: true,
      starter: true,
      growth: true,
      enterprise: true,
    },
  },
  {
    label: "Invoice Generation",
    category: "Core Operations",
    highlight: true,
    values: {
      free_trial: true,
      starter: true,
      growth: true,
      enterprise: true,
    },
  },
  {
    label: "Email & SMS Notifications",
    category: "Core Operations",
    highlight: true,
    values: {
      free_trial: true,
      starter: true,
      growth: true,
      enterprise: true,
    },
  },
  {
    label: "Client Inquiry & Follow-Up",
    category: "Core Operations",
    values: {
      free_trial: true,
      starter: true,
      growth: true,
      enterprise: true,
    },
  },
  {
    label: "Basic Marketing Analytics",
    category: "Core Operations",
    values: {
      free_trial: true,
      starter: true,
      growth: true,
      enterprise: true,
    },
  },

  // --- Finance & HR ---
  {
    label: "Finance & Cash Tracking",
    category: "Finance & HR",
    highlight: true,
    values: {
      free_trial: "limited",
      starter: true,
      growth: true,
      enterprise: true,
    },
  },
  {
    label: "KPI Dashboard",
    category: "Finance & HR",
    highlight: true,
    values: {
      free_trial: "limited",
      starter: true,
      growth: true,
      enterprise: true,
    },
  },
  {
    label: "HR Module",
    category: "Finance & HR",
    highlight: true,
    values: {
      free_trial: false,
      starter: true,
      growth: true,
      enterprise: true,
    },
  },
  {
    label: "Accounting Module",
    category: "Finance & HR",
    values: {
      free_trial: false,
      starter: true,
      growth: true,
      enterprise: true,
    },
  },

  // --- Website & Integrations ---
  {
    label: "Website Builder (No-Code)",
    category: "Website & Integrations",
    highlight: true,
    values: {
      free_trial: false,
      starter: true,
      growth: true,
      enterprise: true,
    },
  },
  {
    label: "Discord Integration",
    category: "Website & Integrations",
    values: {
      free_trial: false,
      starter: true,
      growth: true,
      enterprise: true,
    },
  },

  // --- Team & Scale ---
  {
    label: "Staff Accounts",
    category: "Team & Scale",
    highlight: true,
    values: {
      free_trial: "Up to 3",
      starter: "Up to 10",
      growth: "Up to 25",
      enterprise: "Unlimited",
    },
  },
  {
    label: "Advanced Analytics & Reports",
    category: "Team & Scale",
    highlight: true,
    values: {
      free_trial: false,
      starter: false,
      growth: true,
      enterprise: true,
    },
  },
  {
    label: "Multi-Property Support",
    category: "Team & Scale",
    highlight: true,
    values: {
      free_trial: false,
      starter: false,
      growth: true,
      enterprise: true,
    },
  },

  // --- AI Features ---
  {
    label: "AI Smart Recommendations",
    category: "AI Features",
    highlight: true,
    values: {
      free_trial: false,
      starter: false,
      growth: false,
      enterprise: true,
    },
  },
  {
    label: "AI Chatbot (Guest-Facing)",
    category: "AI Features",
    highlight: true,
    values: {
      free_trial: false,
      starter: false,
      growth: false,
      enterprise: true,
    },
  },
  {
    label: "AI Revenue Forecasting",
    category: "AI Features",
    highlight: true,
    values: {
      free_trial: false,
      starter: false,
      growth: false,
      enterprise: true,
    },
  },

  // --- Support & Extras ---
  {
    label: "Priority Support",
    category: "Support & Extras",
    highlight: true,
    values: {
      free_trial: false,
      starter: "Email",
      growth: "Email + Chat",
      enterprise: "Dedicated Manager",
    },
  },
  {
    label: "Google AdSense (System Ads)",
    category: "Support & Extras",
    highlight: true,
    values: {
      free_trial: "Shown",
      starter: "Ad-free",
      growth: "Ad-free",
      enterprise: "Ad-free",
    },
  },
];

export const PRICING_CATEGORIES = Array.from(
  new Set(PRICING_FEATURES.map((f) => f.category).filter(Boolean) as string[]),
);

export const HIGHLIGHTED_FEATURES = PRICING_FEATURES.filter((f) => f.highlight);

export const ADD_ONS: AddOn[] = [
  {
    key: "custom_domain",
    name: "Custom Domain",
    description:
      "Connect your own branded domain to your resort website via our marketplace.",
    price: 1200,
    priceNote: "per year",
    icon: "Globe",
  },
  {
    key: "extra_property",
    name: "Extra Property Slot",
    description:
      "Add an additional property to your account beyond your plan's limit.",
    price: 499,
    priceNote: "per property / month",
    icon: "Building2",
  },
  {
    key: "extra_staff",
    name: "Extra Staff Accounts",
    description:
      "Add more staff accounts beyond your current plan's included limit.",
    price: 199,
    priceNote: "per account / month",
    icon: "Users",
  },
  {
    key: "ai_bundle",
    name: "AI Feature Bundle",
    description:
      "Unlock AI Smart Recommendations, Guest Chatbot, and Revenue Forecasting on any plan.",
    price: 999,
    priceNote: "per month",
    icon: "Sparkles",
    badge: "New",
  },
  {
    key: "white_label",
    name: "White Label Branding",
    description:
      "Remove ResortCloud branding and use your own logo and colors throughout the platform.",
    price: 1499,
    priceNote: "per month",
    icon: "Palette",
  },
  {
    key: "priority_onboarding",
    name: "Priority Onboarding",
    description:
      "Get a dedicated onboarding specialist to set up your account and train your team.",
    price: 2999,
    priceNote: "one-time",
    icon: "Headphones",
  },
];

export const FAQS_CONTENT: FaqCategory[] = [
  {
    category: "Pricing & Plans",
    items: [
      {
        question: "What plans does ResortCloud offer?",
        answer:
          "ResortCloud offers three paid tiers: Starter (₱1,499/mo or ₱14,990/yr), Growth (₱2,999/mo or ₱28,990/yr), and Enterprise (₱4,999/mo or ₱47,990/yr). All paid plans are completely ad-free. You can also start with a 7-day free trial before committing to any plan.",
      },
      {
        question: "How much can I save by billing annually?",
        answer:
          "Billing annually saves you roughly 17% on the Starter plan, ~19% on Growth, and ~20% on Enterprise compared to monthly billing. It's the best option if you're planning to use ResortCloud long-term.",
      },
      {
        question: "Is there a free trial? What are its limitations?",
        answer:
          "Yes! You get a 7-day free trial with access to all Starter-level features. During the trial, Google AdSense banners are displayed in your dashboard, staff accounts are limited to 3, and the Domain Marketplace is not available. Once you subscribe to any paid plan, ads are permanently removed and your limits expand.",
      },
      {
        question: "What happens if I don't subscribe after my trial ends?",
        answer:
          "When your 7-day trial expires without an active subscription, your account is suspended. Don't worry — your data is retained for 30 days, giving you time to reactivate. You'll receive automatic reminders on Day 5 and Day 7 of your trial.",
      },
    ],
  },
  {
    category: "Accounts & Users",
    items: [
      {
        question: "How many staff accounts can I add per plan?",
        answer:
          "The Free Trial supports up to 3 staff accounts. The Starter plan supports up to 10, Growth up to 25, and Enterprise has unlimited staff accounts. Each user is assigned exactly one role with server-side enforced permissions.",
      },
      {
        question: "What roles are available in ResortCloud?",
        answer:
          "ResortCloud uses a role-based access control (RBAC) system. Available roles include Tenant Owner/Superadmin, Admin, Sales, HR, Accounting (Accountant & Auditor), Marketing, and Operations (Housekeeping & Maintenance). Each role has a clearly defined permission set — you only see what's relevant to your work.",
      },
      {
        question:
          "Can I change a staff member's role after creating their account?",
        answer:
          "Yes. As a Tenant Owner or Admin, you can create, edit, and deactivate staff accounts at any time through the User Management section of your dashboard. Role changes take effect immediately with server-side enforcement.",
      },
    ],
  },
  {
    category: "Platform & Features",
    items: [
      {
        question: "What core features are included in all plans?",
        answer:
          "Every plan — including the free trial — includes reservation and booking management, a color-coded sales availability board, client inquiry and follow-up tracking, invoice generation, basic marketing analytics, and email & SMS notifications.",
      },
      {
        question: "What does the Enterprise AI suite include?",
        answer:
          "The Enterprise plan unlocks three powerful AI features: Smart Booking Recommendations (optimal pricing and promo timing based on booking history), an AI Guest Chatbot (embedded on your public website to answer FAQs and check availability), and AI Revenue Forecasting (predicts occupancy and revenue trends for the next 30, 60, and 90 days).",
      },
      {
        question: "Does ResortCloud support managing multiple properties?",
        answer:
          "Yes — multi-property support is available starting from the Growth plan, allowing you to manage up to 2 properties under a single tenant account. Enterprise plan users can manage even more. Each property's data is kept organized and accessible from one dashboard.",
      },
      {
        question: "Is there a website builder included?",
        answer:
          "Yes! All paid plans include a no-code Website Builder built on a pre-configured resort template. You can customize your logo, brand colors, typography, and content — and publish your site with a booking widget already connected to your reservation module. No coding knowledge required.",
      },
    ],
  },
  {
    category: "Bookings & Payments",
    items: [
      {
        question: "How does the booking and payment process work?",
        answer:
          "When a guest booking is confirmed, a 50% down payment link is automatically generated and sent via PayMongo. The platform supports GCash, Maya, and credit/debit cards. Once payment is received, the booking status updates automatically via webhook.",
      },
      {
        question: "What is the cancellation policy?",
        answer:
          "If a booking is cancelled within 7 days of the booking date, the full payment is forfeited per the platform's default cancellation policy. Cancellations outside that window follow your resort's terms. Refunds require manual trigger by an Accountant with Owner approval.",
      },
      {
        question: "How does the client priority system work?",
        answer:
          "Inquiries are automatically prioritized based on the guest's target booking date. Leads within 10 days are marked 🔴 Hot and trigger urgent alerts. Leads 11–30 days out are 🟡 Warm with standard follow-up reminders. Leads beyond 30 days are 🔵 Cold and receive periodic nurture reminders. You can also manually toggle priority levels.",
      },
    ],
  },
  {
    category: "Domain & Website",
    items: [
      {
        question: "Can I use a custom domain for my resort website?",
        answer:
          "Yes. The Domain Marketplace is available on all paid plans. Starter plan users can purchase a domain as an add-on for ₱1,200/yr. Growth plan includes 1 domain, and Enterprise includes 3 domains. You search, buy, and manage everything directly inside ResortCloud — no need to interact with a registrar.",
      },
      {
        question: "Do I need to configure DNS or SSL myself?",
        answer:
          "Not at all. ResortCloud handles all DNS configuration (A records and CNAME), domain propagation, and SSL certificate provisioning via Let's Encrypt automatically. From your side, it's simply Search → Buy → Done. Your site goes live on your custom domain without any technical setup.",
      },
      {
        question: "Will my domain auto-renew?",
        answer:
          "Yes. ResortCloud automatically renews your domain annually and charges your payment method on file. You'll receive reminder emails 30 days and 7 days before your domain's expiry date so you're never caught off guard.",
      },
    ],
  },
  {
    category: "Security & Privacy",
    items: [
      {
        question: "How is my resort's data kept separate from other tenants?",
        answer:
          "ResortCloud is built on a multi-tenant architecture with an isolated database schema per tenant. Your data is never mixed with another resort's data, and all permissions are enforced server-side — not just in the UI.",
      },
      {
        question: "Who can see my KPI dashboard and financial data?",
        answer:
          "The KPI Dashboard is visible only to the Tenant Owner/Superadmin. Financial modules are accessible to Accountants (full read-write) and Auditors (read-only). Role-based access ensures sensitive data is never exposed to unauthorized staff.",
      },
      {
        question: "Are ads shown to my guests or staff on paid plans?",
        answer:
          "No. Google AdSense ads are only displayed inside the tenant dashboard during the 7-day free trial. The moment you activate any paid subscription, ads are permanently removed — your workspace and your guests' experience remain completely ad-free.",
      },
    ],
  },
  {
    category: "Integrations",
    items: [
      {
        question: "What payment methods are supported for guests?",
        answer:
          "ResortCloud integrates with PayMongo for guest payments, supporting GCash, Maya, and credit/debit cards. SaaS subscription billing (your plan payments) is handled separately via Stripe.",
      },
      {
        question: "Does ResortCloud integrate with Discord?",
        answer:
          "Yes. All paid plans include a Discord webhook integration. You can configure per-channel notifications for your team — ideal for real-time alerts on new bookings, inquiries, or operations updates.",
      },
      {
        question: "Is there a mobile app available?",
        answer:
          "A native mobile app for iOS and Android is not included in the current MVP. ResortCloud is designed as a web-based platform accessible from any modern browser. A mobile app may be considered in a future release.",
      },
    ],
  },
];
