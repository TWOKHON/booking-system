import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
function createPrismaClient() {
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

function hasLatestDelegates(client: PrismaClient) {
  return (
    "tenantRoom" in client &&
    "tenantRoomImage" in client &&
    "tenantAutomationWorkflow" in client &&
    "tenantPaymentAccount" in client &&
    "tenantDiscordChannel" in client &&
    "tenantEmployee" in client &&
    "tenantLeaveApplication" in client &&
    "tenantAttendanceLog" in client &&
    "tenantHoliday" in client &&
    "tenantPayrollRun" in client &&
    "tenantPayrollLine" in client &&
    "tenantCashFlowRecord" in client &&
    "tenantPettyCashRequest" in client &&
    "tenantOperationTask" in client &&
    "tenantMaintenanceRequest" in client &&
    "tenantHousekeepingRoom" in client &&
    "tenantArrival" in client &&
    "tenantGuestRequest" in client &&
    "tenantGuestProfile" in client
  );
}

const cachedPrisma = globalForPrisma.prisma;

export const db =
  cachedPrisma && hasLatestDelegates(cachedPrisma)
    ? cachedPrisma
    : createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
