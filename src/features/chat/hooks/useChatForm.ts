import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RootState } from '../../../store';
import { addMessage, setMessages } from '../chatSlice';
import { chatService } from '../../../services/chatService';
import { ChatResponse } from '../../../types/api';

export const useChatForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetUserName = searchParams.get('user');
  
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { messages } = useSelector((state: RootState) => state.chat);
  const [chats, setChats] = useState<ChatResponse[]>([]);
  const [chatsLoading, setChatsLoading] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchChats = async () => {
    if (!isAuthenticated) return;
    setChatsLoading(true);
    try {
      const data = await chatService.getAllMyChats();
      setChats(data);
    } catch (error) {
      console.error('Failed to fetch chats:', error);
    } finally {
      setChatsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchChats();
    }
  }, [isAuthenticated]);
  
  useEffect(() => {
    const initChat = async () => {
      if (!targetUserName || !isAuthenticated) {
        setChatId(null);
        dispatch(setMessages([]));
        return;
      }
      try {
        const chatInfo = await chatService.openChat(targetUserName);
        if (chatInfo.chatId) {
          setChatId(chatInfo.chatId);
        } else {
          setChatId(null);
          dispatch(setMessages([]));
        }
      } catch (error) {
        console.error('Failed to open chat:', error);
      }
    };
    initChat();
  }, [targetUserName, isAuthenticated, dispatch]);

  const fetchMessages = async () => {
    if (chatId === null) return;
    try {
      const data = await chatService.getMessages(chatId);
      const editedMessagesStr = localStorage.getItem('edited_messages') || '{}';
      const deletedMessagesStr = localStorage.getItem('deleted_messages') || '[]';
      const editedMessages = JSON.parse(editedMessagesStr);
      const deletedMessages = JSON.parse(deletedMessagesStr);
      
      const filteredAndEdited = data
        .filter((msg: any) => !deletedMessages.includes(msg.messageId))
        .map((msg: any) => {
          if (editedMessages[msg.messageId]) {
            return { ...msg, text: editedMessages[msg.messageId] };
          }
          return msg;
        });

      dispatch(setMessages(filteredAndEdited));
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleEditMessage = (messageId: number, newText: string) => {
    try {
      const editedMessagesStr = localStorage.getItem('edited_messages') || '{}';
      const editedMessages = JSON.parse(editedMessagesStr);
      editedMessages[messageId] = newText;
      localStorage.setItem('edited_messages', JSON.stringify(editedMessages));
      fetchMessages();
    } catch (e) {
      console.error('Failed to edit message:', e);
    }
  };

  const handleDeleteMessage = (messageId: number) => {
    try {
      const deletedMessagesStr = localStorage.getItem('deleted_messages') || '[]';
      const deletedMessages = JSON.parse(deletedMessagesStr);
      if (!deletedMessages.includes(messageId)) {
        deletedMessages.push(messageId);
      }
      localStorage.setItem('deleted_messages', JSON.stringify(deletedMessages));
      fetchMessages();
    } catch (e) {
      console.error('Failed to delete message:', e);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (chatId !== null) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, navigate, chatId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user || !targetUserName) return;

    const text = input.trim();
    setInput('');
    setLoading(true);

    try {
      await chatService.sendMessage(targetUserName, text);
      if (chatId === null) {
        const chatInfo = await chatService.openChat(targetUserName);
        if (chatInfo.chatId) setChatId(chatInfo.chatId);
      }
      fetchMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    targetUserName,
    messages,
    chats,
    chatsLoading,
    input,
    setInput,
    loading,
    scrollRef,
    fetchMessages,
    handleSendMessage,
    handleEditMessage,
    handleDeleteMessage,
    fetchChats,
    navigate
  };
};
