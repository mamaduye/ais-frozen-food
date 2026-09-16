import Image from "next/image"
import Link from "next/link"
import { getCategoriesWithImages } from "@/lib/supabase/categories"
import {
  ArrowRight,
  Snowflake,
  ShieldCheck,
  Truck,
  Star,
  ShoppingCart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { getHomepageReviews } from "@/lib/supabase/reviews"
import { getProducts } from "@/lib/supabase/products"
import type { Metadata } from "next"
import { ReviewCarousel } from "@/components/review-carousel"
import { HeroDynamicText } from "@/components/hero-dynamic-text"
import { getHomepageStats } from "@/lib/supabase/homepage"
import { formatRupiah } from "@/lib/data"

export const metadata: Metadata = {
  title: "Beranda",
  description:
    "AIS Frozen Food menyediakan aneka frozen food berkualitas seperti nugget, dimsum, cireng, sosis, dan camilan beku lainnya dengan pemesanan mudah dan pengiriman cepat.",
}


export const revalidate = 3600
export default async function HomePage() {
    const [
    categories,
    products,
    testimonials,
    homepageStats,
  ] = await Promise.all([
    getCategoriesWithImages(),
    getProducts(),
    getHomepageReviews(),
    getHomepageStats(),
  ])

  const featured = products.filter(
    (product) => product.featured,
  )

  const bestSeller = [...products]
  .filter(
    (product) =>
      product.status === "active",
  )
  .sort((a, b) => {
    const reviewDifference =
      Number(b.reviewCount ?? 0) -
      Number(a.reviewCount ?? 0)

    if (reviewDifference !== 0) {
      return reviewDifference
    }

    return (
      Number(b.rating ?? 0) -
      Number(a.rating ?? 0)
    )
  })[0]
  
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-secondary/60 via-background to-background" />

        <div className="relative container-max grid w-full gap-12 px-4 py-12 sm:px-6 md:py-20 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:px-8">
          {/* LEFT */}
          <div className="flex flex-col gap-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
              <Snowflake className="h-3.5 w-3.5 text-primary" />
              Disimpan pada suhu -18°C · Cold-chain delivery
            </span>

            <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-foreground sm:text-5xl lg:text-6xl">
              <HeroDynamicText />

              <span className="mt-3 block">
                <span className="text-primary">
                  AIS Frozen Food
                </span>{" "}
                ajaa...
              </span>
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Dimsum, sosis, camilan, dan frozen food favorit siap jadi stok di rumah.
              Tinggal masak saat lapar datang.
            </p>

            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              <Button
                asChild
                className="button-mobile justify-center sm:button-auto"
              >
                <Link href="/cart">
                  <ShoppingCart className="h-4 w-4" />
                  Lihat keranjang
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="button-mobile justify-center sm:button-auto"
              >
                <Link href="#categories">
                  Jelajahi kategori
                </Link>
              </Button>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-6 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-muted-foreground">
                  Pelanggan terdaftar
                </dt>

                <dd className="mt-1 font-display text-2xl font-semibold text-foreground">
                  {homepageStats.totalCustomers}
                </dd>
              </div>

              <div>
                <dt className="text-muted-foreground">
                  Rating rata-rata
                </dt>

                <dd className="mt-1 flex items-center gap-1 font-display text-2xl font-semibold text-foreground">
                  {homepageStats.averageRating > 0
                    ? homepageStats.averageRating.toFixed(1)
                    : "-"}

                  {homepageStats.averageRating > 0 && (
                    <Star className="h-4 w-4 fill-primary text-primary" />
                  )}
                </dd>
              </div>

              <div>
                <dt className="text-muted-foreground">
                  Jumlah pesanan
                </dt>

                <dd className="mt-1 font-display text-2xl font-semibold text-foreground">
                  {homepageStats.totalOrders}{" "}
                  <span className="text-base font-medium text-muted-foreground">
                    pesanan
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          {/* RIGHT */}
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-secondary shadow-xl shadow-primary/5 sm:aspect-[4/4]">
              <Image
                src="/hero-frozen-food.webp"
                alt="Assorted premium frozen food on a soft icy blue surface"
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>

            {bestSeller && (
              <div className="absolute -bottom-4 -left-4 hidden w-60 rounded-2xl border border-border bg-card/95 p-4 shadow-lg backdrop-blur sm:block">
                <p className="text-xs font-medium uppercase tracking-wider text-primary">
                  Favorit Pelanggan
                </p>

                <p className="mt-1 line-clamp-1 font-display font-semibold text-foreground">
                  {bestSeller.name}
                </p>

                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-foreground">
                    {formatRupiah(bestSeller.price)}
                  </p>

                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3.5 w-3.5 fill-primary text-primary" />

                    <span>
                      {Number(bestSeller.rating ?? 0).toFixed(1)}
                    </span>

                    <span>
                      ({bestSeller.reviewCount ?? 0})
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-y border-border bg-secondary/30">
        <div className="container-max grid w-full gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:px-8">
          <TrustBadge
            icon={<Snowflake className="h-5 w-5" />}
            title="Cold-chain protected"
            description="Dikemas dalam kotak berinsulasi untuk pengiriman ke mana pun."
          />
          <TrustBadge
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Halal & aman dikonsumsi"
            description="Bersertifikat halal & terjamin kebersihannya."
          />
          <TrustBadge
            icon={<Truck className="h-5 w-5" />}
            title="Pengiriman pada hari yang sama"
            description="Pesan sebelum pukul 14.00 untuk pengiriman di hari yang sama."
          />
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="container-max w-full px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-primary">Jelajahi kategori</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Kategori Populer
            </h2>
          </div>
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/products">
              Lihat semua
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/products?category=${c.slug}`}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-4 text-center transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <div className="relative h-20 w-20 overflow-hidden rounded-full bg-secondary">
                <Image
                  src={c.image || "/placeholder.svg"}
                  alt={c.name}
                  fill
                  sizes="80px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <p className="font-display text-sm font-semibold text-foreground">{c.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="container-max w-full px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-primary">Produk unggulan</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Produk Pilihan
            </h2>
          </div>
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/products">
              Lihat semua
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Promo banner */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-accent px-6 py-12 text-accent-foreground sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-primary/30 blur-3xl" />
          <div className="pointer-events-none absolute -left-10 bottom-0 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative grid items-center gap-6 sm:grid-cols-[1.6fr_1fr]">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground/80">
                PROMO
              </p>
              <h3 className="mt-2 font-display text-3xl font-semibold leading-tight sm:text-4xl">
                Dapatkan <span className="text-primary">diskon 15%</span> untuk semua produk
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-accent-foreground/80">
                Gunakan kode <span className="rounded bg-background/15 px-1.5 py-0.5 font-mono text-xs">FROZEN15</span> saat
                checkout. Pengiriman gratis untuk pesanan di atas Rp 200.000 di Pati.
              </p>
            </div>
            <div className="flex sm:justify-end">
              <Button asChild size="lg" variant="secondary">
                <Link href="/products">
                  Dapatkan diskon
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-medium text-primary">
            Testimoni Pelanggan
          </p>

          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Apa kata pelanggan kami
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Pengalaman nyata dari pelanggan yang telah mencoba produk AIS Frozen Food.
          </p>
        </div>

        <div className="mt-10">
          <ReviewCarousel reviews={testimonials} />
        </div>
      </section>
    </>
  )
}

function TrustBadge({
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
