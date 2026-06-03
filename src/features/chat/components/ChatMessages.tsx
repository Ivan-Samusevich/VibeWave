import React from 'react';
import { AnimatePresence } from 'motion/react';
import { ChatMessageItem } from './ChatMessageItem';
import { MessageResponse, UserResponse } from '../../../types/api';

interface ChatMessagesProps {
  messages: MessageResponse[];
  currentUser: UserResponse | null;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  onEditMessage: (messageId: number, text: string) => void;
  onDeleteMessage: (messageId: number) => void;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ 
  messages, 
  currentUser, 
  scrollRef,
  onEditMessage,
  onDeleteMessage
}) => {
  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800"
    >
      <AnimatePresence initial={false}>
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600 gap-2 opacity-50">
            <p>Нет сообщений. Начните общение!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatMessageItem 
              key={msg.messageId} 
              message={msg} 
              currentUser={currentUser} 
              onEdit={onEditMessage}
              onDelete={onDeleteMessage}
            />
          ))
        )}
      </AnimatePresence>
    </div>
  );
};
