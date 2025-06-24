# 📦 Toko Komputer - Dokumentasi API dan Frontend

## 📁 Struktur Proyek

```
Integrasi_data/
├── app.py
├── database.py
├── routes/
│   ├── dashboard_stats.py
│   ├── karyawan.py
│   └── ... (modul lainnya)
├── templates/
│   └── index.html
├── static/
│   └── js/
│       └── script.js
└── ...
```

---

## ⚙️ Konfigurasi Database (MySQL)

File: `database.py`

```python
from flask_mysqldb import MySQL

mysql = MySQL()

def init_mysql(app):
    app.config['MYSQL_HOST'] = 'localhost'
    app.config['MYSQL_USER'] = 'root'
    app.config['MYSQL_PASSWORD'] = ''
    app.config['MYSQL_DB'] = 'toko_komputer'
    mysql.init_app(app)
```

---

## 🚀 Menjalankan Aplikasi

File utama: `app.py`

```python
from flask import Flask, render_template
from flask_cors import CORS
from database import init_mysql, mysql

from routes.dashboard_stats import dashboard_bp
from routes.karyawan import karyawan_bp
... (route lain)

app = Flask(__name__)
CORS(app)

init_mysql(app)
app.mysql = mysql

app.register_blueprint(dashboard_bp)
app.register_blueprint(karyawan_bp)
... (blueprint lain)

@app.route('/dashboard')
def dashboard():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
```

---

## 📊 Endpoint: Statistik Dashboard

**URL:** `/dashboard/stats`
**Method:** `GET`
**Deskripsi:** Mengembalikan statistik global untuk dashboard.

**Contoh Respons:**

```json
{
  "total_products": 12,
  "total_customers": 8,
  "total_orders": 20,
  "avg_rating": 4.3,
  "total_suppliers": 3,
  "total_employees": 7
}
```

**Frontend:**

* Fungsi `loadStatistics()` memanggil API dan menampilkan info dalam kartu dan grafik (bar & doughnut).
* Menggunakan Chart.js dan custom toast notification untuk error/sukses.

---

## 👤 Endpoint: Karyawan

### 🔹 GET `/karyawan`

Mengambil semua data karyawan.

**Contoh Respons:**

```json
[
  {
    "id_karyawan": 1,
    "nama_karyawan": "Radit",
    "jabatan": "Kasir",
    "nomor_telepon": "08123456789"
  },
  ...
]
```

### 🔹 POST `/karyawan`

Menambahkan karyawan baru, dengan validasi duplikat berdasarkan `nama_karyawan` dan `nomor_telepon`.

**Request Body (JSON):**

```json
{
  "nama_karyawan": "Radit",
  "jabatan": "Admin",
  "nomor_telepon": "08123456789"
}
```

**Kemungkinan Respons:**

* Sukses:

```json
{ "status": "success", "message": "Karyawan berhasil ditambahkan" }
```

* Duplikat:

```json
{ "status": "error", "message": "Karyawan dengan nama dan nomor ini sudah ada" }
```

---

## 💻 Frontend: Karyawan

### ➕ Menambah Karyawan

Form dengan ID `form-karyawan` akan:

* Memastikan semua field terisi.
* Mengecek duplikat terhadap data dari endpoint GET `/karyawan`.
* Jika valid, kirim POST request ke endpoint.
* Menampilkan notifikasi dengan `showToast()`.
* Mereset form dan reload daftar serta statistik.

### 📋 Menampilkan Daftar Karyawan

Fungsi `loadKaryawan()` akan:

* Fetch data dari `/karyawan`
* Tampilkan dalam bentuk kartu (`card`)
* Jika kosong, tampilkan pesan "Belum ada karyawan."

---

## 📌 Catatan Tambahan

* Semua data diakses melalui API (tidak langsung dari template/server).
* Validasi frontend & backend dilakukan untuk ketahanan aplikasi.
* Pastikan database `toko_komputer` dan tabel-tabel terkait telah dibuat di MySQL.

---

Selanjutnya kamu bisa tambahkan dokumentasi untuk modul `produk`, `pelanggan`, `pesanan`, dll. Cukup kirim potongan kodenya. 💡
