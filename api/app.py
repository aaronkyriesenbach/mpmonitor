from flask import Flask
import sqlite3
from os.path import exists
from flask_cors import CORS
from routes.user import user
from routes.query import query
from constants import db_path

# Initialize DB if it doesn't exist already
if not exists(db_path):
    db = sqlite3.connect(db_path)

    with open("schema.sql") as schema:
        db.executescript(schema.read())
        db.close()

app = Flask(__name__)
CORS(app)

app.register_blueprint(user)
app.register_blueprint(query)
