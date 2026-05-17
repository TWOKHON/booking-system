import { authRouter } from "./auth";
import { createTRPCRouter } from "../init";
import { roomsRouter } from "./rooms";
import { servicesRouter } from "./services";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  rooms: roomsRouter,
  services: servicesRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
