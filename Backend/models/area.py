from Backend.database.db import db


class Area(db.Model):
    __tablename__="areas"

    id=db.Column(db.Integer,primary_key=True)
    name=db.Column(db.String(50),nullable=False)
    users=db.relationship("User",backref="area",lazy=True)

    def to_dict(self):
        return {
            "id":self.id,
            "name":self.name

        }