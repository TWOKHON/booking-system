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
  ExternalLinkIcon,
  InfoIcon,
  MoreHorizontalIcon,
  PencilLineIcon,
  PlusIcon,
  Search,
  Trash2Icon,
  WebhookIcon,
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
import { Textarea } from "@/components/ui/textarea";
import { useTRPC } from "@/trpc/client";

type DiscordEventScopeValue =
  | "BOOKINGS"
  | "OPERATIONS"
  | "FINANCE"
  | "OWNER_ALERTS"
  | "CUSTOM";

export type TenantDiscordChannelRecord = {
  id: string;
  channelLabel: string;
  eventScope: DiscordEventScopeValue;
  webhookUrl: string;
  webhookReference: string;
  note: string | null;
  isActive: boolean;
  updatedAt: Date;
};

type DiscordChannelFormValues = {
  channelLabel: string;
  eventScope: DiscordEventScopeValue;
  note: string;
};

const discordEventScopeOptions: Array<{
  value: DiscordEventScopeValue;
  label: string;
}> = [
  { value: "BOOKINGS", label: "Bookings" },
  { value: "OPERATIONS", label: "Operations" },
  { value: "FINANCE", label: "Finance" },
  { value: "OWNER_ALERTS", label: "Owner Alerts" },
  { value: "CUSTOM", label: "Custom" },
];

const defaultDiscordChannelForm: DiscordChannelFormValues = {
  channelLabel: "",
  eventScope: "BOOKINGS",
  note: "",
};

