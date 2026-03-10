import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Card } from '../../components/Card';
import { UserPlus, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useRegisterForm } from './hooks/useRegisterForm';

export const RegisterForm: React.FC = () => {
  const { register, handleSubmit, errors, error, isSubmitting } = useRegisterForm();

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
          <p className="text-zinc-500 dark:text-zinc-400">Создайте аккаунт, чтобы начать делиться вайбом.</p>
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
            label="Полное имя"
            placeholder="Иван Иванов"
            {...register('fullName')}
            error={errors.fullName?.message}
          />
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
          <Input
            label="Подтвердите пароль"
            type="password"
            placeholder="••••••••"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />
          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            <UserPlus className="mr-2 h-4 w-4" />
            Создать аккаунт
          </Button>
        </form>

        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:underline">
            Войти
          </Link>
        </p>
      </Card>
    </motion.div>
  );
};
