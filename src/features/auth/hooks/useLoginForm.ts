import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../services/authService';
import { setCredentials, setLoading, setError } from '../authSlice';
import { RootState } from '../../../store';

const schema = yup.object({
  email: yup.string().email('Некорректный email').required('Email обязателен'),
  password: yup.string().min(8, 'Минимум 8 символов').required('Пароль обязателен'),
}).required();

export const useLoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state: RootState) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      navigate('/');
    } catch (err: any) {
      const message = err.response?.data?.message || err.response?.data || err.message || 'Ошибка входа';
      dispatch(setError(message));
    } finally {
      setIsSubmitting(false);
      dispatch(setLoading(false));
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    error,
    isSubmitting
  };
};
