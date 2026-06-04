from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt


def auth_required(func):
    """Decorator untuk proteksi route dengan JWT."""
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()
        except Exception as e:
            return jsonify({"status": "error", "message": "Token tidak valid atau sudah expired"}), 401
        return func(*args, **kwargs)
    return wrapper
