from Backend.models.schedule import Schedule
from Backend import db



def create_schedule(data):
    schedule=Schedule(**data)
    db.session.add(schedule)
    db.session.commit()
    return schedule

def get_schedules():
    return Schedule.query.all()

def update_schedule(id,data):
    schedule=Schedule.query.get(id)
    for k,v in data.items():
        setattr(
            schedule,
            k,
            v
        )
    db.session.commit()
    return schedule