import { authRouter } from "./auth";
import { createTRPCRouter } from "../init";
import { roomsRouter } from "./rooms";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  rooms: roomsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
