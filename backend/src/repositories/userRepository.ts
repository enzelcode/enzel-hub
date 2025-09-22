import { GetCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDbClient, TABLE_NAMES } from "../services/dynamodb";
import { User } from "../types";

export class UserRepository {
  static async findById(id: string): Promise<User | null> {
    try {
      const command = new GetCommand({
        TableName: TABLE_NAMES.USERS,
        Key: { id }
      });

      const result = await dynamoDbClient.send(command);
      return result.Item as User || null;
    } catch (error) {
      console.error('Error finding user by id:', error);
      throw error;
    }
  }

  static async findByEmail(email: string): Promise<User | null> {
    try {
      const command = new ScanCommand({
        TableName: TABLE_NAMES.USERS,
        FilterExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': email.toLowerCase()
        }
      });

      const result = await dynamoDbClient.send(command);
      return result.Items?.[0] as User || null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  static async create(user: User): Promise<User> {
    try {
      const command = new PutCommand({
        TableName: TABLE_NAMES.USERS,
        Item: user
      });

      await dynamoDbClient.send(command);
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async findAll(): Promise<User[]> {
    try {
      const command = new ScanCommand({
        TableName: TABLE_NAMES.USERS
      });

      const result = await dynamoDbClient.send(command);
      return result.Items as User[] || [];
    } catch (error) {
      console.error('Error finding all users:', error);
      throw error;
    }
  }
}