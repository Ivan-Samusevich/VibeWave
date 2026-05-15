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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <Card className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 font-display dark:text-zinc-50">VibeWave</h1>
          <p className="text-zinc-500 dark:text-zinc-400">С возвращением! Войдите в свой аккаунт.</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100"
          >
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            placeholder="name@example.com"
            {...register('email')}
            error={errors.email?.message}
          />
          <Input
            label="Пароль"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            error={errors.password?.message}
          />
          <Button type="submit" className="w-full cursor-pointer" isLoading={isSubmitting}>
            <LogIn className="mr-2 h-4 w-4" />
            Войти
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">Или</span>
          </div>
        </div>

        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          Нет аккаунта?{' '}
          <Link to="/register" className="font-medium text-indigo-600 hover:underline">
            Зарегистрироваться
          </Link>
        </p>
      </Card>
    </motion.div>
  );
};
