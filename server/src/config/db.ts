import mongoose from 'mongoose';
import { Pool } from 'pg';
import { initializeDatabase } from '../models/dbAdapter';

export async function connectDB() {
  const dbType = process.env.DB_TYPE || 'mongodb';
  const dbUrl = process.env.DATABASE_URL || '';

  console.log(`📡 Connecting to database (${dbType})...`);

  if (dbType === 'postgres') {
    try {
      const pool = new Pool({
        connectionString: dbUrl,
        connectionTimeoutMillis: 3000
      });

      // Test connection
      await pool.query('SELECT NOW()');
      console.log('✅ PostgreSQL Connected.');

      // Initialize table if it doesn't exist
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          niche VARCHAR(255) DEFAULT 'Tech & Productivity',
          profile_image VARCHAR(255) DEFAULT '',
          api_key TEXT DEFAULT '',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
      await pool.query(createTableQuery);
      console.log('✅ PostgreSQL Users table verified.');

      initializeDatabase('postgres', dbUrl, pool);
    } catch (err: any) {
      console.error('❌ PostgreSQL Connection Error:', err.message);
      console.warn('⚠️ Falling back to In-Memory Database for local development.');
      initializeDatabase('memory', '');
    }
  } else {
    // Default to MongoDB
    try {
      await mongoose.connect(dbUrl, {
        serverSelectionTimeoutMS: 3000,
        connectTimeoutMS: 3000,
      });
      console.log('✅ MongoDB Connected.');
      initializeDatabase('mongodb', dbUrl);
    } catch (err: any) {
      console.error('❌ MongoDB Connection Error:', err.message);
      console.warn('⚠️ Falling back to In-Memory Database for local development.');
      initializeDatabase('memory', '');
    }
  }
}
