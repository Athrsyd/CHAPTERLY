from flask import Blueprint
from app.controllers.UserController import index

api = Blueprint("api", __name__)

api.route("/users", methods=["GET"])(index)
