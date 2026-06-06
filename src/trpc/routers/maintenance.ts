import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

type MaintenanceStatus = "DRAFT" | "OPEN" | "IN_PROGRESS" | "COMPLETED" | "OVERDUE";
type MaintenancePriority = "LOW" | "MEDIUM" | "HIGH";
type MaintenanceType =
  | "PLUMBING"
  | "ELECTRICAL"
  | "HVAC"
  | "EQUIPMENT"
  | "GENERAL"
  | "IT_NETWORK";

const typeLabels: Record<MaintenanceType, string> = {
  PLUMBING: "Plumbing",
  ELECTRICAL: "Electrical",
  HVAC: "HVAC",
  EQUIPMENT: "Equipment",
  GENERAL: "General",
  IT_NETWORK: "IT / Network",
};

const statusLabels: Record<MaintenanceStatus, string> = {
  DRAFT: "Draft",
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  OVERDUE: "Overdue",
};

const priorityLabels: Record<MaintenancePriority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

const labelToType = {
  Plumbing: "PLUMBING",
  Electrical: "ELECTRICAL",
  HVAC: "HVAC",
  Equipment: "EQUIPMENT",
  General: "GENERAL",
  "IT / Network": "IT_NETWORK",
} as const;

const labelToStatus = {
  Draft: "DRAFT",
  Open: "OPEN",
  "In Progress": "IN_PROGRESS",
  Completed: "COMPLETED",
  Overdue: "OVERDUE",
} as const;

const labelToPriority = {
  Low: "LOW",
  Medium: "MEDIUM",
  High: "HIGH",
} as const;

const maintenanceInputSchema = z.object({
  requestType: z.enum([
    "Plumbing",
    "Electrical",
    "HVAC",
    "Equipment",
    "General",
    "IT / Network",
  ]),
  priority: z.enum(["Low", "Medium", "High"]),
  status: z.enum(["Draft", "Open", "In Progress", "Completed", "Overdue"]).optional(),
  propertyArea: z.string().trim().min(1).max(120),
  location: z.string().trim().min(1).max(160),
  issueTitle: z.string().trim().min(1).max(100),
  description: z.string().trim().min(1).max(1000),
  category: z.string().trim().min(1).max(120),
  asset: z.string().trim().max(160).optional(),
  reportedBy: z.string().trim().min(1).max(120),
  contactNumber: z.string().trim().max(40).optional(),
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),
  preferredTime: z.string().regex(/^\d{2}:\d{2}$/).optional().or(z.literal("")),
  urgent: z.boolean().default(false),
});

function requireTenantProfile(ctx: {
  currentUser: {
    role: "ADMIN" | "TENANT" | "CUSTOMER";
    tenantProfile: { id: string } | null;
  } | null;
}) {
  if (!ctx.currentUser || ctx.currentUser.role !== "TENANT") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Only tenant users can manage maintenance requests.",
    });
  }

  if (!ctx.currentUser.tenantProfile) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Tenant profile not found.",
    });
  }

  return ctx.currentUser.tenantProfile;
}

const initialsFromName = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "NA";

const parsePreferredAt = (date?: string, time?: string) => {
  if (!date) {
    return null;
  }

  return new Date(`${date}T${time || "09:00"}:00.000+08:00`);
};

const toDateInput = (date: Date | null) =>
  date ? date.toISOString().slice(0, 10) : "";

const toTimeInput = (date: Date | null) =>
  date
    ? new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Manila",
      }).format(date)
    : "";

const dateLabel = (date: Date | null) =>
  date
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Manila",
      }).format(date)
    : "";

const dueDateLabel = (date: Date | null) =>
  date
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "Asia/Manila",
      }).format(date)
    : "";

async function generateRequestNumber(ctx: {
  db: {
    tenantMaintenanceRequest: {
      count: (args: { where: { tenantProfileId: string } }) => Promise<number>;
    };
  };
}, tenantProfileId: string) {
  const year = new Date().getFullYear();
  const count = await ctx.db.tenantMaintenanceRequest.count({
    where: { tenantProfileId },
  });

  return `MT-${year}-${String(count + 1).padStart(4, "0")}`;
}

