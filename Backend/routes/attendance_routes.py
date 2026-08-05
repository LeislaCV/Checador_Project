from flask import Blueprint, request, jsonify
from Backend.controller.attendance_controller import *
from Backend.controller.face_controller import verify_face 

attendance_routes = Blueprint("attendance", __name__)

@attendance_routes.route("/attendance/entry-facial", methods=["POST"])
def entry_facial():
    data = request.json
    verification = verify_face(data)
    
    if not verification or not verification.get("verified"):
        return jsonify({"message": "Autenticación facial fallida"}), 401
    
    user_id = verification["user"]["id"]
    attendance = register_entry(user_id)
    
    return jsonify({
        "message": "Entrada registrada por reconocimiento facial",
        "attendance": attendance.to_dict()
    })

@attendance_routes.route("/attendance/user/<int:user_id>", methods=["GET"])
def user_history(user_id):
    filter_type = request.args.get("filter") 
    data = history_user(user_id, filter_type)
    return jsonify([item.to_dict() for item in data])

@attendance_routes.route("/attendance/area/<int:area_id>", methods=["GET"])
def area_history(area_id):
    filter_type = request.args.get("filter") 
    data = history_area(area_id, filter_type)
    return jsonify([item.to_dict() for item in data])