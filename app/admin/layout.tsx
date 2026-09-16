import { AdminShell } from "@/components/admin/admin-shell"
import { getCurrentUserRole } from "@/lib/supabase/admin-auth"
import { getAdminNotificationCounts } from "@/lib/supabase/admin-notifications"

export const metadata = {
  title: "Admin — AIS Frozen Food",
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [role, counts] = await Promise.all([
    getCurrentUserRole(),
    getAdminNotificationCounts(),
  ])

  return (
    <AdminShell
      role={role}
      notificationCounts={counts}
    >
      {children}
    </AdminShell>
  )
}