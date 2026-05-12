# AIS Frozen Food - E-Commerce Platform
**Project Progress & Technical Documentation**

---

## 📋 Project Overview

**Project Name:** AIS Frozen Food E-Commerce Platform  
**Status:** Frontend Implementation 80% Complete | Backend Integration Required  
**Description:** Full-stack e-commerce platform for selling premium frozen food products (nuggets, dimsum, sosis, bakso, kebab, seafood) with customer storefront and admin management dashboard.

**Target Users:**
- Customers: Browse & purchase frozen food products
- Admins: Manage products, orders, users, reviews, and generate reports

---

## 🛠 Tech Stack & Dependencies

### Core Framework
- **Next.js 16.2.4** - React framework with App Router (file-based routing)
- **React 19** - UI library
- **TypeScript 5.7.3** - Type safety

### Styling & UI
- **Tailwind CSS 4.2.0** - Utility-first CSS framework with Tailwind v4 configuration
- **shadcn/ui (56+ components)** - Pre-built, accessible UI components based on Radix UI
  - New-york style preset
  - Components include: Button, Card, Dialog, Form, Table, Tabs, Badge, Avatar, Accordion, Select, Popover, Sheet, Drawer, Toast, Calendar, Carousel, Checkbox, Radio, Switch, etc.

### Design System & Theming
- **Design Tokens (CSS Variables)** - Custom theme system defined in `globals.css`
- **Color Palette:** 
  - **Primary:** Cool frozen blue (oklch(0.62 0.13 235))
  - **Secondary:** Light blue-gray (oklch(0.96 0.015 235))
  - **Accent:** Deep navy (oklch(0.32 0.07 250))
  - **Background:** White (light), Dark slate (dark)
  - **Status Colors:** Yellow (pending), Blue (paid), Purple (processed), Orange (shipped), Green (completed), Red (cancelled)

### Fonts
- **Inter** - System font (body text)
- **Plus Jakarta Sans** - Display font (headings)

### Form & Validation
- **react-hook-form 7.54.1** - Form state management
- **@hookform/resolvers 3.9.1** - Form validation resolvers
- **zod 3.24.1** - Schema validation library

### Data Visualization
- **recharts 2.15.0** - Chart library for admin reports
- **Chart components:** BarChart, LineChart, PieChart for sales data

### Utilities & Libraries
- **lucide-react 0.564.0** - Icon library (200+ icons)
- **date-fns 4.1.0** - Date manipulation
- **sonner 1.7.1** - Toast notifications
- **class-variance-authority 0.7.1** - CSS class utilities
- **clsx, tailwind-merge** - Class name utilities
- **cmdk 1.1.1** - Command menu component
- **embla-carousel-react 8.6.0** - Carousel component
- **react-resizable-panels 2.1.7** - Resizable panel layouts
- **vaul 1.1.2** - Drawer animations
- **next-themes 0.4.6** - Theme management (ready for dark mode)

### Monitoring & Analytics
- **@vercel/analytics 1.6.1** - Vercel analytics integration

### Full Dependency List
```json
{
  "@hookform/resolvers": "^3.9.1",
  "@radix-ui/*": "latest",
  "@vercel/analytics": "1.6.1",
  "autoprefixer": "^10.4.20",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "cmdk": "1.1.1",
  "date-fns": "4.1.0",
  "embla-carousel-react": "8.6.0",
  "input-otp": "1.4.2",
  "lucide-react": "^0.564.0",
  "next": "16.2.4",
  "next-themes": "^0.4.6",
  "react": "^19",
  "react-day-picker": "9.13.2",
  "react-dom": "^19",
  "react-hook-form": "^7.54.1",
  "react-resizable-panels": "^2.1.7",
  "recharts": "2.15.0",
  "sonner": "^1.7.1",
  "tailwind-merge": "^3.3.1",
  "vaul": "^1.1.2",
  "zod": "^3.24.1"
}
```

---

## 🎨 Styling & Theme Configuration

