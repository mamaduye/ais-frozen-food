"use server"

import { revalidatePath } from "next/cache"
import {
  createProduct,
  updateProduct,
} from "@/lib/supabase/admin-products"
import { deleteProduct } from "@/lib/supabase/admin-products"

type CreateProductInput = {
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

export async function createProductAction(
  data: CreateProductInput
) {
  const slug = data.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

  await createProduct({
    ...data,
    slug,
  })

  revalidatePath("/admin/products")
}

export async function updateProductAction(payload: {
  id: string
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
}) {
  await updateProduct(payload.id, {
    name: payload.name,
    price: payload.price,
    stock: payload.stock,
    categoryId: payload.categoryId,
    shortDescription: payload.shortDescription,
    description: payload.description,
    imageUrl: payload.imageUrl,
    weight: payload.weight,
    storage: payload.storage,
    expiry: payload.expiry,
  })

  revalidatePath("/admin/products")
}

export async function deleteProductAction(id: string) {
  await deleteProduct(id)
  revalidatePath("/admin/products")
}