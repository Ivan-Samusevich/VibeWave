import React, { useState, useRef, useEffect } from 'react';
import { Navbar } from '../../components/NavBar';
import { CreatePostModal } from '../../components/CreatePostModal';
import { useHomeForm } from './hooks/useHomeForm';
import { PostCard } from './components/PostCard';
import { CommentsModal } from './components/CommentsModal';

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
    handleAddPost,
    loadMore,
    hasMore,
  } = useHomeForm();

  const [commentsModalPostId, setCommentsModalPostId] = useState<number | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  const handleOpenCommentsModal = (postId: number) => {
    setCommentsModalPostId(postId);
    if (!expandedComments[postId]) {
      toggleComments(postId);
    }
  };

  const selectedPostForComments = posts.find(p => p.id === commentsModalPostId) || null;

  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '120px' }
    );

    observer.observe(target);
    return () => {
      observer.unobserve(target);
    };
  }, [hasMore, loadMore]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-200">
      <Navbar onAddPostClick={() => setIsModalOpen(true)} />

      <main className="mx-auto max-w-2xl px-4 py-8 pb-24 sm:pb-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-zinc-500 animate-pulse">Загрузка ленты...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={user}
                commentInput={commentInputs[post.id] || ''}
                isExpanded={expandedComments[post.id]}
                editingCommentId={editingCommentId}
                editCommentText={editCommentText}
                onDeletePost={deletePost}
                onToggleLike={toggleLike}
                onToggleSave={toggleSave}
                onToggleComments={handleOpenCommentsModal}
                onCommentChange={handleCommentChange}
                onAddComment={addComment}
                onStartEditComment={startEditComment}
                onCancelEditComment={cancelEditComment}
                onSaveEditedComment={saveEditedComment}
                onDeleteComment={deleteComment}
                setEditCommentText={setEditCommentText}
              />
            ))}

            {hasMore ? (
              <div 
                ref={observerTarget} 
                className="flex flex-col items-center justify-center p-6 space-y-2"
                id="infinite-scroll-trigger"
              >
                <div className="h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-[11px] text-zinc-400 select-none">Загрузка новых публикаций...</span>
              </div>
            ) : (
              posts.length > 0 && (
                <div className="py-6 text-center select-none">
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 font-normal">
                    Вы просмотрели все публикации
                  </p>
                </div>
              )
            )}
          </div>
        )}
      </main>

      <CreatePostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAddPost={handleAddPost} 
      />

      <CommentsModal
        isOpen={commentsModalPostId !== null}
        onClose={() => setCommentsModalPostId(null)}
        post={selectedPostForComments}
        currentUser={user}
        commentInput={commentsModalPostId ? (commentInputs[commentsModalPostId] || '') : ''}
        editingCommentId={editingCommentId}
        editCommentText={editCommentText}
        onCommentChange={(text) => commentsModalPostId && handleCommentChange(commentsModalPostId, text)}
        onAddComment={() => commentsModalPostId && addComment(commentsModalPostId)}
        onStartEdit={startEditComment}
        onCancelEdit={cancelEditComment}
        onSaveEdit={(commentId) => commentsModalPostId && saveEditedComment(commentsModalPostId, commentId)}
        onDeleteComment={(commentId) => commentsModalPostId && deleteComment(commentsModalPostId, commentId)}
        setEditCommentText={setEditCommentText}
      />
    </div>
  );
};
