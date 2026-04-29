import api from './authService';
import { Message } from '../types/api';

export const chatService = {
  getMessages: async (userId: number) => {
    const response = await api.get<Message[]>(`/messages/${userId}`);
    return response.data;
  },
  sendMessage: async (receiverId: number, text: string) => {
    const response = await api.post<Message>(`/messages/send/${receiverId}`, {
      text
    });
    return response.data;
  }
};
