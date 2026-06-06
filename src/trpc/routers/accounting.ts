import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

type CashFlowDirection = "INCOME" | "EXPENSE";
type CashFlowType = "DEPOSIT" | "BALANCE" | "REFUND" | "PETTY_CASH" | "BANK_MATCH";

type CashFlowRecord = {
  date: Date;
  direction: CashFlowDirection;
  type: CashFlowType;
  expectedCents: number;
  collectedCents: number;
};

const DAY_MS = 24 * 60 * 60 * 1000;

function requireTenantProfile(ctx: {
  currentUser: {
    role: "ADMIN" | "TENANT" | "CUSTOMER";
    tenantProfile: { id: string } | null;
  } | null;
}) {
  if (!ctx.currentUser || ctx.currentUser.role !== "TENANT") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Only tenant users can view accounting reports.",
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

const startOfUtcDay = (date: Date) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

const addDays = (date: Date, days: number) =>
  new Date(date.getTime() + days * DAY_MS);

const formatPeriodDate = (date: Date) =>
  new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);

const trend = (current: number, previous: number) => {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }

  return Number((((current - previous) / previous) * 100).toFixed(1));
};

const amountForRecord = (record: CashFlowRecord) =>
  record.direction === "INCOME"
    ? record.collectedCents || record.expectedCents
    : record.expectedCents;

const sumByDirection = (
  records: CashFlowRecord[],
  direction: CashFlowDirection,
) =>
  records.reduce(
    (total, record) =>
      total + (record.direction === direction ? amountForRecord(record) : 0),
    0,
  );

const sumByType = (records: CashFlowRecord[], type: CashFlowType) =>
  records.reduce(
    (total, record) => total + (record.type === type ? amountForRecord(record) : 0),
    0,
  );

const percent = (value: number, total: number) => {
  if (total <= 0) {
    return "-";
  }

  return `${Math.round((value / total) * 100)}%`;
};

