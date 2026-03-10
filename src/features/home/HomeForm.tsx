import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { User, Heart, MessageCircle, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from '../../components/Navbar';

interface PostData {
  id: number;
  userName: string;
  likes: number;
  isLiked: boolean;
  caption: string;
  timeAgo: string;
  comments: { id: number; userName: string; text: string }[];
}

export const HomeForm: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [posts, setPosts] = useState<PostData[]>([
    {
      id: 1,
      userName: 'alex_vibe',
      likes: 1234,
      isLiked: false,
      caption: 'Наслаждаюсь закатом на берегу океана. #nature #vibes',
      timeAgo: '2 ЧАСА НАЗАД',
      comments: [
        { id: 1, userName: 'maria_sky', text: 'Это просто невероятно! 😍' }
      ]
    },
    {
      id: 2,
      userName: 'tech_guru',
      likes: 856,
      isLiked: true,
      caption: 'Новое рабочее место готово. Продуктивность зашкаливает! 💻',
      timeAgo: '5 ЧАСОВ НАЗАД',
      comments: []
    },
    {
      id: 3,
      userName: 'foodie_life',
      likes: 2105,
      isLiked: false,
      caption: 'Лучший завтрак в моей жизни. Рецепт в профиле! 🥞',
      timeAgo: '1 ДЕНЬ НАЗАД',
      comments: []
    }
  ]);

  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});
  const [expandedComments, setExpandedComments] = useState<{ [key: number]: boolean }>({});

  const toggleLike = (postId: number) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const toggleComments = (postId: number) => {
    setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleCommentChange = (postId: number, value: string) => {
    setCommentInputs(prev => ({ ...prev, [postId]: value }));
  };

  const addComment = (postId: number) => {
    const text = commentInputs[postId];
    if (!text?.trim() || !user) return;

    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            { id: Date.now(), userName: user.userName, text: text.trim() }
          ]
        };
      }
      return post;
    }));

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    setExpandedComments(prev => ({ ...prev, [postId]: true }));
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-200">
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="space-y-8">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-0 overflow-hidden border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-3 p-4">
                  <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                    <User className="h-5 w-5 text-zinc-500" />
                  </div>
                  <span className="text-sm font-semibold dark:text-zinc-100">{post.userName}</span>
                </div>
                
                <div className="aspect-square bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                  <img 
                    src={`https://picsum.photos/seed/vibewave-${post.id}/600/600`} 
                    alt="Post content" 
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="p-4 space-y-3">
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
                  
                  <div className="space-y-1">
                    <p className="text-sm font-semibold dark:text-zinc-100">{post.likes.toLocaleString()} отметок «Нравится»</p>
                    <p className="text-sm dark:text-zinc-300">
                      <span className="font-semibold mr-2 dark:text-zinc-100">{post.userName}</span>
                      {post.caption}
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
                          <p key={comment.id} className="text-sm">
                            <span className="font-semibold mr-2 dark:text-zinc-100">{comment.userName}</span>
                            <span className="dark:text-zinc-400">{comment.text}</span>
                          </p>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!expandedComments[post.id] && post.comments.length > 0 && (
                    <button 
                      onClick={() => toggleComments(post.id)}
                      className="text-sm text-zinc-500 dark:text-zinc-400 hover:underline"
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
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-indigo-600 font-semibold cursor-pointer hover:bg-transparent disabled:opacity-50"
                      disabled={!commentInputs[post.id]?.trim()}
                      onClick={() => addComment(post.id)}
                    >
                      Опубликовать
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};
