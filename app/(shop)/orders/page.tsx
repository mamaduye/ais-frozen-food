import { OrdersClient } from "./orders-client"
import { orders } from "@/lib/data"

export const metadata = {
  title: "Order History — AIS Frozen Food",
}

export default function OrdersPage() {
  // For demo: show orders for the first user.
  const myOrders = orders.filter((o) => o.customerEmail === "sari@example.com")
  return <OrdersClient initialOrders={myOrders} />
}
