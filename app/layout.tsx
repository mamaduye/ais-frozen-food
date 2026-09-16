import type { Metadata } from "next"
import { Inter, Plus_Jakarta_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
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
  metadataBase: new URL("https://ais-frozen-food.vercel.app"),

  title: {
    default: "AIS Frozen Food",
    template: "%s | AIS Frozen Food",
  },

  description:
    "AIS Frozen Food menyediakan aneka frozen food berkualitas seperti nugget, dimsum, sosis, cireng, dan camilan beku lainnya dengan proses pemesanan yang mudah dan pengiriman cepat.",

  keywords: [
    "AIS Frozen Food",
    "Frozen Food Pati",
    "Frozen Food Indonesia",
    "Nugget",
    "Dimsum",
    "Cireng",
    "Sosis",
    "Frozen Snack",
    "Belanja Frozen Food",
    "UMKM Frozen Food",
  ],

  authors: [
    {
      name: "Ahmad Nur Hidayatulloh",
    },
  ],

  creator: "Ahmad Nur Hidayatulloh",

  publisher: "AIS Frozen Food",

  applicationName: "AIS Frozen Food",

  category: "E-Commerce",

  referrer: "origin-when-cross-origin",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,

      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",

    locale: "id_ID",

    url: "/",

    siteName: "AIS Frozen Food",

    title: "AIS Frozen Food",

    description:
      "Belanja frozen food berkualitas dengan mudah. Nugget, dimsum, sosis, cireng, dan berbagai camilan beku terbaik.",

    images: [
      {
        url: "/og-image.jpg",

        width: 1200,

        height: 630,

        alt: "AIS Frozen Food",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "AIS Frozen Food",

    description:
      "Belanja frozen food berkualitas dengan mudah.",

    images: ["/og-image.jpg"],
  },

  icons: {
    icon: "/favicon.ico",

    shortcut: "/favicon.ico",

    apple: "/apple-touch-icon.png",
  },

  manifest: "/manifest.webmanifest",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${display.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        {children}
        <Toaster richColors position="top-center" />

        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
