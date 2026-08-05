from flask import Blueprint,request,jsonify
from Backend.controller.user_controller import create_user, get_users, update_user,delete_user


user_routes = Blueprint("users", __name__)

@user_routes.route("/users",methods=["POST"])
def create():
    user=create_user(
        request.json
    )
    return jsonify(
        user.to_dict()
    ),201

@user_routes.route("/users",methods=["GET"])
def get_all():
    users=get_users()
    return jsonify(
        [
            user.to_dict()
            for user in users
        ]
    )

@user_routes.route("/users/<int:id>",methods=["GET"])
def get_one(id):
    user=get_users(id)
    if not user:

        return jsonify({
            "message":"Usuario no encontrado"
        }),404
    return jsonify(
        user.to_dict()
    )


@user_routes.route("/users/<int:id>",methods=["PUT"])
def update(id):
    user=update_user(
        id,
        request.json
    )
    if not user:

        return jsonify({
            "message":"Usuario no encontrado"
        }),404

    return jsonify(
        user.to_dict()
    )


@user_routes.route("/users/<int:id>",methods=["DELETE"])
def delete(id):
    user=delete_user(id)
    return jsonify({
        "message":
        "Usuario eliminado"

    })