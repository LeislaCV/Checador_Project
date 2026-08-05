from Backend.models.vacation import Vacation
from Backend import db



def create_vacation(data):
    vacation=Vacation(**data)
    db.session.add(vacation)
    db.session.commit()
    return vacation

def get_vacations(user_id):
    return Vacation.query.filter_by(
        user_id=user_id
    ).all()



def update_vacation(id,data):
    vacation=Vacation.query.get(id)
    for k,v in data.items():
        setattr(
            vacation,
            k,
            v
        )
    db.session.commit()
    return vacation

def delete_vacation(id):
    vacation=Vacation.query.get(id)
    db.session.delete(vacation)
    db.session.commit()
    return True