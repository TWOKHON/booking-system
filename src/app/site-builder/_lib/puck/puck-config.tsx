import { Config, type Data } from "@puckeditor/core";
import { HeadingBlock } from "@/components/puck/heading-block";
import { HeroBlock } from "@/components/puck/hero-block";
import { HeroCarouselBlock, type HeroCarouselBlockProps } from "@/components/puck/hero-carousel-block";
import { HeaderBlock } from "@/components/puck/header-block";
import { FooterBlock } from "@/components/puck/footer-block";
import { ContainerBlock } from "@/components/puck/container-block";
import { ParagraphBlock } from "@/components/puck/paragraph-block";
import { ButtonBlock } from "@/components/puck/button-block";
import { CardBlock } from "@/components/puck/card-block";
import { ColumnsBlock } from "@/components/puck/columns-block";
import { SpacerBlock } from "@/components/puck/spacer-block";
import { ColorField } from "@/components/puck/editor/color-field";
import { SliderField } from "@/components/puck/editor/slider-field";
import { IconField } from "@/components/puck/editor/icon-field";
import { ExternalImageField } from "@/components/puck/editor/external-image-field";
import {
  ArticleCardBlock,
  BentoBlock,
  BlogsBlock,
  BrandsBlock,
  CardsBlock,
  ContactBlock,
  CtaBlock,
  FaqBlock,
  FeatureCardsBlock,
  PricingBlock,
  StatisticsBlock,
  TestimonialsBlock,
  type ArticleCardBlockProps,
  type BentoBlockProps,
  type BlogsBlockProps,
  type BrandsBlockProps,
  type CardsBlockProps,
  type ContactBlockProps,
  type CtaBlockProps,
  type FaqBlockProps,
  type FeatureCardsBlockProps,
  type PricingBlockProps,
  type StatisticsBlockProps,
  type TestimonialsBlockProps,
} from "@/components/puck/marketing-sections";

export type Components = {
  HeadingBlock: { children: string };
  HeroBlock: {
    badge: { label: string; url: string };
    heading: string;
    description: string;
    adjectives: { label: string }[];
    primaryCta: { label: string; url: string };
    secondaryCta: { label: string; url: string };
    images: { src: string; alt: string }[];
    backgroundColor: string;
    textColor: string;
    backgroundImageUrl: string;
    backgroundOverlayOpacity: number;
    align?: "left" | "center";
  };
  HeroCarouselBlock: HeroCarouselBlockProps;
  HeaderBlock: {
    logo: string;
    logoType?: "text" | "image";
    logoImage?: string;
    navItems: {
      label: string;
      url: string;
      children?: {
        heading: string;
        description: string;
        cta: { label: string; url: string };
        links: { label: string; url: string }[];
      };
    }[];
    ctaPrimary: { label: string; url: string };
    ctaSecondary: { label: string; url: string };
    ctaTertiary: { label: string; url: string };
    variant?: "centered" | "logo-left" | "logo-right";
  };
  FooterBlock: {
    logo: string;
    tagline: string;
    address: string;
    legalLinks: { label: string; url: string }[];
    copyright: string;
    columns: {
      heading: string;
      links: { label: string; url: string }[];
    }[];
  };
  ContainerBlock: {
    maxWidth: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
    paddingX: number;
    paddingY: number;
    background: string;
  };
  ParagraphBlock: { text: string; size: "sm" | "base" | "lg" | "xl" };
  ButtonBlock: {
    label: string;
    href: string;
    variant: "primary" | "secondary" | "outline";
    size: "sm" | "md" | "lg";
  };
  CardBlock: {
    title: string;
    description: string;
    imageUrl: string;
    imageAlt: string;
    link: string;
  };
  ColumnsBlock: { columns: number; gap: number };
  SpacerBlock: { height: number };
  CardsBlock: CardsBlockProps;
  BentoBlock: BentoBlockProps;
  ArticleCardBlock: ArticleCardBlockProps;
  FeatureCardsBlock: FeatureCardsBlockProps & { icon?: string };
  FaqBlock: FaqBlockProps;
  CtaBlock: CtaBlockProps;
  PricingBlock: PricingBlockProps & { icon?: string };
  ContactBlock: ContactBlockProps;
  TestimonialsBlock: TestimonialsBlockProps & { icon?: string };
  StatisticsBlock: StatisticsBlockProps & { icon?: string };
  BrandsBlock: BrandsBlockProps;
  BlogsBlock: BlogsBlockProps;
};

