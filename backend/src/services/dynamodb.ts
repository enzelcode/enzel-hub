import dotenv from 'dotenv';
dotenv.config();

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Debug credentials
console.log('AWS_REGION:', process.env.AWS_REGION);
console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID);
console.log('AWS_SECRET_ACCESS_KEY length:', process.env.AWS_SECRET_ACCESS_KEY?.length);

// Validate credentials exist
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error('AWS credentials are missing. Please check your .env file.');
}

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID.trim(),
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY.trim(),
  },
});

export const dynamoDbClient = DynamoDBDocumentClient.from(client);

export const TABLE_NAMES = {
  USERS: `${process.env.DYNAMODB_TABLE_PREFIX || "enzel-hub"}-users`,
  CLIENTS: `${process.env.DYNAMODB_TABLE_PREFIX || "enzel-hub"}-clients`,
  SERVICE_TYPES: `${process.env.DYNAMODB_TABLE_PREFIX || "enzel-hub"}-service-types`,
  PROJECTS: `${process.env.DYNAMODB_TABLE_PREFIX || "enzel-hub"}-projects`,
};