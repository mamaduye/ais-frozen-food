import { CartClient } from "./cart-client"
import type { Metadata } from "next"


export const metadata: Metadata = {
  title: "Keranjang",

  description:
    "Lihat produk yang telah Anda tambahkan ke keranjang belanja AIS Frozen Food.",
}

export default function CartPage() {
  return <CartClient />
}