export const accountingRouter = createTRPCRouter({
  summary: protectedProcedure.query(async ({ ctx }) => {
    const tenantProfile = requireTenantProfile(ctx);
    const today = startOfUtcDay(new Date());
    const currentStart = addDays(today, -6);
    const previousStart = addDays(currentStart, -7);
    const previousEnd = addDays(currentStart, -1);

    const records = await ctx.db.tenantCashFlowRecord.findMany({
      where: {
        tenantProfileId: tenantProfile.id,
        date: {
          gte: previousStart,
          lte: today,
        },
      },
      select: {
        date: true,
        direction: true,
        type: true,
        expectedCents: true,
        collectedCents: true,
      },
    });

    const currentRecords = records.filter(
      (record) => record.date >= currentStart && record.date <= today,
    ) as CashFlowRecord[];
    const previousRecords = records.filter(
      (record) => record.date >= previousStart && record.date <= previousEnd,
    ) as CashFlowRecord[];

    const totalRevenue = sumByDirection(currentRecords, "INCOME");
    const totalExpenses = sumByDirection(currentRecords, "EXPENSE");
    const previousRevenue = sumByDirection(previousRecords, "INCOME");
    const previousExpenses = sumByDirection(previousRecords, "EXPENSE");
    const netCashFlow = totalRevenue - totalExpenses;
    const previousNetCashFlow = previousRevenue - previousExpenses;

    const cashPositionRows = await ctx.db.tenantCashFlowRecord.findMany({
      where: {
        tenantProfileId: tenantProfile.id,
        date: {
          lte: today,
        },
      },
      select: {
        direction: true,
        type: true,
        expectedCents: true,
        collectedCents: true,
        date: true,
      },
    });
    const previousCashPositionRows = cashPositionRows.filter(
      (record) => record.date <= previousEnd,
    ) as CashFlowRecord[];
    const cashPosition =
      sumByDirection(cashPositionRows as CashFlowRecord[], "INCOME") -
      sumByDirection(cashPositionRows as CashFlowRecord[], "EXPENSE");
    const previousCashPosition =
      sumByDirection(previousCashPositionRows, "INCOME") -
      sumByDirection(previousCashPositionRows, "EXPENSE");

    const roomReservations = sumByType(currentRecords, "DEPOSIT");
    const services = sumByType(currentRecords, "BALANCE");
    const otherRevenue = sumByType(currentRecords, "BANK_MATCH");
    const operatingExpenses = sumByType(currentRecords, "PETTY_CASH");
    const otherExpenses = sumByType(currentRecords, "REFUND");

    const categoryRows = [
      {
        id: "room-reservations",
        label: "Room Reservations",
        inflowCents: roomReservations,
        outflowCents: 0,
        netCents: roomReservations,
        percentOfTotal: percent(roomReservations, totalRevenue),
        group: "revenue" as const,
        icon: "building" as const,
      },
      {
        id: "services",
        label: "Services",
        inflowCents: services,
        outflowCents: 0,
        netCents: services,
        percentOfTotal: percent(services, totalRevenue),
        group: "revenue" as const,
        icon: "service" as const,
      },
      {
        id: "other-revenue",
        label: "Other Revenue",
        inflowCents: otherRevenue,
        outflowCents: 0,
        netCents: otherRevenue,
        percentOfTotal: percent(otherRevenue, totalRevenue),
        group: "revenue" as const,
        icon: "tag" as const,
      },
      {
        id: "total-revenue",
        label: "Total Revenue",
        inflowCents: totalRevenue,
        outflowCents: 0,
        netCents: totalRevenue,
        percentOfTotal: totalRevenue > 0 ? "100%" : "-",
        group: "revenue" as const,
        icon: "more" as const,
      },
      {
        id: "operating-expenses",
        label: "Operating Expenses",
        inflowCents: 0,
        outflowCents: operatingExpenses,
        netCents: -operatingExpenses,
        percentOfTotal: percent(operatingExpenses, totalExpenses),
        group: "expense" as const,
        icon: "receipt" as const,
      },
      {
        id: "other-expenses",
        label: "Other Expenses",
        inflowCents: 0,
        outflowCents: otherExpenses,
        netCents: -otherExpenses,
        percentOfTotal: percent(otherExpenses, totalExpenses),
        group: "expense" as const,
        icon: "more" as const,
      },
      {
        id: "total-expenses",
        label: "Total Expenses",
        inflowCents: 0,
        outflowCents: totalExpenses,
        netCents: -totalExpenses,
        percentOfTotal: totalExpenses > 0 ? "100%" : "-",
        group: "expense" as const,
        icon: "more" as const,
      },
      {
        id: "net-cash-flow",
        label: "Net Cash Flow",
        inflowCents: totalRevenue,
        outflowCents: totalExpenses,
        netCents: netCashFlow,
        percentOfTotal: "-",
        group: "net" as const,
        icon: "more" as const,
      },
    ];

    const typeRows = [
      {
        id: "deposit",
        label: "Deposit",
        inflowCents: roomReservations,
        outflowCents: 0,
        netCents: roomReservations,
        percentOfTotal: percent(roomReservations, totalRevenue),
        group: "revenue" as const,
        icon: "building" as const,
      },
      {
        id: "balance",
        label: "Balance",
        inflowCents: services,
        outflowCents: 0,
        netCents: services,
        percentOfTotal: percent(services, totalRevenue),
        group: "revenue" as const,
        icon: "service" as const,
      },
      {
        id: "bank-match",
        label: "Bank Match",
        inflowCents: otherRevenue,
        outflowCents: 0,
        netCents: otherRevenue,
        percentOfTotal: percent(otherRevenue, totalRevenue),
        group: "revenue" as const,
        icon: "tag" as const,
      },
      {
        id: "total-revenue-type",
        label: "Total Revenue",
        inflowCents: totalRevenue,
        outflowCents: 0,
        netCents: totalRevenue,
        percentOfTotal: totalRevenue > 0 ? "100%" : "-",
        group: "revenue" as const,
        icon: "more" as const,
      },
      {
        id: "petty-cash",
        label: "Petty Cash",
        inflowCents: 0,
        outflowCents: operatingExpenses,
        netCents: -operatingExpenses,
        percentOfTotal: percent(operatingExpenses, totalExpenses),
        group: "expense" as const,
        icon: "receipt" as const,
      },
      {
        id: "refund",
        label: "Refund",
        inflowCents: 0,
        outflowCents: otherExpenses,
        netCents: -otherExpenses,
        percentOfTotal: percent(otherExpenses, totalExpenses),
        group: "expense" as const,
        icon: "more" as const,
      },
      {
        id: "total-expenses-type",
        label: "Total Expenses",
        inflowCents: 0,
        outflowCents: totalExpenses,
        netCents: -totalExpenses,
        percentOfTotal: totalExpenses > 0 ? "100%" : "-",
        group: "expense" as const,
        icon: "more" as const,
      },
      {
        id: "net-cash-flow-type",
        label: "Net Cash Flow",
        inflowCents: totalRevenue,
        outflowCents: totalExpenses,
        netCents: netCashFlow,
        percentOfTotal: "-",
        group: "net" as const,
        icon: "more" as const,
      },
    ];

    const periodLabel = `${formatPeriodDate(currentStart)} - ${formatPeriodDate(today)}`;
    const comparisonLabel = `vs ${formatPeriodDate(previousStart)} - ${formatPeriodDate(previousEnd)}`;

    return {
      periodLabel,
      metrics: [
        {
          label: "Total Revenue",
          valueCents: totalRevenue,
          comparison: comparisonLabel,
          trend: trend(totalRevenue, previousRevenue),
          tone: "green" as const,
        },
        {
          label: "Total Expenses",
          valueCents: totalExpenses,
          comparison: comparisonLabel,
          trend: trend(totalExpenses, previousExpenses),
          tone: "red" as const,
        },
        {
          label: "Net Cash Flow",
          valueCents: netCashFlow,
          comparison: comparisonLabel,
          trend: trend(netCashFlow, previousNetCashFlow),
          tone: "blue" as const,
        },
        {
          label: "Cash Position (Ending Balance)",
          valueCents: cashPosition,
          comparison: comparisonLabel,
          trend: trend(cashPosition, previousCashPosition),
          tone: "neutral" as const,
        },
      ],
      categoryRows,
      typeRows,
      insight: `Accounting is summarizing ${currentRecords.length} cash-flow record(s) for ${periodLabel}. Net cash flow is ${netCashFlow >= 0 ? "positive" : "negative"} for the selected period.`,
    };
  }),
});
