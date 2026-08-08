from Backend.models.vacation import Vacation
from Backend.models.user import User
from Backend.database.db import db


def create_vacation(data):
    user_id = data.get("user_id")
    if not user_id:
        return None, "El usuario es obligatorio"
    user = User.query.get(user_id)
    if not user:
        return None, "Usuario no encontrado"
    vacation = Vacation(
        user_id=user_id,
        reason=data.get("reason"),
        start_date=data.get("start_date"),
        end_date=data.get("end_date"),
        status=data.get("status", "pendiente")
    )
    db.session.add(vacation)
    db.session.commit()
    return vacation, None

def get_vacations(user_id):
    return Vacation.query.filter_by(
        user_id=user_id
    ).order_by(
        Vacation.start_date.desc()
    ).all()

def get_vacation(id):
    return Vacation.query.get(id)

def update_vacation(id, data):
    vacation = Vacation.query.get(id)
    if not vacation:
        return None
    
    allowed_fields = {"reason", "start_date", "end_date", "status"}
    
    for key, value in data.items():
        if key in allowed_fields:
            setattr(vacation, key, value)
            
    db.session.commit()
    return vacation

def delete_vacation(id):
    vacation = Vacation.query.get(id)
    if not vacation:
        return None
    db.session.delete(vacation)
    db.session.commit()
    return vacation