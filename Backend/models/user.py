from Backend.database.db import db
from datetime import datetime


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer,primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100),nullable=False,unique=True)
    password = db.Column(db.String(255),nullable=False)
    rol = db.Column(db.String(20),default="empleado")
    state = db.Column(db.String(20),default="activo")
    area_id = db.Column(db.Integer,db.ForeignKey("areas.id"))
    created_at = db.Column(db.DateTime,default=datetime.now)
    attendances = db.relationship("Attendance",backref="user",lazy=True)
    vacations = db.relationship("Vacation",backref="user",lazy=True)
    face = db.relationship("Face",backref="user",uselist=False)


    def to_dict(self):

        return {

            "id": self.id,
            "name": self.name,
            "email": self.email,
            "rol": self.rol,
            "state": self.state,
            "area_id": self.area_id,
            "created_at": self.created_at

        }