from Backend.models.area import Area
from Backend.database.db import db


def create_area(data):
    name = data.get("name")
    if not name:
        return None, "El nombre del área es obligatorio"

    if Area.query.filter_by(name=name).first():
        return None, "El área ya existe"

    area = Area(name=name)
    db.session.add(area)
    db.session.commit()
    return area, None

def get_areas():
    return Area.query.order_by(
        Area.name.asc()
    ).all()

def get_area(id):
    return Area.query.get(id)