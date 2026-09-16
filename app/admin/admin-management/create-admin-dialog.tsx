"use client"

import { useState } from "react"
import { Eye, EyeOff, Plus, UserPlus } from "lucide-react"
import { toast } from "sonner"

import { createAdminAction } from "./actions"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"

export function CreateAdminDialog() {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (submitting) return

    setSubmitting(true)

    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      const result = await createAdminAction(formData)

      if (!result.success) {
        toast.error("Gagal menambahkan Admin", {
          description: result.message,
        })

        return
      }

      toast.success("Admin berhasil ditambahkan", {
        description: result.message,
      })

      form.reset()
      setShowPassword(false)
      setOpen(false)
    } catch (error) {
      console.error(
        "CREATE ADMIN FORM ERROR:",
        error,
      )

      toast.error("Gagal menambahkan Admin", {
        description:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat membuat akun administrator.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    if (submitting) return

    setOpen(nextOpen)

    if (!nextOpen) {
      setShowPassword(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Tambah Admin
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <UserPlus className="h-5 w-5 text-primary" />
            </div>

            <div>
              <DialogTitle>
                Tambah Administrator
              </DialogTitle>

              <DialogDescription className="mt-1">
                Buat akun baru dengan hak akses Admin.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <FieldGroup className="space-y-4">
            <Field>
              <FieldLabel htmlFor="full_name">
                Nama lengkap
              </FieldLabel>

              <Input
                id="full_name"
                name="full_name"
                required
                autoComplete="name"
                placeholder="Contoh: Budi Santoso"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="email">
                Email
              </FieldLabel>

              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="admin@example.com"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="phone">
                WhatsApp
              </FieldLabel>

              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                placeholder="08xxxxxxxxxx"
              />

              <FieldDescription>
                Digunakan sebagai informasi kontak administrator.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="password">
                Password awal
              </FieldLabel>

              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="pr-10"
                  placeholder="Minimal 8 karakter"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous,
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={
                    showPassword
                      ? "Sembunyikan password"
                      : "Tampilkan password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <FieldDescription>
                Admin dapat mengganti password melalui fitur
                pemulihan password setelah fitur tersebut
                diaktifkan.
              </FieldDescription>
            </Field>
          </FieldGroup>

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
              type="submit"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Spinner />
                  Menambahkan...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Tambah Admin
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}