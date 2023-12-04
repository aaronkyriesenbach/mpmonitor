from flask import Flask
import sqlite3
from os.path import exists
from flask_cors import CORS
from routes.user import user
from routes.query import query
from constants import DB_PATH

# Initialize DB if it doesn't exist already
if not exists(DB_PATH):
    db = sqlite3.connect(DB_PATH)

    with open("schema.sql") as schema:
        db.executescript(schema.read())
        db.close()

app = Flask(__name__)
CORS(app)

app.register_blueprint(user)
app.register_blueprint(query)
