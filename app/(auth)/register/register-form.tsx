"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

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
import { toast } from "sonner"
import { Eye, EyeOff } from "lucide-react"

export function RegisterForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault()

    setSubmitting(true)

    const form = new FormData(e.currentTarget)

    const name = form.get("name") as string
    const email = form.get("email") as string
    const phone = form.get("phone") as string
    const password = form.get("password") as string

    try {
      const { error } =
        await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              phone,
            },
          },
        })

      if (error) {
        let message = error.message

        if (
          error.message.includes("User already registered")
        ) {
          message =
            "Email sudah digunakan. Silakan login atau gunakan email lain."
        }

        if (
          error.message.includes("Password")
        ) {
          message =
            "Password tidak memenuhi ketentuan."
        }

        toast.error("Registrasi gagal", {
          description: message,
        })

        return
      }

      toast.success("Registrasi berhasil", {
        description:
          "Akun berhasil dibuat. Silakan login untuk mulai berbelanja.",
      })

      router.push("/login")
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Registration failed"
      )
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
          <FieldLabel htmlFor="name">
            Full name
          </FieldLabel>

          <Input
            id="name"
            name="name"
            required
            placeholder="Sari Wijaya"
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
            placeholder="you@example.com"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="phone">
            WhatsApp
          </FieldLabel>

          <Input
            id="phone"
            name="phone"
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="password">
            Password
          </FieldLabel>

          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
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

          <FieldDescription>
            Minimum 8 characters
          </FieldDescription>
        </Field>

        <Button
          type="submit"
          disabled={submitting}
          className="w-full disabled:opacity-70"
        >
          {submitting
            ? <Spinner />
            : "Create account"}
        </Button>

      </FieldGroup>
    </form>
  )
}