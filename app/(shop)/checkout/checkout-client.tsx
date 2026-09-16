"use client"

import { getCurrentUser } from "@/lib/supabase/auth"
import { createOrder } from "@/lib/supabase/orders-client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CheckCircle2, CreditCard, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCart } from "@/components/cart-provider"
import { formatRupiah } from "@/lib/data"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export function CheckoutClient() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()
  const [submitting, setSubmitting] = useState(false)
  const [payment, setPayment] = useState<"transfer" | "cod">("transfer")

  const shipping = subtotal > 0 ? (subtotal >= 200000 ? 0 : 15000) : 0
  const total = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="container-max w-full px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-semibold text-foreground">Keranjang Anda Kosong</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tambahkan beberapa item terlebih dahulu, lalu kembali untuk melanjutkan proses checkout.
        </p>
        <Button asChild className="mt-6">
          <Link href="/products">Jelajahi produk</Link>
        </Button>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  const formData = new FormData(e.currentTarget)

  const customerName = formData.get("name") as string
  const phone = formData.get("phone") as string
  const address = formData.get("address") as string
  const notes = formData.get("notes") as string
    try {
      setSubmitting(true)

      const user = await getCurrentUser()

      if (!user) {
        toast.error("Please login first")
        router.push("/login")
        return
      }

      const order = await createOrder(
        user.id,
        total,
        subtotal,
        shipping,
        payment,
        customerName,
        address,
        phone,
        items.map((item) => ({
          productId: item.productId,
          price: item.price,
          quantity: item.quantity,
        }))
      )

      clearCart()

      toast.success("Pesanan berhasil dibuat!", {
        description: "Pesanan Anda telah berhasil ditempatkan.",
      })

      router.push(`/orders/${order.id}`)
    } catch (error: any) {
      console.error("FULL ERROR:", error)
      console.error("MESSAGE:", error?.message)
      console.error("DETAILS:", error?.details)
      console.error("HINT:", error?.hint)
      console.error("CODE:", error?.code)

      toast.error("Failed to create order")
    } finally {
      setSubmitting(false)
    }
  }
  
  return (
    <div className="container-max w-full px-4 py-8 sm:px-6 lg:px-8">
      <header className="border-b border-border pb-8">
        <p className="text-sm font-medium text-primary">Checkout</p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Hanya beberapa detail lagi
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-6 sm:gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-6 sm:gap-8">
          <section className="card-base rounded-lg p-4 sm:p-6">
            <h2 className="font-display text-lg font-semibold text-foreground">Detail pengiriman</h2>
            <FieldGroup className="mt-4 space-y-4">
              <Field>
                <FieldLabel htmlFor="name">Nama lengkap</FieldLabel>
                <Input id="name" name="name" required placeholder="Sari Wijaya" className="input-mobile mt-1.5" />
              </Field>
              <Field>
                <FieldLabel htmlFor="phone">Telepon (WhatsApp)</FieldLabel>
                <Input id="phone" name="phone" required placeholder="+62 812 3456 7890" className="input-mobile mt-1.5" />
                <FieldDescription>Kami akan mengirimkan pembaruan pengiriman ke sini.</FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="address">Alamat lengkap</FieldLabel>
                <Textarea
                  id="address"
                  name="address"
                  required
                  rows={2}
                  placeholder="Jl. Melati No. 24, RT 02 RW 03, Kelurahan Cibogo, Bandung 40123"
                  className="input-mobile mt-1.5"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="notes">Catatan (opsional)</FieldLabel>
                <Textarea id="notes" name="notes" rows={2} placeholder="Leave at the front door, etc." className="input-mobile mt-1.5" />
              </Field>
            </FieldGroup>
          </section>

          <section className="card-base rounded-lg p-4 sm:p-6">
            <FieldSet>
              <FieldLegend className="font-display text-lg font-semibold text-foreground">
                Metode pembayaran
              </FieldLegend>
              <RadioGroup
                value={payment}
                onValueChange={(v) => setPayment(v as "transfer" | "cod")}
                className="mt-4 grid gap-3 grid-cols-1 sm:grid-cols-2"
              >
                <PaymentOption
                  value="transfer"
                  selected={payment === "transfer"}
                  icon={<CreditCard className="h-5 w-5" />}
                  title="Bank transfer"
                  description="BCA, BRI, Mandiri, Transfer manual, konfirmasi otomatis."
                />
                <PaymentOption
                  value="cod"
                  selected={payment === "cod"}
                  icon={<Truck className="h-5 w-5" />}
                  title="Cash on delivery"
                  description="Bayar saat menerima pesanan, area Pati."
                />
              </RadioGroup>
            </FieldSet>
          </section>
        </div>

        <aside className="card-base h-fit rounded-lg p-6 sticky top-20">
          <h2 className="font-display text-lg font-semibold text-foreground">Ringkasan Pesanan</h2>
          <ul className="mt-4 flex flex-col divide-y divide-border">
            {items.map((item) => (
              <li key={item.productId} className="flex items-start gap-3 py-3">
                <span className="flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-foreground">
                  {item.quantity}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.weight}</p>
                </div>
                <p className="text-sm font-medium text-foreground">
                  {formatRupiah(item.price * item.quantity)}
                </p>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="font-medium text-foreground">{formatRupiah(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Ongkos Kirim</dt>
              <dd className="font-medium text-foreground">
                {shipping === 0 ? "Free" : formatRupiah(shipping)}
              </dd>
            </div>
          </dl>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="text-sm font-medium text-muted-foreground">Total</span>
            <span className="font-display text-2xl font-semibold text-foreground">
              {formatRupiah(total)}
            </span>
          </div>
          <Button type="submit" className="button-mobile mt-6 w-full" disabled={submitting}>
            {submitting ? "Memesan…" : "Tempatkan pesanan"}
          </Button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
            Pemesanan yang aman. Tidak ada data pembayaran yang disimpan.
          </p>
        </aside>
      </form>
    </div>
  )
}

function PaymentOption({
  value,
  selected,
  icon,
  title,
  description,
}: {
  value: string
  selected: boolean
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <label
      htmlFor={`pay-${value}`}
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors",
        selected ? "border-primary bg-primary/5" : "border-border hover:border-primary/40",
      )}
    >
      <RadioGroupItem id={`pay-${value}`} value={value} className="mt-1" />
      <span
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg",
          selected ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground",
        )}
      >
        {icon}
      </span>
      <span className="flex-1">
        <span className="block font-display text-sm font-semibold text-foreground">{title}</span>
        <span className="mt-0.5 block text-xs text-muted-foreground">{description}</span>
      </span>
    </label>
  )
}


