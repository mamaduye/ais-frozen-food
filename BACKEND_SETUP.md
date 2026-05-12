# Backend Setup Guide

## Database Setup

### Option 1: Supabase (Recommended for Beginners)

1. **Create Account & Project**
   ```bash
   Visit: https://app.supabase.com
   Sign up → Create new project
   ```

2. **Get Connection Info**
   - Go to Settings → Database → Connection string
   - Copy PostgreSQL URI
   - Set as `DATABASE_URL` in `.env.local`

3. **Run SQL Migrations**
   - Go to SQL Editor in Supabase dashboard
   - Create these tables:

```sql
-- Categories
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT now()
);

-- Products
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  category_id UUID REFERENCES public.categories(id),
  price INTEGER NOT NULL,
  short_description TEXT,
  description TEXT,
  images JSONB DEFAULT '[]',
  storage VARCHAR(100),
  expiry VARCHAR(100),
  weight VARCHAR(100),
  stock INTEGER NOT NULL DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Users (Supabase Auth handles auth_users, this is for profile)
CREATE TABLE public.users (
  id UUID PRIMARY KEY,
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  joined_at TIMESTAMP DEFAULT now(),
  is_admin BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true
);

-- Orders
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(20),
  address TEXT,
  subtotal INTEGER,
  shipping INTEGER,
  total INTEGER,
  payment_method VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Order Items
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  product_name VARCHAR(255),
  price INTEGER,
  quantity INTEGER,
  created_at TIMESTAMP DEFAULT now()
);

-- Reviews
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id),
  user_name VARCHAR(255),
  user_initials VARCHAR(5),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_hidden BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
```

4. **Enable Row Level Security (RLS)**
   ```sql
   -- Allow public to read products
   ALTER TABLE products ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "public_read_products" ON products
     FOR SELECT USING (true);

   -- Allow public to read categories
   ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "public_read_categories" ON categories
     FOR SELECT USING (true);

   -- Allow users to read own orders
   ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "users_read_own_orders" ON orders
     FOR SELECT USING (auth.uid() = user_id);

   -- Allow admins to manage all data
   CREATE POLICY "admin_all" ON products FOR ALL
     USING ((SELECT is_admin FROM users WHERE id = auth.uid()));
   ```

---

### Option 2: Neon (PostgreSQL)

1. **Create Account & Database**
   ```bash
   Visit: https://console.neon.tech
   Sign up → Create new project
   ```

2. **Get Connection String**
   - Copy the connection string
   - Add to `.env.local`: `DATABASE_URL=postgresql://...`

3. **Run SQL Migrations**
   - Use Neon Console → SQL Editor
   - Run the same SQL schema from Option 1

---

## Environment Variables

Create `.env.local` file:

```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/db

# NextAuth (if using NextAuth.js)
AUTH_SECRET=your_random_secret_here
NEXTAUTH_URL=http://localhost:3000

# Vercel (for image uploads, optional)
BLOB_STORAGE_KEY=your_vercel_blob_key

# Optional: External APIs
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
WHATSAPP_API_KEY=...
```

---

## API Route Structure

Create these files in `/app/api/`:

### Auth Routes
```
/app/api/auth/
├── register/route.ts      POST /api/auth/register
├── login/route.ts         POST /api/auth/login
├── logout/route.ts        POST /api/auth/logout
└── me/route.ts            GET  /api/auth/me
```

### Product Routes
```
/app/api/products/
├── route.ts               GET  /api/products (list, filter)
│                         POST /api/products (create - admin)
├── [slug]/
│   └── route.ts           GET  /api/products/[slug]
├── [id]/
│   └── route.ts           PUT  /api/products/[id] (update - admin)
│                         DELETE /api/products/[id] (delete - admin)
└── categories/
    └── route.ts           GET  /api/products/categories
```

### Order Routes
```
/app/api/orders/
├── route.ts               GET  /api/orders (list user orders)
│                         POST /api/orders (create)
└── [id]/
    ├── route.ts           GET  /api/orders/[id]
    │                     PUT  /api/orders/[id] (update status)
    └── cancel/route.ts    PUT  /api/orders/[id]/cancel
```

