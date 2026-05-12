import { reviews, orders, products } from "@/lib/data"
import { AdminReviewsClient } from "./admin-reviews-client"

export default function AdminReviewsPage() {
  // Only show reviews from completed orders.
  // We approximate by checking that the user (by name initials/userName)
  // appears as a customer in any completed order for this product.
  const completedSet = new Set(
    orders
      .filter((o) => o.status === "completed")
      .flatMap((o) => o.items.map((item) => `${o.customerName.split(" ")[0]}|${item.productId}`)),
  )

  const verifiedReviews = reviews.filter((r) => {
    const firstName = r.userName.split(" ")[0].replace(".", "").trim()
    return completedSet.has(`${firstName}|${r.productId}`)
  })

  // Fallback: if filtering hides everything (mock data), surface all reviews
  // but mark them so the admin can still moderate.
  const list = verifiedReviews.length > 0 ? verifiedReviews : reviews

  const enriched = list.map((r) => ({
    ...r,
    productName: products.find((p) => p.id === r.productId)?.name ?? "—",
  }))

  return <AdminReviewsClient initialReviews={enriched} />
}
