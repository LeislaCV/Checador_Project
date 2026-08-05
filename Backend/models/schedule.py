from Backend.database.db import db


class Schedule(db.Model):
    __tablename__="schedules"


    id=db.Column(db.Integer,primary_key=True)
    user_id=db.Column(db.Integer,db.ForeignKey("users.id"))
    start=db.Column(db.Time,nullable=False)
    end=db.Column(db.Time,nullable=False)
    day=db.Column(db.String(20))


    def to_dict(self):

        return {

            "id":self.id,
            "user_id":self.user_id,
            "user":self.user.name if self.user else None,
            "start":self.start,
            "end":self.end,
            "day":self.day

        }