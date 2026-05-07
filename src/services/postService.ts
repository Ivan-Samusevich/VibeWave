import api from './authService';
import { PostResponse, CommentResponse } from '../types/api';

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
  putLike: async (postId: number, status: boolean) => {
    if (postId === undefined || postId === null) {
      throw new Error('postId is required');
    }
    await api.post(`/homePage/toggleLike/${postId}/${status}`);
  },
  toggleSave: async (postId: number, status: boolean) => {
    if (postId === undefined || postId === null) {
      throw new Error('postId is required');
    }
    await api.post(`/homePage/savePost/${postId}`, { status });
  },
  // Комментарии
  getComments: async (postId: number) => {
    const response = await api.get<CommentResponse[]>(`/homePage/getComments/${postId}`);
    return response.data;
  },
  addComment: async (postId: number, text: string) => {
    const response = await api.post<string>(`/homePage/createComment/${postId}`, { text });
    return response.data;
  },
  updateComment: async (commentId: number, text: string) => {
    await api.put(`/homePage/updateComment/${commentId}`, { text });
  },
  deleteComment: async (commentId: number) => {
    await api.delete(`/homePage/deleteComment/${commentId}`);
  },
  deletePost: async (postId: number) => {
    await api.delete(`/homePage/deletePost/${postId}`);
  }
};
