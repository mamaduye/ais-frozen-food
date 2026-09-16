"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Eye,
  EyeOff,
  KeyRound,
} from "lucide-react"
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

export function ResetPasswordForm() {
  const router = useRouter()

  const [submitting, setSubmitting] =
    useState(false)

  const [checkingSession, setCheckingSession] =
    useState(true)

  const [hasRecoverySession, setHasRecoverySession] =
    useState(false)

  const [showPassword, setShowPassword] =
    useState(false)

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false)

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        setHasRecoverySession(true)
      }

      setCheckingSession(false)
    }

    checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (
          event === "PASSWORD_RECOVERY" ||
          session
        ) {
          setHasRecoverySession(true)
          setCheckingSession(false)
        }
      },
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (submitting) return

    const formData = new FormData(
      event.currentTarget,
    )

    const password = String(
      formData.get("password") ?? "",
    )

    const confirmPassword = String(
      formData.get("confirm_password") ?? "",
    )

    if (password.length < 8) {
      toast.error(
        "Password minimal 8 karakter.",
      )
      return
    }

    if (password !== confirmPassword) {
      toast.error(
        "Konfirmasi password tidak sama.",
      )
      return
    }

    setSubmitting(true)

    try {
      const { error } =
        await supabase.auth.updateUser({
          password,
        })

      if (error) {
        console.error(
          "RESET PASSWORD ERROR:",
          error,
        )

        toast.error(
          "Gagal memperbarui kata sandi",
          {
            description:
              error.message,
          },
        )

        return
      }

      toast.success(
        "Kata sandi berhasil diperbarui",
        {
          description:
            "Silakan masuk menggunakan kata sandi baru.",
        },
      )

      await supabase.auth.signOut()

      router.replace("/login")
      router.refresh()
    } catch (error) {
      console.error(
        "RESET PASSWORD FETCH ERROR:",
        error,
      )

      toast.error(
        "Terjadi kesalahan saat memperbarui kata sandi.",
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (checkingSession) {
    return (
      <div className="mt-8 flex justify-center">
        <Spinner />
      </div>
    )
  }

  if (!hasRecoverySession) {
    return (
      <div className="mt-6 rounded-xl border border-destructive/20 bg-destructive/5 p-5">
        <div className="flex gap-3">
          <KeyRound className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />

          <div>
            <p className="font-medium">
              Tautan tidak valid atau sudah kedaluwarsa
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Silakan kembali ke halaman lupa kata sandi dan minta tautan
              pemulihan baru.
            </p>

            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() =>
                router.push(
                  "/forgot-password",
                )
              }
            >
              Minta tautan baru
            </Button>
          </div>
        </div>
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
          <FieldLabel htmlFor="password">
            Kata sandi baru
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
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (previous) => !previous,
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
            Minimal 8 karakter.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="confirm_password">
            Konfirmasi kata sandi
          </FieldLabel>

          <div className="relative">
            <Input
              id="confirm_password"
              name="confirm_password"
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              required
              minLength={8}
              autoComplete="new-password"
              className="pr-10"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  (previous) => !previous,
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={
                showConfirmPassword
                  ? "Sembunyikan konfirmasi password"
                  : "Tampilkan konfirmasi password"
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </Field>

        <Button
          type="submit"
          disabled={submitting}
          className="w-full"
        >
          {submitting ? (
            <>
              <Spinner />
              Menyimpan...
            </>
          ) : (
            "Simpan kata sandi baru"
          )}
        </Button>
      </FieldGroup>
    </form>
  )
}