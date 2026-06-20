import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Edit2, Trash2, Check, X as CancelIcon, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { formatCommentDate } from '../../../utils/date';

interface Comment {
  id: number;
  userName: string;
  avatarURL?: string;
  text: string;
  createdAt?: string;
}

interface PostData {
  id: number;
  userName: string;
  avatarURL?: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  text: string;
  likes: number;
  isLiked: boolean;
  isSaved: boolean;
  timeAgo: string;
  comments: Comment[];
  commentsCount: number;
}

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: PostData | null;
  currentUser: { userName: string } | null;
  commentInput: string;
  editingCommentId: number | null;
  editCommentText: string;
  onCommentChange: (text: string) => void;
  onAddComment: () => void;
  onStartEdit: (id: number, text: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: (commentId: number) => void;
  onDeleteComment: (commentId: number) => void;
  setEditCommentText: (text: string) => void;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({
  isOpen,
  onClose,
  post,
  currentUser,
  commentInput,
  editingCommentId,
  editCommentText,
  onCommentChange,
  onAddComment,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDeleteComment,
  setEditCommentText,
}) => {
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const commentsContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen && post && post.comments.length > 0) {
      setTimeout(() => {
        commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [isOpen, post?.comments.length]);

  if (!post) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-black/60 backdrop-blur-sm">
          {/* Backdrop click */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 cursor-pointer"
          />

          {/* Modal content body */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white dark:bg-zinc-900 w-full max-w-4xl rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden h-[85vh] xs:h-[550px] md:h-162.5 max-h-[90vh] border border-zinc-200 dark:border-zinc-800"
          >
            {/* Left Column: Post Media (Desktop optimized) */}
            <div className="hidden md:flex flex-1 bg-black items-center justify-center overflow-hidden relative">
              {post.mediaType === 'video' ? (
                <video
                  src={post.mediaUrl}
                  controls
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={post.mediaUrl}
                  alt={post.text || 'Post image'}
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Right Column: Header, Comments list, Input */}
            <div className="w-full md:w-105 flex flex-col h-full bg-white dark:bg-zinc-900">
              {/* Header */}
              <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-zinc-800 overflow-hidden">
                    {post.avatarURL ? (
                      <img src={post.avatarURL} alt={post.userName} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <User className="h-4 w-4 text-zinc-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-sm dark:text-zinc-100 block leading-tight">
                      {post.userName}
                    </span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-none">
                      {post.timeAgo}
                    </span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                </button>
              </div>

              {/* Main Area: Scrollable Caption + Comments */}
              <div 
                ref={commentsContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800"
              >
                {/* Post Caption */}
                <div className="flex items-start gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-zinc-800 shrink-0 overflow-hidden">
                    {post.avatarURL ? (
                      <img src={post.avatarURL} alt={post.userName} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <User className="h-4 w-4 text-zinc-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm dark:text-zinc-300">
                      <Link to={`/profile/${post.userName}`} className="font-bold mr-2 dark:text-zinc-100 hover:text-indigo-500 transition-colors">
                        {post.userName}
                      </Link>
                      {post.text}
                    </p>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {post.comments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center text-zinc-400 dark:text-zinc-500 gap-3">
                      <MessageCircle className="h-10 w-10 text-zinc-300 dark:text-zinc-700 animate-pulse" />
                      <p className="text-sm">Нет комментариев.<br />Будьте первыми, кто оставит мнение!</p>
                    </div>
                  ) : (
                    post.comments.map((comment) => (
                      <div key={comment.id} className="flex items-start gap-3 group/comment">
                        <div className="h-8 w-8 rounded-full overflow-hidden bg-zinc-150 dark:bg-zinc-800 shrink-0">
                          {comment.avatarURL ? (
                            <img src={comment.avatarURL} alt={comment.userName} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <User className="h-4 w-4 text-zinc-400" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          {editingCommentId === comment.id ? (
                            <div className="flex items-center gap-2 mt-0.5">
                              <input
                                type="text"
                                value={editCommentText}
                                onChange={(e) => setEditCommentText(e.target.value)}
                                className="flex-1 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none rounded-lg px-2 py-1 text-zinc-900 dark:text-zinc-100"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') onSaveEdit(comment.id);
                                  if (e.key === 'Escape') onCancelEdit();
                                }}
                              />
                              <button
                                onClick={() => onSaveEdit(comment.id)}
                                className="cursor-pointer p-1 text-green-600 hover:text-green-700 shrink-0"
                                title="Сохранить"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={onCancelEdit}
                                className="cursor-pointer p-1 text-red-600 hover:text-red-700 shrink-0"
                                title="Отменить"
                              >
                                <CancelIcon className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between gap-1">
                              <div className="text-sm leading-snug">
                                <Link to={`/profile/${comment.userName}`} className="font-bold mr-1.5 dark:text-zinc-100 hover:text-indigo-500 transition-colors">
                                  {comment.userName}
                                </Link>
                                <span className="text-zinc-700 dark:text-zinc-300 wrap-break-word font-normal">
                                  {comment.text}
                                </span>
                                {comment.createdAt && (
                                  <span className="block text-[10.5px] text-zinc-400 dark:text-zinc-500 mt-1 select-none font-normal">
                                    {formatCommentDate(comment.createdAt)}
                                  </span>
                                )}
                              </div>

                              {currentUser?.userName === comment.userName && (
                                <div className="flex items-center gap-0.5 opacity-0 group-hover/comment:opacity-100 transition-opacity shrink-0">
                                  <button
                                    onClick={() => onStartEdit(comment.id, comment.text)}
                                    className="cursor-pointer p-1 text-zinc-400 hover:text-indigo-500 transition-colors"
                                    title="Редактировать"
                                  >
                                    <Edit2 className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={() => onDeleteComment(comment.id)}
                                    className="cursor-pointer p-1 text-zinc-400 hover:text-red-500 transition-colors"
                                    title="Удалить"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={commentsEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 shrink-0 bg-zinc-50 dark:bg-zinc-900">
                <div className="flex gap-2">
                  <Input
                    placeholder="Добавить комментарий..."
                    value={commentInput}
                    onChange={(e) => onCommentChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && commentInput.trim()) {
                        onAddComment();
                      }
                    }}
                    className="flex-1 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 h-9 text-xs focus-visible:ring-indigo-500 focus-visible:ring-1"
                  />
                  <Button
                    disabled={!commentInput.trim()}
                    onClick={onAddComment}
                    className="cursor-pointer h-9 px-4 font-semibold shrink-0"
                  >
                    Отправить
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
