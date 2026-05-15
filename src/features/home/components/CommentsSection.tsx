import React from 'react';
import { Link } from 'react-router-dom';
import { User, Edit2, Trash2, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Input } from '../../../components/Input';

interface Comment {
  id: number;
  userName: string;
  avatarURL?: string;
  text: string;
}

interface CommentsSectionProps {
  postId: number;
  comments: Comment[];
  isExpanded: boolean;
  currentUser: { userName: string } | null;
  commentInput: string;
  editingCommentId: number | null;
  editCommentText: string;
  onCommentChange: (text: string) => void;
  onAddComment: () => void;
  onToggleComments: () => void;
  onStartEdit: (id: number, text: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: (commentId: number) => void;
  onDeleteComment: (commentId: number) => void;
  setEditCommentText: (text: string) => void;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({
  postId,
  comments,
  isExpanded,
  currentUser,
  commentInput,
  editingCommentId,
  editCommentText,
  onCommentChange,
  onAddComment,
  onToggleComments,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDeleteComment,
  setEditCommentText,
}) => {
  return (
    <div className="space-y-3">
      <AnimatePresence>
        {isExpanded && comments.length > 0 && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-2 pt-2 overflow-hidden"
          >
            {comments.map(comment => (
              <div key={comment.id} className="flex items-start gap-2 group/comment">
                <div className="h-7 w-7 rounded-full shrink-0 mt-0.5 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  {comment.avatarURL ? (
                    <img src={comment.avatarURL} alt={comment.userName} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <User className="h-4 w-4 text-zinc-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 flex items-start justify-between gap-2 overflow-hidden">
                  {editingCommentId === comment.id ? (
                    <div className="flex-1 flex items-center gap-2">
                      <Input
                        value={editCommentText}
                        onChange={(e) => setEditCommentText(e.target.value)}
                        className="h-7 text-xs py-1"
                        autoFocus
                      />
                      <button 
                        onClick={() => onSaveEdit(comment.id)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={onCancelEdit}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm">
                        <Link to={`/profile/${comment.userName}`} className="font-semibold mr-2 dark:text-zinc-100 hover:text-indigo-500 transition-colors">{comment.userName}</Link>
                        <span className="dark:text-zinc-400">{comment.text}</span>
                      </p>
                      {currentUser?.userName === comment.userName && (
                        <div className="flex items-center gap-1 opacity-0 group-hover/comment:opacity-100 transition-opacity">
                          <button 
                            onClick={() => onStartEdit(comment.id, comment.text)}
                            className="p-1 text-zinc-400 hover:text-indigo-500 transition-colors"
                            title="Редактировать комментарий"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                          <button 
                            onClick={() => onDeleteComment(comment.id)}
                            className="p-1 text-zinc-400 hover:text-red-500 transition-colors"
                            title="Удалить комментарий"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {!isExpanded && comments.length > 0 && (
        <button 
          onClick={onToggleComments}
          className="text-sm text-zinc-500 dark:text-zinc-400 hover:underline"
        >
          Посмотреть все комментарии ({comments.length})
        </button>
      )}

      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex gap-2">
        <Input
          placeholder="Добавить комментарий..."
          className="border-none bg-transparent h-8 text-sm focus-visible:ring-0 px-0"
          value={commentInput}
          onChange={(e) => onCommentChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onAddComment()}
        />
        <button 
          className="text-indigo-600 font-semibold hover:bg-transparent disabled:opacity-50 text-sm"
          disabled={!commentInput?.trim()}
          onClick={onAddComment}
        >
          Опубликовать
        </button>
      </div>
    </div>
  );
};
