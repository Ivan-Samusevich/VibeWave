import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../features/auth/authSlice';
import { LogOut, Home, PlusSquare, Sun, Moon, MessageCircle, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { UserSearchBar } from './UserSearchBar';

interface NavbarProps {
  onAddPostClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onAddPostClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  const { theme, toggleTheme } = useTheme();

  const isChatThreadActive = location.pathname === '/chat' && location.search.includes('user=');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-3 sm:px-4">
          <Link to="/" className="text-xl xs:text-2xl font-bold tracking-tight text-zinc-900 font-display dark:text-zinc-50 shrink-0">
            VibeWave
          </Link>

          <UserSearchBar />

          <div className="flex items-center gap-1 xs:gap-2 sm:gap-4 scrollbar-none">
            <Link to="/" className="hidden sm:inline-flex p-2 text-zinc-600 hover:text-zinc-900 transition-colors dark:text-zinc-400 dark:hover:text-zinc-100" title="Главная">
              <Home className="h-6 w-6" />
            </Link>
            <Link to="/chat" className="hidden sm:inline-flex p-2 text-zinc-600 hover:text-zinc-900 transition-colors dark:text-zinc-400 dark:hover:text-zinc-100" title="Чаты">
              <MessageCircle className="h-6 w-6" />
            </Link>
            <button 
              onClick={onAddPostClick}
              className="hidden sm:inline-flex p-2 text-zinc-600 hover:text-zinc-900 transition-colors dark:text-zinc-400 dark:hover:text-zinc-100"
              title="Создать пост"
            >
              <PlusSquare className="h-6 w-6" />
            </button>

            <button 
              onClick={toggleTheme}
              className="p-1.5 xs:p-2 text-zinc-600 hover:text-zinc-900 transition-colors dark:text-zinc-400 dark:hover:text-zinc-100"
              title={theme === 'light' ? 'Включить темную тему' : 'Включить светлую тему'}
            >
              {theme === 'light' ? <Moon className="h-5 w-5 xs:h-6 xs:w-6" /> : <Sun className="h-5 w-5 xs:h-6 xs:w-6" />}
            </button>

            <div className="hidden sm:block h-8 w-px bg-zinc-200 mx-2 dark:bg-zinc-800" />
            
            <div className="flex items-center gap-2 xs:gap-3">
              <Link to={user ? `/profile/${user.userName}` : '/login'} className="hidden md:flex flex-col items-end group shrink-0">
                <span className="text-sm font-medium text-zinc-900 group-hover:text-indigo-600 transition-colors dark:text-zinc-100 dark:group-hover:text-indigo-400">
                  {user?.userName || 'Пользователь'}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {user?.email}
                </span>
              </Link>

              <button 
                onClick={handleLogout}
                className="flex h-8 w-8 xs:h-10 xs:w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-colors dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100 shrink-0"
                title="Выйти"
              >
                <LogOut className="h-4 w-4 xs:h-5 xs:w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {user && !isChatThreadActive && (
        <div className="fixed bottom-0 left-0 right-0 z-50 h-16 border-t border-zinc-200 bg-white/95 backdrop-blur-md flex items-center justify-around px-4 sm:hidden dark:border-zinc-800 dark:bg-zinc-950/95 transition-colors">
          <Link to="/" className="p-2 text-zinc-600 hover:text-zinc-900 active:scale-95 transition-all dark:text-zinc-400 dark:hover:text-zinc-100 flex flex-col items-center justify-center">
            <Home className="h-6 w-6" />
          </Link>
          
          <Link to="/chat" className="p-2 text-zinc-600 hover:text-zinc-900 active:scale-95 transition-all dark:text-zinc-400 dark:hover:text-zinc-100 flex flex-col items-center justify-center">
            <MessageCircle className="h-6 w-6" />
          </Link>
          
          <button 
            onClick={onAddPostClick}
            className="p-3 bg-indigo-600 hover:bg-indigo-700 active:scale-90 text-white rounded-2xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center -translate-y-2 border-4 border-white dark:border-zinc-950"
          >
            <PlusSquare className="h-6 w-6" />
          </button>

          <Link to={`/profile/${user.userName}`} className="p-2 text-zinc-600 hover:text-zinc-900 active:scale-95 transition-all dark:text-zinc-400 dark:hover:text-zinc-100 flex flex-col items-center justify-center">
            <div className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-[11px] font-black text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-zinc-200 dark:border-zinc-800">
              {user.userName ? user.userName.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
            </div>
          </Link>
        </div>
      )}
    </>
  );
};
