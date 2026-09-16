import {
  ShieldCheck,
  UserCog,
  Users,
  Mail,
  Phone,
  Calendar,
} from "lucide-react"

import { requireSuperAdmin } from "@/lib/supabase/admin-auth"
import { createAdminClient } from "@/lib/supabase/admin"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { CreateAdminDialog } from "./create-admin-dialog"
import { PromoteCustomerDialog } from "./promote-customer-dialog"
import { AdminRoleAction } from "./admin-role-action"

type AdminProfile = {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  role: string | null
  created_at: string | null
}


export default async function AdminManagementPage() {
  // ============================================================
  // 1. Pastikan yang akses adalah Super Admin
  // ============================================================
  await requireSuperAdmin()

  // ============================================================
  // 2. Gunakan privileged client
  // ============================================================
  const supabase = createAdminClient()

  // ============================================================
  // 3. Ambil Admin + Super Admin
  // ============================================================
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
    .in("role", ["admin", "super_admin"])
    .order("created_at", {
      ascending: true,
    })

  if (error) {
    console.error(
      "GET ADMIN MANAGEMENT ERROR:",
      error,
    )

    throw new Error(
      "Gagal mengambil data administrator.",
    )
  }

  const admins =
    (data ?? []) as AdminProfile[]

  // ============================================================
  // 4. Ambil Customer
  // ============================================================

  const {
    data: customerData,
    error: customerError,
  } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      email
    `)
    .eq("role", "customer")
    .order("full_name", {
      ascending: true,
    })

  if (customerError) {
    console.error(
      "GET PROMOTABLE CUSTOMERS ERROR:",
      customerError,
    )

    throw new Error(
      "Gagal mengambil data pelanggan.",
    )
  }

  const customers = customerData ?? []

  console.log(
    "ADMIN MANAGEMENT CUSTOMERS:",
    customers,
  )

  // ============================================================
  // 4. SUMMARY
  // ============================================================
  const totalAdmins = admins.filter(
    (user) => user.role === "admin",
  ).length

  const totalSuperAdmins = admins.filter(
    (user) => user.role === "super_admin",
  ).length

  const totalAdministrators = admins.length

  // ============================================================
  // 5. HELPERS
  // ============================================================
  function getInitials(name: string | null) {
    if (!name) return "AU"

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
  }

  function getRoleLabel(role: string | null) {
    if (role === "super_admin") return "Super Admin"
    if (role === "admin") return "Admin"
    return "Unknown"
  }

  console.log(
    "ADMIN MANAGEMENT CUSTOMERS:",
    customers,
 )

  return (
    <div className="space-y-6">
      {/* ========================================================
          HEADER
      ======================================================== */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <ShieldCheck className="h-5 w-5 text-primary" />
            </div>

            <div>
            <h1 className="font-display text-3xl font-semibold">
                Admin Management
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
                Kelola akun administrator dan hak akses dashboard AIS Frozen Food.
            </p>
            </div>
        </div>

        <div className="flex flex-wrap gap-2">
            <PromoteCustomerDialog
                customers={customers}
            />

            <CreateAdminDialog />
        </div>
     </div>

      {/* ========================================================
          INFO BANNER
      ======================================================== */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex gap-3 p-5">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

          <div>
            <p className="font-medium">
              Area khusus Super Admin
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
                Halaman ini digunakan untuk mengelola akun administrator,
                memberikan akses Admin kepada pelanggan, serta mencabut
                hak akses administrator secara aman.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ========================================================
          SUMMARY CARDS
      ======================================================== */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Administrator */}
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Total Administrator
              </p>

              <p className="text-2xl font-semibold">
                {totalAdministrators}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Admin */}
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-500/10">
              <UserCog className="h-5 w-5 text-blue-600" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Admin
              </p>

              <p className="text-2xl font-semibold">
                {totalAdmins}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Super Admin */}
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-500/10">
              <ShieldCheck className="h-5 w-5 text-purple-600" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Super Admin
              </p>

              <p className="text-2xl font-semibold">
                {totalSuperAdmins}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ========================================================
          ADMIN TABLE
      ======================================================== */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display">
            Administrator
          </CardTitle>

          <p className="text-sm text-muted-foreground">
            Daftar akun yang memiliki akses ke dashboard administrator.
          </p>
        </CardHeader>

        <CardContent className="p-0">
          <div className="table-scroll">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Administrator</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {admins.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Belum ada akun administrator.
                    </TableCell>
                  </TableRow>
                ) : (
                  admins.map((admin) => {
                    const name =
                      admin.full_name ?? "Unnamed administrator"

                    const isSuperAdmin =
                      admin.role === "super_admin"

                    return (
                      <TableRow key={admin.id}>
                        {/* Administrator */}
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                                {getInitials(admin.full_name)}
                              </AvatarFallback>
                            </Avatar>

                            <div className="min-w-0">
                              <p className="truncate font-medium">
                                {name}
                              </p>

                              <p className="font-mono text-[11px] text-muted-foreground">
                                {admin.id.slice(0, 8)}...
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Contact */}
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            {admin.email && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Mail className="h-3.5 w-3.5" />
                                <span>{admin.email}</span>
                              </div>
                            )}

                            {admin.phone && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Phone className="h-3.5 w-3.5" />
                                <span>{admin.phone}</span>
                              </div>
                            )}

                            {!admin.email && !admin.phone && (
                              <span className="text-muted-foreground">
                                -
                              </span>
                            )}
                          </div>
                        </TableCell>

                        {/* Role */}
                        <TableCell>
                          <div
                            className={
                              isSuperAdmin
                                ? "inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-2.5 py-1 text-xs font-medium text-purple-700"
                                : "inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-700"
                            }
                          >
                            {isSuperAdmin ? (
                              <ShieldCheck className="h-3.5 w-3.5" />
                            ) : (
                              <UserCog className="h-3.5 w-3.5" />
                            )}

                            {getRoleLabel(admin.role)}
                          </div>
                        </TableCell>

                        {/* Joined */}
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />

                            {admin.created_at
                              ? new Date(
                                  admin.created_at,
                                ).toLocaleDateString(
                                  "id-ID",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )
                              : "-"}
                          </div>
                        </TableCell>

                        {/* protected */}
                        <TableCell className="text-right">
                            {admin.role === "admin" ? (
                                <AdminRoleAction
                                userId={admin.id}
                                name={
                                    admin.full_name ??
                                    admin.email ??
                                    "Administrator"
                                }
                                />
                            ) : (
                                <span className="text-xs text-muted-foreground">
                                Protected
                                </span>
                            )}
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

