from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity

from app.middlewares.auth_middleware import reader_required, owner_required
from app.utils.supabase_client import get_supabase
from app.utils.response import success, error

apply_bp = Blueprint("apply", __name__, url_prefix="/api/apply")


def _current_user_id() -> int:
    return int(get_jwt_identity())


# ── POST /api/apply  — reader daftar jadi author ────────────
@apply_bp.post("/")
@reader_required
def submit_application():
    body = request.get_json(silent=True) or {}
    reason = body.get("reason", "").strip()

    if not reason:
        return error("reason is required")

    db = get_supabase()
    uid = _current_user_id()

    # Check existing application
    existing = (
        db.table("author_applying")
        .select("id, status")
        .eq("user_id", uid)
        .execute()
    )
    if existing.data:
        app_status = existing.data[0]["status"]
        if app_status == "pending":
            return error("You already have a pending application", 409)
        if app_status == "approved":
            return error("You are already an author", 409)

    # Upsert (allow re-apply after rejection)
    result = (
        db.table("author_applying")
        .upsert({"user_id": uid, "reason": reason, "status": "pending"})
        .execute()
    )
    return success(result.data[0], "Application submitted", 201)


# ── GET /api/apply  — owner: lihat semua aplikasi ───────────
@apply_bp.get("/")
@owner_required
def list_applications():
    db = get_supabase()
    status_filter = request.args.get("status", "pending")

    result = (
        db.table("author_applying")
        .select("*, users(id, name, email)")
        .eq("status", status_filter)
        .execute()
    )
    return success(result.data)


# ── PATCH /api/apply/<id>  — owner: approve / reject ────────
@apply_bp.patch("/<int:application_id>")
@owner_required
def review_application(application_id: int):
    body = request.get_json(silent=True) or {}
    new_status = body.get("status")

    if new_status not in ("approved", "rejected"):
        return error("status must be 'approved' or 'rejected'")

    db = get_supabase()

    app_result = (
        db.table("author_applying")
        .select("*")
        .eq("id", application_id)
        .execute()
    )
    if not app_result.data:
        return error("Application not found", 404)

    application = app_result.data[0]

    # Update application status
    db.table("author_applying").update({"status": new_status}).eq("id", application_id).execute()

    # If approved → upgrade user role to author
    if new_status == "approved":
        db.table("users").update({"role": "author"}).eq("id", application["user_id"]).execute()

    return success(message=f"Application {new_status}")
