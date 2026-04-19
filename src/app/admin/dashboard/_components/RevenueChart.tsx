"use client";

import * as React from "react"

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
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

// 💰 Sample Finance Data (replace later with real data)
const chartData = [
  { date: "2026-04-01", income: 500, expenses: 300 },
  { date: "2026-04-02", income: 700, expenses: 450 },
  { date: "2026-04-03", income: 650, expenses: 400 },
  { date: "2026-04-04", income: 900, expenses: 600 },
  { date: "2026-04-05", income: 750, expenses: 500 },
  { date: "2026-04-06", income: 1000, expenses: 650 },
  { date: "2026-04-07", income: 850, expenses: 550 },
  { date: "2026-04-08", income: 1502, expenses: 690 },
  { date: "2026-04-09", income: 1025, expenses: 302 },
];

// 🎨 Chart config (important for colors + labels)
const chartConfig = {
  income: {
    label: "Income",
    color: "var(--chart-4)",
  },
  expenses: {
    label: "Expenses",
    color: "var(--chart-3",
  },
} satisfies ChartConfig;

export function RevenueChart() {
  const [range, setRange] = React.useState("7d");

  // 🔍 Filter logic (same idea as your sample)
  const filteredData = chartData.slice(
    range === "7d" ? -7 : range === "30d" ? -30 : chartData.length,
  );

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="text-sm text-muted-foreground">
            Financial Overview
          </CardTitle>
          {/* 💰 Total Amount */}
          <div className="text-3xl font-bold tracking-tight">₱39,025.00</div>

          {/* 📈 Growth Indicator */}
          <CardDescription>
            <span className="text-green-500 font-medium">
              +₱1,840.00 (4.9%)
            </span>{" "}
            vs last month
          </CardDescription>
        </div>

        {/* 🔽 Range Selector */}
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="hidden w-35 sm:flex">
            <SelectValue placeholder="Last 7 days" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="h-62.5 w-full">
          <AreaChart data={filteredData}>
            {/* 🌈 Gradient fills */}
            <defs>
              <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-income)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-income)"
                  stopOpacity={0.1}
                />
              </linearGradient>

              <linearGradient id="fillExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-expenses)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-expenses)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="date"
              tickLine={true}
              axisLine={true}
              tickMargin={8}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />

            {/* 🧠 Smart Tooltip */}
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                />
              }
            />

            {/* 💚 Income */}
            <Area
              dataKey="income"
              name="Income"
              type="natural"
              fill="url(#fillIncome)"
              stroke="var(--color-income)"
              strokeWidth={0}
            />

            {/* 🔴 Expenses */}
            <Area
              dataKey="expenses"
              name="Expenses"
              type="natural"
              fill="url(#fillExpenses)"
              stroke="var(--color-expenses)"
              strokeWidth={0}
            />

            <ChartLegend content={<ChartLegendContent className="text-xs text-muted-foreground" />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
