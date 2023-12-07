from bs4 import BeautifulSoup
import requests
from constants import FORUM_PATH, EMAIL_SMS_DOMAINS
from models.Post import Post
from db import get_db_conn
from models.User import User
from models.Query import Query
from dotenv import load_dotenv
from emailsender import send
from time import sleep
import logging

load_dotenv()


def get_posts():
    source = requests.get(FORUM_PATH)
    soup = BeautifulSoup(source.content, "html.parser")

    post_html = soup.select("#forum-table > tr")[2:]

    return [Post.from_html(p) for p in post_html]


def check_all_queries():
    posts = get_posts()

    conn = get_db_conn()

    users = [User.from_row(row) for row in conn.execute("SELECT * FROM users")]
    for u in users:
        logging.info(f"Checking queries for user {u.id}")
        queries = [
            Query.from_row(row)
            for row in conn.execute(f"SELECT * FROM queries WHERE userId = {u.id}")
        ]
        for q in queries:
            logging.info(f"Checking query {q.query}")
            for p in posts:
                if p.matches_text(q.query):
                    already_notified = (
                        conn.execute(
                            f"SELECT * FROM notifications WHERE url = '{p.url}'"
                        ).fetchone()
                        is not None
                    )

                    logging.info(
                        f"Post {p.title} matches query {q.query}, {'already notified' if already_notified else 'notifying'}"
                    )

                    if not already_notified:
                        send(
                            f"{u.id}@{EMAIL_SMS_DOMAINS[u.provider]}",
                            f'New result for your query "{q.query}"!',
                        )
                        sleep(1.5)
                        send(f"{u.id}@{EMAIL_SMS_DOMAINS[u.provider]}", p.url[12:])
                        sleep(1.5)
                        conn.execute(
                            f"INSERT INTO notifications (userId, url) VALUES ({u.id}, '{p.url}')"
                        )
                        conn.commit()
