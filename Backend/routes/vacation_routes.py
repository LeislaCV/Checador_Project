from flask import Blueprint,request,jsonify

from Backend.controller.vacation_controller import *


vacation_routes=Blueprint(
    "vacation",
    __name__
)


# Crear permiso
@vacation_routes.route(
"/vacations",
methods=["POST"]
)
def create():


    vacation=create_vacation(
        request.json
    )


    return jsonify({

        "message":
        "Permiso creado",

        "vacation":
        vacation.to_dict()

    })



# Historial permisos usuario
@vacation_routes.route(
"/vacations/user/<int:user_id>",
methods=["GET"]
)
def history(user_id):


    vacations=get_vacations(
        user_id
    )


    return jsonify(
        [
            v.to_dict()
            for v in vacations
        ]
    )



# Actualizar permiso
@vacation_routes.route(
"/vacations/<int:id>",
methods=["PUT"]
)
def update(id):


    vacation=update_vacation(
        id,
        request.json
    )


    return jsonify(
        vacation.to_dict()
    )



# Eliminar permiso
@vacation_routes.route(
"/vacations/<int:id>",
methods=["DELETE"]
)
def delete(id):


    delete_vacation(id)


    return jsonify({

        "message":
        "Permiso eliminado"

    })