"use client";

import { Building2, CreditCard, Landmark, ShieldCheck, WalletCards } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { OnboardingFormData } from "@/app/auth/onboarding/_lib/schema";
import { ActionFooter, LabeledField, StepHeader } from "../shared";
import { PaymentCardFields } from "./PaymentCardFields";

type PaymentMethod = OnboardingFormData["planBilling"]["paymentMethod"];

const paymentMethods = [
  {
    value: "credit_card",
    title: "Card",
    description: "Connect a business card for guest collections and invoices.",
    icon: CreditCard,
  },
  {
    value: "bank_transfer",
    title: "Bank",
    description: "Add a settlement bank account for direct transfers.",
    icon: Landmark,
  },
  {
    value: "e_wallet",
    title: "E-wallet",
    description: "Link GCash, Maya, or another local wallet account.",
    icon: WalletCards,
  },
] as const satisfies ReadonlyArray<{
  value: PaymentMethod;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}>;

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
  const selectedMethod = paymentMethods.find((method) => method.value === data.paymentMethod);

  function selectPaymentMethod(value: PaymentMethod) {
    onChange("paymentMethod", value);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <StepHeader
        title="Connect Payment Method"
        description="Add the account your resort will use for guest payments, deposits, refunds, and collection tracking."
        onBack={onBack}
      />

      <div className="mt-10 space-y-8">
        <Card className="rounded-2xl border-zinc-200 py-0 shadow-none">
          <CardContent className="grid gap-5 px-6 py-6 md:grid-cols-[minmax(0,1fr)_280px]">
            <div className="flex gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50">
                <Building2 className="size-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-medium tracking-tight text-zinc-950">
                    Subscription billing is handled by Polar
                  </p>
                  <Badge variant="secondary">
                    {data.subscriptionPlan
                      .split("_")
                      .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
                      .join(" ")}
                  </Badge>
                </div>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  This step is for your resort payment rails, not your ResortCloud
                  subscription checkout. You can still manage subscription changes from
                  billing after onboarding.
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-sm text-zinc-600">
              <div className="flex items-center gap-2 font-medium text-zinc-950">
                <ShieldCheck className="size-4" />
                Secure draft
              </div>
              <p className="mt-2 leading-6">
                Sensitive full card or bank numbers are not stored here. Keep only
                masked details for operations visibility.
              </p>
            </div>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
            Payment Rail
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              const isSelected = data.paymentMethod === method.value;

              return (
                <button
                  key={method.value}
                  type="button"
                  onClick={() => selectPaymentMethod(method.value)}
                  className={[
                    "rounded-2xl border px-5 py-5 text-left transition",
                    isSelected
                      ? "border-black bg-black text-white"
                      : "border-zinc-200 bg-white text-zinc-950 hover:border-zinc-400",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "flex size-10 items-center justify-center rounded-2xl border",
                      isSelected
                        ? "border-white/25 bg-white/10"
                        : "border-zinc-200 bg-zinc-50",
                    ].join(" ")}
                  >
                    <Icon className="size-5" />
                  </div>
                  <p className="mt-5 font-medium">{method.title}</p>
                  <p
                    className={[
                      "mt-2 text-sm leading-6",
                      isSelected ? "text-zinc-200" : "text-zinc-500",
                    ].join(" ")}
                  >
                    {method.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
            Account Details
          </h2>
          <div className="mt-6 space-y-6">
            <LabeledField label="Account Label">
              <Input
                placeholder="Example: Primary collection account"
                value={data.paymentAccountLabel}
                onChange={(event) => onChange("paymentAccountLabel", event.target.value)}
              />
            </LabeledField>

            {data.paymentMethod === "credit_card" ? (
              <PaymentCardFields
                cardholderName={data.cardholderName}
                cardBrand={data.cardBrand}
                cardLastFour={data.cardLastFour}
                cardExpiry={data.cardExpiry}
                onChange={onChange}
              />
            ) : (
              <Card className="rounded-2xl border-zinc-200 py-0 shadow-none">
                <CardContent className="space-y-6 px-5 py-5">
                  <div className="grid gap-5 md:grid-cols-2">
                    <LabeledField
                      label={
                        data.paymentMethod === "bank_transfer"
                          ? "Bank Name"
                          : "Wallet Provider"
                      }
                    >
                      <Input
                        placeholder={
                          data.paymentMethod === "bank_transfer"
                            ? "Example: BDO"
                            : "Example: GCash"
                        }
                        value={data.paymentProviderName}
                        onChange={(event) =>
                          onChange("paymentProviderName", event.target.value)
                        }
                      />
                    </LabeledField>
                    <LabeledField
                      label={
                        data.paymentMethod === "bank_transfer"
                          ? "Account Name"
                          : "Wallet Account Name"
                      }
                    >
                      <Input
                        placeholder="Registered account name"
                        value={data.paymentAccountName}
                        onChange={(event) =>
                          onChange("paymentAccountName", event.target.value)
                        }
                      />
                    </LabeledField>
                  </div>
                  <LabeledField
                    label={
                      data.paymentMethod === "bank_transfer"
                        ? "Masked Account Number"
                        : "Masked Wallet Number"
                    }
                  >
                    <Input
                      placeholder={
                        data.paymentMethod === "bank_transfer"
                          ? "Example: **** 4821"
                          : "Example: 09*****1234"
                      }
                      value={data.paymentMaskedDetails}
                      onChange={(event) =>
                        onChange("paymentMaskedDetails", event.target.value)
                      }
                    />
                  </LabeledField>
                </CardContent>
              </Card>
            )}

            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-5">
              <p className="font-medium tracking-tight text-zinc-950">
                {selectedMethod?.title ?? "Payment"} connection
              </p>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-500">
                This default account will appear in payment integrations and
                operations reports. You can add more accounts later under
                Integrations &gt; Payment Accounts.
              </p>
            </div>
          </div>
        </div>

        <ActionFooter
          onBack={onBack}
          onNext={onNext}
          hint="You can add channels and more payment accounts after onboarding."
          disabled={isSaving}
        />
      </div>
    </div>
  );
}
