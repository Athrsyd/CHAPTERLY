from flask import Blueprint

from app.middlewares.auth_middleware import owner_required
from app.utils.supabase_client import get_supabase
from app.utils.response import success, error

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")


# ── GET /api/admin/authors  — daftar semua author ───────────
@admin_bp.get("/authors")
@owner_required
def list_authors():
    db = get_supabase()
    result = (
        db.table("users")
        .select("id, name, email, role")
        .eq("role", "author")
        .execute()
    )
    return success(result.data)


# ── DELETE /api/admin/authors/<id>  — hapus author ──────────
@admin_bp.delete("/authors/<int:user_id>")
@owner_required
def delete_author(user_id: int):
    db = get_supabase()

    user = (
        db.table("users")
        .select("id, role")
        .eq("id", user_id)
        .eq("role", "author")
        .execute()
    )
    if not user.data:
        return error("Author not found", 404)

    # Downgrade role back to reader instead of hard-delete
    # (preserves data integrity — books remain)
    db.table("users").update({"role": "reader"}).eq("id", user_id).execute()

    return success(message="Author removed (role downgraded to reader)")
