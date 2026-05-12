"use client"

import { useState } from "react"
import { Eye, EyeOff, Star, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Review } from "@/lib/types"

type EnrichedReview = Review & { productName: string }

export function AdminReviewsClient({ initialReviews }: { initialReviews: EnrichedReview[] }) {
  const [items, setItems] = useState(
    initialReviews.map((r) => ({ ...r, hidden: false })),
  )

  function toggleHide(id: string) {
    setItems((prev) =>
      prev.map((r) => (r.id === id ? { ...r, hidden: !r.hidden } : r)),
    )
  }

  function remove(id: string) {
    if (confirm("Delete this review? This cannot be undone.")) {
      setItems((prev) => prev.filter((r) => r.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl">Reviews</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Reviews from customers with completed orders. Hide or delete inappropriate content.
        </p>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No reviews yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {items.map((r) => (
            <Card key={r.id} className={r.hidden ? "opacity-60" : ""}>
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {r.userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{r.userName}</span>
                        <Badge variant="secondary" className="text-xs">
                          {r.productName}
                        </Badge>
                        {r.hidden ? (
                          <Badge variant="outline" className="text-xs text-muted-foreground">
                            Hidden
                          </Badge>
                        ) : null}
                      </div>
                      <div className="mt-1 flex items-center gap-1.5">
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < r.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-muted-foreground/30"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(r.date).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {r.comment}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => toggleHide(r.id)}>
                      {r.hidden ? (
                        <>
                          <Eye className="mr-1.5 h-4 w-4" /> Show
                        </>
                      ) : (
                        <>
                          <EyeOff className="mr-1.5 h-4 w-4" /> Hide
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => remove(r.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="mr-1.5 h-4 w-4" /> Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
