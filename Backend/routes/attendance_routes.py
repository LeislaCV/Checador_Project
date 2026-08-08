from flask import Blueprint, request, jsonify
from Backend.controller.face_controller import verify_face
from Backend.controller.attendance_controller import (register_entry,register_exit,history_user,history_area)
from datetime import datetime
from Backend.models.attendance import Attendance

attendance_routes_bp = Blueprint("attendance_bp", __name__)

def facial_attendance():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"message": "No se recibió la imagen"}), 400

    verification = verify_face(data)
    if not verification.get("verified"):
        return jsonify({
            "message": "Autenticación facial fallida",
            "detail": verification.get("message")
        }), 401

    user_id = verification["user"]["id"]
    today = datetime.now().date()
    attendance = Attendance.query.filter_by(user_id=user_id, date=today).first()

    # Definir la acción según el estado actual de la asistencia
    if not attendance:
        attendance, error = register_entry(user_id)
        action_type, msg, status = "entrada", "Entrada registrada correctamente", 201
    elif not attendance.exit:
        attendance, error = register_exit(user_id)
        action_type, msg, status = "salida", "Salida registrada correctamente", 200
    else:
        return jsonify({
            "message": "La asistencia de hoy ya está completa",
            "type": "completa",
            "attendance": attendance.to_dict()
        }), 400

    if error:
        return jsonify({"message": error}), 400

    return jsonify({
        "message": msg,
        "type": action_type,
        "user": verification["user"],
        "attendance": attendance.to_dict()
    }), status

@attendance_routes_bp.route("/attendance/user/<int:user_id>", methods=["GET"])
def user_history(user_id):
    filter_type = request.args.get("filter")
    if filter_type not in {None, "week", "month", "year"}:
        return jsonify({"message": "Filtro inválido. Usa week, month o year"}), 400

    data = history_user(user_id, filter_type)
    return jsonify([item.to_dict() for item in data]), 200

@attendance_routes_bp.route("/attendance/area/<int:area_id>", methods=["GET"])
def area_history(area_id):
    filter_type = request.args.get("filter")
    if filter_type not in {None, "week", "month", "year"}:
        return jsonify({"message": "Filtro inválido. Usa week, month o year"}), 400

    data = history_area(area_id, filter_type)
    return jsonify([item.to_dict() for item in data]), 200