"use client";
"use no memo";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  ColumnDef,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowUpDown,
  Columns3,
  MoreHorizontalIcon,
  PencilLineIcon,
  PlusIcon,
  Search,
  ShieldCheckIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTRPC } from "@/trpc/client";

export type TenantPaymentAccountRecord = {
  id: string;
  accountLabel: string;
  accountType: PaymentAccountTypeValue;
  providerName: string;
  accountName: string;
  maskedDetails: string;
  isDefault: boolean;
  isActive: boolean;
  updatedAt: Date;
};

type PaymentAccountTypeValue =
  | "CREDIT_CARD"
  | "BANK_ACCOUNT"
  | "E_WALLET";

type PaymentAccountFormValues = {
  accountLabel: string;
  accountType: PaymentAccountTypeValue;
  providerName: string;
  accountName: string;
  maskedDetails: string;
  isDefault: boolean;
};

const paymentAccountTypeOptions: Array<{
  value: PaymentAccountTypeValue;
  label: string;
}> = [
  { value: "CREDIT_CARD", label: "Credit Card" },
  { value: "BANK_ACCOUNT", label: "Bank Account" },
  { value: "E_WALLET", label: "E-Wallet" },
];

const defaultPaymentAccountForm: PaymentAccountFormValues = {
  accountLabel: "",
  accountType: "BANK_ACCOUNT",
  providerName: "",
  accountName: "",
  maskedDetails: "",
  isDefault: false,
};

function paymentAccountTypeToLabel(type: PaymentAccountTypeValue) {
  return (
    paymentAccountTypeOptions.find((option) => option.value === type)?.label ??
    type
  );
}

function sortableHeader(
  label: string,
  column: {
    getIsSorted: () => false | "asc" | "desc";
    toggleSorting: (desc?: boolean) => void;
  },
) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-2 h-8 px-2 text-left font-medium"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {label}
      <ArrowUpDown className="ml-1 size-3.5" />
    </Button>
  );
}

function buildFormFromAccount(
  account: TenantPaymentAccountRecord,
): PaymentAccountFormValues {
  return {
    accountLabel: account.accountLabel,
    accountType: account.accountType,
    providerName: account.providerName,
    accountName: account.accountName,
    maskedDetails: account.maskedDetails,
    isDefault: account.isDefault,
  };
}

