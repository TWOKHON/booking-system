"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bookmark,
  CalendarDays,
  Check,
  Clock,
  Paperclip,
  Phone,
  Send,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTRPC } from "@/trpc/client";
import {
  maintenanceAssignees,
  maintenancePriorities,
  maintenanceTypes,
  type MaintenancePriority,
  type MaintenanceRequest,
  type MaintenanceStatus,
  type MaintenanceType,
} from "./maintenance-data";

type MaintenanceFormViewProps = {
  maintenanceId: string;
};

type MaintenanceFormState = {
  requestType: MaintenanceType | "";
  priority: MaintenancePriority | "";
  status: MaintenanceStatus;
  propertyArea: string;
  location: string;
  issueTitle: string;
  description: string;
  category: string;
  asset: string;
  reportedBy: string;
  contactNumber: string;
  preferredDate: string;
  preferredTime: string;
  urgent: boolean;
};

const categories = [
  "Guest room",
  "Public area",
  "Back of house",
  "Safety",
  "Preventive maintenance",
  "Asset upkeep",
];

const assets = [
  "Room AC unit",
  "Pool pump",
  "Generator",
  "Wi-Fi router",
  "Treadmill",
  "Water heater",
  "Fire extinguisher",
];

const sourceToArea = (request?: MaintenanceRequest | null) => {
  return request?.propertyArea ?? "";
};

