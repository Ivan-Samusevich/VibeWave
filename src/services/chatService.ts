import api from './authService';
import { ChatResponse, MessageResponse, SendMessageRequest, UpdateMessageRequest } from '../types/api';

export const chatService = {
  getAllMyChats: async () => {
    const response = await api.get<ChatResponse[]>('/chat/showChats');
    return response.data;
  },
  openChat: async (userName: string) => {
    const response = await api.get<ChatResponse>(`/chat/openWith/${userName}`);
    return response.data;
  },
  getMessages: async (chatId: number) => {
    const response = await api.get<MessageResponse[]>(`/message/getMessages/${chatId}`);
    return response.data;
  },
  updateMessage: async (messageId: number, newText: string) => {
    const response = await api.put<void>('/message/updateMessage', {
      messageId,
      newText
    } as UpdateMessageRequest);
    return response.data;
  },
  deleteMessage: async (messageId: number) => {
    const response = await api.delete<void>(`/message/deleteMessage/${messageId}`);
    return response.data;
  }
};
