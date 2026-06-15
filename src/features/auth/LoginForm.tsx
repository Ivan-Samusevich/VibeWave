import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Card } from '../../components/Card';
import { LogIn, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useLoginForm } from './hooks/useLoginForm';

export const LoginForm: React.FC = () => {
  const { register, handleSubmit, errors, error, isSubmitting } = useLoginForm();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-md"
    >
      <Card className="relative overflow-hidden border-zinc-200/80 dark:border-zinc-800/80 shadow-xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-8 rounded-2xl space-y-7">
        {/* Glow Accent Top */}
        <div className="absolute top-0 left-0 right-0 h-0.75 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500" />
        
        <div className="text-center space-y-3">
          {/* Custom Animated Logo */}
          <div className="flex items-center justify-center gap-2 pb-1">
            <motion.div 
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="h-10 w-10 rounded-xl bg-linear-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 flex items-center justify-center shadow-md cursor-pointer"
            >
              <div className="h-full w-full rounded-[10px] bg-zinc-950 flex items-center justify-center">
                <svg className="w-5.5 h-5.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 12c2.5-3 5-3 7.5 0s5 3 7.5 0" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16c2.5-3 5-3 7.5 0s5 3 7.5 0" opacity={0.6} />
                </svg>
              </div>
            </motion.div>
            <span className="text-3xl font-black tracking-tight bg-linear-to-tr from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent select-none">
              VibeWave
            </span>
          </div>
          
          <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mt-2">
            С возвращением!
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Войдите в свой аккаунт, чтобы продолжить общение.
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-start gap-3 rounded-xl bg-red-50/70 p-4 text-xs text-red-600 border border-red-100/60 dark:bg-red-950/20 dark:border-red-900/40 dark:text-red-400"
          >
            <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-500 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold block">Ошибка входа</span>
              <p className="leading-relaxed opacity-90">{error}</p>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email"
            placeholder="name@example.com"
            {...register('email')}
            error={errors.email?.message}
            className="rounded-xl border-zinc-200 dark:border-zinc-805 bg-zinc-50/50 dark:bg-zinc-950/40 focus:bg-white dark:focus:bg-zinc-950 transition-all duration-200"
          />
          <Input
            label="Пароль"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            error={errors.password?.message}
            className="rounded-xl border-zinc-200 dark:border-zinc-805 bg-zinc-50/50 dark:bg-zinc-950/40 focus:bg-white dark:focus:bg-zinc-950 transition-all duration-200"
          />
          <Button 
            type="submit" 
            className="w-full h-11 rounded-xl font-medium bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:scale-[0.98] shadow-lg shadow-indigo-500/10 dark:shadow-none transition-all duration-150 cursor-pointer"
            isLoading={isSubmitting}
          >
            <LogIn className="mr-2 h-4 w-4" />
            Войти в систему
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-zinc-100 dark:border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
            <span className="bg-white px-3 text-zinc-400 dark:bg-zinc-900 dark:text-zinc-500 font-medium select-none">
              Или
            </span>
          </div>
        </div>

        <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
          Нет аккаунта?{' '}
          <Link to="/register" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-705 decoration-skip-ink hover:underline transition-colors">
            Зарегистрироваться
          </Link>
        </p>
      </Card>
    </motion.div>
  );
};
