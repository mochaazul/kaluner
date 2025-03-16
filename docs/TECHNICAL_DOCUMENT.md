# Dokumentasi Teknis Aplikasi Kaluner

## 1. Ringkasan Proyek

Kaluner adalah aplikasi manajemen bisnis kuliner yang dirancang untuk membantu pemilik usaha kuliner dalam mengelola berbagai aspek bisnis mereka, termasuk manajemen resep, perhitungan biaya, inventaris, penetapan harga, perencanaan bisnis, pelaporan, dan manajemen promosi. Aplikasi ini bertujuan untuk meningkatkan efisiensi operasional, profitabilitas, dan pengambilan keputusan berbasis data dalam bisnis kuliner.

## 2. Arsitektur Sistem

### 2.1 Arsitektur Aplikasi

Kaluner menggunakan arsitektur **fullstack Next.js** dengan **Supabase** sebagai backend-as-a-service. Arsitektur ini memungkinkan pengembangan yang cepat, skalabilitas, dan pemeliharaan yang lebih mudah dengan mengurangi kompleksitas infrastruktur.

```
+------------------+     +------------------+     +------------------+
|                  |     |                  |     |                  |
|  Next.js         |     |    Supabase      |     |    Supabase      |
|  Frontend &      |<--->|    API Layer     |<--->|    PostgreSQL    |
|  API Routes      |     |    & Functions   |     |    Database      |
|                  |     |                  |     |                  |
+------------------+     +------------------+     +------------------+
```

### 2.2 Komponen Utama

1. **Next.js (Frontend & Backend)**
   - Server Components dan Client Components
   - API Routes untuk endpoint custom
   - Server Actions untuk mutasi data
   - Middleware untuk autentikasi dan otorisasi

2. **Supabase (Backend-as-a-Service)**
   - Database PostgreSQL terkelola
   - Authentication & Authorization
   - Storage untuk file dan gambar
   - Realtime subscriptions
   - Edge Functions untuk logika bisnis kompleks
   - Scheduled Functions untuk tugas terjadwal

### 2.3 Infrastruktur

Kaluner direncanakan untuk di-deploy menggunakan:

- **Frontend**: Vercel (optimal untuk Next.js)
- **Backend**: Supabase Cloud
- **CDN**: Vercel Edge Network
- **Monitoring**: Vercel Analytics dan Supabase Monitoring

## 3. Teknologi yang Digunakan

### 3.1 Frontend

- **Framework**: Next.js 14+ dengan App Router
- **Language**: TypeScript
- **UI Components**: 
  - Shadcn/UI (berbasis Radix UI)
  - Tailwind CSS untuk styling
- **State Management**: 
  - React Query / TanStack Query untuk server state
  - Zustand untuk client state
- **Forms**: React Hook Form dengan Zod validation
- **Charts & Visualization**: Recharts, Tremor

### 3.2 Backend

- **Supabase**:
  - PostgreSQL Database
  - Row Level Security (RLS) untuk keamanan data
  - PostgREST API
  - Supabase Auth dengan JWT
  - Supabase Storage
  - Edge Functions (berbasis Deno)
  - Scheduled Functions

- **API Integration**:
  - Next.js API Routes untuk custom endpoints
  - Server Actions untuk mutasi data

### 3.3 Database

- **Supabase PostgreSQL**:
  - Relational database dengan fitur JSON
  - Realtime subscriptions
  - Full-text search dengan pgvector
  - Database functions dan triggers
  - Row Level Security (RLS)

### 3.4 DevOps & Infrastructure

- **Deployment**: 
  - Vercel untuk Next.js
  - Supabase Cloud untuk backend
- **CI/CD**: GitHub Actions dengan Vercel integration
- **Monitoring**: 
  - Vercel Analytics
  - Supabase Monitoring
- **Logging**: Vercel Logs dan Supabase Logs

## 4. Struktur Database

### 4.1 Skema Database Supabase

#### Tabel Utama

1. **auth.users** (dikelola oleh Supabase Auth)
   - id (PK)
   - email
   - encrypted_password
   - email_confirmed_at
   - last_sign_in_at
   - created_at
   - updated_at

2. **public.profiles**
   - id (PK, FK ke auth.users.id)
   - username
   - full_name
   - avatar_url
   - created_at
   - updated_at

3. **public.businesses**
   - id (PK)
   - profile_id (FK)
   - business_name
   - business_type
   - address
   - phone
   - tax_id
   - created_at
   - updated_at