### Design System
- **Color System:** 3-5 colors total (Primary blue, Secondary light-blue, Accent navy, neutrals, destructive red)
- **Typography:** 2 fonts maximum (Inter + Plus Jakarta Sans)
- **Layout:** Mobile-first approach with Tailwind responsive prefixes (md:, lg:)
- **Spacing:** Uses Tailwind spacing scale (p-4, gap-4, mx-2, py-6, etc.)
- **Grid System:** Flexbox-first layout method

### CSS Custom Properties (Variables)
Located in `/app/globals.css`:
- `--background`, `--foreground` - Base colors
- `--primary`, `--secondary`, `--accent` - Theme colors
- `--destructive` - Error/danger color
- `--muted` - Secondary text/disabled state
- `--border`, `--input`, `--ring` - Input elements
- `--chart-1` to `--chart-5` - Chart colors
- `--radius` - Border radius (0.75rem)
- **Dark mode support:** Separate `:root.dark` CSS variables

### Font Configuration
```typescript
// layout.tsx
import { Inter, Plus_Jakarta_Sans } from "next/font/google"
const inter = Inter({ variable: "--font-sans" })
const display = Plus_Jakarta_Sans({ variable: "--font-display" })
```

### Tailwind v4 Configuration
```css
/* globals.css */
@import 'tailwindcss';
@import 'tw-animate-css';

@theme inline {
  --font-sans: 'Inter', 'Fallback';
  --font-mono: 'Inter', 'Fallback';
  --radius-sm/md/lg/xl: calculated from --radius variable
}
```

---

## 💾 Database & Backend Integration

### Current State
**Status:** ❌ NOT YET INTEGRATED  
**Current Data:** Mock data stored in `/lib/data.ts` (client-side only)

### Database Schema Requirements

#### 1. **Products Table**
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  category_id UUID REFERENCES categories(id),
  price INTEGER NOT NULL,
  short_description TEXT,
  description TEXT,
  images JSONB, -- Array of image URLs
  storage VARCHAR(100), -- e.g., "Freezer -20°C"
  expiry VARCHAR(100), -- e.g., "12 months"
  weight VARCHAR(100), -- e.g., "1kg"
  stock INTEGER NOT NULL DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 2. **Categories Table**
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. **Users Table**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password_hash VARCHAR(255),
  joined_at TIMESTAMP DEFAULT NOW(),
  is_admin BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true
);
```

#### 4. **Orders Table**
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(20),
  address TEXT,
  subtotal INTEGER,
  shipping INTEGER,
  total INTEGER,
  payment_method VARCHAR(50), -- 'transfer' or 'cod'
  status VARCHAR(50), -- 'pending', 'paid', 'processed', 'shipped', 'completed', 'cancelled'
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 5. **Order Items Table**
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  product_name VARCHAR(255),
  price INTEGER,
  quantity INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 6. **Reviews Table**
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY,
  product_id UUID REFERENCES products(id),
  user_id UUID REFERENCES users(id),
  user_name VARCHAR(255),
  user_initials VARCHAR(5),
  rating INTEGER, -- 1-5
  comment TEXT,
  is_verified BOOLEAN DEFAULT false, -- Only from completed orders
  is_hidden BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Recommended Database Solutions
1. **Supabase (PostgreSQL)** - Recommended
   - Free tier with Auth, Postgres, Realtime
   - Built-in Row Level Security (RLS)
   - Perfect for auth + database together
   
2. **Neon (PostgreSQL)** - Alternative
   - Serverless PostgreSQL
   - Great developer experience
   - Good for scaling

3. **AWS Aurora PostgreSQL/DSQL** - Enterprise
   - High availability
   - Advanced features

### Environment Variables (TO BE SET)
```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/database
DB_HOST=
DB_PORT=5432
DB_NAME=ais_frozen_food
DB_USER=
DB_PASSWORD=

# Authentication (for NextAuth/Custom Auth)
AUTH_SECRET=
JWT_SECRET=

