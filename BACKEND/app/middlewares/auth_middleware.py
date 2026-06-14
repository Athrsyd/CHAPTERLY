from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt
from app.utils.response import error


def _role_required(*allowed_roles):
    """Factory: returns a decorator that restricts access to given roles."""
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            role = claims.get("role")
            if role not in allowed_roles:
                return error("Forbidden: insufficient permissions", 403)
            return fn(*args, **kwargs)
        return wrapper
    return decorator


# ── convenience decorators ──────────────────────────────────
def reader_required(fn):
    """Allow reader, author, and owner."""
    return _role_required("reader", "author", "owner")(fn)


def author_required(fn):
    """Allow author and owner only."""
    return _role_required("author", "owner")(fn)


def owner_required(fn):
    """Allow owner only."""
    return _role_required("owner")(fn)
