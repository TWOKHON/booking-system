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
  BellIcon,
  CheckCircle2Icon,
  Columns3,
  MoreHorizontalIcon,
  PencilLineIcon,
  Search,
  Settings2Icon,
} from "lucide-react";
import { toast } from "sonner";
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

export type TenantNotificationChannelRecord = {
  id: string;
  channel: NotificationChannelValue;
  enabled: boolean;
  updatedAt: Date;
};

export type TenantNotificationPreferenceRecord = {
  id: string;
  category: NotificationCategoryValue;
  enabled: boolean;
  frequency: NotificationFrequencyValue;
  updatedAt: Date;
};

type NotificationChannelValue = "IN_APP" | "EMAIL" | "SMS" | "PUSH";
type NotificationCategoryValue =
  | "RESERVATIONS"
  | "GUEST_MESSAGES"
  | "OPERATIONAL_ALERTS"
  | "PAYMENTS"
  | "MARKETING";
type NotificationFrequencyValue = "INSTANT" | "DAILY" | "WEEKLY";

type NotificationPreferenceFormValues = {
  enabled: boolean;
  frequency: NotificationFrequencyValue;
};

const frequencyOptions: Array<{
  value: NotificationFrequencyValue;
  label: string;
}> = [
  { value: "INSTANT", label: "Instant" },
  { value: "DAILY", label: "Daily summary" },
  { value: "WEEKLY", label: "Weekly summary" },
];

function channelToLabel(channel: NotificationChannelValue) {
  switch (channel) {
    case "IN_APP":
      return "In-App";
    case "EMAIL":
      return "Email";
    case "SMS":
      return "SMS";
    default:
      return "Push";
  }
}

function categoryToLabel(category: NotificationCategoryValue) {
  switch (category) {
    case "RESERVATIONS":
      return "Reservations";
    case "GUEST_MESSAGES":
      return "Guest Messages";
    case "OPERATIONAL_ALERTS":
      return "Operational Alerts";
    case "PAYMENTS":
      return "Payments";
    default:
      return "Marketing";
  }
}