4. **public.ingredients**
   - id (PK)
   - business_id (FK)
   - name
   - category
   - unit
   - cost_per_unit
   - supplier_id (FK)
   - min_stock_level
   - created_at
   - updated_at

5. **public.inventory**
   - id (PK)
   - ingredient_id (FK)
   - quantity
   - expiry_date
   - location
   - batch_number
   - last_updated
   - created_at
   - updated_at

6. **public.suppliers**
   - id (PK)
   - business_id (FK)
   - name
   - contact_person
   - phone
   - email
   - address
   - payment_terms
   - created_at
   - updated_at

7. **public.recipes**
   - id (PK)
   - business_id (FK)
   - name
   - category
   - portion_size
   - portion_unit
   - preparation_time
   - cooking_time
   - instructions
   - notes
   - created_at
   - updated_at

8. **public.recipe_ingredients**
   - id (PK)
   - recipe_id (FK)
   - ingredient_id (FK)
   - quantity
   - unit
   - preparation_method
   - notes
   - created_at
   - updated_at

9. **public.menu_items**
   - id (PK)
   - business_id (FK)
   - recipe_id (FK)
   - name
   - description
   - category
   - selling_price
   - cost_price
   - profit_margin
   - is_active
   - created_at
   - updated_at

10. **public.promotions**
    - id (PK)
    - business_id (FK)
    - name
    - description
    - start_date
    - end_date
    - discount_type
    - discount_value
    - min_purchase
    - max_discount
    - applicable_items
    - created_at
    - updated_at

11. **public.sales**
    - id (PK)
    - business_id (FK)
    - date
    - total_amount
    - discount_amount
    - tax_amount
    - payment_method
    - customer_id (FK)
    - notes
    - created_at
    - updated_at

12. **public.sale_items**
    - id (PK)
    - sale_id (FK)
    - menu_item_id (FK)
    - quantity
    - unit_price
    - discount
    - subtotal
    - created_at
    - updated_at

13. **public.purchases**
    - id (PK)
    - business_id (FK)
    - supplier_id (FK)
    - date
    - total_amount
    - payment_status
    - delivery_status
    - notes
    - created_at
    - updated_at

14. **public.purchase_items**
    - id (PK)
    - purchase_id (FK)
    - ingredient_id (FK)
    - quantity
    - unit_price
    - subtotal
    - created_at
    - updated_at

15. **public.customers**
    - id (PK)
    - business_id (FK)
    - name
    - phone
    - email
    - address
    - loyalty_points
    - membership_level
    - created_at
    - updated_at

16. **public.business_plans**
    - id (PK)
    - business_id (FK)
    - name
    - type
    - start_date
    - end_date
    - target_revenue
    - target_profit
    - budget
    - status
    - created_at
    - updated_at

### 4.2 Row Level Security (RLS)

Supabase menggunakan Row Level Security (RLS) untuk membatasi akses ke data. Berikut adalah contoh kebijakan RLS untuk tabel utama:

```sql
-- Contoh RLS untuk businesses
CREATE POLICY "Users can view their own businesses" 
ON businesses FOR SELECT 
USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert their own businesses" 
ON businesses FOR INSERT 
WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update their own businesses" 
ON businesses FOR UPDATE
USING (auth.uid() = profile_id);

-- Contoh RLS untuk ingredients
CREATE POLICY "Users can view ingredients for their businesses" 
ON ingredients FOR SELECT 
USING (business_id IN (
  SELECT id FROM businesses WHERE profile_id = auth.uid()
));
```

### 4.3 Database Functions dan Triggers

Supabase PostgreSQL memungkinkan pembuatan fungsi dan trigger untuk logika bisnis kompleks:

```sql
-- Contoh fungsi untuk menghitung HPP resep
CREATE OR REPLACE FUNCTION calculate_recipe_cost(recipe_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  total_cost DECIMAL := 0;
BEGIN
  SELECT SUM(ri.quantity * i.cost_per_unit)
  INTO total_cost
  FROM recipe_ingredients ri
  JOIN ingredients i ON ri.ingredient_id = i.id
  WHERE ri.recipe_id = calculate_recipe_cost.recipe_id;
  
  RETURN total_cost;
END;
$$ LANGUAGE plpgsql;

-- Contoh trigger untuk update cost_price saat recipe diubah
CREATE OR REPLACE FUNCTION update_menu_item_cost()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE menu_items
  SET cost_price = calculate_recipe_cost(NEW.recipe_id),
      updated_at = NOW()
  WHERE recipe_id = NEW.recipe_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_recipe_cost_trigger
AFTER INSERT OR UPDATE ON recipe_ingredients
FOR EACH ROW
EXECUTE FUNCTION update_menu_item_cost();
```

