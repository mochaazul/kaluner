# Supabase Setup untuk Kaluner

Dokumen ini menjelaskan cara mengatur dan mengelola database Supabase untuk aplikasi Kaluner.

## Struktur Database

Database Kaluner terdiri dari beberapa tabel utama:

### Tabel Utama

1. **businesses** - Menyimpan informasi bisnis kuliner
   - `id`: UUID (Primary Key)
   - `name`: Nama bisnis
   - `description`: Deskripsi bisnis
   - `logo_url`: URL logo bisnis
   - `address`: Alamat bisnis
   - `phone`: Nomor telepon
   - `email`: Email bisnis
   - `tax_id`: Nomor NPWP
   - `currency`: Mata uang (default: IDR)
   - `owner_id`: ID pemilik bisnis (referensi ke auth.users)

2. **ingredients** - Menyimpan informasi bahan-bahan
   - `id`: UUID (Primary Key)
   - `business_id`: ID bisnis (Foreign Key)
   - `name`: Nama bahan
   - `description`: Deskripsi bahan
   - `unit`: Satuan bahan (gram, kg, liter, dll)
   - `cost_per_unit`: Biaya per satuan
   - `stock_quantity`: Jumlah stok
   - `min_stock_level`: Level stok minimum
   - `supplier_id`: ID pemasok (Foreign Key)
   - `category`: Kategori bahan
   - `expiry_date`: Tanggal kadaluarsa
   - `storage_location`: Lokasi penyimpanan
   - `batch_number`: Nomor batch
   - `last_updated`: Waktu terakhir diperbarui

3. **suppliers** - Menyimpan informasi pemasok
   - `id`: UUID (Primary Key)
   - `business_id`: ID bisnis (Foreign Key)
   - `name`: Nama pemasok
   - `contact_person`: Nama kontak
   - `phone`: Nomor telepon
   - `email`: Email pemasok
   - `address`: Alamat pemasok
   - `payment_terms`: Ketentuan pembayaran

4. **recipes** - Menyimpan informasi resep
   - `id`: UUID (Primary Key)
   - `business_id`: ID bisnis (Foreign Key)
   - `name`: Nama resep
   - `description`: Deskripsi resep
   - `category`: Kategori resep
   - `portion_size`: Ukuran porsi
   - `portion_unit`: Satuan porsi
   - `preparation_time`: Waktu persiapan (menit)
   - `cooking_time`: Waktu memasak (menit)
   - `instructions`: Instruksi pembuatan
   - `notes`: Catatan tambahan
   - `cost`: Biaya total
   - `image_url`: URL gambar resep

5. **recipe_ingredients** - Menyimpan hubungan antara resep dan bahan
   - `id`: UUID (Primary Key)
   - `recipe_id`: ID resep (Foreign Key)
   - `ingredient_id`: ID bahan (Foreign Key)
   - `quantity`: Jumlah bahan
   - `unit`: Satuan bahan
   - `preparation_method`: Metode persiapan
   - `notes`: Catatan tambahan

### Tabel Penjualan dan Inventaris

6. **menu_items** - Menyimpan item menu
   - `id`: UUID (Primary Key)
   - `business_id`: ID bisnis (Foreign Key)
   - `recipe_id`: ID resep (Foreign Key, opsional)
   - `name`: Nama item menu
   - `description`: Deskripsi item
   - `category`: Kategori menu
   - `selling_price`: Harga jual
   - `cost_price`: Harga biaya
   - `profit_margin`: Margin keuntungan
   - `is_active`: Status aktif

7. **promotions** - Menyimpan informasi promosi
   - `id`: UUID (Primary Key)
   - `business_id`: ID bisnis (Foreign Key)
   - `name`: Nama promosi
   - `description`: Deskripsi promosi
   - `start_date`: Tanggal mulai
   - `end_date`: Tanggal berakhir
   - `discount_type`: Tipe diskon (persentase, jumlah tetap, dll)
   - `discount_value`: Nilai diskon
   - `min_purchase`: Pembelian minimum
   - `max_discount`: Diskon maksimum
   - `applicable_items`: Item yang berlaku (JSONB)

8. **customers** - Menyimpan informasi pelanggan
   - `id`: UUID (Primary Key)
   - `business_id`: ID bisnis (Foreign Key)
   - `name`: Nama pelanggan
   - `phone`: Nomor telepon
   - `email`: Email pelanggan
   - `address`: Alamat pelanggan
   - `notes`: Catatan tambahan

9. **sales** - Menyimpan informasi penjualan
   - `id`: UUID (Primary Key)
   - `business_id`: ID bisnis (Foreign Key)
   - `date`: Tanggal penjualan
   - `total_amount`: Jumlah total
   - `discount_amount`: Jumlah diskon
   - `tax_amount`: Jumlah pajak
   - `payment_method`: Metode pembayaran
   - `customer_id`: ID pelanggan (Foreign Key, opsional)
   - `notes`: Catatan tambahan

10. **sale_items** - Menyimpan item penjualan
    - `id`: UUID (Primary Key)
    - `sale_id`: ID penjualan (Foreign Key)
    - `menu_item_id`: ID item menu (Foreign Key)
    - `quantity`: Jumlah
    - `unit_price`: Harga satuan
    - `discount`: Diskon
    - `subtotal`: Subtotal

11. **purchases** - Menyimpan informasi pembelian
    - `id`: UUID (Primary Key)
    - `business_id`: ID bisnis (Foreign Key)
    - `supplier_id`: ID pemasok (Foreign Key, opsional)
    - `date`: Tanggal pembelian
    - `total_amount`: Jumlah total
    - `payment_status`: Status pembayaran
    - `payment_due`: Tanggal jatuh tempo
    - `notes`: Catatan tambahan

12. **purchase_items** - Menyimpan item pembelian
    - `id`: UUID (Primary Key)
    - `purchase_id`: ID pembelian (Foreign Key)
    - `ingredient_id`: ID bahan (Foreign Key)
    - `quantity`: Jumlah
    - `unit_price`: Harga satuan
    - `subtotal`: Subtotal

13. **business_settings** - Menyimpan pengaturan bisnis
    - `id`: UUID (Primary Key)
    - `business_id`: ID bisnis (Foreign Key)
    - `setting_key`: Kunci pengaturan
    - `setting_value`: Nilai pengaturan (JSONB)

## Row Level Security (RLS)

Semua tabel dilindungi dengan Row Level Security (RLS) untuk memastikan bahwa pengguna hanya dapat mengakses data milik mereka sendiri. Kebijakan RLS diterapkan berdasarkan `owner_id` untuk tabel `businesses` dan `business_id` untuk tabel lainnya.

## Menjalankan Migrasi

Untuk menjalankan migrasi database:

1. Pastikan Anda telah mengatur Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login ke Supabase:
   ```bash
   supabase login
   ```

3. Link proyek Anda:
   ```bash
   supabase link --project-ref <project-ref>
   ```

4. Jalankan migrasi:
   ```bash
   supabase db push
   ```

## Pengembangan Lokal

Untuk pengembangan lokal, Anda dapat menggunakan Supabase local development:

1. Mulai Supabase lokal:
   ```bash
   supabase start
   ```

2. Jalankan migrasi:
   ```bash
   supabase db reset
   ```

3. Hentikan Supabase lokal setelah selesai:
   ```bash
   supabase stop
   ```

## Variabel Lingkungan

Pastikan Anda telah mengatur variabel lingkungan berikut di file `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=<supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<supabase-service-role-key>
