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
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis } from "recharts";

type SubscriptionTrendPoint = {
  period: string;
  mrr: number;
  activeSubscriptions: number;
  trialConversions: number;
};

type SubscriptionTrendChartProps = {
  data: SubscriptionTrendPoint[];
};

const chartConfig = {
  mrr: {
    label: "MRR",
    color: "var(--chart-4)",
  },
  activeSubscriptions: {
    label: "Active subscriptions",
    color: "var(--chart-1)",
  },
  trialConversions: {
    label: "Trial conversions",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export const SubscriptionTrendChart = ({
  data,
}: SubscriptionTrendChartProps) => {
  const [range, setRange] = React.useState("6m");

  const filteredData = React.useMemo(() => {
    if (range === "3m") return data.slice(-3);
    if (range === "6m") return data.slice(-6);
    return data;
  }, [data, range]);

  const totalMrr = filteredData[filteredData.length - 1]?.mrr ?? 0;

  return (
    <Card className="overflow-hidden pt-0">
      <CardHeader className="flex flex-col gap-4 border-b py-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <CardTitle className="text-lg">Subscription Growth Trend</CardTitle>
          <CardDescription>
            Platform-wide view of recurring revenue, active subscriptions, and trial conversion movement.
          </CardDescription>
          <div className="pt-2 text-3xl font-semibold tracking-tight">
            ₱{totalMrr.toLocaleString()}
          </div>
          <p className="text-sm text-green-700">
            Current monthly recurring revenue from paid resort tenants
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
        <ChartContainer config={chartConfig} className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="period" tickLine={false} axisLine={false} tickMargin={10} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
              <Line
                dataKey="mrr"
                type="monotone"
                stroke="var(--color-mrr)"
                strokeWidth={3}
                dot={{ r: 4, fill: "var(--color-mrr)" }}
              />
              <Line
                dataKey="activeSubscriptions"
                type="monotone"
                stroke="var(--color-activeSubscriptions)"
                strokeWidth={3}
                dot={{ r: 4, fill: "var(--color-activeSubscriptions)" }}
              />
              <Line
                dataKey="trialConversions"
                type="monotone"
                stroke="var(--color-trialConversions)"
                strokeWidth={3}
                dot={{ r: 4, fill: "var(--color-trialConversions)" }}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
