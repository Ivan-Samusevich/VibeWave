import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Navbar } from '../components/NavBar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { User, Settings, Grid, Bookmark, Tag, MapPin, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

export const ProfilePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      
      <main className="mx-auto max-w-4xl px-4 py-8 space-y-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-8 border-zinc-200 shadow-sm">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Avatar */}
              <div className="h-32 w-32 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg">
                {user?.userName?.[0].toUpperCase() || 'U'}
              </div>

              {/* Info */}
              <div className="flex-1 space-y-4 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <h1 className="text-2xl font-bold text-zinc-900">{user?.userName}</h1>
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <Button variant="outline" size="sm" className="h-8">
                      Редактировать профиль
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-center md:justify-start gap-6 text-sm">
                  <span><span className="font-bold">0</span> публикаций</span>
                  <span><span className="font-bold">128</span> подписчиков</span>
                  <span><span className="font-bold">256</span> подписок</span>
                </div>

                <div className="space-y-1">
                  <p className="font-medium text-zinc-900">VibeWave User</p>
                  <p className="text-sm text-zinc-600">Делюсь своим вайбом с миром ✨</p>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs text-zinc-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>Земля</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Регистрация: Март 2024</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Tabs */}
        <div className="border-t border-zinc-200">
          <div className="flex justify-center gap-12 -mt-px">
            <button className="flex items-center gap-2 py-4 border-t-2 border-zinc-900 text-xs font-bold uppercase tracking-widest text-zinc-900">
              <Grid className="h-3 w-3" />
              Публикации
            </button>
            <button className="flex items-center gap-2 py-4 border-t-2 border-transparent text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-600">
              <Bookmark className="h-3 w-3" />
              Сохраненное
            </button>
            <button className="flex items-center gap-2 py-4 border-t-2 border-transparent text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-600">
              <Tag className="h-3 w-3" />
              Отметки
            </button>
          </div>
        </div>

        {/* Empty State */}
        <div className="py-20 text-center space-y-4">
          <div className="mx-auto h-16 w-16 rounded-full border-2 border-zinc-300 flex items-center justify-center text-zinc-400">
            <User className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-zinc-900">Пока нет публикаций</h3>
            <p className="text-zinc-500">Когда вы поделитесь фото, они появятся здесь.</p>
          </div>
          <Button variant="ghost" className="text-indigo-600 hover:text-indigo-700 hover:bg-transparent p-0 h-auto font-medium">
            Поделиться первым фото
          </Button>
        </div>
      </main>
    </div>
  );
};
