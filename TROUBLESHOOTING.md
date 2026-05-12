# AIS Frozen Food - Troubleshooting Guide

**Common issues and solutions**

---

## 🔴 Critical Issues

### Issue: "Cannot find module" Error

**Symptoms:**
```
Error: Cannot find module '@/components/...'
```

**Solutions:**
1. Check import path is correct (from `/` which is project root)
2. Verify file exists in the correct location
3. Restart dev server: `pnpm dev`
4. Check file extensions match (`.tsx` for React components)

```typescript
// ❌ Wrong
import { Button } from 'components/ui/button'
import { Button } from './../../components/ui/button'

// ✅ Correct
import { Button } from '@/components/ui/button'
```

---

### Issue: Hydration Mismatch Error

**Symptoms:**
```
Error: Hydration failed. Server and client markup didn't match
```

**Causes:**
- Component renders different content on server vs client
- Missing `'use client'` directive
- Using browser-only APIs in server component

**Solutions:**
```typescript
// ❌ Wrong - Server component using browser API
export default function MyComponent() {
  const isMobile = window.innerWidth < 768
  return <div>{isMobile ? 'Mobile' : 'Desktop'}</div>
}

// ✅ Correct - Client component for browser APIs
'use client'
import { useEffect, useState } from 'react'

export default function MyComponent() {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])
  
  return <div>{isMobile ? 'Mobile' : 'Desktop'}</div>
}
```

---

### Issue: TypeScript Errors

**Symptoms:**
```
Error: Property 'xxx' does not exist on type 'yyy'
```

**Solutions:**
1. Ensure types are imported from `@/lib/types.ts`
2. Check interfaces match actual data
3. Run `pnpm tsc --noEmit` to see all errors
4. Use `unknown` type if unsure, then narrow down

```typescript
// ❌ Wrong - Missing type
const product = { name: 'Nugget' }
console.log(product.price) // Error: price doesn't exist

// ✅ Correct - With type
import { Product } from '@/lib/types'
const product: Product = { 
  id: '1',
  name: 'Nugget',
  price: 35000,
  // ... other required fields
}
```

---

## 🟡 Common Frontend Issues

### Issue: Cart Data Not Persisting

**Symptoms:**
- Cart empties on page refresh
- Items lost when navigating

**Current State:**
- Cart uses `localStorage` (client-side only)
- This is temporary - will be replaced with database in Phase 2

**Temporary Fix:**
```typescript
'use client'
import { useCart } from '@/components/cart-provider'

// Data persists in localStorage automatically
// Check browser DevTools → Application → Local Storage
```

**Permanent Fix (When Backend Ready):**
- Move cart to database
- Save cart on each change
- Load cart from database on page load

---

### Issue: Form Not Validating

**Symptoms:**
- Form submits without validation
- No error messages showing

**Solutions:**
1. Ensure form uses `react-hook-form`
2. Check Zod schema is correct
3. Verify `zodResolver` is applied

```typescript
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// 1. Define schema
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
})

type FormData = z.infer<typeof schema>

export default function LoginForm() {
  // 2. Apply resolver
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  // 3. Show errors
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register('email')} />
      {form.formState.errors.email && (
        <p className="text-red-500">{form.formState.errors.email.message}</p>
      )}
    </form>
  )
}
```

---

### Issue: Styling Not Applying

**Symptoms:**
- Tailwind classes not working
- Colors look wrong
- Layout broken on mobile

**Solutions:**
1. Verify Tailwind class names are correct
2. Check if class conflicts with other styles
3. Use `tailwind-merge` for dynamic classes
4. Clear cache: delete `.next` folder, restart

```typescript
// ❌ Wrong - Invalid class name
<div className="p-[50px]">Content</div>

// ✅ Correct - Use Tailwind spacing scale
<div className="p-12">Content</div>

// ✅ Correct - Dynamic classes with merge
import { cn } from '@/lib/utils'

<button className={cn(
  "px-4 py-2 rounded",
  isPrimary && "bg-primary text-white"
)}>
  Click me
</button>
```

---

### Issue: Images Not Loading