function PaymentAccountFormDialog({
  mode,
  initialValues,
  onSubmit,
  isPending,
  trigger,
  open,
  onOpenChange,
}: {
  mode: "create" | "edit";
  initialValues: PaymentAccountFormValues;
  onSubmit: (values: PaymentAccountFormValues) => Promise<void>;
  isPending: boolean;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [form, setForm] = React.useState<PaymentAccountFormValues>(initialValues);
  const resolvedOpen = open ?? internalOpen;
  const setResolvedOpen = onOpenChange ?? setInternalOpen;

  React.useEffect(() => {
    if (resolvedOpen) {
      setForm(initialValues);
    }
  }, [initialValues, resolvedOpen]);

  function updateField<Key extends keyof PaymentAccountFormValues>(
    key: Key,
    value: PaymentAccountFormValues[Key],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  const isSubmitDisabled =
    !form.accountLabel.trim() ||
    !form.providerName.trim() ||
    !form.accountName.trim() ||
    !form.maskedDetails.trim();

  async function handleSubmit() {
    if (isSubmitDisabled) {
      return;
    }

    await onSubmit(form);
    setResolvedOpen(false);
  }

  return (
    <Dialog open={resolvedOpen} onOpenChange={setResolvedOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add payment account" : "Edit payment account"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add the account details your team should recognize inside ResortCloud."
              : "Update this payment account so the team sees the right collection and settlement details."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`${mode}-accountLabel`}>Account label</Label>
            <Input
              id={`${mode}-accountLabel`}
              placeholder="e.g. Main resort GCash"
              value={form.accountLabel}
              onChange={(event) =>
                updateField("accountLabel", event.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${mode}-accountType`}>Account type</Label>
            <Select
              value={form.accountType}
              onValueChange={(value) =>
                updateField("accountType", value as PaymentAccountTypeValue)
              }
            >
              <SelectTrigger className="w-full" id={`${mode}-accountType`}>
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                {paymentAccountTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${mode}-providerName`}>Provider</Label>
            <Input
              id={`${mode}-providerName`}
              placeholder="e.g. BPI, GCash, Visa"
              value={form.providerName}
              onChange={(event) =>
                updateField("providerName", event.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${mode}-accountName`}>Account name</Label>
            <Input
              id={`${mode}-accountName`}
              placeholder="e.g. Alrio Private Resort Inc."
              value={form.accountName}
              onChange={(event) =>
                updateField("accountName", event.target.value)
              }
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor={`${mode}-maskedDetails`}>Masked details</Label>
            <Input
              id={`${mode}-maskedDetails`}
              placeholder="e.g. **** 4242, 0917••••321, ****1234"
              value={form.maskedDetails}
              onChange={(event) =>
                updateField("maskedDetails", event.target.value)
              }
            />
          </div>
        </div>

        <label className="flex items-start gap-3 rounded-lg border bg-muted/30 px-4 py-3">
          <Checkbox
            checked={form.isDefault}
            onCheckedChange={(value) => updateField("isDefault", value === true)}
            className="mt-0.5"
          />
          <div>
            <p className="text-sm font-medium">Set as default account</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Use this when the account should be the primary payment rail your
              team references first.
            </p>
          </div>
        </label>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setResolvedOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitDisabled || isPending}
          >
            {isPending
              ? mode === "create"
                ? "Saving..."
                : "Updating..."
              : mode === "create"
                ? "Save account"
                : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeletePaymentAccountAlert({
  accountLabel,
  onConfirm,
  isPending,
  trigger,
  open,
  onOpenChange,
}: {
  accountLabel: string;
  onConfirm: () => Promise<void>;
  isPending: boolean;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const resolvedOpen = open ?? internalOpen;
  const setResolvedOpen = onOpenChange ?? setInternalOpen;

  return (
    <AlertDialog open={resolvedOpen} onOpenChange={setResolvedOpen}>
      {trigger ? (
        <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      ) : null}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete payment account?</AlertDialogTitle>
          <AlertDialogDescription>
            {accountLabel} will be removed from this payment accounts list.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              await onConfirm();
              setResolvedOpen(false);
            }}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete account"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function PaymentAccountRowActions({
  account,
  onUpdateAccount,
  onDeleteAccount,
  updatingAccountId,
  deletingAccountId,
}: {
  account: TenantPaymentAccountRecord;
  onUpdateAccount: (
    accountId: string,
    values: PaymentAccountFormValues,
  ) => Promise<void>;
  onDeleteAccount: (accountId: string) => Promise<void>;
  updatingAccountId: string | null;
  deletingAccountId: string | null;
}) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <MoreHorizontalIcon className="size-4" />
            <span className="sr-only">Open payment account actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
              setMenuOpen(false);
              setEditOpen(true);
            }}
          >
            <PencilLineIcon className="size-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onSelect={(event) => {
              event.preventDefault();
              setMenuOpen(false);
              setDeleteOpen(true);
            }}
          >
            <Trash2Icon className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <PaymentAccountFormDialog
        mode="edit"
        open={editOpen}
        onOpenChange={setEditOpen}
        initialValues={buildFormFromAccount(account)}
        onSubmit={(values) => onUpdateAccount(account.id, values)}
        isPending={updatingAccountId === account.id}
      />

      <DeletePaymentAccountAlert
        accountLabel={account.accountLabel}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={() => onDeleteAccount(account.id)}
        isPending={deletingAccountId === account.id}
      />
    </>
  );
}

function getColumns({
  onUpdateAccount,
  onDeleteAccount,
  updatingAccountId,
  deletingAccountId,
}: {
  onUpdateAccount: (
    accountId: string,
    values: PaymentAccountFormValues,
  ) => Promise<void>;
  onDeleteAccount: (accountId: string) => Promise<void>;
  updatingAccountId: string | null;
  deletingAccountId: string | null;
}): ColumnDef<TenantPaymentAccountRecord>[] {
  return [
    {
      accessorKey: "accountLabel",
      header: ({ column }) => sortableHeader("Account", column),
      cell: ({ row }) => (
        <div className="min-w-56">
          <p className="font-medium text-foreground">
            {row.original.accountLabel}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {row.original.accountName}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "accountType",
      header: ({ column }) => sortableHeader("Type", column),
      cell: ({ row }) => (
        <Badge variant="outline">
          {paymentAccountTypeToLabel(row.original.accountType)}
        </Badge>
      ),
    },
    {
      accessorKey: "providerName",
      header: ({ column }) => sortableHeader("Provider", column),
      cell: ({ row }) => (
        <div className="min-w-28 text-sm text-foreground/85">
          {row.original.providerName}
        </div>
      ),
    },
    {
      accessorKey: "maskedDetails",
      header: ({ column }) => sortableHeader("Details", column),
      cell: ({ row }) => (
        <div className="min-w-28 font-medium">
          {row.original.maskedDetails}
        </div>
      ),
    },
    {
      accessorKey: "isDefault",
      header: ({ column }) => sortableHeader("Default", column),
      cell: ({ row }) =>
        row.original.isDefault ? (
          <div className="flex min-w-20 items-center gap-2 text-sm text-emerald-700">
            <ShieldCheckIcon className="size-4" />
            Yes
          </div>
        ) : (
          <div className="min-w-20 text-sm text-muted-foreground">No</div>
        ),
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => sortableHeader("Updated", column),
      cell: ({ row }) => (
        <div className="min-w-28 text-sm text-muted-foreground">
          {formatDistanceToNow(row.original.updatedAt, { addSuffix: true })}
        </div>
      ),
      sortingFn: "datetime",
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex min-w-16 items-center justify-end">
          <PaymentAccountRowActions
            account={row.original}
            onUpdateAccount={onUpdateAccount}
            onDeleteAccount={onDeleteAccount}
            updatingAccountId={updatingAccountId}
            deletingAccountId={deletingAccountId}
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];
}

export function PaymentAccountsTable({
  accounts,
  isLoading,
  isFetching,
}: {
  accounts: TenantPaymentAccountRecord[];
  isLoading: boolean;
  isFetching: boolean;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const accountsQueryKey = trpc.paymentAccounts.list.queryKey();
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "updatedAt", desc: true },
  ]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [updatingAccountId, setUpdatingAccountId] = React.useState<string | null>(
    null,
  );
  const [deletingAccountId, setDeletingAccountId] = React.useState<string | null>(
    null,
  );

  const createAccountMutation = useMutation(
    trpc.paymentAccounts.create.mutationOptions({
      onSuccess: async (account) => {
        toast.success(`Payment account "${account.accountLabel}" created.`);
        await queryClient.invalidateQueries({ queryKey: accountsQueryKey });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create payment account.");
      },
    }),
  );

  const updateAccountMutation = useMutation(
    trpc.paymentAccounts.update.mutationOptions({
      onSuccess: async (account) => {
        toast.success(`Payment account "${account.accountLabel}" updated.`);
        await queryClient.invalidateQueries({ queryKey: accountsQueryKey });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update payment account.");
      },
      onSettled: () => {
        setUpdatingAccountId(null);
      },
    }),
  );

  const deleteAccountMutation = useMutation(
    trpc.paymentAccounts.delete.mutationOptions({
      onSuccess: async (account) => {
        toast.success(`Payment account "${account.accountLabel}" deleted.`);
        await queryClient.invalidateQueries({ queryKey: accountsQueryKey });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete payment account.");
      },
      onSettled: () => {
        setDeletingAccountId(null);
      },
    }),
  );

  const handleCreateAccount = React.useCallback(
    async (values: PaymentAccountFormValues) => {
      await createAccountMutation.mutateAsync({
        accountLabel: values.accountLabel.trim(),
        accountType: values.accountType,
        providerName: values.providerName.trim(),
        accountName: values.accountName.trim(),
        maskedDetails: values.maskedDetails.trim(),
        isDefault: values.isDefault,
      });
    },
    [createAccountMutation],
  );

  const handleUpdateAccount = React.useCallback(
    async (accountId: string, values: PaymentAccountFormValues) => {
      setUpdatingAccountId(accountId);
      await updateAccountMutation.mutateAsync({
        id: accountId,
        accountLabel: values.accountLabel.trim(),
        accountType: values.accountType,
        providerName: values.providerName.trim(),
        accountName: values.accountName.trim(),
        maskedDetails: values.maskedDetails.trim(),
        isDefault: values.isDefault,
      });
    },
    [updateAccountMutation],
  );

  const handleDeleteAccount = React.useCallback(
    async (accountId: string) => {
      setDeletingAccountId(accountId);
      await deleteAccountMutation.mutateAsync({
        id: accountId,
      });
    },
    [deleteAccountMutation],
  );

  const columns = React.useMemo(
    () =>
      getColumns({
        onUpdateAccount: handleUpdateAccount,
        onDeleteAccount: handleDeleteAccount,
        updatingAccountId,
        deletingAccountId,
      }),
    [
      deletingAccountId,
      handleDeleteAccount,
      handleUpdateAccount,
      updatingAccountId,
    ],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: accounts,
    columns,
    state: {
      sorting,
      globalFilter,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    globalFilterFn: (row, _columnId, value) =>
      [
        row.original.accountLabel,
        paymentAccountTypeToLabel(row.original.accountType),
        row.original.providerName,
        row.original.accountName,
        row.original.maskedDetails,
      ]
        .join(" ")
        .toLowerCase()
        .includes(String(value).toLowerCase()),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
  });

  return (
    <section className="rounded-2xl border bg-background p-5 shadow-sm md:p-6">
      <div className="space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Payment accounts table</h2>
            <p className="text-sm text-muted-foreground">
              Review saved payment rails, default collection paths, and account
              references in one place.
            </p>
          </div>
          <PaymentAccountFormDialog
            mode="create"
            initialValues={defaultPaymentAccountForm}
            onSubmit={handleCreateAccount}
            isPending={createAccountMutation.isPending}
            trigger={
              <Button>
                <PlusIcon className="size-4" />
                Add payment account
              </Button>
            }
          />
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={(table.getState().globalFilter as string) ?? ""}
                onChange={(event) => table.setGlobalFilter(event.target.value)}
                placeholder="Search label, provider, type, or details..."
                className="pl-9"
              />
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Columns3 className="size-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Loading payment accounts...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No payment accounts matched your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-3 border-t pt-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            {isFetching && !isLoading
              ? "Syncing latest payment account updates..."
              : `${accounts.length} payment account records tracked. Use the add-account action to keep guest payment collection paths visible for your team.`}
          </p>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <span className="px-2 text-xs">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
