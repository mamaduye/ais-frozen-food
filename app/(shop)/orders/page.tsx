import { redirect } from "next/navigation"
import { OrdersClient } from "./orders-client"
import { getCurrentServerUser } from "@/lib/supabase/server-auth"
import { getOrders } from "@/lib/supabase/orders"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Riwayat Pesanan",

  description:
    "Lihat riwayat transaksi dan status pesanan Anda di AIS Frozen Food.",
}

export default async function OrdersPage() {
  const user = await getCurrentServerUser()

  // Server-side debug logs (appear in terminal / server logs)

  if (!user) {
    redirect("/login")
  }

  const myOrders = await getOrders(user.id)

  console.log("ORDERS:", myOrders)

  return <OrdersClient initialOrders={myOrders} />
}