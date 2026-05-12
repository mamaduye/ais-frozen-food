import type { Metadata } from "next"
import { Inter, Plus_Jakarta_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import { CartProvider } from "@/components/cart-provider"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
})

export const metadata: Metadata = {
  title: "AIS Frozen Food — Premium Frozen Snacks Delivered",
  description:
    "Shop premium frozen nuggets, dimsum, sosis and more from AIS Frozen Food. Fresh quality, fast delivery, simple ordering.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable} bg-background`}>
      <body className="font-sans antialiased">
        <CartProvider>
          {children}
          <Toaster position="top-center" richColors />
        </CartProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