# Optional: Third-party services
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
WHATSAPP_BUSINESS_API_KEY=
```

⚠️ **CRITICAL:** Do NOT commit environment variables. Use `.env.local` (git-ignored).

---

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx                 # Root layout (fonts, providers, metadata)
│   ├── globals.css                # Design tokens & Tailwind config
│   ├── (shop)/                    # Customer-facing routes
│   │   ├── layout.tsx             # Shop layout (header, footer, cart provider)
│   │   ├── page.tsx               # Home page (hero, categories, featured products)
│   │   ├── products/
│   │   │   ├── page.tsx           # Products listing (with filters, search, pagination)
│   │   │   ├── products-client.tsx # Client-side filter logic
│   │   │   └── [slug]/
│   │   │       ├── page.tsx       # Product detail page
│   │   │       ├── product-detail-client.tsx # Add-to-cart, image gallery
│   │   │       └── product-reviews.tsx # Reviews display
│   │   ├── cart/
│   │   │   ├── page.tsx           # Cart page
│   │   │   └── cart-client.tsx    # Cart management (add/remove/quantity)
│   │   ├── checkout/
│   │   │   ├── page.tsx           # Checkout page
│   │   │   └── checkout-client.tsx # Form (address, payment method)
│   │   └── orders/
│   │       ├── page.tsx           # Customer orders history
│   │       └── orders-client.tsx  # Order list & tracking
│   ├── (auth)/                    # Authentication routes
│   │   ├── layout.tsx             # Auth layout
│   │   ├── login/
│   │   │   ├── page.tsx
│   │   │   └── login-form.tsx
│   │   └── register/
│   │       ├── page.tsx
│   │       └── register-form.tsx
│   └── admin/                     # Admin dashboard routes
│       ├── layout.tsx             # Admin layout with sidebar
│       ├── page.tsx               # Dashboard overview (KPIs, charts)
│       ├── products/
│       │   ├── page.tsx
│       │   └── admin-products-client.tsx # Add/edit/delete products
│       ├── orders/
│       │   ├── page.tsx           # Orders list with filters
│       │   ├── admin-orders-client.tsx
│       │   └── [id]/
│       │       ├── page.tsx
│       │       └── admin-order-detail-client.tsx # View/update order status
│       ├── users/
│       │   ├── page.tsx           # User list
│       │   └── [id]/page.tsx      # User detail + order history
│       ├── reviews/
│       │   ├── page.tsx
│       │   └── admin-reviews-client.tsx # Approve/hide reviews
│       └── reports/
│           └── page.tsx           # Sales reports & analytics
├── components/
│   ├── ui/                        # shadcn/ui components (56 files)
│   ├── site-header.tsx            # Navigation bar with logo, search, cart icon
│   ├── site-footer.tsx            # Footer with links & info
│   ├── cart-provider.tsx          # Cart context provider (useCart hook)
│   ├── product-card.tsx           # Product card component (reusable)
│   ├── whatsapp-button.tsx        # WhatsApp floating button
│   ├── order-status-badge.tsx     # Status badge component
│   └── admin/
│       ├── admin-shell.tsx        # Admin sidebar navigation
│       ├── admin-sales-chart.tsx  # Revenue chart component
│       └── admin-order-detail-client.tsx
├── lib/
│   ├── types.ts                   # TypeScript interfaces (Category, Product, User, Order, Review, etc.)
│   ├── data.ts                    # Mock data (products, orders, users, reviews)
│   └── utils.ts                   # Utility functions (cn for class merging)
├── public/
│   ├── hero-frozen-food.jpg       # Generated hero image
│   └── [other assets]
├── package.json                   # Dependencies & scripts
├── tsconfig.json                  # TypeScript config
├── next.config.mjs                # Next.js config
└── tailwind.config.ts             # Tailwind config (not used in v4, use globals.css instead)
```

---

## 🧩 Components Built

### Shared Components (Reusable)
| Component | Location | Purpose |
|-----------|----------|---------|
| `SiteHeader` | `/components/site-header.tsx` | Navigation, logo, search, cart icon, user menu |
| `SiteFooter` | `/components/site-footer.tsx` | Footer with links, contact info |
| `ProductCard` | `/components/product-card.tsx` | Product display (image, name, price, rating, "add to cart" button) |
| `WhatsAppButton` | `/components/whatsapp-button.tsx` | Floating WhatsApp button |
| `OrderStatusBadge` | `/components/order-status-badge.tsx` | Status indicator with color coding |
| `CartProvider` | `/components/cart-provider.tsx` | Cart state management (Context API) |
| `AdminShell` | `/components/admin/admin-shell.tsx` | Admin sidebar with navigation |
| `AdminSalesChart` | `/components/admin/admin-sales-chart.tsx` | Revenue bar chart (Recharts) |