**Symptoms:**
- Placeholder images showing
- Image URLs returning 404
- Broken image icons

**Solutions:**
1. Verify image paths are correct (relative to `/public`)
2. Use `/` prefix for public images
3. Check file actually exists in `/public` folder
4. For generated images, verify generation completed

```typescript
// ❌ Wrong
<img src="images/product.jpg" />

// ✅ Correct
<img src="/product.jpg" alt="Product" />

// ✅ Correct with next/image
import Image from 'next/image'
<Image src="/product.jpg" alt="Product" width={400} height={300} />
```

---

### Issue: Toast Notifications Not Showing

**Symptoms:**
- Toast function called but no notification appears
- Toaster missing in UI

**Solutions:**
1. Verify `<Toaster />` component is in root layout
2. Ensure component has `'use client'` directive
3. Import from correct package: `sonner`

```typescript
// app/layout.tsx
import { Toaster } from '@/components/ui/sonner'

export default function RootLayout() {
  return (
    <html>
      <body>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}

// component.tsx
'use client'
import { toast } from 'sonner'

export default function MyComponent() {
  const handleClick = () => {
    toast.success('Success!') // Will now show
  }
  
  return <button onClick={handleClick}>Click me</button>
}
```

---

### Issue: Modal/Dialog Not Opening

**Symptoms:**
- Dialog component doesn't appear
- Backdrop missing
- Can't close dialog

**Solutions:**
1. Ensure state management is correct
2. Check `open` prop is being passed
3. Verify close handler is attached

```typescript
'use client'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export default function MyDialog() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Dialog</button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogHeader>
          {/* Content */}
        </DialogContent>
      </Dialog>
    </>
  )
}
```

---

## 🟡 Common Backend Issues (When Implementing)

### Issue: Database Connection Failing

**Symptoms:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solutions:**
1. Verify `DATABASE_URL` environment variable is set
2. Check database is running
3. Verify connection string format:
   ```bash
   postgresql://user:password@host:port/database
   ```
4. Test connection:
   ```bash
   psql $DATABASE_URL
   ```

---

### Issue: API Route Returns 404

**Symptoms:**
```
Error: 404 Not Found
```

**Solutions:**
1. Verify file location (must be in `/app/api/`)
2. Check file name is `route.ts` (not `index.ts`)
3. Verify HTTP method matches (GET, POST, etc.)
4. Restart dev server
5. Check for typos in URL path

```typescript
// ❌ Wrong - Wrong filename
// /app/api/products/index.ts

// ✅ Correct
// /app/api/products/route.ts

export async function GET(request) {
  return Response.json({ data: [] })
}

export async function POST(request) {
  const data = await request.json()
  return Response.json({ created: true })
}
```

---

### Issue: Password Hashing Not Working

**Symptoms:**
- Passwords stored as plain text
- Bcrypt not installed
- Hash function throwing error

**Solutions:**
1. Install bcryptjs: `pnpm add bcryptjs`
2. Use correct import
3. Await the hash function

```typescript
import { hash, compare } from 'bcryptjs'

// Hashing
const plainPassword = 'password123'
const hashedPassword = await hash(plainPassword, 10)

// Verifying
const isValid = await compare(plainPassword, hashedPassword)
```

---

### Issue: API Returns CORS Error

**Symptoms:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Causes:**
- Cross-origin request without proper headers
- Frontend and backend on different origins

**Solutions:**
```typescript
// /app/api/products/route.ts
export async function GET(request) {
  const response = Response.json({ data: [] })
  
  // Add CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
  
  return response
}

// Handle OPTIONS request
export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
```

---

### Issue: Query Parameters Not Passing

**Symptoms:**
- Filters not working
- Search not working
- Pagination broken

**Solutions:**
```typescript
// API route
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  // Read query parameters
  const searchParams = request.nextUrl.searchParams
  const category = searchParams.get('category')
  const page = searchParams.get('page')
  
  console.log(category, page) // Should print values
  
  return Response.json({
    category,
    page,
  })
}

// Frontend component
'use client'
async function getProducts(category: string, page: number) {
  const response = await fetch(
    `/api/products?category=${category}&page=${page}`
  )
  return response.json()
}
```

