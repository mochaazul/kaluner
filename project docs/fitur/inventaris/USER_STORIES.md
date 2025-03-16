# User Stories dan Acceptance Criteria - Inventaris & Pembelian

## 1. Pengelolaan Stok Bahan Baku

### User Story 1.1
**Sebagai** pemilik bisnis kuliner,  
**Saya ingin** mencatat dan melacak stok bahan baku,  
**Sehingga** saya dapat mengetahui ketersediaan bahan untuk produksi.

#### Acceptance Criteria:
- Pengguna dapat mencatat jumlah stok untuk setiap bahan baku
- Pengguna dapat menentukan satuan ukuran untuk stok (kg, liter, buah, dll)
- Pengguna dapat mengatur lokasi penyimpanan bahan
- Pengguna dapat mencatat tanggal masuk dan kedaluwarsa bahan
- Sistem menampilkan status bahan (tersedia, hampir habis, kedaluwarsa) dengan indikator visual
- Sistem menampilkan daftar stok yang dapat diurutkan dan difilter

### User Story 1.2
**Sebagai** pemilik bisnis kuliner,  
**Saya ingin** memperbarui stok bahan baku dengan mudah,  
**Sehingga** data inventaris selalu akurat.

#### Acceptance Criteria:
- Pengguna dapat memperbarui stok secara manual saat pembelian atau penggunaan
- Sistem memperbarui stok secara otomatis berdasarkan penjualan menu (jika terintegrasi dengan POS)
- Pengguna dapat melakukan penyesuaian stok (stock adjustment) untuk mengoreksi perbedaan
- Pengguna dapat mencatat alasan penyesuaian stok
- Sistem menyimpan riwayat perubahan stok untuk keperluan audit
- Sistem mengonfirmasi pembaruan stok dengan notifikasi

### User Story 1.3
**Sebagai** pemilik bisnis kuliner,  
**Saya ingin** menerima notifikasi dan peringatan terkait stok,  
**Sehingga** saya dapat mengambil tindakan tepat waktu.

#### Acceptance Criteria:
- Sistem memberikan peringatan ketika stok mencapai batas minimum
- Sistem memberikan notifikasi untuk bahan yang akan kedaluwarsa dalam waktu dekat
- Sistem memberikan peringatan jika terjadi ketidaksesuaian antara stok fisik dan sistem
- Pengguna dapat mengatur threshold peringatan yang dapat disesuaikan untuk setiap bahan
- Sistem mengirimkan notifikasi melalui aplikasi dan email (opsional)
- Pengguna dapat melihat semua notifikasi dalam satu dashboard

## 2. Manajemen Pemasok

### User Story 2.1
**Sebagai** pemilik bisnis kuliner,  
**Saya ingin** mengelola database pemasok,  
**Sehingga** saya dapat dengan mudah menghubungi dan bertransaksi dengan mereka.

#### Acceptance Criteria:
- Pengguna dapat mencatat informasi pemasok (nama, alamat, kontak)
- Pengguna dapat mengelompokkan pemasok berdasarkan kategori bahan
- Pengguna dapat mencatat syarat pembayaran dan pengiriman
- Pengguna dapat memberikan penilaian kinerja pemasok
- Sistem menyimpan riwayat transaksi dengan pemasok
- Pengguna dapat mencari pemasok berdasarkan nama, kategori, atau bahan yang disediakan

### User Story 2.2
**Sebagai** pemilik bisnis kuliner,  
**Saya ingin** membandingkan pemasok untuk bahan yang sama,  
**Sehingga** saya dapat memilih pemasok terbaik.

#### Acceptance Criteria:
- Pengguna dapat membandingkan harga antar pemasok untuk bahan yang sama
- Pengguna dapat menganalisis kualitas dan konsistensi pasokan
- Pengguna dapat mengevaluasi ketepatan waktu pengiriman
- Pengguna dapat membandingkan syarat pembayaran dan minimum order
- Sistem memberikan rekomendasi pemasok optimal berdasarkan kriteria yang dipilih
- Sistem menampilkan perbandingan dalam format tabel dan grafik

### User Story 2.3
**Sebagai** pemilik bisnis kuliner,  
**Saya ingin** mengelola komunikasi dengan pemasok,  
**Sehingga** proses pemesanan dan negosiasi berjalan lancar.

#### Acceptance Criteria:
- Pengguna dapat menjadwalkan pengingat untuk menghubungi pemasok
- Sistem menyediakan template pesan untuk pemesanan rutin
- Sistem mencatat riwayat komunikasi dengan pemasok
- Pengguna dapat mengelola dokumen kontrak dan perjanjian
- Pengguna dapat mengatur preferensi komunikasi untuk setiap pemasok
- Sistem terintegrasi dengan email untuk komunikasi langsung (opsional)

## 3. Perencanaan dan Pelacakan Pembelian

### User Story 3.1
**Sebagai** pemilik bisnis kuliner,  
**Saya ingin** sistem membuat daftar belanja otomatis,  
**Sehingga** saya tidak kehabisan stok bahan penting.

#### Acceptance Criteria:
- Sistem membuat daftar belanja otomatis berdasarkan stok minimum
- Sistem memberikan rekomendasi jumlah pembelian berdasarkan proyeksi penggunaan
- Pengguna dapat mengelompokkan belanja berdasarkan pemasok
- Pengguna dapat menetapkan prioritas pembelian berdasarkan urgensi
- Sistem menghitung estimasi biaya total belanja
- Pengguna dapat mengedit daftar belanja sebelum difinalisasi

