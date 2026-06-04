from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.services.AuthService import AuthService
from app.requests.AuthRequest import RegisterRequest, LoginRequest
from marshmallow import ValidationError


def register():
    """POST /api/auth/register"""
    schema = RegisterRequest()
    try: 
        data = schema.load(request.get_json())
    except ValidationError as err:
        return jsonify({"status": "error", "errors": err.messages}), 422

    result = AuthService.register(data)

    if not result["success"]:
        return jsonify({"status": "error", "message": result["message"]}), 400

    return jsonify({
        "status": "success",
        "message": "Registrasi berhasil",
        "data": result["user"]
    }), 201


def login():
    """POST /api/auth/login"""
    schema = LoginRequest()
    try:
        data = schema.load(request.get_json())
    except ValidationError as err:
        return jsonify({"status": "error", "errors": err.messages}), 422

    result = AuthService.login(data["email"], data["password"])

    if not result["success"]:
        return jsonify({"status": "error", "message": result["message"]}), 401

    return jsonify({
        "status": "success",
        "message": "Login berhasil",
        "data": {
            "access_token": result["access_token"],
            "user": result["user"]
        }
    }), 200


@jwt_required()
def logout():
    """POST /api/auth/logout"""
    jti = get_jwt()["jti"]
    AuthService.revoke_token(jti)

    return jsonify({
        "status": "success",
        "message": "Logout berhasil"
    }), 200


@jwt_required()
def me():
    """GET /api/auth/me"""
    user_id = get_jwt_identity()
    result = AuthService.get_me(user_id)

    if not result["success"]:
        return jsonify({"status": "error", "message": result["message"]}), 404

    return jsonify({
        "status": "success",
        "data": result["user"]
    }), 200
