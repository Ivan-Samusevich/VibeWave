import React from 'react';
import { Navbar } from '../../components/NavBar';
import { CreatePostModal } from '../../components/CreatePostModal';
import { useHomeForm } from './hooks/useHomeForm';
import { PostCard } from './components/PostCard';

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
                onToggleComments={toggleComments}
                onCommentChange={handleCommentChange}
                onAddComment={addComment}
                onStartEditComment={startEditComment}
                onCancelEditComment={cancelEditComment}
                onSaveEditedComment={saveEditedComment}
                onDeleteComment={deleteComment}
                setEditCommentText={setEditCommentText}
              />
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
