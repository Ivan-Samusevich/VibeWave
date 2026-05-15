import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Heart, MessageCircle } from 'lucide-react';
import { PostResponse } from '../../../types/api';

interface PostDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPost: PostResponse | null;
  profileAvatar?: string;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  isOpen,
  onClose,
  selectedPost,
  profileAvatar,
}) => {
  return (
    <AnimatePresence>
      {isOpen && selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white dark:bg-zinc-900 w-full max-w-5xl rounded-lg shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh]"
          >
            {/* Media Part */}
            <div className="flex-1 bg-black flex items-center justify-center min-h-75">
              {selectedPost.fileType === "video" ? (
                <video
                  src={selectedPost.imageURL}
                  controls
                  className="max-h-full max-w-full"
                />
              ) : (
                <img
                  src={selectedPost.imageURL}
                  className="max-h-full max-w-full object-contain"
                  alt={selectedPost.text || "Post image"}
                />
              )}
            </div>

            {/* Info Part */}
            <div className="w-full md:w-100 flex flex-col bg-white dark:bg-zinc-900">
              <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 p-0.5">
                    {selectedPost.userAvatarUrl || profileAvatar ? (
                      <img
                        src={selectedPost.userAvatarUrl || profileAvatar}
                        className="h-full w-full rounded-full object-cover border-2 border-white dark:border-zinc-900"
                      />
                    ) : (
                      <div className="h-full w-full rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                        <User className="h-5 w-5 text-zinc-400" />
                      </div>
                    )}
                  </div>
                  <span className="font-bold text-sm dark:text-zinc-100">
                    {selectedPost.userName}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
                >
                  <X className="h-6 w-6 text-zinc-500" />
                </button>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full shrink-0">
                    {selectedPost.userAvatarUrl || profileAvatar ? (
                      <img
                        src={selectedPost.userAvatarUrl || profileAvatar}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                        <User className="h-4 w-4 text-zinc-400" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm dark:text-zinc-300">
                      <span className="font-bold mr-2 dark:text-zinc-100">
                        {selectedPost.userName}
                      </span>
                      {selectedPost.text}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
                <div className="flex items-center gap-4">
                  <Heart
                    className={`h-6 w-6 ${selectedPost.likeStatus ? "text-red-500 fill-red-500" : "dark:text-zinc-100"}`}
                  />
                  <MessageCircle className="h-6 w-6 dark:text-zinc-100" />
                </div>
                <p className="text-sm font-bold dark:text-zinc-100">
                  {selectedPost.likesCount} отметок «Нравится»
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
