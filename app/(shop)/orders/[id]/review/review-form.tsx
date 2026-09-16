"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Star, Send } from "lucide-react"
import { toast } from "sonner"

import { createReviewAction } from "./action"

type ReviewFormProps = {
  userId: string
  orderId: string
  productId: string
  productName: string
}

export function ReviewForm({
  userId,
  orderId,
  productId,
  productName,
}: ReviewFormProps) {
  const router = useRouter()

  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault()

    if (!comment.trim()) {
      toast.error("Tulis komentar terlebih dahulu")
      return
    }

    try {
      setLoading(true)

      const result = await createReviewAction({
        userId,
        orderId,
        productId,
        rating,
        comment,
      })

      if (!result.success) {
        if (result.error === "REVIEW_ALREADY_EXISTS") {
          toast.error("Kamu sudah memberikan ulasan untuk produk ini")
          return
        }

        toast.error("Gagal mengirim ulasan")
        return
      }

      toast.success("Ulasan berhasil dikirim")

      router.push(`/orders/${orderId}`)
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error("Gagal mengirim ulasan")
    } finally {
      setLoading(false)
    }
  }

  const displayedRating = hoverRating || rating

  return (
    <form
      onSubmit={handleSubmit}
      className="group overflow-hidden rounded-2xl border bg-background shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
    >
      {/* Product Header */}
      <div className="border-b bg-gradient-to-r from-primary/5 via-background to-primary/5 px-6 py-5">
        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Produk yang kamu beli
        </p>

        <h2 className="font-display text-xl font-semibold">
          {productName}
        </h2>
      </div>

      {/* Form Content */}
      <div className="space-y-6 p-6">

        {/* Rating */}
        <div>
          <p className="text-sm font-semibold">
            Bagaimana pengalamanmu?
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Pilih rating sesuai pengalamanmu dengan produk ini.
          </p>

          <div
            className="mt-4 flex items-center gap-2"
            onMouseLeave={() => setHoverRating(0)}
          >
            {[1, 2, 3, 4, 5].map((star) => {
              const active = star <= displayedRating

              return (
                <button
                  key={star}
                  type="button"
                  aria-label={`Beri rating ${star} bintang`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  className="rounded-full p-1 transition-transform duration-200 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <Star
                    className={`h-8 w-8 transition-all duration-200 ${
                      active
                        ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                        : "text-muted-foreground/30"
                    }`}
                  />
                </button>
              )
            })}
          </div>

          <p className="mt-2 text-sm font-medium text-amber-600">
            {displayedRating === 5 && "Sangat puas ⭐"}
            {displayedRating === 4 && "Puas 😊"}
            {displayedRating === 3 && "Cukup baik 🙂"}
            {displayedRating === 2 && "Kurang puas 😕"}
            {displayedRating === 1 && "Sangat kurang 😞"}
          </p>
        </div>

        {/* Comment */}
        <div>
          <label
            htmlFor={`comment-${productId}`}
            className="text-sm font-semibold"
          >
            Ceritakan pengalamanmu
          </label>

          <textarea
            id={`comment-${productId}`}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Contoh: Rasanya enak, packing rapi, dan produk masih beku ketika sampai..."
            className="mt-2 min-h-32 w-full resize-none rounded-xl border bg-muted/20 p-4 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10"
          />

          <p className="mt-2 text-xs text-muted-foreground">
            {comment.length}/500 karakter
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 disabled:pointer-events-none disabled:opacity-50"
        >
          <Send className="h-4 w-4" />

          {loading ? "Mengirim ulasan..." : "Kirim Ulasan"}
        </button>

      </div>
    </form>
  )
}