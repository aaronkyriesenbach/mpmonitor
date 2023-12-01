from sqlite3 import Row


class Query:
    def __init__(self, id, userId, query):
        self.id = id
        self.userId = userId
        self.query = query

    @staticmethod
    def from_row(row: Row):
        return Query(row["id"], row["userId"], row["query"])
