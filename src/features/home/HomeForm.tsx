import React from 'react';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { User, Heart, MessageCircle, Trash2, Bookmark, BookmarkCheck, Edit2, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from '../../components/NavBar';
import { CreatePostModal } from '../../components/CreatePostModal';
import { useHomeForm } from './hooks/useHomeForm';

export const HomeForm: React.FC = () => {
  const {
    user,
    posts,
    loading,
    isModalOpen,
    setIsModalOpen,
    commentInputs,
    expandedComments,
    editingCommentId,
    editCommentText,
    setEditCommentText,
    toggleLike,
    toggleSave,
    toggleComments,
    handleCommentChange,
    addComment,
    startEditComment,
    cancelEditComment,
    saveEditedComment,
    deleteComment,
    deletePost,
    handleAddPost
  } = useHomeForm();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-200">
      <Navbar onAddPostClick={() => setIsModalOpen(true)} />

      <main className="mx-auto max-w-2xl px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-zinc-500 animate-pulse">Загрузка ленты...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-0 overflow-hidden border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                        <User className="h-5 w-5 text-zinc-500" />
                      </div>
                      <span className="text-sm font-semibold dark:text-zinc-100">{post.userName}</span>
                    </div>
                    {user?.userName === post.userName && (
                      <button 
                        onClick={() => deletePost(post.id)}
                        className="p-1 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                        title="Удалить публикацию"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="aspect-square bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center overflow-hidden">
                    {post.mediaType === 'video' ? (
                      <video 
                        src={post.mediaUrl} 
                        className="h-full w-full object-cover" 
                        controls 
                        autoPlay 
                        muted 
                        loop 
                      />
                    ) : (
                      <img 
                        src={post.mediaUrl} 
                        alt="Post content" 
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Heart 
                          className={`h-6 w-6 cursor-pointer transition-colors ${
                            post.isLiked ? 'text-red-500 fill-red-500' : 'text-zinc-700 dark:text-zinc-300 hover:text-red-500'
                          }`} 
                          onClick={() => toggleLike(post.id)}
                        />
                        <div 
                          className="flex items-center gap-1.5 cursor-pointer group"
                          onClick={() => toggleComments(post.id)}
                        >
                          <MessageCircle className="h-6 w-6 text-zinc-700 dark:text-zinc-300 group-hover:text-indigo-500 transition-colors" />
                          {post.comments.length > 0 && (
                            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-indigo-500">
                              {post.comments.length}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div 
                        className="cursor-pointer text-zinc-700 dark:text-zinc-300 hover:text-indigo-500 transition-colors"
                        onClick={() => toggleSave(post.id)}
                        title={post.isSaved ? "Удалить из сохраненного" : "Сохранить"}
                      >
                        {post.isSaved ? (
                          <BookmarkCheck className="h-6 w-6 text-indigo-500 fill-indigo-500" />
                        ) : (
                          <Bookmark className="h-6 w-6" />
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-semibold dark:text-zinc-100">{post.likes.toLocaleString()} отметок «Нравится»</p>
                      <p className="text-sm dark:text-zinc-300">
                        <span className="font-semibold mr-2 dark:text-zinc-100">{post.userName}</span>
                        {post.text}
                      </p>
                    </div>

                    <AnimatePresence>
                      {expandedComments[post.id] && post.comments.length > 0 && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="space-y-2 pt-2 overflow-hidden"
                        >
                          {post.comments.map(comment => (
                            <div key={comment.id} className="flex items-start justify-between group/comment gap-2">
                              {editingCommentId === comment.id ? (
                                <div className="flex-1 flex items-center gap-2">
                                  <Input
                                    value={editCommentText}
                                    onChange={(e) => setEditCommentText(e.target.value)}
                                    className="h-7 text-xs py-1"
                                    autoFocus
                                  />
                                  <button 
                                    onClick={() => saveEditedComment(post.id, comment.id)}
                                    className="text-green-600 hover:text-green-700 cursor-pointer"
                                  >
                                    <Check className="h-4 w-4" />
                                  </button>
                                  <button 
                                    onClick={cancelEditComment}
                                    className="text-red-600 hover:text-red-700 cursor-pointer"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <p className="text-sm">
                                    <span className="font-semibold mr-2 dark:text-zinc-100">{comment.userName}</span>
                                    <span className="dark:text-zinc-400">{comment.text}</span>
                                  </p>
                                  {user?.userName === comment.userName && (
                                    <div className="flex items-center gap-1 opacity-0 group-hover/comment:opacity-100 transition-opacity">
                                      <button 
                                        onClick={() => startEditComment(comment.id, comment.text)}
                                        className="p-1 text-zinc-400 hover:text-indigo-500 transition-colors cursor-pointer"
                                        title="Редактировать комментарий"
                                      >
                                        <Edit2 className="h-3 w-3" />
                                      </button>
                                      <button 
                                        onClick={() => deleteComment(post.id, comment.id)}
                                        className="p-1 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                                        title="Удалить комментарий"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </button>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {!expandedComments[post.id] && post.comments.length > 0 && (
                      <button 
                        onClick={() => toggleComments(post.id)}
                        className="text-sm text-zinc-500 dark:text-zinc-400 hover:underline cursor-pointer"
                      >
                        Посмотреть все комментарии ({post.comments.length})
                      </button>
                    )}

                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider">{post.timeAgo}</p>

                    <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex gap-2">
                      <Input
                        placeholder="Добавить комментарий..."
                        className="border-none bg-transparent h-8 text-sm focus-visible:ring-0 px-0"
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => handleCommentChange(post.id, e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addComment(post.id)}
                      />
                      <button 
                        className="text-indigo-600 font-semibold hover:bg-transparent disabled:opacity-50 text-sm cursor-pointer"
                        disabled={!commentInputs[post.id]?.trim()}
                        onClick={() => addComment(post.id)}
                      >
                        Опубликовать
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <CreatePostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAddPost={handleAddPost} 
      />
    </div>
  );
};
