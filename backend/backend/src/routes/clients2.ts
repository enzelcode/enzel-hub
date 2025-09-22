import { Router } from 'express';
import { createClient, getClients, getClientById, updateClient, deleteClient } from '../controllers/clientController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Apply auth middleware to all client routes
router.use(authMiddleware);

// GET /api/clients - Get all clients
router.get('/', getClients);

// GET /api/clients/:id - Get specific client
router.get('/:id', getClientById);

// POST /api/clients - Create new client
router.post('/', createClient);

// PUT /api/clients/:id - Update client
router.put('/:id', updateClient);

// DELETE /api/clients/:id - Delete client
router.delete('/:id', deleteClient);

export default router;