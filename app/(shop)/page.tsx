import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Snowflake, ShieldCheck, Truck, Star, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { categories, products, reviews } from "@/lib/data"

export default function HomePage() {
  const featured = products.filter((p) => p.featured)
  const testimonials = reviews.filter((r) => r.rating >= 5).slice(0, 3)

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-secondary/60 via-background to-background" />
        <div className="relative container-max grid w-full gap-12 px-4 py-12 sm:px-6 md:py-20 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:px-8">
          <div className="flex flex-col gap-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
              <Snowflake className="h-3.5 w-3.5 text-primary" />
              Stored at -18°C · Cold-chain delivery
            </span>
            <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-foreground text-balance sm:text-5xl lg:text-6xl">
              Premium frozen snacks, <span className="text-primary">freshly delivered</span> to your home.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              From our freezer to your kitchen — crispy nuggets, juicy sausages, and restaurant-grade dimsum
              ready in minutes. Honest prices, careful packaging, and same-day pickup in Bandung.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              <Button asChild className="button-mobile justify-center sm:button-auto">
                <Link href="/products">
                  Shop now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild className="button-mobile justify-center sm:button-auto" variant="outline">
                <Link href="#categories">Browse categories</Link>
              </Button>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-6 sm:grid-cols-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Active customers</dt>
                <dd className="mt-1 font-display text-2xl font-semibold text-foreground">2,400+</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Avg. rating</dt>
                <dd className="mt-1 flex items-center gap-1 font-display text-2xl font-semibold text-foreground">
                  4.8 <Star className="h-4 w-4 fill-primary text-primary" />
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Same-day orders</dt>
                <dd className="mt-1 font-display text-2xl font-semibold text-foreground">120/day</dd>
              </div>
            </dl>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border bg-secondary shadow-xl shadow-primary/5 sm:aspect-[5/6]">
              <Image
                src="/hero-frozen-food.jpg"
                alt="Assorted premium frozen food on a soft icy blue surface"
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 hidden w-56 rounded-2xl border border-border bg-card p-4 shadow-lg sm:block">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Best seller</p>
              <p className="mt-1 font-display font-semibold text-foreground">Chicken Dimsum Mentai</p>
              <p className="mt-1 text-sm text-muted-foreground">Rp 42.000 · 4.9 stars</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-y border-border bg-secondary/30">
        <div className="container-max grid w-full gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:px-8">
          <TrustBadge
            icon={<Snowflake className="h-5 w-5" />}
            title="Cold-chain protected"
            description="Packaged in insulated boxes with dry ice for any distance."
          />
          <TrustBadge
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Halal & food-safe"
            description="Certified halal, made in our hygiene-controlled kitchen."
          />
          <TrustBadge
            icon={<Truck className="h-5 w-5" />}
            title="Same-day delivery"
            description="Order before 2 PM in Bandung for same-day arrival."
          />
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="container-max w-full px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-primary">Shop by category</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              What are you craving today?
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:inline-flex"
          >
            View all <ArrowRight className="ml-1 inline h-4 w-4" />
          </Link>
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
            <p className="text-sm font-medium text-primary">Featured products</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Customer favorites this month
            </h2>
          </div>
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/products">
              See all
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
                New customer special
              </p>
              <h3 className="mt-2 font-display text-3xl font-semibold leading-tight sm:text-4xl">
                Get 15% off your first order
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-accent-foreground/80">
                Use code <span className="rounded bg-background/15 px-1.5 py-0.5 font-mono text-xs">FROZEN15</span> at
                checkout. Free delivery for orders above Rp 200.000 in Bandung.
              </p>
            </div>
            <div className="flex sm:justify-end">
              <Button asChild size="lg" variant="secondary">
                <Link href="/products">
                  Claim offer
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
          <p className="text-sm font-medium text-primary">Loved by 2,400+ families</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            What our customers say
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.id}
              className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-6"
            >
              <Quote className="h-6 w-6 text-primary" aria-hidden />
              <blockquote className="flex-1 text-sm leading-relaxed text-foreground">
                {t.comment}
              </blockquote>
              <figcaption className="flex items-center gap-3 border-t border-border pt-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary font-display text-sm font-semibold text-accent">
                  {t.userInitials}
                </span>
                <div>
                  <p className="font-display text-sm font-semibold text-foreground">{t.userName}</p>
                  <div className="flex items-center gap-0.5 text-primary">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                    ))}
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
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
