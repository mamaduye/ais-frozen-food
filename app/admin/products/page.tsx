import { AdminProductsClient } from "./admin-products-client"
import { getAdminProducts } from "@/lib/supabase/admin-products"
import { getCategories } from "@/lib/supabase/categories"

export default async function AdminProductsPage() {
  const products = await getAdminProducts()
  const categories = await getCategories()

  return (
    <AdminProductsClient
      initialProducts={products}
      categories={categories}
    />
  )
}