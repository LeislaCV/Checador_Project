from Backend.models.user import User
from Backend.models.attendance import Attendance
from Backend.models.vacation import Vacation
from Backend.models.face import Face
from Backend.database.db import db
from werkzeug.security import generate_password_hash


def create_user(data):
    existing_user = User.query.filter_by(
        email=data["email"]
    ).first()
    if existing_user:
        return None, "El correo ya está registrado"

    user = User(
        name=data["name"],
        email=data["email"],
        password=generate_password_hash(
            data["password"]
        ),
        rol=data.get("rol", "empleado"),
        state=data.get("state", "activo"),
        area_id=data.get("area_id"),
        schedule_id=data.get("schedule_id")
    )
    db.session.add(user)
    db.session.commit()
    return user, None

def get_users():
    return User.query.all()

def get_user(id):
    return User.query.get(id)

def update_user(id, data):
    user = User.query.get(id)
    if not user:
        return None
    
    if "password" in data:
        user.password = generate_password_hash(data["password"])
        
    allowed_fields = {"name", "email", "rol", "state", "area_id", "schedule_id"}
    
    for key, value in data.items():
        if key in allowed_fields:
            setattr(user, key, value)
            
    db.session.commit()
    return user
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return None, "Usuario no encontrado"
    try:
        Attendance.query.filter_by(user_id=user_id).delete(
            synchronize_session=False
        )

        Vacation.query.filter_by(user_id=user_id).delete(
            synchronize_session=False
        )

        Face.query.filter_by(user_id=user_id).delete(
            synchronize_session=False
        )

        db.session.delete(user)
        db.session.commit()
        return True, "Usuario eliminado correctamente"

    except Exception as e:
        db.session.rollback()
        print("ERROR AL ELIMINAR USUARIO:", e)

        return None, "No se pudo eliminar el usuario"