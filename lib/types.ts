// ============================================================================
// ENUMS - Status and Role Constants
// ============================================================================

export enum OrderStatus {
  PENDING = "pending",
  PAID = "paid",
  PROCESSED = "processed",
  SHIPPED = "shipped",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum PaymentStatus {
  PENDING = "pending",
  WAITING_VERIFICATION = "waiting_verification",
  COMPLETED = "completed",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export enum UserRole {
  CUSTOMER = "customer",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
}

export enum ProductStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DISCONTINUED = "discontinued",
}

// ============================================================================
// CORE ENTITIES - Categories, Products, Users
// ============================================================================

export type Category = {
  id: string
  name: string
  slug: string
  description: string
  image: string
  createdAt: string
  updatedAt: string
}

export type Product = {
  id: string
  name: string
  slug: string
  price: number
  categoryId: string
  categorySlug: string
  category: string
  shortDescription: string
  description: string
  images: string[]
  storage: string
  expiry: string
  weight: string
  stock: number
  rating: number
  reviewCount: number
  status: ProductStatus
  createdAt: string
  updatedAt: string
  createdBy?: string
  featured?: boolean
}

export type User = {
  joinedAt: string | number | Date
  id: string
  name: string
  email: string
  phone: string
  role: UserRole
  createdAt: string
  updatedAt: string
  ordersCount: number
  totalSpent: number
}

// ============================================================================
// REVIEWS - Product Reviews with User Relation
// ============================================================================

export type Review = {
  id: string
  productId: string
  userId: string
  userName: string
  userInitials: string
  rating: number
  comment: string
  orderId: string
  verified: boolean
  isHidden: boolean
  createdAt: string
  updatedAt: string
}

// ============================================================================
// ORDERS - Order and Order Items Relational Structure
// ============================================================================

export type OrderItem = {
  id: string
  orderId: string
  productId: string
  name: string
  price: number
  quantity: number
  subtotal: number
  createdAt: string
  updatedAt: string
}

export type Order = {
  id: string
  userId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  address: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  paymentMethod: "transfer" | "cod"
  paymentStatus: PaymentStatus
  orderStatus: OrderStatus
  notes?: string
  createdAt: string
  updatedAt: string
}

// ============================================================================
// CLIENT-SIDE ONLY - Cart Items
// ============================================================================

export type CartItem = {
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  weight: string
}

// ============================================================================
// Admin-Side Order Details - For Admin Order Management
// ============================================================================
export interface AdminOrder {
  id: string
  orderNumber: string

  customerName: string
  customerEmail: string
  customerPhone: string

  status: OrderStatus
  paymentStatus: PaymentStatus

  paymentMethod: "transfer" | "cod"

  paymentProof: string | null

  subtotal: number
  shipping: number
  total: number

  address: string

  paidAt: string | null
  date: string

  items: {
    productId: string
    name: string
    quantity: number
    price: number
  }[]
}