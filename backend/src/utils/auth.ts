import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../types';
import { UserRepository } from '../repositories/userRepository';

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

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return UserRepository.findByEmail(email);
};

// Initialize Leonardo's user in DynamoDB
export const initializeMockUsers = async () => {
  try {
    // Check if Leonardo already exists
    const existingUser = await UserRepository.findByEmail('leonardo@enzelcode.com');

    if (!existingUser) {
      const hashedPassword = await hashPassword('frizzi090520');
      const leonardoUser: User = {
        id: 'user_leonardo_001',
        email: 'leonardo@enzelcode.com',
        password: hashedPassword,
        name: 'Leonardo',
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await UserRepository.create(leonardoUser);
      console.log('✅ Leonardo user created successfully in DynamoDB');
    } else {
      console.log('⚠️  Leonardo user already exists in DynamoDB');
    }
  } catch (error) {
    console.error('❌ Error initializing Leonardo user:', error);

    // Fallback to mock user if DynamoDB fails
    console.log('🔄 Falling back to mock user database');
    const hashedPassword = await hashPassword('frizzi090520');
    MOCK_USERS[0].password = hashedPassword;
  }
};

// Fallback mock database
export const MOCK_USERS: User[] = [
  {
    id: 'user_leonardo_001',
    email: 'leonardo@enzelcode.com',
    password: '',
    name: 'Leonardo',
    role: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Fallback function for when DynamoDB is not available
export const findUserByEmailMock = (email: string): User | undefined => {
  return MOCK_USERS.find(user => user.email === email);
};