from Backend.models.attendance import Attendance
from Backend.models.user import User
from Backend.database.db import db
from datetime import datetime, timedelta


def register_entry(user_id):
    today = datetime.now().date()
    attendance = Attendance.query.filter_by(
        user_id=user_id,
        date=today
    ).first()

    if attendance:
        return None, "El usuario ya tiene una entrada registrada hoy"

    attendance = Attendance(
        user_id=user_id,
        entry=datetime.now().time(),
        date=today,
        status="asistencia"
    )
    db.session.add(attendance)
    db.session.commit()
    return attendance, None

def register_exit(user_id):
    today = datetime.now().date()
    attendance = Attendance.query.filter_by(
        user_id=user_id,
        date=today
    ).first()
    if not attendance:
        return None, "No existe una entrada registrada hoy"
    if attendance.exit:
        return None, "La salida ya fue registrada"
    attendance.exit = datetime.now().time()
    db.session.commit()
    return attendance, None

def history_user(user_id, filter_type=None):
    query = Attendance.query.filter_by(
        user_id=user_id
    )
    today = datetime.now().date()
    if filter_type == "week":
        start_date = today - timedelta(
            days=today.weekday()
        )
        end_date = start_date + timedelta(
            days=6
        )
        query = query.filter(
            Attendance.date >= start_date,
            Attendance.date <= end_date
        )
    elif filter_type == "month":
        start_date = today.replace(day=1)
        if today.month == 12:
            next_month = today.replace(
                year=today.year + 1,
                month=1,
                day=1
            )
        else:
            next_month = today.replace(
                month=today.month + 1,
                day=1
            )

        query = query.filter(
            Attendance.date >= start_date,
            Attendance.date < next_month
        )

    elif filter_type == "year":

        start_date = today.replace(
            month=1,
            day=1
        )

        next_year = today.replace(
            year=today.year + 1,
            month=1,
            day=1
        )

        query = query.filter(
            Attendance.date >= start_date,
            Attendance.date < next_year
        )

    return query.order_by(
        Attendance.date.desc()
    ).all()

def history_area(area_id, filter_type=None):
    query = Attendance.query.join(
        User
    ).filter(
        User.area_id == area_id
    )
    today = datetime.now().date()
    if filter_type == "week":

        start_date = today - timedelta(
            days=today.weekday()
        )
        end_date = start_date + timedelta(
            days=6
        )
        query = query.filter(
            Attendance.date >= start_date,
            Attendance.date <= end_date
        )
    elif filter_type == "month":
        start_date = today.replace(day=1)
        if today.month == 12:
            next_month = today.replace(
                year=today.year + 1,
                month=1,
                day=1
            )
        else:
            next_month = today.replace(
                month=today.month + 1,
                day=1
            )

        query = query.filter(
            Attendance.date >= start_date,
            Attendance.date < next_month
        )

    elif filter_type == "year":

        start_date = today.replace(
            month=1,
            day=1
        )

        next_year = today.replace(
            year=today.year + 1,
            month=1,
            day=1
        )

        query = query.filter(
            Attendance.date >= start_date,
            Attendance.date < next_year
        )

    return query.order_by(
        Attendance.date.desc()
    ).all()