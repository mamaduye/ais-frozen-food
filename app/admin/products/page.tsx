import { products, categories } from "@/lib/data"
import { AdminProductsClient } from "./admin-products-client"

export default function AdminProductsPage() {
  return <AdminProductsClient initialProducts={products} categories={categories} />
}
