import { Request, Response } from 'express';
import { TaskModel, CreateTaskData, UpdateTaskData } from '../models/Task';

export class TaskController {
  // GET /api/tasks
  static async getAllTasks(req: Request, res: Response) {
    try {
      const { projectId, assigneeId, status } = req.query;

      let tasks;

      if (projectId) {
        tasks = await TaskModel.findByProject(projectId as string);
      } else if (assigneeId) {
        tasks = await TaskModel.findByAssignee(assigneeId as string);
      } else if (status) {
        tasks = await TaskModel.findByStatus(status as any);
      } else {
        tasks = await TaskModel.findAll();
      }

      res.json({
        success: true,
        data: tasks
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch tasks'
      });
    }
  }

  // GET /api/tasks/:id
  static async getTaskById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const task = await TaskModel.findById(id);

      if (!task) {
        return res.status(404).json({
          success: false,
          error: 'Task not found'
        });
      }

      res.json({
        success: true,
        data: task
      });
    } catch (error) {
      console.error('Error fetching task:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch task'
      });
    }
  }

  // POST /api/tasks
  static async createTask(req: Request, res: Response) {
    try {
      const taskData: CreateTaskData = {
        title: req.body.title,
        description: req.body.description || '',
        priority: req.body.priority || 'medium',
        assigneeId: req.body.assigneeId,
        dueDate: req.body.dueDate,
        projectId: req.body.projectId,
        status: req.body.status || 'todo'
      };

      // Validate required fields
      if (!taskData.title || !taskData.assigneeId || !taskData.projectId) {
        return res.status(400).json({
          success: false,
          error: 'Title, assigneeId, and projectId are required'
        });
      }

      const task = await TaskModel.create(taskData);

      res.status(201).json({
        success: true,
        data: task
      });
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create task'
      });
    }
  }

  // PUT /api/tasks/:id
  static async updateTask(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData: UpdateTaskData = {};

      // Only include fields that are provided
      if (req.body.title !== undefined) updateData.title = req.body.title;
      if (req.body.description !== undefined) updateData.description = req.body.description;
      if (req.body.priority !== undefined) updateData.priority = req.body.priority;
      if (req.body.assigneeId !== undefined) updateData.assigneeId = req.body.assigneeId;
      if (req.body.dueDate !== undefined) updateData.dueDate = req.body.dueDate;
      if (req.body.projectId !== undefined) updateData.projectId = req.body.projectId;
      if (req.body.status !== undefined) updateData.status = req.body.status;

      const task = await TaskModel.update(id, updateData);

      if (!task) {
        return res.status(404).json({
          success: false,
          error: 'Task not found'
        });
      }

      res.json({
        success: true,
        data: task
      });
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update task'
      });
    }
  }

  // DELETE /api/tasks/:id
  static async deleteTask(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Check if task exists
      const existingTask = await TaskModel.findById(id);
      if (!existingTask) {
        return res.status(404).json({
          success: false,
          error: 'Task not found'
        });
      }

      await TaskModel.delete(id);

      res.json({
        success: true,
        message: 'Task deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete task'
      });
    }
  }

  // PATCH /api/tasks/:id/status
  static async updateTaskStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status || !['todo', 'in-progress', 'review', 'done'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Valid status is required (todo, in-progress, review, done)'
        });
      }

      const task = await TaskModel.update(id, { status });

      if (!task) {
        return res.status(404).json({
          success: false,
          error: 'Task not found'
        });
      }

      res.json({
        success: true,
        data: task
      });
    } catch (error) {
      console.error('Error updating task status:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update task status'
      });
    }
  }
}