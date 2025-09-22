import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, ScanCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { Client, CreateClientRequest, UpdateClientRequest } from '../models/Client';
import { dynamoClient } from '../services/dynamodb';

const TABLE_NAME = 'Users'; // Using the same table as users for now

export class ClientRepository {
  private client: DynamoDBDocumentClient;

  constructor() {
    this.client = dynamoClient;
  }

  async create(clientData: CreateClientRequest): Promise<Client> {
    const client: Client = {
      id: uuidv4(),
      name: clientData.name,
      email: clientData.email,
      phone: clientData.phone,
      company: clientData.company,
      status: clientData.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        ...client,
        type: 'client' // Add type to differentiate from users
      }
    });

    await this.client.send(command);
    return client;
  }

  async findById(id: string): Promise<Client | null> {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: { id }
    });

    const result = await this.client.send(command);

    if (!result.Item || result.Item.type !== 'client') {
      return null;
    }

    const { type, ...client } = result.Item;
    return client as Client;
  }

  async findByEmail(email: string): Promise<Client | null> {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: 'email = :email AND #type = :type',
      ExpressionAttributeValues: {
        ':email': email,
        ':type': 'client'
      },
      ExpressionAttributeNames: {
        '#type': 'type'
      }
    });

    const result = await this.client.send(command);

    if (!result.Items || result.Items.length === 0) {
      return null;
    }

    const { type, ...client } = result.Items[0];
    return client as Client;
  }

  async findAll(): Promise<Client[]> {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: '#type = :type',
      ExpressionAttributeValues: {
        ':type': 'client'
      },
      ExpressionAttributeNames: {
        '#type': 'type'
      }
    });

    const result = await this.client.send(command);

    if (!result.Items) {
      return [];
    }

    return result.Items.map(item => {
      const { type, ...client } = item;
      return client as Client;
    });
  }

  async update(id: string, updateData: UpdateClientRequest): Promise<Client | null> {
    // First check if client exists
    const existingClient = await this.findById(id);
    if (!existingClient) {
      return null;
    }

    const updateExpression: string[] = [];
    const expressionAttributeValues: any = {};
    const expressionAttributeNames: any = {};

    // Build update expression dynamically
    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined) {
        updateExpression.push(`#${key} = :${key}`);
        expressionAttributeValues[`:${key}`] = value;
        expressionAttributeNames[`#${key}`] = key;
      }
    });

    // Always update the updatedAt field
    updateExpression.push('#updatedAt = :updatedAt');
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();
    expressionAttributeNames['#updatedAt'] = 'updatedAt';

    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: expressionAttributeNames,
      ReturnValues: 'ALL_NEW'
    });

    const result = await this.client.send(command);

    if (!result.Attributes) {
      return null;
    }

    const { type, ...client } = result.Attributes;
    return client as Client;
  }

  async delete(id: string): Promise<boolean> {
    const command = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { id },
      ConditionExpression: '#type = :type',
      ExpressionAttributeValues: {
        ':type': 'client'
      },
      ExpressionAttributeNames: {
        '#type': 'type'
      }
    });

    try {
      await this.client.send(command);
      return true;
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        return false; // Client doesn't exist or is not a client
      }
      throw error;
    }
  }
}