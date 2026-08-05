from Backend.database.db import db
from datetime import datetime


class Face(db.Model):

    __tablename__="faces"


    id=db.Column(db.Integer,primary_key=True)
    user_id=db.Column(db.Integer,db.ForeignKey("users.id"),nullable=False)
    image_path=db.Column(db.String(255), nullable=False)
    created_at=db.Column(db.DateTime,default=datetime.now)

    def to_dict(self):

        return {

            "id":self.id,
            "user_id":self.user_id,
            "image_path":self.image_path,
            "created_at":self.created_at

        }