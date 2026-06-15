import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Grid, Bookmark, X } from "lucide-react";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { useProfileForm } from "./hooks/useProfileForm";
import { UserResponse } from "../../types/api";
import { ProfileHeader } from "./components/ProfileHeader";
import { PostGrid } from "./components/PostGrid";
import { EditProfileModal } from "./components/EditProfileModal";
import { PostDetailModal } from "./components/PostDetailModal";

export const ProfileForm: React.FC = () => {
  const {
    profileData,
    userPosts,
    savedPosts,
    isLoading,
    activeTab,
    setActiveTab,
    isEditModalOpen,
    setIsEditModalOpen,
    isPostModalOpen,
    setIsPostModalOpen,
    selectedPost,
    setSelectedPost,
    editDescription,
    setEditDescription,
    editPreview,
    handleUpdateProfile,
    handleFileChange,
    handleFollow,
    formatDate,
    isOwnProfile,
    navigate,
    isFollowModalOpen,
    setIsFollowModalOpen,
    followModalType,
    followList,
    isFollowListLoading,
    openFollowModal
  } = useProfileForm();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Пользователь не найден</h2>
        <Button onClick={() => navigate("/")} className="mt-4">
          На главную
        </Button>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-8 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <div className="space-y-6">
            <ProfileHeader
              profileData={profileData}
              isOwnProfile={isOwnProfile}
              onEditClick={() => setIsEditModalOpen(true)}
              onFollow={handleFollow}
              onMessage={() => navigate(`/chat?user=${profileData.userName}`)}
              formatDate={formatDate}
              postCount={profileData.postCount}
              followerCount={profileData.followerCount}
              followingCount={profileData.followingCount}
              onFollowersClick={() => openFollowModal('followers')}
              onFollowingClick={() => openFollowModal('following')}
            />
          </div>
        </Card>
      </motion.div>

      <div className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex justify-center gap-12 -mt-px">
          <button
            onClick={() => setActiveTab("posts")}
            className={`cursor-pointer flex items-center gap-2 py-4 border-t-2 transition-all text-xs font-bold uppercase tracking-widest ${activeTab === "posts"
              ? "border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100"
              : "border-transparent text-zinc-400 hover:text-zinc-600"
              }`}
          >
            <Grid className="h-4 w-4" />
            Публикации
          </button>
          {isOwnProfile && (
            <button
              onClick={() => setActiveTab("saved")}
              className={`cursor-pointer flex items-center gap-2 py-4 border-t-2 transition-all text-xs font-bold uppercase tracking-widest ${activeTab === "saved"
                ? "border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100"
                : "border-transparent text-zinc-400 hover:text-zinc-600"
                }`}
            >
              <Bookmark className="h-4 w-4" />
              Сохраненное
            </button>
          )}
        </div>
      </div>

      <PostGrid
        posts={activeTab === 'posts' ? userPosts : savedPosts}
        isOwnProfile={isOwnProfile && activeTab === 'posts'}
        onPostClick={(post) => {
          setSelectedPost(post);
          setIsPostModalOpen(true);
        }}
        onHomeClick={() => navigate('/')}
      />

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profileData={profileData}
        editDescription={editDescription}
        editPreview={editPreview}
        setEditDescription={setEditDescription}
        onFileChange={handleFileChange}
        onUpdate={handleUpdateProfile}
      />

      <PostDetailModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        selectedPost={selectedPost}
        profileAvatar={profileData.fileURL}
      />

      <FollowListModal
        isOpen={isFollowModalOpen}
        onClose={() => setIsFollowModalOpen(false)}
        type={followModalType}
        users={followList}
        isLoading={isFollowListLoading}
        onUserClick={(uname) => {
          setIsFollowModalOpen(false);
          navigate(`/profile/${uname}`);
        }}
      />
    </main>
  );
};

const ProfileAvatar: React.FC<{ url?: string; name?: string; className?: string; borderSize?: string }> = ({ url, name, className, borderSize = "border-2" }) => (
  <div className={`${className} rounded-full bg-linear-to-tr from-indigo-500 via-purple-500 to-pink-500 p-1 flex items-center justify-center shadow-xl`}>
    {url ? (
      <img
        src={url}
        alt={name}
        className={`h-full w-full rounded-full ${borderSize} border-white dark:border-zinc-900 object-cover`}
        referrerPolicy="no-referrer"
      />
    ) : (
      <div className={`h-full w-full rounded-full ${borderSize} border-white dark:border-zinc-900 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-600 font-bold uppercase`}>
        {name?.[0]}
      </div>
    )}
  </div>
);

const FollowListModal: React.FC<{
  isOpen: boolean; onClose: () => void; type: 'followers' | 'following'; users: UserResponse[]; isLoading: boolean; onUserClick: (uname: string) => void
}> = ({ isOpen, onClose, type, users, isLoading, onUserClick }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white dark:bg-zinc-900 w-full max-w-sm rounded-2xl shadow-2xl p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <h2 className="text-lg font-bold dark:text-zinc-100 capitalize">
              {type === 'followers' ? 'Подписчики' : 'Подписки'}
            </h2>
            <button onClick={onClose} className="text-zinc-500 hover:text-zinc-700 cursor-pointer"><X className="h-5 w-5" /></button>
          </div>

          <div className="max-h-100 overflow-y-auto px-6 py-4">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
                {type === 'followers' ? 'Нет подписчиков' : 'Нет подписок'}
              </div>
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.userName} className="flex items-center justify-between group cursor-pointer" onClick={() => onUserClick(user.userName)}>
                    <div className="flex items-center gap-3">
                      <ProfileAvatar url={user.fileURL} name={user.userName} className="h-10 w-10 text-sm" />
                      <span className="font-bold text-sm dark:text-zinc-100 group-hover:text-indigo-500 transition-colors">{user.userName}</span>
                    </div>
                    <Button variant="outline" size="sm" className="h-8 px-4 text-xs font-bold cursor-pointer">Профиль</Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
