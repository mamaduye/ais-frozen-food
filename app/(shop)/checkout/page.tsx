import { CheckoutClient } from "./checkout-client"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Checkout",

  description:
    "Selesaikan pesanan frozen food Anda dengan aman dan mudah.",
}

export default function CheckoutPage() {
  return <CheckoutClient />
}
