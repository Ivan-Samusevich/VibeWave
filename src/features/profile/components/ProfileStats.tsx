import React from 'react';

interface ProfileStatsProps {
  postCount: number;
  followerCount: number;
  followingCount: number;
  onFollowersClick: () => void;
  onFollowingClick: () => void;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({
  postCount,
  followerCount,
  followingCount,
  onFollowersClick,
  onFollowingClick,
}) => {
  return (
    <div className="grid grid-cols-3 md:flex md:gap-10 text-sm py-2 border-y md:border-none border-zinc-100 dark:border-zinc-800">
      <div className="flex flex-col md:flex-row md:gap-1.5 items-center">
        <span className="font-bold text-lg md:text-base text-zinc-900 dark:text-zinc-100">
          {postCount || 0}
        </span>
        <span className="text-zinc-500 dark:text-zinc-400">публикаций</span>
      </div>
      <div 
        className="flex flex-col md:flex-row md:gap-1.5 items-center cursor-pointer group"
        onClick={onFollowersClick}
      >
        <span className="font-bold text-lg md:text-base text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 transition-colors">
          {followerCount || 0}
        </span>
        <span className="text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300">
          подписчиков
        </span>
      </div>
      <div 
        className="flex flex-col md:flex-row md:gap-1.5 items-center cursor-pointer group"
        onClick={onFollowingClick}
      >
        <span className="font-bold text-lg md:text-base text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 transition-colors">
          {followingCount || 0}
        </span>
        <span className="text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300">
          подписок
        </span>
      </div>
    </div>
  );
};
