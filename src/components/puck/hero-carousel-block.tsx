/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export type HeroCarouselBlockProps = {
  slides: {
    heading: string;
    description: string;
    image: string;
    badge?: string;
    primaryCta?: { label: string; url: string };
    secondaryCta?: { label: string; url: string };
  }[];
  textColor: string;
  backgroundOverlayOpacity: number;
  height: "small" | "medium" | "large" | "full";
};

export function HeroCarouselBlock({
  slides,
  textColor,
  backgroundOverlayOpacity,
  height = "medium",
}: HeroCarouselBlockProps) {
  const overlayOpacity =
    Math.min(Math.max(backgroundOverlayOpacity ?? 40, 0), 90) / 100;

  const heightClasses = {
    small: "h-[400px]",
    medium: "h-[600px]",
    large: "h-[800px]",
    full: "h-screen",
  };

  const textStyle = {
    color: textColor || "#ffffff",
  } as CSSProperties;

  return (
    <section className="relative overflow-hidden">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={`slide-${index}-${slide.heading}`}>
              <div
                className={`relative flex items-center justify-center bg-cover bg-center px-6 py-16 md:px-8 ${heightClasses[height]}`}
                style={{ backgroundImage: `url("${slide.image}")` }}
              >
                <div
                  className="absolute inset-0 bg-black"
                  style={{ opacity: overlayOpacity }}
                />
                
                <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
                  {slide.badge && (
                    <Badge
                      variant="outline"
                      className="mb-6 bg-white/10 backdrop-blur-sm border-white/20 text-white"
                      style={textStyle}
                    >
                      {slide.badge}
                    </Badge>
                  )}

                  <h1
                    className="mb-4 text-4xl font-bold leading-tight md:text-6xl"
                    style={textStyle}
                  >
                    {slide.heading}
                  </h1>

                  <p 
                    className="mb-10 max-w-2xl text-lg md:text-xl opacity-90" 
                    style={textStyle}
                  >
                    {slide.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-4">
                    {slide.secondaryCta?.label && (
                      <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="bg-transparent border-white text-white hover:bg-white hover:text-black transition-colors"
                      >
                        <a href={slide.secondaryCta.url || "#"}>
                          {slide.secondaryCta.label}
                        </a>
                      </Button>
                    )}
                    {slide.primaryCta?.label && (
                      <Button asChild size="lg" className="bg-white text-black hover:bg-gray-200 border-none transition-colors">
                        <a href={slide.primaryCta.url || "#"}>
                          {slide.primaryCta.label}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute bottom-8 right-12 flex gap-2">
          <CarouselPrevious className="static translate-y-0 h-12 w-12 border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white backdrop-blur-md" />
          <CarouselNext className="static translate-y-0 h-12 w-12 border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white backdrop-blur-md" />
        </div>
      </Carousel>
    </section>
  );
}
