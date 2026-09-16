import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register")

  const isProtected =
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/admin")

  // Belum login → tidak boleh mengakses halaman protected
  if (!user && isProtected) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    )
  }

  // Sudah login → tidak perlu kembali ke login/register
  if (user && isAuthPage) {
    return NextResponse.redirect(
      new URL("/", request.url)
    )
  }

  // Proteksi khusus admin
  if (user && pathname.startsWith("/admin")) {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    const allowedRoles = ["admin", "super_admin"]

    if (error || !allowedRoles.includes(profile?.role)) {
      return NextResponse.redirect(
        new URL("/", request.url)
      )
    }
  }

  return response
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/checkout/:path*",
    "/orders/:path*",
    "/login",
    "/register",
  ],
}