import { notFound } from "next/navigation"
import { orders } from "@/lib/data"
import { AdminOrderDetailClient } from "./admin-order-detail-client"

type Params = Promise<{ id: string }>

export default async function AdminOrderDetailPage({ params }: { params: Params }) {
  const { id } = await params
  const order = orders.find((o) => o.id === id)
  if (!order) return notFound()
  return <AdminOrderDetailClient initialOrder={order} />
}
