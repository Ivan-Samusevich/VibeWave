import api from './authService';
import { PostResponse } from '../types/api';

export const postService = {
  getPosts: async () => {
    const response = await api.get<PostResponse[]>('/homePage/getPosts');
    return response.data;
  },
  createPost: async (text: string) => {
    const response = await api.post<string>('/homePage/createPost', { text });
    return response.data;
  },
  putLike: async (postId: number) => {
    if (postId === undefined || postId === null) {
      throw new Error('postId is required');
    }
    await api.post(`/homePage/putLike/${postId}`);
  }
};
