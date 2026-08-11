from flask import Blueprint, request, jsonify
from Backend.controller.face_controller import create_face, verify_face
import os
import uuid

face_routes_bp = Blueprint("face_bp", __name__)


@face_routes_bp.route("/face/register", methods=["POST"])
def register_face():
    # Validar usuario
    user_id = request.form.get("user_id")
    if not user_id:
        return jsonify({
            "message": "El user_id es obligatorio"
        }), 400
    # Validar imagen
    if "image" not in request.files:
        return jsonify({
            "message": "No se recibió ninguna imagen"
        }), 400
    image = request.files["image"]
    if not image.filename:
        return jsonify({
            "message": "La imagen no es válida"
        }), 400
    # Carpeta donde se guardarán los rostros
    upload_folder = os.path.join(os.path.dirname(os.path.dirname(__file__)),
        "uploads",
        "faces"
    )

    os.makedirs(upload_folder, exist_ok=True)
    # Nombre único para la imagen
    image_path = os.path.join(
        upload_folder,
        f"{uuid.uuid4()}.jpg"
    )

    try:
        # Guardar fotografía
        image.save(image_path)
        # Registrar rostro en la base de datos
        face, error = create_face({
            "user_id": int(user_id),
            "image_path": image_path
        })
        if error:
            # Si ocurrió un error, eliminamos la imagen
            if os.path.exists(image_path):
                os.remove(image_path)
            return jsonify({
                "message": error
            }), 400
        return jsonify({
            "message": "Rostro registrado correctamente",
            "face": face.to_dict()
        }), 201
    except Exception as error:
        print("ERROR AL REGISTRAR ROSTRO:", error)
        # Limpiar imagen si algo falló
        if os.path.exists(image_path):
            try:
                os.remove(image_path)
            except Exception:
                pass
        return jsonify({
            "message": "Ocurrió un error al registrar el rostro",
            "detail": str(error)
        }), 500


@face_routes_bp.route("/face/verify", methods=["POST"])
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
