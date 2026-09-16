"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { useCart } from "@/components/cart-provider"
import { formatRupiah } from "@/lib/data"

export function CartClient() {
  const { items, subtotal, updateQuantity, removeItem, itemCount } = useCart()
  const shipping = subtotal > 0 ? (subtotal >= 200000 ? 0 : 15000) : 0
  const total = subtotal + shipping

  return (
    <div className="container-max w-full px-4 py-8 sm:px-6 lg:px-8">
      <header className="border-b border-border pb-8">
        <p className="text-sm font-medium text-primary">keranjang</p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {itemCount > 0 ? `${itemCount} item${itemCount > 1 ? "s" : ""} siap untuk checkout` : "Keranjang Anda kosong"}
        </h1>
      </header>

      {items.length === 0 ? (
        <Empty className="mt-12">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ShoppingBag />
            </EmptyMedia>
            <EmptyTitle>Keranjang Anda kosong</EmptyTitle>
            <EmptyDescription>
              Telusuri menu beku kami dan tambahkan favorit Anda untuk memulai.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="/products">
                Cari produk
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <ul className="card-base flex flex-col divide-y divide-border rounded-lg overflow-hidden">
            {items.map((item) => (
              <li key={item.productId} className="flex gap-4 p-4 sm:p-5">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-secondary sm:h-28 sm:w-28">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-display text-base font-semibold text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.weight}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex h-9 items-center rounded-full border border-border">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="flex h-9 w-9 items-center justify-center rounded-l-full text-muted-foreground hover:text-foreground"
                        aria-label="Decrease"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-7 text-center text-sm font-semibold text-foreground">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="flex h-9 w-9 items-center justify-center rounded-r-full text-muted-foreground hover:text-foreground"
                        aria-label="Increase"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="font-display text-base font-semibold text-foreground">
                      {formatRupiah(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="card-base h-fit rounded-lg p-6 sticky top-20">
            <h2 className="font-display text-lg font-semibold text-foreground">Ringkasan Pesanan</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <Row label="Subtotal" value={formatRupiah(subtotal)} />
              <Row
                label="Shipping"
                value={shipping === 0 ? "Free" : formatRupiah(shipping)}
                hint={subtotal < 200000 ? `Add ${formatRupiah(200000 - subtotal)} for free delivery` : undefined}
              />
            </dl>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm font-medium text-muted-foreground">Total</span>
              <span className="font-display text-2xl font-semibold text-foreground">
                {formatRupiah(total)}
              </span>
            </div>
            <Button asChild size="lg" className="mt-6 w-full">
              <Link href="/checkout">
                Checkout
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Pengemasan rantai dingin termasuk dalam semua pesanan.
            </p>
          </aside>
        </div>
      )}
    </div>
  )
}

function Row({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <dt className="text-muted-foreground">{label}</dt>
        {hint && <p className="mt-0.5 text-[11px] text-primary">{hint}</p>}
      </div>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  )
}
