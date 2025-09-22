import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand
} from '@aws-sdk/lib-dynamodb';
import { Client, CreateClientRequest, UpdateClientRequest } from '@/models/Client';
import { v4 as uuidv4 } from 'uuid';

export class ClientRepository {
  private docClient: DynamoDBDocumentClient;
  private tableName = 'enzel-hub-clients';

  constructor(dynamoClient: DynamoDBClient) {
    this.docClient = DynamoDBDocumentClient.from(dynamoClient);
  }

  async create(clientData: CreateClientRequest): Promise<Client> {
    const now = new Date().toISOString();
    const client: Client = {
      id: uuidv4(),
      name: clientData.name,
      email: clientData.email,
      phone: clientData.phone,
      company: clientData.company,
      status: clientData.status || 'active',
      createdAt: now,
      updatedAt: now
    };

    const command = new PutCommand({
      TableName: this.tableName,
      Item: client,
      ConditionExpression: 'attribute_not_exists(id)'
    });

    await this.docClient.send(command);
    return client;
  }

  async findById(id: string): Promise<Client | null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { id }
    });

    const result = await this.docClient.send(command);
    return result.Item as Client || null;
  }

  async findByEmail(email: string): Promise<Client | null> {
    const command = new ScanCommand({
      TableName: this.tableName,
      FilterExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    });

    const result = await this.docClient.send(command);
    return result.Items?.[0] as Client || null;
  }

  async findAll(): Promise<Client[]> {
    const command = new ScanCommand({
      TableName: this.tableName
    });

    const result = await this.docClient.send(command);
    return result.Items as Client[] || [];
  }

  async update(id: string, updateData: UpdateClientRequest): Promise<Client | null> {
    const existingClient = await this.findById(id);
    if (!existingClient) {
      return null;
    }

    const updateExpression: string[] = [];
    const expressionAttributeValues: any = {};
    const expressionAttributeNames: any = {};

    if (updateData.name !== undefined) {
      updateExpression.push('#name = :name');
      expressionAttributeNames['#name'] = 'name';
      expressionAttributeValues[':name'] = updateData.name;
    }

    if (updateData.email !== undefined) {
      updateExpression.push('email = :email');
      expressionAttributeValues[':email'] = updateData.email;
    }

    if (updateData.phone !== undefined) {
      updateExpression.push('phone = :phone');
      expressionAttributeValues[':phone'] = updateData.phone;
    }

    if (updateData.company !== undefined) {
      updateExpression.push('company = :company');
      expressionAttributeValues[':company'] = updateData.company;
    }

    if (updateData.status !== undefined) {
      updateExpression.push('#status = :status');
      expressionAttributeNames['#status'] = 'status';
      expressionAttributeValues[':status'] = updateData.status;
    }

    updateExpression.push('updatedAt = :updatedAt');
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: { id },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined,
      ReturnValues: 'ALL_NEW'
    });

    const result = await this.docClient.send(command);
    return result.Attributes as Client;
  }

  async delete(id: string): Promise<boolean> {
    const command = new DeleteCommand({
      TableName: this.tableName,
      Key: { id },
      ConditionExpression: 'attribute_exists(id)'
    });

    try {
      await this.docClient.send(command);
      return true;
    } catch (error) {
      if ((error as any).name === 'ConditionalCheckFailedException') {
        return false;
      }
      throw error;
    }
  }
}