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
import { UserPlus } from 'lucide-react';
import { motion } from 'motion/react';

const schema = yup.object({
  fullName: yup.string().required('Имя обязательно'),
  email: yup.string().email('Некорректный email').required('Email обязателен'),
  password: yup.string().min(6, 'Минимум 6 символов').required('Пароль обязателен'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Пароли должны совпадать')
    .required('Подтверждение пароля обязательно'),
}).required();

export const RegisterForm: React.FC = () => {
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
      const response = await authService.register(data);
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
            <UserPlus className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900">Регистрация успешна!</h2>
          <p className="text-zinc-500">Добро пожаловать в VibeWave. Ваш аккаунт создан.</p>
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
          <p className="text-zinc-500">Создайте аккаунт, чтобы начать делиться вайбом.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        <p className="text-center text-sm text-zinc-600">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:underline">
            Войти
          </Link>
        </p>
      </Card>
    </motion.div>
  );
};
