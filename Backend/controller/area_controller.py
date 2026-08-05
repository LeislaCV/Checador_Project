from Backend.models.attendance import Check
from Backend.database.db import db
from datetime import datetime

def register_check(user_id, state, status):
    today = datetime.utcnow().date()
    current_time = datetime.utcnow().time()

    existing_check = Check.query.filter_by(user_id=user_id, date=today).first()

    if not existing_check:
        new_check = Check(
            check_in=current_time,
            date=today,
            state=state,      
            status=status,    
            user_id=user_id
        )
        db.session.add(new_check)
        db.session.commit()
        return new_check, 
    
    elif existing_check.check_out is None:
        existing_check.check_out = current_time
        db.session.commit()
        return existing_check, 
    
    return None

def get_user_checks(user_id):
    return Check.query.filter_by(user_id=user_id).all()