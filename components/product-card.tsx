"use client"

import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { formatRupiah, getCategoryName } from "@/lib/data"
import type { Product } from "@/lib/types"
import { toast } from "sonner"

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()

  return (
    <article className="card-interactive group relative flex flex-col overflow-hidden">
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-square overflow-hidden bg-secondary/40"
      >
        <Image
          src={product.images[0] || "/placeholder.svg"}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/90 px-2 py-0.5 text-[11px] font-medium text-foreground backdrop-blur">
          <Star className="h-3 w-3 fill-primary text-primary" />
          {product.rating.toFixed(1)}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
            {getCategoryName(product.categoryId)}
          </p>
          <Link href={`/products/${product.slug}`}>
            <h3 className="mt-1 line-clamp-1 font-display text-base font-semibold text-foreground group-hover:text-primary">
              {product.name}
            </h3>
          </Link>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {product.shortDescription}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <div>
            <p className="font-display text-lg font-semibold text-foreground">
              {formatRupiah(product.price)}
            </p>
            <p className="text-[11px] text-muted-foreground">{product.weight}</p>
          </div>
          <Button
            size="sm"
            onClick={() => {
              addItem(product, 1)
              toast.success(`${product.name} added to cart`)
            }}
          >
            Add
          </Button>
        </div>
      </div>
    </article>
  )
}
