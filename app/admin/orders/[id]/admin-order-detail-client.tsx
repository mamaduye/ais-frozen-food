"use client"

import Link from "next/link"
import { useState } from "react"
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Calendar,
  Image as ImageIcon,
} from "lucide-react"
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
import {
  AdminOrder,
  OrderStatus,
  PaymentStatus,
} from "@/lib/types"
import { updateOrderStatusAction, verifyPaymentAction } from "./action"
import { useRouter } from "next/navigation"


const STATUS_OPTIONS = [
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
]

export function AdminOrderDetailClient({ initialOrder }: { initialOrder: AdminOrder }) {

  const router = useRouter()
  const [order, setOrder] = useState<AdminOrder>(initialOrder)
  const [pendingStatus, setPendingStatus] = useState<OrderStatus>(initialOrder.status)

  async function handleSave() {
    await updateOrderStatusAction(
      order.id,
      pendingStatus
    )

    setOrder({
      ...order,
      status: pendingStatus,
    })

    router.refresh()
  }

  async function handleCancel() {
    if (!confirm("batalkan pesanan?")) return

    await updateOrderStatusAction(
      order.id,
      OrderStatus.CANCELLED
    )

    setOrder({
      ...order,
      status: OrderStatus.CANCELLED,
    })

    setPendingStatus(OrderStatus.CANCELLED)

    router.refresh()
  }

  const canCancel = order.status === OrderStatus.PENDING || order.status === OrderStatus.PAID

  async function handleVerifyPayment() {
    if (!confirm("Verifikasi pembayaran ini?")) return

    try {
      await verifyPaymentAction(order.id)

      setOrder({
        ...order,
        status: OrderStatus.PAID,
        paymentStatus: PaymentStatus.COMPLETED,
        paidAt: new Date().toISOString(),
      })

      setPendingStatus(OrderStatus.PAID)

      router.refresh()
    } catch (error) {
      console.error("VERIFY PAYMENT ERROR:", error)
      alert("Gagal memverifikasi pembayaran.")
    }
  }

  console.log("PAYMENT PROOF:", order.paymentProof)
  console.log("PAYMENT STATUS:", order.paymentStatus)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2">
            <Link href="/admin/orders">
              <ArrowLeft className="mr-1 h-4 w-4" /> Kembali ke Pesanan
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-3xl">{order.orderNumber}</h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Dibuat pada{" "}
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
              <CardTitle className="font-serif">Barang yang dipesan</CardTitle>
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
                  <span className="text-muted-foreground">Ongkos Kirim</span>
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
              <CardTitle className="font-serif">Pelanggan</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <div className="text-sm">
                <div className="font-medium">{order.customerName}</div>
                {order.customerEmail && (
                  <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {order.customerEmail}
                  </div>
                )}
                {order.customerPhone && (
                  <div className="mt-1 flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {order.customerPhone}
                  </div>
                )}
              </div>
    
              <div className="text-sm">
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{order.address}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-serif">
                Informasi Pembayaran
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">

              <div>
                <p className="text-sm text-muted-foreground">
                  Status Pembayaran
                </p>

                <p className="font-medium capitalize">
                  {order.paymentStatus}
                </p>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground">
                  Metode Pembayaran
                </p>

                <p className="font-medium capitalize">
                  {order.paymentMethod === "transfer"
                    ? "Bank Transfer"
                    : "Cash on Delivery"}
                </p>
              </div>

              <Separator />

              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />

                <div>
                  <p className="text-sm text-muted-foreground">
                    Dibayar pada
                  </p>

                  <p>
                    {order.paidAt
                      ? new Date(order.paidAt).toLocaleString("id-ID")
                      : "-"}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-2">
                <ImageIcon className="h-4 w-4 mt-1 text-muted-foreground" />

                <div className="w-full">
                  <p className="text-sm text-muted-foreground">
                    Bukti Pembayaran
                  </p>

                  {order.paymentProof ? (
                    <div className="space-y-3">
                      <a
                        href={order.paymentProof}
                        target="_blank"
                        rel="noreferrer"
                        className="block text-primary underline"
                      >
                        Lihat bukti pembayaran
                      </a>

                      {order.paymentStatus === PaymentStatus.WAITING_VERIFICATION && (
                        <Button
                          onClick={handleVerifyPayment}
                          size="sm"
                          className="w-fit"
                        >
                          Verifikasi Pembayaran
                        </Button>
                      )}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        Tidak ada bukti pembayaran.
                      </p>
                  )}
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="font-serif">Perbarui Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Status Pesanan</label>
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
                Pelanggan dapat melihat perubahan status secara langsung.
              </p>
            </div>
            <Button
              className="w-full"
              onClick={handleSave}
              disabled={pendingStatus === order.status}
            >
              Simpan
            </Button>
            <Separator />
            <div>
              <Button
                variant="destructive"
                className="w-full text-white"
                onClick={handleCancel}
                disabled={!canCancel}
              >
                Batalkan Pesanan
              </Button>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Pesanan hanya bisa dibatalkan saat dalam status pending atau paid.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
