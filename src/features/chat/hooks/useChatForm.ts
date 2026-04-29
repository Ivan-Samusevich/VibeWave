import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../../store';
import { addMessage, setMessages } from '../chatSlice';
import { chatService } from '../../../services/chatService';

export const useChatForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { messages } = useSelector((state: RootState) => state.chat);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const targetUserId = user?.userId === 1 ? 2 : 1;

  const fetchMessages = async () => {
    if (!user?.userId) return;
    try {
      const data = await chatService.getMessages(targetUserId);
      dispatch(setMessages(data));
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchMessages();

    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [isAuthenticated, navigate, user?.userId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    const text = input.trim();
    setInput('');
    setLoading(true);

    try {
      const sentMessage = await chatService.sendMessage(targetUserId, text);
      dispatch(addMessage(sentMessage));
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    targetUserId,
    messages,
    input,
    setInput,
    loading,
    scrollRef,
    fetchMessages,
    handleSendMessage
  };
};
