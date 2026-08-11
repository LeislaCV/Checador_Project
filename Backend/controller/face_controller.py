from Backend.models.face import Face
from Backend.models.user import User
from Backend.database.db import db
from deepface import DeepFace
import os

def create_face(data):
    user_id = data.get("user_id") 
    image_path = data.get("image_path") 
    
    if not user_id: 
        return None, "El user_id es obligatorio" 
    if not image_path: 
        return None, "La imagen es obligatoria" 
        
    user = User.query.get(user_id) 
    if not user: 
        return None, "Usuario non encontrado" 
        
    # Buscar si el usuario ya tiene un rostro registrado 
    face = Face.query.filter_by(user_id=user_id).first() 
    
    if face: 
        face.image_path = image_path
        face.user_id = user_id
    else: 
        face = Face(user_id=user_id, image_path=image_path) 
        db.session.add(face) 
        
    # Guardar cambios en la base de datos para ambos casos
    db.session.commit() 
    return face, None

def verify_face(data):
    target_image_path = data.get("image_path")
    if not target_image_path:
        return {
            "verified": False,
            "message": "La imagen es obligatoria"
        }
    faces = Face.query.all()
    if not faces:
        return {
            "verified": False,
            "message": "No existen rostros registrados"
        }
    for face in faces:
        try:
            print("📸 Imagen tomada:", target_image_path)
            print("👤 Rostro registrado:", face.image_path)
            result = DeepFace.verify(
                img1_path=target_image_path,
                img2_path=face.image_path,
                enforce_detection=True
            )
            print("🧠 Resultado DeepFace:", result)
            if not result.get("verified"):
                continue
            user = User.query.get(face.user_id)
            if not user:
                continue
            if user.state != "activo":
                return {
                    "verified": False,
                    "message": "El usuario está inactivo"
                }
            return {
                "verified": True,
                "user": user.to_dict()
            }
        except Exception as error:
            print("❌ ERROR DEEPFACE:", error)
            continue
    return {
        "verified": False,
        "message": "Rostro no reconocido"
    }