### shadcn/ui Components (56 Total)
**Buttons & Forms:**
Button, ButtonGroup, Input, Textarea, Checkbox, Radio, Switch, Select, Combobox (Command), Label, Field, Input-Group

**Layout & Containers:**
Card, Dialog, Sheet, Drawer, Popover, HoverCard, Alert, Empty, Accordion, Collapsible, Separator

**Data Display:**
Table, Badge, Avatar, Pagination, Carousel, Breadcrumb, Item, KBD, Skeleton

**Navigation:**
Tabs, Toggle, Toggle-Group, Navigation-Menu, Menubar, Context-Menu, Dropdown-Menu

**Feedback:**
Toast, Sonner (toast library), Progress, Slider

**Advanced:**
DatePicker (Calendar), OTP Input, Resizable Panels, Scroll-Area, Aspect-Ratio

---

## ✅ Features Completed (Frontend)

### Customer Storefront - COMPLETE
- ✅ **Home Page** 
  - Hero section with call-to-action
  - Category showcase (Nugget, Dimsum, Sosis, Bakso, Kebab, Seafood)
  - Featured products carousel
  - Trust badges

- ✅ **Product Listing Page**
  - Product grid (responsive)
  - Filter by category
  - Search functionality
  - Sort by price/rating
  - Pagination
  - Product cards with images, names, prices, ratings

- ✅ **Product Detail Page**
  - Image gallery (multiple images)
  - Product info (name, price, rating, reviews, weight, storage, expiry)
  - Add to cart (with quantity selector)
  - Product reviews section
  - Related products
  - Stock indicator

- ✅ **Shopping Cart**
  - Add/remove items
  - Update quantities
  - Calculate subtotal
  - Persistent cart (localStorage)
  - "Continue shopping" button

- ✅ **Checkout Page**
  - Order review (items, subtotal, shipping)
  - Customer info form (name, email, phone, address)
  - Payment method selection (Transfer / COD)
  - Order total calculation
  - Validation

- ✅ **Order History**
  - Customer's past orders list
  - Order status tracking
  - Order detail view
  - Order items list with prices
  - Payment info display

- ✅ **Authentication Pages**
  - Login form (email, password)
  - Register form (name, email, password, confirmation)
  - Form validation
  - Error messages

- ✅ **Navigation & UI**
  - Header with navigation, search bar, cart icon
  - Footer with links
  - WhatsApp floating button
  - Responsive design (mobile, tablet, desktop)
  - Status badges with color coding

### Admin Dashboard - COMPLETE
- ✅ **Dashboard Overview**
  - KPI cards (Total Orders, Revenue, Customers, Reviews)
  - Sales chart (daily revenue)
  - Recent orders table
  - Top selling products
  - Quick actions

- ✅ **Products Management**
  - Product list with table
  - Add new product
  - Edit product (name, price, category, stock, images)
  - Delete product
  - Search & filter

- ✅ **Orders Management**
  - Orders list with status filter
  - View order details
  - Update order status (pending → paid → processed → shipped → completed)
  - Cancel order (if not yet processed)
  - Customer info display
  - Order items list
  - Payment method display

- ✅ **User Management**
  - Users list table
  - View user detail page
  - User's order history
  - User stats (orders count, total spent, joined date)

- ✅ **Reviews Management**
  - Display all product reviews
  - Mark as verified/unverified
  - Hide/show reviews (moderation)
  - Delete reviews
  - Filter by rating, product

- ✅ **Reports & Analytics**
  - Total revenue (calculated from orders)
  - Best-selling products (rank by quantity)
  - Daily sales breakdown
  - Revenue by payment method
  - Customer growth metrics
  - Charts using Recharts

### Design & UX - COMPLETE
- ✅ Custom design system with CSS variables
- ✅ Frozen-themed blue color palette
- ✅ Responsive design (mobile-first)
- ✅ Accessibility features (ARIA labels, semantic HTML)
- ✅ Form validation with error messages
- ✅ Toast notifications (Sonner)
- ✅ Loading states & spinners
- ✅ Dark mode structure (ready for implementation)

