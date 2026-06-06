"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2Icon,
  ClockIcon,
  PlusIcon,
  ReceiptTextIcon,
  TriangleAlertIcon,
  WalletIcon,
} from "lucide-react";
import Link from "next/link";
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
import { Textarea } from "@/components/ui/textarea";
import { useTRPC } from "@/trpc/client";
import {
  formatPettyCashMoney,
  type PettyCashRow,
  type PettyCashStatus,
} from "./petty-cash-data";
import { PettyCashTable } from "./PettyCashTable";

type PettyCashWorkspaceViewProps = {
  ownerName: string;
  resortName: string;
};

type PettyCashFormState = {
  neededBy: string;
  requester: string;
  department: string;
  category: string;
  purpose: string;
  amount: string;
  custodian: string;
  notes: string;
};

const today = () => new Date().toISOString().slice(0, 10);

const initialFormState = (): PettyCashFormState => ({
  neededBy: today(),
  requester: "",
  department: "",
  category: "",
  purpose: "",
  amount: "",
  custodian: "Accounting",
  notes: "",
});

export function PettyCashWorkspaceView({
  ownerName,
  resortName,
}: PettyCashWorkspaceViewProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const pettyCashQuery = useQuery(trpc.pettyCash.list.queryOptions());
  const rows = pettyCashQuery.data ?? [];
  const [formOpen, setFormOpen] = React.useState(false);
  const [form, setForm] = React.useState<PettyCashFormState>(() =>
    initialFormState(),
  );

  const createMutation = useMutation(
    trpc.pettyCash.create.mutationOptions({
      onSuccess: async () => {
        setFormOpen(false);
        setForm(initialFormState());
        await queryClient.invalidateQueries(trpc.pettyCash.list.queryOptions());
      },
    }),
  );
  const updateStatusMutation = useMutation(
    trpc.pettyCash.updateStatus.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.pettyCash.list.queryOptions());
      },
    }),
  );

  const requestedAmount = rows.reduce(
    (sum, row) => sum + row.amountCents,
    0,
  );
  const releasedAmount = rows.reduce(
    (sum, row) => sum + row.releasedCents,
    0,
  );
  const liquidatedAmount = rows.reduce(
    (sum, row) => sum + row.liquidatedCents,
    0,
  );
  const openCount = rows.filter((row) =>
    ["REQUESTED", "APPROVED", "RELEASED"].includes(row.status),
  ).length;
  const overdueCount = rows.filter(
    (row) =>
      row.neededBy < today() &&
      !["LIQUIDATED", "REJECTED"].includes(row.status),
  ).length;
  const generatedReference = generatePettyCashReference(
    form.neededBy,
    rows.length + 1,
  );
  const insightMessage = `${resortName} has ${openCount} open petty cash request(s), with ${formatPettyCashMoney(releasedAmount - liquidatedAmount)} still awaiting liquidation.`;

  const openRequestForm = () => {
    setForm(initialFormState());
    setFormOpen(true);
  };

  const handleCreateRequest = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const amount = Number.parseFloat(form.amount);

    if (
      amount <= 0 ||
      !form.requester.trim() ||
      !form.department.trim() ||
      !form.category.trim() ||
      !form.purpose.trim()
    ) {
      return;
    }

    createMutation.mutate({
      neededBy: form.neededBy,
      requester: form.requester.trim(),
      department: form.department.trim(),
      category: form.category.trim(),
      purpose: form.purpose.trim(),
      reference: generatedReference,
      amountCents: Math.round(amount * 100),
      custodian: form.custodian.trim(),
      notes: form.notes.trim() || undefined,
    });
  };

  const handleUpdateStatus = React.useCallback(
    (row: PettyCashRow, status: PettyCashStatus) => {
      updateStatusMutation.mutate({
        id: row.id,
        status,
      });
    },
    [updateStatusMutation],
  );

  return (
    <main className="flex flex-1 flex-col gap-6">
      <TuroInsightCard message={insightMessage} userName={ownerName} />

      <section className="overflow-hidden rounded-xl border bg-[radial-gradient(circle_at_top_left,rgba(244,244,245,0.96),rgba(255,255,255,1)_46%,rgba(244,244,245,0.84))] p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1.5">
                <WalletIcon className="size-3.5" />
                Finance
              </Badge>
              <Badge variant="secondary">Petty cash</Badge>
              <Badge variant="secondary">Liquidation</Badge>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Petty Cash
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
              Request, approve, release, and liquidate operational cash for{" "}
              {resortName}.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button className="gap-2" onClick={openRequestForm}>
              <PlusIcon className="size-4" />
              Create request
            </Button>
            <Button asChild variant="outline">
              <Link href="/tenant/finance/cash-flow">Cash flow</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/tenant/finance/accounting">Accounting</Link>
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Requested"
            value={formatPettyCashMoney(requestedAmount)}
            detail={`${openCount} open request(s)`}
            icon={<ReceiptTextIcon className="size-4 text-muted-foreground" />}
          />
          <SummaryCard
            label="Released"
            value={formatPettyCashMoney(releasedAmount)}
            detail="Cash already issued"
            icon={<CheckCircle2Icon className="size-4 text-muted-foreground" />}
          />
          <SummaryCard
            label="Liquidated"
            value={formatPettyCashMoney(liquidatedAmount)}
            detail="Receipts accounted for"
            icon={<ClockIcon className="size-4 text-muted-foreground" />}
          />
          <SummaryCard
            label="Exceptions"
            value={`${overdueCount}`}
            detail="Past needed-by date"
            icon={<TriangleAlertIcon className="size-4 text-muted-foreground" />}
          />
        </div>
      </section>

      <PettyCashTable
        data={rows}
        isLoading={pettyCashQuery.isLoading}
        emptyLabel="No petty cash requests yet."
        onUpdateStatus={handleUpdateStatus}
      />

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl!">
          <form onSubmit={handleCreateRequest}>
            <DialogHeader>
              <DialogTitle>Create petty cash request</DialogTitle>
              <DialogDescription>
                Add the cash requirement and keep approval/liquidation traceable.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-5 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="petty-needed-by">Needed by</Label>
                  <Input
                    id="petty-needed-by"
                    type="date"
                    value={form.neededBy}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        neededBy: event.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="petty-reference">Reference</Label>
                  <Input
                    id="petty-reference"
                    value={generatedReference}
                    readOnly
                    className="bg-muted"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="petty-requester">Requester</Label>
                  <Input
                    id="petty-requester"
                    value={form.requester}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        requester: event.target.value,
                      }))
                    }
                    placeholder="Staff or department lead"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="petty-department">Department</Label>
                  <Input
                    id="petty-department"
                    value={form.department}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        department: event.target.value,
                      }))
                    }
                    placeholder="Housekeeping, Kitchen, Front Office..."
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="petty-category">Category</Label>
                  <Input
                    id="petty-category"
                    value={form.category}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        category: event.target.value,
                      }))
                    }
                    placeholder="Supplies, transport, repairs..."
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="petty-amount">Amount</Label>
                  <Input
                    id="petty-amount"
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
              </div>

              <div className="grid gap-2">
                <Label htmlFor="petty-purpose">Purpose</Label>
                <Textarea
                  id="petty-purpose"
                  value={form.purpose}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      purpose: event.target.value,
                    }))
                  }
                  placeholder="What will this cash be used for?"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="petty-custodian">Custodian</Label>
                  <Input
                    id="petty-custodian"
                    value={form.custodian}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        custodian: event.target.value,
                      }))
                    }
                    placeholder="Accounting"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="petty-notes">Notes</Label>
                  <Input
                    id="petty-notes"
                    value={form.notes}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        notes: event.target.value,
                      }))
                    }
                    placeholder="Optional"
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
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create request"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function generatePettyCashReference(dateIso: string, sequence: number) {
  const compactDate = dateIso.replaceAll("-", "").slice(2);
  return `PC-${compactDate}-${String(sequence).padStart(4, "0")}`;
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
