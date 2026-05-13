import api from './authService';
import { ChatResponse, MessageResponse, SendMessageRequest } from '../types/api';

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
  sendMessage: async (receiverUserName: string, text: string) => {
    const response = await api.post<void>('/message/sendMessage', {
      receiverUserName,
      text
    } as SendMessageRequest);
    return response.data;
  }
};
