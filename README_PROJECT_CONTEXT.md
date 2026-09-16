# AIS Frozen Food Project Documentation

## Project Overview

Proyek ini adalah website e-commerce untuk UMKM AIS Frozen Food, dibangun dengan Next.js, TypeScript, Tailwind CSS, Supabase, dan Cloudflare R2 / AWS S3-compatible object storage.

Tujuan sistem:
- menyediakan storefront untuk produk frozen food
- mendukung transaksi pelanggan dari katalog sampai checkout
- menyediakan dashboard admin untuk produk, pesanan, dan pelanggan
- menyimpan data transaksi dan media upload di backend eksternal

Target pengguna:
- customer / pembeli akhir
- admin toko
- (sebagai konsep revisi) super admin

Peran utama yang terlihat di source code saat ini:
- Customer: register, login, browse products, add to cart, checkout, view orders, upload payment proof, give review
- Admin: manage products, manage orders, view customer list, manage reviews
- Super Admin: konsep perencanaan, belum diimplementasikan di source code

Status pengembangan saat ini:
- arsitektur umum sudah terbentuk
- sebagian besar alur customer dan admin yang bersentuhan dengan Supabase sudah ada
- masih ada fitur yang belum selesai, fitur yang masih partial, dan beberapa hal yang masih direncanakan

## Tech Stack

Teknologi yang terbukti ada di project saat ini:

- Next.js 16.2.4
- React 19
- TypeScript 5.7.3
- Tailwind CSS 4.2.0
- Supabase JS + Supabase SSR
- Cloudflare R2 via AWS S3 SDK
- shadcn/ui-style components in `components/ui/`
- `zod`, `react-hook-form`, `recharts`, `sonner`, `date-fns`, `framer-motion`
- `@prisma/client` and `prisma` dependency are present, but no Prisma schema or migration folder was found in the repository audit

## Feature Implementation Status

Status yang digunakan konsisten di seluruh dokumen ini:
- ✅ IMPLEMENTED — sudah berjalan dan terhubung dengan backend/database
- 🟡 PARTIAL — sebagian sudah dibuat tetapi belum lengkap
- 🟠 MOCK — UI tersedia tetapi masih menggunakan data dummy/mock
- 🔴 NOT IMPLEMENTED — belum dibuat
- ⚠️ NEEDS REVIEW — sudah ada, tetapi perlu dicek karena berpotensi bermasalah

| Area | Feature | Status | Backend / Database | Notes |
|---|---|---|---|---|
| Customer | Register | ✅ IMPLEMENTED | Supabase Auth | `signUp()` di `app/(auth)/register/register-form.tsx` |
| Customer | Login | ✅ IMPLEMENTED | Supabase Auth | `signInWithPassword()` di `login-form.tsx` |
| Customer | Forgot Password | 🔴 NOT IMPLEMENTED | N/A | Link masih `href="#"`; tidak ada flow reset di source |
| Customer | Product Catalog | ✅ IMPLEMENTED | Supabase `products` + `categories` | `getProducts()` dan `getCategories()` aktif |
| Customer | Product Detail | ✅ IMPLEMENTED | Supabase `products` + `reviews` | detail produk dan rating/review live |
| Customer | Cart | 🟡 PARTIAL | Local state + `localStorage` | `components/cart-provider.tsx` client-side; belum ada cart server sync |
| Customer | Checkout | 🟡 PARTIAL | Supabase `orders` + `order_items` | `createOrder()` ada; perlu validasi schema/runtime |
| Customer | Order History | ✅ IMPLEMENTED | Supabase `orders` | halaman riwayat pesanan aktif |
| Customer | Order Detail | ✅ IMPLEMENTED | Supabase `orders` + `order_items` | detail order ter-query dari DB |
| Customer | Invoice / Receipt | 🔴 NOT IMPLEMENTED | Planned revision | fitur struk/faktur belum ada |
| Customer | Rating & Review | ✅ IMPLEMENTED | Supabase `reviews` | create/get/update rating live |
| Admin | Dashboard | ✅ IMPLEMENTED | Supabase `orders`, `profiles`, `products` | `getAdminDashboardData()` aktif |
| Admin | Product Management | ✅ IMPLEMENTED | Supabase `admin-products.ts` | CRUD produk live |
| Admin | Order Management | ✅ IMPLEMENTED | Supabase `admin-orders.ts` | update status dan verify payment |
| Admin | Customer Management | 🟡 PARTIAL | Supabase `profiles` + `orders` | list customer aktif, tetapi reset password belum ada |
| Admin | Review Management | ✅ IMPLEMENTED | Supabase `reviews` | `getAdminReviews()` aktif |
| Admin | Notification Badge | 🔴 NOT IMPLEMENTED | Planned revision | belum ada table/pattern notification |
| Admin | Reset Customer Password | 🔴 NOT IMPLEMENTED | Planned revision | admin tidak boleh melihat password asli |
| Super Admin | Super Admin role | 🔴 NOT IMPLEMENTED | Planned revision | belum ada role hierarchy di source |
| Admin | Admin Management | 🔴 NOT IMPLEMENTED | Planned revision | belum ada manajemen akun admin |

