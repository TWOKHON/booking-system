import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarRange,
  Check,
  Globe,
  MessageSquareText,
  Sparkles,
  Wallet,
} from "lucide-react";

import { getSolutionContent } from "@/data/solution";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SolutionBoard } from "./_components/SolutionBoard";
import { SolutionFlowTimeline } from "./_components/SolutionFlowTimeline";

const pillarIcons = [Building2, MessageSquareText, Sparkles] as const;
const moduleIcons = [CalendarRange, Wallet, Globe] as const;

export default async function Page() {
  const content = await getSolutionContent();

  return (
    <main className="overflow-hidden pt-15 pb-24">
      <section className="relative">
        <div className="mx-auto grid max-w-7xl gap-10 px-3 lg:grid-cols-10 lg:items-center">
          <div className="lg:col-span-4">
            <Badge variant="outline" className="px-3 py-1 text-xs">
              {content.hero.eyebrow}
            </Badge>
            <h1 className="mt-6 text-5xl font-bold leading-tight">
              {content.hero.title}
            </h1>
            <p className="mt-6 text-base leading-7 text-muted-foreground md:text-lg">
              {content.hero.description}
            </p>
            <div className="mt-8 space-y-3">
              {content.hero.highlights.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="mt-1 bg-zinc-950 p-1 text-white">
                    <Check className="size-3" strokeWidth={3} />
                  </div>
                  <p className="text-base text-zinc-600">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-11 px-4">
                <Link href="/pricing">
                  View pricing
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-11 px-4">
                <Link href="/ecosystem">Explore ecosystem</Link>
              </Button>
            </div>
          </div>

          <SolutionBoard />
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-3">
        <div className="grid gap-5 md:grid-cols-3">
          {content.problemFrames.map((frame) => (
            <Card
              key={frame.title}
              className="border border-border/80 bg-white py-0 shadow-lg shadow-zinc-900/5"
            >
              <CardHeader className="pt-6">
                <CardDescription>Why teams get stuck</CardDescription>
                <CardTitle className="text-xl">{frame.title}</CardTitle>
              </CardHeader>
              <CardContent className="pb-6">
                <p className="text-sm leading-6 text-muted-foreground">
                  {frame.body}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-3">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm font-medium uppercase text-muted-foreground">
            Solution pillars
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight">
            A clearer system for how resort teams work together
          </h2>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {content.pillars.map((pillar, index) => {
            const Icon = pillarIcons[index];

            return (
              <Card
                key={pillar.id}
                className="border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(250,250,250,0.96))] py-0 shadow-lg shadow-zinc-900/5"
              >
                <CardHeader className="pt-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className=" border border-border bg-zinc-950 p-3 text-white">
                      <Icon className="size-5" />
                    </div>
                    <Badge variant="outline" className="">
                      {pillar.stat}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl font-semibold mt-3">{pillar.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-6">
                  <p className="text-sm text-muted-foreground">
                    {pillar.body}
                  </p>
                  <div className="mt-5 space-y-3">
                    {pillar.bullets.map((bullet) => (
                      <div key={bullet} className="flex items-start gap-3">
                        <div className="mt-1  shrink-0 bg-zinc-950 size-4.5 flex items-center justify-center text-white">
                          <Check className="size-3" strokeWidth={3} />
                        </div>
                        <p className="text-sm text-zinc-600">
                          {bullet}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-3">
        <SolutionFlowTimeline workflow={content.workflow} />
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-3">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase text-muted-foreground">
            Solution areas
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight">
            The product surfaces that make the solution real
          </h2>
        </div>

        <div className="mt-10 grid gap-5 xl:grid-cols-3">
          {content.modules.map((module, index) => {
            const Icon = moduleIcons[index];

            return (
              <Card
                key={module.title}
                className="border border-border/80 bg-white py-0 shadow-lg shadow-zinc-900/5"
              >
                <CardHeader className="pt-6">
                  <div className="border border-border bg-zinc-950 p-3 text-white w-fit">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle className="mt-4 text-xl">
                    {module.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {module.summary}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-6">
                  <div className="space-y-3">
                    {module.details.map((detail) => (
                      <div key={detail} className="flex items-start gap-3">
                        <div className="mt-1 bg-zinc-950 size-4 flex items-center justify-center shrink-0 text-white">
                          <Check className="size-3" strokeWidth={3} />
                        </div>
                        <p className="text-sm text-zinc-600">
                          {detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-3">
        <div className="border border-border bg-[linear-gradient(180deg,rgba(0,0,0,1),rgba(0,0,0,0.95))] px-6 py-10 shadow-lg shadow-zinc-900/5 md:px-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <Badge variant="outline" className="bg-white">
                Next step
              </Badge>
              <h2 className="mt-5 text-3xl font-bold text-white md:text-4xl">
                {content.cta.title}
              </h2>
              <p className="mt-4 text-base text-zinc-300">
                {content.cta.body}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-11 bg-zinc-700 px-4">
                <Link href="/pricing">
                  Compare plans
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-11 px-4">
                <Link href="/ecosystem">View ecosystem</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
