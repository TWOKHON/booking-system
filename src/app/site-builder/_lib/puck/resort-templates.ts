import type { PuckData } from "./puck-config";

type ResortTemplateSeed = {
  slug: string;
  name: string;
  label?: string;
  title: string;
  description: string;
  location: string;
  image: string;
  accent: string;
  mood: string;
};

export type ResortTemplate = ResortTemplateSeed & {
  data: Record<string, PuckData>;
};

type TemplateBlock = PuckData["content"][number] | { type: string; props: Record<string, unknown> };

const resortSeeds: ResortTemplateSeed[] = [
  {
    slug: "boracay-azure",
    name: "Azure Boracay",
    label: "Popular",
    title: "Paradise on White Beach",
    description: "Experience the world's finest white sand and crystal clear waters.",
    location: "Boracay, Philippines",
    image:
      "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=1200&q=80",
    accent: "#dce8f5",
    mood: "Island paradise",
  },
  {
    slug: "palawan-serenity",
    name: "Serenity Palawan",
    title: "The Last Frontier",
    description: "Discover limestone cliffs and hidden lagoons in El Nido.",
    location: "Palawan, Philippines",
    image:
      "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80",
    accent: "#dbeafe",
    mood: "Cliffside wonder",
  },
  {
    slug: "siargao-surf",
    name: "Siargao Surf Retreat",
    title: "Ride the Cloud 9",
    description: "The surfing capital of the Philippines awaits your arrival.",
    location: "Siargao, Philippines",
    image:
      "https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=1200&q=80",
    accent: "#f3e7d3",
    mood: "Surf & chill",
  },
  {
    slug: "cebu-heritage",
    name: "Cebu Heritage Resort",
    title: "History Meets Luxury",
    description: "Modern comfort in the heart of the oldest city in the Philippines.",
    location: "Cebu, Philippines",
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
    accent: "#cffafe",
    mood: "City elegance",
  },
  {
    slug: "bohol-hills",
    name: "Chocolate Hills Resort",
    title: "Wonder of Nature",
    description: "Stay amidst the world-famous Chocolate Hills and tarsiers.",
    location: "Bohol, Philippines",
    image:
      "https://images.unsplash.com/photo-1621886292650-520f76c747d6?auto=format&fit=crop&w=1200&q=80",
    accent: "#dcfce7",
    mood: "Natural harmony",
  },
  {
    slug: "batanes-cliffs",
    name: "Batanes Stone House",
    title: "Northernmost Beauty",
    description: "Experience the breathtaking rolling hills and stone houses of Ivatan.",
    location: "Batanes, Philippines",
    image:
      "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?auto=format&fit=crop&w=1200&q=80",
    accent: "#fef3c7",
    mood: "Rustic charm",
  },
  {
    slug: "pampanga-culinary",
    name: "Culinary Capital Suites",
    title: "A Taste of Kapampangan",
    description: "Indulge in the best food the Philippines has to offer.",
    location: "Pampanga, Philippines",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    accent: "#e0e7ff",
    mood: "Modern hospitality",
  },
  {
    slug: "davao-pearl",
    name: "Pearl Farm Samal",
    title: "Gem of the South",
    description: "A private paradise on the shores of Samal Island.",
    location: "Davao, Philippines",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    accent: "#e0f2fe",
    mood: "Coastal serenity",
  },
];

function createHeader(template: ResortTemplateSeed, index: number): TemplateBlock {
  const variants: ("centered" | "logo-left" | "logo-right")[] = [
    "centered",
    "logo-left",
    "centered",
    "logo-left",
    "centered",
    "logo-left",
    "centered",
    "logo-left",
  ];
  const variant = variants[index % variants.length];

  return {
    type: "HeaderBlock",
    props: {
      id: `${template.slug}-header`,
      logo: template.name,
      logoType: "text",
      logoImage: "",
      variant,
      navItems: [
        {
          label: "Home",
          url: "/",
          children: {
            heading: "",
            description: "",
            cta: { label: "", url: "#" },
            links: [],
          },
        },
        {
          label: "Rooms",
          url: "/rooms",
          children: {
            heading: "Rooms and suites",
            description: "Explore signature suites, villas, and private retreats.",
            cta: { label: "View rooms", url: "/rooms" },
            links: [
              { label: "Signature suite", url: "/rooms" },
              { label: "Private villa", url: "/rooms" },
              { label: "Family hideaway", url: "/rooms" },
            ],
          },
        },
        {
          label: "Amenities",
          url: "/amenities",
          children: {
            heading: "",
            description: "",
            cta: { label: "", url: "#" },
            links: [
              { label: "Spa", url: "/amenities" },
              { label: "Dining", url: "/amenities" },
              { label: "Excursions", url: "/amenities" },
            ],
          },
        },
      ],
      ctaPrimary: { label: "Book now", url: "/rooms" },
      ctaSecondary: { label: "Explore", url: "/amenities" },
      ctaTertiary: { label: "", url: "#" },
    },
  };
}

