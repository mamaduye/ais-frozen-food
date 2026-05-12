"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"

const fallbackData = [
  { label: "Mon", total: 420000 },
  { label: "Tue", total: 540000 },
  { label: "Wed", total: 380000 },
  { label: "Thu", total: 720000 },
  { label: "Fri", total: 610000 },
  { label: "Sat", total: 890000 },
  { label: "Sun", total: 760000 },
]

const config = {
  total: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

type Props = {
  data?: { label: string; total: number }[]
}

export function AdminSalesChart({ data = fallbackData }: Props) {
  return (
    <ChartContainer config={config} className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-total)" stopOpacity={0.4} />
              <stop offset="95%" stopColor="var(--color-total)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={10} />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            width={36}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                formatter={(value) =>
                  new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(Number(value))
                }
              />
            }
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke="var(--color-total)"
            strokeWidth={2}
            fill="url(#revenueFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
