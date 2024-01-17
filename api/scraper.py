from bs4 import BeautifulSoup
import requests
from constants import FORUM_PATH
from models.Post import Post
from db import get_db_conn
from models.User import User
from models.Query import Query
from dotenv import load_dotenv
import os
from twilio.rest import Client

load_dotenv()


def get_posts():
    source = requests.get(FORUM_PATH)
    soup = BeautifulSoup(source.content, "html.parser")

    post_html = soup.select("#forum-table > tr")[2:]

    return [Post.from_html(p) for p in post_html]


def check_all_queries():
    posts = get_posts()

    twilio_client = Client(
        os.environ["TWILIO_API_KEY"],
        os.environ["TWILIO_API_SECRET"],
        os.environ["TWILIO_ACCOUNT_SID"]
    )

    conn = get_db_conn()

    users = [User.from_row(row) for row in conn.execute("SELECT * FROM users")]
    for u in users:
        print(f"Checking queries for user {u.id}")
        queries = [
            Query.from_row(row)
            for row in conn.execute(f"SELECT * FROM queries WHERE userId = {u.id}")
        ]
        for q in queries:
            print(f"Checking query {q.query}")
            for p in posts:
                if p.matches_text(q.query):
                    print(f"Post {p.title} matches query {q.query}")

                    already_notified = (
                        conn.execute(
                            f"SELECT * FROM notifications WHERE url = '{p.url}'"
                        ).fetchone()
                        is not None
                    )

                    if not already_notified:
                        print("Notifying")
                        twilio_client.messages.create(
                            messaging_service_sid=os.environ[
                                "TWILIO_MESSAGING_SERVICE_SID"
                            ],
                            body=f'New result for query "{q.query}": {p.url}',
                            to=u.id,
                        )
                        conn.execute(
                            f"INSERT INTO notifications (userId, url) VALUES ({u.id}, '{p.url}')"
                        )
                        conn.commit()


check_all_queries()
