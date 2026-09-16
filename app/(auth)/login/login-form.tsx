"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { supabase } from "@/lib/supabase/client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"

import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { Eye, EyeOff } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] =
    useState(false)

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault()

    setSubmitting(true)

    const form =
      new FormData(e.currentTarget)

    const email =
      form.get("email") as string

    const password =
      form.get("password") as string

    try {
      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        })

      if (error) {
        throw error
      }

      toast.success("Selamat datang kembali!", {
        description:
          "Login berhasil.",
      })

      router.push("/")

      router.refresh()

    } catch (err: any) {
      let message = "Terjadi kesalahan saat login."

      if (
        err?.message?.includes("Invalid login credentials")
      ) {
        message = "Email atau password yang Anda masukkan salah."
      }

      toast.error("Login gagal", {
        description: message,
      })
    } finally {
      setSubmitting(false)
    }
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
        </Field>

        <Field>

          <div className="flex items-center justify-between">

            <FieldLabel htmlFor="password">
              Kata sandi
            </FieldLabel>

            <Link
              href="/forgot-password"
              className="text-xs font-medium text-primary hover:underline"
            >
              Lupa kata sandi?
            </Link>

          </div>

          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="xxxxxxx"
              minLength={8}
              className="pr-10"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
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
          {
            submitting
              ? <Spinner />
              : "Masuk"
          }
        </Button>

      </FieldGroup>
    </form>
  )
}