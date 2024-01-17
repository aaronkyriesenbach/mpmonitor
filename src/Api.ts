import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

const TABLE_NAME = "mpmonitor";

const ddb = new DynamoDBClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});
const client = DynamoDBDocumentClient.from(ddb);

export function getUser(id: string) {
  const cmd = new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: { ":id": id },
  });

  return client.send(cmd);
}

export function getUserByPhone(phone: string) {
  const cmd = new ScanCommand({
    TableName: TABLE_NAME,
    FilterExpression: "phone = :phone",
    ExpressionAttributeValues: { ":phone": phone },
  });

  return client.send(cmd);
}

export function putUser(user: User) {
  const cmd = new PutCommand({
    TableName: TABLE_NAME,
    Item: user,
  });

  return client.send(cmd);
}
