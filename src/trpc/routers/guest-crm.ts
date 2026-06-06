import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

type GuestSegment = "VIP" | "RETURNING" | "FAMILY" | "CORPORATE" | "AT_RISK" | "NEW";
type GuestLifecycle = "ACTIVE" | "UPCOMING" | "DORMANT" | "WIN_BACK";

const segmentLabels: Record<GuestSegment, string> = {
  VIP: "VIP",
  RETURNING: "Returning",
  FAMILY: "Family",
  CORPORATE: "Corporate",
  AT_RISK: "At Risk",
  NEW: "New",
};

const labelToSegment = {
  VIP: "VIP",
  Returning: "RETURNING",
  Family: "FAMILY",
  Corporate: "CORPORATE",
  "At Risk": "AT_RISK",
  New: "NEW",
} as const;

const lifecycleLabels: Record<GuestLifecycle, string> = {
  ACTIVE: "Active",
  UPCOMING: "Upcoming",
  DORMANT: "Dormant",
  WIN_BACK: "Win-back",
};

const labelToLifecycle = {
  Active: "ACTIVE",
  Upcoming: "UPCOMING",
  Dormant: "DORMANT",
  "Win-back": "WIN_BACK",
} as const;

type GuestSegmentLabel = keyof typeof labelToSegment;
type GuestLifecycleLabel = keyof typeof labelToLifecycle;

const crmInputSchema = z.object({
  guestName: z.string().trim().min(1, "Guest name is required.").max(160),
  email: z.string().trim().email("Valid email is required.").max(180),
  phone: z.string().trim().max(80).optional().or(z.literal("")),
  segment: z
    .enum(["VIP", "Returning", "Family", "Corporate", "At Risk", "New"])
    .default("New"),
  lifecycle: z
    .enum(["Active", "Upcoming", "Dormant", "Win-back"])
    .default("Active"),
  lastStayAt: z.coerce.date().optional().nullable(),
  nextStayAt: z.coerce.date().optional().nullable(),
  totalStays: z.number().int().min(0).max(10_000).default(0),
  lifetimeValueCents: z.number().int().min(0).max(1_000_000_000).default(0),
  preference: z.string().trim().max(500).optional().or(z.literal("")),
  nextAction: z.string().trim().max(240).optional().or(z.literal("")),
  owner: z.string().trim().min(1).max(120).default("Front Desk"),
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
      message: "Only tenant users can manage guest CRM profiles.",
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

const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "Asia/Manila",
});

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "FD"
  );
}

function formatDate(date: Date | null) {
  return date ? dateFormatter.format(date) : "-";
}

function serializeProfile(row: {
  id: string;
  guestName: string;
  email: string;
  phone: string | null;
  segment: GuestSegment;
  lifecycle: GuestLifecycle;
  lastStayAt: Date | null;
  nextStayAt: Date | null;
  totalStays: number;
  lifetimeValueCents: number;
  preference: string | null;
  nextAction: string | null;
  owner: string;
  initials: string;
}) {
  return {
    id: row.id,
    guestName: row.guestName,
    email: row.email,
    phone: row.phone ?? "-",
    segment: segmentLabels[row.segment] as GuestSegmentLabel,
    lifecycle: lifecycleLabels[row.lifecycle] as GuestLifecycleLabel,
    lastStay: formatDate(row.lastStayAt),
    nextStay: formatDate(row.nextStayAt),
    totalStays: row.totalStays,
    lifetimeValue: currencyFormatter.format(row.lifetimeValueCents / 100),
    lifetimeValueCents: row.lifetimeValueCents,
    preference: row.preference?.trim() || "-",
    nextAction: row.nextAction?.trim() || "-",
    owner: row.owner,
    initials: row.initials,
  };
}

