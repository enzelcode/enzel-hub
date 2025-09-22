import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, ScanCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient({ region: 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigneeId: string;
  dueDate: string;
  projectId: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigneeId: string;
  dueDate: string;
  projectId: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assigneeId?: string;
  dueDate?: string;
  projectId?: string;
  status?: 'todo' | 'in-progress' | 'review' | 'done';
}

export class TaskModel {
  private static tableName = 'enzel-hub-tasks';

  static async create(data: CreateTaskData): Promise<Task> {
    const now = new Date().toISOString();
    const task: Task = {
      id: uuidv4(),
      ...data,
      createdAt: now,
      updatedAt: now
    };

    const command = new PutCommand({
      TableName: this.tableName,
      Item: task
    });

    await docClient.send(command);
    return task;
  }

  static async findById(id: string): Promise<Task | null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { id }
    });

    const result = await docClient.send(command);
    return result.Item as Task || null;
  }

  static async findAll(): Promise<Task[]> {
    const command = new ScanCommand({
      TableName: this.tableName
    });

    const result = await docClient.send(command);
    return result.Items as Task[] || [];
  }

  static async findByProject(projectId: string): Promise<Task[]> {
    const command = new ScanCommand({
      TableName: this.tableName,
      FilterExpression: 'projectId = :projectId',
      ExpressionAttributeValues: {
        ':projectId': projectId
      }
    });

    const result = await docClient.send(command);
    return result.Items as Task[] || [];
  }

  static async findByAssignee(assigneeId: string): Promise<Task[]> {
    const command = new ScanCommand({
      TableName: this.tableName,
      FilterExpression: 'assigneeId = :assigneeId',
      ExpressionAttributeValues: {
        ':assigneeId': assigneeId
      }
    });

    const result = await docClient.send(command);
    return result.Items as Task[] || [];
  }

  static async findByStatus(status: Task['status']): Promise<Task[]> {
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
    return result.Items as Task[] || [];
  }

  static async update(id: string, data: UpdateTaskData): Promise<Task | null> {
    const existingTask = await this.findById(id);
    if (!existingTask) {
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
    return result.Attributes as Task;
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