---

## ⚠️ Features Requiring Backend Integration

### Critical (Blocking Features)

#### 1. **Authentication & User Management** 🔒
**Current State:** Forms built, no backend integration  
**What's Needed:**
- [ ] Implement user registration API endpoint
  - Hash passwords (bcrypt)
  - Validate email uniqueness
  - Return JWT or session token
  
- [ ] Implement login API endpoint
  - Validate credentials
  - Return auth token
  - Set secure HTTP-only cookies
  
- [ ] Session/Auth middleware
  - Protect admin routes
  - Verify JWT tokens
  - Redirect unauthorized users
  
- [ ] User profile API
  - Get current user
  - Update user info

**Files to Update:**
- `/app/(auth)/login/login-form.tsx` - Add API call
- `/app/(auth)/register/register-form.tsx` - Add API call
- Create `/app/api/auth/` routes (register, login, logout)
- Create auth middleware for protected routes

---

#### 2. **Product Management** 📦
**Current State:** Mock data in `/lib/data.ts`  
**What's Needed:**
- [ ] GET `/api/products` - Fetch all products with filters
- [ ] GET `/api/products/[slug]` - Fetch single product detail
- [ ] POST `/api/products` - Create product (admin only)
  - Accept: name, price, category, description, images, stock, etc.
  - Validate image uploads (Vercel Blob or S3)
  - Return created product
  
- [ ] PUT `/api/products/[id]` - Update product (admin only)
- [ ] DELETE `/api/products/[id]` - Delete product (admin only)
- [ ] GET `/api/categories` - Fetch all categories

**Database Queries Needed:**
```sql
SELECT * FROM products ORDER BY created_at DESC;
SELECT * FROM products WHERE slug = ? LIMIT 1;
SELECT * FROM products WHERE category_id = ?;
SELECT * FROM products WHERE featured = true;
```

**Files to Update:**
- Create `/app/api/products/` routes
- Update `/app/(shop)/products/page.tsx` - Connect to API
- Update `/app/(shop)/products/[slug]/page.tsx` - Connect to API
- Update `/app/admin/products/` - Connect to API

---

#### 3. **Shopping Cart & Checkout** 🛒
**Current State:** Client-side localStorage only  
**What's Needed:**
- [ ] POST `/api/orders` - Create new order
  - Accept: items[], customerInfo, paymentMethod
  - Create order record in database
  - Create order_items records
  - Validate stock availability
  - Return order ID
  
- [ ] Payment processing integration
  - Stripe integration (optional)
  - Handle COD (Cash on Delivery)
  - Payment status webhook
  
- [ ] GET `/api/orders/[id]` - Fetch order detail
- [ ] PUT `/api/orders/[id]` - Update order status

**Database Queries Needed:**
```sql
INSERT INTO orders (...) VALUES (...);
INSERT INTO order_items (...) VALUES (...);
UPDATE orders SET status = ? WHERE id = ?;
SELECT * FROM orders WHERE id = ?;
SELECT * FROM order_items WHERE order_id = ?;
```

**Files to Update:**
- Create `/app/api/orders/` routes
- `/app/(shop)/checkout/checkout-client.tsx` - POST to `/api/orders`
- `/app/(shop)/orders/orders-client.tsx` - GET from `/api/orders`

---

#### 4. **Reviews System** ⭐
**Current State:** Mock reviews displayed, no creation/moderation  
**What's Needed:**
- [ ] POST `/api/reviews` - Create product review
  - Only allow verified reviews (from completed orders)
  - Accept: productId, rating, comment
  - Validate product exists
  - Return review ID
  
- [ ] GET `/api/products/[id]/reviews` - Fetch product reviews
- [ ] GET `/api/reviews` - All reviews (admin)
- [ ] PUT `/api/reviews/[id]` - Hide/approve review (admin)
  - Update `is_hidden`, `is_verified` flags
  
- [ ] DELETE `/api/reviews/[id]` - Delete review (admin)
- [ ] Update product rating calculation
  - Recalculate `rating` and `review_count` on review create/delete

