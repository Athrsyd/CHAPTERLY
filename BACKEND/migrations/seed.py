"""
CHAPTERLY — Seed Script dengan Upload Cover
============================================
Cara pakai:
1. Siapkan folder 'covers/' di direktori yang sama dengan script ini
2. Isi folder covers/ dengan file gambar:
       covers/laskar_pelangi.jpg
       covers/negeri_para_bedebah.jpg
       covers/perahu_kertas.jpg
       covers/bumi_manusia.jpg
       covers/cantik_itu_luka.jpg
3. Isi .env dengan SUPABASE_URL dan SUPABASE_KEY (service_role)
4. Jalankan: python seed_with_covers.py
"""

import os
import sys
import bcrypt
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client

# ── Load env ─────────────────────────────────────────────────
load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")

SUPABASE_URL    = os.getenv("SUPABASE_URL")
SUPABASE_KEY    = os.getenv("SUPABASE_KEY")
BUCKET          = os.getenv("SUPABASE_BUCKET", "book-covers")
COVERS_DIR      = Path(__file__).parent / "covers"
ALLOWED_EXT     = {".png", ".jpg", ".jpeg"}
MAX_SIZE_BYTES  = 2048 * 1024  # 2048 KB

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ SUPABASE_URL dan SUPABASE_KEY harus diisi di .env")
    sys.exit(1)

db = create_client(SUPABASE_URL, SUPABASE_KEY)

# ── Helper ────────────────────────────────────────────────────
def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt(12)).decode()

def upload_cover(local_path: Path, dest_name: str) -> str | None:
    """Upload file ke Supabase Storage, return public URL."""
    ext = local_path.suffix.lower()

    if ext not in ALLOWED_EXT:
        print(f"   ⚠️  Format tidak valid ({ext}), skip cover.")
        return None

    size = local_path.stat().st_size
    if size > MAX_SIZE_BYTES:
        print(f"   ⚠️  File terlalu besar ({size // 1024} KB > 2048 KB), skip cover.")
        return None

    mime_map = {".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg"}
    mime = mime_map[ext]
    storage_path = f"covers/{dest_name}{ext}"

    print(f"   📤 Uploading {local_path.name} → {storage_path} ...", end=" ")
    try:
        with open(local_path, "rb") as f:
            file_bytes = f.read()
        # Hapus dulu kalau sudah ada (re-seed)
        try:
            db.storage.from_(BUCKET).remove([storage_path])
        except Exception:
            pass
        db.storage.from_(BUCKET).upload(
            path=storage_path,
            file=file_bytes,
            file_options={"content-type": mime, "upsert": "true"},
        )
        public_url = db.storage.from_(BUCKET).get_public_url(storage_path)
        print(f"✅")
        return public_url
    except Exception as e:
        print(f"❌ {e}")
        return None

# ─────────────────────────────────────────────────────────────
# DATA SEED
# Sesuaikan nama file di kolom "cover_file" dengan file di folder covers/
# ─────────────────────────────────────────────────────────────
USERS = [
    # (name, email, password_plain, role)
    ("Pustakawan",           "owner@chapterly.com",  "owner123",  "owner"),
    ("Andrea Hirata", "andrea@chapterly.com", "author123", "author"),
    ("Tere Liye", "tere@chapterly.com", "author123", "author"),
    ("Dee Lestari", "dee@chapterly.com", "author123", "author"),
    ("Eka Kurniawan", "eka@chapterly.com", "author123", "author"),
    ("Pramoedya Ananta Toer", "pram@chapterly.com", "author123", "author"),
    ("Jostein Gaarder", "jostein@chapterly.com", "author123", "author"),
    ("Ratih Kumala", "ratih@chapterly.com", "author123", "author"),
    ("Leila S. Chudori", "leila@chapterly.com", "author123", "author"),
    ("Sri Puji Hartani", "sri@chapterly.com", "author123", "author"),
    ("Ahmad Fuadi", "fuadi@chapterly.com", "author123", "author"),
    ("Habiburrahman El Shirazy", "habib@chapterly.com", "author123", "author"),
    ("Boy Candra", "boy@chapterly.com", "author123", "author"),
    ("Asma Nadia", "asma@chapterly.com", "author123", "author"),
    ("Fiersa Besari", "fiersa@chapterly.com", "author123", "author"),
    ("Okky Madasari", "okky@chapterly.com", "author123", "author"),
    ("Titi Sanaria", "titi@chapterly.com", "author123", "author"),
    ("Seno Gumira Ajidarma", "seno@chapterly.com", "author123", "author"),
    ("Mira W", "mira@chapterly.com", "author123", "author"),
    ("Ilana Tan", "ilana@chapterly.com", "author123", "author"),
    ("Dewi Rieka", "dewi@chapterly.com", "author123", "author"),
    ("Agatha Christie", "agatha@chapterly.com", "author123", "author"),
    ("Arthur Conan Doyle", "arthur@chapterly.com", "author123", "author"),
    ("J.K. Rowling", "jk@chapterly.com", "author123", "author"),
    ("J.R.R. Tolkien", "tolkien@chapterly.com", "author123", "author"),
    ("Dan Brown", "dan@chapterly.com", "author123", "author"),
    ("Budi Santoso",          "budi@chapterly.com",   "reader123", "reader"),
    ("Siti Rahayu",           "siti@chapterly.com",   "reader123", "reader"),
]

