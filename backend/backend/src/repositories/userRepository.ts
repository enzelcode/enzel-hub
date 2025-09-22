import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { dynamoClient } from '../services/dynamodb';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role?: string;
}

class UserRepository {
  private client: DynamoDBDocumentClient;
  private tableName = 'Users';

  constructor() {
    this.client = dynamoClient;
  }

  async create(userData: CreateUserRequest): Promise<User> {
    const user: User = {
      id: uuidv4(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role || 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        ...user,
        type: 'user' // Add type to differentiate from clients
      }
    });

    await this.client.send(command);
    return user;
  }

  async findById(id: string): Promise<User | null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { id }
    });

    const result = await this.client.send(command);

    if (!result.Item || result.Item.type !== 'user') {
      return null;
    }

    const { type, ...user } = result.Item;
    return user as User;
  }

  async findByEmail(email: string): Promise<User | null> {
    const command = new ScanCommand({
      TableName: this.tableName,
      FilterExpression: 'email = :email AND #type = :type',
      ExpressionAttributeValues: {
        ':email': email,
        ':type': 'user'
      },
      ExpressionAttributeNames: {
        '#type': 'type'
      }
    });

    const result = await this.client.send(command);

    if (!result.Items || result.Items.length === 0) {
      return null;
    }

    const { type, ...user } = result.Items[0];
    return user as User;
  }

  async findAll(): Promise<User[]> {
    const command = new ScanCommand({
      TableName: this.tableName,
      FilterExpression: '#type = :type',
      ExpressionAttributeValues: {
        ':type': 'user'
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
      const { type, ...user } = item;
      return user as User;
    });
  }
}

export const userRepository = new UserRepository();