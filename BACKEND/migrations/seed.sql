-- ============================================================
--  CHAPTERLY — Seed Data
--  Jalankan SETELAH schema.sql di Supabase SQL Editor
--  Password semua akun ada di bagian bawah file ini
-- ============================================================

-- Bersihkan data lama (urutan penting karena ada FK)
TRUNCATE TABLE history_rent, author_applying, rent_books, books, users RESTART IDENTITY CASCADE;


-- ══════════════════════════════════════════════════════════════
--  1. USERS
--  owner123   → Super Admin
--  author123  → 5 Penulis
--  reader123  → 2 Reader
-- ══════════════════════════════════════════════════════════════
INSERT INTO users (name, email, password, role) VALUES

-- Super Admin (id = 1)
(
    'Super Admin',
    'owner@chapterly.com',
    '$2b$12$RnlWC7jTA0nvAPgPOyXhtOA8qOw.DKKjvcqeh2RNZT/NIIKJ0jvKq',
    'owner'
),

-- Penulis / Author (id = 2 – 6)
(
    'Andrea Hirata',
    'andrea@chapterly.com',
    '$2b$12$y5t3rkPNG50A7lqy9ylzzueoJiX.afWGLBh3pELnKHcmq0WxzQN5K',
    'author'
),
(
    'Tere Liye',
    'tere@chapterly.com',
    '$2b$12$y5t3rkPNG50A7lqy9ylzzueoJiX.afWGLBh3pELnKHcmq0WxzQN5K',
    'author'
),
(
    'Dee Lestari',
    'dee@chapterly.com',
    '$2b$12$y5t3rkPNG50A7lqy9ylzzueoJiX.afWGLBh3pELnKHcmq0WxzQN5K',
    'author'
),
(
    'Pramoedya Ananta Toer',
    'pram@chapterly.com',
    '$2b$12$y5t3rkPNG50A7lqy9ylzzueoJiX.afWGLBh3pELnKHcmq0WxzQN5K',
    'author'
),
(
    'Eka Kurniawan',
    'eka@chapterly.com',
    '$2b$12$y5t3rkPNG50A7lqy9ylzzueoJiX.afWGLBh3pELnKHcmq0WxzQN5K',
    'author'
),

-- Reader (id = 7 – 8)
(
    'Budi Santoso',
    'budi@chapterly.com',
    '$2b$12$KCM/n8P87recmZwTuMvphue5SOD/UArplrp6F25HmZgXpGHdPlFji',
    'reader'
),
(
    'Siti Rahayu',
    'siti@chapterly.com',
    '$2b$12$KCM/n8P87recmZwTuMvphue5SOD/UArplrp6F25HmZgXpGHdPlFji',
    'reader'
);


-- ══════════════════════════════════════════════════════════════
--  2. BOOKS  (masing-masing 1 buku per penulis)
-- ══════════════════════════════════════════════════════════════
INSERT INTO books (name, cover, author_id, genre, price, rate, stock, description) VALUES

-- Andrea Hirata (id=2)
(
    'Laskar Pelangi',
    'https://upload.wikimedia.org/wikipedia/commons/f/f2/Laskar_Pelangi_-_bookcover.jpg',
    2,
    'Fiction',
    15000,
    5,
    120,
    'Kisah persahabatan sepuluh anak kampung di Belitung yang berjuang meraih mimpi meski keterbatasan sarana pendidikan menghadang langkah mereka.'
),

-- Tere Liye (id=3)
(
    'Negeri Para Bedebah',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Negeri_Para_Bedebah.jpg/220px-Negeri_Para_Bedebah.jpg',
    3,
    'Thriller',
    19000,
    5,
    90,
    'Thomas, seorang konsultan keuangan muda yang cerdas, harus menyelamatkan bank milik pamannya dari ambang kebangkrutan di tengah ancaman para pejabat korup.'
),

