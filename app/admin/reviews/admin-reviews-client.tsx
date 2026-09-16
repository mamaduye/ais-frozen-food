"use client"

import { useState } from "react"
import { Eye, EyeOff, Star, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Review } from "@/lib/types"
import {
  toggleReviewVisibility,
  deleteReview,
} from "./action"

type EnrichedReview = Review & { productName: string }

export function AdminReviewsClient({ initialReviews }: { initialReviews: EnrichedReview[] }) {
  const [items, setItems] = useState(initialReviews)

  async function toggleHide(id: string, currentHidden: boolean) {
    try {
      const nextHidden = !currentHidden

      await toggleReviewVisibility(id, nextHidden)

      setItems((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, isHidden: nextHidden }
            : r
        )
      )
    } catch (error) {
      console.error(error)
      alert("Gagal mengubah status review")
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this review? This cannot be undone.")) {
      return
    }

    try {
      await deleteReview(id)

      setItems((prev) => prev.filter((r) => r.id !== id))
    } catch (error) {
      console.error(error)
      alert("Gagal menghapus review")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-Display text-3xl">Ulasan</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ulasan pelanggan yang dikirimkan melalui toko. Anda dapat menyembunyikan atau menghapus ulasan dari sini.
        </p>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Tidak ada ulasan.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {items.map((r) => (
            <Card key={r.id} className={r.isHidden ? "opacity-60" : ""}>
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
                        {r.isHidden ? (
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
                          {new Date(r.createdAt).toLocaleDateString("id-ID", {
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
                    <Button variant="outline" size="sm" onClick={() => toggleHide(r.id, r.isHidden)}>
                      {r.isHidden ? (
                        <>
                          <Eye className="mr-1.5 h-4 w-4" /> Perlihatkan
                        </>
                      ) : (
                        <>
                          <EyeOff className="mr-1.5 h-4 w-4" /> Sembunyikan
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => remove(r.id)}
                      className="
                          text-destructive
                          hover:bg-destructive
                        hover:text-white
                          hover:scale-105
                          transition-all
                          duration-200
                        "
                    >
                      <Trash2 className="mr-1.5 h-4 w-4" /> Hapus
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
