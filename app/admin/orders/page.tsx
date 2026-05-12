import { orders } from "@/lib/data"
import { AdminOrdersClient } from "./admin-orders-client"

export default function AdminOrdersPage() {
  return <AdminOrdersClient initialOrders={orders} />
}