-- Dee Lestari (id=4)
(
    'Perahu Kertas',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Perahu_Kertas_%28novel%29.jpg/220px-Perahu_Kertas_%28novel%29.jpg',
    4,
    'Romance',
    17000,
    4,
    75,
    'Kugy dan Keenan, dua jiwa yang berbeda namun saling melengkapi, bertemu di Bandung dan menjalin kisah cinta yang penuh warna dan perjuangan.'
),

-- Pramoedya (id=5)
(
    'Bumi Manusia',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Bumi_manusia_book_cover.jpg/220px-Bumi_manusia_book_cover.jpg',
    5,
    'Historical',
    21000,
    5,
    60,
    'Minke, seorang pribumi terpelajar di era kolonial Belanda, berjuang melawan ketidakadilan dan menemukan cinta sejatinya bersama Annelies.'
),

-- Eka Kurniawan (id=6)
(
    'Cantik Itu Luka',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Cantik_Itu_Luka.jpg/220px-Cantik_Itu_Luka.jpg',
    6,
    'Fiction',
    18000,
    4,
    85,
    'Dewi Ayu, seorang perempuan cantik yang terpaksa menjadi pelacur di zaman penjajahan, bangkit dari kubur untuk menyaksikan nasib keturunannya.'
);


-- ══════════════════════════════════════════════════════════════
--  3. RENT_BOOKS  (masing-masing 1 sewa aktif per reader)
-- ══════════════════════════════════════════════════════════════
INSERT INTO rent_books (user_id, book_id, rent_time) VALUES
(7, 1, CURRENT_DATE),       -- Budi menyewa Laskar Pelangi
(8, 3, CURRENT_DATE - 3);   -- Siti menyewa Perahu Kertas


-- ══════════════════════════════════════════════════════════════
--  4. HISTORY_RENT  (1 riwayat per reader — buku berbeda)
-- ══════════════════════════════════════════════════════════════
-- Buat dulu rent sementara yang akan langsung dimasukkan ke history
WITH tmp AS (
    INSERT INTO rent_books (user_id, book_id, rent_time)
    VALUES
        (7, 2, CURRENT_DATE - 14),   -- Budi pernah sewa Negeri Para Bedebah
        (8, 4, CURRENT_DATE - 10)    -- Siti pernah sewa Bumi Manusia
    RETURNING id
)
INSERT INTO history_rent (rent_id, finished_date)
SELECT id, CURRENT_DATE - 7 FROM tmp;


-- ══════════════════════════════════════════════════════════════
--  5. AUTHOR_APPLYING  (1 lamaran dari Budi si Reader)
-- ══════════════════════════════════════════════════════════════
INSERT INTO author_applying (user_id, reason, status, applied_at) VALUES
(
    7,
    'Saya adalah seorang penulis hobi yang sudah 3 tahun menulis cerita pendek. Saya ingin mempublikasikan karya saya kepada lebih banyak pembaca melalui platform Chapterly.',
    'pending',
    NOW()
);


-- ══════════════════════════════════════════════════════════════
--  VERIFIKASI — jalankan query ini untuk cek data
-- ══════════════════════════════════════════════════════════════
-- SELECT * FROM users;
-- SELECT * FROM books;
-- SELECT * FROM rent_books;
-- SELECT * FROM history_rent;
-- SELECT * FROM author_applying;


-- ============================================================
--  RINGKASAN AKUN
-- ============================================================
--
--  SUPER ADMIN
--  Email    : owner@chapterly.com
--  Password : owner123
--
--  PENULIS (Author) — password semua: author123
--  andrea@chapterly.com  → Andrea Hirata
--  tere@chapterly.com    → Tere Liye
--  dee@chapterly.com     → Dee Lestari
--  pram@chapterly.com    → Pramoedya Ananta Toer
--  eka@chapterly.com     → Eka Kurniawan
--
--  READER — password semua: reader123
--  budi@chapterly.com    → Budi Santoso
--  siti@chapterly.com    → Siti Rahayu
--
-- ============================================================
