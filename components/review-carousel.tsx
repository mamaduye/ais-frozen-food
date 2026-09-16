"use client"

import { Star, Quote } from "lucide-react"

type Review = {
  id: string
  userName: string
  userInitials: string
  rating: number
  comment: string
}

export function ReviewCarousel({
  reviews,
}: {
  reviews: Review[]
}) {
  if (!reviews.length) {
    return null
  }

  const duplicatedReviews = [...reviews, ...reviews]

  return (
  <div className="relative w-full overflow-hidden">
    <div className="flex w-max animate-review-scroll gap-5 hover:[animation-play-state:paused]">
      {duplicatedReviews.map((review, index) => (
        <article
          key={`${review.id}-${index}`}
          className="w-[300px] shrink-0 rounded-2xl border border-border bg-card p-6 sm:w-[360px]"
        >
          <Quote className="h-6 w-6 text-primary" />

          <p className="mt-4 min-h-[90px] text-sm leading-relaxed text-foreground">
            “{review.comment}”
          </p>

          <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {review.userInitials}
            </div>

            <div>
              <p className="text-sm font-semibold">
                {review.userName}
              </p>

              <div className="mt-1 flex gap-0.5">
                {Array.from({ length: review.rating }).map((_, index) => (
                  <Star
                    key={index}
                    className="h-3.5 w-3.5 fill-primary text-primary"
                  />
                ))}
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  </div>
)
}