**Database Queries Needed:**
```sql
INSERT INTO reviews (...) VALUES (...);
SELECT * FROM reviews WHERE product_id = ? AND is_hidden = false;
UPDATE reviews SET is_hidden = true/false WHERE id = ?;
DELETE FROM reviews WHERE id = ?;
UPDATE products SET rating = ?, review_count = ? WHERE id = ?;
```

**Files to Update:**
- Create `/app/api/reviews/` routes
- `/app/(shop)/products/[slug]/product-reviews.tsx` - Add review form
- `/app/admin/reviews/admin-reviews-client.tsx` - Connect to API

---

### Important (Core Functionality)

#### 5. **Admin Dashboard Real Data** 📊
**Current State:** Charts show mock data  
**What's Needed:**
- [ ] GET `/api/admin/stats` - KPI metrics
  - Total orders, revenue, customers, reviews
  - Aggregated from database
  
- [ ] GET `/api/admin/sales-chart` - Daily sales data
  - Time range parameter
  - Group by date
  
- [ ] GET `/api/admin/best-sellers` - Top products
  - Order by quantity sold
  - Limit top 5-10

**Files to Update:**
- `/app/admin/page.tsx` - Fetch `/api/admin/stats` & charts
- `/app/admin/reports/page.tsx` - Connect to real data

---

#### 6. **Order Management** 📋
**Current State:** Display mock orders, status updates simulated  
**What's Needed:**
- [ ] GET `/api/orders` - List all orders (with filters, pagination)
  - Filter by status, date range
  - Pagination (limit, offset)
  
- [ ] PUT `/api/orders/[id]` - Update order status
  - Validate status transitions
  - Allow cancel only if pending/paid

**Files to Update:**
- `/app/admin/orders/admin-orders-client.tsx` - Connect to API
- `/app/admin/orders/[id]/admin-order-detail-client.tsx` - Connect to API

---

### Nice to Have (Enhancement Features)

- [ ] Email notifications (order confirmation, status updates)
- [ ] SMS notifications (WhatsApp integration for order alerts)
- [ ] Product image uploads (Vercel Blob or AWS S3)
- [ ] Advanced search (Elasticsearch, Typesense)
- [ ] Wishlist/favorites feature
- [ ] Coupon/discount codes
- [ ] Inventory management with low-stock alerts
- [ ] Customer reviews email verification
- [ ] Admin email digests
- [ ] Google Analytics integration
- [ ] SEO optimization (meta tags per product)
- [ ] Inventory history logs
- [ ] Bulk product import (CSV)
- [ ] Automated refunds
- [ ] Shipping integration (RajaOngkir, etc.)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (recommend v20 LTS)
- npm, yarn, pnpm, or bun package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ais-frozen-food
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or: npm install / yarn install / bun install
   ```

3. **Set environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your database, auth, and API keys
   ```

4. **Run development server**
   ```bash
   pnpm dev
   # Runs on http://localhost:3000
   ```

5. **Build for production**
   ```bash
   pnpm build
   pnpm start
   ```

---

## 📋 API Routes To Implement (Checklist)

### Authentication
- [ ] `POST /api/auth/register` - User registration
- [ ] `POST /api/auth/login` - User login
- [ ] `POST /api/auth/logout` - User logout
- [ ] `GET /api/auth/me` - Get current user

### Products
- [ ] `GET /api/products` - List products (with filters)
- [ ] `GET /api/products/[slug]` - Get product detail
- [ ] `POST /api/products` - Create product (admin)
- [ ] `PUT /api/products/[id]` - Update product (admin)
- [ ] `DELETE /api/products/[id]` - Delete product (admin)
- [ ] `GET /api/categories` - List categories

### Cart & Orders
- [ ] `POST /api/orders` - Create order
- [ ] `GET /api/orders` - List user orders
- [ ] `GET /api/orders/[id]` - Get order detail
- [ ] `PUT /api/orders/[id]` - Update order status
- [ ] `PUT /api/orders/[id]/cancel` - Cancel order

