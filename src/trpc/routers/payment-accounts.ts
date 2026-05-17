import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

const paymentAccountTypeValues = [
  "CREDIT_CARD",
  "BANK_ACCOUNT",
  "E_WALLET",
] as const;

const paymentAccountInputSchema = z.object({
  accountLabel: z.string().trim().min(1, "Account label is required.").max(120),
  accountType: z.enum(paymentAccountTypeValues),
  providerName: z.string().trim().min(1, "Provider is required.").max(120),
  accountName: z.string().trim().min(1, "Account name is required.").max(120),
  maskedDetails: z.string().trim().min(1, "Account details are required.").max(120),
  isDefault: z.boolean().default(false),
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
      message: "Only tenant users can manage payment accounts.",
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

function mapPaymentAccountRecord(
  account: {
    id: string;
    accountLabel: string;
    accountType: "CREDIT_CARD" | "BANK_ACCOUNT" | "E_WALLET";
    providerName: string;
    accountName: string;
    maskedDetails: string;
    isDefault: boolean;
    isActive: boolean;
    updatedAt: Date;
  },
) {
  return {
    id: account.id,
    accountLabel: account.accountLabel,
    accountType: account.accountType,
    providerName: account.providerName,
    accountName: account.accountName,
    maskedDetails: account.maskedDetails,
    isDefault: account.isDefault,
    isActive: account.isActive,
    updatedAt: account.updatedAt,
  };
}

export const paymentAccountsRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const tenantProfile = requireTenantProfile(ctx);

    const accounts = await ctx.db.tenantPaymentAccount.findMany({
      where: {
        tenantProfileId: tenantProfile.id,
        isActive: true,
      },
      orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
    });

    return accounts.map(mapPaymentAccountRecord);
  }),

  create: protectedProcedure
    .input(paymentAccountInputSchema)
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);

      try {
        const account = await ctx.db.$transaction(async (tx) => {
          if (input.isDefault) {
            await tx.tenantPaymentAccount.updateMany({
              where: {
                tenantProfileId: tenantProfile.id,
                isActive: true,
              },
              data: {
                isDefault: false,
              },
            });
          }

          return tx.tenantPaymentAccount.create({
            data: {
              tenantProfileId: tenantProfile.id,
              accountLabel: input.accountLabel,
              accountType: input.accountType,
              providerName: input.providerName,
              accountName: input.accountName,
              maskedDetails: input.maskedDetails,
              isDefault: input.isDefault,
              isActive: true,
            },
          });
        });

        return mapPaymentAccountRecord(account);
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes(
            "tenant_payment_account_tenantProfileId_accountLabel_key",
          )
        ) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "A payment account with that label already exists.",
          });
        }

        throw error;
      }
    }),

  update: protectedProcedure
    .input(
      paymentAccountInputSchema.extend({
        id: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);

      const existingAccount = await ctx.db.tenantPaymentAccount.findFirst({
        where: {
          id: input.id,
          tenantProfileId: tenantProfile.id,
          isActive: true,
        },
      });

      if (!existingAccount) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Payment account not found.",
        });
      }

      try {
        const account = await ctx.db.$transaction(async (tx) => {
          if (input.isDefault) {
            await tx.tenantPaymentAccount.updateMany({
              where: {
                tenantProfileId: tenantProfile.id,
                isActive: true,
                id: {
                  not: existingAccount.id,
                },
              },
              data: {
                isDefault: false,
              },
            });
          }

          return tx.tenantPaymentAccount.update({
            where: {
              id: existingAccount.id,
            },
            data: {
              accountLabel: input.accountLabel,
              accountType: input.accountType,
              providerName: input.providerName,
              accountName: input.accountName,
              maskedDetails: input.maskedDetails,
              isDefault: input.isDefault,
            },
          });
        });

        return mapPaymentAccountRecord(account);
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes(
            "tenant_payment_account_tenantProfileId_accountLabel_key",
          )
        ) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "A payment account with that label already exists.",
          });
        }

        throw error;
      }
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tenantProfile = requireTenantProfile(ctx);

      const existingAccount = await ctx.db.tenantPaymentAccount.findFirst({
        where: {
          id: input.id,
          tenantProfileId: tenantProfile.id,
          isActive: true,
        },
        select: {
          id: true,
          accountLabel: true,
        },
      });

      if (!existingAccount) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Payment account not found.",
        });
      }

      await ctx.db.tenantPaymentAccount.update({
        where: {
          id: existingAccount.id,
        },
        data: {
          isActive: false,
          isDefault: false,
        },
      });

      return existingAccount;
    }),
});
