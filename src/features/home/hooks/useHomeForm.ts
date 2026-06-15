import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { postService } from '../../../services/postService';
import { formatPostDate } from '../../../utils/date';

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
  comments: { id: number; userName: string; text: string; avatarURL?: string; createdAt?: string }[];
  commentsCount: number;
}

export const useHomeForm = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allPosts, setAllPosts] = useState<PostData[]>([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    try {
      const backendPosts = await postService.getPosts();
      const mappedPosts: PostData[] = backendPosts.map((p: any) => {
        const id = p.id || p.postId;

        return {
          id: id,
          userName: p.userName || 'Аноним',
          avatarURL: p.avatarURL,
          likes: p.likesCount || 0,
          isLiked: p.liked !== undefined ? p.liked : (p.likeStatus || false),
          isSaved: p.saved || false,
          text: p.text || '',
          timeAgo: p.createdAt ? formatPostDate(p.createdAt) : 'Только что',
          createdAt: p.createdAt ? new Date(p.createdAt).getTime() : Date.now(),
          mediaUrl: p.imageURL || `https://picsum.photos/seed/vibewave-${id}/600/600`,
          mediaType: p.fileType === 'video' || (p.imageURL && p.imageURL.toLowerCase().includes('.mp4')) ? 'video' : 'image',
          comments: [],
          commentsCount: p.commentsCount !== undefined ? p.commentsCount : 0
        };
      });
      setAllPosts(mappedPosts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      setAllPosts(prev => prev.length > 0 ? prev : [
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
          comments: [{ id: 1, userName: 'maria_sky', text: 'Это просто невероятно! 😍' }],
          commentsCount: 1
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const posts = useMemo(() => {
    return allPosts.slice(0, visibleCount);
  }, [allPosts, visibleCount]);

  const hasMore = useMemo(() => {
    return visibleCount < allPosts.length;
  }, [visibleCount, allPosts.length]);

  const loadMore = useCallback(() => {
    if (loading) return;
    setVisibleCount(prev => prev + 5);
  }, [loading]);

  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});
  const [expandedComments, setExpandedComments] = useState<{ [key: number]: boolean }>({});

  const toggleLike = useCallback(async (postId: number) => {
    if (!postId) {
      console.error('Cannot like post: postId is undefined');
      return;
    }

    let previousPost: PostData | undefined;

    setAllPosts(prevAll => {
      const post = prevAll.find(p => p.id === postId);
      if (!post) return prevAll;

      previousPost = { ...post };

      const newStatus = !post.isLiked;

      return prevAll.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            isLiked: newStatus,
            likes: newStatus ? p.likes + 1 : p.likes - 1
          };
        }
        return p;
      });
    });

    try {
      await postService.putLike(postId, !previousPost?.isLiked);
    } catch (error) {
      console.error('Failed to like post:', error);
      setAllPosts(rollbackAll => rollbackAll.map(p => {
        if (p.id === postId && previousPost) {
          return {
            ...p,
            isLiked: previousPost.isLiked,
            likes: previousPost.likes
          };
        }
        return p;
      }));
    }
  }, []);

  const toggleSave = useCallback(async (postId: number) => {
    if (!postId) return;

    let previousSavedState: boolean | undefined;

    setAllPosts(prevAll => {
      const post = prevAll.find(p => p.id === postId);
      if (!post) return prevAll;

      previousSavedState = post.isSaved;

      const newStatus = !post.isSaved;

      return prevAll.map(p => {
        if (p.id === postId) {
          return { ...p, isSaved: newStatus };
        }
        return p;
      });
    });

    try {
      await postService.toggleSave(postId, !previousSavedState);
    } catch (error) {
      console.error('Failed to save post:', error);
      setAllPosts(rollbackAll => rollbackAll.map(p => {
        if (p.id === postId && previousSavedState !== undefined) {
          return { ...p, isSaved: previousSavedState };
        }
        return p;
      }));
    }
  }, []);

  const toggleComments = useCallback(async (postId: number) => {
    setExpandedComments(prev => {
      const isExpanding = !prev[postId];

      if (isExpanding) {
        postService.getComments(postId).then(backendComments => {
          setAllPosts(prevAll => prevAll.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                commentsCount: backendComments.length,
                comments: backendComments.map((c) => ({
                  id: c.commentId,
                  userName: c.userName,
                  text: c.text,
                  avatarURL: c.userAvatarUrl,
                  createdAt: c.createdAt
                }))
              };
            }
            return post;
          }));
        }).catch(error => {
          console.error('Failed to fetch comments:', error);
        });
      }
      return { ...prev, [postId]: isExpanding };
    });
  }, []);

  const handleCommentChange = useCallback((postId: number, value: string) => {
    setCommentInputs(prev => ({ ...prev, [postId]: value }));
  }, []);

  const [isSubmitting, setIsSubmitting] = useState<{ [key: number]: boolean }>({});

  const addComment = useCallback(async (postId: number) => {
    const text = commentInputs[postId]; 

    if (!text?.trim() || !user) return;

    if (isSubmitting[postId]) return;

    setIsSubmitting(prev => ({ ...prev, [postId]: true }));

    try {
      await postService.addComment(postId, text.trim());
      const backendComments = await postService.getComments(postId);

      setAllPosts(prevAll => prevAll.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            commentsCount: backendComments.length,
            comments: backendComments.map(c => ({
              id: c.commentId,
              userName: c.userName,
              text: c.text,
              avatarURL: c.userAvatarUrl,
              createdAt: c.createdAt
            }))
          };
        }
        return post;
      }));

      setExpandedComments(prev => ({ ...prev, [postId]: true }));
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));

    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmitting(prev => ({ ...prev, [postId]: false }));
    }
  }, [user, commentInputs, isSubmitting]);

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState<string>('');

  const startEditComment = useCallback((commentId: number, text: string) => {
    setEditingCommentId(commentId);
    setEditCommentText(text);
  }, []);

  const cancelEditComment = useCallback(() => {
    setEditingCommentId(null);
    setEditCommentText('');
  }, []);

  const saveEditedComment = useCallback(async (postId: number, commentId: number) => {
    if (!editCommentText.trim()) return;

    try {
      await postService.updateComment(commentId, editCommentText.trim());

      setAllPosts(prevAll => prevAll.map(post => {
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
  }, [editCommentText]);

  const deleteComment = useCallback(async (postId: number, commentId: number) => {
    try {
      await postService.deleteComment(commentId);

      setAllPosts(prevAll => prevAll.map(post => {
        if (post.id === postId) {
          const updatedComments = post.comments.filter(c => c.id !== commentId);
          return {
            ...post,
            commentsCount: updatedComments.length,
            comments: updatedComments
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  }, []);

  const deletePost = useCallback(async (postId: number) => {
    try {
      await postService.deletePost(postId);
      setAllPosts(prevAll => prevAll.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  }, []);

  const handleAddPost = useCallback(async (newPost: { text: string; file: File | null; mediaUrl: string; mediaType: 'image' | 'video' }) => {
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
        commentsCount: 0,
      };
      setAllPosts(prevAll => [post, ...prevAll]);
    }
  }, [user, fetchPosts]);

  return {
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
    handleAddPost,
    loadMore,
    hasMore
  };
};
