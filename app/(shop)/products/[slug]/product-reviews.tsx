import { Star } from "lucide-react"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
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
  return (
    <section className="mt-16">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Customer reviews
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            What real customers think after trying this product.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-secondary/60 px-4 py-3">
          <span className="font-display text-3xl font-semibold text-foreground">
            {rating.toFixed(1)}
          </span>
          <div>
            <div className="flex items-center text-primary">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={i < Math.round(rating) ? "h-4 w-4 fill-primary text-primary" : "h-4 w-4 text-muted"}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Based on {reviewCount} reviews</p>
          </div>
        </div>
      </header>

      {reviews.length === 0 ? (
        <Empty className="mt-6">
          <EmptyHeader>
            <EmptyTitle>No reviews yet</EmptyTitle>
            <EmptyDescription>
              Reviews can only be submitted after an order is marked completed.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent />
        </Empty>
      ) : (
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {reviews.map((r) => (
            <li
              key={r.id}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary font-display text-sm font-semibold text-accent">
                  {r.userInitials}
                </span>
                <div>
                  <p className="font-display text-sm font-semibold text-foreground">{r.userName}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center text-primary">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={
                            i < r.rating ? "h-3 w-3 fill-primary text-primary" : "h-3 w-3 text-muted"
                          }
                        />
                      ))}
                    </span>
                    <span>·</span>
                    <span>{new Date(r.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-foreground">{r.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
