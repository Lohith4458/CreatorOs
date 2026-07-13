import { Request, Response } from 'express';
import { getUserRepository } from '../models/dbAdapter';
import cloudinary from '../config/cloudinary';

// Helper to upload a buffer to Cloudinary
function uploadToCloudinary(fileBuffer: Buffer, mimeType: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    // Check if Cloudinary is configured
    if (!cloudName || cloudName === 'your_cloud_name') {
      console.warn('⚠️ Cloudinary not configured. Falling back to Base64 URI.');
      const base64Image = fileBuffer.toString('base64');
      const dataUri = `data:${mimeType};base64,${base64Image}`;
      resolve(dataUri);
      return;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'creatoros_profiles',
        transformation: [{ width: 300, height: 300, crop: 'fill' }]
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else if (result) {
          resolve(result.secure_url);
        } else {
          reject(new Error('Unknown error during Cloudinary upload'));
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
}

export async function getProfile(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const userRepository = getUserRepository();
    const user = await userRepository.findById(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      niche: user.niche,
      profileImage: user.profileImage,
      apiKey: user.apiKey
    });
  } catch (err: any) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
}

export async function updateProfile(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const { name, niche, apiKey } = req.body;

    const updates: any = {};
    if (name !== undefined) updates.name = name;
    if (niche !== undefined) updates.niche = niche;
    if (apiKey !== undefined) updates.apiKey = apiKey;

    const userRepository = getUserRepository();
    const updatedUser = await userRepository.update(userId, updates);

    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      niche: updatedUser.niche,
      profileImage: updatedUser.profileImage,
      apiKey: updatedUser.apiKey
    });
  } catch (err: any) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error updating profile' });
  }
}

export async function uploadProfileImage(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;

    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    // Upload buffer to Cloudinary (or fallback base64 URI)
    const imageUrl = await uploadToCloudinary(req.file.buffer, req.file.mimetype);

    // Save image URL to DB
    const userRepository = getUserRepository();
    const updatedUser = await userRepository.update(userId, { profileImage: imageUrl });

    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({
      message: 'Profile image uploaded successfully',
      profileImage: imageUrl
    });
  } catch (err: any) {
    console.error('Upload profile image error:', err);
    res.status(500).json({ message: 'Server error uploading profile image' });
  }
}

export async function deleteProfile(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const userRepository = getUserRepository();

    const success = await userRepository.delete(userId);
    if (!success) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ message: 'Account deleted successfully' });
  } catch (err: any) {
    console.error('Delete profile error:', err);
    res.status(500).json({ message: 'Server error deleting account' });
  }
}
