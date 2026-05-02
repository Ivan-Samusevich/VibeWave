import api from './authService';
import { PostResponse } from '../types/api';

export const postService = {
  getPosts: async () => {
    const response = await api.get<PostResponse[]>('/homePage/getPosts');
    return response.data;
  },
  createPost: async (text: string, file: File | null) => {
    const formData = new FormData();
    formData.append('text', text);
    if (file) {
      formData.append('file', file);
    }
    const response = await api.post<string>('/homePage/createPost', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  toggleLike: async (postId: number, likeStatus: boolean) => {
    if (postId === undefined || postId === null) {
      throw new Error('postId is required');
    }
    await api.post(`/homePage/toggleLike/${postId}/${ likeStatus }`);
  },
  toggleSave: async (postId: number, status: boolean) => {
    if (postId === undefined || postId === null) {
      throw new Error('postId is required');
    }
    // Предполагаемый эндпоинт для сохранения постов
    await api.post(`/homePage/savePost/${postId}`, { status });
  }
};
