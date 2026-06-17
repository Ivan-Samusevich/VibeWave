import api from './authService';
import { UserProfileResponse, PostResponse, UserResponse } from '../types/api';

export const userService = {
  getProfile: async (username: string): Promise<UserProfileResponse> => {
    try {
      const response = await api.get<UserProfileResponse>(`/userProfile/showUserProfile?userName=${username}`);
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

  getSavedPosts: async (username: string): Promise<PostResponse[]> => {
    const response = await api.get<PostResponse[]>(`/userProfile/showSavedPosts?userName=${username}`);
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
    const response = await api.post(`/userProfile/follow/${username}`);
    return response.data;
  },

  getFollowers: async (username: string): Promise<UserResponse[]> => {
    const response = await api.get<UserResponse[]>(`/userProfile/showFollowers/${username}`);
    return response.data;
  },

  getFollowing: async (username: string): Promise<UserResponse[]> => {
    const response = await api.get<UserResponse[]>(`/userProfile/showFollowing/${username}`);
    return response.data;
  },

  searchUsers: async (query: string, currentUsername?: string): Promise<UserResponse[]> => {
    if (!query.trim()) return [];
    
    try {
      const response = await api.get<UserProfileResponse[]>(`/userProfile/searchUser/${encodeURIComponent(query.trim())}`);
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data.map(u => {
          let fileURLResult = u.fileURL;
          if (fileURLResult && !fileURLResult.startsWith('/api/media/') && !fileURLResult.startsWith('http')) {
            fileURLResult = `/api/media/${fileURLResult}`;
          }
          return {
            userName: u.userName,
            fileURL: fileURLResult
          };
        });
      }
    } catch (e) {
      console.warn('Failed searching users via /userProfile/searchUser, trying fallbacks', e);
    }

    try {
      const response = await api.get<UserResponse[]>(`/userProfile/search?userName=${query}`);
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
    } catch (e) {}

    try {
      const response = await api.get<UserProfileResponse>(`/userProfile/showUserProfile?userName=${query}`);
      if (response.data && response.data.userName) {
        return [{
          userName: response.data.userName,
          fileURL: response.data.fileURL
        }];
      }
    } catch (e) {}

    try {
      const harvestedUsersMap = new Map<string, string | undefined>();
      const trimmedQuery = query.trim().toLowerCase();

      if (currentUsername) {
        harvestedUsersMap.set(currentUsername.toLowerCase(), undefined);
      }

      try {
        const postsRes = await api.get<PostResponse[]>('/posts/getPosts');
        if (Array.isArray(postsRes.data)) {
          postsRes.data.forEach(p => {
            if (p.userName) {
              harvestedUsersMap.set(p.userName.toLowerCase(), p.avatarURL || p.imageURL);
            }
          });
        }
      } catch (postErr) {}

      if (currentUsername) {
        try {
          const response = await api.get<UserResponse[]>(`/userProfile/showFollowers/${currentUsername}`);
          if (Array.isArray(response.data)) {
            response.data.forEach(f => {
              if (f.userName) harvestedUsersMap.set(f.userName.toLowerCase(), f.fileURL);
            });
          }
        } catch (fErr) {}

        try {
          const response = await api.get<UserResponse[]>(`/userProfile/showFollowing/${currentUsername}`);
          if (Array.isArray(response.data)) {
            response.data.forEach(f => {
              if (f.userName) harvestedUsersMap.set(f.userName.toLowerCase(), f.fileURL);
            });
          }
        } catch (fErr) {}
      }

      const matchedUsers: UserResponse[] = [];
      for (const [uname, avatar] of harvestedUsersMap.entries()) {
        if (uname.includes(trimmedQuery)) {
          matchedUsers.push({
            userName: uname,
            fileURL: avatar
          });
        }
      }

      return matchedUsers;
    } catch (generalErr) {
      console.error('General search fallback error:', generalErr);
    }

    return [];
  },
};
