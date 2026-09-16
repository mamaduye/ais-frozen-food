import { createClient } from "./server"

export async function getAdminReviews() {
  const supabase = await createClient()

  const { data: reviews, error: reviewsError } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false })

  if (reviewsError) {
    console.error("REVIEWS ERROR:", reviewsError)
    throw reviewsError
  }

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("*")

  if (profilesError) {
    console.error("PROFILES ERROR:", profilesError)
    throw profilesError
  }

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, name")

  if (productsError) {
    console.error("PRODUCTS ERROR:", productsError)
    throw productsError
  }

  return reviews.map((review) => {
    const profile = profiles.find(
      (profile) => profile.id === review.user_id
    )

    const product = products.find(
      (product) => product.id === review.product_id
    )

    const userName =
      profile?.name ??
      profile?.full_name ??
      profile?.username ??
      "Unknown User"

    return {
      id: review.id,
      productId: review.product_id,
      userId: review.user_id,
      userName,
      userInitials: userName
        .split(" ")
        .map((word: string) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),

      rating: review.rating,
      comment: review.comment,
      orderId: review.order_id,
      verified: review.verified,
      isHidden: review.is_hidden,
      createdAt: review.created_at,
      updatedAt: review.updated_at,

      productName: product?.name ?? "Unknown Product",
    }
  })
}

export async function createReview({
  userId,
  orderId,
  productId,
  rating,
  comment,
}: {
  userId: string
  orderId: string
  productId: string
  rating: number
  comment: string
}) {
  const supabase = await createClient()

  // Cek apakah review sudah pernah dibuat
  const { data: existingReview, error: existingError } = await supabase
    .from("reviews")
    .select("id")
    .eq("user_id", userId)
    .eq("order_id", orderId)
    .eq("product_id", productId)
    .maybeSingle()

  if (existingError) {
    console.error("CHECK EXISTING REVIEW ERROR:", existingError)
    throw existingError
  }

  if (existingReview) {
    throw new Error("REVIEW_ALREADY_EXISTS")
  }

  const { data, error } = await supabase
    .from("reviews")
    .insert({
        user_id: userId,
        order_id: orderId,
        product_id: productId,
        rating,
        comment,
        verified: true,
        is_hidden: false,
    })
    .select()
    .single()

    if (error) {
    console.error("CREATE REVIEW ERROR:", error)
    throw error
    }
    const { data: productReviews, error: ratingError } = await supabase
  .from("reviews")
  .select("rating")
  .eq("product_id", productId)
  .eq("verified", true)
  .eq("is_hidden", false)

if (ratingError) {
  console.error("UPDATE PRODUCT RATING ERROR:", ratingError)
  throw ratingError
}

const reviewCount = productReviews.length

const averageRating =
  reviewCount > 0
    ? productReviews.reduce(
        (sum, review) => sum + Number(review.rating),
        0,
      ) / reviewCount
    : 0

const { error: updateProductError } = await supabase
    .from("products")
    .update({
        rating: Number(averageRating.toFixed(2)),
        review_count: reviewCount,
    })
    .eq("id", productId)

    if (updateProductError) {
    console.error("UPDATE PRODUCT RATING ERROR:", updateProductError)
    throw updateProductError
    }

    return data
}

export async function getExistingReview({
  userId,
  orderId,
  productId,
}: {
  userId: string
  orderId: string
  productId: string
}) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("reviews")
    .select("id, rating, comment")
    .eq("user_id", userId)
    .eq("order_id", orderId)
    .eq("product_id", productId)
    .maybeSingle()

  if (error) {
    console.error("GET EXISTING REVIEW ERROR:", error)
    throw error
  }

  return data
}

export async function getHomepageReviews() {
  const supabase = await createClient()

  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("verified", true)
    .eq("is_hidden", false)
    .order("created_at", { ascending: false })
    .limit(3)

  if (error) {
    console.error("GET HOMEPAGE REVIEWS ERROR:", error)
    throw error
  }

  if (!reviews || reviews.length === 0) {
    return []
  }

  const userIds = reviews.map((review) => review.user_id)
  const productIds = reviews.map((review) => review.product_id)

  const [{ data: profiles }, { data: products }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", userIds),

    supabase
      .from("products")
      .select("id, name")
      .in("id", productIds),
  ])

  return reviews.map((review) => {
    const profile = profiles?.find(
      (profile) => profile.id === review.user_id
    )

    const product = products?.find(
      (product) => product.id === review.product_id
    )

    const userName = profile?.full_name ?? "Pelanggan AIS Frozen Food"

    return {
      id: review.id,
      userName,
      userInitials: userName
        .split(" ")
        .map((word: any[]) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      rating: review.rating,
      comment: review.comment,
      productName: product?.name ?? "Produk AIS Frozen Food",
      createdAt: review.created_at,
    }
  })
}

export async function getProductReviews(productId: string) {
  const supabase = await createClient()

  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .eq("verified", true)
    .eq("is_hidden", false)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("GET PRODUCT REVIEWS ERROR:", error)
    throw error
  }

  if (!reviews || reviews.length === 0) {
    return []
  }

  const userIds = reviews.map((review) => review.user_id)

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", userIds)

  if (profilesError) {
    console.error("GET REVIEW PROFILES ERROR:", profilesError)
    throw profilesError
  }

  return reviews.map((review) => {
    const profile = profiles?.find(
      (profile) => profile.id === review.user_id
    )

    const userName =
      profile?.full_name ?? "Pelanggan AIS Frozen Food"

    return {
      id: review.id,
      productId: review.product_id,
      userId: review.user_id,
      userName,
      userInitials: userName
        .split(" ")
        .map((word: string[]) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      rating: review.rating,
      comment: review.comment,
      orderId: review.order_id,
      verified: review.verified,
      isHidden: review.is_hidden,
      createdAt: review.created_at,
      updatedAt: review.updated_at,
    }
  })
}