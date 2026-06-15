import React from 'react';
import { Navbar } from '../components/NavBar';
import { ProfileForm } from '../features/profile/ProfileForm';

export const ProfilePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      <Navbar />
      <ProfileForm />
    </div>
  );
};
