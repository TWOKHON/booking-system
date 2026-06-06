/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from "react";
import { ArrowRight, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type HeroBlockProps = {
  badge: {
    label: string;
    url: string;
  };
  heading: string;
  description: string;
  adjectives: { label: string }[];
  primaryCta: {
    label: string;
    url: string;
  };
  secondaryCta: {
    label: string;
    url: string;
  };
  images: {
    src: string;
    alt: string;
  }[];
  backgroundColor: string;
  textColor: string;
  backgroundImageUrl: string;
  backgroundOverlayOpacity: number;
};

export function HeroBlock({
  badge,
  heading,
  description,
  adjectives,
  primaryCta,
  secondaryCta,
  images,
  backgroundColor,
  textColor,
  backgroundImageUrl,
  backgroundOverlayOpacity,
}: HeroBlockProps) {
  const hasBackgroundImage = Boolean(backgroundImageUrl);
  const overlayOpacity =
    Math.min(Math.max(backgroundOverlayOpacity ?? 20, 0), 90) / 100;
  const sectionStyle = {
    backgroundColor: backgroundColor || "#dce8f5",
    backgroundImage: hasBackgroundImage
      ? `url("${backgroundImageUrl}")`
      : undefined,
  } as CSSProperties;

  const textStyle = {
    color: textColor || "inherit",
  } as CSSProperties;

  return (
    <section
      className="relative overflow-hidden bg-cover bg-center px-6 py-16 md:px-8"
      style={sectionStyle}
    >
      {hasBackgroundImage && (
        <div
          className="absolute inset-0 bg-background"
          style={{ opacity: overlayOpacity }}
        />
      )}
      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-12 md:flex-row">
        <div className="min-w-0 flex-1">
          {badge?.label && (
            <Badge
              asChild
              variant="outline"
              className="mb-6 bg-background/70"
              style={textStyle}
            >
              <a href={badge.url || "#"}>
                {badge.label}
                <ArrowRight />
              </a>
            </Badge>
          )}

          <h1
            className="mb-4 text-4xl font-bold leading-tight md:text-5xl"
            style={textStyle}
          >
            {heading}
            {adjectives && adjectives.length > 0 && (
              <span className="text-primary">
                {" "}
                {adjectives.map((a) => a.label).join(", ")}
              </span>
            )}
          </h1>

          <p className="mb-8 max-w-md text-lg opacity-90" style={textStyle}>
            {description}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {secondaryCta?.label && (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-foreground"
              >
                <a href={secondaryCta.url || "#"}>{secondaryCta.label}</a>
              </Button>
            )}
            {primaryCta?.label && (
              <Button asChild size="lg" className="text-primary-foreground">
                <a href={primaryCta.url || "#"}>
                  {primaryCta.label}
                  <ArrowRight />
                </a>
              </Button>
            )}
          </div>
        </div>

        {images && images.length > 0 && (
          <div className="grid w-full max-w-[23.75rem] shrink-0 grid-cols-2 gap-3 md:w-[23.75rem]">
            <div className="row-span-2 aspect-[3/4] overflow-hidden rounded-xl bg-muted">
              {images[0]?.src ? (
                <img
                  src={images[0].src}
                  alt={images[0].alt || ""}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                  Placeholder Image
                </div>
              )}
            </div>
            {[images[1], images[2]].map((img, i) => (
              <div
                key={`hero-img-${i}`}
                className="aspect-square overflow-hidden rounded-xl bg-muted"
              >
                {img?.src ? (
                  <img
                    src={img.src}
                    alt={img.alt || ""}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                    Placeholder Image
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
