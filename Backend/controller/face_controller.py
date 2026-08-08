from Backend.models.face import Face
from Backend.models.user import User
from Backend.database.db import db
from deepface import DeepFace


def create_face(data):
    user_id = data.get("user_id")
    image_path = data.get("image_path")
    
    if not user_id:
        return None, "El user_id es obligatorio"
    if not image_path:
        return None, "La imagen es obligatoria"
    if not User.query.get(user_id):
        return None, "Usuario no encontrado"
    
    # Busca si ya existe o crea una instancia nueva de golpe (Upsert)
    face = Face.query.filter_by(user_id=user_id).first() or Face(user_id=user_id)
    face.image_path = image_path
    
    if face not in db.session:
        db.session.add(face)
        
    db.session.commit()
    return face, None


def verify_face(data):
    target_image_path = data.get("image_path")
    if not target_image_path:
        return {"verified": False, "message": "La imagen es obligatoria"}
    
    faces = Face.query.all()
    if not faces:
        return {"verified": False, "message": "No existen rostros registrados"}
    
    for face in faces:
        try:
            result = DeepFace.verify(
                img1_path=target_image_path,
                img2_path=face.image_path,
                enforce_detection=True
            )
            if not result.get("verified"):
                continue
                
            user = User.query.get(face.user_id)
            if not user:
                continue
            if user.state != "activo":
                return {"verified": False, "message": "El usuario está inactivo"}
                
            return {"verified": True, "user": user.to_dict()}
            
        except Exception:
            continue

    return {"verified": False, "message": "Rostro no reconocido"}