from flask import Blueprint, request, jsonify
from Backend.controller.face_controller import verify_face
from Backend.controller.attendance_controller import (register_entry,register_exit,history_user,history_area, history_all)
from datetime import datetime
from Backend.models.attendance import Attendance
import os, uuid

attendance_routes_bp = Blueprint("attendance_bp", __name__)

@attendance_routes_bp.route("/attendance/facial", methods=["POST"])
def facial_attendance():
    # vlidación de archivo (unificada en una sola condición)
    if "image" not in request.files or not request.files["image"].filename:
        return jsonify({"message": "No se recibió ninguna imagen válida"}), 400

    image = request.files["image"]

    # configuración de ruta y guardado temporal
    upload_folder = os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        "uploads",
        "attendance"
    )
    os.makedirs(upload_folder, exist_ok=True)
    
    image_path = os.path.join(upload_folder, f"{uuid.uuid4()}.jpg")

    try:
        image.save(image_path)

        # verificación facial
        verification = verify_face({"image_path": image_path})
        if not verification.get("verified"):
            return jsonify({
                "message": "Autenticación facial fallida",
                "detail": verification.get("message")
            }), 401

        user_id = verification["user"]["id"]
        today = datetime.now().date()
        attendance = Attendance.query.filter_by(user_id=user_id, date=today).first()

        # determinar acción según el estado (Evita duplicar código de respuesta)
        if not attendance:
            action, msg, attendance_type, status_code = register_entry, "Entrada registrada correctamente", "entrada", 201
        elif not attendance.exit:
            action, msg, attendance_type, status_code = register_exit, "Salida registrada correctamente", "salida", 200
        else:
            return jsonify({
                "message": "La asistencia de hoy ya está completa",
                "type": "completa",
                "attendance": attendance.to_dict()
            }), 400

        # ejecutar la acción correspondiente (entrada o salida)
        attendance, error = action(user_id)
        if error:
            return jsonify({"message": error}), 400

        return jsonify({
            "message": msg,
            "type": attendance_type,
            "user": verification["user"],
            "attendance": attendance.to_dict()
        }), status_code

    except Exception as error:
        print("ERROR EN ASISTENCIA FACIAL:", error)
        return jsonify({
            "message": "Ocurrió un error al procesar la asistencia",
            "detail": str(error)
        }), 500

    finally:
        # limpieza de archivo temporal
        if os.path.exists(image_path):
            try:
                os.remove(image_path)
            except Exception as cleanup_error:
                print("No se pudo eliminar la imagen temporal:", cleanup_error)
                
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

@attendance_routes_bp.route("/attendance", methods=["GET"])
def all_attendance():
    filter_type = request.args.get("filter")

    if filter_type not in {None, "week", "month", "year"}:
        return jsonify({
            "message": "Filtro inválido. Usa week, month o year"
        }), 400

    data = history_all(filter_type)

    return jsonify([
        item.to_dict()
        for item in data
    ]), 200