"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  Check,
  Mail,
  MapPin,
  MessageSquare,
  Sparkles,
  Star,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Link = {
  label: string;
  url: string;
};

type SectionIntroProps = {
  eyebrow?: string;
  heading: string;
  description?: string;
  align?: "left" | "center";
};

function getLucideIcon(name: string | undefined, fallback: LucideIcon): LucideIcon {
  if (!name) return fallback;

  const candidate = LucideIcons[name as keyof typeof LucideIcons];

  return typeof candidate === "function" ? (candidate as LucideIcon) : fallback;
}

function SectionIntro({
  eyebrow,
  heading,
  description,
  align = "center",
}: SectionIntroProps) {
  return (
    <div
      className={cn(
        "mb-10 max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left"
      )}
    >
      {eyebrow && (
        <Badge variant="outline" className="mb-3">
          {eyebrow}
        </Badge>
      )}
      <h2 className="text-3xl font-semibold tracking-normal text-foreground md:text-4xl">
        {heading}
      </h2>
      {description && (
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}

function SectionShell({ children }: { children: ReactNode }) {
  return <section className="px-6 py-16 md:px-8">{children}</section>;
}

export type CardsBlockProps = SectionIntroProps & {
  items: {
    title: string;
    description: string;
    imageUrl: string;
    price?: string;
    badge?: string;
  }[];
  columns?: "2" | "3" | "4";
};

export function CardsBlock({
  eyebrow,
  heading,
  description,
  items,
  columns = "3",
}: CardsBlockProps) {
  return (
    <SectionShell>
      <div className="mx-auto max-w-6xl">
        <SectionIntro eyebrow={eyebrow} heading={heading} description={description} />
        <div
          className={cn(
            "grid gap-6",
            columns === "2" && "sm:grid-cols-2",
            columns === "3" && "sm:grid-cols-2 lg:grid-cols-3",
            columns === "4" && "sm:grid-cols-2 lg:grid-cols-4"
          )}
        >
          {items?.map((item, index) => (
            <Card key={`card-${index}-${item.title}`} className="flex flex-col overflow-hidden transition-all hover:shadow-md py-0!">
              <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                )}
              </div>
              <CardHeader className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                  {item.badge && (
                    <Badge variant="secondary" className="whitespace-nowrap">
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <CardDescription className="line-clamp-2 mt-2">
                  {item.description}
                </CardDescription>
              </CardHeader>
              {item.price && (
                <CardContent className="mt-auto border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-primary">{item.price}</span>
                    <Button variant="ghost" size="sm" className="gap-1 px-0 hover:bg-transparent hover:text-primary">
                      Details
                      <ArrowRight className="size-4" />
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

export type BentoBlockProps = SectionIntroProps & {
  items: {
    title: string;
    description: string;
    highlight: string;
    imageUrl?: string;
  }[];
};

export function BentoBlock({
  eyebrow,
  heading,
  description,
  items,
}: BentoBlockProps) {
  return (
    <SectionShell>
      <div className="mx-auto max-w-6xl">
        <SectionIntro eyebrow={eyebrow} heading={heading} description={description} />
        <div className="grid gap-4 md:grid-cols-3">
          {items?.map((item, index) => (
            <Card
              key={`bento-${index}-${item.title}`}
              className={cn(
                "min-h-52 justify-between overflow-hidden",
                index === 0 && "md:col-span-2",
                index === 3 && "md:col-span-2"
              )}
            >
              <div className="flex flex-1 flex-col justify-between">
                <CardHeader>
                  <Badge variant="secondary" className="w-fit">
                    {item.highlight}
                  </Badge>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{item.description}</CardDescription>
                </CardContent>
              </div>
              {item.imageUrl && (
                <div className="relative h-48 w-full overflow-hidden border-t md:h-full md:w-1/3 md:border-t-0 md:border-l">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

export type ArticleCardBlockProps = {
  category: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  imageUrl: string;
  imageAlt: string;
  link: Link;
};

export function ArticleCardBlock({
  category,
  title,
  excerpt,
  author,
  date,
  imageUrl,
  imageAlt,
  link,
}: ArticleCardBlockProps) {
  return (
    <SectionShell>
      <div className="mx-auto max-w-3xl">
        <a href={link?.url || "#"} className="block outline-none">
          <Card className="overflow-hidden py-0 transition-shadow hover:shadow-md focus-within:ring-3 focus-within:ring-ring/50 md:grid md:grid-cols-[0.9fr_1.1fr]">
            {imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt={imageAlt || ""}
                className="h-full min-h-64 w-full object-cover"
              />
            )}
            <div className="flex flex-col justify-between p-6">
              <div>
                {category && (
                  <Badge variant="outline" className="mb-4">
                    {category}
                  </Badge>
                )}
                <h2 className="text-2xl font-semibold leading-tight text-foreground">
                  {title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {excerpt}
                </p>
              </div>
              <div className="mt-8 flex items-center justify-between text-sm text-muted-foreground">
                <span>{author}</span>
                <span>{date}</span>
              </div>
            </div>
          </Card>
        </a>
      </div>
    </SectionShell>
  );
}

export type FeatureCardsBlockProps = SectionIntroProps & {
  icon?: string;
  features: {
    title: string;
    description: string;
  }[];
};

export function FeatureCardsBlock({
  eyebrow,
  heading,
  description,
  features,
  icon = "Sparkles",
}: FeatureCardsBlockProps) {
  const Icon = getLucideIcon(icon, Sparkles);

  return (
    <SectionShell>
      <div className="mx-auto max-w-6xl">
        <SectionIntro eyebrow={eyebrow} heading={heading} description={description} />
        <div className="grid gap-4 md:grid-cols-3">
          {features?.map((feature, index) => (
            <Card key={`feature-${index}-${feature.title}`}>
              <CardHeader>
                <div className="mb-2 flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Icon className="size-4" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

export type FaqBlockProps = SectionIntroProps & {
  questions: {
    question: string;
    answer: string;
  }[];
};

export function FaqBlock({ eyebrow, heading, description, questions }: FaqBlockProps) {
  return (
    <SectionShell>
      <div className="mx-auto max-w-3xl">
        <SectionIntro eyebrow={eyebrow} heading={heading} description={description} />
        <Accordion type="single" collapsible className="rounded-xl border px-4">
          {questions?.map((item, index) => (
            <AccordionItem key={`faq-${index}`} value={`item-${index}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </SectionShell>
  );
}

export type CtaBlockProps = {
  eyebrow: string;
  heading: string;
  description: string;
  primaryCta: Link;
  secondaryCta: Link;
};

export function CtaBlock({
  eyebrow,
  heading,
  description,
  primaryCta,
  secondaryCta,
}: CtaBlockProps) {
  return (
    <SectionShell>
      <div className="mx-auto max-w-5xl rounded-2xl border bg-foreground px-6 py-14 text-center text-background md:px-12">
        {eyebrow && (
          <Badge variant="secondary" className="mb-4">
            {eyebrow}
          </Badge>
        )}
        <h2 className="mx-auto max-w-3xl text-3xl font-semibold md:text-4xl">
          {heading}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-background/70 md:text-base">
          {description}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {primaryCta?.label && (
            <Button asChild variant="secondary">
              <a href={primaryCta.url || "#"}>
                {primaryCta.label}
                <ArrowRight />
              </a>
            </Button>
          )}
          {secondaryCta?.label && (
            <Button asChild variant="outline" className="bg-transparent text-background">
              <a href={secondaryCta.url || "#"}>{secondaryCta.label}</a>
            </Button>
          )}
        </div>
      </div>
    </SectionShell>
  );
}

export type PricingBlockProps = SectionIntroProps & {
  icon?: string;
  plans: {
    name: string;
    price: string;
    description: string;
    ctaLabel: string;
    ctaUrl: string;
    featured: boolean;
    features: { label: string }[];
  }[];
};

export function PricingBlock({
  eyebrow,
  heading,
  description,
  plans,
  icon = "Check",
}: PricingBlockProps) {
  const Icon = getLucideIcon(icon, Check);

  return (
    <SectionShell>
      <div className="mx-auto max-w-6xl">
        <SectionIntro eyebrow={eyebrow} heading={heading} description={description} />
        <div className="grid gap-4 md:grid-cols-3">
          {plans?.map((plan, index) => (
            <Card
              key={`plan-${index}-${plan.name}`}
              className={cn(plan.featured && "border-primary shadow-md")}
            >
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.featured && <Badge>Popular</Badge>}
                </div>
                <div className="mt-4 text-4xl font-semibold">{plan.price}</div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" variant={plan.featured ? "default" : "outline"}>
                  <a href={plan.ctaUrl || "#"}>{plan.ctaLabel}</a>
                </Button>
                <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                  {plan.features?.map((feature, featureIndex) => (
                    <li key={`feature-${index}-${featureIndex}`} className="flex gap-2">
                      <Icon className="mt-0.5 size-4 text-foreground" />
                      <span>{feature.label}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}


export type ContactBlockProps = SectionIntroProps & {
  email: string;
  location: string;
  buttonLabel: string;
};

export function ContactBlock({
  eyebrow,
  heading,
  description,
  email,
  location,
  buttonLabel,
}: ContactBlockProps) {
  return (
    <SectionShell>
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionIntro
            eyebrow={eyebrow}
            heading={heading}
            description={description}
            align="left"
          />
          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Mail className="size-4 text-foreground" />
              {email}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="size-4 text-foreground" />
              {location}
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="grid gap-4 p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input placeholder="First name" />
              <Input placeholder="Last name" />
            </div>
            <Input placeholder="Email" type="email" />
            <Textarea placeholder="Tell us what you are building" rows={5} />
            <Button type="button" className="w-fit">
              {buttonLabel}
            </Button>
          </CardContent>
        </Card>
      </div>
    </SectionShell>
  );
}

export type TestimonialsBlockProps = SectionIntroProps & {
  icon?: string;
  testimonials: {
    quote: string;
    name: string;
    role: string;
  }[];
};

export function TestimonialsBlock({
  eyebrow,
  heading,
  description,
  testimonials,
  icon = "Star",
}: TestimonialsBlockProps) {
  const Icon = getLucideIcon(icon, Star);

  return (
    <SectionShell>
      <div className="mx-auto max-w-5xl">
        <SectionIntro eyebrow={eyebrow} heading={heading} description={description} />
        <Carousel opts={{ align: "start", loop: true }} className="mx-auto max-w-4xl">
          <CarouselContent>
            {testimonials?.map((testimonial, index) => (
              <CarouselItem key={`testimonial-${index}`} className="md:basis-1/2">
                <Card className="h-full">
                  <CardContent className="flex h-full flex-col justify-between gap-8 p-6">
                    <div className="flex gap-1 text-primary">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <Icon key={`star-${index}-${starIndex}`} className="size-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-base leading-relaxed text-foreground">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-4 md:-left-12" />
          <CarouselNext className="-right-4 md:-right-12" />
        </Carousel>
      </div>
    </SectionShell>
  );
}

export type StatisticsBlockProps = SectionIntroProps & {
  icon?: string;
  stats: {
    value: string;
    label: string;
    description?: string;
    icon?: string;
  }[];
  variant?: "cards" | "minimal" | "split";
};

export function StatisticsBlock({
  eyebrow,
  heading,
  description,
  stats,
  icon = "BarChart3",
  variant = "cards",
}: StatisticsBlockProps) {
  const DefaultIcon = getLucideIcon(icon, BarChart3);

  if (variant === "split") {
    return (
      <SectionShell>
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionIntro eyebrow={eyebrow} heading={heading} description={description} align="left" />
            </div>
            <div className="grid gap-8 sm:grid-cols-2">
              {stats?.map((stat, index) => {
                const ItemIcon = getLucideIcon(stat.icon, DefaultIcon);
                
                return (
                  <div key={`stat-${index}-${stat.label}`} className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <ItemIcon className="size-5" />
                      </div>
                      <span className="text-3xl font-bold tracking-tight">{stat.value}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{stat.label}</p>
                      {stat.description && (
                        <p className="mt-1 text-sm text-muted-foreground">{stat.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </SectionShell>
    );
  }

  if (variant === "minimal") {
    return (
      <SectionShell>
        <div className="mx-auto max-w-6xl">
          <SectionIntro eyebrow={eyebrow} heading={heading} description={description} />
          <div className="grid gap-8 border-y py-12 sm:grid-cols-2 lg:grid-cols-4">
            {stats?.map((stat, index) => {
              const ItemIcon = stat.icon ? getLucideIcon(stat.icon, DefaultIcon) : null;

              return (
                <div key={`stat-${index}-${stat.label}`} className="text-center">
                  {ItemIcon && (
                    <div className="mb-3 flex justify-center text-primary">
                      <ItemIcon className="size-6" />
                    </div>
                  )}
                  <p className="text-4xl font-bold text-primary">{stat.value}</p>
                  <p className="mt-2 font-medium text-foreground">{stat.label}</p>
                  {stat.description && (
                    <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </SectionShell>
    );
  }

  return (
    <SectionShell>
      <div className="mx-auto max-w-6xl">
        <SectionIntro eyebrow={eyebrow} heading={heading} description={description} />
        <div className="grid gap-4 md:grid-cols-4">
          {stats?.map((stat, index) => {
            const ItemIcon = getLucideIcon(stat.icon, DefaultIcon);

            return (
              <Card key={`stat-${index}-${stat.label}`} className="border-none bg-muted/50 shadow-none transition-colors hover:bg-muted">
                <CardContent className="p-8 text-center">
                  <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-background shadow-sm">
                    <ItemIcon className="size-6 text-primary" />
                  </div>
                  <p className="text-4xl font-bold tracking-tight">{stat.value}</p>
                  <p className="mt-2 font-medium text-foreground">{stat.label}</p>
                  {stat.description && (
                    <p className="mt-1 text-sm text-muted-foreground">{stat.description}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}

export type BrandsBlockProps = SectionIntroProps & {
  brands: {
    name: string;
  }[];
};

export function BrandsBlock({ eyebrow, heading, description, brands }: BrandsBlockProps) {
  return (
    <SectionShell>
      <div className="mx-auto max-w-6xl">
        <SectionIntro eyebrow={eyebrow} heading={heading} description={description} />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {brands?.map((brand, index) => (
            <div
              key={`brand-${index}-${brand.name}`}
              className="flex h-20 items-center justify-center rounded-xl border bg-card px-4 text-center text-sm font-medium text-muted-foreground"
            >
              {brand.name}
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

export type BlogsBlockProps = SectionIntroProps & {
  posts: {
    title: string;
    excerpt: string;
    category: string;
    date: string;
    link: string;
  }[];
};

export function BlogsBlock({ eyebrow, heading, description, posts }: BlogsBlockProps) {
  return (
    <SectionShell>
      <div className="mx-auto max-w-6xl">
        <SectionIntro eyebrow={eyebrow} heading={heading} description={description} />
        <div className="grid gap-4 md:grid-cols-3">
          {posts?.map((post, index) => (
            <a key={`post-${index}-${post.title}`} href={post.link || "#"} className="block no-underline">
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <Badge variant="outline">{post.category}</Badge>
                    <span className="text-xs text-muted-foreground">{post.date}</span>
                  </div>
                  <CardTitle className="mt-4">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{post.excerpt}</CardDescription>
                  <div className="mt-6 flex items-center gap-2 text-sm font-medium">
                    Read more
                    <ArrowRight className="size-4" />
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

export type TestimonialsSimpleBlockProps = TestimonialsBlockProps;

export type MessageBlockProps = {
  title: string;
  description: string;
};

export function MessageBlock({ title, description }: MessageBlockProps) {
  return (
    <Card>
      <CardHeader>
        <MessageSquare className="mb-2 size-5 text-muted-foreground" />
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
