import { Safari } from "@/components/animated-ui/Safari";
import { AnimatedShinyText } from "@/components/animated-ui/AnimatedShinyText";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <div>
      <div
        className={cn(
          "group w-fit border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800",
        )}
      >
        <AnimatedShinyText className="inline-flex items-center text-sm justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
          <span>Introducing all-in-one resort management</span>
          <ArrowRightIcon className="ml-1.5 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
        </AnimatedShinyText>
      </div>
      <h1 className="mb-6 mt-10 leading-18 text-6xl font-bold">
        One platform to power your <br /> entire resort operation.
      </h1>
      <p className="mb-10 leading-7 max-w-3xl text-muted-foreground">
        Modern resort management should not be scattered across different tools.
        ResortCloud unifies reservations, administrative workflows, scheduling,
        and operational management in one centralized application for resort
        owners.
      </p>
      <div className="flex items-center gap-3">
        <Button size="lg" className="h-11 px-4">
          Try ResortCloud for free <ArrowRightIcon className="size-4" />
        </Button>
        <Button size="lg" className="h-11 px-4" variant="outline">
          Learn more
        </Button>
      </div>
      <div className="w-full mt-20">
        <Safari imageSrc="/thumbnails/hero.png" url="www.resortcloud.com" />
      </div>
    </div>
  );
}