## User Roles & Authorization

### Customer
Hak akses yang terlihat dari source code:
- register
- login
- melihat produk
- melihat detail produk
- menambahkan produk ke cart
- checkout
- melihat riwayat pesanan
- melihat detail pesanan
- memberikan rating/review

Status: sebagian diimplementasikan dan dapat dipakai pada flow customer.

### Admin
Hak akses yang terlihat dari source code:
- login
- dashboard admin
- mengelola produk
- mengelola pesanan
- melihat daftar pelanggan
- melihat/menangani review
- memantau aktivitas toko umum

Status: beberapa fitur admin memang ada di Supabase-backed code, tetapi role enforcement masih perlu diperiksa lebih lanjut.

### Super Admin
Konsep revisi terbaru: Super Admin adalah role dengan akses tertinggi pada area administrasi. Tujuannya adalah memisahkan kewenangan owner dan karyawan, serta menghindari satu password yang dipakai bersama.

Super Admin direncanakan untuk dapat:
- mengakses dashboard admin
- mengelola produk
- mengelola pesanan
- mengelola pelanggan
- mengelola ulasan
- mengelola akun Admin
- menambahkan Admin
- menonaktifkan/mengaktifkan Admin jika sistem mendukungnya
- mengatur akses Admin sesuai rancangan authorization

Status saat ini: 🔴 NOT IMPLEMENTED

Catatan penting:
- fitur ini belum ada di source code/database
- ini adalah bagian dari planned revision, bukan fitur yang sudah aktif

## Authentication

### Status actual

| Feature | Status | Evidence | Notes |
|---|---|---|---|
| Register | ✅ IMPLEMENTED | `app/(auth)/register/register-form.tsx` | `supabase.auth.signUp()` |
| Login | ✅ IMPLEMENTED | `app/(auth)/login/login-form.tsx` | `supabase.auth.signInWithPassword()` |
| Logout | ✅ IMPLEMENTED | `lib/supabase/auth.ts` | `supabase.auth.signOut()` |
| Session | 🟡 PARTIAL | `lib/supabase/server.ts`, `lib/supabase/middleware.ts`, `proxy.ts` | session refresh dan guarded routes ada, tetapi akses admin perlu verifikasi lebih lanjut |
| Forgot Password | 🔴 NOT IMPLEMENTED | `login-form.tsx` link `href="#"` | tidak ada flow reset yang sebenarnya |
| Reset Password | 🔴 NOT IMPLEMENTED | tidak ada route atau helper | belum ada recovery token flow |
| Password hashing | ⚠️ NEEDS REVIEW | tidak ada bukti penggunaan bcrypt pada auth backend | Supabase Auth yang dipakai, bukan custom hashing di aplikasi |
| Middleware / protected routes | 🟡 PARTIAL | `proxy.ts` | route protection exists for `/admin`, `/checkout`, `/orders`, `/login`, `/register` |

### Planned Flow — Forgot Password

