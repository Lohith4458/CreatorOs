import mongoose, { Schema, Document } from 'mongoose';
import { Pool } from 'pg';

export interface IUser {
  id?: string;
  name: string;
  email: string;
  password?: string;
  niche?: string;
  profileImage?: string;
  apiKey?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// ----------------------------------------------------
// MongoDB Implementation (Mongoose)
// ----------------------------------------------------
interface IUserDocument extends Document, Omit<IUser, 'id'> {
  _id: mongoose.Types.ObjectId;
}

const UserSchema = new Schema<IUserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  niche: { type: String, default: 'Tech & Productivity' },
  profileImage: { type: String, default: '' },
  apiKey: { type: String, default: '' }
}, {
  timestamps: true
});

const MongoUserModel = (mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema)) as mongoose.Model<IUserDocument>;

class MongoUserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    const doc = await MongoUserModel.findOne({ email }).lean() as any;
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      password: doc.password,
      niche: doc.niche,
      profileImage: doc.profileImage,
      apiKey: doc.apiKey,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }

  async findById(id: string): Promise<IUser | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const doc = await MongoUserModel.findById(id).lean() as any;
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      password: doc.password,
      niche: doc.niche,
      profileImage: doc.profileImage,
      apiKey: doc.apiKey,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }

  async create(user: IUser): Promise<IUser> {
    const doc = await MongoUserModel.create(user) as any;
    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      niche: doc.niche,
      profileImage: doc.profileImage,
      apiKey: doc.apiKey,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }

  async update(id: string, updates: Partial<IUser>): Promise<IUser | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const doc = await MongoUserModel.findByIdAndUpdate(id, { $set: updates }, { new: true }).lean() as any;
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      niche: doc.niche,
      profileImage: doc.profileImage,
      apiKey: doc.apiKey,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }

  async delete(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;
    const result = await MongoUserModel.findByIdAndDelete(id);
    return !!result;
  }
}

// ----------------------------------------------------
// PostgreSQL Implementation (pg Pool)
// ----------------------------------------------------
class PostgresUserRepository {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const result = await this.pool.query(
      'SELECT id, name, email, password, niche, profile_image as "profileImage", api_key as "apiKey", created_at as "createdAt", updated_at as "updatedAt" FROM users WHERE email = $1',
      [email]
    );
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return {
      ...row,
      id: String(row.id)
    };
  }

  async findById(id: string): Promise<IUser | null> {
    const result = await this.pool.query(
      'SELECT id, name, email, password, niche, profile_image as "profileImage", api_key as "apiKey", created_at as "createdAt", updated_at as "updatedAt" FROM users WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return {
      ...row,
      id: String(row.id)
    };
  }

  async create(user: IUser): Promise<IUser> {
    const result = await this.pool.query(
      'INSERT INTO users (name, email, password, niche, profile_image, api_key) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, niche, profile_image as "profileImage", api_key as "apiKey", created_at as "createdAt", updated_at as "updatedAt"',
      [
        user.name,
        user.email,
        user.password,
        user.niche || 'Tech & Productivity',
        user.profileImage || '',
        user.apiKey || ''
      ]
    );
    const row = result.rows[0];
    return {
      ...row,
      id: String(row.id)
    };
  }

  async update(id: string, updates: Partial<IUser>): Promise<IUser | null> {
    // Dynamically build the SQL update query
    const keys = Object.keys(updates).filter(k => k !== 'id' && k !== 'createdAt' && k !== 'updatedAt');
    if (keys.length === 0) return this.findById(id);

    const setClauses: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    keys.forEach(key => {
      let columnName = key;
      if (key === 'profileImage') columnName = 'profile_image';
      if (key === 'apiKey') columnName = 'api_key';

      setClauses.push(`${columnName} = $${paramIndex}`);
      values.push((updates as any)[key]);
      paramIndex++;
    });

    // Add updated_at
    setClauses.push(`updated_at = NOW()`);

    values.push(id);
    const query = `UPDATE users SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING id, name, email, niche, profile_image as "profileImage", api_key as "apiKey", created_at as "createdAt", updated_at as "updatedAt"`;

    const result = await this.pool.query(query, values);
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return {
      ...row,
      id: String(row.id)
    };
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.pool.query('DELETE FROM users WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}

// ----------------------------------------------------
// In-Memory Fallback Implementation
// ----------------------------------------------------
class MemoryUserRepository {
  private users: Map<string, IUser> = new Map();
  private currentId = 1;

  async findByEmail(email: string): Promise<IUser | null> {
    for (const user of this.users.values()) {
      if (user.email === email.toLowerCase()) {
        return { ...user };
      }
    }
    return null;
  }

  async findById(id: string): Promise<IUser | null> {
    const user = this.users.get(id);
    if (!user) return null;
    return { ...user };
  }

  async create(user: IUser): Promise<IUser> {
    const id = String(this.currentId++);
    const newUser = {
      ...user,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, newUser);
    return { ...newUser };
  }

  async update(id: string, updates: Partial<IUser>): Promise<IUser | null> {
    const user = this.users.get(id);
    if (!user) return null;
    const updated = {
      ...user,
      ...updates,
      updatedAt: new Date()
    };
    this.users.set(id, updated);
    return { ...updated };
  }

  async delete(id: string): Promise<boolean> {
    return this.users.delete(id);
  }
}

// ----------------------------------------------------
// Exporting the Adapter Factory
// ----------------------------------------------------
export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
  create(user: IUser): Promise<IUser>;
  update(id: string, updates: Partial<IUser>): Promise<IUser | null>;
  delete(id: string): Promise<boolean>;
}

let dbInstance: IUserRepository;
let pgPoolInstance: Pool | null = null;

export function initializeDatabase(dbType: string, connectionString: string, pgPool?: Pool): IUserRepository {
  if (dbType === 'postgres') {
    const pool = pgPool || new Pool({ connectionString });
    pgPoolInstance = pool;
    dbInstance = new PostgresUserRepository(pool);
  } else if (dbType === 'memory') {
    dbInstance = new MemoryUserRepository();
  } else {
    dbInstance = new MongoUserRepository();
  }
  return dbInstance;
}

export function getUserRepository(): IUserRepository {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call initializeDatabase first.');
  }
  return dbInstance;
}

export function getPgPool(): Pool | null {
  return pgPoolInstance;
}
