export interface UserProfile {
  id: string;
  name: string;
  email: string;
  niche?: string;
  profileImage?: string;
  apiKey?: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

const API_BASE = '/api';

// Helper to get auth headers
function getHeaders(contentType?: string) {
  const token = localStorage.getItem('creatoros_token');
  const headers: HeadersInit = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  
  return headers;
}

export const api = {
  // Auth API
  async register(userData: { name: string; email: string; password?: string; niche?: string }): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  async login(credentials: { email: string; password?: string }): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  async changePassword(passwords: { oldPassword?: string; newPassword?: string }): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: getHeaders('application/json'),
      body: JSON.stringify(passwords)
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Password update failed');
    return data;
  },

  // Profile API
  async getProfile(): Promise<UserProfile> {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch profile');
    return data;
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: getHeaders('application/json'),
      body: JSON.stringify(updates)
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update profile');
    return data;
  },

  async uploadProfileImage(file: File): Promise<{ message: string; profileImage: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`${API_BASE}/profile/image`, {
      method: 'POST',
      headers: getHeaders(), // Multer boundary is automatically set by browser when body is FormData, so no 'Content-Type' header here
      body: formData
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Image upload failed');
    return data;
  },

  async deleteAccount(): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete account');
    return data;
  }
};