function frequencyToLabel(frequency: NotificationFrequencyValue) {
  return (
    frequencyOptions.find((option) => option.value === frequency)?.label ??
    frequency
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

function buildPreferenceForm(
  preference: TenantNotificationPreferenceRecord,
): NotificationPreferenceFormValues {
  return {
    enabled: preference.enabled,
    frequency: preference.frequency,
  };
}

function ManageChannelsDialog({
  channels,
  onSubmit,
  isPending,
  trigger,
}: {
  channels: TenantNotificationChannelRecord[];
  onSubmit: (
    values: Array<{ channel: NotificationChannelValue; enabled: boolean }>,
  ) => Promise<void>;
  isPending: boolean;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState<
    Array<{ channel: NotificationChannelValue; enabled: boolean }>
  >([]);

  React.useEffect(() => {
    if (open) {
      setForm(
        channels.map((channel) => ({
          channel: channel.channel,
          enabled: channel.enabled,
        })),
      );
    }
  }, [channels, open]);

  function toggleChannel(channelValue: NotificationChannelValue, enabled: boolean) {
    setForm((current) =>
      current.map((channel) =>
        channel.channel === channelValue ? { ...channel, enabled } : channel,
      ),
    );
  }

  async function handleSubmit() {
    await onSubmit(form);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Manage delivery channels</DialogTitle>
          <DialogDescription>
            Choose which channel types the property can use for notification
            delivery.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {form.map((channel) => (
            <label
              key={channel.channel}
              className="flex items-start gap-3 rounded-lg border bg-muted/30 px-4 py-3"
            >
              <Checkbox
                checked={channel.enabled}
                onCheckedChange={(value) =>
                  toggleChannel(channel.channel, value === true)
                }
                className="mt-0.5"
              />
              <div>
                <p className="text-sm font-medium">
                  {channelToLabel(channel.channel)}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {channel.channel === "IN_APP"
                    ? "Show updates directly inside the ResortCloud workspace."
                    : channel.channel === "EMAIL"
                      ? "Deliver longer-form alerts and summaries by email."
                      : channel.channel === "SMS"
                        ? "Use short urgent alerts for guests or staff."
                        : "Deliver push notifications to supported devices."}
                </p>
              </div>
            </label>
          ))}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Saving..." : "Save channels"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function NotificationPreferenceDialog({
  preference,
  onSubmit,
  isPending,
  trigger,
  open,
  onOpenChange,
}: {
  preference: TenantNotificationPreferenceRecord;
  onSubmit: (
    category: NotificationCategoryValue,
    values: NotificationPreferenceFormValues,
  ) => Promise<void>;
  isPending: boolean;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [form, setForm] = React.useState<NotificationPreferenceFormValues>(
    buildPreferenceForm(preference),
  );
  const resolvedOpen = open ?? internalOpen;
  const setResolvedOpen = onOpenChange ?? setInternalOpen;

  React.useEffect(() => {
    if (resolvedOpen) {
      setForm(buildPreferenceForm(preference));
    }
  }, [preference, resolvedOpen]);

  async function handleSubmit() {
    await onSubmit(preference.category, form);
    setResolvedOpen(false);
  }

  return (
    <Dialog open={resolvedOpen} onOpenChange={setResolvedOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{categoryToLabel(preference.category)}</DialogTitle>
          <DialogDescription>
            Adjust whether this category sends notifications and how often the
            delivery should happen.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <label className="flex items-start gap-3 rounded-lg border bg-muted/30 px-4 py-3">
            <Checkbox
              checked={form.enabled}
              onCheckedChange={(value) =>
                setForm((current) => ({
                  ...current,
                  enabled: value === true,
                }))
              }
              className="mt-0.5"
            />
            <div>
              <p className="text-sm font-medium">Enable this notification rule</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Turn this category on when the team should receive updates for
                this type of event.
              </p>
            </div>
          </label>

          <div className="space-y-2">
            <Label htmlFor={`frequency-${preference.id}`}>Delivery frequency</Label>
            <Select
              value={form.frequency}
              onValueChange={(value) =>
                setForm((current) => ({
                  ...current,
                  frequency: value as NotificationFrequencyValue,
                }))
              }
            >
              <SelectTrigger className="w-full" id={`frequency-${preference.id}`}>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                {frequencyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          <Button type="button" onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function NotificationRowActions({
  preference,
  onUpdatePreference,
  updatingCategory,
}: {
  preference: TenantNotificationPreferenceRecord;
  onUpdatePreference: (
    category: NotificationCategoryValue,
    values: NotificationPreferenceFormValues,
  ) => Promise<void>;
  updatingCategory: NotificationCategoryValue | null;
}) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <MoreHorizontalIcon className="size-4" />
            <span className="sr-only">Open notification actions</span>
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
        </DropdownMenuContent>
      </DropdownMenu>

      <NotificationPreferenceDialog
        preference={preference}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={onUpdatePreference}
        isPending={updatingCategory === preference.category}
      />
    </>
  );
}

function getColumns({
  onUpdatePreference,
  updatingCategory,
}: {
  onUpdatePreference: (
    category: NotificationCategoryValue,
    values: NotificationPreferenceFormValues,
  ) => Promise<void>;
  updatingCategory: NotificationCategoryValue | null;
}): ColumnDef<TenantNotificationPreferenceRecord>[] {
  return [
    {
      accessorKey: "category",
      header: ({ column }) => sortableHeader("Category", column),
      cell: ({ row }) => (
        <div className="min-w-52">
          <p className="font-medium text-foreground">
            {categoryToLabel(row.original.category)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {row.original.category === "RESERVATIONS"
              ? "Booking confirmations, modifications, and reservation changes."
              : row.original.category === "GUEST_MESSAGES"
                ? "Guest questions, replies, and conversation updates."
                : row.original.category === "OPERATIONAL_ALERTS"
                  ? "Task and room-readiness alerts that affect live operations."
                  : row.original.category === "PAYMENTS"
                    ? "Invoice, balance, and payment-related updates."
                    : "Marketing nudges, offers, and softer outbound messages."}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "enabled",
      header: ({ column }) => sortableHeader("Status", column),
      cell: ({ row }) =>
        row.original.enabled ? (
          <div className="flex min-w-24 items-center gap-2 text-sm text-emerald-700">
            <CheckCircle2Icon className="size-4" />
            Enabled
          </div>
        ) : (
          <div className="min-w-24 text-sm text-muted-foreground">Disabled</div>
        ),
    },
    {
      accessorKey: "frequency",
      header: ({ column }) => sortableHeader("Frequency", column),
      cell: ({ row }) => (
        <Badge variant="outline">{frequencyToLabel(row.original.frequency)}</Badge>
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
          <NotificationRowActions
            preference={row.original}
            onUpdatePreference={onUpdatePreference}
            updatingCategory={updatingCategory}
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];
}

export function NotificationsSettingsTable({
  channels,
  preferences,
  isLoading,
  isFetching,
}: {
  channels: TenantNotificationChannelRecord[];
  preferences: TenantNotificationPreferenceRecord[];
  isLoading: boolean;
  isFetching: boolean;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const notificationsQueryKey = trpc.notifications.list.queryKey();
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "updatedAt", desc: true },
  ]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [updatingCategory, setUpdatingCategory] =
    React.useState<NotificationCategoryValue | null>(null);

  const updateChannelsMutation = useMutation(
    trpc.notifications.updateChannels.mutationOptions({
      onSuccess: async () => {
        toast.success("Notification channels updated.");
        await queryClient.invalidateQueries({ queryKey: notificationsQueryKey });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update notification channels.");
      },
    }),
  );

  const updatePreferenceMutation = useMutation(
    trpc.notifications.updatePreference.mutationOptions({
      onSuccess: async (preference) => {
        toast.success(
          `${categoryToLabel(preference.category)} notification updated.`,
        );
        await queryClient.invalidateQueries({ queryKey: notificationsQueryKey });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update notification rule.");
      },
      onSettled: () => {
        setUpdatingCategory(null);
      },
    }),
  );

  const handleSaveChannels = React.useCallback(
    async (
      values: Array<{ channel: NotificationChannelValue; enabled: boolean }>,
    ) => {
      await updateChannelsMutation.mutateAsync({
        channels: values,
      });
    },
    [updateChannelsMutation],
  );

  const handleUpdatePreference = React.useCallback(
    async (
      category: NotificationCategoryValue,
      values: NotificationPreferenceFormValues,
    ) => {
      setUpdatingCategory(category);
      await updatePreferenceMutation.mutateAsync({
        category,
        enabled: values.enabled,
        frequency: values.frequency,
      });
    },
    [updatePreferenceMutation],
  );

  const columns = React.useMemo(
    () =>
      getColumns({
        onUpdatePreference: handleUpdatePreference,
        updatingCategory,
      }),
    [handleUpdatePreference, updatingCategory],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: preferences,
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
        categoryToLabel(row.original.category),
        frequencyToLabel(row.original.frequency),
        row.original.enabled ? "enabled" : "disabled",
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
            <h2 className="text-lg font-semibold">Notification rules table</h2>
            <p className="text-sm text-muted-foreground">
              Review category-level notification behavior and keep channel
              delivery aligned with your team’s operating rhythm.
            </p>
          </div>
          <ManageChannelsDialog
            channels={channels}
            onSubmit={handleSaveChannels}
            isPending={updateChannelsMutation.isPending}
            trigger={
              <Button>
                <Settings2Icon className="size-4" />
                Manage channels
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
                placeholder="Search category, status, or frequency..."
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
                    Loading notification rules...
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
                    No notification rules matched your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-3 border-t pt-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <BellIcon className="size-4" />
            <p>
              {isFetching && !isLoading
                ? "Syncing latest notification settings..."
                : `${preferences.length} notification categories tracked. Use the channel manager for delivery types and edit each row for category-level behavior.`}
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
