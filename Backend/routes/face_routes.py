from flask import Blueprint,request,jsonify
from Backend.controller.face_controller import *


face_routes = Blueprint("face",__name__)

@face_routes.route("/face/register",methods=["POST"])
def register_face():
    data=request.json
    face=create_face(
        data
    )
    return jsonify({
        "message":
        "Rostro registrado",
        "face":
        face.to_dict()

    })

@face_routes.route("/face/verify",methods=["POST"])
def verify_face_route():

    data=request.json
    result=verify_face(
        data
    )

    return jsonify(result)