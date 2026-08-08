from flask import Blueprint, request, jsonify

from Backend.controller.user_controller import (create_user,get_users,get_user,update_user,delete_user)

user_routes_bp = Blueprint("users_bp",__name__)

@user_routes_bp.route("/users",methods=["POST"])
def create():
    data = request.get_json()
    if not data:
        return jsonify({
            "message": "No se recibieron datos"
        }), 400
    user, error = create_user(data)
    if error:
        return jsonify({
            "message": error
        }), 400

    return jsonify({
        "message": "Usuario creado correctamente",
        "user": user.to_dict()
    }), 201

@user_routes_bp.route("/users",methods=["GET"])
def get_all():
    users = get_users()
    return jsonify([
        user.to_dict()
        for user in users
    ]), 200

@user_routes_bp.route("/users/<int:id>",methods=["GET"])
def get_one(id):
    user = get_user(id)
    if not user:
        return jsonify({
            "message": "Usuario no encontrado"
        }), 404

    return jsonify(
        user.to_dict()
    ), 200

@user_routes_bp.route("/users/<int:id>",methods=["PUT"])
def update(id):
    data = request.get_json()
    if not data:
        return jsonify({
            "message": "No se recibieron datos"
        }), 400

    user = update_user(id,data)
    if not user:
        return jsonify({
            "message": "Usuario no encontrado"
        }), 404
    return jsonify({
        "message": "Usuario actualizado correctamente",
        "user": user.to_dict()
    }), 200

@user_routes_bp.route("/users/<int:id>",methods=["DELETE"])
def delete(id):
    user = delete_user(id)
    if not user:
        return jsonify({
            "message": "Usuario no encontrado"
        }), 404
    return jsonify({
        "message": "Usuario eliminado correctamente"
    }), 200