from flask import Blueprint,request,jsonify

from Backend.controller.schedule_controller import *


schedule_routes=Blueprint("schedule",__name__)
@schedule_routes.route("/schedule",methods=["POST"])
def create():
    schedule=create_schedule(
        request.json
    )
    return jsonify({
        "message":
        "Horario creado",
        "schedule":
        schedule.to_dict()

    })

@schedule_routes.route("/schedule",methods=["GET"])
def get_all():
    schedules=get_schedules()
    return jsonify(
        [
            s.to_dict()
            for s in schedules
        ]
    )

@schedule_routes.route("/schedule/<int:id>",methods=["PUT"])
def update(id):
    schedule=update_schedule(
        id,
        request.json
    )
    return jsonify(
        schedule.to_dict()
    )