export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  serviceTypes: string[];
  status: 'active' | 'inactive' | 'prospect';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface ServiceType {
  id: string;
  name: string;
  description?: string;
  category: string;
  price?: number;
  duration?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  clientId: string;
  serviceTypeId: string;
  name: string;
  description?: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold' | 'cancelled';
  startDate?: string;
  endDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  budget?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface AuthRequest extends Request {
  user?: User;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}