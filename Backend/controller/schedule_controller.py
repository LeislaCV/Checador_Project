from Backend.models.schedule import Schedule
from Backend.database.db import db


def create_schedule(data):
    schedule = Schedule(
        start=data["start"],
        end=data["end"],
        day=data["day"],
        tolerance_minutes=data.get(
            "tolerance_minutes",
            10
        )
    )
    db.session.add(schedule)
    db.session.commit()
    return schedule

def get_schedules():
    return Schedule.query.all()

def get_schedule(id):
    return Schedule.query.get(id)

def update_schedule(id, data):
    schedule = Schedule.query.get(id)
    if not schedule:
        return None
    
    allowed_fields = {"start", "end", "day", "tolerance_minutes"}
    
    for key, value in data.items():
        if key in allowed_fields:
            setattr(schedule, key, value)
            
    db.session.commit()
    return schedule

def delete_schedule(id):
    schedule = Schedule.query.get(id)
    if not schedule:
        return None
    db.session.delete(schedule)
    db.session.commit()

    return schedule