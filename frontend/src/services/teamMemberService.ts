import { apiService } from './api';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'developer' | 'designer' | 'manager' | 'qa';
  status: 'active' | 'inactive';
  avatar?: string;
  phone?: string;
  department?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeamMemberData {
  name: string;
  email: string;
  role: 'admin' | 'developer' | 'designer' | 'manager' | 'qa';
  status: 'active' | 'inactive';
  avatar?: string;
  phone?: string;
  department?: string;
}

export interface UpdateTeamMemberData {
  name?: string;
  email?: string;
  role?: 'admin' | 'developer' | 'designer' | 'manager' | 'qa';
  status?: 'active' | 'inactive';
  avatar?: string;
  phone?: string;
  department?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export class TeamMemberService {
  private static baseUrl = '/team-members';

  static async getAllTeamMembers(filters?: {
    role?: string;
    status?: string;
  }): Promise<TeamMember[]> {
    const searchParams = new URLSearchParams();

    if (filters?.role) searchParams.append('role', filters.role);
    if (filters?.status) searchParams.append('status', filters.status);

    const query = searchParams.toString();
    const endpoint = query ? `${this.baseUrl}?${query}` : this.baseUrl;

    const response = await apiService.get<ApiResponse<TeamMember[]>>(endpoint);
    return response.data;
  }

  static async getTeamMemberById(id: string): Promise<TeamMember> {
    const response = await apiService.get<ApiResponse<TeamMember>>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  static async getTeamMemberByEmail(email: string): Promise<TeamMember> {
    const response = await apiService.get<ApiResponse<TeamMember>>(`${this.baseUrl}/email/${email}`);
    return response.data;
  }

  static async createTeamMember(data: CreateTeamMemberData): Promise<TeamMember> {
    const response = await apiService.post<ApiResponse<TeamMember>>(this.baseUrl, data);
    return response.data;
  }

  static async updateTeamMember(id: string, data: UpdateTeamMemberData): Promise<TeamMember> {
    const response = await apiService.put<ApiResponse<TeamMember>>(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  static async deleteTeamMember(id: string): Promise<void> {
    await apiService.delete(`${this.baseUrl}/${id}`);
  }

  static async updateTeamMemberStatus(id: string, status: TeamMember['status']): Promise<TeamMember> {
    const response = await apiService.patch<ApiResponse<TeamMember>>(`${this.baseUrl}/${id}/status`, { status });
    return response.data;
  }
}