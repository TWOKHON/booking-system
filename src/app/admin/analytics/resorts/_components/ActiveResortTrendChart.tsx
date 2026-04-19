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

type ActiveResortTrendPoint = {
  period: string;
  activeResorts: number;
  bookings: number;
  occupancy: number;
};

type ActiveResortTrendChartProps = {
  data: ActiveResortTrendPoint[];
};

const chartConfig = {
  bookings: {
    label: "Bookings",
    color: "var(--chart-1)",
  },
  occupancy: {
    label: "Occupancy index",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export const ActiveResortTrendChart = ({
  data,
}: ActiveResortTrendChartProps) => {
  const [range, setRange] = React.useState("6m");

  const filteredData = React.useMemo(() => {
    if (range === "3m") return data.slice(-3);
    if (range === "6m") return data.slice(-6);
    return data;
  }, [data, range]);

  const activeAverage = Math.round(
    filteredData.reduce((sum, item) => sum + item.activeResorts, 0) / filteredData.length
  );

  return (
    <Card className="overflow-hidden pt-0">
      <CardHeader className="flex flex-col gap-4 border-b py-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <CardTitle className="text-lg">Active Resort Activity</CardTitle>
          <CardDescription>
            Booking and occupancy momentum across resorts with current tenant activity.
          </CardDescription>
          <div className="pt-2 text-3xl font-semibold tracking-tight">
            {activeAverage} active resorts
          </div>
          <p className="text-sm text-muted-foreground">
            Monthly average resorts showing booking or operations activity in the selected range
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
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-bookings)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="var(--color-bookings)" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="fillOccupancy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-occupancy)" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="var(--color-occupancy)" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="period" tickLine={false} axisLine={false} tickMargin={10} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <Area
                dataKey="bookings"
                type="monotone"
                fill="url(#fillBookings)"
                stroke="var(--color-bookings)"
                strokeWidth={2.5}
              />
              <Area
                dataKey="occupancy"
                type="monotone"
                fill="url(#fillOccupancy)"
                stroke="var(--color-occupancy)"
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
