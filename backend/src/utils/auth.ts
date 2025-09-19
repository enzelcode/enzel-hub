import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const generateToken = (user: Omit<User, 'password'>): string => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
  );
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// Mock user database - Leonardo's account
export const MOCK_USERS: User[] = [
  {
    id: 'user_leonardo_001',
    email: 'leonardo@enzelcode.com',
    password: '', // Will be set with hashed password
    name: 'Leonardo',
    role: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Initialize Leonardo's hashed password
export const initializeMockUsers = async () => {
  const hashedPassword = await hashPassword('frizzi090520');
  MOCK_USERS[0].password = hashedPassword;
};

export const findUserByEmail = (email: string): User | undefined => {
  return MOCK_USERS.find(user => user.email === email);
};