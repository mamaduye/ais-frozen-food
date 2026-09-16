import Link from "next/link"
import { RegisterForm } from "./register-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Daftar",

  description:
    "Buat akun AIS Frozen Food untuk mulai berbelanja frozen food favorit Anda.",
}

export default function RegisterPage() {
  return (
    <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
      <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
        buat akun baru
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Dapatkan pelacakan pesanan yang dipersonalisasi dan penawaran eksklusif.
      </p>

      <RegisterForm />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Masuk
        </Link>
      </p>
    </div>
  )
}
