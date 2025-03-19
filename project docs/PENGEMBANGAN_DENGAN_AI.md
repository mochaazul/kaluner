# Panduan Pengembangan Kaluner dengan AI-Agent

## Pendahuluan

Dokumen ini berisi panduan langkah demi langkah untuk mengembangkan aplikasi Kaluner menggunakan AI-agent. Panduan ini menyediakan urutan pengembangan yang optimal, dengan penjelasan mengapa urutan tersebut dipilih, serta tips khusus untuk memastikan AI-agent dapat mengembangkan aplikasi tanpa kesalahan. Pengembangan akan menggunakan **Next.js 14** dan mengikuti pendekatan **Test-Driven Development (TDD)**.

## Urutan Pengembangan dan Alasannya

### 1. Setup Proyek dan Infrastruktur Dasar (Fondasi)

**Apa yang harus dikembangkan:**
- Inisialisasi proyek Next.js 14 dengan TypeScript dan App Router
- Konfigurasi Tailwind CSS dan Shadcn/UI
- Setup Supabase dan konfigurasi awal
- Struktur direktori dasar
- Setup testing environment dengan Jest dan React Testing Library

**Mengapa harus dikembangkan terlebih dahulu:**
- Menyediakan fondasi yang solid untuk seluruh aplikasi
- Memastikan konsistensi teknologi dan struktur
- Menghindari refactoring besar di kemudian hari
- Memudahkan pengembangan fitur secara paralel setelahnya
- Memungkinkan pendekatan TDD dari awal

**Petunjuk untuk AI-agent:**
- Gunakan `create-next-app` dengan flag `--typescript` (App Router adalah default di Next.js 14)
- Setup Jest dan React Testing Library untuk unit testing
- Pastikan struktur direktori sesuai dengan dokumentasi teknis
- Buat utilitas untuk Supabase yang dapat digunakan di seluruh aplikasi
- Siapkan komponen UI dasar yang akan digunakan berulang kali
- Tulis test untuk utilitas dan komponen dasar sebelum implementasi

**Test yang harus dibuat terlebih dahulu:**
- Test untuk utilitas Supabase
- Test untuk komponen UI dasar
- Test untuk routing dan middleware

### 2. Autentikasi dan Manajemen Pengguna

**Apa yang harus dikembangkan:**
- Sistem login/register dengan Supabase Auth
- Middleware untuk proteksi rute
- Halaman profil pengguna
- Manajemen profil bisnis

**Mengapa harus dikembangkan terlebih dahulu:**
- Merupakan prasyarat untuk semua fitur lain yang memerlukan autentikasi
- Memungkinkan pengujian Row Level Security (RLS) sejak awal
- Memastikan keamanan data sejak awal pengembangan
- Membentuk dasar untuk personalisasi dan pengalaman pengguna

**Petunjuk untuk AI-agent:**
- Implementasikan autentikasi menggunakan Supabase Auth Helpers for Next.js 14
- Gunakan Server Components untuk data fetching yang aman
- Manfaatkan Server Actions untuk form submissions (fitur Next.js 14)
- Terapkan RLS di Supabase untuk semua tabel
- Pastikan validasi form yang ketat dengan Zod

**Test yang harus dibuat terlebih dahulu:**
- Test untuk fungsi autentikasi (login, register, logout)
- Test untuk middleware proteksi rute
- Test untuk komponen form login/register
- Test untuk halaman profil pengguna

### 3. Skema Database dan Migrasi

**Apa yang harus dikembangkan:**
- Skema database lengkap sesuai dokumentasi teknis
- Migrasi database awal
- Fungsi dan trigger PostgreSQL
- Kebijakan RLS untuk semua tabel

**Mengapa harus dikembangkan terlebih dahulu:**
- Menyediakan struktur data yang solid untuk semua fitur
- Memastikan relasi antar tabel sudah benar sejak awal
- Menghindari migrasi yang rumit di kemudian hari
- Memungkinkan pengembangan fitur secara paralel dengan database yang konsisten

