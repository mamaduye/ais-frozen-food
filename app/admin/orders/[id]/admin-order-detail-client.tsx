"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, MapPin, Phone, Mail, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { OrderStatusBadge } from "@/components/order-status-badge"
import { formatRupiah } from "@/lib/data"
import type { Order, OrderStatus } from "@/lib/types"

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "processed", label: "Processed" },
  { value: "shipped", label: "Shipped" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
]

export function AdminOrderDetailClient({ initialOrder }: { initialOrder: Order }) {
  const [order, setOrder] = useState<Order>(initialOrder)
  const [pendingStatus, setPendingStatus] = useState<OrderStatus>(initialOrder.status)

  function handleSave() {
    setOrder({ ...order, status: pendingStatus })
  }

  function handleCancel() {
    if (!confirm("Cancel this order? This action cannot be undone.")) return
    setOrder({ ...order, status: "cancelled" })
    setPendingStatus("cancelled")
  }

  const canCancel = order.status === "pending" || order.status === "paid"

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2">
            <Link href="/admin/orders">
              <ArrowLeft className="mr-1 h-4 w-4" /> Back to orders
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-3xl">{order.id}</h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Placed on{" "}
            {new Date(order.date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Items ordered</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatRupiah(item.price)} × {item.quantity}
                    </div>
                  </div>
                  <div className="font-medium">{formatRupiah(item.price * item.quantity)}</div>
                </div>
              ))}
              <Separator className="my-2" />
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatRupiah(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{formatRupiah(order.shipping)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 text-base font-semibold">
                  <span>Total</span>
                  <span>{formatRupiah(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Customer</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <div className="text-sm">
                <div className="font-medium">{order.customerName}</div>
                <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {order.customerEmail}
                </div>
                <div className="mt-1 flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {order.customerPhone}
                </div>
              </div>
              <div className="text-sm">
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{order.address}</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  <span className="capitalize">
                    {order.paymentMethod === "transfer" ? "Bank transfer" : "Cash on delivery"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="font-serif">Update status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Order status</label>
              <Select
                value={pendingStatus}
                onValueChange={(v) => setPendingStatus(v as OrderStatus)}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Customers can see status changes immediately.
              </p>
            </div>
            <Button
              className="w-full"
              onClick={handleSave}
              disabled={pendingStatus === order.status}
            >
              Save status
            </Button>
            <Separator />
            <div>
              <Button
                variant="outline"
                className="w-full text-destructive hover:text-destructive"
                onClick={handleCancel}
                disabled={!canCancel}
              >
                Cancel order
              </Button>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Orders can only be cancelled while pending or paid.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