function createHero(template: ResortTemplateSeed, index: number): TemplateBlock {
  const alignVariants: ("left" | "center")[] = ["center", "left", "center", "left"];
  const align = alignVariants[index % alignVariants.length];

  // Every 2nd template uses a Carousel Hero instead of the standard Hero
  if (index % 2 === 1) {
    return {
      type: "HeroCarouselBlock",
      props: {
        slides: [
          {
            heading: template.name,
            description: `Experience the finest luxury in ${template.location}. ${template.description}`,
            image: template.image,
            badge: "Special Offer",
            primaryCta: { label: "Book Now", url: "#" },
            secondaryCta: { label: "Explore", url: "#" },
          },
          {
            heading: "Exclusive Retreat",
            description: "A sanctuary designed for your ultimate comfort and relaxation.",
            image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
            badge: "Popular",
            primaryCta: { label: "View Deals", url: "#" },
            secondaryCta: { label: "Gallery", url: "#" },
          },
        ],
        textColor: "#ffffff",
        backgroundOverlayOpacity: 45,
        height: "large",
      },
    };
  }

  return {
    type: "HeroBlock",
    props: {
      id: `${template.slug}-hero`,
      badge: { label: template.location, url: "#" },
      heading: template.title,
      description: template.description,
      adjectives: [{ label: template.mood }],
      primaryCta: { label: "Book your stay", url: "#" },
      secondaryCta: { label: "Explore rooms", url: "#" },
      backgroundColor: template.accent,
      textColor: index % 2 === 0 ? "#171717" : "#ffffff",
      backgroundImageUrl: template.image,
      backgroundOverlayOpacity: index % 3 === 0 ? 34 : 26,
      align,
      images: [
        { src: template.image, alt: template.name },
        { src: template.image, alt: `${template.name} detail` },
        { src: template.image, alt: `${template.name} view` },
      ],
    },
  };
}

function createRoomShowcase(template: ResortTemplateSeed, index: number): TemplateBlock {
  const isCardLayout = index % 2 === 0;

  if (isCardLayout) {
    return {
      type: "CardsBlock",
      props: {
        id: `${template.slug}-rooms`,
        eyebrow: "Rooms and suites",
        heading: "Signature Living",
        description: "Choose from our wide range of luxury rooms and suites.",
        columns: "3",
        items: [
          {
            title: "Signature suite",
            description: "A spacious retreat with quiet corners and wide destination views.",
            imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
            price: "$350/night",
            badge: "Popular",
          },
          {
            title: "Private villa",
            description: "Indoor-outdoor living, plunge pool options, and concierge support.",
            imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
            price: "$550/night",
            badge: "Premium",
          },
          {
            title: "Family hideaway",
            description: "Flexible layouts for longer stays, group travel, and slow mornings.",
            imageUrl: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&q=80",
            price: "$450/night",
          },
        ],
      },
    };
  }

  return {
    type: "BentoBlock",
    props: {
      id: `${template.slug}-rooms`,
      eyebrow: "Rooms and suites",
      heading: "Choose the stay that fits your rhythm",
      description:
        "A room showcase for signature suites, private villas, and family-ready spaces.",
      items: [
        {
          title: "Signature suite",
          description: "A spacious retreat with quiet corners and wide destination views.",
          highlight: "Sleeps 2",
          imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
        },
        {
          title: "Private villa",
          description: "Indoor-outdoor living, plunge pool options, and concierge support.",
          highlight: "Premium",
          imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
        },
        {
          title: "Family hideaway",
          description: "Flexible layouts for longer stays, group travel, and slow mornings.",
          highlight: "Sleeps 4",
          imageUrl: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&q=80",
        },
        {
          title: "Honeymoon escape",
          description: "An intimate setting for privacy, celebration, and golden-hour dinners.",
          highlight: "Romantic",
          imageUrl: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80",
        },
      ],
    },
  };
}

