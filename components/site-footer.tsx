import Link from "next/link"
import Image from "next/image"
import { MessageCircle } from "lucide-react"

export function SiteFooter() {
return (
<footer className="mt-16 border-t border-border bg-secondary/40">
  <div className="container-max grid w-full gap-10 px-4 py-10 sm:px-6 sm:py-12 md:grid-cols-4 lg:px-8">
  {/* Brand */}
    <div className="md:col-span-2">
      <Link href="/" className="flex items-center gap-2">
        <Image 
          src="/logo/ais-frozen-food.webp" 
          alt="AIS Frozen Food" 
          width={60} 
          height={60} 
        />

        <span className="font-display text-base font-semibold tracking-tight">
          AIS Frozen Food
        </span>
      </Link>

      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
        Frozen food praktis dan berkualitas untuk menemani waktu santai
        bersama keluarga. Pilih produk favoritmu dan pesan dengan mudah
        melalui AIS Frozen Food.
      </p>

      <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
        Desa Bumirejo, Pati, Indonesia
        <br />
        Senin–Sabtu · 08.00–17.00 WIB
      </p>
    </div>

    {/* Navigasi */}
    <div>
      <h4 className="font-display text-sm font-semibold text-foreground">
        Navigasi
      </h4>

      <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
        <li>
          <Link
            className="transition-colors hover:text-foreground"
            href="/"
          >
            Beranda
          </Link>
        </li>

        <li>
          <Link
            className="transition-colors hover:text-foreground"
            href="/products"
          >
            Semua Produk
          </Link>
        </li>

        <li>
          <Link
            className="transition-colors hover:text-foreground"
            href="/cart"
          >
            Keranjang
          </Link>
        </li>

        <li>
          <Link
            className="transition-colors hover:text-foreground"
            href="/orders"
          >
            Riwayat Pesanan
          </Link>
        </li>
      </ul>
    </div>

    {/* Bantuan */}
    <div>
      <h4 className="font-display text-sm font-semibold text-foreground">
        Bantuan
      </h4>

      <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
        <li>
          <Link
            className="transition-colors hover:text-foreground"
            href="/products"
          >
            Cara Berbelanja
          </Link>
        </li>

        <li>
          <Link
            className="transition-colors hover:text-foreground"
            href="/login"
          >
            Masuk ke Akun
          </Link>
        </li>

        <li>
          <Link
            className="transition-colors hover:text-foreground"
            href="/register"
          >
            Buat Akun
          </Link>
        </li>

        <li>
          <a
            href="https://wa.me/6281234567890?text=Halo%20AIS%20Frozen%20Food%2C%20saya%20ingin%20bertanya."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
          >
            <MessageCircle className="h-4 w-4" />
            Hubungi Kami
          </a>
        </li>
      </ul>
    </div>
  </div>

  {/* Bottom Footer */}
  <div className="border-t border-border">
    <div className="container-max flex w-full flex-col gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
      <p>
        © {new Date().getFullYear()} AIS Frozen Food. All rights reserved.
      </p>

      <p>Dibuat dengan ❤️ di Pati, Indonesia</p>
    </div>
  </div>
</footer>
  )
}
