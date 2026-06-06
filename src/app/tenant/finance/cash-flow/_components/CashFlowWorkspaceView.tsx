"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDaysIcon,
  CheckCircle2Icon,
  ReceiptTextIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { TuroInsightCard } from "@/app/admin/dashboard/_components/TuroInsightCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTRPC } from "@/trpc/client";
import { CashFlowTable } from "./CashFlowTable";
import {
  formatCashFlowMoney,
  type CashFlowDirection,
  type CashFlowStatus,
  type CashFlowType,
} from "./cash-flow-data";

type CashFlowWorkspaceViewProps = {
  ownerName: string;
  resortName: string;
};

type CashFlowFormMode = "income" | "expense";

type CashFlowFormState = {
  date: string;
  type: CashFlowType;
  guestOrVendor: string;
  method: string;
  amount: string;
  status: CashFlowStatus;
  owner: string;
};

const today = () => new Date().toISOString().slice(0, 10);

const initialFormState = (mode: CashFlowFormMode): CashFlowFormState => ({
  date: today(),
  type: mode === "income" ? "DEPOSIT" : "PETTY_CASH",
  guestOrVendor: "",
  method: mode === "income" ? "GCash" : "Cash release",
  amount: "",
  status: mode === "income" ? "COLLECTED" : "PENDING",
  owner: mode === "income" ? "Sales" : "Accounting",
});

