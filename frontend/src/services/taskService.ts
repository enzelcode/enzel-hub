import { apiService } from './api';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigneeId: string;
  dueDate: string;
  projectId: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigneeId: string;
  dueDate: string;
  projectId: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assigneeId?: string;
  dueDate?: string;
  projectId?: string;
  status?: 'todo' | 'in-progress' | 'review' | 'done';
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export class TaskService {
  private static baseUrl = '/tasks';

  static async getAllTasks(filters?: {
    projectId?: string;
    assigneeId?: string;
    status?: string;
  }): Promise<Task[]> {
    const searchParams = new URLSearchParams();

    if (filters?.projectId) searchParams.append('projectId', filters.projectId);
    if (filters?.assigneeId) searchParams.append('assigneeId', filters.assigneeId);
    if (filters?.status) searchParams.append('status', filters.status);

    const query = searchParams.toString();
    const endpoint = query ? `${this.baseUrl}?${query}` : this.baseUrl;

    const response = await apiService.get<ApiResponse<Task[]>>(endpoint);
    return response.data;
  }

  static async getTaskById(id: string): Promise<Task> {
    const response = await apiService.get<ApiResponse<Task>>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  static async createTask(data: CreateTaskData): Promise<Task> {
    const response = await apiService.post<ApiResponse<Task>>(this.baseUrl, data);
    return response.data;
  }

  static async updateTask(id: string, data: UpdateTaskData): Promise<Task> {
    const response = await apiService.put<ApiResponse<Task>>(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  static async deleteTask(id: string): Promise<void> {
    await apiService.delete(`${this.baseUrl}/${id}`);
  }

  static async updateTaskStatus(id: string, status: Task['status']): Promise<Task> {
    const response = await apiService.patch<ApiResponse<Task>>(`${this.baseUrl}/${id}/status`, { status });
    return response.data;
  }
}