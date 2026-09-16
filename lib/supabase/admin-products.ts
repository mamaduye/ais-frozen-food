import { createClient } from "./server"

export async function getAdminProducts() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
        *,
        categories (
        id,
        name,
        slug
        )
    `)
    .order("created_at", { ascending: false })

 if (error) throw error

  return data.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: Number(p.price),

    categoryId: p.category_id,
    category: p.categories?.name ?? "-",
    categorySlug: p.categories?.slug ?? "",

    shortDescription: p.short_description,
    description: p.description,

    images: p.image_url ? [p.image_url] : [],

    storage: p.storage,
    expiry: p.expiry,
    weight: p.weight,

    stock: p.stock,

    rating: Number(p.rating ?? 0),
    reviewCount: p.review_count ?? 0,

    status: p.status,

    featured: p.featured,

    createdAt: p.created_at,
    updatedAt: p.updated_at,
  }))
}

export async function createProduct(data: {
  name: string
  slug: string
  price: number
  stock: number
  categoryId: string
  shortDescription: string
  description: string
  imageUrl: string
  weight: string
}) {
  const supabase = await createClient()

  const { data: product, error } = await supabase
    .from("products")
    .insert({
      name: data.name,
      slug: data.slug,
      price: data.price,
      stock: data.stock,
      category_id: data.categoryId,
      short_description: data.shortDescription,
      description: data.description,
      image_url: data.imageUrl,
      weight: data.weight,

      storage: "Simpan pada suhu -18°C",
      expiry: "baik hingga 12 bulan",

      rating: 0,
      review_count: 0,

      featured: false,
      status: "active",
    })
    .select()
    .single()

  if (error) throw error

  return product
}

export async function updateProduct(
  id: string,
  payload: {
    name: string
    price: number
    stock: number
    categoryId: string
    shortDescription: string
    description: string
    imageUrl: string
    weight: string
    storage: string
    expiry: string
  }
) {
  const supabase = await createClient()

  const slug = payload.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

  const { error } = await supabase
    .from("products")
    .update({
      name: payload.name,
      slug,
      price: payload.price,
      stock: payload.stock,
      category_id: payload.categoryId,
      short_description: payload.shortDescription,
      description: payload.description,
      image_url: payload.imageUrl,
      weight: payload.weight,
      storage: payload.storage,
      expiry: payload.expiry,
    })
    .eq("id", id)

  if (error) throw error
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)

  if (error) throw error
}
