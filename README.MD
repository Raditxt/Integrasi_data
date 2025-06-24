# 📦 Dokumentasi API - Sistem Manajemen Toko

Dokumen ini berisi endpoint-endpoint API untuk kebutuhan frontend dan backend sistem manajemen toko. Setiap endpoint memiliki validasi duplikasi dan penanganan error yang jelas.

---

## 📮 Endpoint: Pengiriman

### 🔍 Ambil semua pengiriman

* **Method**: `GET`
* **URL**: `/pengiriman`
* **Deskripsi**: Mengambil seluruh data pengiriman.

### 🔍 Ambil pengiriman berdasarkan ID Pesanan

* **Method**: `GET`
* **URL**: `/pengiriman/<id>`
* **Deskripsi**: Mengambil data pengiriman berdasarkan `id_pesanan`.

### ➕ Tambah Pengiriman

* **Method**: `POST`
* **URL**: `/pengiriman`
* **Body**:

```json
{
  "id_pesanan": int,
  "kurir": string,
  "no_resi": string,
  "status_pengiriman": "dikirim" | "diproses" | "selesai",
  "tanggal_kirim": date-string,
  "id_karyawan": int|null
}
```

* **Validasi**:

  * Tidak boleh ada `id_pesanan` dan `no_resi` yang sama.

---

## 🛒 Endpoint: Pesanan

### 🔍 Ambil semua pesanan

* **Method**: `GET`
* **URL**: `/pesanan`

### 🔍 Ambil pesanan berdasarkan ID

* **Method**: `GET`
* **URL**: `/pesanan/<id>`

### ➕ Tambah Pesanan

* **Method**: `POST`
* **URL**: `/pesanan`
* **Body**:

```json
{
  "id_pelanggan": int,
  "tanggal_pesanan": date-string,
  "total_pesanan": float
}
```

* **Validasi**:

  * Tidak boleh ada duplikat pesanan untuk pelanggan dan tanggal yang sama.

---

## 🧴 Endpoint: Produk

### 🔍 Ambil produk (opsional filter nama/brand)

* **Method**: `GET`
* **URL**: `/produk`
* **Query**:

  * `nama`: filter nama produk
  * `brand`: filter nama brand

### ➕ Tambah Produk

* **Method**: `POST`
* **URL**: `/produk`
* **Body**:

```json
{
  "nama_produk": string,
  "brand": string,
  "harga": float,
  "id_sub_kategori": int,
  "id_supplier": int
}
```

* **Validasi**:

  * Tidak boleh ada produk dengan `nama_produk` dan `brand` yang sama.

---

## 🌟 Endpoint: Rating Pembelanjaan

### 🔍 Ambil semua rating

* **Method**: `GET`
* **URL**: `/rating`

### ➕ Tambah Rating

* **Method**: `POST`
* **URL**: `/rating`
* **Body**:

```json
{
  "id_pesanan": int,
  "id_pelanggan": int,
  "rating_belanja": int (1-5),
  "komentar": string | null
}
```

* **Validasi**:

  * Satu pelanggan hanya boleh memberi rating untuk satu pesanan satu kali.

---

## 🏭 Endpoint: Supplier

### 🔍 Ambil Supplier (opsional filter nama)

* **Method**: `GET`
* **URL**: `/supplier`
* **Query**:

  * `nama_supplier`: filter berdasarkan nama supplier

### ➕ Tambah Supplier

* **Method**: `POST`
* **URL**: `/supplier`
* **Body**:

```json
{
  "nama_supplier": string,
  "alamat": string,
  "kontak": string
}
```

* **Validasi**:

  * Tidak boleh ada supplier dengan kombinasi nama dan kontak yang sama.

---

## 🔐 Keamanan & Validasi

* Semua endpoint telah dilengkapi dengan pengecekan `try-except` untuk menangani error internal.
* Validasi wajib menggunakan kombinasi `if not all([...])` untuk memastikan semua field terisi.
* Duplikasi dicek di level database dan frontend.

---

## ⚙️ Teknologi

* **Backend**: Flask
* **Database**: MySQL
* **Frontend**: JavaScript (fetch API)
* **Style**: TailwindCSS

---

## 📌 Tips Implementasi

* Gunakan fungsi `apiFetch` sebagai wrapper `fetch()` agar penanganan error konsisten.
* Gunakan helper `resetForm()` dan `showToast()` untuk UX yang responsif.
* Selalu update fungsi `loadX()` (misal `loadProduk()`, `loadSupplier()`) setelah aksi `POST`.

---

📄 *Dokumentasi ini dapat diperluas sesuai kebutuhan modul tambahan lain (pelanggan, karyawan, subkategori, dll).*
