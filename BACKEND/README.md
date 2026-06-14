# 📚 Chapterly — Backend API

Flask + Supabase backend untuk aplikasi penyewaan buku **Chapterly**.

---

## 🗂️ Struktur Folder

```
chapterly/
├── run.py                        # Entry point
├── requirements.txt
├── .env.example                  # Salin ke .env dan isi nilai
├── migrations/
│   └── schema.sql                # Jalankan di Supabase SQL Editor
└── app/
    ├── __init__.py               # App factory (create_app)
    ├── controllers/
    │   ├── auth_controller.py    # Register & Login
    │   ├── book_controller.py    # CRUD Buku
    │   ├── rent_controller.py    # Sewa & Riwayat
    │   ├── apply_controller.py   # Daftar jadi author
    │   └── admin_controller.py   # Owner kelola author
    ├── middlewares/
    │   └── auth_middleware.py    # JWT role guards
    └── utils/
        ├── supabase_client.py    # Supabase singleton
        └── response.py           # Helper success/error
```

---

## ⚡ Setup

### 1. Clone & Install

```bash
git clone <repo>
cd chapterly
pip install -r requirements.txt
```

### 2. Environment Variables

```bash
cp .env.example .env
# Edit .env dan isi SUPABASE_URL, SUPABASE_KEY, JWT_SECRET_KEY
```

### 3. Buat Database di Supabase

- Buka **Supabase Dashboard → SQL Editor**
- Paste isi `migrations/schema.sql` → **Run**

### 4. Jalankan Server

```bash
python run.py
# Server berjalan di http://localhost:5000
```

---

## 🔐 Role & Akses

| Role     | Alias       | Akses                                          |
|----------|-------------|------------------------------------------------|
| `reader` | User biasa  | Sewa buku, lihat riwayat, daftar jadi author   |
| `author` | Admin       | + CRUD buku milik sendiri                      |
| `owner`  | Super Admin | + Kelola author, approve/reject aplikasi       |

Semua endpoint (kecuali register/login & list buku) membutuhkan header:
```
Authorization: Bearer <token>
```

---

## 📡 API Endpoints

### AUTH

| Method | Endpoint             | Akses  | Keterangan       |
|--------|----------------------|--------|------------------|
| POST   | `/api/auth/register` | Public | Daftar akun baru |
| POST   | `/api/auth/login`    | Public | Login, dapat JWT |

**Register body:**
```json
{ "name": "Budi", "email": "budi@mail.com", "password": "rahasia123" }
```

**Login body:**
```json
{ "email": "budi@mail.com", "password": "rahasia123" }
```

---

### BOOKS

| Method | Endpoint           | Akses          | Keterangan                        |
|--------|--------------------|----------------|-----------------------------------|
| GET    | `/api/books`       | Public         | Daftar semua buku (`?genre=xxx`)  |
| GET    | `/api/books/<id>`  | Public         | Detail satu buku                  |
| POST   | `/api/books`       | Author / Owner | Tambah buku baru                  |
| PUT    | `/api/books/<id>`  | Author / Owner | Update buku (author: milik sendiri)|
| DELETE | `/api/books/<id>`  | Author / Owner | Hapus buku                        |

**POST/PUT body:**
```json
{
  "name": "Laskar Pelangi",
  "cover": "https://...",
  "genre": "Novel",
  "price": 15000,
  "rate": 5,
  "description": "Novel karya Andrea Hirata"
}
```

---

### RENT (Sewa Buku)

| Method | Endpoint               | Akses        | Keterangan                   |
|--------|------------------------|--------------|------------------------------|
| GET    | `/api/rent`            | All roles    | Lihat sewa aktif saya        |
| POST   | `/api/rent`            | All roles    | Sewa buku baru               |
| DELETE | `/api/rent/<rent_id>`  | All roles    | Kembalikan buku → ke history |
| GET    | `/api/rent/history`    | All roles    | Riwayat buku yang pernah disewa |

**POST body:**
```json
{ "book_id": 3 }
```

---

### AUTHOR APPLYING (Daftar Jadi Penulis)

| Method | Endpoint             | Akses     | Keterangan                         |
|--------|----------------------|-----------|------------------------------------|
| POST   | `/api/apply`         | Reader    | Ajukan permohonan jadi author      |
| GET    | `/api/apply`         | Owner     | Lihat semua aplikasi (`?status=pending`) |
| PATCH  | `/api/apply/<id>`    | Owner     | Approve / reject aplikasi          |

**POST body:**
```json
{ "reason": "Saya ingin mempublikasikan karya saya..." }
```

**PATCH body:**
```json
{ "status": "approved" }   // atau "rejected"
```

---

### ADMIN (Owner only)

| Method | Endpoint                    | Akses | Keterangan                        |
|--------|-----------------------------|-------|-----------------------------------|
| GET    | `/api/admin/authors`        | Owner | Daftar semua author               |
| DELETE | `/api/admin/authors/<id>`   | Owner | Hapus/downgrade author ke reader  |

---

## 📝 Catatan Teknis

- **Kembalikan buku** (`DELETE /api/rent/<id>`) otomatis memindahkan data ke tabel `history_rent`.
- **Approve author** (`PATCH /api/apply/<id>`) otomatis mengubah `role` user menjadi `author`.
- **Hapus author** (`DELETE /api/admin/authors/<id>`) mendowngrade role ke `reader` (buku tetap ada).
- Password di-hash dengan **bcrypt** sebelum disimpan.
- JWT berisi `identity` (user ID) dan `role` untuk keperluan middleware.
