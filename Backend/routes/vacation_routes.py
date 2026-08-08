from flask import Blueprint, request, jsonify
from Backend.controller.vacation_controller import (create_vacation,get_vacations,get_vacation,update_vacation,delete_vacation)

vacation_routes_bp = Blueprint("vacation_bp",__name__)

@vacation_routes_bp.route("/vacations",methods=["POST"])
def create():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"message": "No se recibieron datos"}), 400
        
    vacation, error = create_vacation(data)
    if error:
        return jsonify({"message": error}), 400
        
    return jsonify({
        "message": "Permiso creado correctamente",
        "vacation": vacation.to_dict()
    }), 200

@vacation_routes_bp.route("/vacations/user/<int:user_id>",methods=["GET"])
def history(user_id):
    vacations = get_vacations(user_id)
    return jsonify([
        vacation.to_dict()
        for vacation in vacations
    ]), 200

@vacation_routes_bp.route("/vacations/<int:id>",methods=["GET"])
def get_one(id):
    vacation = get_vacation(id)
    if not vacation:
        return jsonify({
            "message": "Permiso no encontrado"
        }), 404
    return jsonify(
        vacation.to_dict()
    ), 200

@vacation_routes_bp.route("/vacations/<int:id>",methods=["PUT"])
def update(id):
    data = request.get_json()
    vacation = update_vacation(id,data)
    if not vacation:
        return jsonify({
            "message": "Permiso no encontrado"
        }), 404
    return jsonify({
        "message": "Permiso actualizado correctamente",
        "vacation": vacation.to_dict()
    }), 200

@vacation_routes_bp.route("/vacations/<int:id>",methods=["DELETE"])
def delete(id):
    vacation = delete_vacation(id)
    if not vacation:
        return jsonify({
            "message": "Permiso no encontrado"
        }), 404
    return jsonify({
        "message": "Permiso eliminado correctamente"
    }), 200