### User Story 3.2
**Sebagai** pemilik bisnis kuliner,  
**Saya ingin** mengelola proses pemesanan dan penerimaan barang,  
**Sehingga** alur pembelian berjalan efisien.

#### Acceptance Criteria:
- Pengguna dapat membuat purchase order (PO) dari daftar belanja
- Pengguna dapat mengirim PO langsung ke pemasok melalui email
- Pengguna dapat mencatat penerimaan barang (goods receipt)
- Sistem memverifikasi kesesuaian barang yang diterima dengan pesanan
- Pengguna dapat mencatat dan menangani ketidaksesuaian dan retur
- Sistem secara otomatis memperbarui stok saat barang diterima

### User Story 3.3
**Sebagai** pemilik bisnis kuliner,  
**Saya ingin** melacak status pembelian,  
**Sehingga** saya dapat memastikan pesanan terpenuhi tepat waktu.

#### Acceptance Criteria:
- Sistem melacak status pemesanan (draft, terkirim, sebagian diterima, selesai)
- Sistem memberikan pengingat untuk pesanan yang belum diterima
- Sistem menyimpan riwayat pembelian untuk analisis
- Sistem menghitung rata-rata lead time pengiriman untuk setiap pemasok
- Sistem menghasilkan laporan keterlambatan pengiriman
- Pengguna dapat melihat status semua pemesanan dalam satu dashboard

## 4. Analisis dan Optimasi Inventaris

### User Story 4.1
**Sebagai** pemilik bisnis kuliner,  
**Saya ingin** menganalisis pola penggunaan bahan baku,  
**Sehingga** saya dapat merencanakan pembelian dengan lebih efisien.

#### Acceptance Criteria:
- Sistem menghitung tingkat perputaran inventaris (inventory turnover)
- Sistem mengidentifikasi bahan dengan perputaran rendah
- Sistem menganalisis pola penggunaan musiman
- Sistem menghitung rata-rata penggunaan harian untuk setiap bahan
- Sistem membuat proyeksi kebutuhan berdasarkan tren historis
- Sistem menampilkan analisis dalam bentuk grafik dan laporan

### User Story 4.2
**Sebagai** pemilik bisnis kuliner,  
**Saya ingin** mengoptimalkan level stok untuk setiap bahan,  
**Sehingga** saya dapat mengurangi biaya penyimpanan tanpa risiko kehabisan stok.

#### Acceptance Criteria:
- Sistem menghitung stok optimal untuk setiap bahan
- Sistem memberikan rekomendasi jumlah safety stock
- Sistem menganalisis Economic Order Quantity (EOQ)
- Sistem menyarankan strategi Just-In-Time untuk bahan tertentu
- Pengguna dapat mensimulasikan berbagai skenario untuk optimasi stok
- Sistem menampilkan perbandingan antara strategi stok saat ini dan yang direkomendasikan

### User Story 4.3
**Sebagai** pemilik bisnis kuliner,  
**Saya ingin** menganalisis biaya inventaris,  
**Sehingga** saya dapat mengidentifikasi peluang penghematan.

#### Acceptance Criteria:
- Sistem menghitung nilai inventaris saat ini
- Sistem menganalisis biaya penyimpanan untuk setiap bahan
- Sistem mengidentifikasi bahan dengan nilai inventaris tertinggi
- Sistem menghitung biaya kedaluwarsa dan pembuangan
- Sistem memberikan rekomendasi untuk mengurangi biaya inventaris
- Sistem menghasilkan laporan biaya inventaris untuk periode tertentu

## 5. Integrasi dengan Fitur Lain

### User Story 5.1
**Sebagai** pemilik bisnis kuliner,  
**Saya ingin** inventaris terintegrasi dengan manajemen resep,  
**Sehingga** saya dapat memastikan ketersediaan bahan untuk produksi.

#### Acceptance Criteria:
- Sistem menghitung ketersediaan bahan untuk produksi menu berdasarkan stok saat ini
- Sistem memperbarui stok secara otomatis saat resep diproduksi
- Sistem memberikan peringatan ketika resep menggunakan bahan yang stoknya terbatas
- Sistem merekomendasikan substitusi bahan berdasarkan ketersediaan
- Pengguna dapat melihat daftar menu yang dapat diproduksi dengan stok saat ini

### User Story 5.2
**Sebagai** pemilik bisnis kuliner,  
**Saya ingin** inventaris terintegrasi dengan perencanaan bisnis,  
**Sehingga** saya dapat merencanakan kebutuhan modal untuk bahan baku.

#### Acceptance Criteria:
- Sistem memproyeksikan kebutuhan inventaris berdasarkan target penjualan
- Sistem menghitung modal kerja yang diperlukan untuk inventaris
- Sistem menganalisis dampak fluktuasi harga bahan terhadap proyeksi keuangan
- Pengguna dapat merencanakan anggaran pembelian berdasarkan proyeksi
- Sistem menampilkan perbandingan antara anggaran dan pengeluaran aktual

### User Story 5.3
**Sebagai** pemilik bisnis kuliner,  
**Saya ingin** inventaris terintegrasi dengan laporan dan analitik,  
**Sehingga** saya mendapatkan wawasan komprehensif tentang kinerja inventaris.

#### Acceptance Criteria:
- Sistem menghasilkan laporan nilai inventaris untuk keperluan akuntansi
- Sistem menganalisis tren harga bahan baku dari waktu ke waktu
- Sistem memvisualisasikan pergerakan stok dalam bentuk grafik
- Sistem menyediakan dashboard kinerja inventaris dan pemasok
- Pengguna dapat mengekspor laporan dalam format PDF/Excel
- Pengguna dapat menyesuaikan periode laporan dan metrik yang ditampilkan
