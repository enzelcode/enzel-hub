import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, ScanCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient({ region: 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  clientId?: string;
  startDate: string;
  endDate?: string;
  budget?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectData {
  name: string;
  description: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  clientId?: string;
  startDate: string;
  endDate?: string;
  budget?: number;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  status?: 'active' | 'completed' | 'paused' | 'cancelled';
  clientId?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
}

export class ProjectModel {
  private static tableName = 'enzel-hub-projects';

  static async create(data: CreateProjectData): Promise<Project> {
    const now = new Date().toISOString();
    const project: Project = {
      id: uuidv4(),
      ...data,
      createdAt: now,
      updatedAt: now
    };

    const command = new PutCommand({
      TableName: this.tableName,
      Item: project
    });

    await docClient.send(command);
    return project;
  }

  static async findById(id: string): Promise<Project | null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { id }
    });

    const result = await docClient.send(command);
    return result.Item as Project || null;
  }

  static async findAll(): Promise<Project[]> {
    const command = new ScanCommand({
      TableName: this.tableName
    });

    const result = await docClient.send(command);
    return result.Items as Project[] || [];
  }

  static async findByStatus(status: Project['status']): Promise<Project[]> {
    const command = new ScanCommand({
      TableName: this.tableName,
      FilterExpression: '#status = :status',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': status
      }
    });

    const result = await docClient.send(command);
    return result.Items as Project[] || [];
  }

  static async findByClient(clientId: string): Promise<Project[]> {
    const command = new ScanCommand({
      TableName: this.tableName,
      FilterExpression: 'clientId = :clientId',
      ExpressionAttributeValues: {
        ':clientId': clientId
      }
    });

    const result = await docClient.send(command);
    return result.Items as Project[] || [];
  }

  static async update(id: string, data: UpdateProjectData): Promise<Project | null> {
    const existingProject = await this.findById(id);
    if (!existingProject) {
      return null;
    }

    const updateExpressions: string[] = [];
    const expressionAttributeValues: Record<string, any> = {};
    const expressionAttributeNames: Record<string, string> = {};

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'status') {
          updateExpressions.push('#status = :status');
          expressionAttributeNames['#status'] = 'status';
          expressionAttributeValues[':status'] = value;
        } else {
          updateExpressions.push(`${key} = :${key}`);
          expressionAttributeValues[`:${key}`] = value;
        }
      }
    });

    updateExpressions.push('updatedAt = :updatedAt');
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: { id },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeValues: expressionAttributeValues,
      ...(Object.keys(expressionAttributeNames).length > 0 && {
        ExpressionAttributeNames: expressionAttributeNames
      }),
      ReturnValues: 'ALL_NEW'
    });

    const result = await docClient.send(command);
    return result.Attributes as Project;
  }

  static async delete(id: string): Promise<boolean> {
    const command = new DeleteCommand({
      TableName: this.tableName,
      Key: { id }
    });

    await docClient.send(command);
    return true;
  }
}