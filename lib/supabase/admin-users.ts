import { createClient } from "./server"
import type { OrderStatus } from "@/lib/types"

type AdminUserOrder = {
  id: string
  total: number | null
  status: OrderStatus
  created_at: string
}

type AdminUserProfile = {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  role: string
  created_at: string
}

type AdminUserWithOrders = AdminUserProfile & {
  orders: AdminUserOrder[]
}

export type AdminUser = {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  role: string
  created_at: string
  orders_count: number
  total_spent: number
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      email,
      phone,
      role,
      created_at,
      orders (
        id,
        total,
        status,
        created_at
      )
    `)
    .eq("role", "customer")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("GET ADMIN USERS ERROR:", error)
    throw error
  }

  const users = (data ?? []) as AdminUserWithOrders[]

  return users.map((user): AdminUser => {
    const userOrders = user.orders ?? []

    const totalSpent = userOrders
      .filter((order) => order.status !== "cancelled")
      .reduce(
        (total, order) => total + Number(order.total ?? 0),
        0,
      )

    return {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      created_at: user.created_at,
      orders_count: userOrders.length,
      total_spent: totalSpent,
    }
  })
}

export async function getAdminUserById(
  id: string,
): Promise<AdminUserProfile | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      email,
      phone,
      role,
      created_at
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("GET ADMIN USER ERROR:", error)
    return null
  }

  return data as AdminUserProfile
}

export async function getAdminUserOrders(
  userId: string,
): Promise<AdminUserOrder[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      total,
      status,
      created_at
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("GET ADMIN USER ORDERS ERROR:", error)
    throw error
  }

  return (data ?? []) as AdminUserOrder[]
}