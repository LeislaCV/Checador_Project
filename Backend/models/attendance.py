from Backend.database.db import db
from datetime import datetime


class Attendance(db.Model):
    __tablename__ = "attendances"

    id = db.Column(db.Integer,primary_key=True)
    user_id = db.Column(db.Integer,db.ForeignKey("users.id"),nullable=False)
    date = db.Column(db.Date,default=datetime.now)
    entry = db.Column(db.Time)
    exit = db.Column(db.Time)
    status = db.Column(db.String(30),default="asistencia")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "user": self.user.name if self.user else None,
            "date": str(self.date) if self.date else None,
            "entry": str(self.entry) if self.entry else None,
            "exit": str(self.exit) if self.exit else None,
            "status": self.status
        }