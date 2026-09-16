import "server-only"

import { createAdminClient } from "./admin"

export async function getHomepageStats() {
  const supabase = createAdminClient()

  const [
    customersResult,
    ordersResult,
    productsResult,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("role", "customer"),

    supabase
      .from("orders")
      .select("id", {
        count: "exact",
        head: true,
      })
      .neq("status", "cancelled"),

    supabase
      .from("products")
      .select(`
        rating,
        review_count
      `)
      .eq("status", "active"),
  ])

  if (customersResult.error) {
    console.error(
      "GET HOMEPAGE CUSTOMERS COUNT ERROR:",
      customersResult.error,
    )
    throw customersResult.error
  }

  if (ordersResult.error) {
    console.error(
      "GET HOMEPAGE ORDERS COUNT ERROR:",
      ordersResult.error,
    )
    throw ordersResult.error
  }

  if (productsResult.error) {
    console.error(
      "GET HOMEPAGE PRODUCT RATINGS ERROR:",
      productsResult.error,
    )
    throw productsResult.error
  }

  const products = productsResult.data ?? []

  let totalRatingScore = 0
  let totalReviewCount = 0

  for (const product of products) {
    const rating = Number(product.rating ?? 0)
    const reviewCount = Number(
      product.review_count ?? 0,
    )

    if (rating > 0 && reviewCount > 0) {
      totalRatingScore +=
        rating * reviewCount

      totalReviewCount += reviewCount
    }
  }

  const averageRating =
    totalReviewCount > 0
      ? totalRatingScore /
        totalReviewCount
      : 0

  return {
    totalCustomers:
      customersResult.count ?? 0,

    totalOrders:
      ordersResult.count ?? 0,

    averageRating:
      Number(averageRating.toFixed(1)),
  }
}