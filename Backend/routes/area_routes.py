from flask import Blueprint, jsonify, request
from Backend.controller.area_controller import (get_areas, get_area, create_area)


area_routes_bp = Blueprint("area_bp",__name__)

@area_routes_bp.route("/areas", methods=["POST"])
def create():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"message": "No se recibieron datos"}), 400

    area, error = create_area(data)
    if error:
        return jsonify({"message": error}), 400

    return jsonify({
        "message": "Área creada correctamente",
        "area": area.to_dict()
    }), 201

@area_routes_bp.route("/areas",methods=["GET"])
def get_all():
    areas = get_areas()
    return jsonify([
        area.to_dict()
        for area in areas
    ]), 200

@area_routes_bp.route("/areas/<int:id>",methods=["GET"])
def get_one(id):
    area = get_area(id)
    if not area:
        return jsonify({
            "message": "Área no encontrada"
        }), 404

    return jsonify(
        area.to_dict()
    ), 200