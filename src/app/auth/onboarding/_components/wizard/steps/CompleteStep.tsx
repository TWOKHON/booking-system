"use client";

import { useEffect } from "react";
import { ArrowRight, Bell, CircleCheck, CreditCard, Hand, Hotel, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { nextSteps } from "../data";
import { Separator } from "@/components/ui/separator";
import confetti from "canvas-confetti";
import type { OnboardingFormData } from "@/app/auth/onboarding/_lib/schema";

export function CompleteStep({
  data,
  onEditStep,
  onComplete,
  isCompleting = false,
}: {
  data: OnboardingFormData;
  onEditStep: (stepIndex: number) => void;
  onComplete: () => void;
  isCompleting?: boolean;
}) {
  const paymentMethodLabel =
    data.planBilling.paymentMethod === "credit_card"
      ? "Credit Card"
      : data.planBilling.paymentMethod === "bank_transfer"
        ? "Bank Transfer"
        : data.planBilling.paymentMethod === "e_wallet"
          ? "E-Wallet"
          : "Cash Deposit";

  useEffect(() => {
    const end = Date.now() + 3_000;
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];
    let frameId = 0;

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      frameId = requestAnimationFrame(frame);
    };

    frame();

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, []);

  const summaryCards: Array<{
    title: string;
    subtitle: string;
    detail?: string;
    icon: React.ComponentType<{ className?: string }>;
    stepIndex: number;
  }> = [
    {
      title: "Property Details",
      subtitle:
        data.property.resortName && data.property.municipality
          ? `${data.property.resortName}, ${data.property.municipality}, ${data.property.province}`
          : "Property details are ready for review",
      icon: Hotel,
      stepIndex: 1,
    },
    {
      title: "Team Members",
      subtitle: `${data.teamSetup.members.length} members ready`,
      icon: Users,
      stepIndex: 2,
    },
    {
      title: "Payment Connection",
      subtitle:
        data.planBilling.paymentAccountLabel ||
        `${paymentMethodLabel} account ready`,
      detail:
        data.planBilling.paymentMaskedDetails || data.planBilling.cardLastFour
          ? `${paymentMethodLabel}${data.planBilling.cardLastFour ? ` ending in ${data.planBilling.cardLastFour}` : ""}`
          : "Default payment account is ready for review",
      icon: CreditCard,
      stepIndex: 3,
    },
    {
      title: "Communication",
      subtitle: Object.entries(data.communication.channels)
        .filter(([, enabled]) => enabled)
        .map(([key]) =>
          key === "inApp"
            ? "In-App"
            : key === "push"
              ? "Push"
              : key.charAt(0).toUpperCase() + key.slice(1),
        )
        .join(", "),
      detail: `${Object.values(data.communication.preferences).filter((item) => item.enabled).length} notification preferences set`,
      icon: Bell,
      stepIndex: 4,
    },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="pt-8 text-center">
        <CircleCheck className="size-20 mx-auto" strokeWidth={1} />
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-950">
          You&apos;re All Set!
        </h1>
        <p className="mt-3 text-base text-zinc-500">
          Your resort is ready to go. Here&apos;s what you can do next.
        </p>
      </div>

      <Separator className="my-10" />

      <div className="mt-10">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
          Summary
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          Here&apos;s a quick overview of your setup.
        </p>

        <Card className="mt-7 rounded-2xl border-zinc-200 py-0 shadow-none">
          <CardContent className="divide-y divide-zinc-200 px-0 py-0">
            {summaryCards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className="flex items-center justify-between gap-4 px-5 py-5"
                >
                  <div className="flex items-start gap-5">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <p className="font-medium tracking-tight text-zinc-950">
                        {card.title}
                      </p>
                      <p className="mt-1 text-sm leading-7 text-zinc-500">
                        {card.subtitle}
                      </p>
                      {card.detail ? (
                        <p className="text-sm text-zinc-500">{card.detail}</p>
                      ) : null}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onEditStep(card.stepIndex)}
                  >
                    Edit
                  </Button>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8 rounded-2xl border-zinc-200 py-0 shadow-none">
        <CardContent className="flex flex-col items-start justify-between gap-6 px-6 py-6 md:flex-row md:items-center">
          <div className="flex items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50">
              <Sparkles className="size-5" />
            </div>
            <div>
              <p className="font-medium tracking-tight text-zinc-950">
                Explore your dashboard
              </p>
              <p className="mt-1 max-w-2xl text-sm text-zinc-500">
                Manage reservations, communicate with guests, and streamline
                operations all in one place.
              </p>
            </div>
          </div>
          <Button type="button" size="lg" onClick={onComplete} disabled={isCompleting}>
            Go to Dashboard
            <ArrowRight className="size-4" />
          </Button>
        </CardContent>
      </Card>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
          What&apos;s Next?
        </h2>
        <p className="mt-2 text-base text-zinc-500">
          Get the most out of ResortCloud with these next steps.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {nextSteps.map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.title}
                className="rounded-2xl border-zinc-200 py-0 shadow-none"
              >
                <CardContent className="px-6 py-6">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50">
                    <Icon className="size-5" />
                  </div>
                  <p className="mt-6 font-medium tracking-tight text-zinc-950">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm text-zinc-500">
                    {item.description}
                  </p>
                  <Button variant="link" type="button" className="mt-6">
                    {item.action}
                    <ArrowRight className="size-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Separator className="my-10" />

      <div className="mt-10 flex items-start gap-5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50">
          <Hand className="size-5" />
        </div>
        <div>
          <p className="font-medium tracking-tight text-zinc-950">
            Welcome to ResortCloud!
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            We&apos;re excited to be part of your success journey.
          </p>
          <p className="text-sm text-zinc-500">
            If you need help, our support team is always here for you.
          </p>
        </div>
      </div>
    </div>
  );
}
