import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUserRepository } from '../models/dbAdapter';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkeyforcreatoros2026';

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password, niche } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: 'Please enter all required fields' });
      return;
    }

    const userRepository = getUserRepository();

    // Check if user already exists
    const existingUser = await userRepository.findByEmail(email.toLowerCase());
    if (existingUser) {
      res.status(400).json({ message: 'User already exists with this email' });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await userRepository.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      niche: niche || 'Tech & Productivity',
      profileImage: '',
      apiKey: ''
    });

    // Create JWT
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        niche: newUser.niche,
        profileImage: newUser.profileImage,
        apiKey: newUser.apiKey
      }
    });
  } catch (err: any) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Please enter all required fields' });
      return;
    }

    const userRepository = getUserRepository();

    // Find user
    const user = await userRepository.findByEmail(email.toLowerCase());
    if (!user || !user.password) {
      res.status(400).json({ message: 'Invalid email or password' });
      return;
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid email or password' });
      return;
    }

    // Create JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        niche: user.niche,
        profileImage: user.profileImage,
        apiKey: user.apiKey
      }
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
}

export async function changePassword(req: Request, res: Response) {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = (req as any).user?.id;

    if (!oldPassword || !newPassword) {
      res.status(400).json({ message: 'Please enter old and new passwords' });
      return;
    }

    const userRepository = getUserRepository();
    const user = await userRepository.findById(userId);

    if (!user || !user.password) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Incorrect old password' });
      return;
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await userRepository.update(userId, { password: hashedPassword });

    res.json({ message: 'Password updated successfully' });
  } catch (err: any) {
    console.error('Change password error:', err);
    res.status(500).json({ message: 'Server error while changing password' });
  }
}
