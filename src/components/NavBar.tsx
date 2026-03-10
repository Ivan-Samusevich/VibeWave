import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../features/auth/authSlice';
import { Button } from './Button';
import { LogOut, User, Home, PlusSquare, Sun, Moon, MessageCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="text-2xl font-bold tracking-tight text-zinc-900 font-display dark:text-zinc-50">
          VibeWave
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 text-zinc-600 hover:text-zinc-900 transition-colors dark:text-zinc-400 dark:hover:text-zinc-100">
            <Home className="h-6 w-6" />
          </Link>
          <Link to="/chat" className="p-2 text-zinc-600 hover:text-zinc-900 transition-colors dark:text-zinc-400 dark:hover:text-zinc-100">
            <MessageCircle className="h-6 w-6" />
          </Link>
          <button className="p-2 text-zinc-600 hover:text-zinc-900 transition-colors dark:text-zinc-400 dark:hover:text-zinc-100 cursor-pointer">
            <PlusSquare className="h-6 w-6" />
          </button>
          
          <button 
            onClick={toggleTheme}
            className="p-2 text-zinc-600 hover:text-zinc-900 transition-colors dark:text-zinc-400 dark:hover:text-zinc-100 cursor-pointer"
            title={theme === 'light' ? 'Включить темную тему' : 'Включить светлую тему'}
          >
            {theme === 'light' ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
          </button>

          <div className="h-8 w-px bg-zinc-200 mx-2 dark:bg-zinc-800" />
          
          <div className="flex items-center gap-3">
            <Link to="/profile" className="flex flex-col items-end group">
              <span className="text-sm font-medium text-zinc-900 group-hover:text-indigo-600 transition-colors dark:text-zinc-100 dark:group-hover:text-indigo-400">{user?.userName || 'User'}</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">{user?.email}</span>
            </Link>
            <button 
              onClick={handleLogout}
              className="flex h-10 w-10 items-center justify-center cursor-pointer rounded-full bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-colors dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
              title="Выйти"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
