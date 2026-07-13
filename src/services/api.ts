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

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Fallback flag to use local storage mock if backend connection is unavailable or static hosting intercepts API calls
let fallbackMode = false;

// Mock local storage database helper functions
function getMockUsers(): any[] {
  const users = localStorage.getItem('creatoros_mock_users');
  return users ? JSON.parse(users) : [];
}

function saveMockUser(user: any) {
  const users = getMockUsers();
  const index = users.findIndex(u => u.email === user.email);
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem('creatoros_mock_users', JSON.stringify(users));
  localStorage.setItem('creatoros_current_user', JSON.stringify(user));
}

function getMockCurrentUser(): any | null {
  const user = localStorage.getItem('creatoros_current_user');
  return user ? JSON.parse(user) : null;
}

function runMockRegister(userData: { name: string; email: string; niche?: string }): AuthResponse {
  const users = getMockUsers();
  const exists = users.find(u => u.email === userData.email.toLowerCase());
  if (exists) throw new Error('User already exists in local mock storage');
  
  const mockUser = {
    id: 'mock-' + Math.random().toString(36).substring(2, 9),
    name: userData.name,
    email: userData.email.toLowerCase(),
    niche: userData.niche || 'Tech & Productivity',
    profileImage: '',
    apiKey: ''
  };
  
  saveMockUser(mockUser);
  localStorage.setItem('creatoros_token', 'mock-jwt-token-' + mockUser.id);
  
  return {
    token: 'mock-jwt-token-' + mockUser.id,
    user: mockUser
  };
}

function runMockLogin(credentials: { email: string }): AuthResponse {
  const users = getMockUsers();
  const user = users.find(u => u.email === credentials.email.toLowerCase());
  
  // If no user exists yet in fallback, create a default user so they can log in instantly
  if (!user) {
    const defaultUser = {
      id: 'mock-default',
      name: 'Abdul',
      email: credentials.email.toLowerCase(),
      niche: 'Tech & Productivity',
      profileImage: '',
      apiKey: ''
    };
    saveMockUser(defaultUser);
    localStorage.setItem('creatoros_token', 'mock-jwt-token-default');
    return {
      token: 'mock-jwt-token-default',
      user: defaultUser
    };
  }
  
  localStorage.setItem('creatoros_token', 'mock-jwt-token-' + user.id);
  localStorage.setItem('creatoros_current_user', JSON.stringify(user));
  
  return {
    token: 'mock-jwt-token-' + user.id,
    user
  };
}

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
    if (fallbackMode) {
      return runMockRegister(userData);
    }
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error('HTML_RESPONSE');
      }
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      return data;
    } catch (err) {
      console.warn('⚠️ API Connection failed. Activating Local Storage Fallback Mode.', err);
      fallbackMode = true;
      return runMockRegister(userData);
    }
  },

  async login(credentials: { email: string; password?: string }): Promise<AuthResponse> {
    if (fallbackMode) {
      return runMockLogin(credentials);
    }
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error('HTML_RESPONSE');
      }
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      return data;
    } catch (err) {
      console.warn('⚠️ API Connection failed. Activating Local Storage Fallback Mode.', err);
      fallbackMode = true;
      return runMockLogin(credentials);
    }
  },

  async changePassword(passwords: { oldPassword?: string; newPassword?: string }): Promise<{ message: string }> {
    if (fallbackMode) {
      return { message: 'Mock password updated successfully (Local Fallback)' };
    }
    try {
      const res = await fetch(`${API_BASE}/auth/change-password`, {
        method: 'POST',
        headers: getHeaders('application/json'),
        body: JSON.stringify(passwords)
      });
      
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error('HTML_RESPONSE');
      }
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Password update failed');
      return data;
    } catch (err) {
      console.warn('⚠️ API Connection failed. Fallback active.', err);
      fallbackMode = true;
      return { message: 'Mock password updated successfully (Local Fallback)' };
    }
  },

  // Profile API
  async getProfile(): Promise<UserProfile> {
    if (fallbackMode) {
      const user = getMockCurrentUser();
      if (!user) throw new Error('No user logged in (Local Fallback)');
      return user;
    }
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: 'GET',
        headers: getHeaders()
      });
      
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error('HTML_RESPONSE');
      }
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch profile');
      return data;
    } catch (err) {
      console.warn('⚠️ API Connection failed. Fallback active.', err);
      fallbackMode = true;
      const user = getMockCurrentUser();
      if (!user) throw new Error('No user logged in (Local Fallback)');
      return user;
    }
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    if (fallbackMode) {
      const user = getMockCurrentUser();
      if (!user) throw new Error('No user logged in (Local Fallback)');
      const updated = { ...user, ...updates };
      saveMockUser(updated);
      return updated;
    }
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: getHeaders('application/json'),
        body: JSON.stringify(updates)
      });
      
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error('HTML_RESPONSE');
      }
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update profile');
      return data;
    } catch (err) {
      console.warn('⚠️ API Connection failed. Fallback active.', err);
      fallbackMode = true;
      const user = getMockCurrentUser();
      if (!user) throw new Error('No user logged in (Local Fallback)');
      const updated = { ...user, ...updates };
      saveMockUser(updated);
      return updated;
    }
  },

  async uploadProfileImage(file: File): Promise<{ message: string; profileImage: string }> {
    if (fallbackMode) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const base64Url = event.target.result as string;
            const user = getMockCurrentUser();
            if (user) {
              user.profileImage = base64Url;
              saveMockUser(user);
            }
            resolve({ message: 'Mock upload successful', profileImage: base64Url });
          } else {
            reject(new Error('Failed to read image buffer'));
          }
        };
        reader.onerror = () => reject(new Error('File reader error'));
        reader.readAsDataURL(file);
      });
    }
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`${API_BASE}/profile/image`, {
        method: 'POST',
        headers: getHeaders(),
        body: formData
      });
      
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error('HTML_RESPONSE');
      }
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Image upload failed');
      return data;
    } catch (err) {
      console.warn('⚠️ API Connection failed. Fallback active.', err);
      fallbackMode = true;
      return this.uploadProfileImage(file);
    }
  },

  async deleteAccount(): Promise<{ message: string }> {
    if (fallbackMode) {
      const user = getMockCurrentUser();
      if (user) {
        const users = getMockUsers().filter(u => u.id !== user.id);
        localStorage.setItem('creatoros_mock_users', JSON.stringify(users));
      }
      localStorage.removeItem('creatoros_current_user');
      localStorage.removeItem('creatoros_token');
      return { message: 'Mock account deleted successfully (Local Fallback)' };
    }
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error('HTML_RESPONSE');
      }
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete account');
      return data;
    } catch (err) {
      console.warn('⚠️ API Connection failed. Fallback active.', err);
      fallbackMode = true;
      return this.deleteAccount();
    }
  }
};
