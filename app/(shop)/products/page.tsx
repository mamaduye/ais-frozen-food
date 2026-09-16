import { Suspense } from "react"
import { ProductsClient } from "./products-client"
import { getProducts } from "@/lib/supabase/products"
import { getCategories } from "@/lib/supabase/categories"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Produk",

  description:
    "Temukan berbagai pilihan frozen food berkualitas dari AIS Frozen Food. Nugget, dimsum, sosis, cireng, dan camilan beku favorit keluarga.",
}

export const revalidate = 1800
export default async function ProductsPage() {
  const products = await getProducts()
  const categories = await getCategories()

  return (
      <ProductsClient
          products={products}
          categories={categories}
      />
  )
}