BOOKS = [

    ("Laskar Pelangi", "andrea@chapterly.com", "Fiction", 18000, 5, 100,
     "Perjuangan anak-anak Belitung mengejar pendidikan dan mimpi.", 'laskar_pelangi'),
    ("Sang Pemimpi", "andrea@chapterly.com", "Adventure", 19000, 5, 90,
     "Petualangan remaja mengejar cita-cita hingga ke luar negeri.", 'SangPemimpi'),

    ("Hujan", "tere@chapterly.com", "Fiction", 18000, 5, 120,
     "Kisah kehilangan, harapan, dan masa depan umat manusia.", 'hujan'),
    ("Pulang", "tere@chapterly.com", "Adventure", 20000, 5, 110,
     "Perjalanan panjang seorang pria mencari jati dirinya.", 'pulang'),

    ("Perahu Kertas", "dee@chapterly.com", "Romance", 17000, 5, 85,
     "Pertemuan dua jiwa yang saling melengkapi.", 'perahu_kertas'),
    ("Supernova", "dee@chapterly.com", "Fantasy", 22000, 5, 70,
     "Perpaduan filsafat, sains, dan misteri kehidupan.", 'Supernova'),

    ("Cantik Itu Luka", "eka@chapterly.com", "Historical", 21000, 5, 75,
     "Kisah keluarga lintas generasi di masa penjajahan.", 'cantik_itu_luka'),
    ("Lelaki Harimau", "eka@chapterly.com", "Mystery", 20000, 4, 80,
     "Rahasia kelam yang tersembunyi dalam diri seorang lelaki.", 'LelakiHarimau'),

    ("Bumi Manusia", "pram@chapterly.com", "Historical", 21000, 5, 95,
     "Perjuangan seorang pribumi melawan ketidakadilan kolonial.", "bumi_manusia"),
    ("Anak Semua Bangsa", "pram@chapterly.com", "Historical", 21000, 5, 90,
     "Lanjutan perjuangan Minke dalam menemukan identitas bangsanya.", "AnakSemuaBangsa"),

    ("Dunia Sophie", "jostein@chapterly.com", "Fantasy", 18000, 5, 85,
     "Perjalanan memahami sejarah filsafat melalui surat misterius.", "dunia_sophie"),

    ("Gadis Kretek", "ratih@chapterly.com", "Historical", 19000, 5, 80,
     "Sejarah cinta dan industri kretek Indonesia.", 'gadis_kretek'),
    ("Tabula Rasa", "ratih@chapterly.com", "Fiction", 17000, 4, 90,
     "Pencarian identitas di tengah perubahan zaman.", 'TabulaRasa'),

    ("Laut Bercerita", "leila@chapterly.com", "Historical", 20000, 5, 90,
     "Kisah aktivis yang hilang pada masa reformasi.", "laut_bercerita"),
    ("Namaku Alam", "leila@chapterly.com", "Fiction", 18000, 4, 85,
     "Perjalanan seorang anak menemukan makna kehidupan.", "namaku_alam"),

    ("Aku Tak Membenci Hujan", "sri@chapterly.com", "Romance", 15000, 4, 100,
     "Tentang pertemuan, kehilangan, dan kenangan.", "aku_tak_membenci_hujan"),


    ("Negeri 5 Menara", "fuadi@chapterly.com", "Adventure", 19000, 5, 95,
     "Perjalanan santri mengejar impian besar.", "Negeri5Menara"),
    ("Ranah 3 Warna", "fuadi@chapterly.com", "Adventure", 20000, 5, 85,
     "Kisah perjuangan menghadapi tantangan hidup.", "Ranah3Warna"),

    ("Ayat-Ayat Cinta", "habib@chapterly.com", "Romance", 18000, 5, 100,
     "Drama cinta dan nilai-nilai kehidupan.", "AyatAyatCinta"),
    ("Ketika Cinta Bertasbih", "habib@chapterly.com", "Romance", 18000, 5, 95,
     "Perjuangan cinta yang dibingkai keimanan.", "KetikaCintaBertasbih"),

    ("Senja Hujan Cerita", "boy@chapterly.com", "Romance", 16000, 4, 120,
     "Kumpulan kisah cinta dan kehilangan.", "SenjaHujanCerita"),

    ("Konspirasi Alam Semesta", "fiersa@chapterly.com", "Adventure", 19000, 5, 100,
     "Petualangan menemukan makna hidup.", "KonspirasiAlamSemesta"),

    ("Pasung Jiwa", "okky@chapterly.com", "Fiction", 19000, 4, 80,
     "Kisah pencarian kebebasan dan identitas.", "PasungJiwa"),

    ("Summer in Seoul", "ilana@chapterly.com", "Romance", 18000, 5, 120,
     "Romansa hangat di kota Seoul.", "SummerInSeoul"),
    ("Autumn in Paris", "ilana@chapterly.com", "Romance", 18000, 5, 110,
     "Cinta yang bersemi di kota Paris.", "AutumninParis"),

    ("Rembulan Tenggelam", "dewi@chapterly.com", "Mystery", 17000, 4, 75,
     "Kasus misterius yang mengguncang kota kecil.", "RembulanTenggelam"),


    ("Murder on the Orient Express", "agatha@chapterly.com", "Mystery", 22000, 5, 85,
     "Pembunuhan misterius di kereta mewah.", "MOTOE"),
    ("And Then There Were None", "agatha@chapterly.com", "Mystery", 22000, 5, 90,
     "Sepuluh orang terjebak di pulau terpencil.", "ATTWN"),

    ("A Study in Scarlet", "arthur@chapterly.com", "Mystery", 20000, 5, 95,
     "Kasus pertama Sherlock Holmes.", "ASIS"),
    ("The Hound of the Baskervilles", "arthur@chapterly.com", "Mystery", 21000, 5, 90,
     "Misteri kutukan keluarga Baskerville.", "TheHound"),

    ("Harry Potter and the Sorcerer's Stone", "jk@chapterly.com", "Fantasy", 25000, 5, 150,
     "Awal petualangan Harry di dunia sihir.", "HP1"),
    ("Harry Potter and the Chamber of Secrets", "jk@chapterly.com", "Fantasy", 25000, 5, 145,
     "Rahasia kamar tersembunyi di Hogwarts.", "HP2"),


    ("The Fellowship of the Ring", "tolkien@chapterly.com", "Fantasy", 26000, 5, 125,
     "Awal perjalanan menghancurkan cincin kekuasaan.", "Ring"),

    ("The Da Vinci Code", "dan@chapterly.com", "Thriller", 23000, 5, 140,
     "Misteri simbol dan rahasia sejarah dunia.", "DaVinciCode"),
    ("Angels & Demons", "dan@chapterly.com", "Thriller", 23000, 5, 135,
     "Perburuan organisasi rahasia yang mengancam dunia.", "AngelnDemon"),
]
# ─────────────────────────────────────────────────────────────
def find_cover_file(stem: str) -> Path | None:
    """Cari file cover dengan nama stem + ekstensi apapun yang valid."""
    for ext in ALLOWED_EXT:
        candidate = COVERS_DIR / f"{stem}{ext}"
        # print(candidate)
        if candidate.exists():
            return candidate
    return None

