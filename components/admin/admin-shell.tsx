"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

import {
  usePathname,
  useRouter,
} from "next/navigation"

import {
  ArrowLeft,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Package,
  ShieldCheck,
  ShoppingBag,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import type { AdminNotificationCounts } from "@/lib/supabase/admin-notifications"

import { UserRole } from "@/lib/types"
import { cn } from "@/lib/utils"

// ============================================================
// NAVIGATION TYPES
// ============================================================

type NavItem = {
  href: string
  label: string
  icon: React.ComponentType<{
    className?: string
  }>
  superAdminOnly?: boolean
}

// ============================================================
// NAVIGATION ITEMS
// ============================================================

const navItems: NavItem[] = [
  {
    href: "/admin",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/products",
    label: "Products",
    icon: Package,
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: ShoppingBag,
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: Users,
  },
  {
    href: "/admin/reviews",
    label: "Reviews",
    icon: MessageSquare,
  },
  {
    href: "/admin/admin-management",
    label: "Admin Management",
    icon: ShieldCheck,
    superAdminOnly: true,
  },
]

// ============================================================
// NOTIFICATION HELPER
// ============================================================

function getNotificationCount(
  href: string,
  counts: AdminNotificationCounts,
) {
  switch (href) {
    case "/admin/orders":
      return counts.orders

    case "/admin/users":
      return counts.users

    case "/admin/reviews":
      return counts.reviews

    default:
      return 0
  }
}

// ============================================================
// ADMIN SHELL PROPS
// ============================================================

type AdminShellProps = {
  children: React.ReactNode
  role: UserRole | null
  notificationCounts: AdminNotificationCounts
}

// ============================================================
// ADMIN SHELL
// ============================================================

export function AdminShell({
  children,
  role,
  notificationCounts,
}: AdminShellProps) {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    router.refresh()
  }, [pathname, router])

  const visibleNavItems = navItems.filter(
    (item) =>
      !item.superAdminOnly ||
      role === UserRole.SUPER_ADMIN,
  )

  return (
    <div className="flex min-h-svh bg-secondary/30">
      <DesktopSidebar
        navItems={visibleNavItems}
        notificationCounts={notificationCounts}
      />

      <div className="flex flex-1 flex-col">
        <MobileTopbar
          navItems={visibleNavItems}
          notificationCounts={notificationCounts}
        />

        <main className="flex-1 px-3 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  )
}

// ============================================================
// DESKTOP SIDEBAR
// ============================================================

function DesktopSidebar({
  navItems,
  notificationCounts,
}: {
  navItems: NavItem[]
  notificationCounts: AdminNotificationCounts
}) {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 flex-col border-r border-border bg-sidebar lg:flex">
      {/* ======================================================
          LOGO / BRAND
      ====================================================== */}
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <Image
          src="/logo/ais-frozen-food.webp"
          alt="AIS Frozen Food"
          width={50}
          height={50}
          priority
        />

        <div className="flex flex-col leading-tight">
          <span className="font-display text-sm font-semibold tracking-tight text-sidebar-foreground">
            AIS Admin
          </span>

          <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Operations
          </span>
        </div>
      </div>

      {/* ======================================================
          NAVIGATION
      ====================================================== */}
      <nav className="flex flex-1 flex-col gap-1 p-4">
        {navItems.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname?.startsWith(item.href)

          const notificationCount =
            getNotificationCount(
              item.href,
              notificationCounts,
            )

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
              <item.icon className="h-4 w-4 shrink-0" />

              <span className="flex-1">
                {item.label}
              </span>

              {notificationCount > 0 && (
                <span
                  className={cn(
                    "inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 text-[10px] font-bold leading-none tabular-nums shadow-sm",
                    "animate-[notification-pop_350ms_ease-out]",
                    active
                      ? "bg-background text-primary"
                      : "bg-destructive text-destructive-foreground",
                  )}
                >
                  {notificationCount > 99
                    ? "99+"
                    : notificationCount}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* ======================================================
          BACK TO STOREFRONT
      ====================================================== */}
      <div className="border-t border-sidebar-border p-4">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="w-full justify-center"
        >
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Back to storefront
          </Link>
        </Button>
      </div>
    </aside>
  )
}

// ============================================================
// MOBILE TOPBAR
// ============================================================

function MobileTopbar({
  navItems,
  notificationCounts,
}: {
  navItems: NavItem[]
  notificationCounts: AdminNotificationCounts
}) {
  const pathname = usePathname()

  const current = navItems.find(
    (item) =>
      item.href === "/admin"
        ? pathname === "/admin"
        : pathname?.startsWith(item.href),
  )

  return (
    <header className="flex h-16 items-center gap-3 border-b border-border bg-background px-4 lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            aria-label="Open admin menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="w-72 p-0"
        >
          {/* ==================================================
              MOBILE SHEET HEADER
          ================================================== */}
          <SheetHeader className="border-b border-border px-6 py-4">
            <SheetTitle className="font-display">
              AIS Admin
            </SheetTitle>
          </SheetHeader>

          {/* ==================================================
              MOBILE NAVIGATION
          ================================================== */}
          <nav className="flex flex-col gap-1 p-4">
            {navItems.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname?.startsWith(item.href)

              const notificationCount =
                getNotificationCount(
                  item.href,
                  notificationCounts,
                )

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-secondary",
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />

                  <span className="flex-1">
                    {item.label}
                  </span>

                  {notificationCount > 0 && (
                    <span
                      className={cn(
                        "inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 text-[10px] font-bold leading-none tabular-nums shadow-sm",
                        "animate-[notification-pop_350ms_ease-out]",
                        active
                          ? "bg-background text-primary"
                          : "bg-destructive text-destructive-foreground",
                      )}
                    >
                      {notificationCount > 99
                        ? "99+"
                        : notificationCount}
                    </span>
                  )}
                </Link>
              )
            })}

            <Link
              href="/"
              className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary"
            >
              <ArrowLeft className="h-4 w-4" />

              Back to storefront
            </Link>
          </nav>
        </SheetContent>
      </Sheet>

      {/* ======================================================
          CURRENT PAGE TITLE
      ====================================================== */}
      <p className="font-display text-sm font-semibold text-foreground">
        {current?.label ?? "Admin"}
      </p>
    </header>
  )
}