**Petunjuk untuk AI-agent:**
- Buat skema database sesuai dengan dokumentasi teknis
- Pastikan semua relasi dan constraint sudah benar
- Implementasikan RLS untuk semua tabel
- Buat fungsi PostgreSQL untuk logika bisnis kompleks seperti perhitungan HPP

**Test yang harus dibuat terlebih dahulu:**
- Test untuk skema database
- Test untuk migrasi database
- Test untuk fungsi dan trigger PostgreSQL
- Test untuk kebijakan RLS

### 4. Manajemen Bahan Baku (Ingredients)

**Apa yang harus dikembangkan:**
- CRUD untuk bahan baku
- Form penambahan dan edit bahan
- Daftar bahan dengan filter dan pencarian
- Integrasi dengan supplier

**Mengapa harus dikembangkan terlebih dahulu:**
- Merupakan komponen dasar untuk fitur resep dan inventaris
- Data bahan baku diperlukan sebelum dapat membuat resep
- Relatif sederhana namun memberikan nilai segera kepada pengguna
- Memungkinkan pengujian pola CRUD yang akan digunakan di seluruh aplikasi

**Petunjuk untuk AI-agent:**
- Perhatikan perubahan field dari `price_per_unit` menjadi `cost_per_unit` sesuai memori
- Gunakan Server Actions untuk mutasi data
- Implementasikan validasi form dengan Zod
- Buat komponen UI yang reusable untuk tabel dan form

**Test yang harus dibuat terlebih dahulu:**
- Test untuk CRUD bahan baku
- Test untuk form penambahan dan edit bahan
- Test untuk daftar bahan dengan filter dan pencarian
- Test untuk integrasi dengan supplier

### 5. Manajemen Resep

**Apa yang harus dikembangkan:**
- CRUD untuk resep
- Form pembuatan resep dengan multiple ingredients
- Perhitungan HPP otomatis
- Dukungan untuk resep bertingkat

**Mengapa harus dikembangkan setelah bahan baku:**
- Membutuhkan data bahan baku yang sudah tersedia
- Merupakan fitur inti dari aplikasi
- Menyediakan dasar untuk fitur penetapan harga
- Memperkenalkan logika bisnis yang lebih kompleks

**Petunjuk untuk AI-agent:**
- Perhatikan perubahan field dari `yield_quantity` menjadi `portion_size` dan `yield_unit` menjadi `portion_unit` sesuai memori
- Implementasikan UI yang intuitif untuk menambahkan bahan ke resep
- Gunakan perhitungan real-time untuk HPP
- Pastikan validasi yang ketat untuk jumlah dan satuan

**Test yang harus dibuat terlebih dahulu:**
- Test untuk CRUD resep
- Test untuk form pembuatan resep
- Test untuk perhitungan HPP
- Test untuk dukungan resep bertingkat

### 6. Manajemen Inventaris

**Apa yang harus dikembangkan:**
- Pelacakan stok bahan baku
- Penyesuaian stok manual
- Notifikasi stok menipis
- Manajemen supplier

**Mengapa harus dikembangkan setelah resep:**
- Membutuhkan data bahan baku dan resep
- Melengkapi siklus manajemen bahan dari pembelian hingga penggunaan
- Memberikan nilai tambah dengan membantu pengelolaan stok
- Memungkinkan integrasi dengan perhitungan HPP yang akurat

**Petunjuk untuk AI-agent:**
- Implementasikan sistem pelacakan stok yang real-time
- Buat UI yang intuitif untuk penyesuaian stok
- Gunakan Supabase Realtime untuk update stok
- Implementasikan logika notifikasi untuk stok menipis

**Test yang harus dibuat terlebih dahulu:**
- Test untuk pelacakan stok
- Test untuk penyesuaian stok manual
- Test untuk notifikasi stok menipis
- Test untuk manajemen supplier

### 7. Penetapan Harga

