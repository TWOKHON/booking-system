import { initTRPC } from '@trpc/server';
import { cache } from 'react';
import superjson from "superjson"

type TRPCContext = {
  userId: string;
};

export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId: 'user_123' };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<TRPCContext>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const mockSession = {
    user: {
      id: ctx.userId,
      name: "Demo Admin",
      email: "admin@example.com",
    },
  };

  return next({ ctx: { ...ctx, auth: mockSession } });
});

export const premiumProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    const mockCustomer = {
      id: "mock-customer-1",
      externalId: ctx.auth.user.id,
      activeSubscriptions: [
        {
          id: "mock-subscription-1",
          status: "active",
          plan: "platform-pro",
        },
      ],
    };

    return next({ ctx: { ...ctx, customer: mockCustomer } });
  },
);
