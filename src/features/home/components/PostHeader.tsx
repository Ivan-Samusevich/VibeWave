import React from 'react';
import { Link } from 'react-router-dom';
import { User, Trash2 } from 'lucide-react';

interface PostHeaderProps {
  userName: string;
  avatarURL?: string;
  isOwner: boolean;
  onDelete: () => void;
}

export const PostHeader: React.FC<PostHeaderProps> = ({ userName, avatarURL, isOwner, onDelete }) => {
  return (
    <div className="flex items-center justify-between p-4">
      <Link to={`/profile/${userName}`} className="flex items-center gap-3 group">
        <div className="h-9 w-9 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 p-0.5 group-hover:scale-105 transition-transform duration-200">
          {avatarURL ? (
            <img 
              src={avatarURL} 
              alt={userName}
              className="h-full w-full rounded-full object-cover border-2 border-white dark:border-zinc-900"
            />
          ) : (
            <div className="h-full w-full rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              <User className="h-5 w-5 text-zinc-400" />
            </div>
          )}
        </div>
        <span className="text-sm font-bold dark:text-zinc-100 group-hover:text-indigo-500 transition-colors">
          {userName}
        </span>
      </Link>
      {isOwner && (
        <button 
          onClick={onDelete}
          className="p-1 text-zinc-400 hover:text-red-500 transition-colors"
          title="Удалить публикацию"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
