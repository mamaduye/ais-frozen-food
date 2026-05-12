import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight, Snowflake, ShieldCheck, Truck } from "lucide-react"
import { ProductDetailClient } from "./product-detail-client"
import { ProductReviews } from "./product-reviews"
import { products, getProductBySlug, getReviewsForProduct } from "@/lib/data"

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) return { title: "Product not found" }
  return {
    title: `${product.name} — AIS Frozen Food`,
    description: product.shortDescription,
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) notFound()

  const productReviews = getReviewsForProduct(product.id)
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="flex items-center gap-1 text-xs text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/products" className="hover:text-foreground">
          Products
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/products?category=${product.category}`} className="capitalize hover:text-foreground">
          {product.category}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="truncate text-foreground">{product.name}</span>
      </nav>

      <ProductDetailClient product={product} />

      {/* Info strip */}
      <div className="mt-12 grid gap-4 rounded-2xl border border-border bg-secondary/40 p-6 sm:grid-cols-3">
        <InfoChip
          icon={<Snowflake className="h-5 w-5" />}
          title="Storage"
          description={product.storage}
        />
        <InfoChip
          icon={<ShieldCheck className="h-5 w-5" />}
          title="Expiry"
          description={product.expiry}
        />
        <InfoChip
          icon={<Truck className="h-5 w-5" />}
          title="Delivery"
          description="Same-day in Bandung. Cold-chain shipping nationwide."
        />
      </div>

      <ProductReviews reviews={productReviews} rating={product.rating} reviewCount={product.reviewCount} />

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            You might also like
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <div className="aspect-square overflow-hidden rounded-xl bg-secondary">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.images[0] || "/placeholder.svg"}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div>
                  <p className="line-clamp-1 font-display text-sm font-semibold text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.weight}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function InfoChip({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </span>
      <div>
        <p className="font-display text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
