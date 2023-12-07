from sqlite3 import Row
from constants import Provider


class User:
    def __init__(self, id, firstName, provider):
        self.id: str = id
        self.firstName: str = firstName
        self.provider: Provider = provider

    @staticmethod
    def from_row(row: Row):
        return User(row["id"], row["firstName"], row["provider"])
