from flask import Flask
from .config import Config
from .database.db import db
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager

migrate = Migrate()
jwt = JWTManager()

def create_app():
    app= Flask(__name__)
    
    app.config.from_object(Config)
    from Backend.models.attendance import Attendance
    from Backend.models.face import Face
    from Backend.models.vacation import Vacation
    from Backend.models.area import Area
    from Backend.models.log import Log
    from Backend.models.schedule import Schedule
    from Backend.models.user import User

    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    #Rutas
    from Backend.routes.user_routes import user_routes
    from Backend.routes.attendance_routes import attendance_routes
    from Backend.routes.vacation_routes import vacation_routes
    from Backend.routes.schedule_routes import schedule_routes
    from Backend.routes.face_routes import face_routes
    from Backend.routes.area_routes import area_routes

    app.register_blueprint(user_routes)
    app.register_blueprint(attendance_routes)
    app.register_blueprint(vacation_routes)
    app.register_blueprint(schedule_routes)
    app.register_blueprint(face_routes)
    app.register_blueprint(area_routes)
    CORS(app)
    return app