export type RootProps = {
  theme?: string;
  children: React.ReactNode;
};

export type PuckData = Data<Components, RootProps>;

const sectionIntroFields = {
  eyebrow: { type: "text" },
  heading: { type: "text" },
  description: { type: "textarea" },
} as const;

const linkFields = {
  label: { type: "text" },
  url: { type: "text" },
} as const;

export const config: Config<Components, RootProps> = {
  root: {
    fields: {
      theme: {
        type: "select",
        options: [
          { label: "Default", value: "" },
          { label: "Amber Minimal", value: "theme-amber-minimal" },
          { label: "Amethyst Haze", value: "theme-amethyst-haze" },
          { label: "Claymorphism", value: "theme-claymorphism" },
          { label: "Doom 64", value: "theme-doom-64" },
          { label: "Graphite", value: "theme-graphite" },
          { label: "Kodama Grove", value: "theme-kodama-grove" },
          { label: "Mocha Mousse", value: "theme-mocha-mousse" },
          { label: "Modern Minimal", value: "theme-modern-minimal" },
          { label: "Nature", value: "theme-nature" },
          { label: "Neo Brutalism", value: "theme-neo-brutalism" },
          { label: "Notebook", value: "theme-notebook" },
          { label: "Retro Arcade", value: "theme-retro-arcade" },
          { label: "Sage Garden", value: "theme-sage-garden" },
          { label: "Soft Pop", value: "theme-soft-pop" },
          { label: "Starry Night", value: "theme-starry-night" },
          { label: "Sunset Horizon", value: "theme-sunset-horizon" },
          { label: "Tangerine", value: "theme-tangerine" },
          { label: "Twitter", value: "theme-twitter" },
          { label: "Vintage Paper", value: "theme-vintage-paper" },
        ],
      },
    },
    render: ({ theme, children }: RootProps) => {
      return <div className={theme}>{children}</div>;
    },
  },
  categories: {
    navigation: {
      title: "Navigation",
      components: ["HeaderBlock", "FooterBlock"],
    },
    sections: {
      title: "Sections",
      components: [
        "HeroBlock",
        "HeroCarouselBlock",
        "BentoBlock",
        "FeatureCardsBlock",
        "FaqBlock",
        "CtaBlock",
        "PricingBlock",
        "ContactBlock",
        "TestimonialsBlock",
        "StatisticsBlock",
        "BrandsBlock",
      ],
    },
    content: {
      title: "Content",
      components: ["ArticleCardBlock", "BlogsBlock"],
    },
    layout: {
      title: "Layout",
      components: ["ContainerBlock", "ColumnsBlock", "SpacerBlock"],
    },
    typography: {
      title: "Typography",
      components: ["HeadingBlock", "ParagraphBlock"],
    },
    interactive: {
      title: "Interactive",
      components: ["ButtonBlock", "CardBlock"],
    },
  },

  components: {
    HeadingBlock: {
      fields: {
        children: { type: "text" },
      },
      defaultProps: { children: "Heading" },
      render: HeadingBlock,
    },

    HeroBlock: {
      fields: {
        heading: { type: "text" },
        description: { type: "textarea" },
        backgroundColor: {
          type: "custom",
          render: (props) => <ColorField {...props} label="Background Color" />,
        },
        textColor: {
          type: "custom",
          render: (props) => <ColorField {...props} label="Text Color" />,
        },
        backgroundImageUrl: { type: "text" },
        backgroundOverlayOpacity: {
          type: "custom",
          render: (props) => (
            <SliderField
              {...props}
              label="Overlay Opacity"
              min={0}
              max={90}
              step={1}
            />
          ),
        },
        adjectives: {
          type: "array",
          arrayFields: {
            label: { type: "text" },
          },
          defaultItemProps: { label: "Fast" },
        },
        badge: {
          type: "object",
          objectFields: {
            label: { type: "text" },
            url: { type: "text" },
          },
        },
        primaryCta: {
          type: "object",
          objectFields: {
            label: { type: "text" },
            url: { type: "text" },
          },
        },
        secondaryCta: {
          type: "object",
          objectFields: {
            label: { type: "text" },
            url: { type: "text" },
          },
        },
        images: {
          type: "array",
          arrayFields: {
            src: { type: "text" },
            alt: { type: "text" },
          },
          defaultItemProps: { src: "", alt: "Image" },
          min: 3,
          max: 3,
        },
      },
      defaultProps: {
        heading: "Heading",
        description: "Description",
        adjectives: [],
        badge: { label: "Badge", url: "#" },
        primaryCta: { label: "Primary CTA", url: "#" },
        secondaryCta: { label: "Secondary CTA", url: "#" },
        backgroundColor: "#dce8f5",
        textColor: "#171717",
        backgroundImageUrl: "",
        backgroundOverlayOpacity: 20,
        images: [
          { src: "", alt: "Image 1" },
          { src: "", alt: "Image 2" },
          { src: "", alt: "Image 3" },
        ],
      },
      render: HeroBlock,
    },
    HeroCarouselBlock: {
      fields: {
        slides: {
          type: "array",
          arrayFields: {
            heading: { type: "text" },
            description: { type: "textarea" },
            image: { type: "text" },
            badge: { type: "text" },
            primaryCta: {
              type: "object",
              objectFields: {
                label: { type: "text" },
                url: { type: "text" },
              },
            },
            secondaryCta: {
              type: "object",
              objectFields: {
                label: { type: "text" },
                url: { type: "text" },
              },
            },
          },
          defaultItemProps: {
            heading: "New Adventure Awaits",
            description: "Experience the ultimate luxury and comfort.",
            image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
            badge: "Limited Offer",
            primaryCta: { label: "Book Now", url: "#" },
            secondaryCta: { label: "Learn More", url: "#" },
          },
        },
        textColor: {
          type: "custom",
          render: (props) => <ColorField {...props} label="Text Color" />,
        },
        backgroundOverlayOpacity: {
          type: "custom",
          render: (props) => (
            <SliderField
              {...props}
              label="Overlay Opacity"
              min={0}
              max={90}
              step={1}
            />
          ),
        },
        height: {
          type: "select",
          options: [
            { label: "Small", value: "small" },
            { label: "Medium", value: "medium" },
            { label: "Large", value: "large" },
            { label: "Full Screen", value: "full" },
          ],
        },
      },
      defaultProps: {
        slides: [
          {
            heading: "Luxury Escape",
            description: "Discover the serenity of our mountain resorts.",
            image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
            badge: "New",
            primaryCta: { label: "Book Now", url: "#" },
            secondaryCta: { label: "Explore", url: "#" },
          },
          {
            heading: "Ocean Paradise",
            description: "Wake up to the sound of waves in our beachfront villas.",
            image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2",
            badge: "Popular",
            primaryCta: { label: "View Deals", url: "#" },
            secondaryCta: { label: "Gallery", url: "#" },
          },
        ],
        textColor: "#ffffff",
        backgroundOverlayOpacity: 40,
        height: "medium",
      },
      render: HeroCarouselBlock,
    },

    CardsBlock: {
      fields: {
        ...sectionIntroFields,
        columns: {
          type: "select",
          options: [
            { label: "2 Columns", value: "2" },
            { label: "3 Columns", value: "3" },
            { label: "4 Columns", value: "4" },
          ],
        },
        items: {
          type: "array",
          arrayFields: {
            title: { type: "text" },
            description: { type: "textarea" },
            imageUrl: { type: "text" },
            price: { type: "text" },
            badge: { type: "text" },
          },
          defaultItemProps: {
            title: "Card title",
            description: "A short description of the item.",
            imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
            price: "$199/night",
            badge: "New",
          },
        },
      },
      defaultProps: {
        eyebrow: "Accommodations",
        heading: "Find your perfect stay",
        description: "Choose from our wide range of luxury rooms and suites.",
        columns: "3",
        items: [
          {
            title: "Deluxe Room",
            description: "Spacious room with a king-size bed and ocean view.",
            imageUrl: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80",
            price: "$150/night",
            badge: "Popular",
          },
          {
            title: "Luxury Suite",
            description: "Elegant suite with a private balcony and premium amenities.",
            imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
            price: "$250/night",
          },
          {
            title: "Presidential Villa",
            description: "The ultimate luxury experience with a private pool and butler service.",
            imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
            price: "$500/night",
            badge: "Exclusive",
          },
        ],
      },
      render: CardsBlock,
    },

    BentoBlock: {
      fields: {
        ...sectionIntroFields,
        items: {
          type: "array",
          arrayFields: {
            title: { type: "text" },
            description: { type: "textarea" },
            highlight: { type: "text" },
            imageUrl: { type: "text" },
          },
          defaultItemProps: {
            title: "Connected workflow",
            description: "Keep content, teams, and publishing steps moving together.",
            highlight: "01",
            imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
          },
          min: 3,
          max: 6,
        },
      },
      defaultProps: {
        eyebrow: "Bento",
        heading: "Everything organized in one flexible system",
        description:
          "A compact section for showing the biggest parts of your product story.",
        items: [
          {
            title: "Visual editing",
            description: "Build pages with structured blocks and predictable controls.",
            highlight: "Editor",
            imageUrl: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?w=800&q=80",
          },
          {
            title: "Reusable sections",
            description: "Start from polished patterns instead of a blank canvas.",
            highlight: "Blocks",
          },
          {
            title: "Fast previews",
            description: "Open drafts on a clean page before publishing.",
            highlight: "Preview",
          },
          {
            title: "Design consistency",
            description: "Tailwind and shadcn primitives keep spacing and states tidy.",
            highlight: "System",
            imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
          },
        ],
      },
      render: BentoBlock,
    },

    ArticleCardBlock: {
      fields: {
        category: { type: "text" },
        title: { type: "text" },
        excerpt: { type: "textarea" },
        author: { type: "text" },
        date: { type: "text" },
        imageUrl: { type: "text" },
        imageAlt: { type: "text" },
        link: {
          type: "object",
          objectFields: linkFields,
        },
      },
      defaultProps: {
        category: "Article",
        title: "How teams ship better pages with reusable sections",
        excerpt:
          "A short editorial card for featured content, announcements, or case studies.",
        author: "Puck Team",
        date: "May 30, 2026",
        imageUrl: "https://placehold.co/800x600",
        imageAlt: "Article image",
        link: { label: "Read article", url: "#" },
      },
      render: ArticleCardBlock,
    },

    FeatureCardsBlock: {
      fields: {
        ...sectionIntroFields,
        icon: {
          type: "custom",
          render: (props) => <IconField {...props} label="Icon" />,
        },
        features: {
          type: "array",
          arrayFields: {
            title: { type: "text" },
            description: { type: "textarea" },
          },
          defaultItemProps: {
            title: "Feature title",
            description: "Explain a valuable product capability in one or two lines.",
          },
          min: 1,
          max: 6,
        },
      },
      defaultProps: {
        eyebrow: "Features",
        heading: "Useful building blocks for modern pages",
        description:
          "Use this section for product benefits, service pillars, or platform capabilities.",
        icon: "Sparkles",
        features: [
          {
            title: "Composable",
            description: "Mix sections together without losing visual consistency.",
          },
          {
            title: "Editable",
            description: "Every card is driven by Puck fields your team can update.",
          },
          {
            title: "Polished",
            description: "Built with shadcn primitives and Tailwind utility classes.",
          },
        ],
      },
      render: FeatureCardsBlock,
    },

    FaqBlock: {
      fields: {
        ...sectionIntroFields,
        questions: {
          type: "array",
          arrayFields: {
            question: { type: "text" },
            answer: { type: "textarea" },
          },
          defaultItemProps: {
            question: "Can I edit this question?",
            answer: "Yes. Each FAQ item is editable from the Puck sidebar.",
          },
        },
      },
      defaultProps: {
        eyebrow: "FAQ",
        heading: "Questions, answered",
        description: "A tidy accordion for the details visitors usually need next.",
        questions: [
          {
            question: "Can I customize these sections?",
            answer: "Yes. Text, links, and list items are exposed as Puck fields.",
          },
          {
            question: "Does this use shadcn?",
            answer: "The FAQ is powered by the existing shadcn Accordion component.",
          },
          {
            question: "Can I add more items?",
            answer: "Yes. Use the array controls in the sidebar to add or reorder items.",
          },
        ],
      },
      render: FaqBlock,
    },

    CtaBlock: {
      fields: {
        eyebrow: { type: "text" },
        heading: { type: "text" },
        description: { type: "textarea" },
        primaryCta: {
          type: "object",
          objectFields: linkFields,
        },
        secondaryCta: {
          type: "object",
          objectFields: linkFields,
        },
      },
      defaultProps: {
        eyebrow: "Ready when you are",
        heading: "Launch a cleaner page building workflow",
        description:
          "Give your team a focused library of sections that are easy to edit and hard to break.",
        primaryCta: { label: "Get started", url: "#" },
        secondaryCta: { label: "Book a demo", url: "#" },
      },
      render: CtaBlock,
    },

    PricingBlock: {
      fields: {
        ...sectionIntroFields,
        icon: {
          type: "custom",
          render: (props) => <IconField {...props} label="List Icon" />,
        },
        plans: {
          type: "array",
          arrayFields: {
            name: { type: "text" },
            price: { type: "text" },
            description: { type: "textarea" },
            ctaLabel: { type: "text" },
            ctaUrl: { type: "text" },
            featured: {
              type: "radio",
              options: [
                { label: "No", value: false },
                { label: "Yes", value: true },
              ],
            },
            features: {
              type: "array",
              arrayFields: {
                label: { type: "text" },
              },
              defaultItemProps: { label: "Included feature" },
            },
          },
          defaultItemProps: {
            name: "Starter",
            price: "$19",
            description: "A simple plan for small teams.",
            ctaLabel: "Choose plan",
            ctaUrl: "#",
            featured: false,
            features: [
              { label: "Reusable sections" },
              { label: "Draft previews" },
            ],
          },
          min: 1,
          max: 4,
        },
      },
      defaultProps: {
        eyebrow: "Pricing",
        heading: "Plans that scale with your publishing needs",
        description: "Use this section for SaaS pricing or service packages.",
        icon: "Check",
        plans: [
          {
            name: "Starter",
            price: "$19",
            description: "For small teams getting pages live.",
            ctaLabel: "Start now",
            ctaUrl: "#",
            featured: false,
            features: [{ label: "10 pages" }, { label: "Basic sections" }],
          },
          {
            name: "Growth",
            price: "$49",
            description: "For teams building repeatable page systems.",
            ctaLabel: "Choose Growth",
            ctaUrl: "#",
            featured: true,
            features: [{ label: "Unlimited pages" }, { label: "Preview links" }],
          },
          {
            name: "Scale",
            price: "$99",
            description: "For advanced teams and larger sites.",
            ctaLabel: "Contact sales",
            ctaUrl: "#",
            featured: false,
            features: [{ label: "Priority support" }, { label: "Custom blocks" }],
          },
        ],
      },
      render: PricingBlock,
    },


    ContactBlock: {
      fields: {
        ...sectionIntroFields,
        email: { type: "text" },
        location: { type: "text" },
        buttonLabel: { type: "text" },
      },
      defaultProps: {
        eyebrow: "Contact",
        heading: "Tell us what you want to build",
        description:
          "A clean contact section for lead capture, sales inquiries, or support pages.",
        email: "hello@example.com",
        location: "San Francisco, CA",
        buttonLabel: "Send message",
      },
      render: ContactBlock,
    },

    TestimonialsBlock: {
      fields: {
        ...sectionIntroFields,
        icon: {
          type: "custom",
          render: (props) => <IconField {...props} label="Rating Icon" />,
        },
        testimonials: {
          type: "array",
          arrayFields: {
            quote: { type: "textarea" },
            name: { type: "text" },
            role: { type: "text" },
          },
          defaultItemProps: {
            quote: "This made our page workflow feel much more organized.",
            name: "Alex Morgan",
            role: "Marketing Lead",
          },
        },
      },
      defaultProps: {
        eyebrow: "Testimonials",
        heading: "Teams are building faster",
        description: "A carousel section for customer quotes and social proof.",
        icon: "Star",
        testimonials: [
          {
            quote: "We can ship polished pages without asking engineering for every edit.",
            name: "Maya Chen",
            role: "Growth Lead",
          },
          {
            quote: "The reusable sections keep our site consistent across campaigns.",
            name: "Jordan Lee",
            role: "Product Marketer",
          },
          {
            quote: "Previewing drafts on a real page changed how we review content.",
            name: "Sam Rivera",
            role: "Content Strategist",
          },
        ],
      },
      render: TestimonialsBlock,
    },

    StatisticsBlock: {
      fields: {
        ...sectionIntroFields,
        variant: {
          type: "select",
          options: [
            { label: "Cards", value: "cards" },
            { label: "Minimal", value: "minimal" },
            { label: "Split", value: "split" },
          ],
        },
        icon: {
          type: "custom",
          render: (props) => <IconField {...props} label="Icon" />,
        },
        stats: {
          type: "array",
          arrayFields: {
            value: { type: "text" },
            label: { type: "text" },
            description: { type: "textarea" },
            icon: {
              type: "custom",
              render: (props) => <IconField {...props} label="Icon" />,
            },
          },
          defaultItemProps: { value: "99%", label: "Metric label", description: "Supporting details about this metric.", icon: "BarChart3" },
          min: 1,
          max: 6,
        },
      },
      defaultProps: {
        eyebrow: "Stats",
        heading: "Numbers worth highlighting",
        description: "Show traction, reliability, adoption, or performance metrics.",
        icon: "BarChart3",
        variant: "cards",
        stats: [
          { value: "42%", label: "Faster page launches", description: "Our platform accelerates your time to market.", icon: "Rocket" },
          { value: "12k", label: "Sections reused", description: "Join a growing community of builders.", icon: "Layout" },
          { value: "98%", label: "Preview approval rate", description: "Teams love the live editing experience.", icon: "CheckCircle" },
          { value: "4.9", label: "Average team rating", description: "High satisfaction across all industries.", icon: "Star" },
        ],
      },
      render: StatisticsBlock,
    },

    BrandsBlock: {
      fields: {
        ...sectionIntroFields,
        brands: {
          type: "array",
          arrayFields: {
            name: { type: "text" },
          },
          defaultItemProps: { name: "Brand" },
          min: 1,
          max: 10,
        },
      },
      defaultProps: {
        eyebrow: "Brands",
        heading: "Trusted by teams with good taste",
        description: "A simple logo wall using editable brand names.",
        brands: [
          { name: "Northstar" },
          { name: "Brightlane" },
          { name: "Orbit" },
          { name: "Signal" },
          { name: "Craft" },
        ],
      },
      render: BrandsBlock,
    },

    BlogsBlock: {
      fields: {
        ...sectionIntroFields,
        posts: {
          type: "array",
          arrayFields: {
            title: { type: "text" },
            excerpt: { type: "textarea" },
            category: { type: "text" },
            date: { type: "text" },
            link: { type: "text" },
          },
          defaultItemProps: {
            title: "Post title",
            excerpt: "A short summary of the post.",
            category: "Guide",
            date: "May 30",
            link: "#",
          },
          min: 1,
          max: 6,
        },
      },
      defaultProps: {
        eyebrow: "Blog",
        heading: "Latest writing",
        description: "Use this block for guides, updates, and editorial content.",
        posts: [
          {
            title: "Designing reusable page sections",
            excerpt: "How to think about repeatable layouts without making pages dull.",
            category: "Guide",
            date: "May 30",
            link: "#",
          },
          {
            title: "Preview workflows for content teams",
            excerpt: "A practical review flow before pages go live.",
            category: "Workflow",
            date: "May 28",
            link: "#",
          },
          {
            title: "Keeping Tailwind blocks editable",
            excerpt: "Where utility classes end and dynamic Puck values begin.",
            category: "Build",
            date: "May 24",
            link: "#",
          },
        ],
      },
      render: BlogsBlock,
    },

    HeaderBlock: {
      fields: {
        logo: { type: "text" },
        logoType: {
          type: "select",
          options: [
            { label: "Text", value: "text" },
            { label: "Image", value: "image" },
          ],
        },
        logoImage: {
          type: "custom",
          render: (props: {
            value?: string;
            onChange: (value: string) => void;
          }) => (
            <ExternalImageField
              value={props.value ?? ""}
              onChange={props.onChange}
              label="Logo Image"
            />
          ),
        },
        variant: {
          type: "select",
          options: [
            { label: "Centered Logo", value: "centered" },
            { label: "Logo Left", value: "logo-left" },
            { label: "Logo Right", value: "logo-right" },
          ],
        },
        navItems: {
          type: "array",
          arrayFields: {
            label: { type: "text" },
            url: { type: "text" },
            children: {
              type: "object",
              objectFields: {
                heading: { type: "text" },
                description: { type: "textarea" },
                cta: {
                  type: "object",
                  objectFields: {
                    label: { type: "text" },
                    url: { type: "text" },
                  },
                },
                links: {
                  type: "array",
                  arrayFields: {
                    label: { type: "text" },
                    url: { type: "text" },
                  },
                  defaultItemProps: { label: "Link", url: "#" },
                },
              },
            },
          },
          defaultItemProps: {
            label: "Link",
            url: "#",
            children: {
              heading: "",
              description: "",
              cta: { label: "", url: "#" },
              links: [],
            },
          },
        },
        ctaPrimary: {
          type: "object",
          objectFields: {
            label: { type: "text" },
            url: { type: "text" },
          },
        },
        ctaSecondary: {
          type: "object",
          objectFields: {
            label: { type: "text" },
            url: { type: "text" },
          },
        },
        ctaTertiary: {
          type: "object",
          objectFields: {
            label: { type: "text" },
            url: { type: "text" },
          },
        },
      },
      defaultProps: {
        logo: "MyBrand",
        logoType: "text",
        logoImage: "",
        navItems: [
          { label: "Home", url: "#", children: { heading: "", description: "", cta: { label: "", url: "#" }, links: [] } },
          {
            label: "Product",
            url: "#",
            children: {
              heading: "Product",
              description: "Managing a small business today is already tough.",
              cta: { label: "Book a call today", url: "#" },
              links: [
                { label: "Reports", url: "#" },
                { label: "Statistics", url: "#" },
                { label: "Dashboards", url: "#" },
                { label: "Recordings", url: "#" },
              ],
            },
          },
          {
            label: "Company",
            url: "#",
            children: {
              heading: "",
              description: "",
              cta: { label: "", url: "#" },
              links: [
                { label: "About us", url: "#" },
                { label: "Blog", url: "#" },
                { label: "Careers", url: "#" },
              ],
            },
          },
        ],
        ctaPrimary: { label: "Get started", url: "#" },
        ctaSecondary: { label: "Sign in", url: "#" },
        ctaTertiary: { label: "Book a demo", url: "#" },
        variant: "centered",
      },
      render: HeaderBlock,
    },

    FooterBlock: {
      fields: {
        logo: { type: "text" },
        tagline: { type: "text" },
        address: { type: "textarea" },
        copyright: { type: "text" },
        legalLinks: {
          type: "array",
          arrayFields: {
            label: { type: "text" },
            url: { type: "text" },
          },
          defaultItemProps: { label: "Terms of service", url: "#" },
        },
        columns: {
          type: "array",
          arrayFields: {
            heading: { type: "text" },
            links: {
              type: "array",
              arrayFields: {
                label: { type: "text" },
                url: { type: "text" },
              },
              defaultItemProps: { label: "Link", url: "#" },
            },
          },
          defaultItemProps: {
            heading: "Column",
            links: [{ label: "Link", url: "#" }],
          },
        },
      },
      defaultProps: {
        logo: "Puck Visual Editor",
        tagline: "Build visually. Launch instantly.",
        address: "1 Puck Avenue\nVisual Park\nCA 123123",
        copyright: "© 2024 Puck, Inc.",
        legalLinks: [
          { label: "Terms of service", url: "#" },
          { label: "Privacy Policy", url: "#" },
        ],
        columns: [
          { heading: "Home", links: [] },
          {
            heading: "Product",
            links: [
              { label: "Reports", url: "#" },
              { label: "Statistics", url: "#" },
              { label: "Dashboards", url: "#" },
              { label: "Recordings", url: "#" },
            ],
          },
          {
            heading: "Company",
            links: [
              { label: "About us", url: "#" },
              { label: "Fundraising", url: "#" },
              { label: "Investors", url: "#" },
              { label: "Contact us", url: "#" },
            ],
          },
        ],
      },
      render: FooterBlock,
    },

    ContainerBlock: {
      fields: {
        maxWidth: {
          type: "select",
          options: [
            { label: "Small (640px)", value: "sm" },
            { label: "Medium (768px)", value: "md" },
            { label: "Large (1024px)", value: "lg" },
            { label: "XL (1280px)", value: "xl" },
            { label: "2XL (1536px)", value: "2xl" },
            { label: "Full width", value: "full" },
          ],
        },
        paddingX: {
          type: "custom",
          render: (props) => (
            <SliderField
              {...props}
              label="Padding X (left and right)"
              min={0}
              max={128}
              step={4}
            />
          ),
        },
        paddingY: {
          type: "custom",
          render: (props) => (
            <SliderField
              {...props}
              label="Padding Y (top and bottom)"
              min={0}
              max={128}
              step={4}
            />
          ),
        },
        background: {
          type: "custom",
          render: (props) => <ColorField {...props} label="Background Color" />,
        },
      },
      defaultProps: {
        maxWidth: "xl",
        paddingX: 24,
        paddingY: 0,
        background: "transparent",
      },
      render: ContainerBlock,
    },

    ParagraphBlock: {
      fields: {
        text: { type: "textarea" },
        size: {
          type: "select",
          options: [
            { label: "Small", value: "sm" },
            { label: "Base", value: "base" },
            { label: "Large", value: "lg" },
            { label: "XL", value: "xl" },
          ],
        },
      },
      defaultProps: {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        size: "base",
      },
      render: ParagraphBlock,
    },

    ButtonBlock: {
      fields: {
        label: { type: "text" },
        href: { type: "text" },
        variant: {
          type: "select",
          options: [
            { label: "Primary", value: "primary" },
            { label: "Secondary", value: "secondary" },
            { label: "Outline", value: "outline" },
          ],
        },
        size: {
          type: "radio",
          options: [
            { label: "Small", value: "sm" },
            { label: "Medium", value: "md" },
            { label: "Large", value: "lg" },
          ],
        },
      },
      defaultProps: {
        label: "Click me",
        href: "#",
        variant: "primary",
        size: "md",
      },
      render: ButtonBlock,
    },

    CardBlock: {
      fields: {
        title: { type: "text" },
        description: { type: "textarea" },
        imageUrl: { type: "text" },
        imageAlt: { type: "text" },
        link: { type: "text" },
      },
      defaultProps: {
        title: "Card Title",
        description: "Card description goes here.",
        imageUrl: "https://placehold.co/400x200",
        imageAlt: "Card image",
        link: "#",
      },
      render: CardBlock,
    },

    ColumnsBlock: {
      fields: {
        columns: {
          type: "custom",
          render: (props) => (
            <SliderField {...props} label="Columns" min={1} max={4} step={1} />
          ),
        },
        gap: {
          type: "custom",
          render: (props) => (
            <SliderField {...props} label="Gap" min={0} max={64} step={4} />
          ),
        },
      },
      defaultProps: { columns: 2, gap: 16 },
      render: ColumnsBlock,
    },

    SpacerBlock: {
      fields: {
        height: {
          type: "custom",
          render: (props) => (
            <SliderField {...props} label="Height" min={0} max={400} step={8} />
          ),
        },
      },
      defaultProps: { height: 32 },
      render: SpacerBlock,
    },
  },
};
