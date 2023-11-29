#!/usr/bin/env bash
# exit on error
set -o errexit
# Activa un entorno virtual de Python
#python3 -m venv venv
#source venv/bin/activate

# Instala las dependencias de tu proyecto
pip install -r requirements.txt

python manage.py makemigrations
# Realiza las migraciones de la base de datos
python manage.py migrate

# Recolecta los archivos estáticos (si es necesario)
#python manage.py collectstatic --no-input

# Inicia la aplicación, Render se encargará de Gunicorn
# No es necesario iniciar Gunicorn manualmente

# Nota: Asegúrate de que tengas un archivo `requirements.txt` válido
# que incluya todas las dependencias necesarias para tu proyecto Django.