function createAmenitiesShowcase(template: ResortTemplateSeed, index: number): TemplateBlock {
  const isCardLayout = index % 2 === 1;

  if (isCardLayout) {
    return {
      type: "CardsBlock",
      props: {
        id: `${template.slug}-amenities`,
        eyebrow: "Amenities",
        heading: "Comforts that make the stay feel effortless",
        description: "Experience world-class facilities and services during your stay.",
        columns: "3",
        items: [
          {
            title: "Spa & Wellness",
            description: "Restorative treatments and movement sessions in a quiet sanctuary.",
            imageUrl: "https://images.unsplash.com/photo-1544161515-4af6b1d462c2?w=800&q=80",
            badge: "Relaxation",
          },
          {
            title: "Infinity Pool",
            description: "Breathtaking views of the horizon from our temperature-controlled pool.",
            imageUrl: "https://images.unsplash.com/photo-1519449556851-5720b33024e7?w=800&q=80",
            badge: "Refreshing",
          },
          {
            title: "Fine Dining",
            description: "Exquisite culinary experiences featuring local and international cuisine.",
            imageUrl: "https://images.unsplash.com/photo-1550966841-3ee7adac1ad4?w=800&q=80",
            badge: "Gourmet",
          },
        ],
      },
    };
  }

  const icons = ["Sparkles", "Leaf", "Zap", "Shield", "Globe", "Heart"];
  return {
    type: "FeatureCardsBlock",
    props: {
      id: `${template.slug}-amenities`,
      eyebrow: "Amenities",
      heading: "Comforts that make the stay feel effortless",
      description:
        "Showcase the amenities guests care about before they commit to booking.",
      icon: icons[index % icons.length],
      features: [
        {
          title: "Spa and wellness",
          description: "Restorative treatments, movement sessions, and quiet recovery spaces.",
        },
        {
          title: "Destination dining",
          description: "Seasonal menus shaped by local ingredients and relaxed service.",
        },
        {
          title: "Curated excursions",
          description: "Guided experiences that make the destination easy to explore.",
        },
      ],
    },
  };
}


function createStats(template: ResortTemplateSeed, index: number): TemplateBlock {
  const icons = ["BarChart3", "Users", "MapPin", "Clock"];
  const variants: ("cards" | "minimal" | "split")[] = ["cards", "minimal", "split"];
  const variant = variants[index % variants.length];

  return {
    type: "StatisticsBlock",
    props: {
      id: `${template.slug}-stats`,
      eyebrow: "At a glance",
      heading: "Designed for memorable stays",
      description: "Use these metrics to highlight scale, quality, and trust.",
      icon: icons[index % icons.length],
      variant,
      stats: [
        { value: "48", label: "Private suites", description: "Individually designed for maximum comfort.", icon: "Home" },
        { value: "4.9", label: "Guest rating", description: "Based on over 1,000 verified reviews.", icon: "Star" },
        { value: "12", label: "Curated experiences", description: "From island hopping to private dining.", icon: "Palmtree" },
        { value: "24/7", label: "Concierge care", description: "Always here to assist with your needs.", icon: "UserCheck" },
      ],
    },
  };
}

function createTestimonials(template: ResortTemplateSeed, index: number): TemplateBlock {
  const icons = ["Star", "Heart", "Smile"];
  return {
    type: "TestimonialsBlock",
    props: {
      id: `${template.slug}-testimonials`,
      eyebrow: "Guest stories",
      heading: "Loved by travelers",
      description: "Social proof for the kind of stay your resort promises.",
      icon: icons[index % icons.length],
      testimonials: [
        {
          quote: "Every detail felt intentional, from arrival to the final morning.",
          name: "Amelia Hart",
          role: "Guest",
        },
        {
          quote: "The perfect balance of privacy, service, and unforgettable scenery.",
          name: "Noah Bennett",
          role: "Guest",
        },
        {
          quote: "We booked for the views and came back for the hospitality.",
          name: "Isla Morgan",
          role: "Guest",
        },
      ],
    },
  };
}

function createFaq(template: ResortTemplateSeed): TemplateBlock {
  return {
    type: "FaqBlock",
    props: {
      id: `${template.slug}-faq`,
      eyebrow: "Before you arrive",
      heading: "Helpful booking details",
      description: "Answer common questions before guests reach out.",
      questions: [
        {
          question: "What time is check-in?",
          answer: "Check-in begins at 3:00 PM. Early arrival can be requested before your stay.",
        },
        {
          question: "Are airport transfers available?",
          answer: "Yes. The concierge team can arrange private transfers after booking.",
        },
        {
          question: "Can guests customize experiences?",
          answer: "Yes. Dining, wellness, and excursions can be tailored to each itinerary.",
        },
      ],
    },
  };
}

