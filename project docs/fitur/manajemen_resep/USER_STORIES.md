# User Stories dan Acceptance Criteria - Manajemen Resep & Perhitungan Biaya

## 1. Pengelolaan Bahan Baku

### User Story 1.1
**Sebagai** pemilik bisnis kuliner,  
**Saya ingin** menambahkan bahan baku ke dalam database,  
**Sehingga** saya dapat melacak semua bahan yang saya gunakan dalam resep.

#### Acceptance Criteria:
- Pengguna dapat menambahkan bahan baku baru dengan informasi: nama, deskripsi, dan kategori
- Pengguna dapat menentukan berbagai satuan ukuran untuk setiap bahan (gram, kilogram, liter, ml, buah, dll)
- Pengguna dapat mencatat harga beli per satuan
- Pengguna dapat mencatat informasi pemasok dan kontak
- Pengguna dapat menandai bahan sebagai musiman atau khusus
- Sistem menyimpan data bahan baku dengan benar dan menampilkannya dalam daftar bahan

### User Story 1.2
**Sebagai** pemilik bisnis kuliner,  
**Saya ingin** memperbarui harga bahan baku,  
**Sehingga** perhitungan HPP selalu akurat dengan harga terkini.

#### Acceptance Criteria:
- Pengguna dapat memperbarui harga bahan baku secara individual
- Pengguna dapat memperbarui harga bahan baku secara massal
- Sistem menyimpan riwayat perubahan harga untuk analisis tren
- Sistem memberikan notifikasi ketika ada kenaikan harga yang signifikan
- Sistem secara otomatis menghitung konversi antar satuan ukuran

### User Story 1.3
**Sebagai** pemilik bisnis kuliner,  
**Saya ingin** mengimpor dan mengekspor data bahan baku,  
**Sehingga** saya dapat dengan mudah mengelola database bahan dalam jumlah besar.

#### Acceptance Criteria:
- Pengguna dapat mengimpor data bahan baku dari file CSV/Excel
- Sistem menyediakan template impor yang dapat diunduh
- Sistem melakukan validasi data saat impor dan menampilkan pesan kesalahan jika ada
- Pengguna dapat mengekspor database bahan untuk cadangan
- Sistem mengonfirmasi keberhasilan impor/ekspor data

## 2. Pembuatan dan Pengelolaan Resep

### User Story 2.1
**Sebagai** pemilik bisnis kuliner,  
**Saya ingin** membuat resep baru dengan antarmuka yang intuitif,  
**Sehingga** saya dapat dengan mudah mendokumentasikan menu saya.

#### Acceptance Criteria:
- Pengguna dapat membuat resep baru dengan nama dan deskripsi
- Pengguna dapat menambahkan bahan dengan fitur pencarian cepat
- Pengguna dapat mengatur jumlah dan satuan untuk setiap bahan
- Pengguna dapat menentukan jumlah porsi yang dihasilkan (yield)
- Pengguna dapat menambahkan instruksi pembuatan (opsional)
- Pengguna dapat mengunggah foto untuk referensi visual
- Sistem menyimpan resep dengan benar dan menampilkannya dalam daftar resep

### User Story 2.2
**Sebagai** pemilik bisnis kuliner,  
**Saya ingin** membuat resep bertingkat (resep di dalam resep),  
**Sehingga** saya dapat mengelola menu kompleks dengan lebih efisien.

#### Acceptance Criteria:
- Pengguna dapat menggunakan resep yang ada sebagai "bahan" dalam resep baru
- Sistem secara otomatis menghitung biaya dari resep dasar ke resep kompleks
- Sistem menampilkan visualisasi hierarki resep
- Sistem melacak perubahan pada resep dasar dan memperbarui resep turunan
- Pengguna dapat melihat detail resep dasar dari dalam resep kompleks

### User Story 2.3
**Sebagai** pemilik bisnis kuliner,  
**Saya ingin** mengategorikan dan mengorganisir resep saya,  
**Sehingga** saya dapat dengan mudah menemukan dan mengelola menu.

#### Acceptance Criteria:
- Pengguna dapat mengelompokkan resep berdasarkan kategori (makanan utama, minuman, dessert, dll)
- Pengguna dapat membuat dan menerapkan tag kustom untuk pencarian dan filter
- Pengguna dapat mengurutkan resep berdasarkan popularitas, biaya, margin, dll
- Pengguna dapat menandai menu sebagai spesial atau musiman
- Sistem menyimpan pengaturan kategori dan menampilkan resep sesuai filter yang dipilih

### User Story 2.4
**Sebagai** pemilik bisnis kuliner,  
**Saya ingin** menduplikasi dan membuat variasi dari resep yang ada,  
**Sehingga** saya dapat mengembangkan menu baru dengan efisien.

#### Acceptance Criteria:
- Pengguna dapat menyalin resep yang ada untuk membuat variasi baru
- Pengguna dapat membandingkan versi resep yang berbeda
- Sistem menyimpan riwayat perubahan resep
- Pengguna dapat kembali ke versi resep sebelumnya jika diperlukan
- Sistem mengonfirmasi keberhasilan duplikasi resep

## 3. Perhitungan Biaya (HPP)

