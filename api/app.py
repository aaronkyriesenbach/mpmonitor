from flask import Flask
import sqlite3
from os.path import exists
from flask_cors import CORS

import scraper
from routes.user import user
from routes.query import query
from constants import DB_PATH
from apscheduler.schedulers.background import BackgroundScheduler

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

scheduler = BackgroundScheduler()
scheduler.add_job(scraper.check_all_queries, 'interval', minutes=1)
scheduler.start()