function createArticle(template: ResortTemplateSeed): TemplateBlock {
  return {
    type: "ArticleCardBlock",
    props: {
      id: `${template.slug}-article`,
      category: "Destination guide",
      title: `A slower way to discover ${template.location}`,
      excerpt:
        "Use this editorial block to promote destination stories, seasonal packages, or travel guides.",
      author: "Resort Concierge",
      date: "June 2026",
      imageUrl: template.image,
      imageAlt: `${template.name} destination guide`,
      link: { label: "Read guide", url: "#" },
    },
  };
}

function createContact(template: ResortTemplateSeed): TemplateBlock {
  return {
    type: "ContactBlock",
    props: {
      id: `${template.slug}-contact`,
      eyebrow: "Concierge",
      heading: "Need help planning the details?",
      description:
        "Invite guests to ask about room fit, occasion planning, or special requests.",
      email: `reservations@${template.slug}.com`,
      location: template.location,
      buttonLabel: "Send inquiry",
    },
  };
}

function createCta(template: ResortTemplateSeed, index: number): TemplateBlock {
  const variants = [
    { eyebrow: "Plan your escape", heading: `Make ${template.name} your next destination` },
    { eyebrow: "Limited time", heading: `Exclusive offers for your ${template.location} stay` },
    { eyebrow: "Newsletter", heading: "Get seasonal updates and private invitations" },
  ];
  const variant = variants[index % variants.length];

  return {
    type: "CtaBlock",
    props: {
      id: `${template.slug}-cta`,
      eyebrow: variant.eyebrow,
      heading: variant.heading,
      description: "Invite visitors to check dates, request a quote, or start a booking.",
      primaryCta: { label: "Check availability", url: "#" },
      secondaryCta: { label: "Contact concierge", url: "#" },
    },
  };
}

function createFooter(template: ResortTemplateSeed): TemplateBlock {
  return {
    type: "FooterBlock",
    props: {
      id: `${template.slug}-footer`,
      logo: template.name,
      tagline: template.description,
      address: `${template.location}\nReservations by appointment`,
      copyright: `(c) 2026 ${template.name}.`,
      legalLinks: [
        { label: "Terms", url: "#" },
        { label: "Privacy", url: "#" },
      ],
      columns: [
        {
          heading: "Resort",
          links: [
            { label: "Rooms", url: "/rooms" },
            { label: "Dining", url: "/amenities" },
          ],
        },
        {
          heading: "Explore",
          links: [
            { label: "Wellness", url: "/amenities" },
            { label: "Experiences", url: "/amenities" },
          ],
        },
        {
          heading: "Support",
          links: [
            { label: "Contact", url: "#" },
            { label: "FAQ", url: "#" },
          ],
        },
      ],
    },
  };
}

function createTemplateData(template: ResortTemplateSeed, index: number): Record<string, PuckData> {
  const header = createHeader(template, index);
  const hero = createHero(template, index);
  const rooms = createRoomShowcase(template, index);
  const amenities = createAmenitiesShowcase(template, index);
  const stats = createStats(template, index);
  const testimonials = createTestimonials(template, index);
  const faq = createFaq(template);
  const article = createArticle(template);
  const contact = createContact(template);
  const cta = createCta(template, index);
  const footer = createFooter(template);

  const layoutVariants: TemplateBlock[][] = [
    [header, hero, rooms, amenities, stats, testimonials, cta, footer],
    [header, hero, amenities, stats, article, rooms, cta, footer],
    [header, hero, rooms, amenities, faq, testimonials, cta, footer],
    [header, hero, stats, amenities, rooms, contact, cta, footer],
    [header, hero, article, stats, cta, footer],
    [header, hero, rooms, testimonials, contact, footer],
  ];

  const themes = [
    "theme-starry-night",
    "theme-modern-minimal",
    "theme-vintage-paper",
    "theme-soft-pop",
    "theme-nature",
    "theme-tangerine",
    "theme-amethyst-haze",
    "theme-sage-garden",
    "theme-claymorphism",
    "theme-graphite",
    "theme-retro-arcade",
    "theme-mocha-mousse",
  ];

  const theme = themes[index % themes.length];

  return {
    "/": {
      root: { props: { theme } },
      content: layoutVariants[index % layoutVariants.length] as PuckData["content"],
    },
    "/rooms": {
      root: { props: { theme } },
      content: [header, hero, rooms, cta, footer] as PuckData["content"],
    },
    "/amenities": {
      root: { props: { theme } },
      content: [header, hero, amenities, stats, cta, footer] as PuckData["content"],
    },
  };
}

export const resortTemplates: ResortTemplate[] = resortSeeds.map((template, index) => ({
  ...template,
  data: createTemplateData(template, index),
}));

export function getResortTemplate(slug: string | null | undefined) {
  return resortTemplates.find((template) => template.slug === slug);
}
