import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { postService } from '../../../services/postService';

export interface PostData {
  id: number;
  userName: string;
  avatarURL?: string;
  likes: number;
  isLiked: boolean;
  isSaved: boolean;
  text: string;
  timeAgo: string;
  createdAt: number;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  comments: { id: number; userName: string; text: string; avatarURL?: string }[];
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
          avatarURL: p.avatarURL,
          likes: p.likesCount || 0,
          isLiked: p.liked !== undefined ? p.liked : (p.likeStatus || false),
          isSaved: p.saved || false,
          text: p.text || '',
          timeAgo: 'Только что', 
          createdAt: Date.now(),
          mediaUrl: p.imageURL || `https://picsum.photos/seed/vibewave-${id}/600/600`,
          mediaType: p.fileType === 'video' || (p.imageURL && p.imageURL.toLowerCase().includes('.mp4')) ? 'video' : 'image',
          comments: [] 
        };
      });
      setPosts(mappedPosts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      if (posts.length === 0) {
        setPosts([
          {
            id: 1,
            userName: 'alex_vibe',
            likes: 1234,
            isLiked: false,
            isSaved: false,
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
    
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const newStatus = !post.isLiked;

    try {
      await postService.putLike(postId, newStatus);
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            isLiked: newStatus,
            likes: newStatus ? p.likes + 1 : p.likes - 1
          };
        }
        return p;
      }));
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const toggleSave = async (postId: number) => {
    if (!postId) return;
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const newStatus = !post.isSaved;

    try {
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return { ...p, isSaved: newStatus };
        }
        return p;
      }));

      try {
        await postService.toggleSave(postId, newStatus);
      } catch (e) {
        console.warn('Backend save endpoint might not be ready yet');
      }
    } catch (error) {
      console.error('Failed to save post:', error);
    }
  };

  const toggleComments = async (postId: number) => {
    const isExpanding = !expandedComments[postId];
    setExpandedComments(prev => ({ ...prev, [postId]: isExpanding }));
    
    if (isExpanding) {
      try {
        const backendComments = await postService.getComments(postId);
        setPosts(prev => prev.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments: backendComments.map((c) => ({
                id: c.commentId,
                userName: c.userName,
                text: c.text,
                avatarURL: c.userAvatarUrl
              }))
            };
          }
          return post;
        }));
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    }
  };

  const handleCommentChange = (postId: number, value: string) => {
    setCommentInputs(prev => ({ ...prev, [postId]: value }));
  };

  const addComment = async (postId: number) => {
    const text = commentInputs[postId];
    if (!text?.trim() || !user) return;

    try {
      await postService.addComment(postId, text.trim());
      
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
      const backendComments = await postService.getComments(postId);
      
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: backendComments.map(c => ({
              id: c.commentId,
              userName: c.userName,
              text: c.text,
              avatarURL: c.userAvatarUrl
            }))
          };
        }
        return post;
      }));
      setExpandedComments(prev => ({ ...prev, [postId]: true }));
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState<string>('');

  const startEditComment = (commentId: number, text: string) => {
    setEditingCommentId(commentId);
    setEditCommentText(text);
  };

  const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditCommentText('');
  };

  const saveEditedComment = async (postId: number, commentId: number) => {
    if (!editCommentText.trim()) return;

    try {
      await postService.updateComment(commentId, editCommentText.trim());
      
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.map(c => 
              c.id === commentId ? { ...c, text: editCommentText.trim() } : c
            )
          };
        }
        return post;
      }));
      
      setEditingCommentId(null);
      setEditCommentText('');
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const deleteComment = async (postId: number, commentId: number) => {
    try {
      await postService.deleteComment(commentId);
      
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.filter(c => c.id !== commentId)
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const deletePost = async (postId: number) => {
    try {
      await postService.deletePost(postId);
      setPosts(prev => prev.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const handleAddPost = async (newPost: { text: string; file: File | null; mediaUrl: string; mediaType: 'image' | 'video' }) => {
    if (!user) return;

    try {
      await postService.createPost(newPost.text, newPost.file);
      fetchPosts();
    } catch (error) {
      console.error('Failed to create post:', error);
      const post: PostData = {
        id: Date.now(),
        userName: user.userName,
        likes: 0,
        isLiked: false,
        isSaved: false,
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
  };
};
