import { supabase } from "./client"
import { createClient } from "./server"

// GANTI function getOrders() yang lama dengan ini
export async function getOrders(userId: string) {
  const supabase = await createClient()

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (ordersError) throw ordersError

  const { data: orderItems, error: itemsError } = await supabase
    .from("order_items")
    .select("*")

  if (itemsError) throw itemsError


  const { data: products, error: productsError } = await supabase
  .from("products")
  .select("id,name")

  if (productsError) throw productsError

  return orders.map((order) => ({
    id: order.id,
    orderNumber: order.order_number,
    status: order.status,
    paymentStatus: order.payment_status,
    paymentMethod: order.payment_method,
    paymentProof: order.payment_proof,
    paidAt: order.paid_at,
    date: order.created_at,
    total: Number(order.total),

    items: orderItems
      .filter((item) => item.order_id === order.id)
      .map((item) => {

        return {
          productId: item.product_id,
          quantity: item.quantity,
          price: Number(item.price),
          name:
            products.find((p) => p.id === item.product_id)?.name ??
            "Unknown Product",
      }}),
  }))
}

export async function getOrderById(
  userId: string,
  orderId: string,
) {
  const supabase = await createClient()

  // ============================================================
  // 1. Ambil order milik user yang sedang login
  // ============================================================
  const {
    data: order,
    error: orderError,
  } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("user_id", userId)
    .single()

  if (orderError || !order) {
    return null
  }

  // ============================================================
  // 2. Ambil item pesanan
  // ============================================================
  const {
    data: orderItems,
    error: itemsError,
  } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", order.id)

  if (itemsError) {
    throw itemsError
  }

  // ============================================================
  // 3. Ambil nama produk
  // ============================================================
  const productIds = [
    ...new Set(
      (orderItems ?? [])
        .map((item) => item.product_id)
        .filter(Boolean),
    ),
  ]

  let products: {
    id: string
    name: string
  }[] = []

  if (productIds.length > 0) {
    const {
      data: productData,
      error: productsError,
    } = await supabase
      .from("products")
      .select("id, name")
      .in("id", productIds)

    if (productsError) {
      throw productsError
    }

    products = productData ?? []
  }

  // ============================================================
  // 4. Mapping data untuk detail order / invoice
  // ============================================================
  return {
    id: order.id,
    orderNumber: order.order_number,

    status: order.status,
    paymentStatus: order.payment_status,
    paymentMethod: order.payment_method,

    paymentProof: order.payment_proof,
    paidAt: order.paid_at,

    customerName: order.customer_name,
    customerPhone: order.phone,
    address: order.address,

    date: order.created_at,

    subtotal: Number(order.subtotal ?? 0),
    shipping: Number(order.shipping ?? 0),
    total: Number(order.total ?? 0),

    items: (orderItems ?? []).map((item) => ({
      productId: item.product_id,
      quantity: Number(item.quantity),
      price: Number(item.price),

      name:
        products.find(
          (product) =>
            product.id === item.product_id,
        )?.name ?? "Produk",
    })),
  }
}

