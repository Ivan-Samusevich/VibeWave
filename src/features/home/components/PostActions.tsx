import React from 'react';
import { Heart, MessageCircle, Bookmark, BookmarkCheck } from 'lucide-react';

interface PostActionsProps {
  isLiked: boolean;
  isSaved: boolean;
  commentsCount: number;
  onLike: () => void;
  onToggleComments: () => void;
  onSave: () => void;
}

export const PostActions: React.FC<PostActionsProps> = React.memo(({
  isLiked,
  isSaved,
  commentsCount,
  onLike,
  onToggleComments,
  onSave,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Heart 
          className={`h-6 w-6 cursor-pointer transition-colors ${
            isLiked ? 'text-red-500 fill-red-500' : 'text-zinc-700 dark:text-zinc-300 hover:text-red-500'
          }`} 
          onClick={onLike}
        />
        <div 
          className="flex items-center gap-1.5 cursor-pointer group"
          onClick={onToggleComments}
        >
          <MessageCircle className="h-6 w-6 text-zinc-700 dark:text-zinc-300 group-hover:text-indigo-500 transition-colors" />
          {commentsCount > 0 && (
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-indigo-500">
              {commentsCount}
            </span>
          )}
        </div>
      </div>
      
      <div 
        className="cursor-pointer text-zinc-700 dark:text-zinc-300 hover:text-indigo-500 transition-colors"
        onClick={onSave}
        title={isSaved ? "Удалить из сохраненного" : "Сохранить"}
      >
        {isSaved ? (
          <BookmarkCheck className="h-6 w-6 text-indigo-500 fill-indigo-500" />
        ) : (
          <Bookmark className="h-6 w-6" />
        )}
      </div>
    </div>
  );
});

PostActions.displayName = 'PostActions';
