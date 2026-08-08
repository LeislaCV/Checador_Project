from flask import Blueprint, request, jsonify

from Backend.controller.face_controller import (create_face,verify_face)

face_routes_bp = Blueprint("face_bp",__name__)

@face_routes_bp.route("/face/register",methods=["POST"])
def register_face():
    data = request.get_json()
    if not data:
        return jsonify({
            "message": "No se recibieron datos"
        }), 400
    face, error = create_face(data)
    if error:
        return jsonify({
            "message": error
        }), 400
    return jsonify({
        "message": "Rostro registrado correctamente",
        "face": face.to_dict()
    }), 201

@face_routes_bp.route("/face/verify",methods=["POST"])
def verify_face_route():
    data = request.get_json()
    if not data:
        return jsonify({
            "verified": False,
            "message": "No se recibió la imagen"
        }), 400
    result = verify_face(data)
    if not result.get("verified"):
        return jsonify(result), 401

    return jsonify(result), 200