"use client"

import { useState } from "react"
import Image from "next/image"
import { Minus, Plus, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/cart-provider"
import { formatRupiah } from "@/lib/data"
import type { Product } from "@/lib/types"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export function ProductDetailClient({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  return (
    <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
      {/* Gallery */}
      <div className="flex flex-col gap-3">
        <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-secondary">
          <Image
            src={product.images[activeImage] || "/placeholder.svg"}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            priority
          />
          {product.featured && (
            <Badge className="absolute left-4 top-4 bg-primary text-primary-foreground hover:bg-primary">
              Best seller
            </Badge>
          )}
        </div>
        {product.images.length > 1 && (
          <div className="flex gap-3">
            {product.images.map((src, i) => (
              <button
                key={src + i}
                type="button"
                onClick={() => setActiveImage(i)}
                className={cn(
                  "relative h-20 w-20 overflow-hidden rounded-xl border-2 bg-secondary transition-colors",
                  activeImage === i ? "border-primary" : "border-transparent hover:border-border",
                )}
                aria-label={`View image ${i + 1}`}
              >
                <Image src={src || "/placeholder.svg"} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col gap-5">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{product.category}</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {product.name}
          </h1>
          <div className="mt-3 flex items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1 text-foreground">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <strong>{product.rating.toFixed(1)}</strong>
              <span className="text-muted-foreground">({product.reviewCount} reviews)</span>
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">{product.weight}</span>
            <span className="text-muted-foreground">·</span>
            <span
              className={cn(
                "font-medium",
                product.stock > 0 ? "text-emerald-600" : "text-destructive",
              )}
            >
              {product.stock > 0 ? `In stock (${product.stock})` : "Sold out"}
            </span>
          </div>
        </div>

        <p className="font-display text-3xl font-semibold text-foreground">
          {formatRupiah(product.price)}
        </p>

        <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>

        <div className="mt-2 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center">
          <div className="inline-flex h-11 items-center rounded-full border border-border bg-background">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-11 w-11 items-center justify-center rounded-l-full text-muted-foreground hover:text-foreground"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-8 text-center font-display text-base font-semibold text-foreground">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              className="flex h-11 w-11 items-center justify-center rounded-r-full text-muted-foreground hover:text-foreground"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <Button
            size="lg"
            className="flex-1"
            disabled={product.stock === 0}
            onClick={() => {
              addItem(product, quantity)
              toast.success(`${quantity} × ${product.name} added to cart`)
            }}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to cart · {formatRupiah(product.price * quantity)}
          </Button>
        </div>
      </div>
    </div>
  )
}
