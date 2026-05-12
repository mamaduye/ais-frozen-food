"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, ChevronRight, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { OrderStatusBadge } from "@/components/order-status-badge"
import { formatRupiah } from "@/lib/data"
import type { Order } from "@/lib/types"
import { toast } from "sonner"

export function OrdersClient({ initialOrders }: { initialOrders: Order[] }) {
  const [orderList, setOrderList] = useState(initialOrders)

  function cancelOrder(orderId: string) {
    setOrderList((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "cancelled" as const } : o)),
    )
    toast.success(`Order ${orderId} cancelled`)
  }

  return (
    <div className="container-max w-full px-4 py-8 sm:px-6 lg:px-8">
      <header className="border-b border-border pb-8">
        <p className="text-sm font-medium text-primary">My account</p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Order history
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Track every order, leave a review when delivery is completed.
        </p>
      </header>

      {orderList.length === 0 ? (
        <Empty className="mt-12">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Package />
            </EmptyMedia>
            <EmptyTitle>No orders yet</EmptyTitle>
            <EmptyDescription>Your past orders will appear here once you check out.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="/products">Start shopping</Link>
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <ul className="mt-8 flex flex-col gap-4">
          {orderList.map((order) => {
            const canCancel = order.status === "pending" || order.status === "paid"
            const canReview = order.status === "completed"

            return (
              <li
                key={order.id}
                className="card-interactive flex flex-col gap-4 rounded-lg p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-base font-semibold text-foreground">{order.id}</p>
                    <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(order.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>

                <ul className="flex flex-col divide-y divide-border rounded-xl border border-border">
                  {order.items.map((item) => (
                    <li
                      key={item.productId}
                      className="flex items-center justify-between gap-3 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-foreground">
                          {item.quantity}
                        </span>
                        <p className="text-sm text-foreground">{item.name}</p>
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        {formatRupiah(item.price * item.quantity)}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="font-display text-xl font-semibold text-foreground">
                      {formatRupiah(order.total)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {canCancel && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            Cancel order
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Order {order.id} will be cancelled. If you have already transferred
                              payment, our team will refund you within 1×24 hours.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Keep order</AlertDialogCancel>
                            <AlertDialogAction onClick={() => cancelOrder(order.id)}>
                              Yes, cancel
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                    {canReview && (
                      <Button variant="secondary" size="sm">
                        Leave a review
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/products">
                        Buy again
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
