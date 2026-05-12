"use client"

import { useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Search, SlidersHorizontal } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { Input } from "@/components/ui/input"
import { categories, products } from "@/lib/data"
import { cn } from "@/lib/utils"

export function ProductsClient() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get("category") ?? "all"
  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<"featured" | "price-asc" | "price-desc" | "rating">(
    "featured",
  )

  const filtered = useMemo(() => {
    let list = [...products]
    if (activeCategory !== "all") {
      list = list.filter((p) => p.category === activeCategory)
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      )
    }
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        list.sort((a, b) => b.price - a.price)
        break
      case "rating":
        list.sort((a, b) => b.rating - a.rating)
        break
      case "featured":
      default:
        list.sort((a, b) => Number(!!b.featured) - Number(!!a.featured))
    }
    return list
  }, [activeCategory, query, sort])

  return (
    <div className="container-max w-full px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Products</p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            All frozen goodness in one place
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Filter by category, search by name, or sort by what matters most to you.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search nuggets, dimsum, sosis…"
              className="pl-9"
              aria-label="Search products"
            />
          </div>
          <div className="relative">
            <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="h-9 rounded-md border border-input bg-background pl-9 pr-3 text-sm shadow-xs focus-visible:outline-2 focus-visible:outline-ring"
              aria-label="Sort products"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="rating">Top rated</option>
            </select>
          </div>
        </div>
      </header>

      <div className="mt-6 -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        <CategoryChip
          label="All"
          active={activeCategory === "all"}
          onClick={() => setActiveCategory("all")}
          count={products.length}
        />
        {categories.map((c) => (
          <CategoryChip
            key={c.id}
            label={c.name}
            active={activeCategory === c.slug}
            onClick={() => setActiveCategory(c.slug)}
            count={products.filter((p) => p.category === c.slug).length}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="font-display text-lg font-semibold text-foreground">No products match your filters</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try clearing the search or pick another category.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}

function CategoryChip({
  label,
  active,
  onClick,
  count,
}: {
  label: string
  active: boolean
  onClick: () => void
  count: number
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-foreground hover:border-primary/40",
      )}
    >
      {label}
      <span
        className={cn(
          "rounded-full px-1.5 py-0.5 text-[11px] font-semibold",
          active ? "bg-primary-foreground/15 text-primary-foreground" : "bg-secondary text-muted-foreground",
        )}
      >
        {count}
      </span>
    </button>
  )
}