function discordEventScopeToLabel(scope: DiscordEventScopeValue) {
  return (
    discordEventScopeOptions.find((option) => option.value === scope)?.label ??
    scope
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

function buildFormFromChannel(
  channel: TenantDiscordChannelRecord,
): DiscordChannelFormValues {
  return {
    channelLabel: channel.channelLabel,
    eventScope: channel.eventScope,
    note: channel.note ?? "",
  };
}

function ConnectDiscordDialog({
  initialValues,
  canStartDiscordOAuth,
  trigger,
}: {
  initialValues: DiscordChannelFormValues;
  canStartDiscordOAuth: boolean;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState<DiscordChannelFormValues>(initialValues);

  React.useEffect(() => {
    if (open) {
      setForm(initialValues);
    }
  }, [initialValues, open]);

  function updateField<Key extends keyof DiscordChannelFormValues>(
    key: Key,
    value: DiscordChannelFormValues[Key],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  const isSubmitDisabled = !form.channelLabel.trim();

  function handleStartConnect() {
    if (isSubmitDisabled || !canStartDiscordOAuth) {
      return;
    }

    const params = new URLSearchParams({
      channelLabel: form.channelLabel.trim(),
      eventScope: form.eventScope,
    });

    if (form.note.trim()) {
      params.set("note", form.note.trim());
    }

    window.location.href = `/api/integrations/discord/connect?${params.toString()}`;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Connect Discord channel</DialogTitle>
          <DialogDescription>
            Set the channel label and alert scope first, then ResortCloud will
            send you to Discord so you can choose the real channel without
            handling webhook URLs manually.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="connect-channelLabel">Channel name</Label>
              <Input
                id="connect-channelLabel"
                placeholder="e.g. #bookings"
                value={form.channelLabel}
                onChange={(event) =>
                  updateField("channelLabel", event.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="connect-eventScope">Alert scope</Label>
              <Select
                value={form.eventScope}
                onValueChange={(value) =>
                  updateField("eventScope", value as DiscordEventScopeValue)
                }
              >
                <SelectTrigger className="w-full" id="connect-eventScope">
                  <SelectValue placeholder="Select a scope" />
                </SelectTrigger>
                <SelectContent>
                  {discordEventScopeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="connect-note">Routing note</Label>
            <Textarea
              id="connect-note"
              placeholder="Optional note about what this channel should receive."
              value={form.note}
              onChange={(event) => updateField("note", event.target.value)}
              className="min-h-24"
            />
          </div>

          <div className="rounded-lg border bg-muted/30 px-4 py-3">
            <div className="flex items-start gap-3">
              <InfoIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">
                  What happens next
                </p>
                <p>
                  Discord will ask you to authorize ResortCloud and choose the
                  channel where alerts should be delivered. Once you approve,
                  the channel will be saved here automatically.
                </p>
              </div>
            </div>
          </div>

          {!canStartDiscordOAuth ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Discord OAuth is not configured on this environment yet. Add the
              Discord app credentials on the server to enable direct tenant
              channel connection.
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleStartConnect}
            disabled={isSubmitDisabled || !canStartDiscordOAuth}
          >
            Continue to Discord
            <ExternalLinkIcon className="size-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DiscordChannelFormDialog({
  initialValues,
  onSubmit,
  isPending,
  trigger,
  open,
  onOpenChange,
}: {
  initialValues: DiscordChannelFormValues;
  onSubmit: (values: DiscordChannelFormValues) => Promise<void>;
  isPending: boolean;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [form, setForm] = React.useState<DiscordChannelFormValues>(initialValues);
  const resolvedOpen = open ?? internalOpen;
  const setResolvedOpen = onOpenChange ?? setInternalOpen;

  React.useEffect(() => {
    if (resolvedOpen) {
      setForm(initialValues);
    }
  }, [initialValues, resolvedOpen]);

  function updateField<Key extends keyof DiscordChannelFormValues>(
    key: Key,
    value: DiscordChannelFormValues[Key],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  const isSubmitDisabled = !form.channelLabel.trim();

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
          <DialogTitle>Edit Discord channel</DialogTitle>
          <DialogDescription>
            Update the label, scope, and routing note for this Discord channel.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="edit-channelLabel">Channel name</Label>
            <Input
              id="edit-channelLabel"
              placeholder="e.g. #bookings"
              value={form.channelLabel}
              onChange={(event) =>
                updateField("channelLabel", event.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-eventScope">Alert scope</Label>
            <Select
              value={form.eventScope}
              onValueChange={(value) =>
                updateField("eventScope", value as DiscordEventScopeValue)
              }
            >
              <SelectTrigger className="w-full" id="edit-eventScope">
                <SelectValue placeholder="Select a scope" />
              </SelectTrigger>
              <SelectContent>
                {discordEventScopeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="edit-note">Routing note</Label>
            <Textarea
              id="edit-note"
              placeholder="Optional note about what this channel should receive."
              value={form.note}
              onChange={(event) => updateField("note", event.target.value)}
              className="min-h-24"
            />
          </div>
        </div>

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
            {isPending ? "Updating..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteDiscordChannelAlert({
  channelLabel,
  onConfirm,
  isPending,
  trigger,
  open,
  onOpenChange,
}: {
  channelLabel: string;
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
      {trigger ? <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger> : null}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Discord channel?</AlertDialogTitle>
          <AlertDialogDescription>
            {channelLabel} will be removed from this Discord routing list. This
            action cannot be undone.
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
            {isPending ? "Deleting..." : "Delete channel"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function DiscordChannelRowActions({
  channel,
  onUpdateChannel,
  onDeleteChannel,
  updatingChannelId,
  deletingChannelId,
}: {
  channel: TenantDiscordChannelRecord;
  onUpdateChannel: (
    channelId: string,
    values: DiscordChannelFormValues,
  ) => Promise<void>;
  onDeleteChannel: (channelId: string) => Promise<void>;
  updatingChannelId: string | null;
  deletingChannelId: string | null;
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
            <span className="sr-only">Open Discord channel actions</span>
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

      <DiscordChannelFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        initialValues={buildFormFromChannel(channel)}
        onSubmit={(values) => onUpdateChannel(channel.id, values)}
        isPending={updatingChannelId === channel.id}
      />

      <DeleteDiscordChannelAlert
        channelLabel={channel.channelLabel}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={() => onDeleteChannel(channel.id)}
        isPending={deletingChannelId === channel.id}
      />
    </>
  );
}

function getColumns({
  onUpdateChannel,
  onDeleteChannel,
  updatingChannelId,
  deletingChannelId,
}: {
  onUpdateChannel: (
    channelId: string,
    values: DiscordChannelFormValues,
  ) => Promise<void>;
  onDeleteChannel: (channelId: string) => Promise<void>;
  updatingChannelId: string | null;
  deletingChannelId: string | null;
}): ColumnDef<TenantDiscordChannelRecord>[] {
  return [
    {
      accessorKey: "channelLabel",
      header: ({ column }) => sortableHeader("Channel", column),
      cell: ({ row }) => (
        <div className="min-w-48">
          <p className="font-medium text-foreground">
            {row.original.channelLabel}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {row.original.note?.trim() || "No routing note added yet."}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "eventScope",
      header: ({ column }) => sortableHeader("Scope", column),
      cell: ({ row }) => (
        <Badge variant="outline">
          {discordEventScopeToLabel(row.original.eventScope)}
        </Badge>
      ),
    },
    {
      accessorKey: "webhookReference",
      header: ({ column }) => sortableHeader("Webhook", column),
      cell: ({ row }) => (
        <div className="min-w-52 font-mono text-xs text-muted-foreground">
          {row.original.webhookReference}
        </div>
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
          <DiscordChannelRowActions
            channel={row.original}
            onUpdateChannel={onUpdateChannel}
            onDeleteChannel={onDeleteChannel}
            updatingChannelId={updatingChannelId}
            deletingChannelId={deletingChannelId}
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];
}

export function DiscordChannelsTable({
  channels,
  isLoading,
  isFetching,
  canStartDiscordOAuth,
}: {
  channels: TenantDiscordChannelRecord[];
  isLoading: boolean;
  isFetching: boolean;
  canStartDiscordOAuth: boolean;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const discordQueryKey = trpc.discord.list.queryKey();
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "updatedAt", desc: true },
  ]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [updatingChannelId, setUpdatingChannelId] = React.useState<string | null>(
    null,
  );
  const [deletingChannelId, setDeletingChannelId] = React.useState<string | null>(
    null,
  );

  const updateChannelMutation = useMutation(
    trpc.discord.update.mutationOptions({
      onSuccess: async (channel) => {
        toast.success(`Discord channel "${channel.channelLabel}" updated.`);
        await queryClient.invalidateQueries({ queryKey: discordQueryKey });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update Discord channel.");
      },
      onSettled: () => {
        setUpdatingChannelId(null);
      },
    }),
  );

  const deleteChannelMutation = useMutation(
    trpc.discord.delete.mutationOptions({
      onSuccess: async (channel) => {
        toast.success(`Discord channel "${channel.channelLabel}" deleted.`);
        await queryClient.invalidateQueries({ queryKey: discordQueryKey });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete Discord channel.");
      },
      onSettled: () => {
        setDeletingChannelId(null);
      },
    }),
  );

  const handleUpdateChannel = React.useCallback(
    async (channelId: string, values: DiscordChannelFormValues) => {
      setUpdatingChannelId(channelId);
      await updateChannelMutation.mutateAsync({
        id: channelId,
        channelLabel: values.channelLabel.trim(),
        eventScope: values.eventScope,
        note: values.note.trim() || null,
      });
    },
    [updateChannelMutation],
  );

  const handleDeleteChannel = React.useCallback(
    async (channelId: string) => {
      setDeletingChannelId(channelId);
      await deleteChannelMutation.mutateAsync({ id: channelId });
    },
    [deleteChannelMutation],
  );

  const columns = React.useMemo(
    () =>
      getColumns({
        onUpdateChannel: handleUpdateChannel,
        onDeleteChannel: handleDeleteChannel,
        updatingChannelId,
        deletingChannelId,
      }),
    [
      deletingChannelId,
      handleDeleteChannel,
      handleUpdateChannel,
      updatingChannelId,
    ],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: channels,
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
        row.original.channelLabel,
        discordEventScopeToLabel(row.original.eventScope),
        row.original.webhookReference,
        row.original.note ?? "",
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
            <h2 className="text-lg font-semibold">Discord channels table</h2>
            <p className="text-sm text-muted-foreground">
              Review where ResortCloud sends internal Discord alerts and keep
              each webhook route tied to the right team context.
            </p>
          </div>
          <ConnectDiscordDialog
            initialValues={defaultDiscordChannelForm}
            canStartDiscordOAuth={canStartDiscordOAuth}
            trigger={
              <Button>
                <PlusIcon className="size-4" />
                Connect Discord
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
                placeholder="Search channel, scope, webhook, or note..."
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
                    Loading Discord channels...
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
                    No Discord channels matched your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-3 border-t pt-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <WebhookIcon className="size-4" />
            <p>
              {isFetching && !isLoading
                ? "Syncing latest Discord channel updates..."
                : `${channels.length} Discord channel routes tracked. Keep webhook mappings tidy so the right teams see the right operational alerts.`}
            </p>
          </div>
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
