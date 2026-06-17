import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MessageResponse, UserResponse } from '../../../types/api';
import { Edit2, Trash2, Check, X } from 'lucide-react';
import { formatMessageTime, formatMessageDateTime } from '../../../utils/date';

interface ChatMessageItemProps {
  message: MessageResponse;
  currentUser: UserResponse | null;
  onEdit: (messageId: number, text: string) => void;
  onDelete: (messageId: number) => void;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = React.memo(({ 
  message, 
  currentUser,
  onEdit,
  onDelete
}) => {
  const isOwn = message.userName === currentUser?.userName;
  const isEdited = !!(
    message.updatedAt &&
    message.createdAt &&
    Math.abs(new Date(message.updatedAt).getTime() - new Date(message.createdAt).getTime()) > 1000
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text);

  const handleSave = () => {
    if (editText.trim() && editText.trim() !== message.text) {
      onEdit(message.messageId, editText.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(message.text);
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className={`flex items-center gap-2 group/msg ${isOwn ? 'justify-end' : 'justify-start'}`}
    >
      {isOwn && !isEditing && (
        <div className="flex items-center gap-1 opacity-0 group-hover/msg:opacity-100 transition-opacity duration-200">
          <button 
            onClick={() => setIsEditing(true)}
            className="p-1 text-zinc-400 hover:text-indigo-500 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Редактировать сообщение"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button 
            onClick={() => onDelete(message.messageId)}
            className="p-1 text-zinc-450 hover:text-red-500 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Удалить сообщение"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div 
        className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-sm relative ${
          isOwn
            ? 'bg-indigo-600 text-white rounded-tr-none'
            : 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-100 dark:border-zinc-800 rounded-tl-none'
        }`}
      >
        {isEditing ? (
          <div className="flex items-center gap-2 min-w-50 py-1">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="flex-1 text-sm bg-indigo-700 text-white border-none focus:outline-none placeholder-indigo-300 rounded px-2 py-1 outline-none"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
            />
            <button 
              onClick={handleSave}
              className="text-white hover:text-green-300 transition-colors"
              title="Сохранить"
            >
              <Check className="h-4 w-4" />
            </button>
            <button 
              onClick={handleCancel}
              className="text-white hover:text-red-300 transition-colors"
              title="Отмена"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm leading-relaxed wrap-break-word">{message.text}</p>
            <span className={`text-[10px] mt-1 block text-right select-none ${
              isOwn ? 'text-indigo-200/80' : 'text-zinc-400 dark:text-zinc-500'
            }`}>
              {formatMessageTime(message.createdAt)}
              {isEdited && (
                <span className="ml-1 opacity-80" title={`Изменено: ${formatMessageDateTime(message.updatedAt)}`}>
                  (изм. {formatMessageTime(message.updatedAt)})
                </span>
              )}
            </span>
          </>
        )}
      </div>
    </motion.div>
  );
});

ChatMessageItem.displayName = 'ChatMessageItem';
