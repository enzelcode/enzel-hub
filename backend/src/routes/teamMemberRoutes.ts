import { Router } from 'express';
import { TeamMemberController } from '../controllers/teamMemberController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET /api/team-members - Get all team members (with optional filters)
router.get('/', TeamMemberController.getAllTeamMembers);

// GET /api/team-members/:id - Get team member by ID
router.get('/:id', TeamMemberController.getTeamMemberById);

// GET /api/team-members/email/:email - Get team member by email
router.get('/email/:email', TeamMemberController.getTeamMemberByEmail);

// POST /api/team-members - Create new team member
router.post('/', TeamMemberController.createTeamMember);

// PUT /api/team-members/:id - Update team member
router.put('/:id', TeamMemberController.updateTeamMember);

// DELETE /api/team-members/:id - Delete team member
router.delete('/:id', TeamMemberController.deleteTeamMember);

// PATCH /api/team-members/:id/status - Update team member status only
router.patch('/:id/status', TeamMemberController.updateTeamMemberStatus);

export default router;