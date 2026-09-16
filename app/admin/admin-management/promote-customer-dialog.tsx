"use client"

import { useState } from "react"
import { ShieldPlus, UserRoundCog } from "lucide-react"
import { toast } from "sonner"

import { promoteCustomerAction } from "./actions"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Spinner } from "@/components/ui/spinner"

type CustomerOption = {
  id: string
  full_name: string | null
  email: string | null
}

export function PromoteCustomerDialog({
  customers,
}: {
  customers: CustomerOption[]
}) {
  const [open, setOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] =
    useState("")
  const [submitting, setSubmitting] =
    useState(false)

  async function handlePromote() {
    if (!selectedUserId) {
      toast.error("Pilih pelanggan terlebih dahulu.")
      return
    }

    setSubmitting(true)

    try {
      const result =
        await promoteCustomerAction(
          selectedUserId,
        )

      if (!result.success) {
        toast.error(
          "Gagal mempromosikan pelanggan",
          {
            description: result.message,
          },
        )

        return
      }

      toast.success(
        "Akses Admin berhasil diberikan",
        {
          description: result.message,
        },
      )

      setSelectedUserId("")
      setOpen(false)
    } catch (error) {
      console.error(
        "PROMOTE CUSTOMER FORM ERROR:",
        error,
      )

      toast.error(
        "Gagal mempromosikan pelanggan",
        {
          description:
            error instanceof Error
              ? error.message
              : "Terjadi kesalahan.",
        },
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (submitting) return

        setOpen(nextOpen)

        if (!nextOpen) {
          setSelectedUserId("")
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          <ShieldPlus className="h-4 w-4" />
          Promote Customer
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <UserRoundCog className="h-5 w-5 text-primary" />
            </div>

            <div>
              <DialogTitle>
                Promote Customer
              </DialogTitle>

              <DialogDescription className="mt-1">
                Berikan akses dashboard Admin
                kepada pelanggan yang sudah
                memiliki akun.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {customers.length === 0 ? (
          <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
            Tidak ada akun Customer yang
            tersedia untuk dipromosikan.
          </div>
        ) : (
          <div className="space-y-2">
            <label
              htmlFor="customer"
              className="text-sm font-medium"
            >
              Pilih pelanggan
            </label>

            <select
              id="customer"
              value={selectedUserId}
              onChange={(event) =>
                setSelectedUserId(
                  event.target.value,
                )
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">
                Pilih pelanggan...
              </option>

              {customers.map((customer) => (
                <option
                  key={customer.id}
                  value={customer.id}
                >
                  {customer.full_name ??
                    "Unnamed user"}
                  {customer.email
                    ? ` — ${customer.email}`
                    : ""}
                </option>
              ))}
            </select>

            <p className="text-xs text-muted-foreground">
              Email dan password pelanggan
              tetap sama. Sistem hanya mengubah
              role menjadi Admin.
            </p>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={submitting}
            onClick={() => setOpen(false)}
          >
            Batal
          </Button>

          <Button
            type="button"
            disabled={
              submitting ||
              !selectedUserId ||
              customers.length === 0
            }
            onClick={handlePromote}
          >
            {submitting ? (
              <>
                <Spinner />
                Memproses...
              </>
            ) : (
              <>
                <ShieldPlus className="h-4 w-4" />
                Jadikan Admin
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}