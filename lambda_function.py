import os
from dataclasses import dataclass, asdict
from re import findall

import boto3
import requests
from bs4 import BeautifulSoup, Tag
from dotenv import load_dotenv
from twilio.rest import Client

load_dotenv()

client = boto3.resource(
    "dynamodb",
    region_name="us-east-1",
    aws_access_key_id=os.environ["VITE_AWS_ACCESS_KEY_ID"],
    aws_secret_access_key=os.environ["VITE_AWS_SECRET_ACCESS_KEY"],
)
table = client.Table("mpmonitor")

twilio_client = Client(
    os.environ["TWILIO_API_KEY"],
    os.environ["TWILIO_API_SECRET"],
    os.environ["TWILIO_ACCOUNT_SID"],
)

FORUM_PATH = (
    "https://www.mountainproject.com/forum/103989416/for-sale-for-free-want-to-buy"
)


class Post:
    def __init__(self, url, title, content):
        self.url: str = url
        self.title: str = title
        self.content: list[str] = content

        self.id = findall("\d{9}", url)[0]

    def __str__(self):
        return f"ID = {self.id}, URL = {self.url}, title = {self.title}, content = {self.content[0] if len(self.content) > 0 else None}"

    def matches_text(self, text: str):
        return text.lower() in self.title.lower() or any(
            text.lower() in t for t in [c.lower() for c in self.content]
        )

    @staticmethod
    def from_html(html: Tag):
        url_tag = html.select_one("a")
        title_tag = url_tag.select_one("strong")

        url = url_tag.attrs["href"]
        title = title_tag.contents[0]

        post_source = requests.get(url)
        post_html = BeautifulSoup(post_source.content, "html.parser")

        content_html = post_html.select_one("table > .message-row")

        contents = []
        if content_html:
            text_html = content_html.select("p")

            for p in text_html:
                for text in p:
                    try:
                        contents.append(text)
                    except:
                        pass

            contents = [c for c in contents if type(c) is str]

        return Post(url, title, contents)


@dataclass
class User:
    id: str = None
    name: str = None
    phone: str = None
    queries: list[str] = None
    notified: list[str] = None


def get_posts():
    source = requests.get(FORUM_PATH)
    soup = BeautifulSoup(source.content, "html.parser")

    post_html = soup.select("#forum-table > tr")[2:]

    return [Post.from_html(p) for p in post_html]


def lambda_handler(event, lambda_context):
    posts = get_posts()

    user_scan = table.scan()
    users: list[User] = [User(**u) for u in user_scan["Items"]]

    for u in users:
        print(f"Checking queries for user {u.id}")
        for q in u.queries if u.queries else []:
            print(f"Checking query {q}")

            for p in posts:
                if p.matches_text(q):
                    already_notified = p.id in u.notified if u.notified else False

                    print(
                        f"Post \"{p.title}\" with ID {p.id} matches query \"{q}\", {'already notified' if already_notified else 'notifying'}"
                    )

                    if not already_notified:
                        twilio_client.messages.create(
                            messaging_service_sid=os.environ[
                                "TWILIO_MESSAGING_SERVICE_SID"
                            ],
                            body=f'New result for query "{q}": {p.url}',
                            to=u.phone,
                        )
                        u.notified = [*u.notified, p.id] if u.notified else [p.id]

        table.put_item(Item=asdict(u))
