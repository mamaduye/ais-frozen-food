"use client"

import { useState } from "react"
import { Star, ChevronDown, ChevronUp } from "lucide-react"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { Button } from "@/components/ui/button"
import type { Review } from "@/lib/types"

export function ProductReviews({
  reviews,
  rating,
  reviewCount,
}: {
  reviews: Review[]
  rating: number
  reviewCount: number
}) {
  const [showAll, setShowAll] = useState(false)

  const visibleReviews = showAll ? reviews : reviews.slice(0, 3)

  return (
    <section className="mt-16">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Ulasan Pelanggan
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Apa kata pelanggan tentang produk ini? Lihat ulasan mereka di bawah ini.
          </p>
        </div>

        <div className="flex w-fit items-center gap-3 rounded-2xl bg-secondary/60 px-4 py-3">
          <span className="font-display text-3xl font-semibold text-foreground">
            {rating.toFixed(1)}
          </span>

          <div>
            <div className="flex items-center text-primary">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={
                    i < Math.round(rating)
                      ? "h-4 w-4 fill-primary text-primary"
                      : "h-4 w-4 text-muted"
                  }
                />
              ))}
            </div>

            <p className="text-xs text-muted-foreground">
              berdasarkan {reviewCount} ulasan
            </p>
          </div>
        </div>
      </header>

      {reviews.length === 0 ? (
        <Empty className="mt-6">
          <EmptyHeader>
            <EmptyTitle>Tidak ada ulasan</EmptyTitle>

            <EmptyDescription>
              Ulasan pelanggan akan muncul di sini setelah mereka membeli produk ini.
            </EmptyDescription>
          </EmptyHeader>

          <EmptyContent />
        </Empty>
      ) : (
        <>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {visibleReviews.map((r) => (
              <li
                key={r.id}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary font-display text-sm font-semibold text-accent">
                    {r.userInitials}
                  </span>

                  <div>
                    <p className="font-display text-sm font-semibold text-foreground">
                      {r.userName}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center text-primary">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={
                              i < r.rating
                                ? "h-3 w-3 fill-primary text-primary"
                                : "h-3 w-3 text-muted"
                            }
                          />
                        ))}
                      </span>

                      <span>·</span>

                      <span>
                        {new Date(r.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-foreground">
                  {r.comment}
                </p>
              </li>
            ))}
          </ul>

          {reviews.length > 3 && (
            <div className="mt-6 flex justify-center">
              <Button
                variant="outline"
                onClick={() => setShowAll((prev) => !prev)}
                className="gap-2"
              >
                {showAll ? (
                  <>
                    Sembunyikan ulasan
                    <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Lihat semua {reviews.length} ulasan
                    <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  )
}