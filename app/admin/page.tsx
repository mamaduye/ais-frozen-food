import Link from "next/link"
import {
  ArrowUpRight,
  DollarSign,
  Package,
  ShoppingBag,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { OrderStatusBadge } from "@/components/order-status-badge"
import { AdminSalesChart } from "@/components/admin/admin-sales-chart"
import { formatRupiah } from "@/lib/data"
import { getAdminDashboardData, getAdminSalesChartData } from "@/lib/supabase/admin-dashboard"

export default async function AdminOverviewPage() {

  const [
  dashboardData,
  salesData,
] = await Promise.all([
  getAdminDashboardData(),
  getAdminSalesChartData(),
])

  const {
    totalSales,
    totalOrders,
    totalProducts,
    totalUsers,
    completedOrders,
    lowStockProducts,
    recentOrders,
    topProducts,
  } = await getAdminDashboardData()

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>

          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Admin Dashboard
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Ringkasan data toko dan performa penjualan.
          </p>
        </div>

        <Button asChild variant="outline" size="sm">
          <Link href="/admin/orders">
            Lihat semua pesanan
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </header>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<ShoppingBag className="h-5 w-5" />}
          label="Total orders"
          value={totalOrders.toString()}
          delta={`${completedOrders} completed orders`}
        />

        <StatCard
          icon={<DollarSign className="h-5 w-5" />}
          label="Total sales"
          value={formatRupiah(totalSales)}
          delta="Live data"
        />

        <StatCard
          icon={<Package className="h-5 w-5" />}
          label="Active products"
          value={totalProducts.toString()}
          delta={`${lowStockProducts} low stock`}
        />

        <StatCard
          icon={<Users className="h-5 w-5" />}
          label="Customers"
          value={totalUsers.toString()}
          delta="Registered customers"
        />
      </div>

      {/* Sales + Top Products */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Sales Overview */}
        <section className="rounded-2xl border border-border bg-card p-6">
          <header className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">
                Penjualan
              </h2>

              <p className="text-sm text-muted-foreground">
                Performa penjualan dalam 30 hari terakhir
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-muted-foreground">
                Total 30 hari
              </p>

              <p className="font-display text-xl font-semibold text-foreground">
                {formatRupiah(salesData.reduce(
                  (sum, item) => sum + item.sales,
                  0
                ))}
              </p>
            </div>
          </header>

          <div className="mt-4 h-72">
            <AdminSalesChart data={salesData} />
          </div>
        </section>

        {/* Top Products */}
        <section className="rounded-2xl border border-border bg-card p-6">
          <header className="flex items-end justify-between gap-2">
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">
                Produk terlaris
              </h2>

              <p className="text-sm text-muted-foreground">
                Berdasarkan penjualan dalam 30 hari terakhir.
              </p>
            </div>
          </header>

          <ul className="mt-4 flex flex-col gap-3">
            {topProducts.map((p, i) => (
              <li
                key={p.id}
                className="flex items-center gap-3"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-foreground">
                  {i + 1}
                </span>

                <div className="flex-1 truncate">
                  <p className="truncate text-sm font-medium text-foreground">
                    {p.name}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {p.review_count ?? 0} reviews ·{" "}
                    {Number(p.rating ?? 0).toFixed(1)}★
                  </p>
                </div>

                <p className="text-sm font-semibold text-foreground">
                  {formatRupiah(p.price)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Recent Orders */}
      <section className="rounded-2xl border border-border bg-card">
        <header className="flex flex-wrap items-end justify-between gap-2 border-b border-border px-6 py-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">
              Pesanan terbaru
            </h2>

            <p className="text-sm text-muted-foreground">
              Pesanan terbaru dari semua pelanggan
            </p>
          </div>

          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/orders">
              Lihat semua
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr className="border-b border-border">
                <th className="px-6 py-3 text-left font-medium">
                  Order ID
                </th>

                <th className="px-6 py-3 text-left font-medium">
                  Pelanggan
                </th>

                <th className="px-6 py-3 text-left font-medium">
                  Tanggal
                </th>

                <th className="px-6 py-3 text-left font-medium">
                  Status
                </th>

                <th className="px-6 py-3 text-right font-medium">
                  Total
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {recentOrders.map((o) => (
                <tr
                  key={o.id}
                  className="text-foreground"
                >
                  <td className="px-6 py-3 font-medium">
                    {o.id}
                  </td>

                  <td className="px-6 py-3 text-muted-foreground">
                    {o.customer_name}
                  </td>

                  <td className="px-6 py-3 text-muted-foreground">
                    {new Date(o.created_at).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                      }
                    )}
                  </td>

                  <td className="px-6 py-3">
                    <OrderStatusBadge status={o.status} />
                  </td>

                  <td className="px-6 py-3 text-right font-semibold">
                    {formatRupiah(o.total)}
                  </td>
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

      <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 font-display text-2xl font-semibold text-foreground">
        {value}
      </p>

      <p className="mt-1 text-xs text-emerald-600">
        {delta}
      </p>
    </div>
  )
}