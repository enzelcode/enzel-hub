import { Router } from 'express';
import { ClientController } from '../controllers/clientController';
import { ClientRepository } from '../repositories/clientRepository';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Instanciar DynamoDB client
const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: process.env.AWS_ACCESS_KEY_ID ? {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  } : undefined
});

// Instanciar repositório e controller
const clientRepository = new ClientRepository(dynamoClient);
const clientController = new ClientController(clientRepository);

// Aplicar middleware de autenticação a todas as rotas
router.use(authenticateToken);

// Definir rotas
router.get('/', (req, res) => clientController.getAllClients(req, res));
router.get('/:id', (req, res) => clientController.getClientById(req, res));
router.post('/', (req, res) => clientController.createClient(req, res));
router.put('/:id', (req, res) => clientController.updateClient(req, res));
router.delete('/:id', (req, res) => clientController.deleteClient(req, res));

export default router;