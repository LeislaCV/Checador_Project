from flask import Blueprint, request, jsonify
from Backend.controller.schedule_controller import (create_schedule,get_schedules,get_schedule,update_schedule,delete_schedule)

schedule_routes_bp = Blueprint("schedule_bp",__name__)

@schedule_routes_bp.route("/schedules", methods=["POST"])
def create():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"message": "No se recibieron datos"}), 400

    schedule = create_schedule(data)
    return jsonify({
        "message": "Horario creado correctamente",
        "schedule": schedule.to_dict()
    }), 200

@schedule_routes_bp.route("/schedules/all", methods=["GET"])
def get_all():
    schedules = get_schedules()
    return jsonify([schedule.to_dict() for schedule in schedules]), 200

@schedule_routes_bp.route("/schedules/<int:id>", methods=["GET"])
def get_one(id):
    schedule = get_schedule(id)
    if not schedule:
        return jsonify({"message": "Horario no encontrado"}), 404
    return jsonify(schedule.to_dict()), 200


@schedule_routes_bp.route("/schedules/<int:id>", methods=["PUT"])
def update(id):
    data = request.get_json(silent=True) or {}
    schedule = update_schedule(id, data)
    if not schedule:
        return jsonify({"message": "Horario no encontrado"}), 404

    return jsonify({
        "message": "Horario actualizado correctamente",
        "schedule": schedule.to_dict()
    }), 200


@schedule_routes_bp.route("/schedules/<int:id>", methods=["DELETE"])
def delete(id):
    schedule = delete_schedule(id)
    if not schedule:
        return jsonify({"message": "Horario no encontrado"}), 404

    return jsonify({"message": "Horario eliminado correctamente"}), 200