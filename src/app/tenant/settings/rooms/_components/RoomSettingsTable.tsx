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
  ImagePlusIcon,
  MoreHorizontalIcon,
  PencilLineIcon,
  PlusIcon,
  Search,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTRPC } from "@/trpc/client";
import { CreatableCategorySelect } from "./CreatableCategorySelect";
import { RoomImagesDialog } from "./RoomImagesDialog";

export type TenantRoomRecord = {
  id: string;
  roomName: string;
  category: string;
  capacity: number;
  sellableUnits: number;
  rate: number;
  zone: string;
  updatedAt: Date;
};

type RoomFormValues = {
  roomName: string;
  category: string;
  capacity: string;
  sellableUnits: string;
  rate: string;
  zone: string;
};

const currency = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

const categoryOptionsSeed = [
  "Villa",
  "Suite",
  "Casita",
  "Family Room",
  "Deluxe Room",
] as const;

const defaultRoomForm: RoomFormValues = {
  roomName: "",
  category: "Villa",
  capacity: "2",
  sellableUnits: "1",
  rate: "",
  zone: "",
};

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

function buildFormFromRoom(room: TenantRoomRecord): RoomFormValues {
  return {
    roomName: room.roomName,
    category: room.category,
    capacity: String(room.capacity),
    sellableUnits: String(room.sellableUnits),
    rate: String(room.rate),
    zone: room.zone === "Main Area" ? "" : room.zone,
  };
}

