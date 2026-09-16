import type { Metadata } from "next"

import { ResetPasswordForm } from "./reset-password-form"

export const metadata: Metadata = {
  title: "Atur Ulang Kata Sandi",
  description:
    "Buat kata sandi baru untuk akun AIS Frozen Food.",
}

export default function ResetPasswordPage() {
  return (
    <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
      <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
        Buat kata sandi baru
      </h1>

      <p className="mt-1 text-sm text-muted-foreground">
        Masukkan kata sandi baru untuk mengamankan kembali akun Anda.
      </p>

      <ResetPasswordForm />
    </div>
  )
}