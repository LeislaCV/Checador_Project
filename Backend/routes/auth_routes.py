from flask import Blueprint, request, jsonify
from Backend.controller.auth_controoller import login_user


auth_routes_bp = Blueprint("auth_bp", __name__)

@auth_routes_bp.route("/auth/login",methods=["POST"])
def login():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"message": "No se recibieron datos"}), 400
        
    email, password = data.get("email"), data.get("password")
    if not email or not password:
        return jsonify({"message": "Correo y contraseña son obligatorios"}), 400

    result, error = login_user(email, password)
    if error:
        return jsonify({"message": error}), 401

    return jsonify(result), 200