import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

export interface PostData {
  id: number;
  userName: string;
  likes: number;
  isLiked: boolean;
  text: string;
  timeAgo: string;
  createdAt: number;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  comments: { id: number; userName: string; text: string }[];
}

export const useHomeForm = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [posts, setPosts] = useState<PostData[]>([
    {
      id: 1,
      userName: 'alex_vibe',
      likes: 1234,
      isLiked: false,
      text: 'Наслаждаюсь закатом на берегу океана. #nature #vibes',
      timeAgo: '2 ЧАСА НАЗАД',
      createdAt: Date.now() - 7200000,
      mediaUrl: 'https://picsum.photos/seed/vibewave-1/600/600',
      mediaType: 'image',
      comments: [
        { id: 1, userName: 'maria_sky', text: 'Это просто невероятно! 😍' }
      ]
    },
    {
      id: 2,
      userName: 'tech_guru',
      likes: 856,
      isLiked: true,
      text: 'Новое рабочее место готово. Продуктивность зашкаливает! 💻',
      timeAgo: '5 ЧАСОВ НАЗАД',
      createdAt: Date.now() - 18000000,
      mediaUrl: 'https://picsum.photos/seed/vibewave-2/600/600',
      mediaType: 'image',
      comments: []
    },
    {
      id: 3,
      userName: 'foodie_life',
      likes: 2105,
      isLiked: false,
      text: 'Лучший завтрак в моей жизни. Рецепт в профиле! 🥞',
      timeAgo: '1 ДЕНЬ НАЗАД',
      createdAt: Date.now() - 86400000,
      mediaUrl: 'https://picsum.photos/seed/vibewave-3/600/600',
      mediaType: 'image',
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

  const deletePost = (postId: number) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  };

  const deleteComment = (postId: number, commentId: number) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.filter(comment => comment.id !== commentId)
        };
      }
      return post;
    }));
  };

  const handleAddPost = (newPost: { text: string; mediaUrl: string; mediaType: 'image' | 'video' }) => {
    if (!user) return;

    const post: PostData = {
      id: Date.now(),
      userName: user.userName,
      likes: 0,
      isLiked: false,
      text: newPost.text,
      timeAgo: 'ТОЛЬКО ЧТО',
      createdAt: Date.now(),
      mediaUrl: newPost.mediaUrl,
      mediaType: newPost.mediaType,
      comments: [],
    };

    setPosts(prev => [post, ...prev]);
  };

  const sortedPosts = [...posts].sort((a, b) => b.createdAt - a.createdAt);

  return {
    user,
    posts: sortedPosts,
    isModalOpen,
    setIsModalOpen,
    commentInputs,
    expandedComments,
    toggleLike,
    toggleComments,
    handleCommentChange,
    addComment,
    deletePost,
    deleteComment,
    handleAddPost
  };
};
