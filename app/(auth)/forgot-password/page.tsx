import Link from "next/link"
import type { Metadata } from "next"

import { ForgotPasswordForm } from "./forgot-password-form"

export const metadata: Metadata = {
  title: "Lupa Kata Sandi",
  description:
    "Pulihkan kata sandi akun AIS Frozen Food melalui email.",
}

export default function ForgotPasswordPage() {
  return (
    <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
      <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
        Lupa kata sandi?
      </h1>

      <p className="mt-1 text-sm text-muted-foreground">
        Masukkan email yang terdaftar. Kami akan mengirimkan tautan untuk
        membuat kata sandi baru.
      </p>

      <ForgotPasswordForm />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Ingat kata sandi?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          Kembali masuk
        </Link>
      </p>
    </div>
  )
}