### User Story 3.1
**Sebagai** pemilik bisnis kuliner,  
**Saya ingin** sistem secara otomatis menghitung HPP per porsi,  
**Sehingga** saya dapat mengetahui biaya sebenarnya dari setiap menu.

#### Acceptance Criteria:
- Sistem menghitung HPP per porsi secara real-time saat resep dibuat atau diedit
- Sistem menampilkan breakdown biaya per bahan dalam resep
- Sistem menyediakan visualisasi proporsi biaya (diagram lingkaran)
- Sistem menghitung persentase kontribusi setiap bahan terhadap total biaya
- Pengguna dapat melihat HPP dalam berbagai mata uang (jika diperlukan)

### User Story 3.2
**Sebagai** pemilik bisnis kuliner,  
**Saya ingin** menambahkan biaya tambahan ke dalam perhitungan HPP,  
**Sehingga** saya mendapatkan gambaran biaya yang lebih akurat.

#### Acceptance Criteria:
- Pengguna dapat menambahkan biaya tenaga kerja per resep
- Pengguna dapat menambahkan biaya overhead (listrik, gas, air)
- Pengguna dapat menambahkan biaya kemasan dan penyajian
- Pengguna dapat mengatur faktor penyusutan (waste factor) yang dapat disesuaikan
- Sistem menghitung ulang HPP total dengan memperhitungkan semua biaya tambahan

### User Story 3.3
**Sebagai** pemilik bisnis kuliner,  
**Saya ingin** menganalisis dan mengoptimalkan HPP menu saya,  
**Sehingga** saya dapat meningkatkan profitabilitas.

#### Acceptance Criteria:
- Sistem mengidentifikasi bahan dengan kontribusi biaya tertinggi
- Sistem memberikan saran substitusi bahan untuk mengurangi biaya
- Pengguna dapat mensimulasikan perubahan ukuran porsi dan melihat dampaknya pada HPP
- Pengguna dapat membandingkan HPP antar menu serupa
- Sistem menampilkan perbandingan HPP sebelum dan sesudah optimasi

### User Story 3.4
**Sebagai** pemilik bisnis kuliner,  
**Saya ingin** mendapatkan laporan HPP yang komprehensif,  
**Sehingga** saya dapat menganalisis biaya menu secara menyeluruh.

#### Acceptance Criteria:
- Sistem menghasilkan laporan HPP per kategori menu
- Sistem menampilkan tren HPP dari waktu ke waktu
- Sistem memberikan peringatan ketika HPP melebihi threshold tertentu
- Pengguna dapat mengekspor laporan dalam format PDF/Excel
- Laporan mencakup visualisasi dan analisis yang mudah dipahami

## 4. Integrasi dengan Fitur Lain

### User Story 4.1
**Sebagai** pemilik bisnis kuliner,  
**Saya ingin** HPP terintegrasi dengan fitur penetapan harga,  
**Sehingga** saya dapat dengan mudah menentukan harga jual yang optimal.

#### Acceptance Criteria:
- Sistem secara otomatis menghitung harga jual berdasarkan HPP dan target margin
- Pengguna dapat mensimulasikan berbagai skenario harga dan melihat dampaknya pada keuntungan
- Perubahan pada HPP secara otomatis memperbarui rekomendasi harga jual
- Pengguna dapat melihat perbandingan HPP dan harga jual dalam satu tampilan

### User Story 4.2
**Sebagai** pemilik bisnis kuliner,  
**Saya ingin** HPP terintegrasi dengan fitur perencanaan bisnis,  
**Sehingga** saya dapat membuat proyeksi keuangan yang akurat.

#### Acceptance Criteria:
- Sistem dapat memproyeksikan biaya bahan berdasarkan target penjualan
- Pengguna dapat melakukan analisis sensitivitas terhadap fluktuasi harga bahan
- Data HPP secara otomatis digunakan dalam perhitungan proyeksi keuntungan
- Pengguna dapat melihat dampak perubahan HPP pada target bisnis

### User Story 4.3
**Sebagai** pemilik bisnis kuliner,  
**Saya ingin** HPP terintegrasi dengan fitur inventaris,  
**Sehingga** saya dapat mengelola stok bahan dengan lebih efisien.

#### Acceptance Criteria:
- Sistem memberikan peringatan ketika resep menggunakan bahan yang stoknya menipis
- Sistem menghitung kebutuhan bahan berdasarkan proyeksi penjualan
- Perubahan harga bahan di inventaris secara otomatis memperbarui HPP
- Pengguna dapat melihat status inventaris bahan yang digunakan dalam resep

### User Story 4.4
**Sebagai** pemilik bisnis kuliner,  
**Saya ingin** HPP terintegrasi dengan fitur manajemen promosi,  
**Sehingga** saya dapat membuat promosi yang menguntungkan.

#### Acceptance Criteria:
- Sistem menghitung HPP untuk paket menu dan promosi
- Sistem menganalisis margin untuk menu yang masuk dalam promosi
- Pengguna dapat melihat dampak promosi pada profitabilitas berdasarkan HPP
- Sistem memberikan rekomendasi menu untuk promosi berdasarkan HPP dan margin
