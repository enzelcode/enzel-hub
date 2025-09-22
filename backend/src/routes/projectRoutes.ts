import { Router } from 'express';
import { ProjectController } from '../controllers/projectController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET /api/projects - Get all projects (with optional filters)
router.get('/', ProjectController.getAllProjects);

// GET /api/projects/:id - Get project by ID
router.get('/:id', ProjectController.getProjectById);

// POST /api/projects - Create new project
router.post('/', ProjectController.createProject);

// PUT /api/projects/:id - Update project
router.put('/:id', ProjectController.updateProject);

// DELETE /api/projects/:id - Delete project
router.delete('/:id', ProjectController.deleteProject);

// PATCH /api/projects/:id/status - Update project status only
router.patch('/:id/status', ProjectController.updateProjectStatus);

export default router;