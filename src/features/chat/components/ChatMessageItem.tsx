import React from 'react';
import { motion } from 'motion/react';
import { MessageResponse, UserResponse } from '../../../types/api';

interface ChatMessageItemProps {
  message: MessageResponse;
  currentUser: UserResponse | null;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message, currentUser }) => {
  const isOwn = message.userName === currentUser?.userName;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
    >
      <div 
        className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-sm ${
          isOwn
            ? 'bg-indigo-600 text-white rounded-tr-none'
            : 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-100 dark:border-zinc-800 rounded-tl-none'
        }`}
      >
        <p className="text-sm leading-relaxed">{message.text}</p>
        <span className={`text-[10px] mt-1 block text-right ${
          isOwn ? 'text-indigo-200' : 'text-zinc-500'
        }`}>
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  );
};
