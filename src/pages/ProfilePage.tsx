import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import { Navbar } from '../components/NavBar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { userService } from '../services/userService';
import { ProfileData } from '../types/api';
import { User, Grid, Bookmark, Tag, MapPin, Calendar, MessageCircle, UserPlus, UserCheck, Heart } from 'lucide-react';
import { motion } from 'motion/react';

export const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'tagged'>('posts');

  const isOwnProfile = currentUser?.userName === username;

  useEffect(() => {
    if (username) {
      loadProfile(username);
    }
  }, [username]);

  const loadProfile = async (targetUsername: string) => {
    setIsLoading(true);
    try {
      const data = await userService.getProfile(targetUsername);
      setProfileData(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!profileData?.user.userId) return;
    try {
      await userService.toggleFollow(profileData.user.userId);
      // Toggle state locally
      setProfileData(prev => prev ? {
        ...prev,
        isFollowing: !prev.isFollowing,
        followersCount: prev.isFollowing ? prev.followersCount - 1 : prev.followersCount + 1
      } : null);
    } catch (error) {
      console.error('Follow failed:', error);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Неизвестно';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-center py-20">
        <Navbar />
        <h2 className="text-2xl font-bold">Пользователь не найден</h2>
        <Button onClick={() => navigate('/')} className="mt-4">На главную</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      <Navbar />
      
      <main className="mx-auto max-w-4xl px-4 py-8 space-y-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-8 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
              {/* Avatar */}
              <div className="relative group">
                <div className="h-40 w-40 rounded-full bg-linear-to-tr from-indigo-500 via-purple-500 to-pink-500 p-1 flex items-center justify-center shadow-xl">
                  {profileData.profile.avatar_url ? (
                    <img 
                      src={profileData.profile.avatar_url} 
                      alt={profileData.user.userName}
                      className="h-full w-full rounded-full border-4 border-white dark:border-zinc-900 object-cover"
                    />
                  ) : (
                    <div className="h-full w-full rounded-full border-4 border-white dark:border-zinc-900 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-600 text-5xl font-bold">
                      {profileData.user.userName?.[0].toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 space-y-5 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                    {profileData.user.userName}
                  </h1>
                  
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    {isOwnProfile ? (
                      <>
                        <Button variant="outline" size="sm" className="h-9 px-6 font-semibold dark:border-zinc-700 cursor-pointer">
                          Редактировать профиль
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          variant={profileData.isFollowing ? "outline" : "primary"} 
                          size="sm" 
                          className={`h-9 px-6 font-semibold transition-all ${
                            profileData.isFollowing ? 'dark:border-zinc-700' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                          }`}
                          onClick={handleFollow}
                        >
                          {profileData.isFollowing ? (
                            <span className="flex items-center gap-2"><UserCheck className="h-4 w-4" /> Вы подписаны</span>
                          ) : (
                            <span className="flex items-center gap-2"><UserPlus className="h-4 w-4" /> Подписаться</span>
                          )}
                        </Button>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="h-9 px-6 font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
                          onClick={() => navigate(`/chat?user=${profileData.user.userId}`)}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" /> Написать
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-around md:justify-start md:gap-10 text-sm py-2">
                  <div className="flex flex-col md:flex-row md:gap-1.5 items-center">
                    <span className="font-bold text-lg md:text-base text-zinc-900 dark:text-zinc-100">{profileData.postsCount}</span>
                    <span className="text-zinc-500 dark:text-zinc-400">публикаций</span>
                  </div>
                  <div className="flex flex-col md:flex-row md:gap-1.5 items-center cursor-pointer hover:text-indigo-500 transition-colors">
                    <span className="font-bold text-lg md:text-base text-zinc-900 dark:text-zinc-100">{profileData.followersCount}</span>
                    <span className="text-zinc-500 dark:text-zinc-400">подписчиков</span>
                  </div>
                  <div className="flex flex-col md:flex-row md:gap-1.5 items-center cursor-pointer hover:text-indigo-500 transition-colors">
                    <span className="font-bold text-lg md:text-base text-zinc-900 dark:text-zinc-100">{profileData.followingCount}</span>
                    <span className="text-zinc-500 dark:text-zinc-400">подписок</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-md mx-auto md:mx-0">
                    {profileData.profile.description || 'Нет описания'}
                  </p>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Регистрация: {formatDate(profileData.user.createdAt)}</span>
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
              onClick={() => setActiveTab('posts')}
              className={`cursor-pointer flex items-center gap-2 py-4 border-t-2 transition-all text-xs font-bold uppercase tracking-widest ${
                activeTab === 'posts' 
                  ? 'border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100' 
                  : 'border-transparent text-zinc-400 hover:text-zinc-600'
              }`}
            >
              <Grid className="h-4 w-4" />
              Публикации
            </button>
            {isOwnProfile && (
              <button 
                onClick={() => setActiveTab('saved')}
                className={`cursor-pointer flex items-center gap-2 py-4 border-t-2 transition-all text-xs font-bold uppercase tracking-widest ${
                  activeTab === 'saved' 
                    ? 'border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100' 
                    : 'border-transparent text-zinc-400 hover:text-zinc-600'
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
          {profileData.postsCount === 0 ? (
            <div className="col-span-3 py-20 text-center space-y-6">
              <div className="mx-auto h-20 w-20 rounded-full border-2 border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-300 dark:text-zinc-700 transform transition hover:scale-110 cursor-default">
                <User className="h-10 w-10" />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Пока нет публикаций</h3>
                <p className="text-zinc-500 dark:text-zinc-400">Когда вы поделитесь фото, они появятся здесь.</p>
              </div>
              {isOwnProfile && (
                <Button 
                  onClick={() => navigate('/')}
                  variant="ghost" 
                  className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 font-bold px-8"
                >
                  Создать первую публикацию
                </Button>
              )}
            </div>
          ) : (
            // Placeholder grid
            Array.from({ length: Math.min(6, profileData.postsCount) }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="aspect-square bg-zinc-200 dark:bg-zinc-800 rounded-sm overflow-hidden relative group cursor-pointer"
              >
                <img 
                  src={`https://picsum.photos/seed/vibe-${profileData.user.userName}-${i}/600/600`}
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-110 group-hover:brightness-50"
                  alt="Post"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-white font-bold gap-6 transition duration-300">
                  <div className="flex items-center gap-2"><Heart className="h-5 w-5 fill-white" /> 24</div>
                  <div className="flex items-center gap-2"><MessageCircle className="h-5 w-5 fill-white" /> 8</div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};
