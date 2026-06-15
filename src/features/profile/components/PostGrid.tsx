import React from 'react';
import { motion } from 'motion/react';
import { Heart, User } from 'lucide-react';
import { Button } from '../../../components/Button';
import { PostResponse } from '../../../types/api';

interface PostGridProps {
  posts: PostResponse[];
  isOwnProfile: boolean;
  onPostClick: (post: PostResponse) => void;
  onHomeClick: () => void;
}

export const PostGrid: React.FC<PostGridProps> = ({ posts, isOwnProfile, onPostClick, onHomeClick }) => {
  if (posts.length === 0) {
    return (
      <div className="col-span-3 py-20 text-center space-y-6">
        <div className="mx-auto h-20 w-20 rounded-full border-2 border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-300 dark:text-zinc-700">
          <User className="h-10 w-10" />
        </div>
        <div className="space-y-1">
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Пока нет публикаций
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400">Поделитесь моментами.</p>
        </div>
        {isOwnProfile && (
          <Button
            onClick={onHomeClick}
            variant="ghost"
            className="text-indigo-600 font-bold px-8"
          >
            Создать первую публикацию
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1 md:gap-6 pt-2">
      {posts.map((post, i) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          onClick={() => onPostClick(post)}
          className="aspect-square bg-zinc-200 dark:bg-zinc-800 rounded-sm overflow-hidden relative group cursor-pointer"
        >
          {post.fileType === "video" ? (
            <video
              src={post.imageURL}
              className="w-full h-full object-cover transition duration-500 group-hover:brightness-50"
            />
          ) : (
            <img
              src={post.imageURL}
              className="w-full h-full object-cover transition duration-500 group-hover:scale-110 group-hover:brightness-50"
              alt="Post"
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-white font-bold gap-6 transition duration-300">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 fill-white" /> {post.likesCount}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
