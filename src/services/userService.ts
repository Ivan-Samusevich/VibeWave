import api from './authService';
import { UserProfileResponse, PostResponse } from '../types/api';

export const userService = {
  getProfile: async (username: string): Promise<UserProfileResponse> => {
    try {
      const response = await api.get<UserProfileResponse>('/userProfile/showUserProfile');
      return {
        ...response.data,
        createdAt: response.data.createdAt || new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      throw error;
    }
  },

  getUserPosts: async (username: string): Promise<PostResponse[]> => {
    const response = await api.get<PostResponse[]>(`/userProfile/showUserPosts?userName=${username}`);
    return response.data;
  },
  
  updateProfile: async (text: string, file?: File | null) => {
    const formData = new FormData();
    formData.append('description', text);
    if (file) {
      formData.append('file', file);
    }
    const response = await api.put('/userProfile/changeUserProfile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  
  toggleFollow: async (username: string) => {
    const response = await api.put(`/userProfile/follow/${username}`);
    return response.data;
  }
};
