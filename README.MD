# 📊 SellEase API Documentation

Dokumentasi lengkap endpoint API untuk aplikasi SellEase (POS dan dashboard penjualan).

---

## 📈 Dashboard

### 🔹 GET `/dashboard/stats`

Menampilkan statistik ringkasan dashboard.

#### Method

`GET`

#### Response

```json
{
  "total_products": 120,
  "total_customers": 80,
  "total_orders": 150,
  "avg_rating": 4.2,
  "total_suppliers": 10,
  "total_employees": 6
}
```

---

## 👥 Karyawan API

### 🔹 GET `/karyawan`

Ambil semua data karyawan.

### 🔹 POST `/karyawan`

Tambah data karyawan baru.

#### Body (JSON)

```json
{
  "nama_karyawan": "Raditya",
  "jabatan": "Kasir",
  "nomor_telepon": "08123456789"
}
```

---

## 📦 Produk API

### 🔹 GET `/produk`

Ambil produk (dapat difilter `nama`, `brand`).

### 🔹 POST `/produk`

Tambah produk baru.

#### Body

```json
{
  "nama_produk": "Indomie Goreng",
  "brand": "Indofood",
  "harga": 3000,
  "id_sub_kategori": 2,
  "id_supplier": 1
}
```

---

## 🙋 Pelanggan API

### 🔹 GET `/pelanggan`

Ambil seluruh pelanggan.

### 🔹 GET `/pelanggan/<id>`

Ambil data pelanggan berdasarkan ID.

### 🔹 POST `/pelanggan`

Tambah pelanggan baru.

#### Body

```json
{
  "nama_pelanggan": "Raditya",
  "email": "raditya@example.com",
  "nomor_telepon": "08123456789",
  "alamat": "Jakarta"
}
```

---

## 🧾 Pesanan API

### 🔹 GET `/pesanan`

Ambil semua pesanan.

### 🔹 GET `/pesanan/<id>`

Ambil detail pesanan berdasarkan ID.

### 🔹 POST `/pesanan`

Tambah pesanan baru.

#### Body

```json
{
  "id_pelanggan": 3,
  "tanggal_pesanan": "2025-06-20",
  "total_pesanan": 150000
}
```

---

## 🚚 Pengiriman API

### 🔹 GET `/pengiriman`

Ambil semua pengiriman.

### 🔹 GET `/pengiriman/<id>`

Ambil detail pengiriman berdasarkan ID pesanan.

### 🔹 POST `/pengiriman`

Tambah pengiriman baru.

#### Body

```json
{
  "id_pesanan": 101,
  "kurir": "JNE",
  "no_resi": "JNE123456",
  "status_pengiriman": "dikirim",
  "tanggal_kirim": "2025-06-21",
  "id_karyawan": 3
}
```

---

## ⭐ Rating Pembelanjaan API

### 🔹 GET `/rating`

Ambil seluruh rating pembelanjaan.

### 🔹 POST `/rating`

Tambah rating dari pelanggan.

#### Body

```json
{
  "id_pesanan": 101,
  "id_pelanggan": 3,
  "rating_belanja": 4,
  "komentar": "Barang bagus, pengiriman cepat"
}
```

---

## 🏢 Supplier API

### 🔹 GET `/supplier`

Ambil semua supplier. Bisa difilter `nama_supplier`.

### 🔹 POST `/supplier`

Tambah supplier baru.

#### Body

```json
{
  "nama_supplier": "PT Maju Jaya",
  "alamat": "Jl. Sudirman No. 10",
  "kontak": "081234567890"
}
```

---

