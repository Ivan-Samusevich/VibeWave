import api from './authService';
import { ProfileData } from '../types/api';

export const userService = {
  getProfile: async (username: string): Promise<ProfileData> => {
    try {
      const response = await api.get<ProfileData>(`/users/profile/${username}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch profile, using mock:', error);
      return {
        user: { userName: username, email: `${username}@example.com`, createdAt: new Date().toISOString() },
        profile: { userProfileId: 0, is_active: true, description: 'Привет, я пользуюсь VibeWave! ✨', avatar_url: '' },
        postsCount: 12,
        followersCount: 128,
        followingCount: 256,
        isFollowing: false
      };
    }
  },
  
  updateProfile: async (data: any) => {
    const response = await api.put('/users/profile/update', data);
    return response.data;
  },
  
  toggleFollow: async (userId: number) => {
    const response = await api.post(`/users/follow/${userId}`);
    return response.data;
  },
  
  getSavedPosts: async () => {
    const response = await api.get('/homePage/getSavedPosts');
    return response.data;
  }
};
