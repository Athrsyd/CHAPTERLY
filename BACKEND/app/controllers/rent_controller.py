from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request

from app.middlewares.auth_middleware import reader_required
from app.utils.supabase_client import get_supabase
from app.utils.response import success, error

rent_bp = Blueprint("rent", __name__, url_prefix="/api/rent")


def _current_user_id() -> int:
    return int(get_jwt_identity())


# ── GET /api/rent  — list active rents for current user ─────
@rent_bp.get("/")
@reader_required
def list_rents():
    db = get_supabase()
    uid = _current_user_id()
    result = (
        db.table("rent_books")
        .select("*, books(*)")
        .eq("user_id", uid)
        .execute()
    )
    return success(result.data)


# ── POST /api/rent  — sewa buku baru ────────────────────────
@rent_bp.post("/")
@reader_required
def create_rent():
    body = request.get_json(silent=True) or {}
    book_id = body.get("book_id")

    if not book_id:
        return error("book_id is required")

    db = get_supabase()
    uid = _current_user_id()

    # Check book exists
    book = db.table("books").select("id").eq("id", book_id).execute()
    if not book.data:
        return error("Book not found", 404)

    # Check already renting
    existing = (
        db.table("rent_books")
        .select("id")
        .eq("user_id", uid)
        .eq("book_id", book_id)
        .execute()
    )
    if existing.data:
        return error("You are already renting this book", 409)

    result = (
        db.table("rent_books")
        .insert({"user_id": uid, "book_id": book_id})
        .execute()
    )
    return success(result.data[0], "Book rented successfully", 201)


# ── DELETE /api/rent/<rent_id>  — kembalikan buku ───────────
@rent_bp.delete("/<int:rent_id>")
@reader_required
def return_book(rent_id: int):
    db = get_supabase()
    uid = _current_user_id()

    rent = (
        db.table("rent_books")
        .select("*")
        .eq("id", rent_id)
        .eq("user_id", uid)
        .execute()
    )
    if not rent.data:
        return error("Active rent not found", 404)

    # Move to history
    db.table("history_rent").insert({"rent_id": rent_id}).execute()

    # Remove active rent
    db.table("rent_books").delete().eq("id", rent_id).execute()

    return success(message="Book returned and moved to history")


# ── GET /api/rent/history  — riwayat sewa ───────────────────
@rent_bp.get("/history")
@reader_required
def rent_history():
    db = get_supabase()
    uid = _current_user_id()

    # History joined through rent_books to get user's records
    history = (
        db.table("history_rent")
        .select("*, rent_books!inner(*, books(*))")
        .eq("rent_books.user_id", uid)
        .execute()
    )
    return success(history.data)
