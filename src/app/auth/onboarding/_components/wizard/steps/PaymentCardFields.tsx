"use client";

import { useEffect, useId, useRef, type ChangeEvent } from "react";
import { CreditCardIcon } from "lucide-react";
import { usePaymentInputs } from "react-payment-inputs";
import images, { type CardImages } from "react-payment-inputs/images";
import { Input } from "@/components/ui/input";
import { LabeledField } from "../shared";

type CardField = "cardholderName" | "cardBrand" | "cardLastFour" | "cardExpiry";

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function PaymentCardFields({
  cardholderName,
  cardBrand,
  cardLastFour,
  cardExpiry,
  onChange,
}: {
  cardholderName: string;
  cardBrand: string;
  cardLastFour: string;
  cardExpiry: string;
  onChange: (field: CardField, value: string) => void;
}) {
  const id = useId();
  const onChangeRef = useRef(onChange);
  const { meta, getCardNumberProps, getExpiryDateProps, getCVCProps, getCardImageProps } =
    usePaymentInputs();

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onChangeRef.current("cardBrand", meta.cardType?.displayName ?? "");
  }, [meta.cardType?.displayName]);

  return (
    <div className="space-y-6 rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-5">
      <LabeledField label="Cardholder Name">
        <Input
          placeholder="Enter the cardholder name"
          value={cardholderName}
          onChange={(event) => onChange("cardholderName", event.target.value)}
        />
      </LabeledField>

      <LabeledField label="Card Details">
        <div className="space-y-3">
          <div className="relative focus-within:z-10">
            <Input
              {...getCardNumberProps({
                onChange: (event: ChangeEvent<HTMLInputElement>) => {
                  const digits = onlyDigits(event.target.value);
                  onChange("cardLastFour", digits.slice(-4));
                },
              })}
              id={`number-${id}`}
              className="pr-10"
              placeholder="Card number"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500">
              {meta.cardType ? (
                <svg
                  className="w-7 overflow-hidden"
                  {...getCardImageProps({
                    images: images as unknown as CardImages,
                  })}
                />
              ) : (
                <CreditCardIcon className="size-4" />
              )}
              <span className="sr-only">Card Provider</span>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Input
              {...getExpiryDateProps({
                onChange: (event: ChangeEvent<HTMLInputElement>) =>
                  onChange("cardExpiry", event.target.value),
              })}
              id={`expiry-${id}`}
              placeholder="MM/YY"
            />
            <Input {...getCVCProps()} id={`cvc-${id}`} placeholder="CVC" />
          </div>
        </div>
      </LabeledField>

      {cardBrand || cardLastFour || cardExpiry ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-600">
          {cardBrand ? `${cardBrand} ` : "Card "}
          {cardLastFour ? `ending in ${cardLastFour}` : "details entered"}
          {cardExpiry ? `, exp ${cardExpiry}` : ""}.
        </div>
      ) : null}

      <p className="text-xs text-zinc-500">
        For safety, only the cardholder name, brand, last 4 digits, and expiry are
        kept in your onboarding draft.
      </p>
    </div>
  );
}
