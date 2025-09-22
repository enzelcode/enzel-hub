import { apiService } from './api';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  clientId?: string;
  startDate: string;
  endDate?: string;
  budget?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectData {
  name: string;
  description: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  clientId?: string;
  startDate: string;
  endDate?: string;
  budget?: number;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  status?: 'active' | 'completed' | 'paused' | 'cancelled';
  clientId?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export class ProjectService {
  private static baseUrl = '/projects';

  static async getAllProjects(filters?: {
    status?: string;
    clientId?: string;
  }): Promise<Project[]> {
    const searchParams = new URLSearchParams();

    if (filters?.status) searchParams.append('status', filters.status);
    if (filters?.clientId) searchParams.append('clientId', filters.clientId);

    const query = searchParams.toString();
    const endpoint = query ? `${this.baseUrl}?${query}` : this.baseUrl;

    const response = await apiService.get<ApiResponse<Project[]>>(endpoint);
    return response.data;
  }

  static async getProjectById(id: string): Promise<Project> {
    const response = await apiService.get<ApiResponse<Project>>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  static async createProject(data: CreateProjectData): Promise<Project> {
    const response = await apiService.post<ApiResponse<Project>>(this.baseUrl, data as Record<string, unknown>);
    return response.data;
  }

  static async updateProject(id: string, data: UpdateProjectData): Promise<Project> {
    const response = await apiService.put<ApiResponse<Project>>(`${this.baseUrl}/${id}`, data as Record<string, unknown>);
    return response.data;
  }

  static async deleteProject(id: string): Promise<void> {
    await apiService.delete(`${this.baseUrl}/${id}`);
  }

  static async updateProjectStatus(id: string, status: Project['status']): Promise<Project> {
    const response = await apiService.patch<ApiResponse<Project>>(`${this.baseUrl}/${id}/status`, { status });
    return response.data;
  }
}