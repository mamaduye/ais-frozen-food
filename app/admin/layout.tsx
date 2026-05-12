import { AdminShell } from "@/components/admin/admin-shell"

export const metadata = {
  title: "Admin — AIS Frozen Food",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>
}
