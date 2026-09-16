import { createAdminClient } from "./admin"
import { createClient } from "./server"
import { requireAdmin } from "./admin-auth"

export type AdminNotificationCounts = {
  users: number
  orders: number
  reviews: number
}

type NotificationCategory =
  | "users"
  | "reviews"

// ============================================================
// CURRENT ADMIN USER
// ============================================================

async function getCurrentAdminUser() {
  await requireAdmin()

  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error(
      "Sesi administrator tidak ditemukan.",
    )
  }

  return user
}

// ============================================================
// GET NOTIFICATION COUNTS
// ============================================================

export async function getAdminNotificationCounts(): Promise<AdminNotificationCounts> {
  const user = await getCurrentAdminUser()

  const supabase = createAdminClient()

  // ==========================================================
  // GET / CREATE NOTIFICATION STATE
  // ==========================================================

  let {
    data: state,
    error: stateError,
  } = await supabase
    .from("admin_notification_state")
    .select(`
      last_seen_users,
      last_seen_reviews
    `)
    .eq("user_id", user.id)
    .maybeSingle()

  if (stateError) {
    console.error(
      "GET ADMIN NOTIFICATION STATE ERROR:",
      stateError,
    )

    throw stateError
  }

  if (!state) {
    const {
      data: createdState,
      error: createError,
    } = await supabase
      .from("admin_notification_state")
      .insert({
        user_id: user.id,
      })
      .select(`
        last_seen_users,
        last_seen_reviews
      `)
      .single()

    if (createError) {
      console.error(
        "CREATE ADMIN NOTIFICATION STATE ERROR:",
        createError,
      )

      throw createError
    }

    state = createdState
  }

  // ==========================================================
  // USERS
  // User baru yang belum dilihat admin
  // ==========================================================

  const usersQuery = supabase
    .from("profiles")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("role", "customer")
    .gt(
      "created_at",
      state.last_seen_users,
    )

  // ==========================================================
  // ORDERS
  // Order yang masih membutuhkan tindakan admin
  //
  // - status = pending
  // - ATAU payment_status = waiting_verification
  // ==========================================================

  const ordersQuery = supabase
    .from("orders")
    .select("id", {
        count: "exact",
        head: true,
    })
    .eq("status", "pending")

  // ==========================================================
  // REVIEWS
  // Review baru yang belum dilihat admin
  // ==========================================================

  const reviewsQuery = supabase
    .from("reviews")
    .select("id", {
      count: "exact",
      head: true,
    })
    .gt(
      "created_at",
      state.last_seen_reviews,
    )

  const [
    usersResult,
    ordersResult,
    reviewsResult,
  ] = await Promise.all([
    usersQuery,
    ordersQuery,
    reviewsQuery,
  ])

  if (usersResult.error) {
    console.error(
      "GET NEW USERS COUNT ERROR:",
      usersResult.error,
    )

    throw usersResult.error
  }

  if (ordersResult.error) {
    console.error(
      "GET ACTIONABLE ORDERS COUNT ERROR:",
      ordersResult.error,
    )

    throw ordersResult.error
  }

  if (reviewsResult.error) {
    console.error(
      "GET NEW REVIEWS COUNT ERROR:",
      reviewsResult.error,
    )

    throw reviewsResult.error
  }

  return {
    users: usersResult.count ?? 0,
    orders: ordersResult.count ?? 0,
    reviews: reviewsResult.count ?? 0,
  }
}

// ============================================================
// MARK USERS / REVIEWS AS SEEN
// ============================================================

export async function markAdminNotificationsSeen(
  category: NotificationCategory,
) {
  const user = await getCurrentAdminUser()

  const supabase = createAdminClient()

  const now = new Date().toISOString()

  const columnMap = {
    users: "last_seen_users",
    reviews: "last_seen_reviews",
  } as const

  const column = columnMap[category]

  const { error } = await supabase
    .from("admin_notification_state")
    .upsert(
      {
        user_id: user.id,
        [column]: now,
        updated_at: now,
      },
      {
        onConflict: "user_id",
      },
    )

  if (error) {
    console.error(
      "MARK ADMIN NOTIFICATION SEEN ERROR:",
      error,
    )

    throw error
  }
}