export function MaintenanceFormView({
  maintenanceId,
}: MaintenanceFormViewProps) {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const isCreate = maintenanceId === "create";
  const requestQuery = useQuery({
    ...trpc.maintenance.get.queryOptions({ id: maintenanceId }),
    enabled: !isCreate,
  });
  const requestsQuery = useQuery(trpc.maintenance.list.queryOptions());
  const roomsQuery = useQuery(trpc.rooms.list.queryOptions());
  const employeesQuery = useQuery(trpc.employees.list.queryOptions());
  const existingRequest = requestQuery.data ?? null;
  const [form, setForm] = React.useState<MaintenanceFormState>(() =>
    createInitialState(existingRequest),
  );
  const roomLocations = React.useMemo(
    () =>
      (roomsQuery.data ?? []).map((room) => ({
        label: `${room.roomName} - ${room.category}`,
        area: room.zone || "Guest rooms",
      })),
    [roomsQuery.data],
  );
  const savedLocations = React.useMemo(
    () =>
      (requestsQuery.data ?? [])
        .filter((request) => request.location.trim().length > 0)
        .map((request) => ({
          label: request.location,
          area: request.propertyArea,
        })),
    [requestsQuery.data],
  );
  const locationOptions = React.useMemo(() => {
    const options = new Map<string, string>();

    for (const room of roomLocations) {
      options.set(room.label, room.area);
    }

    for (const location of savedLocations) {
      options.set(location.label, location.area);
    }

    if (existingRequest?.location) {
      options.set(existingRequest.location, existingRequest.propertyArea);
    }

    return Array.from(options, ([label, area]) => ({ label, area }));
  }, [existingRequest, roomLocations, savedLocations]);
  const propertyAreaOptions = React.useMemo(() => {
    const areas = new Set<string>();

    for (const room of roomsQuery.data ?? []) {
      if (room.zone) {
        areas.add(room.zone);
      }
    }

    for (const request of requestsQuery.data ?? []) {
      if (request.propertyArea) {
        areas.add(request.propertyArea);
      }
    }

    if (existingRequest?.propertyArea) {
      areas.add(existingRequest.propertyArea);
    }

    return Array.from(areas).sort((a, b) => a.localeCompare(b));
  }, [existingRequest, requestsQuery.data, roomsQuery.data]);
  const reporterOptions = React.useMemo(() => {
    const names = new Set<string>(maintenanceAssignees);

    for (const employee of employeesQuery.data ?? []) {
      names.add(employee.fullName);
    }

    names.add("Front Desk");
    names.add("Guest Services");

    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [employeesQuery.data]);
  const title = isCreate ? "New request" : "Update request";
  const description = isCreate
    ? "Report a maintenance issue or request a service. Our team will review and take appropriate action."
    : "Update maintenance issue details, priority, scheduling, and supporting notes.";
  const createMutation = useMutation(
    trpc.maintenance.create.mutationOptions({
      onSuccess: async () => {
        toast.success("Maintenance request submitted.");
        await queryClient.invalidateQueries(trpc.maintenance.list.queryOptions());
        router.push("/tenant/operations/maintenance");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to submit maintenance request.");
      },
    }),
  );
  const saveDraftMutation = useMutation(
    trpc.maintenance.saveDraft.mutationOptions({
      onSuccess: async () => {
        toast.success("Draft request saved.");
        await queryClient.invalidateQueries(trpc.maintenance.list.queryOptions());
        router.push("/tenant/operations/maintenance");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to save draft request.");
      },
    }),
  );
  const updateMutation = useMutation(
    trpc.maintenance.update.mutationOptions({
      onSuccess: async () => {
        toast.success("Maintenance request updated.");
        await queryClient.invalidateQueries(trpc.maintenance.list.queryOptions());
        await queryClient.invalidateQueries(
          trpc.maintenance.get.queryOptions({ id: maintenanceId }),
        );
        router.push("/tenant/operations/maintenance");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update maintenance request.");
      },
    }),
  );
  const canSubmit =
    form.requestType !== "" &&
    form.priority !== "" &&
    form.propertyArea.trim().length > 0 &&
    form.location.trim().length > 0 &&
    form.issueTitle.trim().length > 0 &&
    form.description.trim().length > 0 &&
    form.category.trim().length > 0 &&
    form.reportedBy.trim().length > 0;

  const update = <K extends keyof MaintenanceFormState>(
    key: K,
    value: MaintenanceFormState[K],
  ) => setForm((current) => ({ ...current, [key]: value }));

  React.useEffect(() => {
    if (existingRequest) {
      setForm(createInitialState(existingRequest));
    }
  }, [existingRequest]);

  const isSaving =
    createMutation.isPending ||
    saveDraftMutation.isPending ||
    updateMutation.isPending;

  const buildPayload = () => {
    if (form.requestType === "" || form.priority === "") {
      return null;
    }

    return {
      requestType: form.requestType,
      priority: form.priority,
      status: form.status,
      propertyArea: form.propertyArea,
      location: form.location,
      issueTitle: form.issueTitle,
      description: form.description,
      category: form.category,
      asset: form.asset,
      reportedBy: form.reportedBy,
      contactNumber: form.contactNumber,
      preferredDate: form.preferredDate,
      preferredTime: form.preferredTime,
      urgent: form.urgent,
    };
  };

  const handleSaveDraft = () => {
    if (!canSubmit) return;

    const payload = buildPayload();

    if (!payload) return;

    if (isCreate) {
      saveDraftMutation.mutate(payload);
      return;
    }

    updateMutation.mutate({
      ...payload,
      id: maintenanceId,
      status: "Draft",
    });
  };

  const handleSubmit = () => {
    if (!canSubmit) return;

    const payload = buildPayload();

    if (!payload) return;

    if (isCreate) {
      createMutation.mutate({
        ...payload,
        status: "Open",
      });
      return;
    }

    updateMutation.mutate({
      ...payload,
      id: maintenanceId,
      status: form.status === "Draft" ? "Open" : form.status,
    });
  };

  return (
    <main className="flex flex-1 flex-col gap-5">
      <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button asChild variant="outline" className="gap-2">
            <Link href="/tenant/operations/maintenance">
              <X className="size-4" />
              Cancel
            </Link>
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={handleSaveDraft}
            disabled={!canSubmit || isSaving}
          >
            <Bookmark className="size-4" />
            {isSaving ? "Saving..." : "Save as draft"}
          </Button>
          <Button
            className="gap-2"
            onClick={handleSubmit}
            disabled={!canSubmit || isSaving}
          >
            {isCreate ? <Send className="size-4" /> : <Check className="size-4" />}
            {isSaving
              ? "Saving..."
              : isCreate
                ? "Submit request"
                : "Update request"}
          </Button>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <FormSection title="Request details">
            <div className="grid gap-4 lg:grid-cols-2">
              <Field label="Request type" required>
                <Select
                  value={form.requestType}
                  onValueChange={(value: MaintenanceType) =>
                    update("requestType", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select request type" />
                  </SelectTrigger>
                  <SelectContent>
                    {maintenanceTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Priority" required>
                <Select
                  value={form.priority}
                  onValueChange={(value: MaintenancePriority) =>
                    update("priority", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {maintenancePriorities.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {priority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Property area" required>
                <Select
                  value={form.propertyArea}
                  onValueChange={(value) => update("propertyArea", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select area" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyAreaOptions.length > 0 ? (
                      propertyAreaOptions.map((area) => (
                        <SelectItem key={area} value={area}>
                          {area}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="__empty" disabled>
                        No property areas found
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Location (room / area)" required>
                <Select
                  value={form.location}
                  onValueChange={(value) => {
                    update("location", value);
                    const selected = locationOptions.find(
                      (option) => option.label === value,
                    );

                    if (selected) {
                      update("propertyArea", selected.area);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        roomsQuery.isLoading || requestsQuery.isLoading
                          ? "Loading locations..."
                          : "Search or select room/area"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {locationOptions.length > 0 ? (
                      locationOptions.map((location) => (
                        <SelectItem key={location.label} value={location.label}>
                          {location.label}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="__empty" disabled>
                        No rooms or saved locations found
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field label="Issue title" required>
              <div className="relative">
                <Input
                  value={form.issueTitle}
                  maxLength={100}
                  onChange={(event) => update("issueTitle", event.target.value)}
                  placeholder="Enter a short summary of the issue"
                  className="pr-16"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  {form.issueTitle.length} / 100
                </span>
              </div>
            </Field>

            <Field label="Description" required>
              <div className="relative">
                <Textarea
                  value={form.description}
                  maxLength={1000}
                  onChange={(event) => update("description", event.target.value)}
                  placeholder="Provide details about the issue, when it started, and any impact."
                  className="min-h-32 resize-none pr-18"
                />
                <span className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                  {form.description.length} / 1000
                </span>
              </div>
            </Field>

            <div className="grid gap-4 lg:grid-cols-2">
              <Field label="Category" required>
                <Select
                  value={form.category}
                  onValueChange={(value) => update("category", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Asset (optional)">
                <Select
                  value={form.asset}
                  onValueChange={(value) => update("asset", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Search or select asset" />
                  </SelectTrigger>
                  <SelectContent>
                    {assets.map((asset) => (
                      <SelectItem key={asset} value={asset}>
                        {asset}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Reported by" required>
                <Select
                  value={form.reportedBy}
                  onValueChange={(value) => update("reportedBy", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select reporter" />
                  </SelectTrigger>
                  <SelectContent>
                    {reporterOptions.map((assignee) => (
                      <SelectItem key={assignee} value={assignee}>
                        {assignee}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Contact number (optional)">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={form.contactNumber}
                    onChange={(event) =>
                      update("contactNumber", event.target.value)
                    }
                    placeholder="Enter contact number"
                    className="pl-9"
                  />
                </div>
              </Field>

              <Field label="Preferred date">
                <div className="relative">
                  <Input
                    type="date"
                    value={form.preferredDate}
                    onChange={(event) =>
                      update("preferredDate", event.target.value)
                    }
                  />
                  <CalendarDays className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </Field>

              <Field label="Preferred time">
                <div className="relative">
                  <Input
                    type="time"
                    value={form.preferredTime}
                    onChange={(event) =>
                      update("preferredTime", event.target.value)
                    }
                  />
                  <Clock className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </Field>
            </div>

            <label className="flex items-start gap-3 text-sm">
              <Checkbox
                checked={form.urgent}
                onCheckedChange={(value) => update("urgent", !!value)}
              />
              <span>
                <span className="block font-medium">Urgent request</span>
                <span className="text-xs text-muted-foreground">
                  Check if immediate attention is needed
                </span>
              </span>
            </label>

            <Field label="Attachments (optional)">
              <div className="grid min-h-32 place-items-center rounded-lg border border-dashed bg-muted/20 p-5 text-center">
                <div>
                  <Upload className="mx-auto size-5 text-muted-foreground" />
                  <p className="mt-2 text-sm font-medium">
                    Drag and drop files here, or click to browse
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    JPG, PNG, PDF up to 10MB each
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Button type="button" variant="outline" size="sm" className="gap-2">
                  <Paperclip className="size-4" />
                  Add attachment
                </Button>
                <span className="text-xs text-muted-foreground">
                  PDF, DOC, XLS up to 10MB
                </span>
              </div>
            </Field>
          </FormSection>
        </div>

        <aside className="space-y-5">
          <RequestSummaryPanel form={form} />
          <GuidelinesPanel />
        </aside>
      </section>
    </main>
  );
}

function createInitialState(
  request: MaintenanceRequest | null,
): MaintenanceFormState {
  return {
    requestType: request?.type ?? "",
    priority: request?.priority ?? "",
    status: request?.status ?? "Open",
    propertyArea: sourceToArea(request),
    location: request?.roomArea ?? "",
    issueTitle: request?.title ?? "",
    description: request?.description ?? "",
    category: request?.category ?? "",
    asset: request?.asset ?? "",
    reportedBy: request?.reportedBy ?? "Front Desk",
    contactNumber: request?.contactNumber ?? "",
    preferredDate: request?.preferredDate ?? "",
    preferredTime: request?.preferredTime ?? "",
    urgent: request?.priority === "High" || request?.status === "Overdue",
  };
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border bg-background p-5 shadow-sm">
      <h2 className="text-base font-semibold">{title}</h2>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label className="text-sm">
        {label}
        {required ? <span className="text-red-600">*</span> : null}
      </Label>
      {children}
    </div>
  );
}

function RequestSummaryPanel({ form }: { form: MaintenanceFormState }) {
  const rows = [
    ["Request type", form.requestType || "-"],
    ["Priority", form.priority || "-"],
    ["Location", form.location || "-"],
    ["Category", form.category || "-"],
    ["Asset", form.asset || "-"],
    ["Preferred date", form.preferredDate || "-"],
    ["Urgent", form.urgent ? "Yes" : "-"],
  ];

  return (
    <section className="rounded-xl border bg-background p-5 shadow-sm">
      <h2 className="text-base font-semibold">Request summary</h2>
      <div className="mt-4 space-y-3">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span className="text-right font-medium">{value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function GuidelinesPanel() {
  return (
    <section className="rounded-xl border bg-green-50 p-5 text-green-950 shadow-sm">
      <h2 className="text-base font-semibold">Guidelines</h2>
      <ul className="mt-4 space-y-3 text-sm">
        <li>Provide accurate details to help our team resolve the issue faster.</li>
        <li>For urgent issues, please mark as urgent or contact engineering directly.</li>
        <li>Add photos if available for better assessment.</li>
      </ul>
    </section>
  );
}
