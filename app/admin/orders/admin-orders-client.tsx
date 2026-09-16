"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { OrderStatusBadge } from "@/components/order-status-badge"
import { formatRupiah } from "@/lib/data"
import { AdminOrder, OrderStatus } from "@/lib/types"

type Props = { initialOrders: AdminOrder[] }

const STATUS_OPTIONS = [
  {
    value: "all",
    label: "Semua",
  },
  {
    value: OrderStatus.PENDING,
    label: "Pending",
  },
  {
    value: OrderStatus.PAID,
    label: "Paid",
  },
  {
    value: OrderStatus.PROCESSED,
    label: "Processed",
  },
  {
    value: OrderStatus.SHIPPED,
    label: "Shipped",
  },
  {
    value: OrderStatus.COMPLETED,
    label: "Completed",
  },
  {
    value: OrderStatus.CANCELLED,
    label: "Cancelled",
  },
] as const

export function AdminOrdersClient({ initialOrders }: Props) {
  const [search, setSearch] = useState("")
  const [tab, setTab] = useState<OrderStatus | "all">("all")

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return initialOrders.filter((o) => {
      const matchesQuery =
        !q ||
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q)
      const matchesStatus = tab === "all" || o.status === tab
      return matchesQuery && matchesStatus
    })
  }, [initialOrders, search, tab])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Pesanan</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Lacak dan perbarui pesanan pelanggan. Pembaruan status disinkronkan ke riwayat pesanan pelanggan.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={tab} onValueChange={(v) => setTab(v as OrderStatus | "all")}>
          <TabsList className="flex-wrap">
            {STATUS_OPTIONS.map((t) => (
              <TabsTrigger key={t.value} value={t.value}>
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="cari berdasarkan ID, atau nama "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 sm:w-72"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0 table-scroll">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Pesanan</TableHead>
                <TableHead>Pelanggan</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
           <TableBody>
              {filtered.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-xs">
                    {o.orderNumber}
                  </TableCell>

                  <TableCell>
                    <div className="font-medium">
                      {o.customerName}
                    </div>
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(o.date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>

                  <TableCell className="text-sm capitalize">
                    {o.paymentMethod === "transfer"
                      ? "Bank transfer"
                      : "COD"}
                  </TableCell>

                  <TableCell>
                    <OrderStatusBadge status={o.status} />
                  </TableCell>

                  <TableCell className="text-right font-medium">
                    {formatRupiah(o.total)}
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                    >
                      <Link href={`/admin/orders/${o.id}`}>
                        Kelola
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Tidak ada pesanan yang sesuai dengan filter Anda.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
