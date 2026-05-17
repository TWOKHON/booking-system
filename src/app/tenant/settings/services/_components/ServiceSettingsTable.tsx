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
import { Textarea } from "@/components/ui/textarea";
import { useTRPC } from "@/trpc/client";
import { CreatableCategorySelect } from "../../rooms/_components/CreatableCategorySelect";

export type TenantServiceRecord = {
  id: string;
  serviceName: string;
  category: string;
  price: number;
  unitLabel: string;
  availability: string;
  description: string;
  updatedAt: Date;
};

type ServiceFormValues = {
  serviceName: string;
  category: string;
  price: string;
  unitLabel: string;
  availability: string;
  description: string;
};

const currency = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

const categoryOptionsSeed = [
  "Dining",
  "Transport",
  "Wellness",
  "Experience",
  "Celebration Add-on",
] as const;

const defaultServiceForm: ServiceFormValues = {
  serviceName: "",
  category: "Dining",
  price: "",
  unitLabel: "per service",
  availability: "By request",
  description: "",
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

function buildFormFromService(service: TenantServiceRecord): ServiceFormValues {
  return {
    serviceName: service.serviceName,
    category: service.category,
    price: String(service.price),
    unitLabel: service.unitLabel,
    availability: service.availability,
    description: service.description,
  };
}

function ServiceFormDialog({
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
  initialValues: ServiceFormValues;
  categoryOptions: string[];
  onAddCategory: (category: string) => void;
  onSubmit: (values: ServiceFormValues) => Promise<void>;
  isPending: boolean;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [form, setForm] = React.useState<ServiceFormValues>(initialValues);
  const resolvedOpen = open ?? internalOpen;
  const setResolvedOpen = onOpenChange ?? setInternalOpen;

  React.useEffect(() => {
    if (resolvedOpen) {
      setForm(initialValues);
    }
  }, [initialValues, resolvedOpen]);

  function updateField<Key extends keyof ServiceFormValues>(
    key: Key,
    value: ServiceFormValues[Key],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  const isSubmitDisabled =
    !form.serviceName.trim() || !form.category.trim() || !form.price.trim();

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
            {mode === "create" ? "Add service" : "Edit service"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add the core service details first. You can refine the offer later."
              : "Update the service details your team and guests will use."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`${mode}-serviceName`}>Service name</Label>
            <Input
              id={`${mode}-serviceName`}
              placeholder="e.g. Airport transfer"
              value={form.serviceName}
              onChange={(event) =>
                updateField("serviceName", event.target.value)
              }
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
            <Label htmlFor={`${mode}-price`}>Starting price</Label>
            <Input
              id={`${mode}-price`}
              type="number"
              min="0"
              placeholder="e.g. 1500"
              value={form.price}
              onChange={(event) => updateField("price", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${mode}-unitLabel`}>Unit label</Label>
            <Input
              id={`${mode}-unitLabel`}
              placeholder="e.g. per guest, per trip"
              value={form.unitLabel}
              onChange={(event) =>
                updateField("unitLabel", event.target.value)
              }
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor={`${mode}-availability`}>Availability</Label>
            <Input
              id={`${mode}-availability`}
              placeholder="e.g. 8:00 AM - 8:00 PM, daily"
              value={form.availability}
              onChange={(event) =>
                updateField("availability", event.target.value)
              }
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor={`${mode}-description`}>Description</Label>
            <Textarea
              id={`${mode}-description`}
              placeholder="Short details guests or staff should know"
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              className="min-h-24"
            />
          </div>
        </div>

        <div className="rounded-lg border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
          New services are added directly to your ResortCloud service catalog by
          default.
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
            {isPending
              ? mode === "create"
                ? "Saving..."
                : "Updating..."
              : mode === "create"
                ? "Save service"
                : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteServiceAlert({
  serviceName,
  onConfirm,
  isPending,
  trigger,
  open,
  onOpenChange,
}: {
  serviceName: string;
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
          <AlertDialogTitle>Delete service?</AlertDialogTitle>
          <AlertDialogDescription>
            {serviceName} will be removed from this service catalog. This action
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
            {isPending ? "Deleting..." : "Delete service"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function ServiceRowActions({
  service,
  categoryOptions,
  onAddCategory,
  onUpdateService,
  onDeleteService,
  updatingServiceId,
  deletingServiceId,
}: {
  service: TenantServiceRecord;
  categoryOptions: string[];
  onAddCategory: (category: string) => void;
  onUpdateService: (
    serviceId: string,
    values: ServiceFormValues,
  ) => Promise<void>;
  onDeleteService: (serviceId: string) => Promise<void>;
  updatingServiceId: string | null;
  deletingServiceId: string | null;
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
            <span className="sr-only">Open service actions</span>
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

      <ServiceFormDialog
        mode="edit"
        open={editOpen}
        onOpenChange={setEditOpen}
        initialValues={buildFormFromService(service)}
        categoryOptions={categoryOptions}
        onAddCategory={onAddCategory}
        onSubmit={(values) => onUpdateService(service.id, values)}
        isPending={updatingServiceId === service.id}
      />

      <DeleteServiceAlert
        serviceName={service.serviceName}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={() => onDeleteService(service.id)}
        isPending={deletingServiceId === service.id}
      />
    </>
  );
}

function getColumns({
  categoryOptions,
  onAddCategory,
  onUpdateService,
  onDeleteService,
  updatingServiceId,
  deletingServiceId,
}: {
  categoryOptions: string[];
  onAddCategory: (category: string) => void;
  onUpdateService: (
    serviceId: string,
    values: ServiceFormValues,
  ) => Promise<void>;
  onDeleteService: (serviceId: string) => Promise<void>;
  updatingServiceId: string | null;
  deletingServiceId: string | null;
}): ColumnDef<TenantServiceRecord>[] {
  return [
    {
      accessorKey: "serviceName",
      header: ({ column }) => sortableHeader("Service", column),
      cell: ({ row }) => (
        <div className="min-w-44 max-w-80">
          <p className="font-medium text-foreground">
            {row.original.serviceName}
          </p>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {row.original.description.trim() || "No service description yet."}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: ({ column }) => sortableHeader("Category", column),
      cell: ({ row }) => (
        <div className="min-w-24 text-sm text-foreground/85">
          {row.original.category}
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: ({ column }) => sortableHeader("Price", column),
      cell: ({ row }) => (
        <div className="min-w-28 font-medium">
          {currency.format(row.original.price)}
        </div>
      ),
    },
    {
      accessorKey: "availability",
      header: ({ column }) => sortableHeader("Availability", column),
      cell: ({ row }) => (
        <div className="min-w-32 text-sm text-foreground/85">
          {row.original.availability}
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
          <ServiceRowActions
            service={row.original}
            categoryOptions={categoryOptions}
            onAddCategory={onAddCategory}
            onUpdateService={onUpdateService}
            onDeleteService={onDeleteService}
            updatingServiceId={updatingServiceId}
            deletingServiceId={deletingServiceId}
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];
}

export function ServiceSettingsTable({
  services,
  isLoading,
  isFetching,
}: {
  services: TenantServiceRecord[];
  isLoading: boolean;
  isFetching: boolean;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const servicesQueryKey = trpc.services.list.queryKey();
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "updatedAt", desc: true },
  ]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [categoryOptions, setCategoryOptions] = React.useState<string[]>(() => {
    const unique = new Set<string>([
      ...categoryOptionsSeed,
      ...services.map((service) => service.category),
    ]);
    return Array.from(unique);
  });
  const [updatingServiceId, setUpdatingServiceId] = React.useState<string | null>(
    null,
  );
  const [deletingServiceId, setDeletingServiceId] = React.useState<string | null>(
    null,
  );

  React.useEffect(() => {
    setCategoryOptions((current) => {
      const unique = new Set<string>([
        ...current,
        ...categoryOptionsSeed,
        ...services.map((service) => service.category),
      ]);
      return Array.from(unique);
    });
  }, [services]);

  const createServiceMutation = useMutation(
    trpc.services.create.mutationOptions({
      onSuccess: async (service) => {
        toast.success(`Service "${service.serviceName}" created.`);
        await queryClient.invalidateQueries({ queryKey: servicesQueryKey });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create service.");
      },
    }),
  );

  const updateServiceMutation = useMutation(
    trpc.services.update.mutationOptions({
      onSuccess: async (service) => {
        toast.success(`Service "${service.serviceName}" updated.`);
        await queryClient.invalidateQueries({ queryKey: servicesQueryKey });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update service.");
      },
      onSettled: () => {
        setUpdatingServiceId(null);
      },
    }),
  );

  const deleteServiceMutation = useMutation(
    trpc.services.delete.mutationOptions({
      onSuccess: async (service) => {
        toast.success(`Service "${service.serviceName}" deleted.`);
        await queryClient.invalidateQueries({ queryKey: servicesQueryKey });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete service.");
      },
      onSettled: () => {
        setDeletingServiceId(null);
      },
    }),
  );

  const handleAddCategory = React.useCallback((category: string) => {
    setCategoryOptions((current) =>
      current.includes(category) ? current : [...current, category],
    );
  }, []);

  const handleCreateService = React.useCallback(
    async (values: ServiceFormValues) => {
      await createServiceMutation.mutateAsync({
        serviceName: values.serviceName.trim(),
        category: values.category.trim(),
        price: Number(values.price) || 0,
        unitLabel: values.unitLabel.trim(),
        availability: values.availability.trim(),
        description: values.description.trim(),
      });
    },
    [createServiceMutation],
  );

  const handleUpdateService = React.useCallback(
    async (serviceId: string, values: ServiceFormValues) => {
      setUpdatingServiceId(serviceId);
      await updateServiceMutation.mutateAsync({
        id: serviceId,
        serviceName: values.serviceName.trim(),
        category: values.category.trim(),
        price: Number(values.price) || 0,
        unitLabel: values.unitLabel.trim(),
        availability: values.availability.trim(),
        description: values.description.trim(),
      });
    },
    [updateServiceMutation],
  );

  const handleDeleteService = React.useCallback(
    async (serviceId: string) => {
      setDeletingServiceId(serviceId);
      await deleteServiceMutation.mutateAsync({
        id: serviceId,
      });
    },
    [deleteServiceMutation],
  );

  const columns = React.useMemo(
    () =>
      getColumns({
        categoryOptions,
        onAddCategory: handleAddCategory,
        onUpdateService: handleUpdateService,
        onDeleteService: handleDeleteService,
        updatingServiceId,
        deletingServiceId,
      }),
    [
      categoryOptions,
      deletingServiceId,
      handleAddCategory,
      handleDeleteService,
      handleUpdateService,
      updatingServiceId,
    ],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: services,
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
        row.original.serviceName,
        row.original.category,
        row.original.availability,
        row.original.description,
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
            <h2 className="text-lg font-semibold">Service catalog table</h2>
            <p className="text-sm text-muted-foreground">
              Review guest-facing services, pricing readiness, and selling
              details in one place.
            </p>
          </div>
          <ServiceFormDialog
            mode="create"
            initialValues={defaultServiceForm}
            categoryOptions={categoryOptions}
            onAddCategory={handleAddCategory}
            onSubmit={handleCreateService}
            isPending={createServiceMutation.isPending}
            trigger={
              <Button>
                <PlusIcon className="size-4" />
                Add service
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
                placeholder="Search service, category, or availability..."
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
                    Loading services...
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
                    No services matched your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-3 border-t pt-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            {isFetching && !isLoading
              ? "Syncing latest service updates..."
              : `${services.length} service records tracked. Use the add-service action to expand your guest-facing catalog.`}
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
