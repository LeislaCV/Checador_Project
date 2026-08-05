from Backend.database.db import db
from datetime import datetime


class Log(db.Model):
    __tablename__="logs"


    id=db.Column(db.Integer,primary_key=True)
    user_id=db.Column(db.Integer,db.ForeignKey("users.id"))
    action=db.Column(db.String(50))
    date=db.Column(db.DateTime,default=datetime.now)


    def to_dict(self):

        return {

            "id":self.id,
            "user_id":self.user_id,
            "action":self.action,
            "date":self.date

        }