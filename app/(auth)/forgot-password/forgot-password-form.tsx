"use client"

import { useState } from "react"
import { Mail } from "lucide-react"
import { toast } from "sonner"

import { supabase } from "@/lib/supabase/client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"

export function ForgotPasswordForm() {
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (submitting) return

    setSubmitting(true)

    const formData = new FormData(event.currentTarget)

    const email = String(
      formData.get("email") ?? "",
    )
      .trim()
      .toLowerCase()

    if (!email) {
      toast.error("Email wajib diisi.")
      setSubmitting(false)
      return
    }

    try {
      const redirectTo = `${window.location.origin}/reset-password`

      const { error } =
        await supabase.auth.resetPasswordForEmail(
          email,
          {
            redirectTo,
          },
        )

      if (error) {
        console.error(
          "FORGOT PASSWORD ERROR:",
          error,
        )

        toast.error(
          "Gagal mengirim tautan pemulihan",
          {
            description:
              "Silakan coba kembali beberapa saat lagi.",
          },
        )

        return
      }

      setSent(true)

      toast.success(
        "Email pemulihan dikirim",
        {
          description:
            "Silakan periksa kotak masuk atau folder spam Anda.",
        },
      )
    } catch (error) {
      console.error(
        "FORGOT PASSWORD FETCH ERROR:",
        error,
      )

      toast.error(
        "Terjadi kesalahan",
        {
          description:
            "Tidak dapat memproses permintaan pemulihan kata sandi.",
        },
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (sent) {
    return (
      <div className="mt-6 rounded-xl border bg-muted/30 p-5 text-center">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-5 w-5 text-primary" />
        </div>

        <h2 className="mt-3 font-medium">
          Periksa email Anda
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Jika email tersebut terdaftar, tautan pemulihan kata sandi akan
          dikirim ke alamat tersebut.
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={() => setSent(false)}
        >
          Gunakan email lain
        </Button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6"
    >
      <FieldGroup className="space-y-4">
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
            placeholder="you@example.com"
          />

          <FieldDescription>
            Gunakan email yang terhubung dengan akun AIS Frozen Food.
          </FieldDescription>
        </Field>

        <Button
          type="submit"
          disabled={submitting}
          className="w-full"
        >
          {submitting ? (
            <>
              <Spinner />
              Mengirim...
            </>
          ) : (
            "Kirim tautan pemulihan"
          )}
        </Button>
      </FieldGroup>
    </form>
  )
}