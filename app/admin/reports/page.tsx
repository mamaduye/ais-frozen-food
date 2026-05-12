import { TrendingUp, Package, Receipt, Users as UsersIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AdminSalesChart } from "@/components/admin/admin-sales-chart"
import { orders, products, formatRupiah } from "@/lib/data"

export default function ReportsPage() {
  const validOrders = orders.filter((o) => o.status !== "cancelled")
  const totalRevenue = validOrders.reduce((sum, o) => sum + o.total, 0)
  const totalOrders = validOrders.length

  // Best-sellers by quantity
  const productSales = new Map<string, { quantity: number; revenue: number; name: string }>()
  for (const order of validOrders) {
    for (const item of order.items) {
      const existing = productSales.get(item.productId)
      if (existing) {
        existing.quantity += item.quantity
        existing.revenue += item.price * item.quantity
      } else {
        productSales.set(item.productId, {
          quantity: item.quantity,
          revenue: item.price * item.quantity,
          name: item.name,
        })
      }
    }
  }

  const bestSellers = Array.from(productSales.entries())
    .map(([productId, data]) => {
      const product = products.find((p) => p.id === productId)
      return { productId, ...data, category: product?.category ?? "—" }
    })
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 6)

  // Daily totals over last 7 days based on orders
  const dailyMap = new Map<string, number>()
  for (const order of validOrders) {
    dailyMap.set(order.date, (dailyMap.get(order.date) ?? 0) + order.total)
  }
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const key = d.toISOString().slice(0, 10)
    const fromMap = dailyMap.get(key) ?? 0
    // fall back to mock distribution if no real data
    const fallback = [180000, 220000, 95000, 310000, 275000, 410000, 360000][i]
    return {
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
      total: fromMap || fallback,
    }
  })

  const avgOrderValue = totalOrders ? Math.round(totalRevenue / totalOrders) : 0

  const stats = [
    {
      label: "Total revenue",
      value: formatRupiah(totalRevenue),
      icon: TrendingUp,
    },
    {
      label: "Orders fulfilled",
      value: totalOrders.toString(),
      icon: Receipt,
    },
    {
      label: "Avg order value",
      value: formatRupiah(avgOrderValue),
      icon: Package,
    },
    {
      label: "Active customers",
      value: new Set(validOrders.map((o) => o.customerEmail)).size.toString(),
      icon: UsersIcon,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl">Reports</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sales performance and product insights for the last period.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <s.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-2 text-2xl font-semibold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-serif">Sales — last 7 days</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminSalesChart data={last7} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Best-selling products</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bestSellers.map((b, i) => (
                  <TableRow key={b.productId}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="w-6 justify-center">
                          {i + 1}
                        </Badge>
                        <div>
                          <div className="text-sm font-medium">{b.name}</div>
                          <div className="text-xs capitalize text-muted-foreground">
                            {b.category}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{b.quantity}</TableCell>
                    <TableCell className="text-right text-sm font-medium">
                      {formatRupiah(b.revenue)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
