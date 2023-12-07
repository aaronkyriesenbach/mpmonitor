from flask import Flask
import sqlite3
from os.path import exists
from flask_cors import CORS
from routes.user import user
from routes.query import query
from constants import DB_PATH
from scraper import check_all_queries
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
import logging

logging.basicConfig(filename="log.txt", encoding="utf-8", level=logging.INFO)
logging.info(f"Starting up at {datetime.now()}")


# Initialize DB if it doesn't exist already
if not exists(DB_PATH):
    logging.info(f"No database exists, creating...")
    db = sqlite3.connect(DB_PATH)

    with open("schema.sql") as schema:
        db.executescript(schema.read())
        db.close()

app = Flask(__name__)
CORS(app)

app.register_blueprint(user)
app.register_blueprint(query)

scheduler = BackgroundScheduler()
scheduler.add_job(check_all_queries, "interval", minutes=1)
scheduler.start()
logging.info("Query check job added; scheduler started")
