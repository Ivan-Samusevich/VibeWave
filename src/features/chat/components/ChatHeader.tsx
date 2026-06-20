import React, { useState, useEffect } from 'react';
import { userService } from '../../../services/userService';

interface ChatHeaderProps {
  targetUserName: string;
  onRefresh: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = React.memo(({ targetUserName }) => {
  const [avatarURL, setAvatarURL] = useState<string | undefined>(undefined);

  useEffect(() => {
    let active = true;
    const fetchAvatar = async () => {
      try {
        const profile = await userService.getProfile(targetUserName);
        if (active) {
          setAvatarURL(profile.fileURL);
        }
      } catch (e) {
        console.error('Failed to get avatar inside ChatHeader:', e);
      }
    };
    fetchAvatar();
    return () => {
      active = false;
    };
  }, [targetUserName]);

  return (
    <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 flex items-center justify-between z-10 transition-colors">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 p-0.5 shrink-0 flex items-center justify-center">
          {avatarURL ? (
            <img
              src={avatarURL}
              alt={targetUserName}
              className="h-full w-full rounded-full object-cover border border-white dark:border-zinc-900"
            />
          ) : (
            <div className="h-full w-full rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
              {targetUserName.charAt(0).toUpperCase()}
            </div>
          )}
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
