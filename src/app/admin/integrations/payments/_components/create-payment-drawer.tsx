"use client";

import * as React from "react";
import images from "react-payment-inputs/images";
import { usePaymentInputs } from "react-payment-inputs";
import type { CardImages } from "react-payment-inputs/images";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { PaymentIntegrationRecord } from "./payments-data";

type PaymentDraft = {
  providerName: string;
  category: PaymentIntegrationRecord["category"];
  accountName: string;
  accountNumber: string;
  expiryDate: string;
  cvc: string;
  integrationStatus: PaymentIntegrationRecord["integrationStatus"];
  webhookHealth: PaymentIntegrationRecord["webhookHealth"];
  settlementWindow: string;
  feeModel: string;
  supportedTenants: string;
  assignedTo: string;
  note: string;
};

const createEmptyDraft = (): PaymentDraft => ({
  providerName: "",
  category: "E-Wallet",
  accountName: "",
  accountNumber: "",
  expiryDate: "",
  cvc: "",
  integrationStatus: "Sandbox",
  webhookHealth: "Healthy",
  settlementWindow: "",
  feeModel: "",
  supportedTenants: "0",
  assignedTo: "",
  note: "",
});

type CreatePaymentDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (record: Omit<PaymentIntegrationRecord, "id">) => void;
};