**Apa yang harus dikembangkan:**
- Kalkulator harga jual berdasarkan HPP
- Strategi margin yang dapat disesuaikan
- Perhitungan pajak dan biaya tambahan
- Analisis profitabilitas menu

**Mengapa harus dikembangkan setelah inventaris:**
- Membutuhkan data HPP yang akurat dari resep
- Melengkapi siklus dari biaya hingga harga jual
- Memberikan nilai bisnis langsung kepada pengguna
- Mempersiapkan dasar untuk fitur promosi

**Petunjuk untuk AI-agent:**
- Implementasikan berbagai strategi penetapan harga
- Buat UI yang memudahkan simulasi harga
- Gunakan visualisasi untuk menunjukkan profitabilitas
- Pastikan perhitungan yang akurat untuk pajak dan biaya tambahan

**Test yang harus dibuat terlebih dahulu:**
- Test untuk kalkulator harga jual
- Test untuk strategi margin
- Test untuk perhitungan pajak dan biaya tambahan
- Test untuk analisis profitabilitas menu

### 8. Perencanaan Bisnis

**Apa yang harus dikembangkan:**
- Kalkulator target penjualan
- Analisis titik impas
- Proyeksi keuntungan
- Kalkulator ROI

**Mengapa harus dikembangkan setelah penetapan harga:**
- Membutuhkan data harga jual dan HPP yang akurat
- Memberikan wawasan bisnis berdasarkan data yang sudah ada
- Membantu pengguna membuat keputusan bisnis yang lebih baik
- Melengkapi fitur inti dengan analitik bisnis

**Petunjuk untuk AI-agent:**
- Gunakan library visualisasi seperti Recharts atau Tremor
- Implementasikan model perhitungan bisnis yang akurat
- Buat UI yang intuitif untuk simulasi skenario bisnis
- Pastikan validasi input yang ketat

**Test yang harus dibuat terlebih dahulu:**
- Test untuk kalkulator target penjualan
- Test untuk analisis titik impas
- Test untuk proyeksi keuntungan
- Test untuk kalkulator ROI

### 9. Manajemen Promosi

**Apa yang harus dikembangkan:**
- Kalkulator paket menu
- Analisis diskon
- Promosi beli-satu-gratis-satu
- Pelacakan efektivitas promosi

**Mengapa harus dikembangkan setelah perencanaan bisnis:**
- Membutuhkan data harga dan profitabilitas
- Merupakan fitur lanjutan yang membangun di atas fitur inti
- Memberikan nilai tambah untuk strategi pemasaran
- Melengkapi siklus dari produksi hingga penjualan

**Petunjuk untuk AI-agent:**
- Implementasikan berbagai jenis promosi
- Buat UI yang memudahkan pembuatan paket
- Gunakan visualisasi untuk menunjukkan dampak promosi
- Pastikan integrasi yang mulus dengan fitur penetapan harga

**Test yang harus dibuat terlebih dahulu:**
- Test untuk kalkulator paket menu
- Test untuk analisis diskon
- Test untuk promosi beli-satu-gratis-satu
- Test untuk pelacakan efektivitas promosi

### 10. Laporan dan Analitik

**Apa yang harus dikembangkan:**
- Dashboard metrik bisnis utama
- Laporan penjualan dan keuntungan
- Analisis performa menu
- Visualisasi data

**Mengapa harus dikembangkan terakhir:**
- Membutuhkan data dari semua fitur sebelumnya
- Memberikan pandangan holistik tentang bisnis
- Membantu pengambilan keputusan berdasarkan data
- Menyediakan nilai tambah sebagai fitur premium

**Petunjuk untuk AI-agent:**
- Gunakan Server Components untuk laporan yang kompleks
- Implementasikan filter dan opsi ekspor
- Buat visualisasi yang informatif dan menarik
- Pastikan performa yang baik meskipun dengan dataset besar

**Test yang harus dibuat terlebih dahulu:**
- Test untuk dashboard metrik bisnis utama
- Test untuk laporan penjualan dan keuntungan
- Test untuk analisis performa menu
- Test untuk visualisasi data

