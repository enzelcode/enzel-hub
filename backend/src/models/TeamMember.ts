import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, ScanCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient({ region: 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'developer' | 'designer' | 'manager' | 'qa';
  status: 'active' | 'inactive';
  avatar?: string;
  phone?: string;
  department?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeamMemberData {
  name: string;
  email: string;
  role: 'admin' | 'developer' | 'designer' | 'manager' | 'qa';
  status: 'active' | 'inactive';
  avatar?: string;
  phone?: string;
  department?: string;
}

export interface UpdateTeamMemberData {
  name?: string;
  email?: string;
  role?: 'admin' | 'developer' | 'designer' | 'manager' | 'qa';
  status?: 'active' | 'inactive';
  avatar?: string;
  phone?: string;
  department?: string;
}

export class TeamMemberModel {
  private static tableName = 'enzel-hub-team-members';

  static async create(data: CreateTeamMemberData): Promise<TeamMember> {
    const now = new Date().toISOString();
    const teamMember: TeamMember = {
      id: uuidv4(),
      ...data,
      createdAt: now,
      updatedAt: now
    };

    const command = new PutCommand({
      TableName: this.tableName,
      Item: teamMember
    });

    await docClient.send(command);
    return teamMember;
  }

  static async findById(id: string): Promise<TeamMember | null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { id }
    });

    const result = await docClient.send(command);
    return result.Item as TeamMember || null;
  }

  static async findAll(): Promise<TeamMember[]> {
    const command = new ScanCommand({
      TableName: this.tableName
    });

    const result = await docClient.send(command);
    return result.Items as TeamMember[] || [];
  }

  static async findByRole(role: TeamMember['role']): Promise<TeamMember[]> {
    const command = new ScanCommand({
      TableName: this.tableName,
      FilterExpression: '#role = :role',
      ExpressionAttributeNames: {
        '#role': 'role'
      },
      ExpressionAttributeValues: {
        ':role': role
      }
    });

    const result = await docClient.send(command);
    return result.Items as TeamMember[] || [];
  }

  static async findByStatus(status: TeamMember['status']): Promise<TeamMember[]> {
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
    return result.Items as TeamMember[] || [];
  }

  static async findByEmail(email: string): Promise<TeamMember | null> {
    const command = new ScanCommand({
      TableName: this.tableName,
      FilterExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    });

    const result = await docClient.send(command);
    const items = result.Items as TeamMember[] || [];
    return items.length > 0 ? items[0] : null;
  }

  static async update(id: string, data: UpdateTeamMemberData): Promise<TeamMember | null> {
    const existingMember = await this.findById(id);
    if (!existingMember) {
      return null;
    }

    const updateExpressions: string[] = [];
    const expressionAttributeValues: Record<string, any> = {};
    const expressionAttributeNames: Record<string, string> = {};

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'role' || key === 'status') {
          updateExpressions.push(`#${key} = :${key}`);
          expressionAttributeNames[`#${key}`] = key;
          expressionAttributeValues[`:${key}`] = value;
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
    return result.Attributes as TeamMember;
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