import Link from "next/link"
import { Snowflake } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-secondary/40">
      <div className="container-max grid w-full gap-6 sm:gap-8 px-3 py-8 sm:px-6 sm:py-12 md:grid-cols-4 lg:px-8 lg:py-12">
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Snowflake className="h-5 w-5" aria-hidden />
            </span>
            <span className="font-display text-base font-semibold tracking-tight">
              AIS Frozen Food
            </span>
          </Link>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            Premium frozen snacks and ready-to-cook meals, made for busy families.
            Freshly produced, carefully packaged, and delivered cold to your doorstep.
          </p>
          <p className="mt-6 text-xs text-muted-foreground">
            Jl. Sukajadi No. 12, Bandung, Indonesia · Open Mon–Sat, 08.00–17.00 WIB
          </p>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold text-foreground">Shop</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link className="hover:text-foreground" href="/products">
                All products
              </Link>
            </li>
            <li>
              <Link className="hover:text-foreground" href="/products?category=nugget">
                Nugget
              </Link>
            </li>
            <li>
              <Link className="hover:text-foreground" href="/products?category=dimsum">
                Dimsum
              </Link>
            </li>
            <li>
              <Link className="hover:text-foreground" href="/products?category=sosis">
                Sosis
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold text-foreground">Account</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link className="hover:text-foreground" href="/login">
                Sign in
              </Link>
            </li>
            <li>
              <Link className="hover:text-foreground" href="/register">
                Create account
              </Link>
            </li>
            <li>
              <Link className="hover:text-foreground" href="/orders">
                Order history
              </Link>
            </li>
            <li>
              <Link className="hover:text-foreground" href="/admin">
                Admin dashboard
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-max flex w-full flex-col gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>{`© ${new Date().getFullYear()} AIS Frozen Food. All rights reserved.`}</p>
          <p>Made with care in Bandung, Indonesia.</p>
        </div>
      </div>
    </footer>
  )
}
