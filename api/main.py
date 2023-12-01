from flask import Flask, request, jsonify
import sqlite3
import json
from os.path import exists
from models.User import User
from models.Query import Query
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

db_path = "database.db"

# Initialize DB if it doesn't exist already
if not exists(db_path):
    db = sqlite3.connect(db_path)

    with open("schema.sql") as schema:
        db.executescript(schema.read())
        db.close()


def get_db_conn():
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn


@app.route("/user/<int:id>", methods=["GET"])
def get_user(id):
    conn = get_db_conn()

    user = conn.execute(f"SELECT firstName FROM users WHERE id = {id}").fetchone()
    conn.close()

    if user and user["firstName"]:
        return user["firstName"], 200
    else:
        return "User not found", 404


@app.route("/user/<int:id>", methods=["POST"])
def add_user(id):
    args = request.get_json()

    if not args["firstName"]:
        return "Missing firstName", 400
    else:
        conn = get_db_conn()
        conn.execute(
            f"INSERT INTO users (id, firstName) VALUES ({id}, '{args['firstName']}')"
        )
        conn.commit()
        conn.close()
        return f"User {id} created", 201


@app.route("/user", methods=["GET"])
def get_users():
    conn = get_db_conn()
    users: list[User] = [
        User(*row) for row in conn.execute("SELECT * FROM users").fetchall()
    ]
    conn.close()
    return [json.dumps(u.__dict__) for u in users], 200


@app.route("/user/<int:userId>/queries", methods=["POST"])
def add_user_query(userId):
    args = request.get_json()

    if not args["query"]:
        return "Missing query", 400
    else:
        conn = get_db_conn()
        conn.execute(
            f"INSERT INTO queries (userId, query) VALUES ({userId}, '{args['query']}')"
        )
        new_query = conn.execute(
            f"SELECT * FROM queries WHERE userId = {userId} AND query = '{args['query']}'"
        ).fetchone()
        new_query = Query.from_row(new_query)
        conn.commit()
        conn.close()
        return json.dumps(new_query.__dict__), 201


@app.route("/user/<int:userId>/queries", methods=["GET"])
def get_user_queries(userId):
    conn = get_db_conn()
    queries: list[Query] = [
        json.dumps(Query.from_row(q).__dict__)
        for q in conn.execute(
            f"SELECT * FROM queries WHERE userId = {userId}"
        ).fetchall()
    ]
    conn.close()
    return queries, 200


@app.route("/user/<int:userId>/queries/<int:queryId>", methods=["DELETE"])
def delete_query(userId, queryId):
    conn = get_db_conn()
    conn.execute(f"DELETE FROM queries WHERE id = {queryId}")
    conn.commit()
    conn.close()
    return "Success", 200
