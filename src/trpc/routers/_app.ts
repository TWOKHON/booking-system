import { advancedAnalyticsRouter } from "./advanced-analytics";
import { accountingRouter } from "./accounting";
import { automationsRouter } from "./automations";
import { arrivalsRouter } from "./arrivals";
import { authRouter } from "./auth";
import { cashFlowRouter } from "./cash-flow";
import { createTRPCRouter } from "../init";
import { discordRouter } from "./discord";
import { employeesRouter } from "./employees";
import { forecastRouter } from "./forecast";
import { guestCrmRouter } from "./guest-crm";
import { guestRequestsRouter } from "./guest-requests";
import { housekeepingRouter } from "./housekeeping";
import { leaveApplicationsRouter } from "./leave-applications";
import { marketingAnalyticsRouter } from "./marketing-analytics";
import { maintenanceRouter } from "./maintenance";
import { notificationsRouter } from "./notifications";
import { operationTasksRouter } from "./operation-tasks";
import { payrollRouter } from "./payroll";
import { paymentAccountsRouter } from "./payment-accounts";
import { pettyCashRouter } from "./petty-cash";
import { packagesRouter } from "./packages";
import { propertiesAnalyticsRouter } from "./properties-analytics";
import { recommendationsRouter } from "./recommendations";
import { ratesRouter } from "./rates";
import { reportsRouter } from "./reports";
import { roomsRouter } from "./rooms";
import { servicesRouter } from "./services";
import { siteBuilderRouter } from "./site-builder";
import { teamRouter } from "./team";

export const appRouter = createTRPCRouter({
  accounting: accountingRouter,
  advancedAnalytics: advancedAnalyticsRouter,
  automations: automationsRouter,
  arrivals: arrivalsRouter,
  auth: authRouter,
  cashFlow: cashFlowRouter,
  discord: discordRouter,
  employees: employeesRouter,
  forecast: forecastRouter,
  guestCrm: guestCrmRouter,
  guestRequests: guestRequestsRouter,
  housekeeping: housekeepingRouter,
  leaveApplications: leaveApplicationsRouter,
  marketingAnalytics: marketingAnalyticsRouter,
  maintenance: maintenanceRouter,
  notifications: notificationsRouter,
  operationTasks: operationTasksRouter,
  payroll: payrollRouter,
  paymentAccounts: paymentAccountsRouter,
  pettyCash: pettyCashRouter,
  packages: packagesRouter,
  propertiesAnalytics: propertiesAnalyticsRouter,
  recommendations: recommendationsRouter,
  rates: ratesRouter,
  reports: reportsRouter,
  rooms: roomsRouter,
  services: servicesRouter,
  siteBuilder: siteBuilderRouter,
  team: teamRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
