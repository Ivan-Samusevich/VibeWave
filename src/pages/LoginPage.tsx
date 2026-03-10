import React from 'react';
import { LoginForm } from '../features/auth/LoginForm';

export const LoginPage: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-zinc-950 transition-colors duration-200">
      <LoginForm />
    </div>
  );
};
