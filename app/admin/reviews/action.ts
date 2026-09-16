"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function toggleReviewVisibility(
  reviewId: string,
  isHidden: boolean
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("reviews")
    .update({
      is_hidden: isHidden,
      updated_at: new Date().toISOString(),
    })
    .eq("id", reviewId)

  if (error) {
    console.error("TOGGLE REVIEW VISIBILITY ERROR:", error)
    throw error
  }

  revalidatePath("/admin/reviews")
  revalidatePath("/")

  return { success: true }
}

export async function deleteReview(reviewId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", reviewId)

  if (error) {
    console.error("DELETE REVIEW ERROR:", error)
    throw error
  }

  revalidatePath("/admin/reviews")
  revalidatePath("/")

  return { success: true }
}