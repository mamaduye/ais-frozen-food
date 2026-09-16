import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight, Snowflake, ShieldCheck, Truck } from "lucide-react"
import { ProductDetailClient } from "./product-detail-client"
import { ProductReviews } from "./product-reviews"
import { getProducts, getProductBySlug } from "@/lib/supabase/products"
import { getProductReviews } from "@/lib/supabase/reviews"
import Image from "next/image"

export const revalidate = 1800
export async function generateStaticParams() {
  const products = await getProducts()

  return products.map((p) => ({
    slug: p.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: "Product not found" }
  return {
    title: product.name,

    description: product.shortDescription,

    openGraph: {
      title: product.name,

      description: product.shortDescription,

      images: [
        {
          url: product.images[0],
        },
      ],
    },

    twitter: {
      card: "summary_large_image",

      title: product.name,

      description: product.shortDescription,

      images: [product.images[0]],
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  // Nanti
  const productReviews = await getProductReviews(product.id)

  const averageRating =
    productReviews.length > 0
      ? productReviews.reduce(
          (sum, review) => sum + review.rating,
          0
        ) / productReviews.length
      : 0
  const allProducts = await getProducts()

  const related = allProducts
    .filter(
      (p) =>
        p.categoryId === product.categoryId &&
        p.id !== product.id
    )
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
        <Link
          href={`/products?category=${product.categorySlug}`}
          className="capitalize hover:text-foreground"
        >
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
          title="Penyimpanan"
          description={product.storage}
        />
        <InfoChip
          icon={<ShieldCheck className="h-5 w-5" />}
          title="Kadaluarsa"
          description={product.expiry}
        />
        <InfoChip
          icon={<Truck className="h-5 w-5" />}
          title="Pengiriman"
          description="Pengiriman di hari yang sama di Pati. Pengiriman ke seluruh wilayah nasional."
        />
      </div>

      <ProductReviews
        reviews={productReviews}
        rating={averageRating}
        reviewCount={productReviews.length}
      />

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Anda mungkin juga suka
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <div className="relative aspect-square overflow-hidden rounded-xl bg-secondary">
                  <Image
                    src={p.images[0] || "/placeholder.svg"}
                    alt={p.name}
                    fill
                    sizes="150px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
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
