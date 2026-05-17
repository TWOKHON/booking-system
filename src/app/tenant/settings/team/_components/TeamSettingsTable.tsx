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
  CalendarDaysIcon,
  CheckCircle2Icon,
  Columns3,
  EyeIcon,
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

export type TenantTeamMemberRecord = {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: TeamRoleValue;
  status: TeamInviteStatusValue;
  updatedAt: Date;
};

type TeamRoleValue =
  | "OWNER_ADMIN"
  | "MANAGER"
  | "FRONT_DESK"
  | "HOUSEKEEPING"
  | "MAINTENANCE";

type TeamInviteStatusValue = "ACCEPTED" | "PENDING";

type TeamMemberFormValues = {
  name: string;
  email: string;
  role: TeamRoleValue;
  status: TeamInviteStatusValue;
};

type PermissionDefinition = {
  title: string;
  description: string;
};

const roleOptions: Array<{ value: TeamRoleValue; label: string }> = [
  { value: "OWNER_ADMIN", label: "Owner/Admin" },
  { value: "MANAGER", label: "Manager" },
  { value: "FRONT_DESK", label: "Front Desk" },
  { value: "HOUSEKEEPING", label: "Housekeeping" },
  { value: "MAINTENANCE", label: "Maintenance" },
];

const rolePermissionMap: Record<
  TeamRoleValue,
  {
    label: string;
    summary: string;
    permissions: PermissionDefinition[];
  }
> = {
  OWNER_ADMIN: {
    label: "Owner/Admin",
    summary: "Full property, team, billing, and settings control.",
    permissions: [
      {
        title: "Workspace administration",
        description: "Can manage team access, roles, automations, and core property settings.",
      },
      {
        title: "Commercial controls",
        description: "Can adjust pricing, services, and direct-selling configuration.",
      },
      {
        title: "Financial oversight",
        description: "Can review billing details and other high-sensitivity account controls.",
      },
    ],
  },
  MANAGER: {
    label: "Manager",
    summary: "Broad day-to-day operational and guest service oversight.",
    permissions: [
      {
        title: "Operations coordination",
        description: "Can oversee reservations, arrivals, service flow, and operational follow-through.",
      },
      {
        title: "Team supervision",
        description: "Can manage work queues and keep departments aligned during live operations.",
      },
      {
        title: "Reporting visibility",
        description: "Can review performance data needed for daily management decisions.",
      },
    ],
  },
  FRONT_DESK: {
    label: "Front Desk",
    summary: "Reservation, check-in, and guest communication support.",
    permissions: [
      {
        title: "Reservation handling",
        description: "Can manage booking details, arrivals, departures, and guest-facing stay information.",
      },
      {
        title: "Guest messaging",
        description: "Can respond to guest questions and operational service needs.",
      },
      {
        title: "Limited commercial scope",
        description: "Can support bookings without broader pricing or billing administration.",
      },
    ],
  },
  HOUSEKEEPING: {
    label: "Housekeeping",
    summary: "Room-readiness and service execution support.",
    permissions: [
      {
        title: "Room status visibility",
        description: "Can monitor assigned room tasks and keep turnover progress current.",
      },
      {
        title: "Task-focused access",
        description: "Can work inside housekeeping-related operational views only.",
      },
      {
        title: "Guest readiness support",
        description: "Can help keep amenities and room preparation aligned with arrivals.",
      },
    ],
  },
  MAINTENANCE: {
    label: "Maintenance",
    summary: "Property issue handling and room blocker resolution.",
    permissions: [
      {
        title: "Repair workflow access",
        description: "Can track maintenance requests and operational blockers tied to rooms or facilities.",
      },
      {
        title: "Task execution visibility",
        description: "Can work inside maintenance-focused task views without broader admin access.",
      },
      {
        title: "Operational escalation support",
        description: "Can help resolve issues that affect guest readiness and room sellability.",
      },
    ],
  },
};

