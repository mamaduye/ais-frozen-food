"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Search } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatRupiah } from "@/lib/data"

type AdminUser = {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  role: string
  created_at: string
  orders_count: number
  total_spent: number
}

export function UsersClient({ users }: { users: AdminUser[] }) {
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    const q = search.toLowerCase()

    return users.filter(
      (user) =>
        user.full_name?.toLowerCase().includes(q) ||
        user.email?.toLowerCase().includes(q) ||
        user.phone?.toLowerCase().includes(q),
    )
  }, [search, users])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-Display text-3xl">Users</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Akun pengguna yang terdaftar di toko. Anda dapat melihat detail pengguna dan riwayat pesanan mereka dari sini.
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Cari Pengguna"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 sm:w-72"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0 table-scroll">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Orders</TableHead>
                <TableHead className="text-right">Total spent</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.map((user) => {
                const name = user.full_name ?? "Unnamed user"

                const initials = name
                  .split(" ")
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join("")
                  .toUpperCase()

                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-xs text-primary">
                            {initials}
                          </AvatarFallback>
                        </Avatar>

                        <span className="font-medium">
                          {name}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      {user.email ?? "-"}
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      {user.phone ?? "-"}
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>

                    <TableCell className="text-right">
                      {user.orders_count}
                    </TableCell>

                    <TableCell className="text-right font-medium">
                      {formatRupiah(user.total_spent)}
                    </TableCell>

                    <TableCell className="text-right">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/admin/users/${user.id}`}>
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}

              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No users match your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}