"use client";
"use no memo";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  BotIcon,
  CheckIcon,
  ChevronsUpDownIcon,
  Columns3,
  ExternalLinkIcon,
  MoreHorizontalIcon,
  PencilLineIcon,
  PlusIcon,
  Search,
  ShieldAlertIcon,
  Trash2Icon,
} from "lucide-react";
import { useRouter } from "next/navigation";
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

export type TenantAutomationRecord = {
  id: string;
  name: string;
  domain: AutomationDomainValue;
  status: AutomationStatusValue;
  triggerLabel: string;
  assignedTo: string;
  note: string;
  priority: boolean;
  runVolume: number;
  successRate: number;
  updatedAt: Date;
};

type AutomationDomainValue =
  | "RESERVATIONS"
  | "OPERATIONS"
  | "COMMUNICATIONS"
  | "REVENUE";

type AutomationStatusValue = "ACTIVE" | "DRAFT" | "REVIEW" | "PAUSED";

type AutomationFormValues = {
  name: string;
  domain: AutomationDomainValue;
  status: AutomationStatusValue;
  triggerLabel: string;
  assignedTo: string;
  note: string;
  priority: boolean;
};

const domainOptions: Array<{ value: AutomationDomainValue; label: string }> = [
  { value: "RESERVATIONS", label: "Reservations" },
  { value: "OPERATIONS", label: "Operations" },
  { value: "COMMUNICATIONS", label: "Communications" },
  { value: "REVENUE", label: "Revenue" },
];

const statusOptions: Array<{ value: AutomationStatusValue; label: string }> = [
  { value: "ACTIVE", label: "Active" },
  { value: "DRAFT", label: "Draft" },
  { value: "REVIEW", label: "Review" },
  { value: "PAUSED", label: "Paused" },
];

const defaultAutomationForm: AutomationFormValues = {
  name: "",
  domain: "OPERATIONS",
  status: "DRAFT",
  triggerLabel: "",
  assignedTo: "",
  note: "",
  priority: false,
};

function domainToLabel(domain: AutomationDomainValue) {
  return domainOptions.find((option) => option.value === domain)?.label ?? domain;
}

function statusToLabel(status: AutomationStatusValue) {
  return statusOptions.find((option) => option.value === status)?.label ?? status;
}

