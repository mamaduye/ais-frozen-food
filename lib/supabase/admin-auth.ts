import { createClient } from "./server"
import { UserRole } from "@/lib/types"

export async function getCurrentUserRole() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (error) {
    console.error("GET USER ROLE ERROR:", error)
    return null
  }

  return profile?.role as UserRole | null
}

export async function requireAdmin() {
  const role = await getCurrentUserRole()

  if (
    role !== UserRole.ADMIN &&
    role !== UserRole.SUPER_ADMIN
  ) {
    throw new Error("Unauthorized")
  }

  return role
}

export async function requireSuperAdmin() {
  const role = await getCurrentUserRole()

  if (role !== UserRole.SUPER_ADMIN) {
    throw new Error("Unauthorized")
  }

  return role
}