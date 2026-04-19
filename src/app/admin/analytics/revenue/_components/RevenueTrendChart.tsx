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
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis } from "recharts";

type RevenueTrendPoint = {
  period: string;
  gross: number;
  tenantNet: number;
  platformFees: number;
};

type RevenueTrendChartProps = {
  data: RevenueTrendPoint[];
};

const chartConfig = {
  gross: {
    label: "Gross booking revenue",
    color: "var(--chart-2)",
  },
  tenantNet: {
    label: "Tenant net",
    color: "var(--chart-1)",
  },
  platformFees: {
    label: "Platform fees",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

export const RevenueTrendChart = ({ data }: RevenueTrendChartProps) => {
  const [range, setRange] = React.useState("6m");

  const filteredData = React.useMemo(() => {
    if (range === "3m") return data.slice(-3);
    if (range === "6m") return data.slice(-6);
    return data;
  }, [data, range]);

  const totals = filteredData.reduce(
    (acc, item) => {
      acc.gross += item.gross;
      acc.platformFees += item.platformFees;
      return acc;
    },
    { gross: 0, platformFees: 0 }
  );

  return (
    <Card className="overflow-hidden pt-0">
      <CardHeader className="flex flex-col gap-4 border-b py-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <CardTitle className="text-lg">Platform Revenue Trend</CardTitle>
          <CardDescription>
            Admin-wide view of gross tenant revenue, tenant net, and platform fee intake.
          </CardDescription>
          <div className="pt-2 text-3xl font-semibold tracking-tight">
            ₱{totals.gross.toLocaleString()}
          </div>
          <p className="text-sm text-green-600">
            ₱{totals.platformFees.toLocaleString()} collected in platform fees for the selected range
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

      <CardContent className="grid gap-6 px-4 py-5 sm:px-6">
        <ChartContainer config={chartConfig} className="h-77.5 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="period" tickLine={false} axisLine={false} tickMargin={10} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar
                dataKey="gross"
                fill="var(--color-gross)"
                radius={[10, 10, 0, 0]}
                maxBarSize={42}
              />
              <Bar
                dataKey="platformFees"
                fill="var(--color-platformFees)"
                radius={[10, 10, 0, 0]}
                maxBarSize={42}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer config={chartConfig} className="h-77.5 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="period" tickLine={false} axisLine={false} tickMargin={10} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Line
                dataKey="tenantNet"
                type="monotone"
                stroke="var(--color-tenantNet)"
                strokeWidth={3}
                dot={{ r: 4, fill: "var(--color-tenantNet)" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
