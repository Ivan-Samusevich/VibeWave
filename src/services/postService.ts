import api from './authService';
import { PostResponse, CommentResponse } from '../types/api';

export const postService = {
  getPosts: async () => {
    const response = await api.get<PostResponse[]>('/posts/getPosts');
    return response.data;
  },
  createPost: async (text: string, file: File | null) => {
    const formData = new FormData();
    formData.append('text', text);
    if (file) {
      formData.append('file', file);
    }
    const response = await api.post<string>('/posts/createPost', formData, {
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
    await api.post(`/posts/toggleLike/${postId}/${status}`);
  },
  toggleSave: async (postId: number, isSaved: boolean) => {
    if (postId === undefined || postId === null) {
      throw new Error('postId is required');
    }
    await api.post(`/posts/toggleSavedPost/${postId}/${isSaved}`);
  },
  // Комментарии
  getComments: async (postId: number) => {
    const response = await api.get<CommentResponse[]>(`/comments/getComments/${postId}`);
    return response.data;
  },
  addComment: async (postId: number, text: string) => {
    const response = await api.post<string>(`/comments/createComment/${postId}`, { text });
    return response.data;
  },
  updateComment: async (commentId: number, text: string) => {
    await api.put(`/comments/updateComment/${commentId}`, { text });
  },
  deleteComment: async (commentId: number) => {
    await api.delete(`/comments/deleteComment/${commentId}`);
  },
  deletePost: async (postId: number) => {
    await api.delete(`/posts/deletePost/${postId}`);
  }
};
