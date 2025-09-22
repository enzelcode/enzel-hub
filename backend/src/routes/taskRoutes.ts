import { Router } from 'express';
import { TaskController } from '../controllers/taskController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET /api/tasks - Get all tasks (with optional filters)
router.get('/', TaskController.getAllTasks);

// GET /api/tasks/:id - Get task by ID
router.get('/:id', TaskController.getTaskById);

// POST /api/tasks - Create new task
router.post('/', TaskController.createTask);

// PUT /api/tasks/:id - Update task
router.put('/:id', TaskController.updateTask);

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', TaskController.deleteTask);

// PATCH /api/tasks/:id/status - Update task status only
router.patch('/:id/status', TaskController.updateTaskStatus);

export default router;