def run():
    print("\n🌱 CHAPTERLY SEED SCRIPT")
    print("=" * 45)

    # ── Cek folder covers ─────────────────────────────────────
    if not COVERS_DIR.exists():
        COVERS_DIR.mkdir()
        print(f"\n📁 Folder 'covers/' dibuat di: {COVERS_DIR}")
        print("   Masukkan file gambar cover ke folder tersebut lalu jalankan ulang.")
        print("\n   File yang dibutuhkan:")
        for _, _, _, _, _, _, _, stem in BOOKS:
            print(f"   - covers/{stem}.jpg  (atau .png / .jpeg)")
        sys.exit(0)

    # ── TRUNCATE ─────────────────────────────────────────────
    print("\n🗑️  Menghapus data lama...")
    for table in ["history_rent", "author_applying", "rent_books", "books", "users"]:
        try:
            # Hapus semua row (Supabase tidak support TRUNCATE via client)
            db.table(table).delete().neq("id", 0).execute()
            print(f"   ✅ {table} cleared")
        except Exception as e:
            print(f"   ⚠️  {table}: {e}")

    # ── INSERT USERS ─────────────────────────────────────────
    print("\n👤 Membuat users...")
    user_id_map = {}  # email → id
    for name, email, password, role in USERS:
        hashed = hash_password(password)
        try:
            res = db.table("users").insert({
                "name": name, "email": email,
                "password": hashed, "role": role
            }).execute()
            uid = res.data[0]["id"]
            user_id_map[email] = uid
            print(f"   ✅ [{role:6}] {name} ({email})")
        except Exception as e:
            print(f"   ❌ {name}: {e}")

    # ── INSERT BOOKS + UPLOAD COVER ──────────────────────────
    print("\n📚 Membuat buku + upload cover...")
    book_ids = []
    for title, author_email, genre, price, rate, stock, desc, cover_stem in BOOKS:
        author_id = user_id_map.get(author_email)
        if not author_id:
            print(f"   ❌ Author tidak ditemukan untuk: {title}")
            continue

        # Upload cover
        cover_url = None
        cover_file = find_cover_file(cover_stem)
        if cover_file:
            cover_url = upload_cover(cover_file, cover_stem)
        else:
            print(f"   ⚠️  Cover tidak ditemukan: covers/{cover_stem}.(jpg|png|jpeg) — lanjut tanpa cover")

        try:
            res = db.table("books").insert({
                "name": title, "cover": cover_url,
                "author_id": author_id, "genre": genre,
                "price": price, "rate": rate,
                "stock": stock, "description": desc,
            }).execute()
            book_ids.append(res.data[0]["id"])
            print(f"   ✅ {title}")
        except Exception as e:
            print(f"   ❌ {title}: {e}")

    # ── INSERT RENT_BOOKS ─────────────────────────────────────
    # print("\n🔖 Membuat data sewa aktif...")
    # rent_ids = []
    # budi_id  = user_id_map.get("budi@chapterly.com")
    # siti_id  = user_id_map.get("siti@chapterly.com")

    # if budi_id and len(book_ids) >= 1:
    #     try:
    #         res = db.table("rent_books").insert({
    #             "user_id": budi_id, "book_id": book_ids[0], "rent_time": "2026-06-01"
    #         }).execute()
    #         rent_ids.append(res.data[0]["id"])
    #         print(f"   ✅ Budi menyewa buku #{book_ids[0]}")
    #     except Exception as e:
    #         print(f"   ❌ Rent Budi: {e}")

    # if siti_id and len(book_ids) >= 3:
    #     try:
    #         res = db.table("rent_books").insert({
    #             "user_id": siti_id, "book_id": book_ids[2], "rent_time": "2026-06-03"
    #         }).execute()
    #         rent_ids.append(res.data[0]["id"])
    #         print(f"   ✅ Siti menyewa buku #{book_ids[2]}")
    #     except Exception as e:
    #         print(f"   ❌ Rent Siti: {e}")

    # # ── INSERT HISTORY_RENT ───────────────────────────────────
    # print("\n📖 Membuat riwayat sewa...")
    # history_rent_ids = []
    # if budi_id and len(book_ids) >= 2:
    #     try:
    #         r = db.table("rent_books").insert({
    #             "user_id": budi_id, "book_id": book_ids[1], "rent_time": "2026-05-15"
    #         }).execute()
    #         tmp_id = r.data[0]["id"]
    #         h = db.table("history_rent").insert({
    #             "rent_id": tmp_id, "finished_date": "2026-05-22"
    #         }).execute()
    #         print(f"   ✅ Riwayat Budi — selesai 22 Mei 2026")
    #     except Exception as e:
    #         print(f"   ❌ History Budi: {e}")

    # if siti_id and len(book_ids) >= 4:
    #     try:
    #         r = db.table("rent_books").insert({
    #             "user_id": siti_id, "book_id": book_ids[3], "rent_time": "2026-05-20"
    #         }).execute()
    #         tmp_id = r.data[0]["id"]
    #         h = db.table("history_rent").insert({
    #             "rent_id": tmp_id, "finished_date": "2026-05-27"
    #         }).execute()
    #         print(f"   ✅ Riwayat Siti — selesai 27 Mei 2026")
    #     except Exception as e:
    #         print(f"   ❌ History Siti: {e}")

    # # ── INSERT AUTHOR_APPLYING ────────────────────────────────
    # print("\n📝 Membuat lamaran author...")
    # if budi_id:
    #     try:
    #         db.table("author_applying").insert({
    #             "user_id": budi_id,
    #             "reason": "Saya adalah seorang penulis hobi yang sudah 3 tahun menulis cerita pendek. Saya ingin mempublikasikan karya saya kepada lebih banyak pembaca melalui platform Chapterly.",
    #             "status": "pending",
    #         }).execute()
    #         print(f"   ✅ Lamaran Budi (pending)")
    #     except Exception as e:
    #         print(f"   ❌ Lamaran: {e}")

    # ── SUMMARY ───────────────────────────────────────────────
    print("\n" + "=" * 45)
    print("✅ SEED SELESAI!\n")
    print("📋 Akun yang dibuat:")
    print("   SUPER ADMIN")
    print("   owner@chapterly.com     → owner123")
    print("\n   PENULIS (password: author123)")
    for _, email, _, role in USERS:
        if role == "author":
            print(f"   {email}")
    print("\n   READER (password: reader123)")
    for _, email, _, role in USERS:
        if role == "reader":
            print(f"   {email}")
    print()

if __name__ == "__main__":
    run()
