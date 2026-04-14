"use client";

import {
  BellIcon,
  CalendarIcon,
  FileTextIcon,
  Share2Icon,
} from "@radix-ui/react-icons";
import { Marquee } from "@/components/animated-ui/Marquee";
import { AnimatedListData } from "@/components/custom/AnimatedListData";
import { Calendar } from "@/components/ui/calendar";
import { AnimatedBeamData } from "@/components/custom/AnimatedBeamData";
import { BentoCard, BentoGrid } from "@/components/animated-ui/BentoGrid";
import { BENTO_FEATURES_DATA } from "@/constants";
import { cn } from "@/lib/utils";

export function FeatureSection() {
  const bento_features = [
    {
      Icon: FileTextIcon,
      name: "All-in-one management",
      description:
        "Manage reservations and operations in one unified platform.",
      href: "#",
      cta: "Learn more",
      className: "col-span-3 lg:col-span-1",
      background: (
        <Marquee
          pauseOnHover
          className="absolute top-10 mask-[linear-gradient(to_top,transparent_40%,#000_100%)] [--duration:20s]"
        >
          {BENTO_FEATURES_DATA.map((f, idx) => (
            <figure
              key={idx}
              className={cn(
                "relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4",
                "border-gray-950/10 bg-gray-950/1 hover:bg-gray-950/5",
                "dark:border-gray-50/10 dark:bg-gray-50/10 dark:hover:bg-gray-50/15",
                "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none",
              )}
            >
              <div className="flex flex-row items-center gap-2">
                <div className="flex flex-col">
                  <figcaption className="text-sm font-medium dark:text-white">
                    {f.name}
                  </figcaption>
                </div>
              </div>
              <blockquote className="mt-2 text-xs">{f.body}</blockquote>
            </figure>
          ))}
        </Marquee>
      ),
    },
    {
      Icon: BellIcon,
      name: "Real-time updates",
      description:
        "Stay informed with instant updates on bookings, guest activity, and operational changes across your resort.",
      href: "#",
      cta: "Learn more",
      className: "col-span-3 lg:col-span-2",
      background: (
        <AnimatedListData className="absolute top-4 right-2 h-75 w-full scale-75 border-none mask-[linear-gradient(to_top,transparent_10%,#000_100%)] transition-all duration-300 ease-out group-hover:scale-90" />
      ),
    },
    {
      Icon: Share2Icon,
      name: "Connected workflows",
      description:
        "Seamlessly connect reservations, staff tasks, payments, and reporting into one smooth workflow.",
      href: "#",
      cta: "Learn more",
      className: "col-span-3 lg:col-span-2",
      background: (
        <AnimatedBeamData className="absolute top-4 right-2 h-75 border-none mask-[linear-gradient(to_top,transparent_10%,#000_100%)] transition-all duration-300 ease-out group-hover:scale-105" />
      ),
    },
    {
      Icon: CalendarIcon,
      name: "Smart scheduling",
      description:
        "Easily manage resort availability with an intuitive calendar system.",
      className: "col-span-3 lg:col-span-1",
      href: "#",
      cta: "Learn more",
      background: (
        <Calendar
          mode="single"
          selected={new Date(2026, 3, 1)}
          className="absolute top-10 right-0 origin-top scale-75 rounded-md border mask-[linear-gradient(to_top,transparent_40%,#000_100%)] transition-all duration-300 ease-out group-hover:scale-90"
        />
      ),
    },
  ];
  return (
    <section className="pb-40">
      <h3 className="text-3xl font-bold">Complete resort platform features</h3>
      <p className="text-muted-foreground mt-2">
        From inquiries to operations, handled in one system
      </p>
      <BentoGrid className="mt-10">
        {bento_features.map((feature, idx) => (
          <BentoCard key={idx} {...feature} />
        ))}
      </BentoGrid>
    </section>
  );
}
