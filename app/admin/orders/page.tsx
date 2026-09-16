import { AdminOrdersClient } from "./admin-orders-client"
import { getAdminOrders } from "@/lib/supabase/admin-orders"

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders()

  return (
    <AdminOrdersClient initialOrders={orders} />
  )
}