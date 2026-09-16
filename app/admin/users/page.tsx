import { getAdminUsers } from "@/lib/supabase/admin-users"
import { UsersClient } from "./users-client"
import { markAdminNotificationsSeen } from "@/lib/supabase/admin-notifications"

export default async function AdminUsersPage() {
  const users = await getAdminUsers()
  
  await markAdminNotificationsSeen("users")
  
  return <UsersClient users={users} />
}