Customer
→ Login
→ Forgot Password
→ memasukkan email
→ sistem mengirim link reset
→ user membuka link
→ membuat password baru
→ password diperbarui
→ login kembali

Status: belum diimplementasikan di source code dan tidak boleh dianggap sudah bekerja.

## Database Schema

Database utama yang terlihat saat ini adalah Supabase Postgres. Dari source code, tabel yang terpakai secara nyata adalah:

### profiles
Fungsi: menyimpan profil pengguna seperti nama lengkap, email, nomor telepon, dan role.

Field penting:
- id
- email
- full_name
- phone
- role
- created_at
- updated_at

Status: aktif di query `getAdminUsers()`, `getAdminDashboardData()`, dan review-related queries.

### products
Fungsi: menyimpan katalog produk frozen food.

Field penting:
- id
- name
- slug
- description
- short_description
- price
- image_url
- category_id
- stock
- rating
- review_count
- status
- featured
- created_at
- updated_at

Status: aktif dan dipakai di storefront dan admin.

### categories
Fungsi: menyimpan kategori produk.

Field penting:
- id
- name
- slug
- description
- image
- created_at
- updated_at

Status: aktif di `getCategories()` dan `getCategoriesWithImages()`.

### orders
Fungsi: menyimpan pesanan pelanggan.

Field penting:
- id
- user_id
- order_number
- customer_name
- phone
- address
- subtotal
- shipping
- total
- payment_method
- payment_status
- payment_proof
- status
- paid_at
- created_at
- updated_at

Status: aktif dan dipakai di checkout, order history, dan admin order management.

### order_items
Fungsi: menyimpan detail item dalam setiap order.

Field penting:
- id
- order_id
- product_id
- quantity
- price
- created_at
- updated_at

Status: aktif di order creation dan order detail queries.

### reviews
Fungsi: menyimpan ulasan pelanggan pada produk.

Field penting:
- id
- user_id
- order_id
- product_id
- rating
- comment
- verified
- is_hidden
- created_at
- updated_at

Status: aktif di `lib/supabase/reviews.ts` dan dipakai di homepage, product detail, dan admin review page.

### Tabel lain yang terlihat
- `profiles` untuk user data
- `orders` untuk transaksi
- `order_items` untuk detail transaksi
- `products` untuk katalog
- `categories` untuk kategori produk
- `reviews` untuk rating/ulasan

Catatan:
- Prisma schema tidak ditemukan di repo; dependency Prisma belum dibuktikan sebagai ORM aktif
- file `lib/data.ts` masih berisi data mock yang dipakai sebagai fallback/legacy, tetapi data live utama berasal dari Supabase

## Entity Relationships

Relasi utama yang terlihat dari implementation code:

- profiles → orders
  - `orders.user_id` mengarah ke `profiles.id`
  - terlihat dalam `getAdminDashboardData()`, `getAdminUsers()`, `getOrders()`

- orders → order_items
  - `order_items.order_id` mengarah ke `orders.id`
  - terlihat di `createOrder()` dan `getOrderById()`

- products → order_items
  - `order_items.product_id` mengarah ke `products.id`
  - terlihat di detail order dan admin order logic

- categories → products
  - `products.category_id` mengarah ke `categories.id`
  - terlihat di `getProducts()` dan `getCategoriesWithImages()`

- profiles → reviews
  - `reviews.user_id` mengarah ke `profiles.id`
  - terlihat di `lib/supabase/reviews.ts`

- products → reviews
  - `reviews.product_id` mengarah ke `products.id`
  - terlihat di review queries dan aggregation rating

- orders → reviews
  - `reviews.order_id` mengarah ke `orders.id`
  - terlihat di `createReview()` dan pengecekan review yang sudah dibuat

Catatan:
- relasi ini didukung oleh nama field di query dan penggunaan Supabase, tetapi tidak ada file schema Prisma atau SQL DDL yang menunjukkan foreign key constraints secara eksplisit di repo
- jika ada relasi yang belum diverifikasi pada database live, statusnya ditandai sebagai `NEEDS REVIEW`

## Order Lifecycle

