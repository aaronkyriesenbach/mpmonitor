import sqlite3
from constants import db_path


def get_db_conn():
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn
