import Link from "next/link"
import { LoginForm } from "./login-form"

export const metadata = { title: "Sign in — AIS Frozen Food" }

export default function LoginPage() {
  return (
    <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
      <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
        Welcome back
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Sign in to track orders and check out faster.
      </p>

      <LoginForm />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to AIS Frozen Food?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  )
}