## 5. Next.js App Structure

### 5.1 Struktur Direktori

```
kaluner/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── recipes/
│   │   ├── inventory/
│   │   ├── menu/
│   │   ├── sales/
│   │   ├── purchases/
│   │   ├── promotions/
│   │   ├── customers/
│   │   ├── reports/
│   │   └── planning/
│   ├── api/
│   │   ├── webhooks/
│   │   └── [custom endpoints]/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   ├── forms/
│   ├── recipes/
│   ├── inventory/
│   ├── menu/
│   ├── sales/
│   ├── purchases/
│   ├── promotions/
│   ├── customers/
│   ├── reports/
│   └── planning/
├── lib/
│   ├── supabase/
│   ├── utils/
│   ├── hooks/
│   └── validators/
├── public/
├── .env.local
├── next.config.js
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

### 5.2 Server Components vs Client Components

- **Server Components** (default in App Router):
  - Data fetching dari Supabase
  - Rendering UI statis atau yang jarang berubah
  - SEO-sensitive pages

- **Client Components** (dengan "use client" directive):
  - Interactive UI elements
  - Form dengan validasi client-side
  - Komponen yang menggunakan hooks React
  - Realtime features dengan Supabase subscriptions

### 5.3 API Routes dan Server Actions

- **API Routes** (`app/api/`):
  - Webhook handlers
  - Integrasi dengan layanan pihak ketiga
  - Custom endpoints yang tidak dapat ditangani oleh Supabase

- **Server Actions**:
  - Form submissions
  - Data mutations
  - Complex business logic

## 6. Integrasi Supabase

### 6.1 Autentikasi

```typescript
// lib/supabase/auth.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const signIn = async (email: string, password: string) => {
  const supabase = createClientComponentClient()
  return supabase.auth.signInWithPassword({
    email,
    password
  })
}

