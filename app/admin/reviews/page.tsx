import { getAdminReviews } from "@/lib/supabase/reviews"
import { markAdminNotificationsSeen } from "@/lib/supabase/admin-notifications"
import { AdminReviewsClient } from "./admin-reviews-client"

export default async function AdminReviewsPage() {
  const reviews = await getAdminReviews()

  await markAdminNotificationsSeen("reviews")

  return (
    <AdminReviewsClient initialReviews={reviews} />
  )
}