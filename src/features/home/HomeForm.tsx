import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../auth/authSlice';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { LogOut, User, Home, Search, PlusSquare, Heart, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const HomeForm: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 font-display">VibeWave</h1>
          <div className="flex items-center gap-6">
            <Home className="h-6 w-6 cursor-pointer text-zinc-900" />
            <Search className="h-6 w-6 cursor-pointer text-zinc-500 hover:text-zinc-900" />
            <PlusSquare className="h-6 w-6 cursor-pointer text-zinc-500 hover:text-zinc-900" />
            <Heart className="h-6 w-6 cursor-pointer text-zinc-500 hover:text-zinc-900" />
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-zinc-200 flex items-center justify-center overflow-hidden">
                <User className="h-5 w-5 text-zinc-500" />
              </div>
              <span className="hidden text-sm font-medium sm:block">{user?.userName}</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => dispatch(logout())}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="space-y-8">
          {/* Placeholder for Feed */}
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-0 overflow-hidden">
                <div className="flex items-center gap-3 p-4">
                  <div className="h-8 w-8 rounded-full bg-zinc-200 flex items-center justify-center">
                    <User className="h-5 w-5 text-zinc-500" />
                  </div>
                  <span className="text-sm font-semibold">user_{i}</span>
                </div>
                <div className="aspect-square bg-zinc-100 flex items-center justify-center">
                  <img 
                    src={`https://picsum.photos/seed/vibewave-${i}/600/600`} 
                    alt="Post content" 
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-4">
                    <Heart className="h-6 w-6 cursor-pointer hover:text-red-500 transition-colors" />
                    <MessageCircle className="h-6 w-6 cursor-pointer hover:text-indigo-500 transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">1,234 likes</p>
                    <p className="text-sm">
                      <span className="font-semibold mr-2">user_{i}</span>
                      This is a placeholder for a post caption. VibeWave is coming soon! #vibes #wave
                    </p>
                  </div>
                  <p className="text-xs text-zinc-400 uppercase">2 hours ago</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};
