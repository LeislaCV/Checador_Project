from Backend.database.db import db
from datetime import datetime


class Vacation(db.Model):
    __tablename__="vacations"

    id=db.Column(db.Integer,primary_key=True)
    user_id=db.Column(db.Integer,db.ForeignKey("users.id"), nullable=False)
    reason=db.Column(db.Text, nullable=False)
    start_date=db.Column(db.Date, nullable=False)
    end_date=db.Column(db.Date, nullable=False)
    status=db.Column(db.String(20),default="pendiente")
    created_at=db.Column(db.DateTime,default=datetime.now)


    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "user": self.user.name if self.user else None,
            "reason": self.reason,
            "start_date": (
                str(self.start_date)
                if self.start_date
                else None
            ),
            "end_date": (
                str(self.end_date)
                if self.end_date
                else None
            ),
            "status": self.status,
            "created_at": (
                self.created_at.isoformat()
                if self.created_at
                else None
            )
        }