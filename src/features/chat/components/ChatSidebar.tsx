import React from 'react';
import { ChatResponse } from '../../../types/api';

interface ChatSidebarProps {
  chats: ChatResponse[];
  chatsLoading: boolean;
  targetUserName: string | null;
  onChatClick: (userName: string) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = React.memo(({
  chats,
  chatsLoading,
  targetUserName,
  onChatClick,
}) => {
  return (
    <aside className="w-80 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hidden md:flex flex-col">
      <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
        <h2 className="font-bold text-lg dark:text-zinc-100">Чаты</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {chatsLoading ? (
          <div className="p-8 flex justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          </div>
        ) : chats.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-sm">
            Нет активных чатов
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {chats.map((chat) => (
              <button
                key={chat.chatId}
                onClick={() => onChatClick(chat.userName)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                  targetUserName === chat.userName
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                    : 'hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                <div className="h-10 w-10 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 p-0.5 shrink-0 flex items-center justify-center">
                  {chat.avatarURL ? (
                    <img
                      src={chat.avatarURL}
                      alt={chat.userName}
                      className="h-full w-full rounded-full object-cover border border-white dark:border-zinc-900"
                    />
                  ) : (
                    <div className={`h-full w-full rounded-full flex items-center justify-center font-bold text-sm ${
                      targetUserName === chat.userName
                        ? 'bg-indigo-600 text-white'
                        : 'bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300'
                    }`}>
                      {chat.userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="font-bold truncate">{chat.userName}</p>
                  <p className="text-xs opacity-60 truncate">Нажмите, чтобы открыть</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
});

ChatSidebar.displayName = 'ChatSidebar';
