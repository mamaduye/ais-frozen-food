import Link from "next/link"
import { ArrowUpRight, DollarSign, Package, ShoppingBag, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { OrderStatusBadge } from "@/components/order-status-badge"
import { AdminSalesChart } from "@/components/admin/admin-sales-chart"
import { formatRupiah, orders, products, users } from "@/lib/data"

export default function AdminOverviewPage() {
  const totalSales = orders.filter((o) => o.status !== "cancelled").reduce((acc, o) => acc + o.total, 0)
  const totalOrders = orders.length
  const completedOrders = orders.filter((o) => o.status === "completed").length
  const recent = [...orders].slice(0, 5)

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-primary">Dashboard</p>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Overview
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Quick snapshot of orders, sales, and inventory health.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/orders">
            View all orders
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<ShoppingBag className="h-5 w-5" />}
          label="Total orders"
          value={totalOrders.toString()}
          delta="+12% vs last month"
        />
        <StatCard
          icon={<DollarSign className="h-5 w-5" />}
          label="Total sales"
          value={formatRupiah(totalSales)}
          delta="+18% vs last month"
        />
        <StatCard
          icon={<Package className="h-5 w-5" />}
          label="Active products"
          value={products.length.toString()}
          delta={`${products.filter((p) => p.stock < 40).length} low stock`}
        />
        <StatCard
          icon={<Users className="h-5 w-5" />}
          label="Customers"
          value={users.length.toString()}
          delta={`${completedOrders} completed orders`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-border bg-card p-6">
          <header className="flex items-end justify-between gap-2">
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">Sales overview</h2>
              <p className="text-sm text-muted-foreground">Last 7 days of revenue</p>
            </div>
          </header>
          <div className="mt-4 h-72">
            <AdminSalesChart />
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <header className="flex items-end justify-between gap-2">
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">Top products</h2>
              <p className="text-sm text-muted-foreground">By rating & reviews</p>
            </div>
          </header>
          <ul className="mt-4 flex flex-col gap-3">
            {[...products]
              .sort((a, b) => b.reviewCount - a.reviewCount)
              .slice(0, 5)
              .map((p, i) => (
                <li key={p.id} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-foreground">
                    {i + 1}
                  </span>
                  <div className="flex-1 truncate">
                    <p className="truncate text-sm font-medium text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.reviewCount} reviews · {p.rating.toFixed(1)}★</p>
                  </div>
                  <p className="text-sm font-semibold text-foreground">{formatRupiah(p.price)}</p>
                </li>
              ))}
          </ul>
        </section>
      </div>

      <section className="rounded-2xl border border-border bg-card">
        <header className="flex flex-wrap items-end justify-between gap-2 border-b border-border px-6 py-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">Recent orders</h2>
            <p className="text-sm text-muted-foreground">Latest 5 orders across all customers</p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/orders">
              See all
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr className="border-b border-border">
                <th className="px-6 py-3 text-left font-medium">Order</th>
                <th className="px-6 py-3 text-left font-medium">Customer</th>
                <th className="px-6 py-3 text-left font-medium">Date</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
                <th className="px-6 py-3 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recent.map((o) => (
                <tr key={o.id} className="text-foreground">
                  <td className="px-6 py-3 font-medium">{o.id}</td>
                  <td className="px-6 py-3 text-muted-foreground">{o.customerName}</td>
                  <td className="px-6 py-3 text-muted-foreground">
                    {new Date(o.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </td>
                  <td className="px-6 py-3">
                    <OrderStatusBadge status={o.status} />
                  </td>
                  <td className="px-6 py-3 text-right font-semibold">{formatRupiah(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  delta,
}: {
  icon: React.ReactNode
  label: string
  value: string
  delta: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </span>
      </div>
      <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold text-foreground">{value}</p>
      <p className="mt-1 text-xs text-emerald-600">{delta}</p>
    </div>
  )
}
