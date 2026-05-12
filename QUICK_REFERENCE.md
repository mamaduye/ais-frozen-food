# AIS Frozen Food - Quick Reference Guide

**Use this for quick lookups while coding!**

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| **README.md** | Complete project overview, tech stack, components, features |
| **BACKEND_SETUP.md** | Database setup, SQL schema, API examples |
| **PROGRESS.md** | Detailed progress tracker & implementation timeline |
| **QUICK_REFERENCE.md** | This file - quick lookups |

---

## 🎨 Design System Quick Access

### Colors (CSS Variables)
```css
--primary: oklch(0.62 0.13 235);    /* Frozen blue */
--secondary: oklch(0.96 0.015 235); /* Light blue-gray */
--accent: oklch(0.32 0.07 250);     /* Deep navy */
--destructive: oklch(0.577 0.245 27.325); /* Red */
--background: oklch(1 0 0);         /* White */
--foreground: oklch(0.21 0.03 240); /* Dark slate */
```

### Order Status Colors
```typescript
pending: "yellow"      // oklch(0.75 0.08 200)
paid: "blue"          // oklch(0.62 0.13 235)
processed: "purple"   // oklch(0.55 0.1 220)
shipped: "orange"     // oklch(0.75 0.08 60)
completed: "green"    // oklch(0.85 0.05 150)
cancelled: "red"      // oklch(0.577 0.245 27)
```

### Fonts
- **Body:** Inter (--font-sans)
- **Display:** Plus Jakarta Sans (--font-display)
- **Code:** Monospace (--font-mono)

### Spacing Scale
```
0  2  4  6  8  10  12  14  16  18  20  24  28  32  36  40  44  48  52  56  60  64  72  80  96
px p-0 p-1 p-2... (Tailwind standard scale)
```

---

## 🏗️ Project Structure Quick Map

```
├── app/
│   ├── (shop)/          ← Customer pages
│   ├── (auth)/          ← Login/Register
│   ├── admin/           ← Admin dashboard
│   ├── api/             ← API routes (TO BE CREATED)
│   ├── layout.tsx       ← Root layout
│   └── globals.css      ← Design tokens
├── components/
│   ├── ui/              ← shadcn components (56 files)
│   ├── site-*.tsx       ← Header, Footer
│   ├── *-provider.tsx   ← Context providers
│   └── admin/           ← Admin components
├── lib/
│   ├── types.ts         ← TypeScript interfaces
│   ├── data.ts          ← Mock data
│   └── utils.ts         ← Utilities
└── public/              ← Images, assets
```

---

## 📦 Key Dependencies

### Core
- **next@16.2.4** - React framework
- **react@19** - UI library
- **typescript@5.7.3** - Type safety

### Styling
- **tailwindcss@4.2.0** - CSS utility
- **shadcn/ui** (56 components)

### Forms & Validation
- **react-hook-form@7.54.1** - Form state
- **zod@3.24.1** - Validation

### Data & Visualization
- **recharts@2.15.0** - Charts
- **date-fns@4.1.0** - Dates
- **lucide-react@0.564** - Icons

### Utilities
- **sonner@1.7.1** - Toasts
- **clsx@2.1.1** - Class names
- **next-themes@0.4.6** - Theme toggle

---

## 🗂️ Component Checklist

### Layout Components
- [x] SiteHeader - Navigation
- [x] SiteFooter - Footer
- [x] CartProvider - Cart state
- [x] AdminShell - Admin sidebar

### Feature Components
- [x] ProductCard - Product display
- [x] OrderStatusBadge - Status indicator
- [x] AdminSalesChart - Revenue chart
- [x] WhatsAppButton - Floating button

### Pages (25+ total)
- [x] Home page
- [x] Products listing
- [x] Product detail
- [x] Shopping cart
- [x] Checkout
- [x] Order history
- [x] Login/Register
- [x] Admin dashboard (7 tabs)

---

## 🔗 API Routes To Implement

### Authentication
```
POST   /api/auth/register       Create user
POST   /api/auth/login          Login user
POST   /api/auth/logout         Logout
GET    /api/auth/me             Current user
```

### Products
```
GET    /api/products            List products
GET    /api/products/[slug]     Product detail
POST   /api/products            Create (admin)
PUT    /api/products/[id]       Update (admin)
DELETE /api/products/[id]       Delete (admin)
GET    /api/products/categories Get categories
```

### Orders
```
GET    /api/orders              User's orders
POST   /api/orders              Create order
GET    /api/orders/[id]         Order detail
PUT    /api/orders/[id]         Update status
PUT    /api/orders/[id]/cancel  Cancel order
```

### Reviews
```
GET    /api/reviews             List reviews
POST   /api/reviews             Create review
PUT    /api/reviews/[id]        Update review
DELETE /api/reviews/[id]        Delete review
```

### Admin
```
GET    /api/admin/stats         Dashboard KPIs
GET    /api/admin/sales-chart   Sales data
GET    /api/admin/best-sellers  Top products
GET    /api/admin/users         User list
```

---

## 💾 TypeScript Types Reference

```typescript
// User
type User = {
  id: string
  name: string
  email: string
  phone: string
  joinedAt: string
  ordersCount: number
  totalSpent: number
}

// Product
type Product = {
  id: string
  name: string
  slug: string
  price: number
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
}

// Order
type Order = {
  id: string
  date: string
  customerName: string
  customerEmail: string
  customerPhone: string
  address: string
  items: { productId: string; name: string; price: number; quantity: number }[]
  subtotal: number
  shipping: number
  total: number
  paymentMethod: 'transfer' | 'cod'
  status: OrderStatus
}

// OrderStatus
type OrderStatus = 'pending' | 'paid' | 'processed' | 'shipped' | 'completed' | 'cancelled'

// Review
type Review = {
  id: string
  productId: string
  userName: string
  userInitials: string
  rating: number
  comment: string
  date: string
}

// CartItem
type CartItem = {
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  weight: string
}
```

