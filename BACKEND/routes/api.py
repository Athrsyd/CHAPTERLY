from flask import Blueprint
from app.controllers.AuthController import register, login, logout, me

api = Blueprint("api", __name__)



# Auth routes
api.route("/auth/register", methods=["POST"])(register)
api.route("/auth/login", methods=["POST"])(login)
api.route("/auth/logout", methods=["POST"])(logout)
api.route("/auth/me", methods=["GET"])(me)
