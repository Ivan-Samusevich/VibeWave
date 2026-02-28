import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Card } from '../../components/Card';
import { authService } from '../../services/authService';
import { setCredentials, setLoading, setError } from './authSlice';
import { LogIn } from 'lucide-react';
import { motion } from 'motion/react';

const schema = yup.object({
  email: yup.string().email('Некорректный email').required('Email обязателен'),
  password: yup.string().min(6, 'Минимум 6 символов').required('Пароль обязателен'),
}).required();

export const LoginForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const response = await authService.login(data);
      dispatch(setCredentials(response));
      setIsSuccess(true);
    } catch (err: any) {
      dispatch(setError(err.message));
    } finally {
      setIsSubmitting(false);
      dispatch(setLoading(false));
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md text-center"
      >
        <Card className="space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <LogIn className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900">Успешный вход!</h2>
          <p className="text-zinc-500">Вы успешно авторизованы в VibeWave.</p>
          <Button variant="outline" onClick={() => setIsSuccess(false)} className="w-full">
            Вернуться
          </Button>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <Card className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 font-display">VibeWave</h1>
          <p className="text-zinc-500">С возвращением! Войдите в свой аккаунт.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            <LogIn className="mr-2 h-4 w-4" />
            Войти
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-zinc-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-zinc-500">Или</span>
          </div>
        </div>

        <p className="text-center text-sm text-zinc-600">
          Нет аккаунта?{' '}
          <Link to="/register" className="font-medium text-indigo-600 hover:underline">
            Зарегистрироваться
          </Link>
        </p>
      </Card>
    </motion.div>
  );
};
