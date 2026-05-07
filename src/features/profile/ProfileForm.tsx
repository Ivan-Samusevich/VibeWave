import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  Grid,
  Bookmark,
  Tag,
  MessageCircle,
  UserPlus,
  UserCheck,
  Heart,
  Camera,
  X,
  Calendar,
} from "lucide-react";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { useProfileForm } from "./hooks/useProfileForm";

export const ProfileForm: React.FC = () => {
  const {
    username,
    profileData,
    userPosts,
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
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-8 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
            {/* Avatar Section */}
            <div className="relative group">
              <div className="h-40 w-40 rounded-full bg-linear-to-tr from-indigo-500 via-purple-500 to-pink-500 p-1 flex items-center justify-center shadow-xl">
                {profileData.fileURL ? (
                  <img
                    src={profileData.fileURL}
                    alt={profileData.userName}
                    className="h-full w-full rounded-full border-4 border-white dark:border-zinc-900 object-cover"
                  />
                ) : (
                  <div className="h-full w-full rounded-full border-4 border-white dark:border-zinc-900 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-600 text-5xl font-bold">
                    {profileData.userName?.[0].toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* User Details Section */}
            <div className="flex-1 space-y-5 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                  {profileData.userName}
                </h1>

                <div className="flex items-center justify-center md:justify-start gap-3">
                  {isOwnProfile ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 px-6 font-semibold dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                        onClick={() => setIsEditModalOpen(true)}
                      >
                        Редактировать профиль
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant={
                          profileData.isFollowing ? "outline" : "primary"
                        }
                        size="sm"
                        className={`h-9 px-6 font-semibold transition-all ${profileData.isFollowing
                          ? "dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100 dark:shadow-none"
                          }`}
                        onClick={handleFollow}
                      >
                        {profileData.isFollowing ? (
                          <span className="flex items-center gap-2 font-bold">
                            <UserCheck className="h-4 w-4" /> Вы подписаны
                          </span>
                        ) : (
                          <span className="flex items-center gap-2 font-bold cursor-pointer">
                            <UserPlus className="h-4 w-4" /> Подписаться
                          </span>
                        )}
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-9 px-6 font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 border border-transparent transition-all cursor-pointer"
                        onClick={() =>
                          navigate(`/chat?user=${profileData.userName}`)
                        }
                      >
                        <MessageCircle className="h-4 w-4 mr-2" /> Написать
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 md:flex md:gap-10 text-sm py-2 border-y md:border-none border-zinc-100 dark:border-zinc-800">
                <div className="flex flex-col md:flex-row md:gap-1.5 items-center">
                  <span className="font-bold text-lg md:text-base text-zinc-900 dark:text-zinc-100">
                    {profileData.postCount || 0}
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    публикаций
                  </span>
                </div>
                <div className="flex flex-col md:flex-row md:gap-1.5 items-center cursor-pointer group">
                  <span className="font-bold text-lg md:text-base text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 transition-colors">
                    {profileData.followerCount || 0}
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300">
                    подписчиков
                  </span>
                </div>
                <div className="flex flex-col md:flex-row md:gap-1.5 items-center cursor-pointer group">
                  <span className="font-bold text-lg md:text-base text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 transition-colors">
                    {profileData.followingCount || 0}
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300">
                    подписок
                  </span>
                </div>
              </div>

              {/* Bio Section */}
              <div className="space-y-1.5">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-md mx-auto md:mx-0">
                  {profileData.description || "Нет описания"}
                </p>
              </div>

              {/* Registration Meta */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium bg-zinc-50 dark:bg-zinc-800/50 px-3 py-1.5 rounded-full border border-zinc-100 dark:border-zinc-800">
                  <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Регистрация: {formatDate(profileData.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Tabs */}
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

      {/* Tab Content */}
      <div className="grid grid-cols-3 gap-1 md:gap-6 pt-2">
        {userPosts.length === 0 ? (
          <div className="col-span-3 py-20 text-center space-y-6">
            <div className="mx-auto h-20 w-20 rounded-full border-2 border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-300 dark:text-zinc-700 transform transition hover:scale-110 cursor-default">
              <User className="h-10 w-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                Пока нет публикаций
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400">
                Поделитесь моментами.
              </p>
            </div>
            {isOwnProfile && (
              <Button
                onClick={() => navigate("/")}
                variant="ghost"
                className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 font-bold px-8 cursor-pointer"
              >
                Создать первую публикацию
              </Button>
            )}
          </div>
        ) : (
          userPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => {
                setSelectedPost(post);
                setIsPostModalOpen(true);
              }}
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
          ))
        )}
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl shadow-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold dark:text-zinc-100">
                  Редактировать профиль
                </h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 cursor-pointer"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative h-24 w-24 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700">
                    {editPreview || profileData.fileURL ? (
                      <img
                        src={editPreview || profileData.fileURL}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-12 w-12 text-zinc-300 m-6" />
                    )}
                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera className="text-white h-6 w-6" />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-zinc-500 font-medium whitespace-nowrap">
                    Нажмите на фото, чтобы изменить аватар
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold dark:text-zinc-300">
                    О себе
                  </label>
                  <textarea
                    autoFocus
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none min-h-100px dark:text-zinc-100"
                    placeholder="Расскажите о себе..."
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1 cursor-pointer"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Отмена
                  </Button>
                  <Button
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                    onClick={handleUpdateProfile}
                  >
                    Сохранить
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Post Detail Modal */}
      <AnimatePresence>
        {isPostModalOpen && selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPostModalOpen(false)}
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
                      {selectedPost.userAvatarUrl || profileData.fileURL ? (
                        <img
                          src={selectedPost.userAvatarUrl || profileData.fileURL}
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
                    onClick={() => setIsPostModalOpen(false)}
                    className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
                  >
                    <X className="h-6 w-6 text-zinc-500" />
                  </button>
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full shrink-0">
                      {selectedPost.userAvatarUrl || profileData.fileURL ? (
                        <img
                          src={selectedPost.userAvatarUrl || profileData.fileURL}
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
    </main>
  );
};
