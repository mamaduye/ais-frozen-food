import { supabase } from "./client"

type OrderItem = {
  productId: string
  price: number
  quantity: number
}

export async function createOrder(
  userId: string,
  total: number,
  subtotal: number,
  shipping: number,
  paymentMethod: "transfer" | "cod",
  customerName: string,
  address: string,
  phone: string,
  items: OrderItem[]
) {
  const { count } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })

  const nextNumber = String((count ?? 0) + 1).padStart(6, "0")

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      total,
      subtotal,
      shipping,
      payment_method: paymentMethod,
      customer_name: customerName,
      address,
      phone,
      status: "pending",
      order_number: `PESANAN-${nextNumber}`,
    })
    .select()
    .single()

  if (orderError) throw orderError

  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    quantity: item.quantity,
    price: item.price,
  }))

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems)

  if (itemsError) throw itemsError

  return order
}

export async function cancelOrder(orderId: string) {

  const { data: before, error: beforeError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)

  const { data, error } = await supabase
    .from("orders")
    .update({
      status: "cancelled",
    })
    .eq("id", orderId)
    .select()

  return true
}

export async function uploadPaymentProof(
  orderId: string,
  paymentProof: string
) {
  const { data, error } = await supabase
    .from("orders")
    .update({
      payment_proof: paymentProof,
      payment_status: "waiting_verification",
      paid_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .select()

  if (error) throw error

  return data
}