function getStatusVariant(status: AutomationStatusValue) {
  switch (status) {
    case "ACTIVE":
      return "default" as const;
    case "REVIEW":
      return "secondary" as const;
    case "PAUSED":
      return "outline" as const;
    default:
      return "outline" as const;
  }
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

function buildFormFromWorkflow(
  workflow: TenantAutomationRecord,
): AutomationFormValues {
  return {
    name: workflow.name,
    domain: workflow.domain,
    status: workflow.status,
    triggerLabel: workflow.triggerLabel,
    assignedTo: workflow.assignedTo === "Unassigned" ? "" : workflow.assignedTo,
    note: workflow.note,
    priority: workflow.priority,
  };
}

function AutomationFormDialog({
  mode,
  initialValues,
  onSubmit,
  isPending,
  teamMemberNames,
  trigger,
  open,
  onOpenChange,
}: {
  mode: "create" | "edit";
  initialValues: AutomationFormValues;
  onSubmit: (values: AutomationFormValues) => Promise<void>;
  isPending: boolean;
  teamMemberNames: string[];
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [form, setForm] = React.useState<AutomationFormValues>(initialValues);
  const [ownerPickerOpen, setOwnerPickerOpen] = React.useState(false);
  const resolvedOpen = open ?? internalOpen;
  const setResolvedOpen = onOpenChange ?? setInternalOpen;

  React.useEffect(() => {
    if (resolvedOpen) {
      setForm(initialValues);
    }
  }, [initialValues, resolvedOpen]);

  function updateField<Key extends keyof AutomationFormValues>(
    key: Key,
    value: AutomationFormValues[Key],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  const isSubmitDisabled = !form.name.trim() || !form.triggerLabel.trim();

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
            {mode === "create" ? "Create automation workflow" : "Edit automation workflow"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Set the workflow metadata first, then continue into the visual builder for deeper logic."
              : "Update the workflow details shown in the automation table."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="space-y-2">
            <Label htmlFor={`${mode}-name`}>Workflow name</Label>
            <Input
              id={`${mode}-name`}
              placeholder="e.g. Arrival readiness assistant"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
            />
          </div>

          <div
            className={cn(
              "grid gap-4",
              mode === "edit" ? "md:grid-cols-2" : "md:grid-cols-1",
            )}
          >
            <div className="space-y-2">
              <Label htmlFor={`${mode}-domain`}>Domain</Label>
              <Select
                value={form.domain}
                onValueChange={(value) =>
                  updateField("domain", value as AutomationDomainValue)
                }
              >
                <SelectTrigger className="w-full" id={`${mode}-domain`}>
                  <SelectValue placeholder="Select domain" />
                </SelectTrigger>
                <SelectContent>
                  {domainOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {mode === "edit" ? (
              <div className="space-y-2">
                <Label htmlFor={`${mode}-status`}>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(value) =>
                    updateField("status", value as AutomationStatusValue)
                  }
                >
                  <SelectTrigger className="w-full" id={`${mode}-status`}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${mode}-trigger`}>Trigger label</Label>
            <Input
              id={`${mode}-trigger`}
              placeholder="e.g. Reservation confirmed"
              value={form.triggerLabel}
              onChange={(event) =>
                updateField("triggerLabel", event.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Assigned owner</Label>
            <Popover open={ownerPickerOpen} onOpenChange={setOwnerPickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={ownerPickerOpen}
                  className="w-full justify-between font-normal"
                >
                  <span
                    className={cn(
                      "truncate",
                      !form.assignedTo && "text-muted-foreground",
                    )}
                  >
                    {form.assignedTo || "Select a team member"}
                  </span>
                  <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[var(--radix-popover-trigger-width)] p-0"
                align="start"
              >
                <Command>
                  <CommandInput placeholder="Search team members..." />
                  <CommandList>
                    <CommandEmpty>No team members found.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        value="Unassigned"
                        onSelect={() => {
                          updateField("assignedTo", "");
                          setOwnerPickerOpen(false);
                        }}
                      >
                        Unassigned
                        <CheckIcon
                          className={cn(
                            "ml-auto size-4",
                            form.assignedTo.length === 0
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </CommandItem>
                      {teamMemberNames.map((memberName) => (
                        <CommandItem
                          key={memberName}
                          value={memberName}
                          onSelect={() => {
                            updateField("assignedTo", memberName);
                            setOwnerPickerOpen(false);
                          }}
                        >
                          {memberName}
                          <CheckIcon
                            className={cn(
                              "ml-auto size-4",
                              form.assignedTo === memberName
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${mode}-note`}>Internal note</Label>
            <Textarea
              id={`${mode}-note`}
              placeholder="Add context for what this workflow should automate."
              value={form.note}
              onChange={(event) => updateField("note", event.target.value)}
              className="min-h-24"
            />
          </div>

          <label className="flex items-start gap-3 rounded-lg border bg-muted/30 px-4 py-3">
            <Checkbox
              checked={form.priority}
              onCheckedChange={(value) => updateField("priority", value === true)}
              className="mt-0.5"
            />
            <div>
              <p className="text-sm font-medium">Mark as priority workflow</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Use this for automations that directly affect arrivals, guest
                communication, or revenue recovery.
              </p>
            </div>
          </label>
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
                ? "Creating..."
                : "Saving..."
              : mode === "create"
                ? "Create and open builder"
                : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteAutomationAlert({
  workflowName,
  onConfirm,
  isPending,
  trigger,
  open,
  onOpenChange,
}: {
  workflowName: string;
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
          <AlertDialogTitle>Delete automation workflow?</AlertDialogTitle>
          <AlertDialogDescription>
            {workflowName} will be removed from this tenant workspace. This
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
            {isPending ? "Deleting..." : "Delete workflow"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function AutomationRowActions({
  workflow,
  onUpdateWorkflow,
  onDeleteWorkflow,
  teamMemberNames,
  updatingWorkflowId,
  deletingWorkflowId,
}: {
  workflow: TenantAutomationRecord;
  onUpdateWorkflow: (
    workflowId: string,
    values: AutomationFormValues,
  ) => Promise<void>;
  onDeleteWorkflow: (workflowId: string) => Promise<void>;
  teamMemberNames: string[];
  updatingWorkflowId: string | null;
  deletingWorkflowId: string | null;
}) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <MoreHorizontalIcon className="size-4" />
            <span className="sr-only">Open workflow actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
              setMenuOpen(false);
              router.push(`/tenant/settings/automations/${workflow.id}`);
            }}
          >
            <ExternalLinkIcon className="size-4" />
            Open builder
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
              setMenuOpen(false);
              setEditOpen(true);
            }}
          >
            <PencilLineIcon className="size-4" />
            Edit details
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

      <AutomationFormDialog
        mode="edit"
        open={editOpen}
        onOpenChange={setEditOpen}
        initialValues={buildFormFromWorkflow(workflow)}
        onSubmit={(values) => onUpdateWorkflow(workflow.id, values)}
        isPending={updatingWorkflowId === workflow.id}
        teamMemberNames={teamMemberNames}
      />

      <DeleteAutomationAlert
        workflowName={workflow.name}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={() => onDeleteWorkflow(workflow.id)}
        isPending={deletingWorkflowId === workflow.id}
      />
    </>
  );
}

function getColumns({
  onUpdateWorkflow,
  onDeleteWorkflow,
  teamMemberNames,
  updatingWorkflowId,
  deletingWorkflowId,
}: {
  onUpdateWorkflow: (
    workflowId: string,
    values: AutomationFormValues,
  ) => Promise<void>;
  onDeleteWorkflow: (workflowId: string) => Promise<void>;
  teamMemberNames: string[];
  updatingWorkflowId: string | null;
  deletingWorkflowId: string | null;
}): ColumnDef<TenantAutomationRecord>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => sortableHeader("Workflow", column),
      cell: ({ row }) => (
        <div className="min-w-72">
          <div className="flex items-start gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-900">
              <BotIcon className="size-4" />
            </div>
            <div>
              <p className="font-medium text-foreground">{row.original.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {row.original.triggerLabel}
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "domain",
      header: ({ column }) => sortableHeader("Domain", column),
      cell: ({ row }) => (
        <Badge variant="outline">{domainToLabel(row.original.domain)}</Badge>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => sortableHeader("Status", column),
      cell: ({ row }) => (
        <Badge variant={getStatusVariant(row.original.status)}>
          {statusToLabel(row.original.status)}
        </Badge>
      ),
    },
    {
      accessorKey: "assignedTo",
      header: ({ column }) => sortableHeader("Owner", column),
      cell: ({ row }) => (
        <div className="min-w-32 text-sm text-muted-foreground">
          {row.original.assignedTo}
        </div>
      ),
    },
    {
      accessorKey: "runVolume",
      header: ({ column }) => sortableHeader("Run volume", column),
      cell: ({ row }) => (
        <div className="min-w-24 text-sm">{row.original.runVolume}</div>
      ),
    },
    {
      accessorKey: "successRate",
      header: ({ column }) => sortableHeader("Success", column),
      cell: ({ row }) => (
        <div className="min-w-20 text-sm">{row.original.successRate}%</div>
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
          <AutomationRowActions
            workflow={row.original}
            onUpdateWorkflow={onUpdateWorkflow}
            onDeleteWorkflow={onDeleteWorkflow}
            teamMemberNames={teamMemberNames}
            updatingWorkflowId={updatingWorkflowId}
            deletingWorkflowId={deletingWorkflowId}
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];
}

export function AutomationSettingsTable({
  workflows,
  isLoading,
  isFetching,
}: {
  workflows: TenantAutomationRecord[];
  isLoading: boolean;
  isFetching: boolean;
}) {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const workflowsQueryKey = trpc.automations.list.queryKey();
  const teamMembersQuery = useQuery(trpc.team.list.queryOptions());
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "updatedAt", desc: true },
  ]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [domainFilter, setDomainFilter] = React.useState<string>("ALL");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [updatingWorkflowId, setUpdatingWorkflowId] = React.useState<string | null>(
    null,
  );
  const [deletingWorkflowId, setDeletingWorkflowId] = React.useState<string | null>(
    null,
  );

  const teamMemberNames = React.useMemo(
    () =>
      [...new Set((teamMembersQuery.data ?? []).map((member) => member.name.trim()))]
        .filter((memberName) => memberName.length > 0)
        .sort((a, b) => a.localeCompare(b)),
    [teamMembersQuery.data],
  );

  const createWorkflowMutation = useMutation(
    trpc.automations.create.mutationOptions({
      onSuccess: async (workflow) => {
        toast.success(`${workflow.name} created.`);
        await queryClient.invalidateQueries({ queryKey: workflowsQueryKey });
        router.push(`/tenant/settings/automations/${workflow.id}`);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create automation workflow.");
      },
    }),
  );

  const updateWorkflowMutation = useMutation(
    trpc.automations.update.mutationOptions({
      onSuccess: async (workflow) => {
        toast.success(`${workflow.name} updated.`);
        await queryClient.invalidateQueries({ queryKey: workflowsQueryKey });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update automation workflow.");
      },
      onSettled: () => {
        setUpdatingWorkflowId(null);
      },
    }),
  );

  const deleteWorkflowMutation = useMutation(
    trpc.automations.delete.mutationOptions({
      onSuccess: async (workflow) => {
        toast.success(`${workflow.name} deleted.`);
        await queryClient.invalidateQueries({ queryKey: workflowsQueryKey });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete automation workflow.");
      },
      onSettled: () => {
        setDeletingWorkflowId(null);
      },
    }),
  );

  const handleCreateWorkflow = React.useCallback(
    async (values: AutomationFormValues) => {
      await createWorkflowMutation.mutateAsync({
        name: values.name,
        domain: values.domain,
        triggerLabel: values.triggerLabel,
        assignedTo: values.assignedTo,
        note: values.note,
        priority: values.priority,
      });
    },
    [createWorkflowMutation],
  );

  const handleUpdateWorkflow = React.useCallback(
    async (workflowId: string, values: AutomationFormValues) => {
      setUpdatingWorkflowId(workflowId);
      await updateWorkflowMutation.mutateAsync({
        id: workflowId,
        ...values,
      });
    },
    [updateWorkflowMutation],
  );

  const handleDeleteWorkflow = React.useCallback(
    async (workflowId: string) => {
      setDeletingWorkflowId(workflowId);
      await deleteWorkflowMutation.mutateAsync({
        id: workflowId,
      });
    },
    [deleteWorkflowMutation],
  );

  const filteredWorkflows = React.useMemo(
    () =>
      workflows.filter((workflow) => {
        if (domainFilter !== "ALL" && workflow.domain !== domainFilter) {
          return false;
        }

        if (statusFilter !== "ALL" && workflow.status !== statusFilter) {
          return false;
        }

        return true;
      }),
    [domainFilter, statusFilter, workflows],
  );

  const columns = React.useMemo(
    () =>
      getColumns({
        onUpdateWorkflow: handleUpdateWorkflow,
        onDeleteWorkflow: handleDeleteWorkflow,
        teamMemberNames,
        updatingWorkflowId,
        deletingWorkflowId,
      }),
    [
      deletingWorkflowId,
      handleDeleteWorkflow,
      handleUpdateWorkflow,
      teamMemberNames,
      updatingWorkflowId,
    ],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: filteredWorkflows,
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
        row.original.name,
        domainToLabel(row.original.domain),
        statusToLabel(row.original.status),
        row.original.triggerLabel,
        row.original.assignedTo,
        row.original.note,
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
            <h2 className="text-lg font-semibold">Automation workflows table</h2>
            <p className="text-sm text-muted-foreground">
              Review workflow metadata, open the builder, and keep live
              automation coverage visible in one place.
            </p>
          </div>
          <AutomationFormDialog
            mode="create"
            initialValues={defaultAutomationForm}
            onSubmit={handleCreateWorkflow}
            isPending={createWorkflowMutation.isPending}
            teamMemberNames={teamMemberNames}
            trigger={
              <Button>
                <PlusIcon className="size-4" />
                Create automation
              </Button>
            }
          />
        </div>

        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-1 flex-col gap-3 md:flex-row">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={(table.getState().globalFilter as string) ?? ""}
                onChange={(event) => table.setGlobalFilter(event.target.value)}
                placeholder="Search workflow, trigger, owner, or notes..."
                className="pl-9"
              />
            </div>

            <Select value={domainFilter} onValueChange={setDomainFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="All domains" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All domains</SelectItem>
                {domainOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[160px]">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All statuses</SelectItem>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                    Loading automation workflows...
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
                    No automation workflows matched your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-3 border-t pt-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlertIcon className="size-4" />
            <p>
              {isFetching && !isLoading
                ? "Syncing latest workflow updates..."
                : `${workflows.length} workflow records tracked. Create one here, then open the visual builder to shape its logic.`}
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
