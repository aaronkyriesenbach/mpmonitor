from bs4 import Tag, BeautifulSoup
import requests


class Post:
    def __init__(self, url, title, content):
        self.url = url
        self.title = title
        self.content = content

    def __str__(self):
        return f"URL = {self.url}, title = {self.title}, content = {self.content[0] if len(self.content) > 0 else None}"

    def matches_text(self, text: str):
        return text in self.title or any(text in t for t in self.content)

    @staticmethod
    def from_html(html: Tag):
        url_tag = html.select_one("a")
        title_tag = url_tag.select_one("strong")

        url = url_tag.attrs["href"]
        title = title_tag.contents[0].lower()

        post_source = requests.get(url)
        post_html = BeautifulSoup(post_source.content, "html.parser")

        content_html = post_html.select_one("table > .message-row")
        text_html = content_html.select("p")

        contents = []
        for p in text_html:
            for text in p:
                try:
                    contents.append(text.lower())
                except:
                    pass

        return Post(url, title, contents)
