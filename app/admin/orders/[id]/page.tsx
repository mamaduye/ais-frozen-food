import { notFound } from "next/navigation"
import { getAdminOrderById } from "@/lib/supabase/admin-orders"
import { AdminOrderDetailClient } from "./admin-order-detail-client"

type Params = Promise<{ id: string }>

export default async function AdminOrderDetailPage({ params }: { params: Params }) {
  const { id } = await params
  const order = await getAdminOrderById(id) 
  
  if (!order) return notFound()
  return <AdminOrderDetailClient initialOrder={order} />
}
