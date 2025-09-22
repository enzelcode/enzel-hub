import dotenv from 'dotenv';
dotenv.config(); // Load environment variables first

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

// AWS Configuration
const region = process.env.AWS_REGION || 'us-east-1';
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

console.log('AWS_REGION:', region);
console.log('AWS_ACCESS_KEY_ID:', accessKeyId);
console.log('AWS_SECRET_ACCESS_KEY length:', secretAccessKey?.length || 0);

if (!accessKeyId || !secretAccessKey) {
  throw new Error('AWS credentials not configured properly');
}

// Create DynamoDB client
const dynamoDBClient = new DynamoDBClient({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

// Create DynamoDB Document client (easier to work with)
export const dynamoClient = DynamoDBDocumentClient.from(dynamoDBClient);

export default dynamoClient;