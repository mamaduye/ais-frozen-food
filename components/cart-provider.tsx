"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

import type { CartItem, Product } from "@/lib/types"
import { supabase } from "@/lib/supabase/client"

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

export function CartProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  /*
   * 1. Ambil user saat pertama kali aplikasi berjalan
   * 2. Dengarkan perubahan login/logout Supabase
   */
  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUserId(user?.id ?? null)
    }

    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUserId(session?.user?.id ?? null)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  /*
   * Load cart berdasarkan user
   */
  useEffect(() => {
    // Belum tahu user siapa
    if (userId === undefined) return

    // User logout
    if (!userId) {
      setItems([])
      setHydrated(true)
      return
    }

    const storageKey = `ais-cart-${userId}`

    try {
      const raw = localStorage.getItem(storageKey)

      if (raw) {
        setItems(JSON.parse(raw))
      } else {
        setItems([])
      }
    } catch (error) {
      console.error("[cart] hydrate error:", error)
      setItems([])
    }

    setHydrated(true)
  }, [userId])

  /*
   * Simpan cart hanya ke cart milik user aktif
   */
  useEffect(() => {
    if (!hydrated || !userId) return

    const storageKey = `ais-cart-${userId}`

    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify(items)
      )
    } catch (error) {
      console.error("[cart] persist error:", error)
    }
  }, [items, hydrated, userId])

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce(
      (acc, item) => acc + item.quantity,
      0
    )

    const subtotal = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    )

    return {
      items,

      itemCount,

      subtotal,

      addItem: (
        product,
        quantity = 1
      ) => {
        setItems((prev) => {
          const existing = prev.find(
            (item) =>
              item.productId === product.id
          )

          if (existing) {
            return prev.map((item) =>
              item.productId === product.id
                ? {
                    ...item,
                    quantity:
                      item.quantity + quantity,
                  }
                : item
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
        setItems((prev) =>
          prev.filter(
            (item) =>
              item.productId !== productId
          )
        )
      },

      updateQuantity: (
        productId,
        quantity
      ) => {
        setItems((prev) =>
          prev
            .map((item) =>
              item.productId === productId
                ? {
                    ...item,
                    quantity,
                  }
                : item
            )
            .filter(
              (item) =>
                item.quantity > 0
            )
        )
      },

      clearCart: () => {
        setItems([])
      },
    }
  }, [items])

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error(
      "useCart must be used within CartProvider"
    )
  }

  return context
}