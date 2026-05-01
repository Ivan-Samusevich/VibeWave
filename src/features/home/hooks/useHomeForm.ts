import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { postService } from '../../../services/postService';

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
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const backendPosts = await postService.getPosts();
      
      const mappedPosts: PostData[] = backendPosts.map((p: any) => {
        // Java Entity это postId, а в DTO - id
        const id = p.id || p.postId;
        
        return {
          id: id,
          userName: p.userName || 'Аноним',
          likes: p.likesCount || 0,
          isLiked: p.likeStatus || false,
          text: p.text || '',
          timeAgo: 'Только что', 
          createdAt: Date.now(),
          mediaUrl: p.imageURL || `https://picsum.photos/seed/vibewave-${id}/600/600`,
          mediaType: 'image',
          comments: [] 
        };
      });
      setPosts(mappedPosts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      // Fallback к мок-данным если бэкенд пустой или упал
      if (posts.length === 0) {
        setPosts([
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
            comments: [{ id: 1, userName: 'maria_sky', text: 'Это просто невероятно! 😍' }]
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});
  const [expandedComments, setExpandedComments] = useState<{ [key: number]: boolean }>({});

  const toggleLike = async (postId: number) => {
    if (!postId) {
      console.error('Cannot like post: postId is undefined');
      return;
    }
    try {
      await postService.putLike(postId);
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
    } catch (error) {
      console.error('Failed to like post:', error);
    }
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

  const handleAddPost = async (newPost: { text: string; mediaUrl: string; mediaType: 'image' | 'video' }) => {
    if (!user) return;

    try {
      await postService.createPost(newPost.text);
      
      fetchPosts();
    } catch (error) {
      console.error('Failed to create post:', error);
      // Оптимистичное добавление на случай если работаем оффлайн/без бэкенда
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
    }
  };

  const sortedPosts = [...posts].sort((a, b) => b.createdAt - a.createdAt);

  return {
    user,
    posts: sortedPosts,
    loading,
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
