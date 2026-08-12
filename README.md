Checador Facial

El proyecto se trata de un sistema de control de asistencia mediante reconocimiento facial, 
con el fin de automatizar y facilitar el registro de entradas y salidas de los usuarios, 
permitiendo también la administración de perfiles, horarios, permisos e historiales. 

La app asocia a cada usuario con su cara capturada por la cámara del dispositivo, y usa DeepFace para 
comparar las imágenes registradas con las capturadas en tiempo real, asegurando así una identificación precisa. 

La arquitectura está dividida en dos partes, un BACKEND desarrollado en Flask que expone la API REST y 
aneja la lógica de negocio y un FRONTEND creado con React Native y Expo que ofrece la interfaz móvil para registrar, 
configurar y consultar las asistencias.


El BACKEND utiliza variables de entorno para poder almacenar la información de configuración.
Antes de poder ejecutar el proyecto es necesario contar con lo siguiente:

- Python 3.x
- PostgreSQL
- Node.js
- npm
- Git
- Expo
- Expo Go, si se utilizará un dispositivo físico

  Para lo del reconocimiento facial también será necesario la instalación de todas las dependencias
  especificadas en "requirements.txt"
  

  Configuración del BACKEND:

  1. Entrar a la carpeta BACKEND: Desde la carpeta principal del proyecto
              -  cd Backend
     
  2. Crear el entorno virtual: Si todavía no existe
              - python -m venv venv
     
  3. Activar el entorno virtual: Abrir una terminal de PowerShell
              - venv\Scripts\Activate
     Al activarse correctamente, la terminal mostrará
              - (venv)
  
  4. Instalar las dependencias: Con el entorno virtual activado
              -  pip install -r ./requirements.txt


Configuración del FRONTEND

  1. Entrar a la carpeta FRONTEND: Desde la carpeta principal del proyecto
              -  cd Frontend
     
  2. Instalar las dependencias
              - npm install
     Este comando instala las dependencias definidas en "package.json"

     
  Configuración de PostgreSQL

  El proyecto utiliza PostgreSQL como sistema gestor de Base de Datos y gestionada por pgAdmin.

  1. Crear la base de datos: Desde pgAdmin, se debe crear una base de datos para el proyecto.
        Por ejemplo: "checador"
     
  2. Configurar la conexión: Dentro de la carpeta Backend se debe crear un archivo ".env" con la información de conexión a PostgreSQL.
          Ejemplo:
     " DATABASE_URL=postgresql://postgres:password@localhost:5432/checador
      JWT_SECRET_KEY=CLAVE_SECRETA"

  Los valores deben modificarse de acuerdo con la configuración de PostgreSQL utilizada en el equipo.
  La aplicación obtiene la información de conexión mediante la variable DATABASE_URL.


  Migraciones de la Base de Datos
  
  El proyecto utiliza Flask-Migrate para poder gestionar los cambios en la estructura de la Base de Datos y las 
  migraciones se encuentran dentro de: "Backend/migrations/".
  Ya si es necesario ejecutar migraciones, se debe realizar desde la configuración correspondiente del proyecto


Estructura de la base de datos

  El sistema está organizado mediante diferentes entidades que permiten administrar los usuarios, 
  roles, áreas, rostros, asistencias, horarios y permisos, utilizando PostgreSQL.


Las entidades principales son:

- Entidad Descripción
- Users: Guarda la información de los usuarios que están registrados en el sistema.
- Roles: Definir los roles y niveles de acceso de los usuarios.
- Áreas: Almacena las áreas a las que pertenecen los usuarios.
- Face: Almacena la información relativa a rostros registrados para reconocimiento facial.
- Attendance Registra las entradas y salidas del personal.
- Schedule: Almacena los horarios de trabajo, incluyendo horarios y tolerancias.
- Vacaciones: Guarda los permisos o vacaciones solicitadas por los usuarios.
- Log: Registra información de las actividades realizadas en el sistema.



  Ejecutar BACKEND:

  1. Una vez ya creado y activado el entorno virtual:
           " cd Backend "
           " venv\Scripts\Activate "
     
  2. Después regresar a la carpeta principal
           " cd .. "
     
  3. Finalmente ejecutar
           " python .\run.py "

  4. El BACKEND quedará ejecutándose mediante Flask y la dirección utilizada durante el desarrollo es:
           " http://127.0.0.1:5000 "



  Ejecutar FROTEND:

  1. Desde la carpeta Frontend
           " npx expo start -c "
     El parámetro "-c" es el que permite iniciar Expo limpiando la caché del Metro
     
  3. Después de iniciar Expo se puede ejecutar la aplicación mediante 
           " Expo Go"

     

El resultado es una aplicación que permite un control más organizado de las presencias y 
facilita la gestión de la información relacionada con usuarios, horarios y permisos.


