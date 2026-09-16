"use server"

import { revalidatePath } from "next/cache"
import { updateOrderStatus,
          verifyPayment,
        } from "@/lib/supabase/admin-orders"
import { OrderStatus } from "@/lib/types"


export async function updateOrderStatusAction(
  orderId: string,
  status: OrderStatus,
) {
  await updateOrderStatus(
    orderId,
    status,
  )

  revalidatePath("/admin/orders")
  revalidatePath(
    `/admin/orders/${orderId}`,
  )

  revalidatePath("/orders")
  revalidatePath(
    `/orders/${orderId}`,
  )
}

export async function verifyPaymentAction(orderId: string) {
  await verifyPayment(orderId)

  revalidatePath(`/admin/orders/${orderId}`)
  revalidatePath(`/orders/${orderId}`)
  revalidatePath("/orders")
}