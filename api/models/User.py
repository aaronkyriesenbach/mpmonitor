from sqlite3 import Row


class User:
    def __init__(self, id, firstName):
        self.id = id
        self.firstName = firstName

    @staticmethod
    def from_row(row: Row):
        return User(row["id"], row["firstName"])
