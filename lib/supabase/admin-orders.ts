import { OrderStatus } from "../types"
import { createAdminClient } from "./admin"
import { requireAdmin } from "./admin-auth"

// fungsi untuk mengambil detail order berdasarkan id untuk admin
export async function getAdminOrderById(
  orderId: string
) {
  await requireAdmin()

const supabase = createAdminClient()
  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single()

  if (error) throw error

  const { data: orderItems, error: itemsError } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", order.id)

  if (itemsError) throw itemsError

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, name")

  if (productsError) throw productsError

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", order.user_id)
    .single()

  if (profileError) throw profileError

  return {
    id: order.id,
    orderNumber: order.order_number,
    status: order.status,
    paymentStatus: order.payment_status,
    paymentProof: order.payment_proof,
    paidAt: order.paid_at,
    date: order.created_at,
    total: Number(order.total),

    customerName: order.customer_name,
    customerEmail: profile.email,
    customerPhone: order.phone,

    subtotal: Number(order.subtotal),
    shipping: Number(order.shipping),
    paymentMethod: order.payment_method,
    address: order.address,

    items: orderItems.map((item) => ({
        productId: item.product_id,
        quantity: item.quantity,
        price: Number(item.price),

        name:
        products.find((p) => p.id === item.product_id)?.name ??
        "Unknown Product",
    })),
  }
}

export async function getAdminOrders() {
  await requireAdmin()

  const supabase = createAdminClient()

  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error(
      "GET ADMIN ORDERS ERROR:",
      error,
    )

    throw error
  }

  const {
    data: profiles,
    error: profileError,
  } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      email
    `)

  if (profileError) {
    console.error(
      "GET ADMIN ORDER PROFILES ERROR:",
      profileError,
    )

    throw profileError
  }

  return (orders ?? []).map((order) => {
    const profile = (profiles ?? []).find(
      (profile) =>
        profile.id === order.user_id,
    )

    return {
      id: order.id,
      orderNumber: order.order_number,

      status: order.status,
      paymentStatus:
        order.payment_status,

      paymentProof:
        order.payment_proof,

      paidAt: order.paid_at,

      date: order.created_at,

      subtotal: Number(
        order.subtotal ?? 0,
      ),

      shipping: Number(
        order.shipping ?? 0,
      ),

      total: Number(
        order.total ?? 0,
      ),

      paymentMethod:
        order.payment_method,

      address:
        order.address ?? "",

      customerName:
        order.customer_name ??
        profile?.full_name ??
        "-",

      customerEmail:
        profile?.email ?? "-",

      customerPhone:
        order.phone ?? "-",

      items: [],
    }
  })
}

// fungsi untuk mengambil semua order untuk admin
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
) {
  await requireAdmin()

  const supabase = createAdminClient()

  // Ambil kondisi transaksi terlebih dahulu.
  const {
    data: order,
    error: orderError,
  } = await supabase
    .from("orders")
    .select(
      `
        id,
        payment_method,
        payment_status,
        status
      `,
    )
    .eq("id", orderId)
    .single()

  if (orderError || !order) {
    console.error(
      "GET ORDER BEFORE STATUS UPDATE ERROR:",
      orderError,
    )

    throw new Error(
      "Pesanan tidak ditemukan.",
    )
  }

  const paymentMethod =
    order.payment_method

  const paymentStatus =
    order.payment_status

  // ============================================================
  // TRANSFER
  // ============================================================
  // Transfer harus diverifikasi dulu sebelum pesanan dapat
  // diproses lebih jauh.
  if (paymentMethod === "transfer") {
    const requiresVerifiedPayment = [
      OrderStatus.PAID,
      OrderStatus.PROCESSED,
      OrderStatus.SHIPPED,
      OrderStatus.COMPLETED,
    ].includes(status)

    if (
      requiresVerifiedPayment &&
      paymentStatus !== "completed"
    ) {
      throw new Error(
        "Pembayaran transfer harus diverifikasi sebelum pesanan diproses.",
      )
    }
  }

  // ============================================================
  // COD
  // ============================================================
  // COD dianggap lunas ketika pesanan selesai diterima.
  const updateData: {
    status: OrderStatus
    updated_at: string
    payment_status?: string
    paid_at?: string
  } = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (
    paymentMethod === "cod" &&
    status === OrderStatus.COMPLETED
  ) {
    const paidAt =
      new Date().toISOString()

    updateData.payment_status =
      "completed"

    updateData.paid_at =
      paidAt
  }

  const { error: updateError } =
    await supabase
      .from("orders")
      .update(updateData)
      .eq("id", orderId)

  if (updateError) {
    console.error(
      "UPDATE ORDER STATUS ERROR:",
      updateError,
    )

    throw updateError
  }
}

export async function verifyPayment(orderId: string) {
  await requireAdmin()
  const supabase =  createAdminClient()

  const {
    data: order,
    error: orderError,
  } = await supabase
    .from("orders")
    .select(`
      id,
      payment_method,
      payment_status,
      payment_proof
    `)
    .eq("id", orderId)
    .single()

  if (orderError || !order) {
    throw new Error(
      "Pesanan tidak ditemukan.",
    )
  }

  if (order.payment_method !== "transfer") {
    throw new Error(
      "Verifikasi pembayaran hanya berlaku untuk transfer.",
    )
  }

  if (!order.payment_proof) {
    throw new Error(
      "Bukti pembayaran belum tersedia.",
    )
  }

  if (
    order.payment_status !==
    "waiting_verification"
  ) {
    throw new Error(
      "Pembayaran ini tidak sedang menunggu verifikasi.",
    )
  }

  const { data, error } = await supabase
    .from("orders")
    .update({
      payment_status: "completed",
      status: "paid",
      paid_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .select()

  if (error) {
    console.error("SUPABASE ERROR:", JSON.stringify(error, null, 2))
    throw error
  }

  return data
}