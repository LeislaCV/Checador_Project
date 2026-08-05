from Backend.database.db import db
from datetime import datetime


class Vacation(db.Model):
    __tablename__="vacations"

    id=db.Column(db.Integer,primary_key=True)
    user_id=db.Column(db.Integer,db.ForeignKey("users.id"))
    reason=db.Column(db.Text)
    start_date=db.Column(db.Date)
    end_date=db.Column(db.Date)
    status=db.Column(db.String(20),default="pendiente")
    created_at=db.Column(db.DateTime,default=datetime.now)


    def to_dict(self):

        return {

            "id":self.id,
            "user_id":self.user_id,
            "user":self.user.name if self.user else None,
            "reason":self.reason,
            "start_date":self.start_date,
            "end_date":self.end_date,
            "status":self.status,
            "created_at":self.created_at

        }