### Reviews
- [ ] `GET /api/reviews` - List reviews (with filters)
- [ ] `GET /api/products/[id]/reviews` - Get product reviews
- [ ] `POST /api/reviews` - Create review
- [ ] `PUT /api/reviews/[id]` - Update review (hide/approve)
- [ ] `DELETE /api/reviews/[id]` - Delete review

### Admin
- [ ] `GET /api/admin/stats` - Dashboard KPIs
- [ ] `GET /api/admin/sales-chart` - Sales data
- [ ] `GET /api/admin/best-sellers` - Top products
- [ ] `GET /api/admin/users` - List users

---

## 📊 Data Models (TypeScript Types)

All defined in `/lib/types.ts`:

```typescript
type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  shortDescription: string;
  description: string;
  images: string[];
  storage: string;
  expiry: string;
  weight: string;
  stock: number;
  rating: number;
  reviewCount: number;
  featured?: boolean;
}

type Review = {
  id: string;
  productId: string;
  userName: string;
  userInitials: string;
  rating: number;
  comment: string;
  date: string;
}

type CartItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  weight: string;
}

type OrderStatus = 'pending' | 'paid' | 'processed' | 'shipped' | 'completed' | 'cancelled'

type Order = {
  id: string;
  date: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  items: { productId: string; name: string; price: number; quantity: number }[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: 'transfer' | 'cod';
  status: OrderStatus;
}

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedAt: string;
  ordersCount: number;
  totalSpent: number;
}
```

---

## 🔄 Next Steps Roadmap

### Phase 1: Backend Infrastructure (Week 1-2)
1. Set up database (PostgreSQL on Supabase/Neon)
2. Create database tables & migrations
3. Set up authentication system (NextAuth.js or custom with bcrypt)
4. Environment variables configuration

### Phase 2: API Routes (Week 2-3)
1. Implement auth API (register, login, middleware)
2. Implement product API (CRUD)
3. Implement order API (create, read, update status)
4. Implement review API

### Phase 3: Frontend Integration (Week 3-4)
1. Connect login/register forms to auth API
2. Connect product pages to product API
3. Connect checkout to order API
4. Connect admin dashboard to API
5. Add error handling & loading states

### Phase 4: Testing & Deployment (Week 4-5)
1. Unit tests (components, utilities)
2. Integration tests (API + frontend)
3. E2E tests (critical user flows)
4. Bug fixes & optimizations
5. Deploy to Vercel

### Phase 5: Enhancements (Optional)
1. Payment processing (Stripe/Midtrans)
2. Email notifications
3. Advanced analytics
4. Performance optimization

---

## 🐛 Debugging & Development Tips

### Console Logging
```typescript
// Use for debugging
console.log("[v0] Variable name:", variableName)
// Remove after debugging
```

### Common Issues

**Issue:** Components not rendering
- Check if page is using `'use client'` for interactive features
- Verify imports are correct
- Check TypeScript errors

**Issue:** Cart data not persisting
- Currently uses localStorage (client-side only)
- Need to implement database persistence in Phase 2

**Issue:** Styling issues
- Check Tailwind classes applied
- Verify CSS variables in globals.css
- Use DevTools to inspect classes

### Environment Setup Checklist
- [ ] Database created (PostgreSQL)
- [ ] Environment variables in `.env.local`
- [ ] Auth system configured
- [ ] Upload storage (for product images)
- [ ] Email service (for notifications, optional)

---

## 📞 Support & Questions

For clarification on:
- **Database Schema:** See "Database & Backend Integration" section
- **Component Usage:** Check component files in `/components/`
- **Page Structure:** Review `/app/` directory
- **API Contracts:** See "API Routes To Implement" checklist
- **Design System:** Review `/app/globals.css` for colors and tokens

---

## 📝 Notes

- **Security:** Ensure all passwords are hashed, use HTTPS, validate all inputs
- **Performance:** Implement pagination, lazy loading, image optimization
- **Accessibility:** All components follow WCAG 2.1 AA standards
- **Scalability:** Design database indexes for common queries
- **Testing:** Write tests for API routes and critical components

---

**Last Updated:** May 2026  
**Status:** Frontend 80% complete, awaiting backend integration  
**Next: Database & API Implementation**
