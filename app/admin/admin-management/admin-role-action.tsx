"use client"

import { useState } from "react"
import { ShieldMinus } from "lucide-react"
import { toast } from "sonner"

import { demoteAdminAction } from "./actions"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

type AdminRoleActionProps = {
  userId: string
  name: string
}

export function AdminRoleAction({
  userId,
  name,
}: AdminRoleActionProps) {
  const [submitting, setSubmitting] =
    useState(false)

  async function handleDemote() {
    const confirmed = window.confirm(
      `Cabut akses Admin dari ${name}? Akun tetap aktif sebagai Customer.`,
    )

    if (!confirmed) return

    setSubmitting(true)

    try {
      const result =
        await demoteAdminAction(userId)

      if (!result.success) {
        toast.error(
          "Gagal mencabut akses Admin",
          {
            description: result.message,
          },
        )

        return
      }

      toast.success(
        "Akses Admin berhasil dicabut",
        {
          description: result.message,
        },
      )
    } catch (error) {
      console.error(
        "DEMOTE ADMIN FORM ERROR:",
        error,
      )

      toast.error(
        "Gagal mencabut akses Admin",
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
    <Button
      type="button"
      size="sm"
      variant="outline"
      disabled={submitting}
      onClick={handleDemote}
    >
      {submitting ? (
        <Spinner />
      ) : (
        <ShieldMinus className="h-4 w-4" />
      )}

      Demote
    </Button>
  )
}