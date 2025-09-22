import {
  CreateTableCommand,
  DescribeTableCommand,
  DynamoDBClient,
  ResourceInUseException,
  ResourceNotFoundException
} from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDbClient, TABLE_NAMES } from "../services/dynamodb";
import { hashPassword } from "../utils/auth";
import dotenv from 'dotenv';

dotenv.config();

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const createTable = async (tableName: string, keySchema: any[], attributeDefinitions: any[]) => {
  try {
    const command = new CreateTableCommand({
      TableName: tableName,
      KeySchema: keySchema,
      AttributeDefinitions: attributeDefinitions,
      BillingMode: 'PAY_PER_REQUEST',
    });

    await client.send(command);
    console.log(`✅ Table ${tableName} created successfully`);
  } catch (error) {
    if (error instanceof ResourceInUseException) {
      console.log(`⚠️  Table ${tableName} already exists`);
    } else {
      console.error(`❌ Error creating table ${tableName}:`, error);
      throw error;
    }
  }
};

const waitForTable = async (tableName: string) => {
  let attempts = 0;
  const maxAttempts = 30;

  while (attempts < maxAttempts) {
    try {
      const command = new DescribeTableCommand({ TableName: tableName });
      const response = await client.send(command);

      if (response.Table?.TableStatus === 'ACTIVE') {
        console.log(`✅ Table ${tableName} is active`);
        return;
      }

      console.log(`⏳ Waiting for table ${tableName} to become active...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      attempts++;
    } catch (error) {
      if (error instanceof ResourceNotFoundException) {
        console.log(`⏳ Table ${tableName} not found yet, waiting...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        attempts++;
      } else {
        throw error;
      }
    }
  }

  throw new Error(`Timeout waiting for table ${tableName} to become active`);
};

const setupTables = async () => {
  console.log('🚀 Setting up DynamoDB tables...');

  // Users table
  await createTable(
    TABLE_NAMES.USERS,
    [{ AttributeName: 'id', KeyType: 'HASH' }],
    [{ AttributeName: 'id', AttributeType: 'S' }]
  );

  // Clients table
  await createTable(
    TABLE_NAMES.CLIENTS,
    [{ AttributeName: 'id', KeyType: 'HASH' }],
    [{ AttributeName: 'id', AttributeType: 'S' }]
  );

  // Service Types table
  await createTable(
    TABLE_NAMES.SERVICE_TYPES,
    [{ AttributeName: 'id', KeyType: 'HASH' }],
    [{ AttributeName: 'id', AttributeType: 'S' }]
  );

  // Projects table
  await createTable(
    TABLE_NAMES.PROJECTS,
    [{ AttributeName: 'id', KeyType: 'HASH' }],
    [{ AttributeName: 'id', AttributeType: 'S' }]
  );

  // Wait for all tables to be active
  console.log('⏳ Waiting for tables to become active...');
  await Promise.all([
    waitForTable(TABLE_NAMES.USERS),
    waitForTable(TABLE_NAMES.CLIENTS),
    waitForTable(TABLE_NAMES.SERVICE_TYPES),
    waitForTable(TABLE_NAMES.PROJECTS),
  ]);

  console.log('✅ All tables are ready!');
};

const seedData = async () => {
  console.log('🌱 Seeding initial data...');

  // Create Leonardo's user
  const hashedPassword = await hashPassword('frizzi090520');
  const leonardoUser = {
    id: 'user_leonardo_001',
    email: 'leonardo@enzelcode.com',
    password: hashedPassword,
    name: 'Leonardo',
    role: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  try {
    await dynamoDbClient.send(new PutCommand({
      TableName: TABLE_NAMES.USERS,
      Item: leonardoUser
    }));
    console.log('✅ Leonardo user created successfully');
  } catch (error) {
    console.error('❌ Error creating Leonardo user:', error);
  }

  // Create some sample service types
  const serviceTypes = [
    {
      id: 'service_web_development',
      name: 'Desenvolvimento Web',
      description: 'Criação de sites e aplicações web',
      category: 'Desenvolvimento',
      price: 5000,
      duration: 40,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'service_mobile_app',
      name: 'Aplicativo Mobile',
      description: 'Desenvolvimento de apps iOS e Android',
      category: 'Desenvolvimento',
      price: 8000,
      duration: 60,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'service_consulting',
      name: 'Consultoria Tech',
      description: 'Consultoria em tecnologia e arquitetura',
      category: 'Consultoria',
      price: 200,
      duration: 2,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  for (const serviceType of serviceTypes) {
    try {
      await dynamoDbClient.send(new PutCommand({
        TableName: TABLE_NAMES.SERVICE_TYPES,
        Item: serviceType
      }));
      console.log(`✅ Service type "${serviceType.name}" created`);
    } catch (error) {
      console.error(`❌ Error creating service type "${serviceType.name}":`, error);
    }
  }

  console.log('✅ Initial data seeded successfully!');
};

const main = async () => {
  try {
    await setupTables();
    await seedData();
    console.log('🎉 Database setup completed successfully!');
  } catch (error) {
    console.error('💥 Database setup failed:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  main();
}

export { setupTables, seedData };