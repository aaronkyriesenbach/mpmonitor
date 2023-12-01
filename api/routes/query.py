from db import get_db_conn
from flask import Blueprint


query = Blueprint("query", __name__)


@query.route("/query/<int:queryId>", methods=["DELETE"])
def delete_query(queryId):
    conn = get_db_conn()
    conn.execute(f"DELETE FROM queries WHERE id = {queryId}")
    conn.commit()
    conn.close()
    return "Success", 200
