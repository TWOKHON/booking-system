import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const authRouter = createTRPCRouter({
  me: protectedProcedure.query(({ ctx }) => {
    return {
      session: ctx.session,
      profile: ctx.currentUser,
    };
  }),
});
