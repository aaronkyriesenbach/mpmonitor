DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS queries;

CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    firstName TEXT NOT NULL
);

CREATE TABLE queries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    query TEXT NOT NULL,
    userId INTEGER NOT NULL
);

CREATE TABLE notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    userId INTEGER NOT NULL
);