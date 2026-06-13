"use client";

import NumberFlow from "@number-flow/react";
import { CircleHelp, Landmark, Sparkles, Wallet } from "lucide-react";
import { PRICING_PLANS } from "@/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { OnboardingFormData } from "@/app/auth/onboarding/_lib/schema";
import { ActionFooter, LabeledField, StepHeader } from "../shared";
import { PaymentCardFields } from "./PaymentCardFields";

function formatPhp(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function PlanBillingStep({
  data,
  onChange,
  onBack,
  onNext,
  isSaving = false,
}: {
  data: OnboardingFormData["planBilling"];
  onChange: (field: keyof OnboardingFormData["planBilling"], value: string) => void;
  onBack: () => void;
  onNext: () => void;
  isSaving?: boolean;
}) {
  const selectedPlan = PRICING_PLANS.find((plan) => plan.key === data.subscriptionPlan);
  const planName = selectedPlan?.name ?? "Starter";
  const basePrice = selectedPlan?.price ?? 1499;
  const isYearly = data.billingCycle === "yearly";
  const yearlyPrice = selectedPlan?.yearlyPrice ?? basePrice * 12;
  const displayedPrice = isYearly ? yearlyPrice : basePrice;
  const annualFullPrice = basePrice * 12;
  const annualSavings = annualFullPrice - yearlyPrice;
  const teamSeatLabel =
    data.subscriptionPlan === "free_trial"
      ? "Up to 3 included"
      : data.subscriptionPlan === "starter"
        ? "Up to 10 included"
        : data.subscriptionPlan === "growth"
          ? "Up to 25 included"
          : "Unlimited";

  return (
    <div className="mx-auto max-w-6xl">
      <StepHeader
        title="Plan & Billing"
        description="Review your plan details and billing information."
        onBack={onBack}
      />

      <div className="mt-10 space-y-10">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
            Your Plan
          </h2>
          <Card className="mt-6 rounded-2xl border-zinc-200 py-0 shadow-none">
            <CardContent className="grid gap-8 px-6 py-6 md:grid-cols-[minmax(0,1fr)_240px]">
              <div className="flex gap-5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-zinc-200">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-medium tracking-tight text-zinc-950">
                      {planName}
                    </p>
                    <Badge variant="secondary">
                      {isYearly ? "Yearly" : "Monthly"}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-zinc-500">
                    {selectedPlan?.description ??
                      "Everything you need to manage bookings and run daily resort operations."}
                  </p>
                  <Button type="button" variant="link" className="mt-2 px-0">
                    View plan features
                  </Button>
                </div>
              </div>

              <div className="border-l border-zinc-200 pl-8">
                <div className="flex items-baseline gap-2">
                  <NumberFlow
                    className="text-3xl font-semibold tracking-tight text-zinc-950"
                    value={displayedPrice}
                    format={{
                      style: "currency",
                      currency: "PHP",
                      maximumFractionDigits: 0,
                    }}
                  />
                  <span className="text-base font-normal text-zinc-500">
                    / {isYearly ? "year" : "month"}
                  </span>
                </div>
                <p className="mt-3 text-sm text-zinc-500">
                  {isYearly ? "Billed yearly" : "Billed monthly"}
                </p>
                <p className="mt-2 text-sm text-zinc-500">
                  {formatPhp(yearlyPrice)} billed every year
                </p>
                {isYearly ? (
                  <Badge
                    variant="ghost"
                    className="mt-4 border-emerald-600 bg-emerald-200/50 font-semibold text-emerald-600"
                  >
                    Save {formatPhp(annualSavings)}
                  </Badge>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
            Billing Summary
          </h2>
          <Card className="mt-6 rounded-2xl border-zinc-200 py-0 shadow-none">
            <CardContent className="space-y-5 px-6 py-6 text-sm text-zinc-700">
              <div className="flex items-center justify-between">
                <span>
                  {planName} ({isYearly ? "Yearly" : "Monthly"})
                </span>
                <span>{formatPhp(displayedPrice)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Team Members</span>
                <span>{teamSeatLabel}</span>
              </div>
              {isYearly ? (
                <div className="flex items-center justify-between">
                  <span>Annual Savings</span>
                  <span>- {formatPhp(annualSavings)} / year</span>
                </div>
              ) : null}
              <div className="border-t border-zinc-200 pt-3 text-lg font-semibold text-zinc-950">
                <div className="flex items-center justify-between">
                  <span>Total</span>
                  <span>
                    {formatPhp(displayedPrice)} /{" "}
                    {isYearly ? "year" : "month"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
            <CircleHelp className="size-4" />
            You won&apos;t be charged until your onboarding is complete.
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
            Billing Information
          </h2>
          <div className="mt-8 space-y-7">
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_110px_220px]">
              <LabeledField label="Billing Email">
                <Input
                  placeholder="Enter billing email"
                  value={data.billingEmail}
                  onChange={(event) => onChange("billingEmail", event.target.value)}
                />
              </LabeledField>
              <LabeledField label="Code">
                <Select
                  value={data.billingPhoneCountryCode}
                  onValueChange={(value) => onChange("billingPhoneCountryCode", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="+63" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+63">+63</SelectItem>
                  </SelectContent>
                </Select>
              </LabeledField>
              <LabeledField label="Phone Number">
                <Input
                  placeholder="Enter phone number"
                  value={data.billingPhoneNumber}
                  onChange={(event) => onChange("billingPhoneNumber", event.target.value)}
                />
              </LabeledField>
            </div>

            <LabeledField label="Billing Address">
              <Input
                placeholder="Enter billing address"
                value={data.billingAddress}
                onChange={(event) => onChange("billingAddress", event.target.value)}
              />
            </LabeledField>

            <div className="grid gap-6 md:grid-cols-3">
              <LabeledField label="City">
                <Input
                  placeholder="Enter city"
                  value={data.billingCity}
                  onChange={(event) => onChange("billingCity", event.target.value)}
                />
              </LabeledField>
              <LabeledField label="State / Province">
                <Input
                  placeholder="Enter state"
                  value={data.billingStateProvince}
                  onChange={(event) => onChange("billingStateProvince", event.target.value)}
                />
              </LabeledField>
              <LabeledField label="ZIP / Postal Code">
                <Input
                  placeholder="Enter ZIP code"
                  value={data.billingPostalCode}
                  onChange={(event) => onChange("billingPostalCode", event.target.value)}
                />
              </LabeledField>
            </div>

            <LabeledField label="Country">
              <Select
                value={data.billingCountry.toLowerCase()}
                onValueChange={(value) =>
                  onChange("billingCountry", value === "philippines" ? "Philippines" : value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="philippines">Philippines</SelectItem>
                </SelectContent>
              </Select>
            </LabeledField>

            <LabeledField label="Payment Method">
              <Select
                value={data.paymentMethod}
                onValueChange={(value) =>
                  onChange(
                    "paymentMethod",
                    value as OnboardingFormData["planBilling"]["paymentMethod"],
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="e_wallet">E-Wallet</SelectItem>
                  <SelectItem value="cash_deposit">Cash Deposit</SelectItem>
                </SelectContent>
              </Select>
            </LabeledField>

            {data.paymentMethod === "credit_card" ? (
              <PaymentCardFields
                cardholderName={data.cardholderName}
                cardBrand={data.cardBrand}
                cardLastFour={data.cardLastFour}
                cardExpiry={data.cardExpiry}
                onChange={onChange}
              />
            ) : null}

            {data.paymentMethod !== "credit_card" ? (
              <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-zinc-200 bg-white">
                  {data.paymentMethod === "bank_transfer" ? (
                    <Landmark className="size-5" />
                  ) : (
                    <Wallet className="size-5" />
                  )}
                </div>
                <div>
                  <p className="text-base font-medium text-zinc-950">
                    {data.paymentMethod === "bank_transfer"
                      ? "Bank transfer selected"
                      : data.paymentMethod === "e_wallet"
                        ? "E-wallet selected"
                        : "Cash deposit selected"}
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">
                    You can finalize the exact billing account details later from your
                    billing settings after approval.
                  </p>
                </div>
              </div>
            ) : null}

            <div className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-5">
              <div>
                <p className="text-base font-medium text-zinc-950">Secure payment</p>
                <p className="mt-1 text-sm text-zinc-500">
                  You can update your payment method anytime from billing settings.
                </p>
              </div>
              <Button type="button" variant="outline" size="lg" disabled>
                Billing settings after approval
              </Button>
            </div>
          </div>
        </div>

        <ActionFooter
          onBack={onBack}
          onNext={onNext}
          hint="You can review and change this later."
          disabled={isSaving}
        />
      </div>
    </div>
  );
}
