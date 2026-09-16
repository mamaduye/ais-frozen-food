import { createClient } from "./server"

export async function getCategories() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name")

  if (error) throw error

  return data
}

export async function getCategoriesWithImages() {
  const supabase = await createClient()

  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select("*")
    .order("name")

  if (categoriesError) throw categoriesError

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("category_id, image_url")

  if (productsError) throw productsError

  return categories.map((category) => {
    const product = products.find(
      (product) =>
        product.category_id === category.id &&
        product.image_url
    )

    return {
      ...category,
      image: product?.image_url ?? "/placeholder.svg",
    }
  })
}