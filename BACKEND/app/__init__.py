import os
from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()


def create_app() -> Flask:
    app = Flask(__name__)

    # ── Config ──────────────────────────────────────────────
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "change-me-in-production")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = False

    JWTManager(app)

    # ── CORS ─────────────────────────────────────────────────
    CORS(app,
         resources={r"/*": {"origins": "*"}},
         allow_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
         supports_credentials=False)

    # Handle OPTIONS preflight untuk semua route
    @app.before_request
    def handle_preflight():
        if request.method == "OPTIONS":
            res = jsonify({"status": "ok"})
            res.headers["Access-Control-Allow-Origin"] = request.headers.get("Origin", "*")
            res.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS"
            res.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
            res.headers["Access-Control-Max-Age"] = "86400"
            return res, 200

    # ── Register blueprints ──────────────────────────────────
    from app.controllers.auth_controller import auth_bp
    from app.controllers.book_controller import book_bp
    from app.controllers.rent_controller import rent_bp
    from app.controllers.apply_controller import apply_bp
    from app.controllers.admin_controller import admin_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(book_bp)
    app.register_blueprint(rent_bp)
    app.register_blueprint(apply_bp)
    app.register_blueprint(admin_bp)

    # ── Health check ─────────────────────────────────────────
    @app.get("/")
    def health():
        return {"status": "Chapterly API is running 📚"}

    return app