export function CashFlowWorkspaceView({
  ownerName,
  resortName,
}: CashFlowWorkspaceViewProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const cashFlowQuery = useQuery(trpc.cashFlow.list.queryOptions());
  const [formMode, setFormMode] = React.useState<CashFlowFormMode>("income");
  const [formOpen, setFormOpen] = React.useState(false);
  const [form, setForm] = React.useState<CashFlowFormState>(() =>
    initialFormState("income"),
  );
  const rows = cashFlowQuery.data ?? [];
  const createCashFlowMutation = useMutation(
    trpc.cashFlow.create.mutationOptions({
      onSuccess: async () => {
        setFormOpen(false);
        await queryClient.invalidateQueries(trpc.cashFlow.list.queryOptions());
      },
    }),
  );

  const openCashFlowForm = (mode: CashFlowFormMode) => {
    setFormMode(mode);
    setForm(initialFormState(mode));
    setFormOpen(true);
  };

  const incomeAmount = rows.reduce(
    (sum, row) => sum + (row.direction === "INCOME" ? row.expectedCents : 0),
    0,
  );
  const expenseAmount = rows.reduce(
    (sum, row) => sum + (row.direction === "EXPENSE" ? row.expectedCents : 0),
    0,
  );
  const netCash = incomeAmount - expenseAmount;
  const collectedIncome = rows.reduce(
    (sum, row) => sum + (row.direction === "INCOME" ? row.collectedCents : 0),
    0,
  );
  const pendingAmount = rows.reduce(
    (sum, row) => sum + Math.max(row.expectedCents - row.collectedCents, 0),
    0,
  );
  const overdueCount = rows.filter((row) => row.status === "OVERDUE").length;
  const insightMessage = `${resortName} has ${formatCashFlowMoney(pendingAmount)} still pending across ${rows.length} finance records. Prioritize overdue refunds and booking balances before the next reconciliation cut-off.`;
  const generatedReference = generateCashFlowReference(
    form.type,
    form.date,
    rows.length + 1,
  );

  const handleCreateRecord = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const amount = Number.parseFloat(form.amount);
    if (!form.guestOrVendor.trim() || amount <= 0) {
      return;
    }

    const direction: CashFlowDirection =
      formMode === "income" ? "INCOME" : "EXPENSE";

    createCashFlowMutation.mutate({
      date: form.date,
      direction,
      type: form.type,
      guestOrVendor: form.guestOrVendor.trim(),
      reference: generatedReference,
      method: form.method.trim() || "--",
      amountCents: Math.round(amount * 100),
      status: form.status,
      owner: form.owner.trim() || (formMode === "income" ? "Sales" : "Accounting"),
    });
  };

  return (
    <main className="flex flex-1 flex-col gap-6">
      <TuroInsightCard message={insightMessage} userName={ownerName} />

      <section className="overflow-hidden rounded-xl border bg-[radial-gradient(circle_at_top_left,rgba(244,244,245,0.96),rgba(255,255,255,1)_46%,rgba(244,244,245,0.84))] p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1.5">
                <ReceiptTextIcon className="size-3.5" />
                Finance
              </Badge>
              <Badge variant="secondary">Cash flow lifecycle</Badge>
              <Badge variant="secondary">Reconciliation</Badge>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Cash Flow
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
              Track deposits, balance collections, refunds, petty cash releases,
              and bank matching in one finance queue for {resortName}.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button className="gap-2" onClick={() => openCashFlowForm("income")}>
              Add income
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => openCashFlowForm("expense")}
            >
              Add expense
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Income"
            value={formatCashFlowMoney(incomeAmount)}
            detail={`${formatCashFlowMoney(collectedIncome)} collected`}
            icon={<ReceiptTextIcon className="size-4 text-muted-foreground" />}
          />
          <SummaryCard
            label="Expenses"
            value={formatCashFlowMoney(expenseAmount)}
            detail="Refunds and cash releases"
            icon={<CheckCircle2Icon className="size-4 text-muted-foreground" />}
          />
          <SummaryCard
            label="Net cash"
            value={formatCashFlowMoney(netCash)}
            detail={`${formatCashFlowMoney(pendingAmount)} pending`}
            icon={<CalendarDaysIcon className="size-4 text-muted-foreground" />}
          />
          <SummaryCard
            label="Exceptions"
            value={`${overdueCount}`}
            detail="Overdue finance records"
            icon={<TriangleAlertIcon className="size-4 text-muted-foreground" />}
          />
        </div>
      </section>

      <CashFlowTable
        data={rows}
        isLoading={cashFlowQuery.isLoading}
        emptyLabel="No cash flow records match your filters."
      />

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl!">
          <form onSubmit={handleCreateRecord}>
            <DialogHeader>
              <DialogTitle>
                {formMode === "income" ? "Add income" : "Add expense"}
              </DialogTitle>
              <DialogDescription>
                Create a cash-flow record for the tenant finance table.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-5 grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="cash-flow-date">Date</Label>
                <Input
                  id="cash-flow-date"
                  type="date"
                  value={form.date}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      date: event.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Type</Label>
                  <Select
                    value={form.type}
                    onValueChange={(value: CashFlowType) =>
                      setForm((current) => ({ ...current, type: value }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {formMode === "income" ? (
                        <>
                          <SelectItem value="DEPOSIT">Deposit</SelectItem>
                          <SelectItem value="BALANCE">Balance</SelectItem>
                          <SelectItem value="BANK_MATCH">Bank match</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="PETTY_CASH">Petty cash</SelectItem>
                          <SelectItem value="REFUND">Refund</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(value: CashFlowStatus) =>
                      setForm((current) => ({ ...current, status: value }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COLLECTED">Collected</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="OVERDUE">Overdue</SelectItem>
                      <SelectItem value="RECONCILED">Reconciled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cash-flow-name">
                  {formMode === "income" ? "Guest / booking" : "Vendor / expense"}
                </Label>
                <Input
                  id="cash-flow-name"
                  value={form.guestOrVendor}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      guestOrVendor: event.target.value,
                    }))
                  }
                  placeholder={
                    formMode === "income"
                      ? "Guest name or booking group"
                      : "Vendor, request, or expense name"
                  }
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="cash-flow-reference">Reference</Label>
                  <Input
                    id="cash-flow-reference"
                    value={generatedReference}
                    readOnly
                    className="bg-muted"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="cash-flow-method">Method</Label>
                  <Input
                    id="cash-flow-method"
                    value={form.method}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        method: event.target.value,
                      }))
                    }
                    placeholder="GCash, bank transfer, cash release..."
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="cash-flow-amount">Amount</Label>
                  <Input
                    id="cash-flow-amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.amount}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        amount: event.target.value,
                      }))
                    }
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="cash-flow-owner">Owner</Label>
                  <Input
                    id="cash-flow-owner"
                    value={form.owner}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        owner: event.target.value,
                      }))
                    }
                    placeholder="Sales, Accounting, Owner approval..."
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="mt-6 gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createCashFlowMutation.isPending}>
                {createCashFlowMutation.isPending
                  ? "Saving..."
                  : formMode === "income"
                    ? "Add income"
                    : "Add expense"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function generateCashFlowReference(
  type: CashFlowType,
  dateIso: string,
  sequence: number,
) {
  const prefixByType: Record<CashFlowType, string> = {
    DEPOSIT: "DP",
    BALANCE: "BAL",
    REFUND: "RF",
    PETTY_CASH: "PC",
    BANK_MATCH: "BNK",
  };
  const compactDate = dateIso.replaceAll("-", "").slice(2);
  return `${prefixByType[type]}-${compactDate}-${String(sequence).padStart(4, "0")}`;
}

function SummaryCard({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-background/90 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs uppercase text-muted-foreground">{label}</div>
        {icon}
      </div>
      <div className="mt-3 text-2xl font-semibold">{value}</div>
      <div className="mt-2 text-sm text-muted-foreground">{detail}</div>
    </div>
  );
}
