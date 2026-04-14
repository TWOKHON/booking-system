import { ParallaxHeroImages } from "@/components/animated-ui/ParallaxImages";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  const images = [
    "/thumbnails/hero.png",
    "/thumbnails/asset.png",
    "/thumbnails/finance.png",
    "/thumbnails/inquiries.png",
    "/thumbnails/staff.png",
    "/thumbnails/help.png",
  ];
  return (
    <section className="pt-15 relative overflow-hidden pb-40 max-w-7xl px-6 mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Left: Text content */}
        <div>
          <h2 className="text-5xl font-bold max-w-lg leading-tight">
            Start managing your resort smarter today.
          </h2>
          <p className="text-muted-foreground mt-6 max-w-lg text-lg">
            Streamline reservations, track finances, and grow your business —
            all from one platform built exclusively for resort operators.
          </p>
          <Button className="mt-8 h-11 px-4">
            Start Free Trial <ArrowRight className="size-4" />
          </Button>
        </div>

        <div className="relative hidden md:block h-150">
          <ParallaxHeroImages images={images} variant="edge-focus" />
        </div>
      </div>
    </section>
  );
}
