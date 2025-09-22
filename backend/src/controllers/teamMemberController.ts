import { Request, Response } from 'express';
import { TeamMemberModel, CreateTeamMemberData, UpdateTeamMemberData } from '../models/TeamMember';

export class TeamMemberController {
  // GET /api/team-members
  static async getAllTeamMembers(req: Request, res: Response) {
    try {
      const { role, status } = req.query;

      let teamMembers;

      if (role) {
        teamMembers = await TeamMemberModel.findByRole(role as any);
      } else if (status) {
        teamMembers = await TeamMemberModel.findByStatus(status as any);
      } else {
        teamMembers = await TeamMemberModel.findAll();
      }

      res.json({
        success: true,
        data: teamMembers
      });
    } catch (error) {
      console.error('Error fetching team members:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch team members'
      });
    }
  }

  // GET /api/team-members/:id
  static async getTeamMemberById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const teamMember = await TeamMemberModel.findById(id);

      if (!teamMember) {
        return res.status(404).json({
          success: false,
          error: 'Team member not found'
        });
      }

      res.json({
        success: true,
        data: teamMember
      });
    } catch (error) {
      console.error('Error fetching team member:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch team member'
      });
    }
  }

  // GET /api/team-members/email/:email
  static async getTeamMemberByEmail(req: Request, res: Response) {
    try {
      const { email } = req.params;
      const teamMember = await TeamMemberModel.findByEmail(email);

      if (!teamMember) {
        return res.status(404).json({
          success: false,
          error: 'Team member not found'
        });
      }

      res.json({
        success: true,
        data: teamMember
      });
    } catch (error) {
      console.error('Error fetching team member by email:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch team member'
      });
    }
  }

  // POST /api/team-members
  static async createTeamMember(req: Request, res: Response) {
    try {
      const teamMemberData: CreateTeamMemberData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role || 'developer',
        status: req.body.status || 'active',
        avatar: req.body.avatar,
        phone: req.body.phone,
        department: req.body.department
      };

      // Validate required fields
      if (!teamMemberData.name || !teamMemberData.email) {
        return res.status(400).json({
          success: false,
          error: 'Name and email are required'
        });
      }

      // Check if email already exists
      const existingMember = await TeamMemberModel.findByEmail(teamMemberData.email);
      if (existingMember) {
        return res.status(409).json({
          success: false,
          error: 'Email already exists'
        });
      }

      const teamMember = await TeamMemberModel.create(teamMemberData);

      res.status(201).json({
        success: true,
        data: teamMember
      });
    } catch (error) {
      console.error('Error creating team member:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create team member'
      });
    }
  }

  // PUT /api/team-members/:id
  static async updateTeamMember(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData: UpdateTeamMemberData = {};

      // Only include fields that are provided
      if (req.body.name !== undefined) updateData.name = req.body.name;
      if (req.body.email !== undefined) updateData.email = req.body.email;
      if (req.body.role !== undefined) updateData.role = req.body.role;
      if (req.body.status !== undefined) updateData.status = req.body.status;
      if (req.body.avatar !== undefined) updateData.avatar = req.body.avatar;
      if (req.body.phone !== undefined) updateData.phone = req.body.phone;
      if (req.body.department !== undefined) updateData.department = req.body.department;

      // If email is being updated, check if it already exists
      if (updateData.email) {
        const existingMember = await TeamMemberModel.findByEmail(updateData.email);
        if (existingMember && existingMember.id !== id) {
          return res.status(409).json({
            success: false,
            error: 'Email already exists'
          });
        }
      }

      const teamMember = await TeamMemberModel.update(id, updateData);

      if (!teamMember) {
        return res.status(404).json({
          success: false,
          error: 'Team member not found'
        });
      }

      res.json({
        success: true,
        data: teamMember
      });
    } catch (error) {
      console.error('Error updating team member:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update team member'
      });
    }
  }

  // DELETE /api/team-members/:id
  static async deleteTeamMember(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Check if team member exists
      const existingMember = await TeamMemberModel.findById(id);
      if (!existingMember) {
        return res.status(404).json({
          success: false,
          error: 'Team member not found'
        });
      }

      await TeamMemberModel.delete(id);

      res.json({
        success: true,
        message: 'Team member deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting team member:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete team member'
      });
    }
  }

  // PATCH /api/team-members/:id/status
  static async updateTeamMemberStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status || !['active', 'inactive'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Valid status is required (active, inactive)'
        });
      }

      const teamMember = await TeamMemberModel.update(id, { status });

      if (!teamMember) {
        return res.status(404).json({
          success: false,
          error: 'Team member not found'
        });
      }

      res.json({
        success: true,
        data: teamMember
      });
    } catch (error) {
      console.error('Error updating team member status:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update team member status'
      });
    }
  }
}