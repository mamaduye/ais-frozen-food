"use client"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"


import {
  Menu,
  ShoppingCart,
  User,
  LogOut,
  Home,
  Package,
  ClipboardList,
  ChevronRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { useCart } from "@/components/cart-provider"

import { cn } from "@/lib/utils"

import {
  getCurrentUser,
  logout,
} from "@/lib/supabase/auth"
import { supabase } from "@/lib/supabase/client"

const nav = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/products",
    label: "Products",
  },
  {
    href: "/orders",
    label: "My Orders",
  },
]

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { itemCount } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUser(user)
    }

    load()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function handleLogout() {
    setMobileMenuOpen(false)

    await new Promise((resolve) =>
      setTimeout(resolve, 250)
    )

    await logout()

    setUser(null)

    router.push("/")
    router.refresh()
  }
  
  function handleMobileNavigation(href: string) {
    setMobileMenuOpen(false)

    setTimeout(() => {
      router.push(href)
    }, 250)
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background">

    <div className="mx-auto flex h-16 max-w-7xl items-center px-6">

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

    <nav className="ml-8 hidden md:flex gap-3">

    {
    nav.map((i)=>(
    <Link
    key={i.href}
    href={i.href}
    className={
    cn(
    pathname===i.href &&
    "font-bold"
    )
    }
    >

    {i.label}

    </Link>
    ))
    }

    </nav>

    <div className="ml-auto flex gap-2">

    <Button
    asChild
    variant="outline"
    >

    <Link
      href="/cart"
      className="relative flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-secondary"
    >
      <ShoppingCart className="h-4 w-4" />

      {itemCount > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Link>

    </Button>

    {
    user
    ? (

    <div className="hidden md:flex items-center gap-2">

    <span
        className="text-sm">
        Halo,{" "}{user.user_metadata ?.full_name || "user" }
    </span>

    <Button
    variant="ghost"
    onClick={
    handleLogout
    }
    className="
      text-destructive
      hover:bg-destructive
    hover:text-white
      hover:scale-105
      transition-all
      duration-200
      "
    >

    <LogOut />Logout</Button>

    </div> ) : ( <Button asChild>

    <Link
    href="/login"
    >

    <User />

    Sign in

    </Link>

    </Button>

  )}

    <Sheet
      open={mobileMenuOpen}
      onOpenChange={setMobileMenuOpen}
    >
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="md:hidden"
        >
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="
          w-[85%]
          max-w-sm
          border-l
          border-primary/10
          bg-background/95
          p-0
          shadow-2xl
          backdrop-blur-xl
          sm:max-w-md
        "
      >
        {/* Mobile Menu Header */}
        <div className="border-b border-border/70 bg-gradient-to-br from-primary/10 via-background to-secondary/40 px-5 pb-5 pt-6">
          <SheetHeader className="text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                <div className="relative h-9 w-9">
                  <Image
                    src="/logo/ais-frozen-food.webp"
                    alt="AIS Frozen Food"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              <div>
                <SheetTitle className="text-lg font-semibold">
                  AIS Frozen Food
                </SheetTitle>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  Fresh from freezer to your home
                </p>
              </div>
            </div>
          </SheetHeader>
        </div>

        <div className="flex h-full flex-col px-4 py-5">

          {/* User Profile */}
          {user && (
            <div className="mb-5 flex items-center gap-3 rounded-2xl border border-primary/10 bg-primary/5 p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <User className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">
                  Halo,
                </p>

                <p className="truncate font-semibold text-foreground">
                  {user.user_metadata?.full_name || "User"}
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="space-y-2">

            {nav.map((item) => {
              const isActive = pathname === item.href

              const Icon =
                item.href === "/"
                  ? Home
                  : item.href === "/products"
                    ? Package
                    : ClipboardList

              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => handleMobileNavigation(item.href)}
                  className={cn(
                    "group flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left transition-all duration-200",
                    "hover:translate-x-1 hover:bg-primary/10",
                    "active:scale-[0.98]",
                    isActive
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />

                    <span className="font-medium">
                      {item.label}
                    </span>
                  </div>

                  <ChevronRight
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      "group-hover:translate-x-1",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  />
                </button>
              )
            })}

            {/* Cart */}
            <button
              type="button"
              onClick={() => handleMobileNavigation("/cart")}
              className="
                group
                flex
                w-full
                items-center
                justify-between
                rounded-2xl
                px-4
                py-3.5
                text-left
                transition-all
                duration-200
                hover:translate-x-1
                hover:bg-primary/10
                active:scale-[0.98]
              "
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-5 w-5" />

                <span className="font-medium">
                  Shopping Cart
                </span>
              </div>

              <div className="flex items-center gap-2">
                {itemCount > 0 && (
                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-primary-foreground">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}

                <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
            </button>

          </div>

          {/* Bottom Actions */}
          <div className="mt-auto border-t border-border/70 pt-5">

            {user ? (
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="
                  w-full
                  justify-start
                  rounded-2xl
                  px-4
                  py-3.5
                  text-destructive
                  transition-all
                  duration-200
                  hover:bg-destructive/10
                  hover:text-destructive
                "
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </Button>
            ) : (
              <button
                type="button"
                onClick={() => handleMobileNavigation("/login")}
                className="
                  group
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-2xl
                  px-4
                  py-3.5
                  text-left
                  font-medium
                  transition-all
                  duration-200
                  hover:translate-x-1
                  hover:bg-primary/10
                  active:scale-[0.98]
                "
              >
                <User className="h-5 w-5" />

                <span>
                  Sign in
                </span>

                <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </button>
            )}

            <p className="mt-4 text-center text-xs text-muted-foreground">
              AIS Frozen Food · Frozen food favoritmu
            </p>

          </div>

        </div>
      </SheetContent>
    </Sheet>

  </div>

</div>
</header>
      )
    }