import bcrypt
from flask_jwt_extended import create_access_token
from app.repositories.UserRepository import UserRepository

# Simpel in-memory blocklist untuk token yang di-revoke
# Untuk production, gunakan Redis atau database
_revoked_tokens = set()


class AuthService:

    @staticmethod
    def register(data: dict) -> dict:
        # Cek apakah email sudah terdaftar
        existing = UserRepository.find_by_email(data["email"])
        if existing:
            return {"success": False, "message": "Email sudah terdaftar"}

        # Hash password
        hashed = bcrypt.hashpw(
            data["password"].encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

        # Simpan user baru
        user = UserRepository.create(data["name"], data["email"], hashed)
        if not user:
            return {"success": False, "message": "Gagal membuat akun, coba lagi"}

        # Kembalikan data user tanpa password
        safe_user = {k: v for k, v in user.items() if k != "password"}
        return {"success": True, "user": safe_user}

    @staticmethod
    def login(email: str, password: str) -> dict:
        user = UserRepository.find_by_email(email)
        if not user:
            return {"success": False, "message": "Email atau password salah"}

        # Verifikasi password
        is_valid = bcrypt.checkpw(
            password.encode("utf-8"),
            user["password"].encode("utf-8")
        )
        if not is_valid:
            return {"success": False, "message": "Email atau password salah"}

        # Buat JWT token
        access_token = create_access_token(identity=str(user["id"]))

        safe_user = {k: v for k, v in user.items() if k != "password"}
        return {
            "success": True,
            "access_token": access_token,
            "user": safe_user
        }

    @staticmethod
    def revoke_token(jti: str):
        _revoked_tokens.add(jti)

    @staticmethod
    def is_token_revoked(jwt_payload: dict) -> bool:
        return jwt_payload["jti"] in _revoked_tokens

    @staticmethod
    def get_me(user_id: str) -> dict:
        user = UserRepository.find_by_id(user_id)
        if not user:
            return {"success": False, "message": "User tidak ditemukan"}
        return {"success": True, "user": user}
