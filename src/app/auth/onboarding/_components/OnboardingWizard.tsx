"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  BedDouble,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheckBig,
  Hotel,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { OnboardingHeader } from "./OnboardingHeader";

const steps = [
  {
    id: "identity",
    label: "Identity",
    title: "Property Identity",
    description:
      "Define the core details of your resort for guest-facing communication and internal operations.",
    icon: Hotel,
  },
  {
    id: "property",
    label: "Property",
    title: "Operational Setup",
    description:
      "Configure the essentials your team needs to run arrivals, guest support, and daily operations.",
    icon: MapPin,
  },
  {
    id: "rooms",
    label: "Rooms",
    title: "Inventory & Rates",
    description:
      "Create room categories, set base rates, and establish occupancy limits for launch.",
    icon: BedDouble,
  },
  {
    id: "finalize",
    label: "Finalize",
    title: "Review & Launch",
    description:
      "Confirm your setup summary before inviting the team and opening your digital workspace.",
    icon: CircleCheckBig,
  },
] as const;

const teamMembers = [
  {
    name: "Alicia Santos",
    email: "alicia@alrioresort.com",
    role: "General Manager",
    status: "Ready to invite",
  },
  {
    name: "Marco Reyes",
    email: "marco@alrioresort.com",
    role: "Front Office Lead",
    status: "Ready to invite",
  },
  {
    name: "Denise Lim",
    email: "denise@alrioresort.com",
    role: "Revenue Analyst",
    status: "Ready to invite",
  },
] as const;

const inventory = [
  {
    name: "Garden Villa",
    description: "Private patio, king bed, and direct garden access",
    rate: "$420",
    occupancy: "2 guests",
  },
  {
    name: "Ocean Suite",
    description: "Ocean-facing balcony with lounge area",
    rate: "$680",
    occupancy: "3 guests",
  },
  {
    name: "Family Residence",
    description: "Two bedrooms with dining and pool view",
    rate: "$860",
    occupancy: "5 guests",
  },
] as const;

const integrations = [
  "Guest messaging",
  "Reservations dashboard",
  "Team roles & permissions",
  "Rate and inventory controls",
] as const;

function StepSidebar({ currentStep }: { currentStep: number }) {
  return (
    <aside className="border-b border-zinc-200 bg-zinc-50/70 lg:min-h-[calc(100vh-73px)] lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col px-5 py-6 sm:px-8 lg:px-6 lg:py-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
            Onboarding
          </p>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950">
            Resort Setup
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        <nav className="mt-8 space-y-2">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === index;
            const isComplete = currentStep > index;

            return (
              <div
                key={step.id}
                className={[
                  "flex items-center gap-3 rounded-2xl border px-4 py-3 transition",
                  isActive
                    ? "border-zinc-300 bg-white text-zinc-950 shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
                    : "border-transparent text-zinc-500",
                ].join(" ")}
              >
                <div
                  className={[
                    "flex size-10 items-center justify-center rounded-full border",
                    isActive
                      ? "border-zinc-950 bg-zinc-950 text-white"
                      : isComplete
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-200 bg-white text-zinc-400",
                  ].join(" ")}
                >
                  {isComplete ? <Check className="size-4" /> : <Icon className="size-4" />}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{step.label}</p>
                  <p className="text-xs text-zinc-400">{step.title}</p>
                </div>
              </div>
            );
          })}
        </nav>

        <Card className="mt-8 rounded-[28px] border border-zinc-200 bg-white py-0 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
          <CardContent className="space-y-4 px-5 py-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-950 text-white">
                <Sparkles className="size-4.5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-950">
                  Digital Concierge
                </p>
                <p className="text-xs text-zinc-500">Launch checklist</p>
              </div>
            </div>
            <p className="text-sm leading-6 text-zinc-600">
              We kept the setup focused so your team can move from onboarding to
              operations without extra complexity.
            </p>
          </CardContent>
        </Card>

        <div className="mt-auto hidden rounded-[28px] border border-zinc-200 bg-white p-5 lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
            Current role
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-full bg-zinc-950 text-sm font-semibold text-white">
              AR
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-950">Admin</p>
              <p className="text-xs text-zinc-500">Property Manager</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
        {eyebrow}
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
        {title}
      </h1>
      <p className="mt-4 text-base leading-7 text-zinc-600 sm:text-lg">
        {description}
      </p>
    </div>
  );
}

