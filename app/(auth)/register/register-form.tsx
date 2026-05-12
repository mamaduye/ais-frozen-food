"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"

export function RegisterForm() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      toast.success("Account created", { description: "Welcome to AIS Frozen Food!" })
      router.push("/")
    }, 800)
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <FieldGroup className="space-y-4">
        <Field>
          <FieldLabel htmlFor="name">Full name</FieldLabel>
          <Input id="name" name="name" required placeholder="Sari Wijaya" className="input-mobile mt-1.5" />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" name="email" type="email" required placeholder="you@example.com" className="input-mobile mt-1.5" />
        </Field>
        <Field>
          <FieldLabel htmlFor="phone">Phone (WhatsApp)</FieldLabel>
          <Input id="phone" name="phone" required placeholder="+62 812 3456 7890" className="input-mobile mt-1.5" />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            required
            placeholder="At least 8 characters"
            minLength={8}
            className="input-mobile mt-1.5"
          />
          <FieldDescription>Use a mix of letters, numbers, and symbols.</FieldDescription>
        </Field>
        <Button type="submit" className="button-mobile mt-4 w-full" disabled={submitting}>
          {submitting ? <Spinner className="h-4 w-4" /> : null}
          {submitting ? "Creating account…" : "Create account"}
        </Button>
      </FieldGroup>
    </form>
  )
}
