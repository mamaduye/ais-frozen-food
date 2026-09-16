import Link from "next/link"
import Image from "next/image"


export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-secondary/30">
      <header className="mx-auto flex w-full max-w-7xl items-center px-4 py-6 sm:px-6 lg:px-8">
        <Link
      href="/"
      className="flex min-w-0 items-center gap-2"
    >
      <Image
        src="/logo/ais-frozen-food.webp"
        alt="AIS Frozen Food"
        width={45}
        height={45}
        priority
      />

      <span className="hidden sm:inline whitespace-nowrap">
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