function FieldShell({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-zinc-900">{label}</Label>
      {children}
      {hint ? <p className="text-xs text-zinc-500">{hint}</p> : null}
    </div>
  );
}

function TextArea(props: React.ComponentProps<"textarea">) {
  const { className, ...rest } = props;

  return (
    <textarea
      {...rest}
      className={[
        "min-h-28 w-full rounded-2xl border border-zinc-200 bg-zinc-50/70 px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-300 focus:bg-white focus:ring-4 focus:ring-zinc-200/60",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

function Select(props: React.ComponentProps<"select">) {
  const { className, ...rest } = props;

  return (
    <select
      {...rest}
      className={[
        "h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50/70 px-4 text-sm text-zinc-900 outline-none transition focus:border-zinc-300 focus:bg-white focus:ring-4 focus:ring-zinc-200/60",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

function IdentityStep() {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_320px]">
      <div className="space-y-6">
        <SectionHeading
          eyebrow="Step 01"
          title="Property Identity"
          description="Define the foundational details of your resort. This information powers guest communication, internal references, and your branded workspace."
        />

        <Card className="rounded-[32px] border border-zinc-200 bg-white py-0 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
          <CardContent className="grid gap-5 px-6 py-6 sm:px-8 sm:py-8">
            <div className="grid gap-5 md:grid-cols-2">
              <FieldShell label="Resort name">
                <Input
                  placeholder="e.g. Alrio Seaside Resort"
                  className="h-12 rounded-2xl border-zinc-200 bg-zinc-50/70 px-4 shadow-none"
                />
              </FieldShell>

              <FieldShell
                label="Property ID"
                hint="This identifier can be used for internal setup and reporting."
              >
                <Input
                  defaultValue="ALR-2026-001"
                  className="h-12 rounded-2xl border-zinc-200 bg-zinc-50/70 px-4 shadow-none"
                />
              </FieldShell>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <FieldShell label="Primary location">
                <Input
                  placeholder="e.g. El Nido, Palawan"
                  className="h-12 rounded-2xl border-zinc-200 bg-zinc-50/70 px-4 shadow-none"
                />
              </FieldShell>

              <FieldShell label="Timezone">
                <Select defaultValue="asia-manila">
                  <option value="asia-manila">Asia/Manila</option>
                  <option value="asia-singapore">Asia/Singapore</option>
                  <option value="utc">UTC</option>
                </Select>
              </FieldShell>
            </div>

            <FieldShell
              label="Brand summary"
              hint="A short description helps shape guest-facing messaging and internal setup defaults."
            >
              <TextArea placeholder="Describe your resort style, guest experience, and operating focus." />
            </FieldShell>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="rounded-[32px] border border-dashed border-zinc-300 bg-zinc-50/70 py-0 shadow-[0_18px_40px_rgba(15,23,42,0.04)]">
          <CardContent className="flex min-h-[250px] flex-col items-center justify-center px-6 py-8 text-center">
            <div className="flex size-16 items-center justify-center rounded-3xl border border-zinc-200 bg-white text-zinc-950 shadow-sm">
              <Hotel className="size-7" />
            </div>
            <p className="mt-5 text-lg font-semibold text-zinc-950">Resort Logo</p>
            <p className="mt-2 max-w-xs text-sm leading-6 text-zinc-500">
              Drop SVG or high-resolution PNG to personalize your dashboard and
              guest materials.
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-[32px] border border-zinc-200 bg-white py-0 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
          <div className="relative h-52">
            <Image
              src="/stitch-preview.png"
              alt="Resort preview"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/72 via-zinc-950/18 to-transparent grayscale" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                Brand direction
              </p>
              <p className="mt-2 text-xl font-semibold">
                Bright editorial hospitality
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function PropertyStep() {
  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Step 02"
        title="Property & Team Setup"
        description="Capture the operational details your staff needs from day one, then outline the first team members who will manage the property."
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Card className="rounded-[32px] border border-zinc-200 bg-white py-0 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
          <CardContent className="grid gap-5 px-6 py-6 sm:px-8 sm:py-8">
            <div className="grid gap-5 md:grid-cols-2">
              <FieldShell label="Check-in time">
                <Input
                  defaultValue="3:00 PM"
                  className="h-12 rounded-2xl border-zinc-200 bg-zinc-50/70 px-4 shadow-none"
                />
              </FieldShell>
              <FieldShell label="Check-out time">
                <Input
                  defaultValue="11:00 AM"
                  className="h-12 rounded-2xl border-zinc-200 bg-zinc-50/70 px-4 shadow-none"
                />
              </FieldShell>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <FieldShell label="Currency">
                <Select defaultValue="php">
                  <option value="php">PHP - Philippine Peso</option>
                  <option value="usd">USD - US Dollar</option>
                  <option value="eur">EUR - Euro</option>
                </Select>
              </FieldShell>

              <FieldShell label="Primary contact number">
                <Input
                  placeholder="+63 912 345 6789"
                  className="h-12 rounded-2xl border-zinc-200 bg-zinc-50/70 px-4 shadow-none"
                />
              </FieldShell>
            </div>

            <FieldShell label="Operations notes">
              <TextArea placeholder="Share any front desk notes, guest service standards, or launch requirements." />
            </FieldShell>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="rounded-[32px] border border-zinc-200 bg-white py-0 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
            <CardContent className="space-y-4 px-6 py-6">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-950 text-white">
                  <Users className="size-5" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-zinc-950">
                    Invite Your Team
                  </p>
                  <p className="text-sm text-zinc-500">
                    Start with the staff who will manage launch.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div
                    key={member.email}
                    className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-zinc-950">
                          {member.name}
                        </p>
                        <p className="mt-1 text-sm text-zinc-500">
                          {member.email}
                        </p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-zinc-600 ring-1 ring-zinc-200">
                        {member.role}
                      </span>
                    </div>
                    <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
                      {member.status}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function RoomsStep() {
  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Step 03"
        title="Define Inventory"
        description="Structure your accommodation categories so bookings, occupancy, and base pricing are clear before launch."
      />

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <Card className="rounded-[32px] border border-zinc-200 bg-white py-0 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
          <CardContent className="space-y-5 px-6 py-6">
            <FieldShell label="Category name">
              <Input
                placeholder="e.g. Deluxe Ocean Suite"
                className="h-12 rounded-2xl border-zinc-200 bg-zinc-50/70 px-4 shadow-none"
              />
            </FieldShell>
            <div className="grid gap-4 sm:grid-cols-2">
              <FieldShell label="Base rate">
                <Input
                  placeholder="$ 0.00"
                  className="h-12 rounded-2xl border-zinc-200 bg-zinc-50/70 px-4 shadow-none"
                />
              </FieldShell>
              <FieldShell label="Max capacity">
                <Input
                  placeholder="2"
                  className="h-12 rounded-2xl border-zinc-200 bg-zinc-50/70 px-4 shadow-none"
                />
              </FieldShell>
            </div>
            <FieldShell label="Description">
              <TextArea
                className="min-h-24"
                placeholder="Highlight layout, view, and notable amenities."
              />
            </FieldShell>
            <Button className="h-12 w-full rounded-2xl bg-zinc-950 text-white hover:bg-zinc-800">
              Create category
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border border-zinc-200 bg-white py-0 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
          <CardContent className="px-6 py-6 sm:px-8 sm:py-8">
            <div className="flex items-center justify-between gap-4 border-b border-zinc-200 pb-5">
              <div>
                <p className="text-lg font-semibold text-zinc-950">
                  Active Categories
                </p>
                <p className="text-sm text-zinc-500">
                  {inventory.length} room types listed
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {inventory.map((room) => (
                <div
                  key={room.name}
                  className="flex flex-col gap-4 rounded-[28px] border border-zinc-200 bg-zinc-50/70 p-5 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-white text-zinc-900 shadow-sm">
                      <BedDouble className="size-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-base font-semibold text-zinc-950">
                        {room.name}
                      </p>
                      <p className="max-w-xl text-sm leading-6 text-zinc-500">
                        {room.description}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm md:min-w-[220px]">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                        Rate
                      </p>
                      <p className="mt-1 font-semibold text-zinc-950">
                        {room.rate}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                        Occupancy
                      </p>
                      <p className="mt-1 font-semibold text-zinc-950">
                        {room.occupancy}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function FinalizeStep() {
  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Final Step"
        title="Almost Ready"
        description="Review your property configuration before launching the dashboard. You can adjust these settings later from your admin workspace."
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_360px]">
        <Card className="overflow-hidden rounded-[36px] border border-zinc-200 bg-white py-0 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
          <div className="relative h-44 bg-[linear-gradient(135deg,#fafafa_0%,#f4f4f5_32%,#e4e4e7_52%,#fafafa_100%)]">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0,transparent_18%,rgba(24,24,27,0.05)_18%,rgba(24,24,27,0.05)_36%,transparent_36%,transparent_56%,rgba(24,24,27,0.05)_56%,rgba(24,24,27,0.05)_74%,transparent_74%,transparent_100%)]" />
          </div>
          <CardContent className="space-y-6 px-6 py-6 sm:px-8 sm:py-8">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-[28px] border border-zinc-200 bg-zinc-50/70 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                  Property name
                </p>
                <p className="mt-3 text-xl font-semibold text-zinc-950">
                  Alrio Seaside Resort
                </p>
              </div>
              <div className="rounded-[28px] border border-zinc-200 bg-zinc-50/70 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                  Primary location
                </p>
                <p className="mt-3 text-xl font-semibold text-zinc-950">
                  El Nido, Palawan
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[28px] border border-zinc-200 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                  Team members
                </p>
                <p className="mt-3 text-3xl font-semibold text-zinc-950">12</p>
                <p className="mt-1 text-sm text-zinc-500">Invited for launch</p>
              </div>
              <div className="rounded-[28px] border border-zinc-200 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                  Room categories
                </p>
                <p className="mt-3 text-3xl font-semibold text-zinc-950">08</p>
                <p className="mt-1 text-sm text-zinc-500">Base inventory defined</p>
              </div>
              <div className="rounded-[28px] border border-zinc-200 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                  Readiness
                </p>
                <p className="mt-3 text-3xl font-semibold text-zinc-950">100%</p>
                <p className="mt-1 text-sm text-zinc-500">Launch checklist complete</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="rounded-[32px] border border-zinc-200 bg-white py-0 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
            <CardContent className="space-y-5 px-6 py-6">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-950 text-white">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-zinc-950">
                    All checks completed
                  </p>
                  <p className="text-sm text-zinc-500">
                    Your workspace is ready to provision.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {integrations.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50/70 px-4 py-3"
                  >
                    <CircleCheckBig className="size-4.5 text-zinc-950" />
                    <span className="text-sm text-zinc-700">{item}</span>
                  </div>
                ))}
              </div>

              <Button className="h-12 w-full rounded-2xl bg-zinc-950 text-white hover:bg-zinc-800">
                Launch Dashboard
              </Button>
              <Button
                variant="outline"
                className="h-12 w-full rounded-2xl border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50"
              >
                Download setup summary
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(0);

  const progress = useMemo(
    () => ((currentStep + 1) / steps.length) * 100,
    [currentStep]
  );

  const canGoBack = currentStep > 0;
  const isLastStep = currentStep === steps.length - 1;

  const goNext = () => setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  const goBack = () => setCurrentStep((step) => Math.max(step - 1, 0));

  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <OnboardingHeader />

      <div className="mx-auto grid min-h-[calc(100vh-73px)] max-w-[1600px] lg:grid-cols-[300px_minmax(0,1fr)]">
        <StepSidebar currentStep={currentStep} />

        <section className="bg-[linear-gradient(180deg,#ffffff_0%,#fcfcfc_100%)] px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-8">
            <div className="overflow-hidden rounded-full border border-zinc-200 bg-zinc-100">
              <div
                className="h-2 rounded-full bg-zinc-950 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {currentStep === 0 ? <IdentityStep /> : null}
            {currentStep === 1 ? <PropertyStep /> : null}
            {currentStep === 2 ? <RoomsStep /> : null}
            {currentStep === 3 ? <FinalizeStep /> : null}

            <div className="flex flex-col gap-4 border-t border-zinc-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={goBack}
                disabled={!canGoBack}
                className="h-11 rounded-2xl border-zinc-300 bg-white px-5 text-zinc-900 hover:bg-zinc-50"
              >
                <ChevronLeft className="size-4" />
                Back
              </Button>

              <div className="text-sm text-zinc-500">
                {isLastStep
                  ? "Ready to launch your resort workspace."
                  : `Next: ${steps[currentStep + 1]?.title}`}
              </div>

              <Button
                type="button"
                onClick={goNext}
                disabled={isLastStep}
                className="h-11 rounded-2xl bg-zinc-950 px-5 text-white hover:bg-zinc-800"
              >
                {isLastStep ? "Completed" : "Save and continue"}
                {!isLastStep ? <ChevronRight className="size-4" /> : null}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
