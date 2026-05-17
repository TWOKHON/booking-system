import { TRPCError, initTRPC } from "@trpc/server";
import { headers } from "next/headers";
import { cache } from "react";
import superjson from "superjson";
import { auth, type AuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

type SessionData = AuthSession | null;

export type TRPCContext = {
  db: typeof db;
  session: SessionData;
  currentUser: Awaited<ReturnType<typeof getCurrentUserProfile>>;
};

async function getSession(): Promise<SessionData> {
  return auth.api.getSession({
    headers: await headers(),
  });
}

async function getCurrentUserProfile(session: SessionData) {
  if (!session?.user?.id) {
    return null;
  }

  return db.appUser.findUnique({
    where: { authUserId: session.user.id },
    include: {
      tenantProfile: true,
      customerProfile: true,
    },
  });
}

export const createTRPCContext = cache(async (): Promise<TRPCContext> => {
  const session = await getSession();
  const currentUser = await getCurrentUserProfile(session);

  return {
    db,
    session,
    currentUser,
  };
});

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  if (!ctx.session?.user?.id) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You need to sign in to continue.",
    });
  }

  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
      currentUser: ctx.currentUser,
    },
  });
});
