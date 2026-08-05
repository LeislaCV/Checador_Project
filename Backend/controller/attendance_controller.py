from Backend.models.attendance import Attendance
from Backend.models.user import User
from Backend.database.db import db
from datetime import datetime

def register_entry(user_id):
    attendance = Attendance(
        user_id=user_id,
        entry=datetime.now().time(),
        date=datetime.now().date(),
        status="asistencia"
    )
    db.session.add(attendance)
    db.session.commit()
    return attendance

def register_exit(id):
    attendance = Attendance.query.get(id)
    attendance.exit = datetime.now().time()
    db.session.commit()
    return attendance

def history_user(user_id):
    return Attendance.query.filter_by(user_id=user_id).all()

def history_area(area_id):
    return Attendance.query.join(User).filter(User.area_id == area_id).all()