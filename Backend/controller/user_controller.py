from Backend.models.user import User
from Backend import db
from werkzeug.security import generate_password_hash


def create_user(data):
    user=User(
        name=data["name"],
        email=data["email"],
        password=generate_password_hash(
            data["password"]
        ),
        rol=data.get(
            "rol",
            "empleado"
        ),
        area_id=data.get(
            "area_id"
        )
    )
    db.session.add(user)
    db.session.commit()
    return user

def get_users():
    return User.query.all()

def update_user(id,data):
    user=User.query.get(id)
    if not user:
        return None
    for key,value in data.items():

        setattr(
            user,
            key,
            value
        )
    db.session.commit()
    return user

def delete_user(id):
    user=User.query.get(id)
    if user:

        db.session.delete(user)
        db.session.commit()


    return user