Status pesanan yang terlihat di source code adalah:

- `pending` — pesanan dibuat, belum dikonfirmasi pembayaran
- `paid` — pembayaran sudah diterima dan dikonfirmasi
- `processed` — order sedang diproses (ada di enum, tetapi tidak selalu terlihat dipakai secara konsisten)
- `shipped` — order sedang dikirim
- `completed` — order selesai
- `cancelled` — order dibatalkan

Status payment yang terlihat:
- `pending`
- `waiting_verification`
- `completed`
- `failed`
- `refunded`

Catatan penting:
- enum di `lib/types.ts` tidak sepenuhnya sinkron dengan nilai yang dipakai oleh aplikasi dan database dalam beberapa bagian
- ada potensi mismatch antara `OrderStatus` enum, `PaymentStatus`, database, dan UI labels
- status yang dipakai pada code harus diperiksa ulang sebelum memperluas fitur checkout/order lifecycle

## Planned Revision — Order Receipt / Invoice

Revisi ini merupakan requirement dari dosen dan belum dipasang sebagai fitur aktif di source code.

Konsep yang direncanakan:
- nomor pesanan
- tanggal transaksi
- nama pelanggan
- nomor telepon jika diperlukan
- alamat pengiriman
- daftar produk
- jumlah produk
- harga produk
- subtotal
- biaya pengiriman
- total pembayaran
- metode pembayaran
- status pembayaran
- status pesanan
- opsi print/cetak struk/faktur

Status: 🔴 NOT IMPLEMENTED

Catatan:
- halaman detail order saat ini belum memiliki layout yang berfungsi sebagai bukti transaksi formal
- fitur ini perlu dikembangkan sebagai halaman receipt/invoice terpisah atau bagian dari order detail

## Planned Revision — Customer Password Reset

Admin perlu memiliki kemampuan membantu pelanggan yang lupa password. Namun, admin tidak boleh dapat melihat password asli pelanggan.

Konsep aman yang direncanakan:
- admin memulai proses reset password
- sistem membuat alur reset aman
- customer menerima link reset / menerima flow aman di frontend
- customer membuat password baru
- password baru disimpan oleh auth provider dan tidak bisa diakses admin

Status: 🔴 NOT IMPLEMENTED

Catatan:
- `login-form.tsx` hanya menyediakan link `href="#"`
- tidak ada route reset password, token flow, atau email handler aktif

## Planned Revision — Super Admin

Konsep bisnis:
```
Super Admin
    │
    ├── Admin A
    ├── Admin B
    └── Admin C
```

Super Admin bertanggung jawab terhadap pengelolaan akun Admin dan pengaturan kewenangan di area administrasi.

Tujuan:
- meningkatkan keamanan
- tidak menggunakan satu password bersama
- memisahkan owner dan karyawan
- mendukung ekspansi usaha

Status: 🔴 NOT IMPLEMENTED

Catatan:
- role hierarchy tidak ditemukan di source code
- tidak ada page atau API untuk menambah/menonaktifkan admin

## Planned Revision — Dashboard Notification Badge

Admin dashboard direncanakan memiliki badge notifikasi untuk aktivitas baru.

Kategori minimal:
- New Customer
- New Order
- New Review

Contoh:
```
Customers  2
Orders     3
Reviews    5
```

Mekanisme `unread → read` masih perlu ditentukan berdasarkan implementasi yang akan datang.

Status: 🔴 NOT IMPLEMENTED

Catatan:
- belum terlihat table `notifications` atau query `unread` di repository
- kemungkinan dapat diselesaikan dengan query terhadap data existing, tetapi belum ada implementasi

## Planned Revision — Homepage Hero Section

Feedback dosen: hero section saat ini terlalu panjang dan kurang ringan untuk dibaca.

Masalah yang saat ini terlihat:
- headline terlalu panjang
- supporting text terlalu banyak informasi
- CTA kurang bervariasi dan diarahkan ke tujuan yang terlalu mirip