### Review Routes
```
/app/api/reviews/
├── route.ts               GET  /api/reviews (list)
│                         POST /api/reviews (create)
└── [id]/
    ├── route.ts           PUT  /api/reviews/[id] (update)
    │                     DELETE /api/reviews/[id] (delete)
    └── hide/route.ts      PUT  /api/reviews/[id]/hide
```

### Admin Routes
```
/app/api/admin/
├── stats/route.ts         GET  /api/admin/stats (KPIs)
├── sales-chart/route.ts   GET  /api/admin/sales-chart
├── best-sellers/route.ts  GET  /api/admin/best-sellers
└── users/route.ts         GET  /api/admin/users
```

---

## Example API Route Implementation

### POST /api/auth/register

```typescript
// /app/api/auth/register/route.ts
import { hash } from 'bcryptjs';
import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Check if user exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Create user
    const result = await sql`
      INSERT INTO users (name, email, password_hash, joined_at)
      VALUES (${name}, ${email}, ${hashedPassword}, NOW())
      RETURNING id, name, email
    `;

    return NextResponse.json(
      { user: result.rows[0], message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### GET /api/products

```typescript
// /app/api/products/route.ts
import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM products WHERE stock > 0';
    const params: any[] = [];

    if (category) {
      query += ` AND category = $${params.length + 1}`;
      params.push(category);
    }

    if (search) {
      query += ` AND (name ILIKE $${params.length + 1} OR description ILIKE $${params.length + 1})`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await sql.query(query, params);

    return NextResponse.json({
      products: result.rows,
      total: result.rowCount,
      page,
      pageSize: limit,
    });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
```

### POST /api/orders

```typescript
// /app/api/orders/route.ts
import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userId, items, customerInfo, paymentMethod, address } = await request.json();

    // Validate items
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Order must have items' },
        { status: 400 }
      );
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    const shipping = 50000; // Fixed shipping cost
    const total = subtotal + shipping;

    // Create order
    const orderResult = await sql`
      INSERT INTO orders (user_id, customer_name, customer_email, customer_phone, address, subtotal, shipping, total, payment_method, status)
      VALUES (${userId}, ${customerInfo.name}, ${customerInfo.email}, ${customerInfo.phone}, ${address}, ${subtotal}, ${shipping}, ${total}, ${paymentMethod}, 'pending')
      RETURNING id
    `;

    const orderId = orderResult.rows[0].id;

    // Create order items
    for (const item of items) {
      await sql`
        INSERT INTO order_items (order_id, product_id, product_name, price, quantity)
        VALUES (${orderId}, ${item.productId}, ${item.name}, ${item.price}, ${item.quantity})
      `;
    }

    return NextResponse.json(
      { order: { id: orderId, total, status: 'pending' } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
```

---

## Testing API Routes

Use Postman or cURL:

```bash
# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"password123"}'

# Get products
curl http://localhost:3000/api/products?category=nugget&page=1

# Create order
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId":"user-id",
    "items":[{"productId":"prod-1","name":"Nugget","price":35000,"quantity":2}],
    "customerInfo":{"name":"John","email":"john@example.com","phone":"081234567890"},
    "address":"Jl. Sudirman No. 1",
    "paymentMethod":"transfer"
  }'
```

---

## Packages to Install for Backend

```bash
pnpm add bcryptjs jsonwebtoken cookie next-auth

# Or for Supabase auth
pnpm add @supabase/supabase-js

# For database (choose one)
pnpm add pg @vercel/postgres
# OR
pnpm add @prisma/client prisma
```

---

## Migration Checklist

- [ ] Database created & connected
- [ ] Environment variables set
- [ ] Tables created
- [ ] Indexes added
- [ ] RLS policies configured
- [ ] Auth system implemented
- [ ] API routes created
- [ ] API routes tested
- [ ] Frontend forms connected to API
- [ ] Error handling implemented
- [ ] Logging implemented
- [ ] Rate limiting added (optional)

---

**Next: Start with database setup, then implement auth, then connect remaining routes.**