## Tips Khusus untuk Pengembangan dengan AI-Agent

### 1. Pendekatan Pengembangan

- **Test-Driven Development**: Selalu tulis test terlebih dahulu sebelum implementasi fitur
- **Incremental Development**: Kembangkan fitur secara bertahap, mulai dari yang paling sederhana
- **Component-First Approach**: Kembangkan komponen UI yang reusable sebelum halaman lengkap

### 2. Penanganan State dan Data

- **Server vs Client Components**: Gunakan Server Components untuk data fetching dan Client Components untuk interaktivitas
- **Server Actions**: Manfaatkan Server Actions (fitur Next.js 14) untuk form submissions dan mutasi data
- **Data Fetching Strategy**: Gunakan pattern React Server Components untuk data fetching dan SWR/React Query untuk client-side data fetching
- **State Management**: Gunakan Zustand untuk global state yang kompleks dan React Context untuk state yang lebih sederhana

### 3. Validasi dan Error Handling

- **Validasi Input**: Pastikan semua input divalidasi dengan Zod
- **Error Boundaries**: Implementasikan error boundaries untuk menangani crash
- **Feedback Pengguna**: Pastikan ada feedback yang jelas untuk setiap aksi pengguna
- **Test Coverage**: Pastikan test mencakup happy path dan error cases

### 4. Performa dan Optimasi

- **Lazy Loading**: Gunakan lazy loading untuk komponen berat
- **Pagination**: Implementasikan pagination untuk daftar yang panjang
- **Memoization**: Gunakan useMemo dan useCallback untuk optimasi
- **Next.js 14 Image Optimization**: Manfaatkan komponen Image dari Next.js untuk optimasi gambar

### 5. Keamanan

- **Input Sanitization**: Pastikan semua input dibersihkan sebelum diproses
- **RLS Testing**: Uji kebijakan RLS secara menyeluruh
- **Auth Checks**: Implementasikan pemeriksaan autentikasi di semua endpoint
- **CSRF Protection**: Manfaatkan proteksi CSRF bawaan dari Next.js 14

### 6. Testing Best Practices

- **Unit Testing**: Tulis unit test untuk fungsi dan komponen kecil
- **Integration Testing**: Tulis integration test untuk alur kerja yang lebih kompleks
- **E2E Testing**: Gunakan Playwright atau Cypress untuk end-to-end testing
- **Mock Services**: Gunakan MSW (Mock Service Worker) untuk mock API calls
- **Test Database**: Gunakan database terpisah untuk testing

## Kesimpulan

Dengan mengikuti urutan pengembangan ini dan menerapkan pendekatan Test-Driven Development, AI-agent dapat mengembangkan aplikasi Kaluner secara sistematis, efisien, dan dengan kualitas tinggi. Pendekatan bertahap ini memastikan bahwa setiap fitur dibangun di atas fondasi yang solid, mengurangi risiko refactoring besar, dan memberikan nilai kepada pengguna sejak awal.

Next.js 14 menyediakan berbagai fitur yang dapat mempercepat pengembangan, seperti Server Actions, App Router yang lebih matang, dan optimasi performa yang lebih baik. Dengan memanfaatkan fitur-fitur ini dan mengikuti pendekatan TDD, AI-agent dapat membangun aplikasi yang tidak hanya berfungsi dengan baik tetapi juga mudah dipelihara dan dikembangkan di masa depan.

Ingat untuk selalu merujuk pada dokumentasi teknis dan dokumen fitur di folder docs untuk detail implementasi. Gunakan memori tentang perubahan field (seperti `price_per_unit` menjadi `cost_per_unit`) untuk memastikan konsistensi di seluruh aplikasi.

Dengan perencanaan yang baik, pengembangan yang sistematis, dan pendekatan TDD, AI-agent dapat membangun aplikasi Kaluner yang berkualitas tinggi, mudah dipelihara, dan memberikan nilai maksimal bagi pemilik bisnis kuliner.
