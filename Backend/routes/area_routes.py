from flask import Blueprint,jsonify
from Backend.models.area import Area


area_routes=Blueprint("area",__name__)

@area_routes.route("/areas",methods=["GET"])
def get_areas():
    areas=Area.query.all()
    return jsonify(
        [
            area.to_dict()
            for area in areas
        ]
    )