---

## 🎯 Common Tasks

### Add New Page
```typescript
// 1. Create file: app/(shop)/newpage/page.tsx
'use client'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export default function NewPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Content */}
      </main>
      <SiteFooter />
    </div>
  )
}
```

### Use Cart Context
```typescript
'use client'
import { useCart } from '@/components/cart-provider'

export default function MyComponent() {
  const { cart, addItem, removeItem } = useCart()
  return <div>{cart.length} items</div>
}
```

### Create API Route
```typescript
// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Your logic
    return NextResponse.json({ data: [] })
  } catch (error) {
    return NextResponse.json({ error: 'Error message' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const data = await request.json()
  // Your logic
  return NextResponse.json({ success: true }, { status: 201 })
}
```

### Use Form with Validation
```typescript
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
})

export default function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema),
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register('name')} />
      {form.formState.errors.name && <p>{form.formState.errors.name.message}</p>}
    </form>
  )
}
```

### Add Toast Notification
```typescript
'use client'
import { toast } from 'sonner'

toast.success('Success message')
toast.error('Error message')
toast.loading('Loading...')
```

---

## 📊 Database Schema Quick Reference

### Tables
1. **categories** - Product categories
2. **products** - Product catalog
3. **users** - User profiles
4. **orders** - Customer orders
5. **order_items** - Items in orders
6. **reviews** - Product reviews

### Key Fields
| Table | Key Field | Foreign Keys |
|-------|-----------|--------------|
| products | id, slug | category_id |
| orders | id, user_id | user_id |
| order_items | id, order_id | order_id, product_id |
| reviews | id, product_id, user_id | product_id, user_id |

---

## 🔐 Environment Variables

```bash
# Required
DATABASE_URL=postgresql://user:password@host/db
AUTH_SECRET=your_secret_here

# Optional
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_KEY=pk_test_...
```

⚠️ **Never commit `.env.local` - Add to `.gitignore`**

---

## 🚀 Common Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm start            # Run production build
pnpm lint             # Run linter
pnpm type-check       # Check TypeScript

# Adding dependencies
pnpm add package-name
pnpm add -D package-name

# Database (when ready)
pnpm migrate          # Run migrations
pnpm seed             # Seed database
```

---

## 🐛 Debugging Tips

### Check Console
```typescript
console.log("[v0] Debug message:", variable)
```

### Check Network Tab
- Open DevTools → Network tab
- Check API requests/responses
- Look for 4xx/5xx errors

### Check Database
- Supabase: Go to SQL Editor
- Run queries to verify data

### Common Errors
| Error | Solution |
|-------|----------|
| Module not found | Check import path |
| Hydration error | Ensure client/server components match |
| Form not submitting | Check validation errors |
| API 404 | Check route file location |
| CORS error | Add CORS headers in API route |

---

## 📈 Progress Timeline

```
Week 1: Database + Auth
  └─ PostgreSQL setup
  └─ Auth API implementation
  └─ Product API (read-only)

Week 2: Core Features
  └─ Product management API
  └─ Order API
  └─ Reviews API

Week 3: Integration
  └─ Connect all forms
  └─ Error handling
  └─ Testing

Week 4: Polish
  └─ Performance
  └─ Security review
  └─ Deployment
```

---

## ✅ Pre-Launch Checklist

### Backend
- [ ] Database created
- [ ] All API routes working
- [ ] Input validation implemented
- [ ] Error handling in place
- [ ] Tests passing

### Frontend
- [ ] All pages connected to API
- [ ] Loading states working
- [ ] Error messages displaying
- [ ] Responsive design verified
- [ ] Accessibility checked

### Security
- [ ] Passwords hashed
- [ ] Auth tokens secure
- [ ] RLS policies configured
- [ ] Input validation server-side
- [ ] HTTPS enabled

### Performance
- [ ] Images optimized
- [ ] Code splitting done
- [ ] Lighthouse > 90
- [ ] Database indexes created
- [ ] Caching configured

### Deployment
- [ ] Vercel project created
- [ ] Environment variables set
- [ ] Domain configured
- [ ] SSL certificate valid
- [ ] Monitoring set up

---

## 🎓 Learning Resources

### Documentation
- [Next.js 16 Docs](https://nextjs.org)
- [React 19 Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [TypeScript Handbook](https://typescriptlang.org)

### Guides
- PostgreSQL: https://www.postgresql.org/docs/
- Authentication: https://authjs.dev
- Zod Validation: https://zod.dev
- React Hook Form: https://react-hook-form.com

---

## 💡 Tips & Best Practices

### Code Organization
- Group related components in folders
- One component per file (if large)
- Keep utilities in `lib/` folder
- Use TypeScript for type safety

### Performance
- Use `next/image` for images
- Implement lazy loading
- Use React.memo for expensive components
- Cache API responses

### Accessibility
- Use semantic HTML
- Add alt text to images
- Use ARIA labels
- Test with keyboard navigation

### Testing Strategy
- Unit tests: Components, utilities
- Integration tests: API routes
- E2E tests: User flows
- Manual testing: Edge cases

---

## 🤝 Team Communication

### When to ask for help:
- ✅ Database schema questions
- ✅ API design questions
- ✅ Type definition issues
- ✅ Component structure questions

### How to report bugs:
- Describe steps to reproduce
- Include screenshot if UI bug
- Check console for errors
- Provide database query if data issue

---

**Remember:** When in doubt, check the README.md or BACKEND_SETUP.md!

**Last Updated:** May 9, 2026