---

## 🟢 Deployment Issues

### Issue: Environment Variables Not Loaded

**Symptoms:**
- API calls failing in production
- Database connection fails on Vercel
- Environment variables undefined

**Solutions:**
1. Add variables to Vercel project settings
2. Verify variable names match code
3. Redeploy after adding variables
4. Check `.env.local` is in `.gitignore`

```bash
# ❌ Wrong - Commit secrets
git add .env.local
git commit -m "Add env vars"

# ✅ Correct - Use Vercel dashboard
# Go to: Project Settings → Environment Variables
# Add: DATABASE_URL, AUTH_SECRET, etc.
```

---

### Issue: Database Migrations Not Running

**Symptoms:**
- Tables don't exist in production
- Schema mismatch error
- Insert/update operations fail

**Solutions:**
1. Run migrations before deploying
2. Verify migrations ran successfully
3. Check database in production has schema

```bash
# Before deploying
pnpm migrate

# Verify with
psql $DATABASE_URL -c "\dt" # List tables
```

---

### Issue: Build Fails on Vercel

**Symptoms:**
```
Build failed - Error during build
```

**Common causes & solutions:**
1. **TypeScript errors**
   ```bash
   pnpm tsc --noEmit  # Check locally first
   ```

2. **Missing environment variables**
   - Add to Vercel project settings

3. **Import errors**
   - Check file paths
   - Ensure files exist

4. **Dependency issues**
   - Clear node_modules: `rm -rf node_modules pnpm-lock.yaml`
   - Reinstall: `pnpm install`

---

## 🔍 Debug Techniques

### Use Console Logging
```typescript
console.log("[v0] Starting operation")
console.log("[v0] User data:", userData)
console.log("[v0] Error:", error.message)
```

### Browser DevTools
1. **Console Tab** - Check for errors
2. **Network Tab** - Check API requests
3. **Application Tab** - Check localStorage
4. **Elements Tab** - Inspect HTML structure

### Database Inspection
```sql
-- Check data exists
SELECT COUNT(*) FROM products;

-- Check specific record
SELECT * FROM products WHERE slug = 'nugget';

-- Check recent orders
SELECT * FROM orders ORDER BY created_at DESC LIMIT 10;
```

### API Testing with cURL
```bash
# GET request
curl http://localhost:3000/api/products

# POST request with data
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"items": []}'

# With authentication header
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/orders
```

---

## ✅ Testing Checklist

### Frontend Testing
- [ ] All pages load without errors
- [ ] Forms validate correctly
- [ ] Buttons trigger correct actions
- [ ] Navigation works
- [ ] Responsive on mobile/tablet/desktop
- [ ] Keyboard navigation works
- [ ] Images load

### Backend Testing (When Ready)
- [ ] API returns correct data format
- [ ] Status codes are correct (200, 201, 400, 404, 500)
- [ ] Error messages are helpful
- [ ] Input validation works
- [ ] Authentication works
- [ ] Database transactions work

### Integration Testing
- [ ] Frontend connects to API
- [ ] Data flows correctly
- [ ] Errors display properly
- [ ] Loading states work
- [ ] Success notifications show

---

## 📞 Getting Help

### Before asking for help, check:
1. **Documentation** - README.md, BACKEND_SETUP.md
2. **This file** - TROUBLESHOOTING.md
3. **Console errors** - Browser DevTools
4. **Stack trace** - Full error message
5. **Related files** - Check imports, types

### When asking for help, provide:
1. **What you're trying to do** - Clear description
2. **What happened** - Expected vs actual
3. **Error message** - Full error text
4. **Steps to reproduce** - How to recreate
5. **What you've tried** - Solutions attempted

---

## 🎓 Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev/learn)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)

### Tools
- [React DevTools Extension](https://react-devtools-tutorial.vercel.app/)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools)
- [VS Code REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)

### Debugging
- DevTools: F12 in browser
- Network requests: Network tab
- Local storage: Application → Local Storage
- Database: Direct SQL queries

---

**Last Updated:** May 9, 2026

**Remember:** Most issues have been solved before. Check the documentation first!
