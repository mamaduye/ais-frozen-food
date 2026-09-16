"use server"

import { createReview } from "@/lib/supabase/reviews"
import { revalidatePath } from "next/cache"

export async function createReviewAction({
  userId,
  productId,
  orderId,
  rating,
  comment,
}: {
  userId: string
  productId: string
  orderId: string
  rating: number
  comment: string
}) {
  try {
    const review = await createReview({
      userId,
      orderId,
      productId,
      rating,
      comment,
    })

    revalidatePath(`/orders/${orderId}`)
    revalidatePath("/")

    return {
      success: true,
      review,
    }
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "REVIEW_ALREADY_EXISTS"
    ) {
      return {
        success: false,
        error: "REVIEW_ALREADY_EXISTS",
      }
    }

    throw error
  }
}