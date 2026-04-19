"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis } from "recharts";

type UsageTrendPoint = {
  period: string;
  activeTenants: number;
  staffLogins: number;
  workflowEvents: number;
};

type UsageTrendChartProps = {
  data: UsageTrendPoint[];
};

const chartConfig = {
  staffLogins: {
    label: "Staff logins",
    color: "var(--chart-1)",
  },
  workflowEvents: {
    label: "Workflow events",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export const UsageTrendChart = ({ data }: UsageTrendChartProps) => {
  const [range, setRange] = React.useState("6m");

  const filteredData = React.useMemo(() => {
    if (range === "3m") return data.slice(-3);
    if (range === "6m") return data.slice(-6);
    return data;
  }, [data, range]);

  const latestActiveTenants =
    filteredData[filteredData.length - 1]?.activeTenants ?? 0;

  return (
    <Card className="overflow-hidden pt-0">
      <CardHeader className="flex flex-col gap-4 border-b py-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <CardTitle className="text-lg">Tenant Usage Trend</CardTitle>
          <CardDescription>
            Platform-wide visibility into active tenant workspaces, staff logins, and workflow activity.
          </CardDescription>
          <div className="pt-2 text-3xl font-semibold tracking-tight">
            {latestActiveTenants} active tenants
          </div>
          <p className="text-sm text-muted-foreground">
            Tenants with meaningful staff or workflow activity in the selected period
          </p>
        </div>

        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder="Last 6 months" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3m">Last 3 months</SelectItem>
            <SelectItem value="6m">Last 6 months</SelectItem>
            <SelectItem value="12m">Last 12 months</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="px-4 py-5 sm:px-6">
        <ChartContainer config={chartConfig} className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillStaffLogins" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-staffLogins)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="var(--color-staffLogins)" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="fillWorkflowEvents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-workflowEvents)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-workflowEvents)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="period" tickLine={false} axisLine={false} tickMargin={10} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <Area
                dataKey="staffLogins"
                type="monotone"
                fill="url(#fillStaffLogins)"
                stroke="var(--color-staffLogins)"
                strokeWidth={2.5}
              />
              <Area
                dataKey="workflowEvents"
                type="monotone"
                fill="url(#fillWorkflowEvents)"
                stroke="var(--color-workflowEvents)"
                strokeWidth={2.5}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
