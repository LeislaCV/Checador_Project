from Backend.models.log import Role
from Backend.database.db import db

def create_role(data):
    if Role.query.filter_by(name=data["name"]).first():
        return None, "El rol ya existe"
    
    new_role = Role(name=data["name"])
    db.session.add(new_role)
    db.session.commit()
    return new_role, None

def get_roles():
    return Role.query.all()

def get_role(role_id):
    return Role.query.get(role_id)