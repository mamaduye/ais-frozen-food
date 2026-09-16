import Link from "next/link"
import { LoginForm } from "./login-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Masuk",

  description:
    "Masuk ke akun AIS Frozen Food untuk melanjutkan pemesanan dan melihat riwayat pesanan.",
}

export default function LoginPage() {
  return (
    <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
      <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
        selamat datang kembali
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Masuk untuk melacak pesanan dan melakukan checkout lebih cepat.
      </p>

      <LoginForm />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Baru di AIS Frozen Food?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Buat akun
        </Link>
      </p>
    </div>
  )
}
