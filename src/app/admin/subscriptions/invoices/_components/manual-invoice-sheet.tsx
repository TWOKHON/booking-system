"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import type { InvoiceRecord } from "./invoices-data";

type ManualInvoiceDraft = {
  tenantName: string;
  resortName: string;
  invoiceTitle: string;
  invoiceCategory: Exclude<InvoiceRecord["invoiceCategory"], "Plan Subscription">;
  amount: string;
  dueDate: string;
  billingPeriod: string;
  assignedTo: string;
  note: string;
};

const createEmptyDraft = (): ManualInvoiceDraft => ({
  tenantName: "",
  resortName: "",
  invoiceTitle: "",
  invoiceCategory: "Add-on Charge",
  amount: "",
  dueDate: "",
  billingPeriod: "",
  assignedTo: "",
  note: "",
});

type ManualInvoiceSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateInvoice: (invoice: Omit<InvoiceRecord, "id">) => void;
};

export const ManualInvoiceSheet = ({
  open,
  onOpenChange,
  onCreateInvoice,
}: ManualInvoiceSheetProps) => {
  const [draft, setDraft] = React.useState<ManualInvoiceDraft>(createEmptyDraft);

  const handleChange = <K extends keyof ManualInvoiceDraft>(
    field: K,
    value: ManualInvoiceDraft[K],
  ) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = () => {
    if (
      !draft.tenantName ||
      !draft.resortName ||
      !draft.invoiceTitle ||
      !draft.amount ||
      !draft.dueDate ||
      !draft.assignedTo
    ) {
      return;
    }

    onCreateInvoice({
      tenantName: draft.tenantName,
      resortName: draft.resortName,
      invoiceTitle: draft.invoiceTitle,
      invoiceSource: "Manual",
      invoiceCategory: draft.invoiceCategory,
      invoiceStatus: "Draft",
      amount: Number(draft.amount),
      dueDate: draft.dueDate,
      billingPeriod: draft.billingPeriod || "One-time",
      paymentStatus: "Watch",
      assignedTo: draft.assignedTo,
      note: draft.note || "Manual invoice created for additional tenant billing.",
      priority: false,
    });

    setDraft(createEmptyDraft());
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="max-w-xl!">
        <SheetHeader>
          <SheetTitle>Create Manual Invoice</SheetTitle>
          <SheetDescription>
            Use manual invoices for add-ons, support upgrades, onboarding fees, and
            other charges outside the automatic plan subscription cycle.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-5 overflow-y-auto px-4 pb-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tenant-name">Tenant</Label>
              <Input
                id="tenant-name"
                value={draft.tenantName}
                onChange={(event) => handleChange("tenantName", event.target.value)}
                placeholder="Enter tenant name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resort-name">Resort</Label>
              <Input
                id="resort-name"
                value={draft.resortName}
                onChange={(event) => handleChange("resortName", event.target.value)}
                placeholder="Enter resort name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="invoice-title">Invoice title</Label>
            <Input
              id="invoice-title"
              value={draft.invoiceTitle}
              onChange={(event) => handleChange("invoiceTitle", event.target.value)}
              placeholder="Example: Channel manager add-on"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Invoice category</Label>
              <Select
                value={draft.invoiceCategory}
                onValueChange={(value) =>
                  handleChange(
                    "invoiceCategory",
                    value as ManualInvoiceDraft["invoiceCategory"],
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select invoice category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Add-on Charge">Add-on Charge</SelectItem>
                  <SelectItem value="SMS Overage">SMS Overage</SelectItem>
                  <SelectItem value="Setup Fee">Setup Fee</SelectItem>
                  <SelectItem value="Support Upgrade">Support Upgrade</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="invoice-amount">Amount</Label>
              <Input
                id="invoice-amount"
                type="number"
                min="0"
                value={draft.amount}
                onChange={(event) => handleChange("amount", event.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="due-date">Due date</Label>
              <Input
                id="due-date"
                type="date"
                value={draft.dueDate}
                onChange={(event) => handleChange("dueDate", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="billing-period">Billing period</Label>
              <Input
                id="billing-period"
                value={draft.billingPeriod}
                onChange={(event) => handleChange("billingPeriod", event.target.value)}
                placeholder="Example: Apr 2026 or One-time"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assigned-to">Assigned billing owner</Label>
            <Input
              id="assigned-to"
              value={draft.assignedTo}
              onChange={(event) => handleChange("assignedTo", event.target.value)}
              placeholder="Enter assignee"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="invoice-note">Billing note</Label>
            <Textarea
              id="invoice-note"
              value={draft.note}
              onChange={(event) => handleChange("note", event.target.value)}
              placeholder="Add the reason for this manual invoice or the add-on being charged."
              className="min-h-28 resize-none"
            />
          </div>
        </div>

        <SheetFooter className="border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create invoice</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
