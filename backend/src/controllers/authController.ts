import { Request, Response } from 'express';
import { ApiResponse } from '../types';
import { generateToken, comparePassword, findUserByEmail } from '../utils/auth';

interface LoginRequest {
  email: string;
  password: string;
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Validate input
    if (!email || !password) {
      const response: ApiResponse = {
        success: false,
        error: 'Email and password are required'
      };
      res.status(400).json(response);
      return;
    }

    // Find user
    const user = findUserByEmail(email.toLowerCase());
    if (!user) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid credentials'
      };
      res.status(401).json(response);
      return;
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid credentials'
      };
      res.status(401).json(response);
      return;
    }

    // Generate token
    const userWithoutPassword = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    const token = generateToken(userWithoutPassword);

    const response: ApiResponse = {
      success: true,
      data: {
        user: userWithoutPassword,
        token
      },
      message: 'Login successful'
    };

    res.json(response);
  } catch (error) {
    console.error('Login error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error'
    };
    res.status(500).json(response);
  }
};

export const me = (req: any, res: Response): void => {
  const response: ApiResponse = {
    success: true,
    data: req.user,
    message: 'User data retrieved successfully'
  };
  res.json(response);
};