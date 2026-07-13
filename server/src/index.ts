import dotenv from 'dotenv';
// Load environment variables
dotenv.config();

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for local development proxy setup
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routing Middleware
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

// Health Check Route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date(), dbType: process.env.DB_TYPE || 'mongodb' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 CreatorOS Server running on http://localhost:${PORT}`);
});
