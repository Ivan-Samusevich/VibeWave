import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Card } from '../../../components/Card';
import { PostHeader } from './PostHeader';
import { PostMedia } from './PostMedia';
import { PostActions } from './PostActions';
import { CommentsSection } from './CommentsSection';

interface Comment {
  id: number;
  userName: string;
  userAvatarUrl?: string;
  text: string;
}

interface Post {
  id: number;
  userName: string;
  userAvatarUrl?: string;
  mediaUrl: string;
  mediaType: string;
  text: string;
  likes: number;
  isLiked: boolean;
  isSaved: boolean;
  timeAgo: string;
  comments: Comment[];
}

interface PostCardProps {
  post: Post;
  currentUser: { userName: string } | null;
  commentInput: string;
  isExpanded: boolean;
  editingCommentId: number | null;
  editCommentText: string;
  onDeletePost: (id: number) => void;
  onToggleLike: (id: number) => void;
  onToggleSave: (id: number) => void;
  onToggleComments: (id: number) => void;
  onCommentChange: (id: number, text: string) => void;
  onAddComment: (id: number) => void;
  onStartEditComment: (commentId: number, text: string) => void;
  onCancelEditComment: () => void;
  onSaveEditedComment: (postId: number, commentId: number) => void;
  onDeleteComment: (postId: number, commentId: number) => void;
  setEditCommentText: (text: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUser,
  commentInput,
  isExpanded,
  editingCommentId,
  editCommentText,
  onDeletePost,
  onToggleLike,
  onToggleSave,
  onToggleComments,
  onCommentChange,
  onAddComment,
  onStartEditComment,
  onCancelEditComment,
  onSaveEditedComment,
  onDeleteComment,
  setEditCommentText,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-0 overflow-hidden border-zinc-200 dark:border-zinc-800">
        <PostHeader 
          userName={post.userName}
          userAvatarUrl={post.userAvatarUrl}
          isOwner={currentUser?.userName === post.userName}
          onDelete={() => onDeletePost(post.id)}
        />
        
        <PostMedia 
          mediaUrl={post.mediaUrl}
          mediaType={post.mediaType}
        />

        <div className="p-4 space-y-3">
          <PostActions 
            isLiked={post.isLiked}
            isSaved={post.isSaved}
            commentsCount={post.comments.length}
            onLike={() => onToggleLike(post.id)}
            onToggleComments={() => onToggleComments(post.id)}
            onSave={() => onToggleSave(post.id)}
          />
          
          <div className="space-y-1">
            <p className="text-sm font-semibold dark:text-zinc-100">
              {post.likes.toLocaleString()} отметок «Нравится»
            </p>
            <p className="text-sm dark:text-zinc-300">
              <Link to={`/profile/${post.userName}`} className="font-semibold mr-2 dark:text-zinc-100 hover:text-indigo-500 transition-colors">
                {post.userName}
              </Link>
              {post.text}
            </p>
          </div>

          <CommentsSection 
            postId={post.id}
            comments={post.comments}
            isExpanded={isExpanded}
            currentUser={currentUser}
            commentInput={commentInput}
            editingCommentId={editingCommentId}
            editCommentText={editCommentText}
            onCommentChange={(text) => onCommentChange(post.id, text)}
            onAddComment={() => onAddComment(post.id)}
            onToggleComments={() => onToggleComments(post.id)}
            onStartEdit={onStartEditComment}
            onCancelEdit={onCancelEditComment}
            onSaveEdit={(commentId) => onSaveEditedComment(post.id, commentId)}
            onDeleteComment={(commentId) => onDeleteComment(post.id, commentId)}
            setEditCommentText={setEditCommentText}
          />

          <p className="text-[10px] text-zinc-400 uppercase tracking-wider">{post.timeAgo}</p>
        </div>
      </Card>
    </motion.div>
  );
};