Revisi yang direncanakan:
- headline dibuat lebih singkat dan menarik
- supporting text dibuat lebih ringan
- CTA `Beli sekarang` akan dievaluasi/diganti menjadi `Cart`
- CTA cart diarahkan ke halaman cart
- CTA kedua tetap bisa mengarah ke katalog/produk

Tujuan revisi:
- mengurangi repetisi
- menurunkan panjang tulisan hero
- memberi tujuan CTA yang berbeda
- memudahkan pelanggan membuka cart

Status: 🟡 PARTIAL / planned improvement

Catatan:
- belum dilakukan perubahan source code pada halaman home karena ini adalah dokumentasi requirement saja

## REST API

Endpoint yang terlihat secara nyata di repository:

| Method | Endpoint | Purpose | Auth | Role | Status |
|---|---|---|---|---|---|
| GET | `/api/test-r2` | endpoint uji upload / R2 smoke test | No | Public | ⚠️ NEEDS REVIEW |
| POST | `/api/upload` | upload product image ke storage | No | Public | ✅ IMPLEMENTED, but call path limited |
| POST | `/api/upload-payment-proof` | upload bukti pembayaran ke storage | No | Public | ✅ IMPLEMENTED |

Catatan:
- tidak ada endpoint `GET /api/products`, `POST /api/products`, `PUT /api/products/:id`, atau `DELETE /api/products/:id` yang benar-benar tampak ada pada repo
- API yang ada dalam kode hanya route upload/storage dan helper Supabase server-side; tidak ada REST API e-commerce lengkap di app router selain upload endpoints
- route `GET /api/test-r2` terlihat sebagai endpoint pengecekan storage, bukan endpoint produk/checkout produksi

## Project Structure

Struktur folder yang benar-benar ada pada repository saat audit:

```text
project/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (shop)/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── orders/
│   │   ├── page.tsx
│   │   └── products/
│   ├── admin/
│   │   ├── orders/
│   │   ├── page.tsx
│   │   ├── products/
│   │   ├── reports/
│   │   ├── reviews/
│   │   └── users/
│   ├── api/
│   │   ├── test-r2/
│   │   ├── upload/
│   │   └── upload-payment-proof/
│   ├── globals.css
│   ├── layout.tsx
│   └── ...
├── components/
│   ├── admin/
│   ├── orders/
│   ├── ui/
│   ├── cart-provider.tsx
│   ├── product-card.tsx
│   └── ...
├── hooks/
├── lib/
│   ├── cloudflare/
│   ├── storage/
│   ├── supabase/
│   ├── data.ts
│   ├── types.ts
│   └── utils.ts
├── public/
├── styles/
├── .env.local
├── package.json
├── next.config.mjs
├── proxy.ts
├── README_PROJECT_CONTEXT.md
├── tsconfig.json
└── ...
```

Fungsi folder penting:
- `app/` → route halaman dan API
- `components/` → UI reusable, cart provider, admin widgets
- `lib/supabase/` → data layer dan query Supabase
- `lib/storage/` → file upload helper ke object storage
- `lib/cloudflare/` → R2 client configuration
- `lib/data.ts` → legacy/mock data still present in repo
- `public/` → asset publik
- `hooks/` → hook UI, mobile detection, toast logic

## Environment Variables

Nama environment variable yang benar-benar dipakai oleh project:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

R2_ENDPOINT=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_PRODUCT_BUCKET=
R2_PRODUCT_PUBLIC_URL=
R2_BUCKET_NAME=
R2_PAYMENT_PUBLIC_URL=