export const guestCrmRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const tenantProfile = requireTenantProfile(ctx);
    const rows = await ctx.db.tenantGuestProfile.findMany({
      where: { tenantProfileId: tenantProfile.id },
      orderBy: [{ lifetimeValueCents: "desc" }, { updatedAt: "desc" }],
    });

    return rows.map(serializeProfile);
  }),

  summary: protectedProcedure.query(async ({ ctx }) => {
    const tenantProfile = requireTenantProfile(ctx);
    const rows = await ctx.db.tenantGuestProfile.findMany({
      where: { tenantProfileId: tenantProfile.id },
      orderBy: [{ lifetimeValueCents: "desc" }, { updatedAt: "desc" }],
    });
    const profiles = rows.map(serializeProfile);
    const totalGuests = profiles.length;
    const vipGuests = profiles.filter((guest) => guest.segment === "VIP").length;
    const upcoming = profiles.filter(
      (guest) => guest.lifecycle === "Upcoming",
    ).length;
    const winBack = profiles.filter(
      (guest) => guest.lifecycle === "Win-back",
    ).length;
    const repeatGuests = profiles.filter((guest) => guest.totalStays > 1).length;
    const withPreferences = profiles.filter(
      (guest) => guest.preference !== "-",
    ).length;
    const repeatPercent = totalGuests
      ? Math.round((repeatGuests / totalGuests) * 100)
      : 0;
    const preferenceCoverage = totalGuests
      ? Math.round((withPreferences / totalGuests) * 100)
      : 0;

    return {
      totalGuests,
      vipGuests,
      upcoming,
      winBack,
      repeatGuests,
      repeatPercent,
      preferenceCoverage,
      crmAlerts: [
        { label: "Win-back opportunities", value: winBack, tone: "bg-amber-500" },
        { label: "VIP arrivals in 14 days", value: upcoming, tone: "bg-violet-500" },
        {
          label: "Profiles missing preferences",
          value: totalGuests - withPreferences,
          tone: "bg-red-500",
        },
      ],
      nextBestActions: profiles
        .filter((guest) => guest.nextAction !== "-")
        .slice(0, 4),
      segmentHealth: ["VIP", "Returning", "Family", "Corporate", "At Risk", "New"].map(
        (segment) => {
          const count = profiles.filter((guest) => guest.segment === segment).length;

          return {
            segment,
            count,
            percent: totalGuests ? Math.round((count / totalGuests) * 100) : 0,
          };
        },
      ),
    };
  }),

  create: protectedProcedure.input(crmInputSchema).mutation(async ({ ctx, input }) => {
    const tenantProfile = requireTenantProfile(ctx);

    try {
      const row = await ctx.db.tenantGuestProfile.create({
        data: {
          tenantProfileId: tenantProfile.id,
          guestName: input.guestName,
          email: input.email.toLowerCase(),
          phone: input.phone?.trim() || null,
          segment: labelToSegment[input.segment],
          lifecycle: labelToLifecycle[input.lifecycle],
          lastStayAt: input.lastStayAt ?? null,
          nextStayAt: input.nextStayAt ?? null,
          totalStays: input.totalStays,
          lifetimeValueCents: input.lifetimeValueCents,
          preference: input.preference?.trim() || null,
          nextAction: input.nextAction?.trim() || null,
          owner: input.owner,
          initials: initials(input.owner),
        },
      });

      return serializeProfile(row);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("tenant_guest_profile_tenantProfileId_email_key")
      ) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A guest profile with that email already exists.",
        });
      }

      throw error;
    }
  }),

  updateSegment: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        segment: z.enum(["VIP", "Returning", "Family", "Corporate", "At Risk", "New"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);
      const existing = await ctx.db.tenantGuestProfile.findFirst({
        where: { id: input.id, tenantProfileId: tenantProfile.id },
        select: { id: true },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Guest profile not found.",
        });
      }

      const row = await ctx.db.tenantGuestProfile.update({
        where: { id: existing.id },
        data: { segment: labelToSegment[input.segment] },
      });

      return serializeProfile(row);
    }),

  completeNextAction: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);
      const existing = await ctx.db.tenantGuestProfile.findFirst({
        where: { id: input.id, tenantProfileId: tenantProfile.id },
        select: { id: true },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Guest profile not found.",
        });
      }

      const row = await ctx.db.tenantGuestProfile.update({
        where: { id: existing.id },
        data: { nextAction: null },
      });

      return serializeProfile(row);
    }),
});
