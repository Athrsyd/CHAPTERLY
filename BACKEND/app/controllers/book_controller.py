from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, get_jwt

from app.middlewares.auth_middleware import reader_required, author_required
from app.utils.supabase_client import get_supabase
from app.utils.response import success, error

book_bp = Blueprint("books", __name__, url_prefix="/api/books")


def _current_user_id() -> int:
    return int(get_jwt_identity())


# ── GET /api/books  — semua buku (public) ───────────────────
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


# ── POST /api/books  — buat buku baru (author/owner) ────────
@book_bp.post("/")
@author_required
def create_book():
    body = request.get_json(silent=True) or {}
    name = body.get("name", "").strip()
    price = body.get("price")

    if not name or price is None:
        return error("name and price are required")

    db = get_supabase()
    uid = _current_user_id()

    payload = {
        "name": name,
        "cover": body.get("cover"),
        "author_id": uid,
        "genre": body.get("genre"),
        "price": float(price),
        "rate": int(body.get("rate", 0)),
        "description": body.get("description"),
    }

    result = db.table("books").insert(payload).execute()
    return success(result.data[0], "Book created", 201)


# ── PUT /api/books/<id>  — update buku (author milik sendiri / owner) ──
@book_bp.put("/<int:book_id>")
@author_required
def update_book(book_id: int):
    db = get_supabase()
    uid = _current_user_id()
    role = get_jwt().get("role")

    book = db.table("books").select("*").eq("id", book_id).execute()
    if not book.data:
        return error("Book not found", 404)

    # Author can only edit their own books; owner can edit any
    if role == "author" and book.data[0]["author_id"] != uid:
        return error("Forbidden: you can only edit your own books", 403)

    body = request.get_json(silent=True) or {}
    allowed_fields = ["name", "cover", "genre", "price", "rate", "description"]
    updates = {k: v for k, v in body.items() if k in allowed_fields}

    if not updates:
        return error("No valid fields to update")

    result = db.table("books").update(updates).eq("id", book_id).execute()
    return success(result.data[0], "Book updated")


# ── DELETE /api/books/<id>  — hapus buku ────────────────────
@book_bp.delete("/<int:book_id>")
@author_required
def delete_book(book_id: int):
    db = get_supabase()
    uid = _current_user_id()
    role = get_jwt().get("role")

    book = db.table("books").select("*").eq("id", book_id).execute()
    if not book.data:
        return error("Book not found", 404)

    if role == "author" and book.data[0]["author_id"] != uid:
        return error("Forbidden: you can only delete your own books", 403)

    db.table("books").delete().eq("id", book_id).execute()
    return success(message="Book deleted")
