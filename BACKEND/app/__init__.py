import os
from flask import jsonify
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()


def create_app():
    app = Flask(__name__)
    CORS(app, origins="http://localhost:5173") 
    # Konfigurasi JWT
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "ganti-dengan-secret-yang-kuat")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 60 * 60 * 24  # 1 hari (dalam detik)

    jwt = JWTManager(app)

    # Cek token yang sudah di-revoke (logout)
    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        from app.services.AuthService import AuthService
        return AuthService.is_token_revoked(jwt_payload)

    # Custom error response JWT
    @jwt.unauthorized_loader
    def unauthorized_response(callback):
        return jsonify({"status": "error", "message": "Token tidak ditemukan"}), 401

    @jwt.expired_token_loader
    def expired_token_response(jwt_header, jwt_payload):
        return jsonify({"status": "error", "message": "Token sudah expired"}), 401

    @jwt.invalid_token_loader
    def invalid_token_response(callback):
        return jsonify({"status": "error", "message": "Token tidak valid"}), 422

    @jwt.revoked_token_loader
    def revoked_token_response(jwt_header, jwt_payload):
        return jsonify({"status": "error", "message": "Token sudah digunakan (logout)"}), 401

    from routes.api import api
    app.register_blueprint(api, url_prefix="/api")

    return app