ANALYZE=
```

Catatan:
- tidak ada secret asli, token, atau credential yang ditulis di README ini
- semua nilai di atas menggunakan placeholder
- file `.env.local` memang ada di repo dan berisi value aktual, tetapi tidak boleh disalin ke dokumentasi publik karena berisi credential sensitif

## Known Issues / Technical Debt

Masalah yang ditemukan berdasarkan audit source code:

- `lib/data.ts` masih dipakai untuk beberapa halaman UI atau fallback, sehingga status data tidak sepenuhnya live
- `proxy.ts` berisi proteksi akses dan role-check, tetapi tidak ada bukti bahwa pattern ini sepenuhnya diterapkan di seluruh area admin
- `OrderStatus` dan `PaymentStatus` enums tidak sepenuhnya sinkron dengan nilai actual di database/UI
- forgot password belum diimplementasikan walaupun link ada di UI
- reset password pelanggan oleh admin belum ada
- super admin belum ada
- admin notification badge belum ada
- tidak ada Prisma schema atau migration yang terlihat di repo
- endpoint upload image ada, tetapi integrasi dengan seluruh alur storefront belum terbukti sepenuhnya
- beberapa halaman admin dan customer terlihat “hybrid”: live database + mock fallback
- build/runtime verification yang komprehensif belum dilakukan selama audit read-only ini

## Development Roadmap

### Phase 1 — Audit
- audit source code
- audit database/schema usage
- audit authentication flow
- audit API and routing

### Phase 2 — Authentication & Authorization
- Forgot Password
- Reset Password
- Super Admin
- Admin Management

### Phase 3 — Admin Dashboard
- Notification badge
- New customer indicator
- New order indicator
- New review indicator

### Phase 4 — Customer Experience
- improve order detail
- receipt / invoice
- print receipt

### Phase 5 — Homepage
- improve hero copy
- change CTA
- cart CTA
- responsive testing

### Phase 6 — Final Testing
- customer flow
- admin flow
- super admin flow
- authentication
- authorization
- order lifecycle
- review system
- receipt/invoice
- dashboard notification
- responsive UI

## Thesis Revision Tracker

### Om Pajar

| No | Reviewer | Revision | Status | Related Files | Related Database | Notes |
|---|---|---|---|---|---|---|
| 1 | Om Pajar | Detail pesanan customer perlu dikembangkan menjadi bukti transaksi / struk / faktur | TODO | `app/(shop)/orders/[id]/page.tsx`, related order detail pages | `orders`, `order_items` | Requirement belum diimplementasikan |
| 2 | Om Pajar | Admin perlu membantu proses reset password pelanggan | TODO | `app/(auth)/login/login-form.tsx` | `profiles`, Supabase Auth | tombol lupa password masih placeholder |
| 3 | Om Pajar | Forgot Password pada sign in harus benar-benar memiliki alur | TODO | login UI and auth flow | Supabase Auth | link masih `href="#"` |
| 4 | Om Pajar | Perlu konsep Super Admin untuk mengelola akses Admin | TODO | `proxy.ts`, admin routes | `profiles` role-based auth | belum ada role hierarchy |
| 5 | Om Pajar | Dashboard admin membutuhkan notification badge | TODO | admin dashboard files | `orders`, `profiles`, `reviews` | belum ada notification pattern |

### Pak Bijanto

| No | Reviewer | Revision | Status | Related Files | Related Database | Notes |
|---|---|---|---|---|---|---|
| 1 | Pak Bijanto | Hero section terlalu banyak teks | IN PROGRESS | `app/(shop)/page.tsx` | none direct | copy dan layout masih panjang |
| 2 | Pak Bijanto | Headline perlu dibuat lebih ringan dan menarik | IN PROGRESS | `app/(shop)/page.tsx` | none direct | masih perlu copy optimization |
| 3 | Pak Bijanto | Supporting text perlu dipersingkat | IN PROGRESS | `app/(shop)/page.tsx` | none direct | teks hero masih sangat panjang |
| 4 | Pak Bijanto | CTA `Beli sekarang` perlu diganti menjadi CTA `Cart` | TODO | `app/(shop)/page.tsx` | none direct | belum diganti |
| 5 | Pak Bijanto | CTA hero harus tidak mengarah ke halaman yang sama | TODO | `app/(shop)/page.tsx` | none direct | masih perlu tujuan CTA yang berbeda |

## Development Rules for AI Agents

1. Jangan mengubah database/schema tanpa terlebih dahulu menjelaskan dampaknya.
2. Jangan membuat fitur baru jika fitur serupa sudah tersedia.
3. Jangan mengganti library/framework utama tanpa alasan yang jelas.
4. Jangan menghapus fitur existing tanpa konfirmasi.
5. Jangan menganggap mock UI sebagai fitur yang sudah selesai.
6. Selalu cek tipe TypeScript sebelum melakukan refactor besar.
7. Pertahankan strict TypeScript.
8. Jangan memasukkan secret ke repository.
9. Jangan membuat endpoint fiktif.
10. Jangan membuat data dummy untuk menggantikan data production tanpa alasan.
11. Sebelum mengubah authentication/authorization, audit flow yang sudah ada.
12. Setiap perubahan role harus diperiksa terhadap middleware, API, database, dan UI.
13. Setiap perubahan database harus diikuti pengecekan relasi dan query yang terdampak.
14. Setelah perubahan besar, lakukan TypeScript/build/lint check sesuai script yang tersedia.
15. Dokumentasikan perubahan penting pada README/PROGRESS.

## README Audit Result

### Project Condition

- Proyek dalam status hybrid: beberapa alur customer/admin sudah terhubung ke Supabase, tetapi beberapa bagian masih menggunakan mock data atau belum dibuat.
- Fokus utama source code saat ini adalah storefront produk, checkout, order lifecycle, dan admin management product/order.
- Auth dan authorization sudah ada pada level dasar, tetapi perlu verifikasi lebih lanjut untuk admin protection dan role hierarchy.
- Project ini masih dalam tahap pengembangan, bukan status production-ready untuk semua fitur.

### Implemented

- customer register
- customer login
- customer product catalog
- customer product detail
- customer order history
- customer order detail
- customer rating/review
- admin dashboard data live
- admin product management
- admin order management
- admin review management
- customer and admin data stored through Supabase-backed queries

### Partial

- cart flow
- checkout flow
- customer auth/session guard
- admin customer management listing
- overall authorization review
- homepage hero content and CTA improvements

### Mock

- `lib/data.ts` tetap berisi data mock yang masih ada untuk beberapa halaman legacy atau fallback
- beberapa UI terlihat siap tetapi belum sepenuhnya berkaitan dengan data live

### Not Implemented

- forgot password flow
- reset password flow
- invoice / receipt / print struk
- super admin
- admin management
- customer password-reset assistance by admin
- dashboard notification badge
- dedicated admin reports page (tidak ditemukan di repo)

### Needs Review

- route protection and role enforcement for `/admin` paths
- consistency of order/payment status values between UI, enum, and database
- whether all upload endpoints are used in live storefront flows
- Prisma usage and migration status

### Newly Documented Revisions

- forgot password flow
- reset password by admin
- super admin
- dashboard notification badge
- homepage hero section simplification
- order receipt/invoice enhancement

### Files Updated

- [README_PROJECT_CONTEXT.md](README_PROJECT_CONTEXT.md)

### Important Findings

- source code lebih valid dijadikan sumber kebenaran dibandingkan asumsi atau dokumentasi lama
- `app/admin/page.tsx` menggunakan `getAdminDashboardData()` dan data Supabase, bukan mock data
- `lib/supabase/reviews.ts` mengecek `reviews` di Supabase, sehingga admin review management dan customer review system adalah actual live features
- `proxy.ts` merupakan gate akses actual yang saat ini terlihat, bukan root `middleware.ts` di workspace
- no Prisma schema or migration found; dependency remains not confirmed as active ORM

### Recommended Next Step

1. Validasi auth dan authorization aktif untuk semua rute admin dan protected pages.
2. Verifikasi semua status enum order/payment dengan database live sebelum perubahan lebih lanjut.
3. Implementasikan forgot-password flow dan secure reset password mechanism.
4. Menentukan model Super Admin dan admin hierarchy.
5. Menyusun design final untuk receipt/invoice dan notification badge.
6. Lakukan uji end-to-end untuk customer flow, admin flow, order lifecycle, dan review flow.

---

Dokumen ini dibuat berdasarkan hasil audit read-only terhadap source code yang tersedia di repository. Semua status diinformasikan sesuai bukti yang ditemukan, tanpa menganggap fitur selesai hanya karena file atau komponen dengan nama tertentu sudah ada.
