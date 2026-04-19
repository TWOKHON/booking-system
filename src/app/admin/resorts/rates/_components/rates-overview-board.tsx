import { RateRecord } from "./rates-data";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ArrowUpRight, Zap } from "lucide-react";

const currency = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

type RatesOverviewBoardProps = {
  data: RateRecord[];
};

export const RatesOverviewBoard = ({ data }: RatesOverviewBoardProps) => {
  const categoryStyles: Record<
    string,
    {
      shell: string;
      badge: string;
      glow: string;
    }
  > = {
    Villa: {
      shell:
        "border-emerald-200 bg-linear-to-br from-emerald-50 via-white to-emerald-100/70",
      badge: "bg-emerald-100 text-emerald-700",
      glow: "bg-emerald-300/30",
    },
    Suite: {
      shell:
        "border-blue-200 bg-linear-to-br from-blue-50 via-white to-sky-100/70",
      badge: "bg-blue-100 text-blue-700",
      glow: "bg-blue-300/30",
    },
    Casita: {
      shell:
        "border-amber-200 bg-linear-to-br from-amber-50 via-white to-orange-100/70",
      badge: "bg-amber-100 text-amber-700",
      glow: "bg-amber-300/30",
    },
    "Family Room": {
      shell:
        "border-violet-200 bg-linear-to-br from-violet-50 via-white to-fuchsia-100/70",
      badge: "bg-violet-100 text-violet-700",
      glow: "bg-violet-300/30",
    },
    "Deluxe Room": {
      shell:
        "border-cyan-200 bg-linear-to-br from-cyan-50 via-white to-teal-100/70",
      badge: "bg-cyan-100 text-cyan-700",
      glow: "bg-cyan-300/30",
    },
  };

  const grouped = data.reduce<Record<string, RateRecord[]>>((acc, item) => {
    acc[item.category] ??= [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const cards = Object.entries(grouped).map(([category, items]) => {
    const avgBase = Math.round(
      items.reduce((sum, item) => sum + item.baseRate, 0) / items.length,
    );
    const avgWeekend = Math.round(
      items.reduce((sum, item) => sum + item.weekendRate, 0) / items.length,
    );
    const promos = items.filter(
      (item) => item.pricingStatus === "Promo Live",
    ).length;

    return {
      category,
      avgBase,
      avgWeekend,
      avgLift: avgWeekend - avgBase,
      promos,
      topDemand: items.filter((item) => item.demandSignal === "High").length,
      style: categoryStyles[category] ?? {
        shell:
          "border-slate-200 bg-linear-to-br from-slate-50 via-white to-slate-100/70",
        badge: "bg-slate-100 text-slate-700",
        glow: "bg-slate-300/30",
      },
    };
  });

  return (
    <section className="overflow-hidden rounded-2xl border bg-white p-5 shadow-sm dark:bg-neutral-900">
      <h2 className="text-lg font-semibold">Rate Positioning Overview</h2>
      <p className="text-sm text-muted-foreground">
        Category-level view of how room rates are positioned across base,
        weekend, and promo pricing.
      </p>

      <Carousel
        className="mt-6 px-10"
        opts={{
          align: "start",
          slidesToScroll: 1,
        }}
      >
        <CarouselContent>
          {cards.map((card) => (
            <CarouselItem
              key={card.category}
              className="basis-full md:basis-1/2 xl:basis-1/4"
            >
              <div
                className={`relative h-full overflow-hidden border p-4 shadow-[0_16px_40px_rgba(15,23,42,0.06)] bg-zinc-50 dark:bg-zinc-900`}
              >
                <div
                  className={`absolute top-0 right-0 h-24 w-24 rounded-full blur-2xl ${card.style.glow}`}
                />

                <div className="relative">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div
                        className={`inline-flex px-2.5 py-1 text-xs font-medium ${card.style.badge}`}
                      >
                        {card.category}
                      </div>
                      <p className="mt-3 text-2xl font-semibold text-foreground">
                        {currency.format(card.avgBase)}
                      </p>
                      <p className="text-xs">
                        Average base nightly rate
                      </p>
                    </div>

                    
                  </div>

                  <div className="mt-4 rounded-2xl border border-background/70 bg-background/70 p-3 backdrop-blur">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm">
                        Weekend lift
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-foreground">
                        <ArrowUpRight className="size-3.5 text-emerald-600" />
                        {currency.format(card.avgLift)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-background/70 bg-background/70 p-3 backdrop-blur">
                      <p className="text-[11px] uppercase">
                        Weekend
                      </p>
                      <p className="mt-2 text-base font-semibold text-foreground">
                        {currency.format(card.avgWeekend)}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-background/70 bg-background/70 p-3 backdrop-blur">
                      <p className="text-[11px] uppercase">
                        Promos
                      </p>
                      <p className="mt-2 text-base font-semibold text-foreground">
                        {card.promos}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between rounded-2xl border border-background/70 bg-background/70 px-3 py-3 backdrop-blur">
                    <div>
                      <p className="text-[11px] uppercase text-muted-foreground">
                        High demand
                      </p>
                      <p className="mt-1 text-base font-semibold text-foreground">
                        {card.topDemand} rooms
                      </p>
                    </div>
                    <div className="bg-foreground p-2 text-background">
                      <Zap className="size-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 border-accent bg-white/95 shadow-sm hover:bg-violet-50" />
        <CarouselNext className="right-0 border-accent bg-white/95 shadow-sm" />
      </Carousel>
    </section>
  );
};
