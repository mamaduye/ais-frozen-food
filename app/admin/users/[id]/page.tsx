import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Mail, Phone, Calendar } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
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

import { OrderStatusBadge } from "@/components/order-status-badge"
import { formatRupiah } from "@/lib/data"
import {
  getAdminUserById,
  getAdminUserOrders,
} from "@/lib/supabase/admin-users"

type Params = Promise<{
  id: string
}>

export default async function AdminUserDetailPage({
  params,
}: {
  params: Params
}) {
  const { id } = await params

  const user = await getAdminUserById(id)
  const userOrders = await getAdminUserOrders(id)

  if (!user) {
    return notFound()
  }

  const totalSpent = userOrders
    .filter((order) => order.status !== "cancelled")
    .reduce(
      (total, order) => total + Number(order.total ?? 0),
      0,
    )

  const initials = (user.full_name ?? "Unnamed user")
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="mb-2 -ml-2"
        >
          <Link href="/admin/users">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Kembali 
          </Link>
        </Button>

        <h1 className="font-Display text-3xl">
          Detail Pelanggan
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* USER PROFILE */}
        <Card className="h-fit">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center gap-3">
              <Avatar className="h-14 w-14">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div>
                <div className="text-lg font-semibold">
                  {user.full_name ?? "Unnamed user"}
                </div>

                <div className="text-sm text-muted-foreground">
                  ID: {user.id.slice(0, 8)}
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              {user.phone && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {user.phone}
                </div>
              )}

              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />

                Joined{" "}

                {new Date(user.created_at).toLocaleDateString(
                  "id-ID",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  },
                )}
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                {user.email ?? "Email belum tersedia"}
              </div>

            </div>

            <div className="grid grid-cols-2 gap-3 border-t pt-4">
              <div>
                <div className="text-2xl font-semibold">
                  {userOrders.length}
                </div>

                <div className="text-xs text-muted-foreground">
                  Total pesanan
                </div>
              </div>

              <div>
                <div className="text-2xl font-semibold">
                  {formatRupiah(totalSpent)}
                </div>

                <div className="text-xs text-muted-foreground">
                  Total pengeluaran
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ORDER HISTORY */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-Display">
              Riwayat Pesanan
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">
                    Total
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {userOrders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Pelanggan ini belum memiliki pesanan.
                    </TableCell>
                  </TableRow>
                ) : (
                  userOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-mono text-xs hover:underline"
                        >
                          {order.id}
                        </Link>
                      </TableCell>

                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(
                          order.created_at,
                        ).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </TableCell>

                      <TableCell>
                        <OrderStatusBadge
                          status={order.status}
                        />
                      </TableCell>

                      <TableCell className="text-right font-medium">
                        {formatRupiah(
                          Number(order.total ?? 0),
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}