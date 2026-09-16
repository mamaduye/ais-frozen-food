import type { MetadataRoute } from "next"
import { getProducts } from "@/lib/supabase/products"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://ais-frozen-food.vercel.app"

  const products = await getProducts()

  const safeDate = (value?: string) => {
  const date = new Date(value ?? "")

    return isNaN(date.getTime())
        ? new Date()
        : date
    }

  const productUrls = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: safeDate(product.updatedAt),    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },

    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },

    ...productUrls,
  ]
}