from flask import Blueprint, request
from flask_jwt_extended import create_access_token
import bcrypt

from app.utils.supabase_client import get_supabase
from app.utils.response import success, error

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


# ── POST /api/auth/register ──────────────────────────────────
@auth_bp.post("/register")
def register():
    body = request.get_json(silent=True) or {}
    name = body.get("name", "").strip()
    email = body.get("email", "").strip().lower()
    password = body.get("password", "")

    if not all([name, email, password]):
        return error("name, email, and password are required")

    db = get_supabase()

    # Check duplicate email
    existing = db.table("users").select("id").eq("email", email).execute()
    if existing.data:
        return error("Email already registered", 409)

    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

    result = (
        db.table("users")
        .insert({"name": name, "email": email, "password": hashed, "role": "reader"})
        .execute()
    )

    user = result.data[0]
    user.pop("password", None)
    return success(user, "Registration successful", 201)


# ── POST /api/auth/login ─────────────────────────────────────
@auth_bp.post("/login")
def login():
    body = request.get_json(silent=True) or {}
    email = body.get("email", "").strip().lower()
    password = body.get("password", "")

    if not email or not password:
        return error("email and password are required")

    db = get_supabase()
    result = db.table("users").select("*").eq("email", email).execute()

    if not result.data:
        return error("Invalid email or password", 401)

    user = result.data[0]
    if not bcrypt.checkpw(password.encode(), user["password"].encode()):
        return error("Invalid email or password", 401)

    token = create_access_token(
        identity=str(user["id"]),
        additional_claims={"role": user["role"]},
    )

    user.pop("password", None)
    return success({"token": token, "user": user}, "Login successful")
