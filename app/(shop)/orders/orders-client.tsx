"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/supabase/auth"

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
import { OrderStatus } from "@/lib/types"
import { formatRupiah } from "@/lib/data"
import {cancelOrder} from "@/lib/supabase/orders-client"

import { toast } from "sonner"


type OrderData = {
  id: string
  orderNumber: string
  status: OrderStatus
  paymentStatus: string
  paymentProof: string | null
  paidAt: string | null
  date: string
  total: number
  items: {
    productId: string
    quantity: number
    price: number
    name: string
  }[]
}

export function OrdersClient({
  initialOrders,
}: {
  initialOrders: OrderData[]
}) {

    const [orderList, setOrderList] = useState(initialOrders)

    const [user, setUser] = useState<any>(null)
    const router = useRouter()

    useEffect(() => {
      async function checkUser() {
        try {
          const currentUser = await getCurrentUser()

          if (!currentUser) {
            router.push("/login")
            return
          }

          setUser(currentUser)
        } catch (error) {
          console.error("CHECK USER ERROR:", error)
          router.push("/login")
        }
      }

      checkUser()
    }, [router])

  async function handleCancelOrder(orderId: string) {
    try {
      await cancelOrder(orderId)

      setOrderList((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status: OrderStatus.CANCELLED,
              }
            : o
        )
      )

      toast.success("Order berhasil dibatalkan")
    } catch (error) {
      toast.error("Gagal membatalkan order")
    }
  }
  
  if (!user) {
    return (
      <div className="p-6 text-center text-sm text-muted-foreground">
        Checking session...
      </div>
    )
  }

  return (
    <div className="container-max w-full px-4 py-8 sm:px-6 lg:px-8">
      <header className="border-b border-border pb-8">
        <p className="text-sm font-medium text-primary">Akun saya</p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Riwayat pesanan
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Lacak setiap pesanan, tinggalkan ulasan ketika pengiriman selesai.
        </p>
      </header>

      {orderList.length === 0 ? (
        <Empty className="mt-12">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Package />
            </EmptyMedia>
            <EmptyTitle>Tidak ada pesanan</EmptyTitle>
            <EmptyDescription>
              Anda belum memiliki pesanan apa pun.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="/products">Mulai berbelanja</Link>
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <ul className="mt-8 flex flex-col gap-4">
          {orderList.map((order) => {
            const canCancel =
              order.status === OrderStatus.PENDING ||
              order.status === OrderStatus.PAID
            const canReview = order.status === OrderStatus.COMPLETED

            console.log(
              "FIRST ITEM:",
              orderList[0]?.items[0]
            )

            return (
              <li
                key={order.id}
                className="card-interactive flex flex-col gap-4 rounded-lg p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <Link href={`/orders/${order.id}`}>
                      <p className="font-display text-base font-semibold text-foreground hover:text-primary">
                        {order.orderNumber}
                      </p>
                  </Link>
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
                        <p className="text-sm text-foreground">
                          {item.name} 
                        </p>
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
                            Batalkan pesanan
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Batalkan pesanan?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Apakah Anda yakin ingin membatalkan pesanan ini? Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>tetap pesan</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleCancelOrder(order.id)}>
                              ya, batalkan
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                    {canReview && (
                      <Button variant="default" size="sm" asChild>
                        <Link href={`/orders/${order.id}/review`}>
                          Tinggalkan ulasan
                        </Link>
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/products">
                        Beli lagi
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
