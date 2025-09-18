import { Profile, ApiResponse } from '../types/profile';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Create or Update Profile
  async createOrUpdateProfile(profileData: Omit<Profile, '_id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Profile>> {
    return this.request<Profile>('/profiles', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }

  // Get Profile by Email
  async getProfileByEmail(email: string): Promise<ApiResponse<Profile>> {
    return this.request<Profile>(`/profiles/${encodeURIComponent(email)}`);
  }

  // Get All Profiles
  async getAllProfiles(): Promise<ApiResponse<Profile[]>> {
    return this.request<Profile[]>('/profiles');
  }

  // Delete Profile
  async deleteProfile(email: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/profiles/${encodeURIComponent(email)}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
