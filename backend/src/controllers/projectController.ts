import { Request, Response } from 'express';
import { ProjectModel, CreateProjectData, UpdateProjectData } from '../models/Project';

export class ProjectController {
  // GET /api/projects
  static async getAllProjects(req: Request, res: Response) {
    try {
      const { status, clientId } = req.query;

      let projects;

      if (status) {
        projects = await ProjectModel.findByStatus(status as any);
      } else if (clientId) {
        projects = await ProjectModel.findByClient(clientId as string);
      } else {
        projects = await ProjectModel.findAll();
      }

      res.json({
        success: true,
        data: projects
      });
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch projects'
      });
    }
  }

  // GET /api/projects/:id
  static async getProjectById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const project = await ProjectModel.findById(id);

      if (!project) {
        return res.status(404).json({
          success: false,
          error: 'Project not found'
        });
      }

      res.json({
        success: true,
        data: project
      });
    } catch (error) {
      console.error('Error fetching project:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch project'
      });
    }
  }

  // POST /api/projects
  static async createProject(req: Request, res: Response) {
    try {
      const projectData: CreateProjectData = {
        name: req.body.name,
        description: req.body.description || '',
        status: req.body.status || 'active',
        clientId: req.body.clientId,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        budget: req.body.budget
      };

      // Validate required fields
      if (!projectData.name || !projectData.startDate) {
        return res.status(400).json({
          success: false,
          error: 'Name and startDate are required'
        });
      }

      const project = await ProjectModel.create(projectData);

      res.status(201).json({
        success: true,
        data: project
      });
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create project'
      });
    }
  }

  // PUT /api/projects/:id
  static async updateProject(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData: UpdateProjectData = {};

      // Only include fields that are provided
      if (req.body.name !== undefined) updateData.name = req.body.name;
      if (req.body.description !== undefined) updateData.description = req.body.description;
      if (req.body.status !== undefined) updateData.status = req.body.status;
      if (req.body.clientId !== undefined) updateData.clientId = req.body.clientId;
      if (req.body.startDate !== undefined) updateData.startDate = req.body.startDate;
      if (req.body.endDate !== undefined) updateData.endDate = req.body.endDate;
      if (req.body.budget !== undefined) updateData.budget = req.body.budget;

      const project = await ProjectModel.update(id, updateData);

      if (!project) {
        return res.status(404).json({
          success: false,
          error: 'Project not found'
        });
      }

      res.json({
        success: true,
        data: project
      });
    } catch (error) {
      console.error('Error updating project:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update project'
      });
    }
  }

  // DELETE /api/projects/:id
  static async deleteProject(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Check if project exists
      const existingProject = await ProjectModel.findById(id);
      if (!existingProject) {
        return res.status(404).json({
          success: false,
          error: 'Project not found'
        });
      }

      await ProjectModel.delete(id);

      res.json({
        success: true,
        message: 'Project deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete project'
      });
    }
  }

  // PATCH /api/projects/:id/status
  static async updateProjectStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status || !['active', 'completed', 'paused', 'cancelled'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Valid status is required (active, completed, paused, cancelled)'
        });
      }

      const project = await ProjectModel.update(id, { status });

      if (!project) {
        return res.status(404).json({
          success: false,
          error: 'Project not found'
        });
      }

      res.json({
        success: true,
        data: project
      });
    } catch (error) {
      console.error('Error updating project status:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update project status'
      });
    }
  }
}