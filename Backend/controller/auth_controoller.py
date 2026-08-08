from Backend.models.user import User
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token


def login_user(email, password):
    user = User.query.filter_by(email=email).first()
    
    if not user or not check_password_hash(user.password, password):
        return None, "Correo o contraseña incorrectos"
        
    if user.state != "activo":
        return None, "El usuario está inactivo"
        
    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={"rol": user.rol}
    )
    
    return {
        "token": access_token,
        "user": user.to_dict()
    }, None