function serializeRequest(row: {
  id: string;
  requestNumber: string;
  requestType: MaintenanceType;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  propertyArea: string;
  location: string;
  issueTitle: string;
  description: string;
  category: string;
  asset: string | null;
  reportedBy: string;
  contactNumber: string | null;
  preferredAt: Date | null;
  urgent: boolean;
  createdAt: Date;
  employeeId: string | null;
  roomId: string | null;
}) {
  return {
    id: row.id,
    requestNumber: row.requestNumber,
    reportedAt: dateLabel(row.createdAt),
    roomArea: row.location,
    type: typeLabels[row.requestType] as
      | "Plumbing"
      | "Electrical"
      | "HVAC"
      | "Equipment"
      | "General"
      | "IT / Network",
    title: row.issueTitle,
    description: row.description,
    priority: priorityLabels[row.priority] as "Low" | "Medium" | "High",
    status: statusLabels[row.status] as
      | "Draft"
      | "Open"
      | "In Progress"
      | "Completed"
      | "Overdue",
    assignee: row.reportedBy,
    initials: initialsFromName(row.reportedBy),
    dueDate: dueDateLabel(row.preferredAt),
    propertyArea: row.propertyArea,
    location: row.location,
    category: row.category,
    asset: row.asset ?? "",
    reportedBy: row.reportedBy,
    contactNumber: row.contactNumber ?? "",
    preferredDate: toDateInput(row.preferredAt),
    preferredTime: toTimeInput(row.preferredAt),
    urgent: row.urgent,
    employeeId: row.employeeId ?? "",
    roomId: row.roomId ?? "",
  };
}

export const maintenanceRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const tenantProfile = requireTenantProfile(ctx);

    const rows = await ctx.db.tenantMaintenanceRequest.findMany({
      where: { tenantProfileId: tenantProfile.id },
      orderBy: [{ createdAt: "desc" }],
      take: 250,
    });

    return rows.map(serializeRequest);
  }),

  get: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);

      const row = await ctx.db.tenantMaintenanceRequest.findFirst({
        where: {
          OR: [{ id: input.id }, { requestNumber: input.id }],
          tenantProfileId: tenantProfile.id,
        },
      });

      return row ? serializeRequest(row) : null;
    }),

  create: protectedProcedure.input(maintenanceInputSchema).mutation(async ({ ctx, input }) => {
    const tenantProfile = requireTenantProfile(ctx);
    const status = input.status ? labelToStatus[input.status] : "OPEN";

    const row = await ctx.db.tenantMaintenanceRequest.create({
      data: {
        tenantProfileId: tenantProfile.id,
        requestNumber: await generateRequestNumber(ctx, tenantProfile.id),
        requestType: labelToType[input.requestType],
        priority: labelToPriority[input.priority],
        status,
        propertyArea: input.propertyArea.trim(),
        location: input.location.trim(),
        issueTitle: input.issueTitle.trim(),
        description: input.description.trim(),
        category: input.category.trim(),
        asset: input.asset?.trim() || null,
        reportedBy: input.reportedBy.trim(),
        contactNumber: input.contactNumber?.trim() || null,
        preferredAt: parsePreferredAt(input.preferredDate, input.preferredTime),
        urgent: input.urgent,
        completedAt: status === "COMPLETED" ? new Date() : null,
      },
    });

    return serializeRequest(row);
  }),

  saveDraft: protectedProcedure.input(maintenanceInputSchema).mutation(async ({ ctx, input }) => {
    const tenantProfile = requireTenantProfile(ctx);

    const row = await ctx.db.tenantMaintenanceRequest.create({
      data: {
        tenantProfileId: tenantProfile.id,
        requestNumber: await generateRequestNumber(ctx, tenantProfile.id),
        requestType: labelToType[input.requestType],
        priority: labelToPriority[input.priority],
        status: "DRAFT",
        propertyArea: input.propertyArea.trim(),
        location: input.location.trim(),
        issueTitle: input.issueTitle.trim(),
        description: input.description.trim(),
        category: input.category.trim(),
        asset: input.asset?.trim() || null,
        reportedBy: input.reportedBy.trim(),
        contactNumber: input.contactNumber?.trim() || null,
        preferredAt: parsePreferredAt(input.preferredDate, input.preferredTime),
        urgent: input.urgent,
      },
    });

    return serializeRequest(row);
  }),

  update: protectedProcedure
    .input(maintenanceInputSchema.extend({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);

      const existing = await ctx.db.tenantMaintenanceRequest.findFirst({
        where: {
          OR: [{ id: input.id }, { requestNumber: input.id }],
          tenantProfileId: tenantProfile.id,
        },
        select: { id: true },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Maintenance request not found.",
        });
      }

      const status = input.status ? labelToStatus[input.status] : "OPEN";
      const row = await ctx.db.tenantMaintenanceRequest.update({
        where: { id: existing.id },
        data: {
          requestType: labelToType[input.requestType],
          priority: labelToPriority[input.priority],
          status,
          propertyArea: input.propertyArea.trim(),
          location: input.location.trim(),
          issueTitle: input.issueTitle.trim(),
          description: input.description.trim(),
          category: input.category.trim(),
          asset: input.asset?.trim() || null,
          reportedBy: input.reportedBy.trim(),
          contactNumber: input.contactNumber?.trim() || null,
          preferredAt: parsePreferredAt(input.preferredDate, input.preferredTime),
          urgent: input.urgent,
          completedAt: status === "COMPLETED" ? new Date() : null,
        },
      });

      return serializeRequest(row);
    }),
});
