import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Search, X, Loader2, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { userService } from '../services/userService';
import { UserResponse } from '../types/api';

export const UserSearchBar: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserResponse[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const results = await userService.searchUsers(searchQuery, user?.userName);
        setSearchResults(results);
      } catch (err) {
        console.error('Failed to search users:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, user?.userName]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFocus = () => {
    if (searchQuery.trim()) {
      setShowDropdown(true);
    }
  };

  const handleSelectUser = (username: string) => {
    setSearchQuery('');
    setSearchResults([]);
    setShowDropdown(false);
    navigate(`/profile/${username}`);
  };

  return (
    <div ref={containerRef} className="relative flex-1 max-w-35 xs:max-w-[180px] sm:max-w-xs md:max-w-sm mx-2 sm:mx-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Поиск пользователей..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={handleFocus}
          className="w-full rounded-full bg-zinc-100 py-1.5 pl-10 pr-8 text-xs font-medium text-zinc-900 outline-none ring-zinc-200/50 transition-all placeholder:text-zinc-400 hover:bg-zinc-200/60 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 border border-zinc-200/10 dark:bg-zinc-900 dark:text-zinc-100 dark:ring-zinc-800/10 dark:hover:bg-zinc-800/60 dark:focus:bg-zinc-900 dark:border-zinc-800 dark:focus:border-indigo-500"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSearchResults([]);
              setShowDropdown(false);
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
            title="Очистить"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showDropdown && searchQuery.trim() !== '' && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 mt-2 z-50 max-h-72 overflow-y-auto rounded-3xl border border-zinc-200 bg-white/95 p-2 shadow-xl backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/95"
          >
            {isSearching ? (
              <div className="flex items-center justify-center gap-2 py-6 text-xs text-zinc-500 dark:text-zinc-400">
                <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                <span>Ищем пользователей...</span>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-1">
                {searchResults.map((userResult) => (
                  <button
                    key={userResult.userName}
                    onClick={() => handleSelectUser(userResult.userName)}
                    className="cursor-pointer flex w-full items-center gap-3 rounded-2xl p-2 text-left hover:bg-zinc-100/80 dark:hover:bg-zinc-900/80 transition-colors group"
                  >
                    <div className="h-8 w-8 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 p-0.5 shrink-0">
                      {userResult.fileURL ? (
                        <img
                          src={userResult.fileURL}
                          alt={userResult.userName}
                          className="h-full w-full rounded-full object-cover border border-white dark:border-zinc-900"
                        />
                      ) : (
                        <div className="h-full w-full rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                          <User className="h-4 w-4 text-zinc-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-500 transition-colors truncate">
                        {userResult.userName}
                      </span>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate">
                        Просмотреть профиль
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-zinc-400 dark:text-zinc-500">
                Пользователи не найдены
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
