from Backend.models.face import Face
from Backend.models.user import User
from Backend.database.db import db
from deepface import DeepFace
import os

def create_face(data):
    user_id = data.get("user_id")
    image_path = data.get("image_path") 
    
    new_face = Face(
        user_id=user_id,
        image_path=image_path
    )
    db.session.add(new_face)
    db.session.commit()
    return new_face

def verify_face(data):
    target_image_path = data.get("image_path")
    
    faces = Face.query.all()
    
    for face in faces:
        try:
            result = DeepFace.verify(
                img1_path=target_image_path, 
                img2_path=face.image_path,
                enforce_detection=False
            )
            if result["verified"]:
                user = User.query.get(face.user_id)
                return {"verified": True, "user": user.to_dict()}
        except Exception as e:
            continue
            
    return {"verified": False, "message": "Rostro no reconocido"}