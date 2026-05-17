import { advancedAnalyticsRouter } from "./advanced-analytics";
import { automationsRouter } from "./automations";
import { authRouter } from "./auth";
import { createTRPCRouter } from "../init";
import { discordRouter } from "./discord";
import { notificationsRouter } from "./notifications";
import { paymentAccountsRouter } from "./payment-accounts";
import { propertiesAnalyticsRouter } from "./properties-analytics";
import { roomsRouter } from "./rooms";
import { servicesRouter } from "./services";
import { teamRouter } from "./team";

export const appRouter = createTRPCRouter({
  advancedAnalytics: advancedAnalyticsRouter,
  automations: automationsRouter,
  auth: authRouter,
  discord: discordRouter,
  notifications: notificationsRouter,
  paymentAccounts: paymentAccountsRouter,
  propertiesAnalytics: propertiesAnalyticsRouter,
  rooms: roomsRouter,
  services: servicesRouter,
  team: teamRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
