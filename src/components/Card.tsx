import React from 'react';
import { cn } from '../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={cn('rounded-xl border border-zinc-200 bg-white p-6 shadow-sm', className)}>
      {children}
    </div>
  );
};
