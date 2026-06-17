import React from 'react';

interface ChatHeaderProps {
  targetUserName: string;
  onRefresh: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = React.memo(({ targetUserName }) => {
  return (
    <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 flex items-center justify-between z-10 transition-colors">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
          {targetUserName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="font-bold text-zinc-900 dark:text-zinc-100">{targetUserName}</h1>
          <p className="text-xs text-green-500 font-medium flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
            Онлайн
          </p>
        </div>
      </div>
    </header>
  );
});

ChatHeader.displayName = 'ChatHeader';
