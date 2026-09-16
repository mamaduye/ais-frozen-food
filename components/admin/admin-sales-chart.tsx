"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import type { ChartConfig } from "@/components/ui/chart"

const config = {
  sales: {
    label: "Penjualan",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

type SalesData = {
  date: string
  sales: number
}

type Props = {
  data: SalesData[]
}

export function AdminSalesChart({ data }: Props) {
  return (
    <ChartContainer
      config={config}
      className="h-72 w-full"
    >
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <AreaChart
          data={data}
          margin={{
            left: 0,
            right: 8,
            top: 8,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient
              id="salesFill"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="var(--color-sales)"
                stopOpacity={0.4}
              />

              <stop
                offset="95%"
                stopColor="var(--color-sales)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            vertical={false}
            stroke="var(--border)"
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tickFormatter={(value) => {
              const date = new Date(value)

              return date.toLocaleDateString(
                "id-ID",
                {
                  day: "numeric",
                  month: "short",
                }
              )
            }}
          />

          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => {
              if (value >= 1_000_000) {
                return `${(
                  value / 1_000_000
                ).toFixed(1)}jt`
              }

              return `${(
                value / 1_000
              ).toFixed(0)}k`
            }}
            width={42}
          />

          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelFormatter={(label) => {
                  return new Date(
                    label
                  ).toLocaleDateString(
                    "id-ID",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )
                }}
                formatter={(value) =>
                  new Intl.NumberFormat(
                    "id-ID",
                    {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }
                  ).format(Number(value))
                }
              />
            }
          />

          <Area
            type="monotone"
            dataKey="sales"
            stroke="var(--color-sales)"
            strokeWidth={2}
            fill="url(#salesFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}