export const signUp = async (email: string, password: string) => {
  const supabase = createClientComponentClient()
  return supabase.auth.signUp({
    email,
    password
  })
}
```

### 6.2 Data Fetching (Server Components)

```typescript
// app/recipes/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function RecipesPage() {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error(error)
    return <div>Error loading recipes</div>
  }
  
  return (
    <div>
      <h1>Recipes</h1>
      {/* Render recipes */}
    </div>
  )
}
```

### 6.3 Realtime Subscriptions (Client Components)

```typescript
// components/inventory/InventoryList.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function InventoryList() {
  const [inventory, setInventory] = useState([])
  const supabase = createClientComponentClient()
  
  useEffect(() => {
    // Initial fetch
    const fetchInventory = async () => {
      const { data } = await supabase
        .from('inventory')
        .select('*, ingredients(name)')
      
      if (data) setInventory(data)
    }
    
    fetchInventory()
    
    // Set up realtime subscription
    const channel = supabase
      .channel('inventory-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'inventory' }, 
        (payload) => {
          // Update inventory state based on changes
          // ...
        }
      )
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])
  
  return (
    <div>
      {/* Render inventory items */}
    </div>
  )
}
```

### 6.4 Storage

```typescript
// components/recipes/RecipeImageUpload.tsx
'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function RecipeImageUpload({ recipeId }) {
  const supabase = createClientComponentClient()
  
  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    const fileExt = file.name.split('.').pop()
    const fileName = `${recipeId}.${fileExt}`
    const filePath = `recipe-images/${fileName}`
    
    const { error } = await supabase.storage
      .from('recipe-images')
      .upload(filePath, file, { upsert: true })
    
    if (error) {
      console.error(error)
      return
    }
    
    // Update recipe with image URL
    await supabase
      .from('recipes')
      .update({ image_url: filePath })
      .eq('id', recipeId)
  }
  
  return (
    <input type="file" accept="image/*" onChange={handleUpload} />
  )
}
```

## 7. Keamanan Sistem

### 7.1 Autentikasi dan Otorisasi

- **Supabase Auth** untuk manajemen pengguna dan autentikasi
- **Row Level Security (RLS)** untuk kontrol akses data
- **Middleware Next.js** untuk proteksi rute
- **JWT Verification** untuk API routes

### 7.2 Keamanan Data

- **Enkripsi data** menggunakan fitur PostgreSQL
- **HTTPS/TLS** untuk semua komunikasi
- **Prepared statements** untuk mencegah SQL injection
- **Input validation** dengan Zod

### 7.3 Keamanan Aplikasi

- **CSRF Protection** dengan Next.js built-in protection
- **Content Security Policy (CSP)** 
- **Rate limiting** dengan Supabase Edge Functions
- **Secure Headers** dengan next-secure-headers

## 8. Skalabilitas dan Performa

### 8.1 Strategi Skalabilitas

- **Supabase Autoscaling** untuk database
- **Vercel Edge Network** untuk distribusi global
- **Incremental Static Regeneration (ISR)** untuk konten yang jarang berubah
- **Edge Functions** untuk komputasi terdistribusi

### 8.2 Optimasi Performa

- **Image Optimization** dengan Next.js Image
- **Code Splitting** otomatis dengan Next.js
- **Lazy Loading** untuk komponen berat
- **Database Indexing** di Supabase PostgreSQL
- **Connection Pooling** untuk database

## 9. Integrasi dengan Sistem Eksternal

### 9.1 Payment Gateways

- Integrasi dengan Midtrans atau Xendit menggunakan Supabase Edge Functions

### 9.2 Accounting Software

- Ekspor data ke format yang kompatibel dengan software akuntansi
- API integrations dengan Xero atau software akuntansi lokal

### 9.3 E-commerce Platforms

- Webhook handlers untuk GoFood, GrabFood, atau Tokopedia
- Sinkronisasi menu dan stok melalui API

## 10. Deployment dan DevOps

### 10.1 Environments

- Development: Local Supabase & Next.js dev server
- Staging: Vercel Preview Environments & Supabase Preview
- Production: Vercel Production & Supabase Production

### 10.2 CI/CD Pipeline

- GitHub Actions untuk testing
- Vercel untuk preview deployments dan production deployments
- Supabase CLI untuk database migrations

### 10.3 Monitoring dan Logging

- Vercel Analytics untuk frontend monitoring
- Supabase Monitoring untuk database performance
- Sentry untuk error tracking

## 11. Roadmap Pengembangan

### 11.1 Fase 1: MVP (Minimum Viable Product)

- Autentikasi dan manajemen pengguna
- Manajemen resep dan perhitungan HPP
- Inventaris dasar
- Penetapan harga sederhana

### 11.2 Fase 2: Core Features

- Manajemen inventaris lengkap
- Penetapan harga advanced
- Perencanaan bisnis dasar
- Laporan dasar

### 11.3 Fase 3: Advanced Features

- Manajemen promosi
- Program loyalitas
- Laporan komprehensif
- Integrasi dengan sistem pembayaran

### 11.4 Fase 4: Enterprise Features

- Multi-outlet management
- Advanced analytics
- Integrasi dengan e-commerce
- White-label solutions

## 12. Pertimbangan Teknis Tambahan

### 12.1 Offline Capability

- Next.js Service Worker untuk offline access
- Local storage untuk data penting
- Sinkronisasi data saat online

### 12.2 Multilingual Support

- Next.js Internationalization (i18n)
- Terjemahan untuk Bahasa Indonesia dan Inggris

### 12.3 Mobile Responsiveness

- Tailwind CSS untuk desain responsif
- Mobile-first approach
- Testing pada berbagai ukuran layar

## 13. Kesimpulan

Dokumen teknis ini memberikan gambaran komprehensif tentang arsitektur, teknologi, dan implementasi aplikasi Kaluner menggunakan Next.js dan Supabase. Kombinasi Next.js dan Supabase menawarkan pendekatan modern dan efisien untuk pengembangan aplikasi, dengan keuntungan seperti:

1. **Pengembangan yang cepat** dengan fullstack JavaScript/TypeScript
2. **Infrastruktur terkelola** yang mengurangi beban operasional
3. **Skalabilitas** yang didukung oleh Vercel dan Supabase
4. **Keamanan** dengan Row Level Security dan autentikasi bawaan
5. **Realtime capabilities** untuk fitur kolaboratif

Dokumen ini akan terus diperbarui seiring dengan perkembangan proyek dan perubahan kebutuhan. Tujuan utama dari desain teknis ini adalah untuk memastikan bahwa aplikasi Kaluner dapat dibangun dengan cara yang skalabel, aman, dan mudah dipelihara, serta memberikan nilai maksimal bagi pemilik bisnis kuliner.
