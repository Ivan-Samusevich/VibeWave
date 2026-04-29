import api from './authService';
import { Post } from '../types/api';

export const postService = {
  getPosts: async () => {
    const response = await api.get<Post[]>('/homePage/getPosts');
    return response.data;
  },
  createPost: async (text: string) => {
    const response = await api.post<string>('/homePage/createPost', { text });
    return response.data;
  },
  putLike: async (postId: number) => {
    await api.post(`/homePage/putLike/${postId}`);
  }
};
