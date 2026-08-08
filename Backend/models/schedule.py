from Backend.database.db import db


class Schedule(db.Model):
    __tablename__ = "schedules"

    id = db.Column(db.Integer, primary_key=True)
    start = db.Column(db.Time, nullable=False)
    end = db.Column(db.Time, nullable=False)
    day = db.Column(db.String(20), nullable=False)
    tolerance_minutes = db.Column(db.Integer,default=10)

    def to_dict(self):
        return {
            "id": self.id,
            "start": str(self.start) if self.start else None,
            "end": str(self.end) if self.end else None,
            "day": self.day,
            "tolerance_minutes": self.tolerance_minutes
        }