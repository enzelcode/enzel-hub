import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { CreateTableCommand, DescribeTableCommand, waitUntilTableExists } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({ region: 'us-east-1' });

async function createTasksTable() {
  const command = new CreateTableCommand({
    TableName: 'enzel-hub-tasks',
    KeySchema: [
      {
        AttributeName: 'id',
        KeyType: 'HASH'
      }
    ],
    AttributeDefinitions: [
      {
        AttributeName: 'id',
        AttributeType: 'S'
      }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  });

  try {
    await client.send(command);
    console.log('✅ Tasks table created successfully');
  } catch (error: any) {
    if (error.name === 'ResourceInUseException') {
      console.log('ℹ️ Tasks table already exists');
    } else {
      console.error('❌ Error creating tasks table:', error);
      throw error;
    }
  }
}

async function createProjectsTable() {
  const command = new CreateTableCommand({
    TableName: 'enzel-hub-projects',
    KeySchema: [
      {
        AttributeName: 'id',
        KeyType: 'HASH'
      }
    ],
    AttributeDefinitions: [
      {
        AttributeName: 'id',
        AttributeType: 'S'
      }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  });

  try {
    await client.send(command);
    console.log('✅ Projects table created successfully');
  } catch (error: any) {
    if (error.name === 'ResourceInUseException') {
      console.log('ℹ️ Projects table already exists');
    } else {
      console.error('❌ Error creating projects table:', error);
      throw error;
    }
  }
}

async function createTeamMembersTable() {
  const command = new CreateTableCommand({
    TableName: 'enzel-hub-team-members',
    KeySchema: [
      {
        AttributeName: 'id',
        KeyType: 'HASH'
      }
    ],
    AttributeDefinitions: [
      {
        AttributeName: 'id',
        AttributeType: 'S'
      }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  });

  try {
    await client.send(command);
    console.log('✅ Team members table created successfully');
  } catch (error: any) {
    if (error.name === 'ResourceInUseException') {
      console.log('ℹ️ Team members table already exists');
    } else {
      console.error('❌ Error creating team members table:', error);
      throw error;
    }
  }
}

async function seedData() {
  console.log('🌱 Seeding initial data...');

  // Import models for seeding
  const { ProjectModel } = await import('../models/Project');
  const { TeamMemberModel } = await import('../models/TeamMember');
  const { TaskModel } = await import('../models/Task');

  try {
    // Seed projects
    const projects = await Promise.all([
      ProjectModel.create({
        name: 'Website Corporativo',
        description: 'Desenvolvimento do novo site da empresa',
        status: 'active',
        startDate: '2024-01-01'
      }),
      ProjectModel.create({
        name: 'E-commerce',
        description: 'Plataforma de vendas online',
        status: 'active',
        startDate: '2024-01-15'
      }),
      ProjectModel.create({
        name: 'API Backend',
        description: 'API REST para integração de sistemas',
        status: 'active',
        startDate: '2024-02-01'
      }),
      ProjectModel.create({
        name: 'Mobile App',
        description: 'Aplicativo mobile nativo',
        status: 'paused',
        startDate: '2024-03-01'
      }),
      ProjectModel.create({
        name: 'Dashboard Admin',
        description: 'Painel administrativo interno',
        status: 'active',
        startDate: '2024-02-15'
      })
    ]);

    console.log('✅ Projects seeded successfully');

    // Seed team members
    const teamMembers = await Promise.all([
      TeamMemberModel.create({
        name: 'João Silva',
        email: 'joao@enzelcode.com',
        role: 'developer',
        status: 'active',
        department: 'Desenvolvimento'
      }),
      TeamMemberModel.create({
        name: 'Maria Santos',
        email: 'maria@enzelcode.com',
        role: 'designer',
        status: 'active',
        department: 'Design'
      }),
      TeamMemberModel.create({
        name: 'Pedro Costa',
        email: 'pedro@enzelcode.com',
        role: 'developer',
        status: 'active',
        department: 'Desenvolvimento'
      }),
      TeamMemberModel.create({
        name: 'Ana Oliveira',
        email: 'ana@enzelcode.com',
        role: 'qa',
        status: 'active',
        department: 'Qualidade'
      }),
      TeamMemberModel.create({
        name: 'Carlos Lima',
        email: 'carlos@enzelcode.com',
        role: 'manager',
        status: 'active',
        department: 'Gestão'
      })
    ]);

    console.log('✅ Team members seeded successfully');

    // Seed tasks
    await Promise.all([
      TaskModel.create({
        title: 'Implementar autenticação JWT',
        description: 'Criar sistema de login e registro com JWT tokens',
        priority: 'high',
        assigneeId: teamMembers[0].id, // João Silva
        dueDate: '2024-01-15',
        projectId: projects[0].id, // Website Corporativo
        status: 'todo'
      }),
      TaskModel.create({
        title: 'Design da homepage',
        description: 'Criar layout responsivo para a página inicial',
        priority: 'medium',
        assigneeId: teamMembers[1].id, // Maria Santos
        dueDate: '2024-01-12',
        projectId: projects[1].id, // E-commerce
        status: 'in-progress'
      }),
      TaskModel.create({
        title: 'Configurar banco de dados',
        description: 'Setup do PostgreSQL e migrations iniciais',
        priority: 'urgent',
        assigneeId: teamMembers[2].id, // Pedro Costa
        dueDate: '2024-01-10',
        projectId: projects[2].id, // API Backend
        status: 'review'
      }),
      TaskModel.create({
        title: 'Testes unitários',
        description: 'Implementar testes para módulos principais',
        priority: 'low',
        assigneeId: teamMembers[3].id, // Ana Oliveira
        dueDate: '2024-01-20',
        projectId: projects[0].id, // Website Corporativo
        status: 'done'
      }),
      TaskModel.create({
        title: 'Deploy em produção',
        description: 'Configurar CI/CD e fazer deploy na AWS',
        priority: 'high',
        assigneeId: teamMembers[4].id, // Carlos Lima
        dueDate: '2024-01-18',
        projectId: projects[2].id, // API Backend
        status: 'todo'
      })
    ]);

    console.log('✅ Tasks seeded successfully');
    console.log('🎉 All data seeded successfully!');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  }
}

async function waitForTable(tableName: string) {
  console.log(`⏳ Waiting for table ${tableName} to be ready...`);
  try {
    await waitUntilTableExists(
      { client, maxWaitTime: 60 },
      { TableName: tableName }
    );
    console.log(`✅ Table ${tableName} is ready`);
  } catch (error) {
    console.error(`❌ Error waiting for table ${tableName}:`, error);
    throw error;
  }
}

async function setupKanbanTables() {
  try {
    console.log('🚀 Setting up Kanban tables...');

    // Create tables
    await createTasksTable();
    await createProjectsTable();
    await createTeamMembersTable();

    // Wait for all tables to be ready
    await Promise.all([
      waitForTable('enzel-hub-tasks'),
      waitForTable('enzel-hub-projects'),
      waitForTable('enzel-hub-team-members')
    ]);

    console.log('🎯 All tables are ready! Starting data seeding...');

    // Seed initial data
    await seedData();

    console.log('✨ Kanban setup completed successfully!');
  } catch (error) {
    console.error('💥 Setup failed:', error);
    process.exit(1);
  }
}

// Run the setup if this script is executed directly
if (require.main === module) {
  setupKanbanTables();
}

export { setupKanbanTables };