"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, Check, CircleHelp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { steps } from "./data";
import { Separator } from "@/components/ui/separator";

export function ShellHeader() {
  return (
    <div className="grid grid-cols-1 border-b border-zinc-200 lg:grid-cols-[300px_minmax(0,1fr)]">
      <div className="border-r border-zinc-200 px-8 py-4">
        <LogoMark />
      </div>
      <div className="flex items-center justify-end px-8 py-4">
        <Button type="button" variant="ghost">
          <CircleHelp className="size-4" />
          Need help?
        </Button>
      </div>
    </div>
  );
}

function LogoMark() {
  return (
    <div className="flex items-center gap-3">
      <Image
        src="/main/logo-light.png"
        alt="ResortCloud logo"
        width={44}
        height={44}
        className="h-9 w-auto"
        priority
      />
      <span className="text-xl font-semibold tracking-tight text-zinc-950">
        ResortCloud
      </span>
    </div>
  );
}

function StepRail({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex h-full flex-col">
      <div className="space-y-0 px-8 py-10">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.title} className="relative flex gap-4 pb-10">
              {!isLast ? (
                <div className="absolute left-3.75 top-8 h-[calc(100%-4px)] border-l border-zinc-300" />
              ) : null}
              <div
                className={[
                  "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold",
                  isCompleted || isActive
                    ? "border-black bg-black text-white"
                    : "border-zinc-400 bg-white text-black",
                ].join(" ")}
              >
                {isCompleted ? <Check className="size-4" /> : index + 1}
              </div>
              <div className="pt-1">
                <p className="text-base font-medium tracking-tight text-zinc-950">
                  {step.title}
                </p>
                <p className="text-sm mt-1 text-zinc-500">{step.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SideLayout({
  currentStep,
  children,
}: {
  currentStep: number;
  children: React.ReactNode;
}) {
  return (
    <div className="grid lg:grid-cols-[300px_minmax(0,1fr)]">
      <aside className="border-r border-zinc-200">
        <div className="lg:sticky lg:top-0 lg:h-[calc(100vh-110px)]">
          <StepRail currentStep={currentStep} />
        </div>
      </aside>
      <section className="min-w-0 px-8 py-8 lg:px-10 lg:py-8">
        {children}
      </section>
    </div>
  );
}

function StepBackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2.5 text-base font-medium text-zinc-950"
    >
      <ArrowLeft className="size-4" />
      Back
    </button>
  );
}

export function StepHeader({
  title,
  description,
  onBack,
}: {
  title: string;
  description: string;
  onBack?: () => void;
}) {
  return (
    <div>
      {onBack ? <StepBackButton onClick={onBack} /> : null}
      <h1 className="mt-5 text-3xl font-semibold tracking-tight text-zinc-950">
        {title}
      </h1>
      <p className="mt-3 text-zinc-500">{description}</p>
      <Separator className="mt-5" />
    </div>
  );
}

export function CompletionIllustration() {
  return (
    <svg
      viewBox="0 0 160 160"
      className="mx-auto size-40 text-black"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden="true"
    >
      <circle cx="80" cy="80" r="34" />
      <path d="M66 80l10 10 20-24" />
      <path d="M80 18v12" />
      <path d="M80 130v12" />
      <path d="M18 80h12" />
      <path d="M130 80h12" />
      <path d="M35 35l8 8" />
      <path d="M117 117l8 8" />
      <path d="M117 43l8-8" />
      <path d="M35 125l8-8" />
      <circle cx="32" cy="54" r="2" fill="currentColor" />
      <circle cx="126" cy="50" r="2" fill="currentColor" />
      <circle cx="120" cy="108" r="2" fill="currentColor" />
      <circle cx="42" cy="112" r="2" fill="currentColor" />
    </svg>
  );
}

export function ActionFooter({
  onBack,
  onNext,
  nextLabel = "Save & Continue",
  hint,
  showBack = true,
  disabled = false,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  hint?: string;
  showBack?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="pt-3">
      <div className="flex flex-col gap-4 sm:flex-row">
        {showBack ? (
          <Button
            type="button"
            variant="outline"
            className="h-12 flex-1 rounded-2xl border-black text-base font-medium"
            onClick={onBack}
            disabled={disabled}
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
        ) : null}
        <Button
          type="button"
          className="h-12 flex-[1.15] rounded-2xl bg-black text-base font-medium text-white hover:bg-zinc-800"
          onClick={onNext}
          disabled={disabled}
        >
          {nextLabel}
          <ArrowRight className="size-4" />
        </Button>
      </div>
      {hint ? (
        <p className="mt-5 text-center text-sm text-zinc-500">{hint}</p>
      ) : null}
    </div>
  );
}

export function LabeledField({
  label,
  children,
  optional,
}: {
  label: string;
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-zinc-950">
        {label}{" "}
        {optional ? <span className="text-zinc-500">(Optional)</span> : null}
      </p>
      {children}
    </div>
  );
}
