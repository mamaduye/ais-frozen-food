import Link from "next/link"
import { Snowflake } from "lucide-react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-secondary/30">
      <header className="mx-auto flex w-full max-w-7xl items-center px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Snowflake className="h-5 w-5" aria-hidden />
          </span>
          <span className="font-display text-base font-semibold tracking-tight">
            AIS Frozen Food
          </span>
        </Link>
      </header>
      <main className="mx-auto flex w-full max-w-md flex-col px-4 pb-16 pt-4 sm:px-6">
        {children}
      </main>
    </div>
  )
}
