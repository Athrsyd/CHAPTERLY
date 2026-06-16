-- ============================================================
--  CHAPTERLY — Supabase Storage Setup
--  Jalankan di Supabase SQL Editor
--  SETELAH schema.sql selesai dijalankan
-- ============================================================

-- ── 1. Buat bucket book-covers ───────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'book-covers',
    'book-covers',
    true,                          -- Public bucket (URL bisa diakses tanpa auth)
    2097152,                       -- 2048 KB = 2 MB dalam bytes
    ARRAY['image/png', 'image/jpeg', 'image/jpg']
)
ON CONFLICT (id) DO UPDATE SET
    public             = true,
    file_size_limit    = 2097152,
    allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/jpg'];


-- ── 2. Policy: siapa saja bisa READ (lihat cover buku) ───────
CREATE POLICY "Public can read book covers"
ON storage.objects FOR SELECT
USING ( bucket_id = 'book-covers' );


-- ── 3. Policy: user terautentikasi bisa UPLOAD ───────────────
CREATE POLICY "Authenticated users can upload book covers"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'book-covers' );


-- ── 4. Policy: user terautentikasi bisa UPDATE file mereka ───
CREATE POLICY "Authenticated users can update book covers"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'book-covers' );


-- ── 5. Policy: user terautentikasi bisa DELETE file mereka ───
CREATE POLICY "Authenticated users can delete book covers"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'book-covers' );


-- ============================================================
--  VERIFIKASI
-- ============================================================
-- SELECT * FROM storage.buckets WHERE id = 'book-covers';
-- SELECT * FROM storage.policies WHERE bucket_id = 'book-covers';
