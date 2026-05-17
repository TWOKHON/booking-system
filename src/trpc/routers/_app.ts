import { automationsRouter } from "./automations";
import { authRouter } from "./auth";
import { createTRPCRouter } from "../init";
import { roomsRouter } from "./rooms";
import { servicesRouter } from "./services";
import { teamRouter } from "./team";

export const appRouter = createTRPCRouter({
  automations: automationsRouter,
  auth: authRouter,
  rooms: roomsRouter,
  services: servicesRouter,
  team: teamRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
