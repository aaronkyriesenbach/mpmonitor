# Mountain Project Monitor

Application that notifies users when posts matching user-defined
criteria are created on the Mountain Project for sale forum.

Frontend is built on React + TypeScript. Backend was originally
built as a Flask API utilizing a small SQLite database, but I
realized that it made more sense to implement a serverless backend
on AWS using DynamoDB for data and a Lamba to check queries against MP.

Future improvements to be made:

- Create a better UI
- Implement some form of 2-factor authentication for login
