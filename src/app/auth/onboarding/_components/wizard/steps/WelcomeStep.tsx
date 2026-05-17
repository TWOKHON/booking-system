/* eslint-disable @next/next/no-img-element */
"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { welcomeItems } from "../data";
import { Separator } from "@/components/ui/separator";

export function WelcomeStep({
  onNext,
  isSaving = false,
}: {
  onNext: () => void;
  isSaving?: boolean;
}) {
  return (
    <div className="mx-auto max-w-4xl">
      <img
        src="/onboarding.png"
        alt="Welcome"
        className="w-full h-50 object-contain"
      />
      <h1 className="text-center text-2xl font-semibold tracking-tight text-zinc-950 md:text-3xl">
        Welcome to ResortCloud!
      </h1>
      <p className="mx-auto mt-2 text-center text-muted-foreground">
        We&apos;re excited to have you on board. Let&apos;s set up your account
        and get your resort ready to operate smarter.
      </p>

      <Separator className="my-10" />

      <div>
        <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
          Here&apos;s what we&apos;ll do together
        </h2>
        <div className="mt-8 space-y-6">
          {welcomeItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-start gap-5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-zinc-200">
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="font-medium tracking-tight text-zinc-950">
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Separator className="my-10" />

      <div>
        <Button type="button" className="h-12 w-full" onClick={onNext} disabled={isSaving}>
          Let&apos;s Get Started
          <ArrowRight className="size-4" />
        </Button>
        <p className="mt-3 text-center text-sm text-zinc-500">
          This will take less than 5 minutes
        </p>
      </div>
    </div>
  );
}
