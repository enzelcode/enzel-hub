import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import authRoutes from './routes/auth';
import clientRoutes from './routes/clients2';
import { userRepository } from './repositories/userRepository';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3003'],
  credentials: true
}));

app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Enzel Hub API'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);

// Initialize Leonardo user
const initializeLeonardoUser = async () => {
  try {
    const existingUser = await userRepository.findByEmail('leonardo@enzelcode.com');

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('frizzi090520', 10);
      await userRepository.create({
        name: 'Leonardo Enzel',
        email: 'leonardo@enzelcode.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('✅ Leonardo user created successfully');
    } else {
      console.log('⚠️  Leonardo user already exists in DynamoDB');
    }
  } catch (error) {
    console.error('❌ Error initializing Leonardo user:', error);
  }
};

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Enzel Hub API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth endpoint: http://localhost:${PORT}/api/auth/login`);
  console.log(`👥 Clients endpoint: http://localhost:${PORT}/api/clients`);

  // Initialize Leonardo user
  await initializeLeonardoUser();
});

export default app;