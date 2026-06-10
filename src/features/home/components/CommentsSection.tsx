import React from 'react';
import { Input } from '../../../components/Input';

interface CommentsSectionProps {
  postId: number;
  commentsCount: number;
  commentInput: string;
  onCommentChange: (text: string) => void;
  onAddComment: () => void;
  onToggleComments: () => void;
}

export const CommentsSection: React.FC<CommentsSectionProps> = React.memo(({
  postId,
  commentsCount,
  commentInput,
  onCommentChange,
  onAddComment,
  onToggleComments,
}) => {
  return (
    <div className="space-y-2">
      {commentsCount > 0 && (
        <button 
          onClick={onToggleComments}
          className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline transition-colors cursor-pointer"
        >
          Посмотреть все комментарии ({commentsCount})
        </button>
      )}

      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex gap-2">
        <Input
          placeholder="Добавить комментарий..."
          className="border-none bg-transparent h-8 text-sm focus-visible:ring-0 px-0"
          value={commentInput}
          onChange={(e) => onCommentChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && commentInput?.trim()) {
              onAddComment();
            }
          }}
        />
        <button 
          className="text-indigo-600 dark:text-indigo-455 font-semibold hover:text-indigo-700 dark:hover:text-indigo-300 disabled:opacity-50 text-sm cursor-pointer shrink-0"
          disabled={!commentInput?.trim()}
          onClick={onAddComment}
        >
          Опубликовать
        </button>
      </div>
    </div>
  );
});

CommentsSection.displayName = 'CommentsSection';
