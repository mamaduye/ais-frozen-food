"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import type { CartItem, Product } from "@/lib/types"

type CartContextValue = {
  items: CartItem[]
  itemCount: number
  subtotal: number
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

const STORAGE_KEY = "ais-cart"

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch (err) {
      console.log("[v0] cart hydrate error:", err)
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (err) {
      console.log("[v0] cart persist error:", err)
    }
  }, [items, hydrated])

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((acc, i) => acc + i.quantity, 0)
    const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0)

    return {
      items,
      itemCount,
      subtotal,
      addItem: (product, quantity = 1) => {
        setItems((prev) => {
          const existing = prev.find((i) => i.productId === product.id)
          if (existing) {
            return prev.map((i) =>
              i.productId === product.id
                ? { ...i, quantity: i.quantity + quantity }
                : i,
            )
          }
          return [
            ...prev,
            {
              productId: product.id,
              name: product.name,
              price: product.price,
              image: product.images[0],
              quantity,
              weight: product.weight,
            },
          ]
        })
      },
      removeItem: (productId) => {
        setItems((prev) => prev.filter((i) => i.productId !== productId))
      },
      updateQuantity: (productId, quantity) => {
        setItems((prev) =>
          prev
            .map((i) => (i.productId === productId ? { ...i, quantity } : i))
            .filter((i) => i.quantity > 0),
        )
      },
      clearCart: () => setItems([]),
    }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
