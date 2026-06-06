import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

const statusValues = [
  "REQUESTED",
  "APPROVED",
  "RELEASED",
  "LIQUIDATED",
  "REJECTED",
] as const;

const createPettyCashSchema = z.object({
  neededBy: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  requester: z.string().trim().min(2).max(120),
  department: z.string().trim().min(2).max(80),
  category: z.string().trim().min(2).max(80),
  purpose: z.string().trim().min(4).max(500),
  reference: z.string().trim().min(2).max(80),
  amountCents: z.number().int().positive(),
  custodian: z.string().trim().max(120).optional(),
  notes: z.string().trim().max(1000).optional(),
});

const updateStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(statusValues),
  releasedCents: z.number().int().min(0).optional(),
  liquidatedCents: z.number().int().min(0).optional(),
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
      message: "Only tenant users can manage petty cash.",
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

const parseIsoDate = (dateIso: string) => new Date(`${dateIso}T00:00:00.000Z`);
const toIso = (date: Date) => date.toISOString().slice(0, 10);

function serializeRequest(row: {
  id: string;
  requestedAt: Date;
  neededBy: Date;
  requester: string;
  department: string;
  category: string;
  purpose: string;
  reference: string;
  amountCents: number;
  releasedCents: number;
  liquidatedCents: number;
  status: (typeof statusValues)[number];
  custodian: string | null;
  notes: string | null;
  updatedAt: Date;
}) {
  return {
    id: row.id,
    requestedAt: row.requestedAt.toISOString(),
    neededBy: toIso(row.neededBy),
    requester: row.requester,
    department: row.department,
    category: row.category,
    purpose: row.purpose,
    reference: row.reference,
    amountCents: row.amountCents,
    releasedCents: row.releasedCents,
    liquidatedCents: row.liquidatedCents,
    status: row.status,
    custodian: row.custodian ?? "",
    notes: row.notes ?? "",
    updatedAt: row.updatedAt.toISOString(),
  };
}

export const pettyCashRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const tenantProfile = requireTenantProfile(ctx);

    const rows = await ctx.db.tenantPettyCashRequest.findMany({
      where: { tenantProfileId: tenantProfile.id },
      orderBy: [{ requestedAt: "desc" }, { updatedAt: "desc" }],
      take: 100,
    });

    return rows.map(serializeRequest);
  }),

  create: protectedProcedure
    .input(createPettyCashSchema)
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);

      const row = await ctx.db.tenantPettyCashRequest.create({
        data: {
          tenantProfileId: tenantProfile.id,
          neededBy: parseIsoDate(input.neededBy),
          requester: input.requester.trim(),
          department: input.department.trim(),
          category: input.category.trim(),
          purpose: input.purpose.trim(),
          reference: input.reference.trim(),
          amountCents: input.amountCents,
          custodian: input.custodian?.trim() || null,
          notes: input.notes?.trim() || null,
          status: "REQUESTED",
        },
      });

      return serializeRequest(row);
    }),

  updateStatus: protectedProcedure
    .input(updateStatusSchema)
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);

      const existing = await ctx.db.tenantPettyCashRequest.findFirst({
        where: {
          id: input.id,
          tenantProfileId: tenantProfile.id,
        },
        select: {
          id: true,
          amountCents: true,
        },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Petty cash request not found.",
        });
      }

      const releasedCents =
        input.releasedCents ??
        (input.status === "RELEASED" || input.status === "LIQUIDATED"
          ? existing.amountCents
          : undefined);
      const liquidatedCents =
        input.liquidatedCents ??
        (input.status === "LIQUIDATED" ? existing.amountCents : undefined);

      const row = await ctx.db.tenantPettyCashRequest.update({
        where: { id: existing.id },
        data: {
          status: input.status,
          ...(releasedCents !== undefined ? { releasedCents } : {}),
          ...(liquidatedCents !== undefined ? { liquidatedCents } : {}),
        },
      });

      return serializeRequest(row);
    }),
});
