import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Check,
  CheckIcon,
  FileText,
  Globe,
  Link2,
  Settings2,
  Wallet,
} from "lucide-react";

import { getEcosystemContent } from "@/data/ecosystem";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import AvailabilityBoard from "./_components/AvailabilityBoard";
import CashFlowLifecycle from "./_components/CashFlowLifecycle";
import WebsiteBuilder from "./_components/WebsiteBuilder";
import ChatbotAnalytics from "./_components/ChatbotAnalytics";
import Image from "next/image";

function ModuleVisual({ index }: { index: number }) {
  if (index === 0) {
    return <AvailabilityBoard />;
  }

  if (index === 1) {
    return <CashFlowLifecycle />;
  }

  if (index === 2) {
    return <WebsiteBuilder />;
  }

  return <ChatbotAnalytics />;
}

export default async function Page() {
  const content = await getEcosystemContent();

  return (
    <main className="overflow-hidden pt-20 pb-20">
      <section className="mx-auto pb-10 max-w-7xl px-3">
        <div className="text-center">
          <p className="text-sm font-medium uppercase text-muted-foreground">
            How it works
          </p>
          <h2 className="mx-auto mt-4 max-w-4xl text-4xl font-bold">
            ResortCloud operations in 3 steps
          </h2>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {content.howItWorks.map((step, index) => (
            <div key={step.title} className="relative">
              {step.step === "Step 1" && (
                <div className="mb-4 flex items-start justify-center gap-3 text-foreground">
                  <span>{step.step}</span>
                  <Image
                    src={`/icons/step1.svg`}
                    alt={`Step ${step.step}`}
                    width={40}
                    height={40}
                  />
                </div>
              )}

              {step.step === "Step 2" && (
                <div className="mb-4 opacity-0 flex items-start flex-row-reverse justify-center gap-3 text-foreground">
                  <span>{step.step}</span>
                  <Image
                    src={`/icons/step3.svg`}
                    alt={`Step ${step.step}`}
                    width={40}
                    height={40}
                  />
                </div>
              )}

              {step.step === "Step 3" && (
                <div className="mb-4 flex items-start flex-row-reverse justify-center gap-3 text-foreground">
                  <span>{step.step}</span>
                  <Image
                    src={`/icons/step3.svg`}
                    alt={`Step ${step.step}`}
                    width={40}
                    height={40}
                  />
                </div>
              )}

              <Card className="p-0!">
                <CardHeader className="pt-8 text-center">
                  <CardTitle className="text-2xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="px-3 pb-5!">
                  <div className="flex min-h-80 items-center justify-center  bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(244,244,245,0.75))] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
                    {index === 0 && (
                      <div className="relative flex h-full w-full items-center justify-center">
                        <div className="absolute inset-3 border border-zinc-200/80" />
                        <div className="absolute inset-x-10 top-6 h-10  bg-white/80 blur-2xl" />
                        <div className="relative w-[72%] overflow-hidden  border border-zinc-200 bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.12)] transition-transform duration-500 group-hover/card:scale-[1.02]">
                          <div className="pointer-events-none absolute inset-x-4 top-0 h-16 -translate-y-20  bg-linear-to-b from-zinc-300/90 via-zinc-200/35 to-transparent opacity-0 blur-md transition-all duration-700 group-hover/card:translate-y-56 group-hover/card:opacity-100" />
                          <div className="flex items-center gap-2">
                            <Settings2 className="size-4 text-zinc-500" />
                            <div className="h-2 w-24  bg-zinc-200" />
                          </div>
                          <div className="mt-6 space-y-3">
                            <div className="h-2 w-20  bg-zinc-200" />
                            <div className="h-2 w-28  bg-zinc-200" />
                            <div className="h-2 w-24  bg-zinc-200" />
                          </div>
                          <div className="mt-5 border border-dashed border-zinc-200 bg-zinc-100/80 p-4">
                            <div className="h-3 w-24  bg-zinc-300/80" />
                            <div className="mt-3 h-10 bg-white/80" />
                          </div>
                          <div className="mt-5 grid grid-cols-3 gap-2">
                            <div className="h-8 bg-zinc-100" />
                            <div className="h-8 bg-zinc-100" />
                            <div className="h-8 bg-zinc-100" />
                          </div>
                        </div>
                      </div>
                    )}

                    {index === 1 && (
                      <div className="relative flex h-full w-full flex-col items-center justify-center">
                        <div className="absolute top-8 left-3 border border-zinc-200 bg-white p-4 shadow-md">
                          <Building2 className="size-5 text-zinc-500" />
                        </div>
                        <div className="absolute top-8 right-3 border border-zinc-200 bg-white p-4 shadow-md">
                          <Wallet className="size-5 text-zinc-500" />
                        </div>
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 border border-zinc-200 bg-white p-4 shadow-md">
                          <Globe className="size-5 text-zinc-500" />
                        </div>
                        <div className="absolute top-28 left-1/2 -translate-x-1/2 border border-zinc-200 bg-white p-4 shadow-md">
                          <Link2 className="size-5 text-zinc-700" />
                        </div>
                        <svg
                          viewBox="0 0 320 170"
                          className="absolute top-0 left-0 h-44 w-full text-zinc-300"
                          aria-hidden="true"
                        >
                          <path
                            d="M55 55 C95 55 105 95 160 110"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <path
                            d="M160 35 C160 55 160 70 160 110"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <path
                            d="M265 55 C225 55 215 95 160 110"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                        </svg>
                        <svg
                          viewBox="0 0 320 170"
                          className="pointer-events-none absolute top-0 left-0 h-44 w-full opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
                          aria-hidden="true"
                        >
                          <defs>
                            <linearGradient
                              id="ecosystem-flow-gradient"
                              x1="40"
                              y1="35"
                              x2="280"
                              y2="120"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop offset="0%" stopColor="#e4e4e7" />
                              <stop offset="45%" stopColor="#52525b" />
                              <stop offset="100%" stopColor="#09090b" />
                            </linearGradient>
                          </defs>
                          <path
                            d="M55 55 C95 55 105 95 160 110"
                            fill="none"
                            stroke="url(#ecosystem-flow-gradient)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeDasharray="12 12"
                            className="animate-[flow-line_1.6s_linear_infinite] filter-[drop-shadow(0_0_6px_rgba(24,24,27,0.18))]"
                          />
                          <path
                            d="M160 35 C160 55 160 70 160 110"
                            fill="none"
                            stroke="url(#ecosystem-flow-gradient)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeDasharray="12 12"
                            className="animate-[flow-line_1.6s_linear_infinite] filter-[drop-shadow(0_0_6px_rgba(24,24,27,0.18))]"
                          />
                          <path
                            d="M265 55 C225 55 215 95 160 110"
                            fill="none"
                            stroke="url(#ecosystem-flow-gradient)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeDasharray="12 12"
                            className="animate-[flow-line_1.6s_linear_infinite] filter-[drop-shadow(0_0_6px_rgba(24,24,27,0.18))]"
                          />
                        </svg>
                        <div className="mt-28 w-full  border border-zinc-200 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
                          <div className="grid h-32 grid-cols-8 items-end gap-3">
                            <div className="h-22 bg-zinc-100" />
                            <div className="h-14 bg-zinc-100" />
                            <div className="h-11 bg-zinc-100" />
                            <div className="h-14 bg-zinc-100" />
                            <div className="h-28 bg-zinc-100" />
                            <div className="h-14 bg-zinc-100" />
                            <div className="h-24 bg-zinc-100" />
                            <div className="h-11 bg-zinc-100" />
                          </div>
                        </div>
                      </div>
                    )}

                    {index === 2 && (
                      <div className="relative flex h-full w-full items-center justify-center">
                        <div className="absolute size-52  bg-zinc-200/60" />
                        <div className="relative z-10 flex items-center gap-6">
                          {[0, 1, 2].map((item) => {
                            const isChecked = item === 1;

                            return (
                              <div
                                key={item}
                                className={[
                                  "relative h-32 w-24 border border-zinc-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.12)] transition-all duration-500",
                                  isChecked
                                    ? "origin-bottom group-hover/card:-translate-y-2 group-hover/card:scale-110"
                                    : "group-hover/card:scale-95 group-hover/card:opacity-75",
                                ].join(" ")}
                              >
                                <div className="absolute top-0 right-0 h-9 w-9 rounded-bl-2xl rounded-tr-[1.35rem] border-b border-l border-zinc-200 bg-zinc-50" />
                                <FileText className="absolute top-4 left-4 size-5 text-zinc-300" />
                                {isChecked && (
                                  <div className="absolute -bottom-5 left-1/2 z-20 -translate-x-1/2  bg-zinc-950 p-2 text-white shadow-lg shadow-zinc-950/25 transition-transform duration-500 group-hover/card:scale-110">
                                    <CheckIcon className="size-5" />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="mt-6 text-center text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>

              {step.step === "Step 2" && (
                <div className="mt-4 flex items-end justify-center gap-3 text-foreground">
                  <span>{step.step}</span>
                  <Image
                    src={`/icons/step2.svg`}
                    alt={`Step ${step.step}`}
                    width={40}
                    height={40}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto pt-30 max-w-7xl px-3">
        <div className="flex flex-col text-center items-center justify-center gap-3">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase text-muted-foreground">
              Core operations
            </p>
            <h2 className="mt-3 text-4xl font-bold">
              One platform. Every workflow that moves your business forward.
            </h2>
          </div>
          <p className="max-w-3xl mt-2 text-sm leading-6 text-muted-foreground">
            Bookings and availability, cash flow and payroll, your public-facing
            website, and AI-powered guest engagement — built to work together
            from day one, and scale as your operation grows.
          </p>
        </div>

        <div className="mt-20 space-y-30">
          {content.modules.map((module, index) => {
            const reversed = index % 2 === 1;

            return (
              <section
                key={module.title}
                className="grid gap-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"
              >
                <div className={cn("space-y-6", reversed && "lg:order-2")}>
                  <div className="flex items-start gap-4">
                    <div>
                      <h3 className="mt-3 text-3xl font-bold">
                        {module.title}
                      </h3>
                      <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
                        {module.summary}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {module.bullets.map((bullet) => (
                      <div key={bullet} className="flex items-start gap-3">
                        <div className="mt-1 flex items-center justify-center  shrink-0 bg-zinc-950 size-5 text-white">
                          <Check className="size-3" strokeWidth={3} />
                        </div>
                        <p className="text-base text-muted-foreground">
                          {bullet}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={cn(reversed && "lg:order-1")}>
                  <ModuleVisual index={index} />
                </div>
              </section>
            );
          })}
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-3">
  <div className=" border border-border bg-linear-to-br from-zinc-950 via-zinc-900 to-zinc-800 px-3 py-10 text-white shadow-2xl shadow-zinc-950/20 md:px-10">
    <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl">
        <Badge className=" bg-white text-zinc-950 hover:bg-white">
          Now accepting early access
        </Badge>
        <h2 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">
          Your entire operation, running from one platform.
        </h2>
        <p className="mt-4 text-base leading-7 text-zinc-300">
          Bookings, cash flow, your public website, and AI guest support —
          connected from day one. Join properties already on the waitlist
          and be first to go live when we open doors.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button
          asChild
          size="lg"
          variant="secondary"
          className="h-11 px-4"
        >
          <Link href="/pricing">
            See pricing plans
            <ArrowRight className="size-4" />
          </Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="h-11 border-white/20 bg-transparent px-4 text-white hover:bg-white/10 hover:text-white"
        >
          <Link href="/demo">Request a demo</Link>
        </Button>
      </div>
    </div>
  </div>
</section>
    </main>
  );
}