export const CreatePaymentDrawer = ({
  open,
  onOpenChange,
  onCreate,
}: CreatePaymentDrawerProps) => {
  const [draft, setDraft] = React.useState<PaymentDraft>(createEmptyDraft);
  const isCardCategory = draft.category === "Credit/Debit Card";
  const inputClassName =
    "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-ring/50 md:text-sm dark:bg-input/30";
  const {
    meta,
    getCardImageProps,
    getCardNumberProps,
    getExpiryDateProps,
    getCVCProps,
  } = usePaymentInputs();
  const paymentImages = images as unknown as CardImages;

  const handleCardNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleChange("accountNumber", event.target.value);
  };

  const handleExpiryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleChange("expiryDate", event.target.value);
  };

  const handleCvcChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleChange("cvc", event.target.value);
  };

  const handleChange = <K extends keyof PaymentDraft>(
    field: K,
    value: PaymentDraft[K],
  ) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = () => {
    if (
      !draft.providerName ||
      !draft.assignedTo ||
      !draft.feeModel ||
      !draft.accountName ||
      !draft.accountNumber
    ) {
      return;
    }

    onCreate({
      providerName: draft.providerName,
      category: draft.category,
      accountName: draft.accountName,
      accountNumber: draft.accountNumber,
      expiryDate: isCardCategory ? draft.expiryDate : undefined,
      cvc: isCardCategory ? draft.cvc : undefined,
      integrationStatus: draft.integrationStatus,
      webhookHealth: draft.webhookHealth,
      transactionVolume: 0,
      settlementWindow: draft.settlementWindow || "Pending settlement setup",
      feeModel: draft.feeModel,
      supportedTenants: Number(draft.supportedTenants || "0"),
      assignedTo: draft.assignedTo,
      lastUpdated: "Just now",
      note: draft.note || "New payment configuration created from the platform drawer.",
      priority: false,
    });

    setDraft(createEmptyDraft());
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
      <DrawerContent className="h-full w-full rounded-none">
        <DrawerHeader>
          <DrawerTitle>Create Payment Configuration</DrawerTitle>
          <DrawerDescription>
            Add a platform payment provider for tenant billing flows, guest payments,
            or settlement routing across the resort SaaS environment.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 space-y-5 overflow-y-auto px-4 pb-4">
          <div className="space-y-2">
            <Label htmlFor="provider-name">Provider name</Label>
            <Input
              id="provider-name"
              value={draft.providerName}
              onChange={(event) => handleChange("providerName", event.target.value)}
              placeholder="Example: GCash or Stripe Cards"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={draft.category}
                onValueChange={(value) =>
                  handleChange("category", value as PaymentIntegrationRecord["category"])
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="E-Wallet">E-Wallet</SelectItem>
                  <SelectItem value="Direct Debit">Direct Debit</SelectItem>
                  <SelectItem value="Retail Outlet">Retail Outlet</SelectItem>
                  <SelectItem value="Credit Cards">Credit Cards</SelectItem>
                  <SelectItem value="Cryptocurrency">Cryptocurrency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={draft.integrationStatus}
                onValueChange={(value) =>
                  handleChange(
                    "integrationStatus",
                    value as PaymentIntegrationRecord["integrationStatus"],
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Review">Review</SelectItem>
                  <SelectItem value="Sandbox">Sandbox</SelectItem>
                  <SelectItem value="Paused">Paused</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Webhook health</Label>
              <Select
                value={draft.webhookHealth}
                onValueChange={(value) =>
                  handleChange(
                    "webhookHealth",
                    value as PaymentIntegrationRecord["webhookHealth"],
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select webhook health" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Healthy">Healthy</SelectItem>
                  <SelectItem value="Watch">Watch</SelectItem>
                  <SelectItem value="Failing">Failing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supported-tenants">Supported tenants</Label>
              <Input
                id="supported-tenants"
                type="number"
                min="0"
                value={draft.supportedTenants}
                onChange={(event) => handleChange("supportedTenants", event.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="account-name">Account name</Label>
              <Input
                id="account-name"
                value={draft.accountName}
                onChange={(event) => handleChange("accountName", event.target.value)}
                placeholder="Enter account name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="account-number">
                {isCardCategory ? "Card number" : "Account number"}
              </Label>

              {isCardCategory ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 rounded-lg border border-input bg-transparent px-2.5 py-1.5 dark:bg-input/30">
                    <svg
                      {...getCardImageProps({ images: paymentImages })}
                      className="h-6 w-10 shrink-0"
                    />
                    <input
                      {...getCardNumberProps({
                        onChange: handleCardNumberChange,
                      })}
                      value={draft.accountNumber}
                      className={cn(inputClassName, "h-auto border-0 bg-transparent px-0 py-0")}
                    />
                  </div>
                  {meta.cardType?.displayName ? (
                    <p className="text-xs text-muted-foreground">
                      Detected card provider: {meta.cardType.displayName}
                    </p>
                  ) : null}
                </div>
              ) : (
                <Input
                  id="account-number"
                  value={draft.accountNumber}
                  onChange={(event) =>
                    handleChange("accountNumber", event.target.value)
                  }
                  placeholder="Enter account number"
                />
              )}
            </div>
          </div>

          {isCardCategory ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="card-expiry">Expiry date</Label>
                <input
                  {...getExpiryDateProps({
                    onChange: handleExpiryChange,
                  })}
                  id="card-expiry"
                  value={draft.expiryDate}
                  className={inputClassName}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="card-cvc">CVC</Label>
                <input
                  {...getCVCProps({
                    onChange: handleCvcChange,
                  })}
                  id="card-cvc"
                  value={draft.cvc}
                  className={inputClassName}
                />
              </div>
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="settlement-window">Settlement window</Label>
              <Input
                id="settlement-window"
                value={draft.settlementWindow}
                onChange={(event) => handleChange("settlementWindow", event.target.value)}
                placeholder="Example: T+1 settlement"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assigned-to">Assigned owner</Label>
              <Input
                id="assigned-to"
                value={draft.assignedTo}
                onChange={(event) => handleChange("assignedTo", event.target.value)}
                placeholder="Enter assignee"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fee-model">Fee model</Label>
            <Input
              id="fee-model"
              value={draft.feeModel}
              onChange={(event) => handleChange("feeModel", event.target.value)}
              placeholder="Example: 3.5% + fixed fee"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-note">Configuration note</Label>
            <Textarea
              id="payment-note"
              value={draft.note}
              onChange={(event) => handleChange("note", event.target.value)}
              placeholder="Add notes about onboarding, webhook setup, or tenant rollout coverage."
              className="min-h-28 resize-none"
            />
          </div>
        </div>

        <DrawerFooter className="border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create payment config</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