const defaultTeamMemberForm: TeamMemberFormValues = {
  name: "",
  email: "",
  role: "FRONT_DESK",
  status: "ACCEPTED",
};

function roleToLabel(role: TeamRoleValue) {
  return roleOptions.find((option) => option.value === role)?.label ?? role;
}

function statusToLabel(status: TeamInviteStatusValue) {
  return status === "ACCEPTED" ? "Accepted" : "Pending";
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

function buildFormFromMember(
  member: TenantTeamMemberRecord,
): TeamMemberFormValues {
  return {
    name: member.name,
    email: member.email,
    role: member.role,
    status: member.status,
  };
}

function TeamMemberFormDialog({
  mode,
  initialValues,
  onSubmit,
  isPending,
  trigger,
  open,
  onOpenChange,
}: {
  mode: "create" | "edit";
  initialValues: TeamMemberFormValues;
  onSubmit: (values: TeamMemberFormValues) => Promise<void>;
  isPending: boolean;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [form, setForm] = React.useState<TeamMemberFormValues>(initialValues);
  const resolvedOpen = open ?? internalOpen;
  const setResolvedOpen = onOpenChange ?? setInternalOpen;

  React.useEffect(() => {
    if (resolvedOpen) {
      setForm(initialValues);
    }
  }, [initialValues, resolvedOpen]);

  function updateField<Key extends keyof TeamMemberFormValues>(
    key: Key,
    value: TeamMemberFormValues[Key],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  const isSubmitDisabled = !form.name.trim() || !form.email.trim();

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
            {mode === "create" ? "Invite team member" : "Edit team member"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Invite the right people into your workspace and assign the right role from the start."
              : "Update this team member’s access details and role assignment."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="space-y-2">
            <Label htmlFor={`${mode}-name`}>Full name</Label>
            <Input
              id={`${mode}-name`}
              placeholder="e.g. Sarah Reyes"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${mode}-email`}>Email address</Label>
            <Input
              id={`${mode}-email`}
              type="email"
              placeholder="e.g. sarah@resort.com"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${mode}-role`}>Role</Label>
            <Select
              value={form.role}
              onValueChange={(value) =>
                updateField("role", value as TeamRoleValue)
              }
            >
              <SelectTrigger className="w-full" id={`${mode}-role`}>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-lg border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
          Role permissions are enforced at the workspace level, so choose the
          smallest role that still allows the team member to do their work.
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
                ? "Inviting..."
                : "Saving..."
              : mode === "create"
                ? "Send invite"
                : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PermissionReviewDialog({
  role,
  trigger,
  open,
  onOpenChange,
}: {
  role: TeamRoleValue;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const resolvedOpen = open ?? internalOpen;
  const setResolvedOpen = onOpenChange ?? setInternalOpen;
  const roleDefinition = rolePermissionMap[role];

  return (
    <Dialog open={resolvedOpen} onOpenChange={setResolvedOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{roleDefinition.label} permissions</DialogTitle>
          <DialogDescription>{roleDefinition.summary}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {roleDefinition.permissions.map((permission) => (
            <div
              key={permission.title}
              className="rounded-xl border bg-background px-4 py-4"
            >
              <div className="flex items-start gap-3">
                <ShieldCheckIcon className="mt-0.5 size-4 shrink-0 text-zinc-800" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {permission.title}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {permission.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button type="button" onClick={() => setResolvedOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteTeamMemberAlert({
  memberName,
  onConfirm,
  isPending,
  trigger,
  open,
  onOpenChange,
}: {
  memberName: string;
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
          <AlertDialogTitle>Delete team member?</AlertDialogTitle>
          <AlertDialogDescription>
            {memberName} will be removed from this workspace access list. This
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
            {isPending ? "Deleting..." : "Delete team member"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function TeamRowActions({
  member,
  onUpdateMember,
  onDeleteMember,
  onMarkAccepted,
  updatingMemberId,
  deletingMemberId,
}: {
  member: TenantTeamMemberRecord;
  onUpdateMember: (
    memberId: string,
    values: TeamMemberFormValues,
  ) => Promise<void>;
  onDeleteMember: (memberId: string) => Promise<void>;
  onMarkAccepted: (member: TenantTeamMemberRecord) => Promise<void>;
  updatingMemberId: string | null;
  deletingMemberId: string | null;
}) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [permissionsOpen, setPermissionsOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <MoreHorizontalIcon className="size-4" />
            <span className="sr-only">Open team member actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
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
          {member.status === "PENDING" ? (
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
                setMenuOpen(false);
                void onMarkAccepted(member);
              }}
            >
              <CheckCircle2Icon className="size-4" />
              Mark as accepted
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
              setMenuOpen(false);
              setPermissionsOpen(true);
            }}
          >
            <EyeIcon className="size-4" />
            Review permissions
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

      <TeamMemberFormDialog
        mode="edit"
        open={editOpen}
        onOpenChange={setEditOpen}
        initialValues={buildFormFromMember(member)}
        onSubmit={(values) => onUpdateMember(member.id, values)}
        isPending={updatingMemberId === member.id}
      />

      <PermissionReviewDialog
        role={member.role}
        open={permissionsOpen}
        onOpenChange={setPermissionsOpen}
      />

      <DeleteTeamMemberAlert
        memberName={member.name}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={() => onDeleteMember(member.id)}
        isPending={deletingMemberId === member.id}
      />
    </>
  );
}

function getColumns({
  onUpdateMember,
  onDeleteMember,
  onMarkAccepted,
  updatingMemberId,
  deletingMemberId,
}: {
  onUpdateMember: (
    memberId: string,
    values: TeamMemberFormValues,
  ) => Promise<void>;
  onDeleteMember: (memberId: string) => Promise<void>;
  onMarkAccepted: (member: TenantTeamMemberRecord) => Promise<void>;
  updatingMemberId: string | null;
  deletingMemberId: string | null;
}): ColumnDef<TenantTeamMemberRecord>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => sortableHeader("Team member", column),
      cell: ({ row }) => (
        <div className="min-w-56">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-900">
              {row.original.initials}
            </div>
            <div>
              <p className="font-medium text-foreground">{row.original.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {row.original.email}
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: ({ column }) => sortableHeader("Role", column),
      cell: ({ row }) => (
        <Badge variant="outline">{roleToLabel(row.original.role)}</Badge>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => sortableHeader("Status", column),
      cell: ({ row }) => (
        <div className="flex min-w-24 items-center gap-2 text-sm">
          {row.original.status === "ACCEPTED" ? (
            <CheckCircle2Icon className="size-4 text-emerald-600" />
          ) : (
            <CalendarDaysIcon className="size-4 text-zinc-500" />
          )}
          <span>{statusToLabel(row.original.status)}</span>
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
          <TeamRowActions
            member={row.original}
            onUpdateMember={onUpdateMember}
            onDeleteMember={onDeleteMember}
            onMarkAccepted={onMarkAccepted}
            updatingMemberId={updatingMemberId}
            deletingMemberId={deletingMemberId}
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];
}

export function TeamSettingsTable({
  members,
  isLoading,
  isFetching,
}: {
  members: TenantTeamMemberRecord[];
  isLoading: boolean;
  isFetching: boolean;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const teamQueryKey = trpc.team.list.queryKey();
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "updatedAt", desc: true },
  ]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [updatingMemberId, setUpdatingMemberId] = React.useState<string | null>(
    null,
  );
  const [deletingMemberId, setDeletingMemberId] = React.useState<string | null>(
    null,
  );
  const [permissionsOpen, setPermissionsOpen] = React.useState(false);

  const createMemberMutation = useMutation(
    trpc.team.create.mutationOptions({
      onSuccess: async (member) => {
        toast.success(`Invite created for ${member.name}.`);
        await queryClient.invalidateQueries({ queryKey: teamQueryKey });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to invite team member.");
      },
    }),
  );

  const updateMemberMutation = useMutation(
    trpc.team.update.mutationOptions({
      onSuccess: async (member) => {
        toast.success(`${member.name} updated.`);
        await queryClient.invalidateQueries({ queryKey: teamQueryKey });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update team member.");
      },
      onSettled: () => {
        setUpdatingMemberId(null);
      },
    }),
  );

  const deleteMemberMutation = useMutation(
    trpc.team.delete.mutationOptions({
      onSuccess: async (member) => {
        toast.success(`${member.name ?? member.email} deleted.`);
        await queryClient.invalidateQueries({ queryKey: teamQueryKey });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete team member.");
      },
      onSettled: () => {
        setDeletingMemberId(null);
      },
    }),
  );

  const handleCreateMember = React.useCallback(
    async (values: TeamMemberFormValues) => {
      await createMemberMutation.mutateAsync({
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        role: values.role,
        status: "ACCEPTED",
      });
    },
    [createMemberMutation],
  );

  const handleUpdateMember = React.useCallback(
    async (memberId: string, values: TeamMemberFormValues) => {
      setUpdatingMemberId(memberId);
      await updateMemberMutation.mutateAsync({
        id: memberId,
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        role: values.role,
        status: values.status,
      });
    },
    [updateMemberMutation],
  );

  const handleDeleteMember = React.useCallback(
    async (memberId: string) => {
      setDeletingMemberId(memberId);
      await deleteMemberMutation.mutateAsync({
        id: memberId,
      });
    },
    [deleteMemberMutation],
  );

  const handleMarkAccepted = React.useCallback(
    async (member: TenantTeamMemberRecord) => {
      setUpdatingMemberId(member.id);
      await updateMemberMutation.mutateAsync({
        id: member.id,
        name: member.name.trim(),
        email: member.email.trim().toLowerCase(),
        role: member.role,
        status: "ACCEPTED",
      });
    },
    [updateMemberMutation],
  );

  const columns = React.useMemo(
    () =>
      getColumns({
        onUpdateMember: handleUpdateMember,
        onDeleteMember: handleDeleteMember,
        onMarkAccepted: handleMarkAccepted,
        updatingMemberId,
        deletingMemberId,
      }),
    [
      deletingMemberId,
      handleDeleteMember,
      handleMarkAccepted,
      handleUpdateMember,
      updatingMemberId,
    ],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: members,
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
        row.original.email,
        roleToLabel(row.original.role),
        statusToLabel(row.original.status),
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
            <h2 className="text-lg font-semibold">Team access table</h2>
            <p className="text-sm text-muted-foreground">
              Review team invites, role assignments, and workspace access in
              one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <PermissionReviewDialog
              role="OWNER_ADMIN"
              open={permissionsOpen}
              onOpenChange={setPermissionsOpen}
              trigger={
                <Button variant="outline">
                  <EyeIcon className="size-4" />
                  Review permissions
                </Button>
              }
            />
            <TeamMemberFormDialog
              mode="create"
              initialValues={defaultTeamMemberForm}
              onSubmit={handleCreateMember}
              isPending={createMemberMutation.isPending}
              trigger={
                <Button>
                  <PlusIcon className="size-4" />
                  Invite team member
                </Button>
              }
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={(table.getState().globalFilter as string) ?? ""}
                onChange={(event) => table.setGlobalFilter(event.target.value)}
                placeholder="Search name, email, role, or status..."
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
                    Loading team members...
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
                    No team members matched your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-3 border-t pt-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            {isFetching && !isLoading
              ? "Syncing latest team access updates..."
              : `${members.length} team access records tracked. Use the invite action to grow the workspace team responsibly.`}
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