function RoomFormDialog({
  mode,
  initialValues,
  categoryOptions,
  onAddCategory,
  onSubmit,
  isPending,
  trigger,
  open,
  onOpenChange,
}: {
  mode: "create" | "edit";
  initialValues: RoomFormValues;
  categoryOptions: string[];
  onAddCategory: (category: string) => void;
  onSubmit: (values: RoomFormValues) => Promise<void>;
  isPending: boolean;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [form, setForm] = React.useState<RoomFormValues>(initialValues);
  const resolvedOpen = open ?? internalOpen;
  const setResolvedOpen = onOpenChange ?? setInternalOpen;

  React.useEffect(() => {
    if (resolvedOpen) {
      setForm(initialValues);
    }
  }, [initialValues, resolvedOpen]);

  function updateField<Key extends keyof RoomFormValues>(
    key: Key,
    value: RoomFormValues[Key],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  const isSubmitDisabled =
    !form.roomName.trim() || !form.rate.trim() || !form.category.trim();

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
          <DialogTitle>{mode === "create" ? "Add room" : "Edit room"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add the core room details first. You can refine the rest later."
              : "Update the room details that guests and your team will use."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`${mode}-roomName`}>Room name</Label>
            <Input
              id={`${mode}-roomName`}
              placeholder="e.g. Family Villa 2"
              value={form.roomName}
              onChange={(event) => updateField("roomName", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${mode}-category`}>Category</Label>
            <CreatableCategorySelect
              value={form.category}
              options={categoryOptions}
              onChange={(value) => updateField("category", value)}
              onCreate={onAddCategory}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${mode}-capacity`}>Capacity</Label>
            <Input
              id={`${mode}-capacity`}
              type="number"
              min="1"
              value={form.capacity}
              onChange={(event) => updateField("capacity", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${mode}-sellableUnits`}>Sellable units</Label>
            <Input
              id={`${mode}-sellableUnits`}
              type="number"
              min="1"
              value={form.sellableUnits}
              onChange={(event) =>
                updateField("sellableUnits", event.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${mode}-rate`}>Base nightly rate</Label>
            <Input
              id={`${mode}-rate`}
              type="number"
              min="0"
              placeholder="e.g. 12500"
              value={form.rate}
              onChange={(event) => updateField("rate", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${mode}-zone`}>Zone / floor</Label>
            <Input
              id={`${mode}-zone`}
              placeholder="Optional, e.g. Garden Wing"
              value={form.zone}
              onChange={(event) => updateField("zone", event.target.value)}
            />
          </div>
        </div>

        <div className="rounded-lg border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
          New rooms are published directly on ResortCloud by default.
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setResolvedOpen(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isSubmitDisabled || isPending}>
            {isPending
              ? mode === "create"
                ? "Saving..."
                : "Updating..."
              : mode === "create"
                ? "Save room"
                : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteRoomAlert({
  roomName,
  onConfirm,
  isPending,
  trigger,
  open,
  onOpenChange,
}: {
  roomName: string;
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
          <AlertDialogTitle>Delete room?</AlertDialogTitle>
          <AlertDialogDescription>
            {roomName} will be removed from this property workspace. This action
            cannot be undone.
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
            {isPending ? "Deleting..." : "Delete room"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function RoomRowActions({
  room,
  categoryOptions,
  onAddCategory,
  onUpdateRoom,
  onDeleteRoom,
  updatingRoomId,
  deletingRoomId,
}: {
  room: TenantRoomRecord;
  categoryOptions: string[];
  onAddCategory: (category: string) => void;
  onUpdateRoom: (roomId: string, values: RoomFormValues) => Promise<void>;
  onDeleteRoom: (roomId: string) => Promise<void>;
  updatingRoomId: string | null;
  deletingRoomId: string | null;
}) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [imagesOpen, setImagesOpen] = React.useState(false);

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <MoreHorizontalIcon className="size-4" />
            <span className="sr-only">Open room actions</span>
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
            onSelect={(event) => {
              event.preventDefault();
              setMenuOpen(false);
              setImagesOpen(true);
            }}
          >
            <ImagePlusIcon className="size-4" />
            Add images
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

      <RoomFormDialog
        mode="edit"
        open={editOpen}
        onOpenChange={setEditOpen}
        initialValues={buildFormFromRoom(room)}
        categoryOptions={categoryOptions}
        onAddCategory={onAddCategory}
        onSubmit={(values) => onUpdateRoom(room.id, values)}
        isPending={updatingRoomId === room.id}
      />

      <DeleteRoomAlert
        roomName={room.roomName}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={() => onDeleteRoom(room.id)}
        isPending={deletingRoomId === room.id}
      />

      <RoomImagesDialog
        roomId={room.id}
        roomName={room.roomName}
        open={imagesOpen}
        onOpenChange={setImagesOpen}
      />
    </>
  );
}

function getColumns({
  categoryOptions,
  onAddCategory,
  onUpdateRoom,
  onDeleteRoom,
  updatingRoomId,
  deletingRoomId,
}: {
  categoryOptions: string[];
  onAddCategory: (category: string) => void;
  onUpdateRoom: (roomId: string, values: RoomFormValues) => Promise<void>;
  onDeleteRoom: (roomId: string) => Promise<void>;
  updatingRoomId: string | null;
  deletingRoomId: string | null;
}): ColumnDef<TenantRoomRecord>[] {
  return [
    {
      accessorKey: "roomName",
      header: ({ column }) => sortableHeader("Room", column),
      cell: ({ row }) => (
        <div className="min-w-44">
          <p className="font-medium text-foreground">{row.original.roomName}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {row.original.category} • {row.original.capacity} guests
          </p>
        </div>
      ),
    },
    {
      accessorKey: "sellableUnits",
      header: ({ column }) => sortableHeader("Units", column),
      cell: ({ row }) => (
        <div className="min-w-24">
          <p className="font-medium">{row.original.sellableUnits}</p>
          <p className="text-xs text-muted-foreground">sellable</p>
        </div>
      ),
    },
    {
      accessorKey: "rate",
      header: ({ column }) => sortableHeader("Rate", column),
      cell: ({ row }) => (
        <div className="min-w-28 font-medium">
          {currency.format(row.original.rate)}
        </div>
      ),
    },
    {
      accessorKey: "zone",
      header: ({ column }) => sortableHeader("Zone", column),
      cell: ({ row }) => (
        <div className="min-w-28">
          <p className="font-medium">{row.original.zone}</p>
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
          <RoomRowActions
            room={row.original}
            categoryOptions={categoryOptions}
            onAddCategory={onAddCategory}
            onUpdateRoom={onUpdateRoom}
            onDeleteRoom={onDeleteRoom}
            updatingRoomId={updatingRoomId}
            deletingRoomId={deletingRoomId}
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];
}

export function RoomSettingsTable({
  rooms,
  isLoading,
  isFetching,
}: {
  rooms: TenantRoomRecord[];
  isLoading: boolean;
  isFetching: boolean;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const roomsQueryKey = trpc.rooms.list.queryKey();
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "updatedAt", desc: true },
  ]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(
    {},
  );
  const [categoryOptions, setCategoryOptions] = React.useState<string[]>(() => {
    const unique = new Set<string>([
      ...categoryOptionsSeed,
      ...rooms.map((room) => room.category),
    ]);
    return Array.from(unique);
  });
  const [updatingRoomId, setUpdatingRoomId] = React.useState<string | null>(null);
  const [deletingRoomId, setDeletingRoomId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setCategoryOptions((current) => {
      const unique = new Set<string>([
        ...current,
        ...categoryOptionsSeed,
        ...rooms.map((room) => room.category),
      ]);
      return Array.from(unique);
    });
  }, [rooms]);

  const createRoomMutation = useMutation(
    trpc.rooms.create.mutationOptions({
      onSuccess: async (room) => {
        toast.success(`Room "${room.roomName}" created.`);
        await queryClient.invalidateQueries({ queryKey: roomsQueryKey });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create room.");
      },
    }),
  );

  const updateRoomMutation = useMutation(
    trpc.rooms.update.mutationOptions({
      onSuccess: async (room) => {
        toast.success(`Room "${room.roomName}" updated.`);
        await queryClient.invalidateQueries({ queryKey: roomsQueryKey });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update room.");
      },
      onSettled: () => {
        setUpdatingRoomId(null);
      },
    }),
  );

  const deleteRoomMutation = useMutation(
    trpc.rooms.delete.mutationOptions({
      onSuccess: async (room) => {
        toast.success(`Room "${room.roomName}" deleted.`);
        await queryClient.invalidateQueries({ queryKey: roomsQueryKey });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete room.");
      },
      onSettled: () => {
        setDeletingRoomId(null);
      },
    }),
  );

  const handleAddCategory = React.useCallback((category: string) => {
    setCategoryOptions((current) =>
      current.includes(category) ? current : [...current, category],
    );
  }, []);

  const handleCreateRoom = React.useCallback(async (values: RoomFormValues) => {
    await createRoomMutation.mutateAsync({
      roomName: values.roomName.trim(),
      category: values.category.trim(),
      capacity: Number(values.capacity) || 1,
      sellableUnits: Number(values.sellableUnits) || 1,
      rate: Number(values.rate) || 0,
      zone: values.zone.trim(),
    });
  }, [createRoomMutation]);

  const handleUpdateRoom = React.useCallback(async (roomId: string, values: RoomFormValues) => {
    setUpdatingRoomId(roomId);
    await updateRoomMutation.mutateAsync({
      id: roomId,
      roomName: values.roomName.trim(),
      category: values.category.trim(),
      capacity: Number(values.capacity) || 1,
      sellableUnits: Number(values.sellableUnits) || 1,
      rate: Number(values.rate) || 0,
      zone: values.zone.trim(),
    });
  }, [updateRoomMutation]);

  const handleDeleteRoom = React.useCallback(async (roomId: string) => {
    setDeletingRoomId(roomId);
    await deleteRoomMutation.mutateAsync({
      id: roomId,
    });
  }, [deleteRoomMutation]);

  const columns = React.useMemo(
    () =>
      getColumns({
        categoryOptions,
        onAddCategory: handleAddCategory,
        onUpdateRoom: handleUpdateRoom,
        onDeleteRoom: handleDeleteRoom,
        updatingRoomId,
        deletingRoomId,
      }),
    [
      categoryOptions,
      deletingRoomId,
      handleAddCategory,
      handleDeleteRoom,
      handleUpdateRoom,
      updatingRoomId,
    ],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: rooms,
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
      [row.original.roomName, row.original.category, row.original.zone]
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
            <h2 className="text-lg font-semibold">Room inventory table</h2>
            <p className="text-sm text-muted-foreground">
              Review sellable inventory, pricing readiness, and room details in
              one place.
            </p>
          </div>
          <RoomFormDialog
            mode="create"
            initialValues={defaultRoomForm}
            categoryOptions={categoryOptions}
            onAddCategory={handleAddCategory}
            onSubmit={handleCreateRoom}
            isPending={createRoomMutation.isPending}
            trigger={
              <Button>
                <PlusIcon className="size-4" />
                Add room
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
                placeholder="Search room, category, or zone..."
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
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
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
                    Loading rooms...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
                    No rooms matched your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-3 border-t pt-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            {isFetching && !isLoading
              ? "Syncing latest room updates..."
              : `${rooms.length} room records tracked. Use the add-room action to expand sellable inventory.`}
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
