import os
import uuid
from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, get_jwt
from PIL import Image
import io

from app.middlewares.auth_middleware import author_required
from app.utils.supabase_client import get_supabase
from app.utils.response import success, error

book_bp = Blueprint("books", __name__, url_prefix="/api/books")

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}
MAX_FILE_SIZE = 2048 * 1024  # 2048 KB = 2 MB
SUPABASE_BUCKET = "book-covers"


def _current_user_id() -> int:
    return int(get_jwt_identity())


def _allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def _upload_cover(file) -> tuple[str | None, str | None]:
    """
    Validasi dan upload file cover ke Supabase Storage.
    Return: (public_url, error_message)
    """
    filename = file.filename or ""
    if not _allowed_file(filename):
        return None, "Format file tidak valid. Hanya .png, .jpg, .jpeg yang diizinkan."

    file_bytes = file.read()

    if len(file_bytes) > MAX_FILE_SIZE:
        return None, f"Ukuran file terlalu besar. Maksimal 2048 KB ({MAX_FILE_SIZE // 1024} KB)."

    # Validasi bahwa file benar-benar gambar
    try:
        img = Image.open(io.BytesIO(file_bytes))
        img.verify()
    except Exception:
        return None, "File bukan gambar yang valid."

    ext = filename.rsplit(".", 1)[1].lower()
    unique_name = f"covers/{uuid.uuid4().hex}.{ext}"

    db = get_supabase()
    try:
        db.storage.from_(SUPABASE_BUCKET).upload(
            path=unique_name,
            file=file_bytes,
            file_options={"content-type": file.content_type or f"image/{ext}"},
        )
        public_url = db.storage.from_(SUPABASE_BUCKET).get_public_url(unique_name)
        return public_url, None
    except Exception as e:
        return None, f"Gagal mengupload cover: {str(e)}"


def _delete_cover(cover_url: str):
    """Hapus file lama dari Supabase Storage jika ada."""
    if not cover_url or SUPABASE_BUCKET not in cover_url:
        return
    try:
        # Ambil path relatif dari URL publik
        path = cover_url.split(f"{SUPABASE_BUCKET}/")[1]
        get_supabase().storage.from_(SUPABASE_BUCKET).remove([path])
    except Exception:
        pass  # Tidak perlu gagal hanya karena hapus file lama


# ── GET /api/books ───────────────────────────────────────────
@book_bp.get("/")
def list_books():
    db = get_supabase()
    genre = request.args.get("genre")
    query = db.table("books").select("*, users(id, name)")
    if genre:
        query = query.ilike("genre", f"%{genre}%")
    result = query.execute()
    return success(result.data)


# ── GET /api/books/<id> ──────────────────────────────────────
@book_bp.get("/<int:book_id>")
def get_book(book_id: int):
    db = get_supabase()
    result = (
        db.table("books")
        .select("*, users(id, name)")
        .eq("id", book_id)
        .execute()
    )
    if not result.data:
        return error("Book not found", 404)
    return success(result.data[0])


# ── POST /api/books ── multipart/form-data ───────────────────
@book_bp.post("/")
@author_required
def create_book():
    name  = request.form.get("name", "").strip()
    price = request.form.get("price")
    cover_url = None

    if not name or price is None:
        return error("name dan price wajib diisi")

    # Handle upload cover
    if "cover" in request.files and request.files["cover"].filename:
        cover_url, err = _upload_cover(request.files["cover"])
        if err:
            return error(err, 422)

    db  = get_supabase()
    uid = _current_user_id()

    payload = {
        "name":        name,
        "cover":       cover_url,
        "author_id":   uid,
        "genre":       request.form.get("genre"),
        "price":       float(price),
        "rate":        int(request.form.get("rate", 0)),
        "stock":       int(request.form.get("stock", 100)),
        "description": request.form.get("description"),
    }

    result = db.table("books").insert(payload).execute()
    return success(result.data[0], "Book created", 201)


# ── PUT /api/books/<id> ── multipart/form-data ───────────────
@book_bp.put("/<int:book_id>")
@author_required
def update_book(book_id: int):
    db   = get_supabase()
    uid  = _current_user_id()
    role = get_jwt().get("role")

    book_res = db.table("books").select("*").eq("id", book_id).execute()
    if not book_res.data:
        return error("Book not found", 404)

    book = book_res.data[0]
    if role == "author" and book["author_id"] != uid:
        return error("Forbidden: kamu hanya bisa edit buku milikmu sendiri", 403)

    updates = {}
    allowed_text = ["name", "genre", "price", "rate", "stock", "description"]
    for field in allowed_text:
        val = request.form.get(field)
        if val is not None:
            if field in ("price",):
                updates[field] = float(val)
            elif field in ("rate", "stock"):
                updates[field] = int(val)
            else:
                updates[field] = val

    # Handle cover baru
    if "cover" in request.files and request.files["cover"].filename:
        cover_url, err = _upload_cover(request.files["cover"])
        if err:
            return error(err, 422)
        # Hapus cover lama
        _delete_cover(book.get("cover", ""))
        updates["cover"] = cover_url

    if not updates:
        return error("Tidak ada field yang diupdate")

    result = db.table("books").update(updates).eq("id", book_id).execute()
    return success(result.data[0], "Book updated")


# ── DELETE /api/books/<id> ───────────────────────────────────
@book_bp.delete("/<int:book_id>")
@author_required
def delete_book(book_id: int):
    db   = get_supabase()
    uid  = _current_user_id()
    role = get_jwt().get("role")

    book_res = db.table("books").select("*").eq("id", book_id).execute()
    if not book_res.data:
        return error("Book not found", 404)

    book = book_res.data[0]
    if role == "author" and book["author_id"] != uid:
        return error("Forbidden: kamu hanya bisa hapus buku milikmu sendiri", 403)

    # Hapus file cover dari storage
    _delete_cover(book.get("cover", ""))

    db.table("books").delete().eq("id", book_id).execute()
    return success(message="Book deleted")
