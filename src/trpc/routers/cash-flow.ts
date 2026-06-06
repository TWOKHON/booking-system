import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

const directionValues = ["INCOME", "EXPENSE"] as const;
const typeValues = ["DEPOSIT", "BALANCE", "REFUND", "PETTY_CASH", "BANK_MATCH"] as const;
const statusValues = ["COLLECTED", "PENDING", "OVERDUE", "RECONCILED"] as const;

const createCashFlowSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  direction: z.enum(directionValues),
  type: z.enum(typeValues),
  guestOrVendor: z.string().trim().min(2).max(160),
  reference: z.string().trim().min(2).max(80),
  method: z.string().trim().min(1).max(80),
  amountCents: z.number().int().positive(),
  status: z.enum(statusValues),
  owner: z.string().trim().min(2).max(80),
  notes: z.string().trim().max(1000).optional(),
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
      message: "Only tenant users can manage cash flow.",
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

export const cashFlowRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const tenantProfile = requireTenantProfile(ctx);

    const rows = await ctx.db.tenantCashFlowRecord.findMany({
      where: {
        tenantProfileId: tenantProfile.id,
      },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      take: 100,
    });

    return rows.map((row) => ({
      id: row.id,
      date: toIso(row.date),
      direction: row.direction,
      type: row.type,
      guestOrVendor: row.guestOrVendor,
      reference: row.reference,
      method: row.method,
      expectedCents: row.expectedCents,
      collectedCents: row.collectedCents,
      status: row.status,
      owner: row.owner,
      notes: row.notes ?? "",
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    }));
  }),

  create: protectedProcedure
    .input(createCashFlowSchema)
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);

      const collectedCents =
        input.status === "COLLECTED" || input.status === "RECONCILED"
          ? input.amountCents
          : 0;

      const row = await ctx.db.tenantCashFlowRecord.create({
        data: {
          tenantProfileId: tenantProfile.id,
          date: parseIsoDate(input.date),
          direction: input.direction,
          type: input.type,
          guestOrVendor: input.guestOrVendor.trim(),
          reference: input.reference.trim(),
          method: input.method.trim(),
          expectedCents: input.amountCents,
          collectedCents,
          status: input.status,
          owner: input.owner.trim(),
          notes: input.notes?.trim() || null,
        },
      });

      return {
        id: row.id,
        date: toIso(row.date),
        direction: row.direction,
        type: row.type,
        guestOrVendor: row.guestOrVendor,
        reference: row.reference,
        method: row.method,
        expectedCents: row.expectedCents,
        collectedCents: row.collectedCents,
        status: row.status,
        owner: row.owner,
        notes: row.notes ?? "",
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
      };
    }),
});
