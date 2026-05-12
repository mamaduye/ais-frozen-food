import { Suspense } from "react"
import { ProductsClient } from "./products-client"

export const metadata = {
  title: "All Products — AIS Frozen Food",
  description: "Browse our full range of premium frozen snacks and ready-to-cook meals.",
}

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsClient />
    </Suspense>
  )
}
