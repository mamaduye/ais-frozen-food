"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  LayoutDashboard,
  MessageSquare,
  Package,
  ShoppingBag,
  Snowflake,
  Users,
  Menu,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquare },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh bg-secondary/30">
      <DesktopSidebar />
      <div className="flex flex-1 flex-col">
        <MobileTopbar />
        <main className="flex-1 px-3 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  )
}

function DesktopSidebar() {
  const pathname = usePathname()
  return (
    <aside className="hidden w-64 flex-col border-r border-border bg-sidebar lg:flex">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Snowflake className="h-5 w-5" aria-hidden />
        </span>
        <div className="flex flex-col leading-tight">
          <span className="font-display text-sm font-semibold tracking-tight text-sidebar-foreground">
            AIS Admin
          </span>
          <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Operations
          </span>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-4">
        {navItems.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-sidebar-border p-4">
        <Button asChild variant="outline" size="sm" className="w-full justify-center">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Back to storefront
          </Link>
        </Button>
      </div>
    </aside>
  )
}

function MobileTopbar() {
  const pathname = usePathname()
  const current = navItems.find(
    (item) => (item.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(item.href)),
  )
  return (
    <header className="flex h-16 items-center gap-3 border-b border-border bg-background px-4 lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-10 w-10" aria-label="Open admin menu">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="border-b border-border px-6 py-4">
            <SheetTitle className="font-display">AIS Admin</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 p-4">
            {navItems.map((item) => {
              const active = item.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                    active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
            <Link
              href="/"
              className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to storefront
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <p className="font-display text-sm font-semibold text-foreground">{current?.label ?? "Admin"}</p>
    </header>
  )
}
