import { createClient } from "./server"

export async function getAdminDashboardData() {
  const supabase = await createClient()

  const [
    ordersResult,
    productsResult,
    usersResult,
  ] = await Promise.all([
    supabase
      .from("orders")
      .select(`
        id,
        user_id,
        total,
        status,
        created_at,
        customer_name
      `)
      .order("created_at", { ascending: false }),

    supabase
      .from("products")
      .select(`
        id,
        name,
        price,
        stock,
        rating,
        review_count,
        status
      `)
      .eq("status", "active"),

    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true }),
  ])

  if (ordersResult.error) {
    throw ordersResult.error
  }

  if (productsResult.error) {
    throw productsResult.error
  }

  if (usersResult.error) {
    throw usersResult.error
  }

  const orders = ordersResult.data ?? []
  const products = productsResult.data ?? []

  const totalOrders = orders.length

  const totalSales = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((total, order) => total + Number(order.total ?? 0), 0)

  const completedOrders = orders.filter(
    (order) => order.status === "completed"
  ).length

  const lowStockProducts = products.filter(
    (product) => Number(product.stock ?? 0) < 40
  ).length

  const recentOrders = orders.slice(0, 5)

  const topProducts = [...products]
    .sort(
      (a, b) =>
        Number(b.review_count ?? 0) -
        Number(a.review_count ?? 0)
    )
    .slice(0, 5)

  return {
    totalOrders,
    totalSales,
    totalProducts: products.length,
    totalUsers: usersResult.count ?? 0,
    completedOrders,
    lowStockProducts,
    recentOrders,
    topProducts,
  }
}


export async function getAdminSalesChartData() {
  const supabase = await createClient()

  const thirtyDaysAgo = new Date()

  thirtyDaysAgo.setDate(
    thirtyDaysAgo.getDate() - 29
  )

  const { data, error } = await supabase
    .from("orders")
    .select("total, created_at, status")
    .gte(
      "created_at",
      thirtyDaysAgo.toISOString()
    )
    .neq("status", "cancelled")
    .order("created_at", {
      ascending: true,
    })

  if (error) {
    throw error
  }

  const salesByDate: Record<
    string,
    number
  > = {}

  for (const order of data ?? []) {
    const date = new Date(
      order.created_at
    )
      .toISOString()
      .split("T")[0]

    salesByDate[date] =
      (salesByDate[date] ?? 0) +
      Number(order.total)
  }

  return Object.entries(
    salesByDate
  ).map(([date, sales]) => ({
    date,
    sales,
  }))
}