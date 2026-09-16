import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

import {
  ArrowLeft,
  Calendar,
  CreditCard,
  MapPin,
  Package,
  Phone,
  ReceiptText,
  User,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { OrderStatusBadge } from "@/components/order-status-badge"
import { PaymentProofUpload } from "@/components/orders/payment-proof-upload"
import { PrintInvoiceButton } from "@/components/orders/print-invoice-button"

import { formatRupiah } from "@/lib/data"
import { getOrderById } from "@/lib/supabase/orders"
import { getCurrentServerUser } from "@/lib/supabase/server-auth"

type Props = {
  params: Promise<{
    id: string
  }>
}

function getPaymentStatusLabel(status: string) {
  switch (status) {
    case "waiting_verification":
      return "Menunggu Verifikasi"

    case "completed":
      return "Lunas"

    case "failed":
      return "Gagal"

    case "refunded":
      return "Dikembalikan"

    case "pending":
    default:
      return "Belum Dibayar"
  }
}

function getPaymentMethodLabel(method: string) {
  if (method === "transfer") {
    return "Transfer Bank"
  }

  if (method === "cod") {
    return "Cash on Delivery (COD)"
  }

  return method
}

function getOrderStatusLabel(status: string) {
  switch (status) {
    case "pending":
      return "Menunggu"

    case "paid":
      return "Sudah Dibayar"

    case "processed":
      return "Diproses"

    case "shipped":
      return "Dikirim"

    case "completed":
      return "Selesai"

    case "cancelled":
      return "Dibatalkan"

    default:
      return status
  }
}

export default async function OrderDetailPage({
  params,
}: Props) {
  const { id } = await params

  // ============================================================
  // 1. AUTH
  // ============================================================
  const user = await getCurrentServerUser()

  if (!user) {
    redirect("/login")
  }

  // ============================================================
  // 2. GET ORDER
  // ============================================================
  const order = await getOrderById(user.id, id)

  if (!order) {
    redirect("/orders")
  }

  const orderDate = new Date(order.date)

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 print:max-w-none print:px-0 print:py-0">
      {/* ========================================================
          BACK BUTTON
      ======================================================== */}
      <div className="print:hidden">
        <Button
          asChild
          variant="ghost"
          className="mb-6 -ml-2"
        >
          <Link href="/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Riwayat Pesanan
          </Link>
        </Button>
      </div>

      <div className="space-y-6 print:space-y-0">
        {/* ======================================================
            PAGE HEADER - WEB ONLY
        ====================================================== */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between print:hidden">
          <div>
            <p className="text-sm font-medium text-primary">
              Detail Pesanan
            </p>

            <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">
              {order.orderNumber}
            </h1>

            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />

              {orderDate.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <OrderStatusBadge status={order.status} />
            <PrintInvoiceButton />
          </div>
        </div>

        {/* ======================================================
            INVOICE
        ====================================================== */}
        <div className="print-invoice overflow-hidden rounded-2xl border bg-background shadow-sm print:rounded-none print:border-0 print:shadow-none">
          {/* ====================================================
              INVOICE HEADER
          ==================================================== */}
          <div className="border-b bg-muted/30 p-6 print:bg-transparent">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border bg-background">
                  <Image
                    src="/logo/ais-frozen-food.webp"
                    alt="AIS Frozen Food"
                    fill
                    className="object-contain p-1"
                    priority
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <ReceiptText className="h-5 w-5 text-primary" />

                    <h2 className="font-display text-xl font-semibold">
                      Invoice Pesanan
                    </h2>
                  </div>

                  <p className="mt-1 text-sm font-medium text-foreground">
                    AIS Frozen Food
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Pati, Jawa Tengah
                  </p>

                  <p className="text-xs text-muted-foreground">
                    WhatsApp: 0852-2612-2121
                  </p>
                </div>
              </div>

              <div className="sm:text-right">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Nomor Pesanan
                </p>

                <p className="mt-1 font-mono text-sm font-semibold">
                  {order.orderNumber}
                </p>

              </div>
            </div>
          </div>

          {/* ====================================================
              CUSTOMER + TRANSACTION INFO
          ==================================================== */}
          <div className="grid gap-6 border-b p-6 md:grid-cols-2 print:grid-cols-2">
            {/* Customer */}
            <div>
              <h3 className="text-sm font-semibold">
                Informasi Pelanggan
              </h3>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <User className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Nama
                    </p>

                    <p className="font-medium">
                      {order.customerName || "Pelanggan"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Nomor Telepon
                    </p>

                    <p className="font-medium">
                      {order.customerPhone || "-"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Alamat Pengiriman
                    </p>

                    <p className="whitespace-pre-line font-medium">
                      {order.address || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction */}
            <div>
              <h3 className="text-sm font-semibold">
                Informasi Transaksi
              </h3>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Tanggal Pesanan
                    </p>

                    <p className="font-medium">
                      {orderDate.toLocaleString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Metode Pembayaran
                    </p>

                    <p className="font-medium">
                      {getPaymentMethodLabel(order.paymentMethod)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Package className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Status Pembayaran
                    </p>

                    <p className="font-medium">
                      {getPaymentStatusLabel(order.paymentStatus)}
                    </p>
                  </div>
                </div>

                {order.paidAt && (
                  <div className="pl-7">
                    <p className="text-xs text-muted-foreground">
                      Waktu Pembayaran
                    </p>

                    <p className="font-medium">
                      {new Date(order.paidAt).toLocaleString("id-ID")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ====================================================
              ORDER ITEMS
          ==================================================== */}
          <div className="border-b">
            <div className="border-b bg-muted/20 px-6 py-3 print:bg-transparent">
              <div className="grid grid-cols-[1fr_auto] gap-4 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:grid-cols-[1fr_100px_140px_140px] print:grid-cols-[1fr_100px_100px_120px]">
                <span>Produk</span>

                <span className="hidden text-right sm:block print:block">
                  Harga
                </span>

                <span className="hidden text-right sm:block print:block">
                  Jumlah
                </span>

                <span className="text-right">
                  Subtotal
                </span>
              </div>
            </div>

            <div className="divide-y">
              {order.items.map((item, index) => (
                <div
                  key={`${item.productId}-${index}`}
                  className="grid grid-cols-[1fr_auto] gap-4 px-6 py-4 sm:grid-cols-[1fr_100px_140px_140px] print:grid-cols-[1fr_100px_100px_120px]"
                >
                  <div>
                    <p className="font-medium">
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground sm:hidden print:hidden">
                      {item.quantity} × {formatRupiah(item.price)}
                    </p>
                  </div>

                  <p className="hidden text-right text-sm sm:block print:block">
                    {formatRupiah(item.price)}
                  </p>

                  <p className="hidden text-right text-sm sm:block print:block">
                    {item.quantity}
                  </p>

                  <p className="text-right font-medium">
                    {formatRupiah(
                      item.price * item.quantity,
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ====================================================
              TOTAL
          ==================================================== */}
          <div className="flex justify-end p-6">
            <div className="w-full space-y-3 sm:max-w-sm print:max-w-sm">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Subtotal
                </span>

                <span>
                  {formatRupiah(order.subtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Ongkos Kirim
                </span>

                <span>
                  {formatRupiah(order.shipping)}
                </span>
              </div>

              <div className="border-t pt-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">
                    Total Pembayaran
                  </span>

                  <span className="font-display text-xl font-bold text-primary">
                    {formatRupiah(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ====================================================
              INVOICE FOOTER
          ==================================================== */}
          <div className="border-t bg-muted/20 px-6 py-4 text-center print:bg-transparent">
            <p className="text-xs font-medium text-foreground">
              Terima kasih telah berbelanja di AIS Frozen Food.
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Simpan invoice ini sebagai bukti transaksi Anda.
            </p>
          </div>
        </div>

        {/* ======================================================
            PAYMENT ACTION - WEB ONLY
        ====================================================== */}
        <div className="rounded-2xl border bg-background p-6 shadow-sm print:hidden">
          <div className="mt-5">
            {order.paymentMethod === "transfer" && (
              <PaymentProofUpload
                orderId={order.id}
                paymentStatus={order.paymentStatus}
                paymentProof={order.paymentProof}
              />
            )}

            {order.paymentMethod === "cod" && (
              <div className="rounded-xl border bg-muted/30 p-4">
                <p className="font-medium">
                  Cash on Delivery
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Pembayaran dilakukan ketika pesanan diterima.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}