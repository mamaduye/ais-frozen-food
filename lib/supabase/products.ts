import { supabase } from "./client"
import type { Product } from "@/lib/types"
import { cache } from "react"

export const getProducts = cache(async (): Promise<Product[]> => {
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

  if (error) throw error

  return data.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: Number(p.price),

    categoryId: p.category_id,
    category: p.categories?.name ?? "Uncategorized",
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

    createdAt: p.created_at,
    updatedAt: p.updated_at,

    featured: p.featured,
  }))
})

export const getProductBySlug = cache(
  async (slug: string): Promise<Product | null> => {
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
    .eq("slug", slug)
    .single()

  if (error) throw error

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    price: Number(data.price),

    categoryId: data.category_id,
    category: data.categories?.name ?? "Uncategorized",
    categorySlug: data.categories?.slug ?? "",
    shortDescription: data.short_description,
    description: data.description,

    images: data.image_url ? [data.image_url] : [],

    storage: data.storage,
    expiry: data.expiry,
    weight: data.weight,

    stock: data.stock,

    rating: Number(data.rating ?? 0),
    reviewCount: data.review_count ?? 0,

    status: data.status,

    createdAt: data.created_at,
    updatedAt: data.updated_at,

    featured: data.featured,
  }
})