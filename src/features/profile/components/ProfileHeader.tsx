import React from 'react';
import { UserCheck, UserPlus, MessageCircle, Calendar } from 'lucide-react';
import { Button } from '../../../components/Button';
import { ProfileStats } from './ProfileStats';

interface ProfileHeaderProps {
    profileData: any;
    isOwnProfile: boolean;
    onEditClick: () => void;
    onFollow: () => void;
    onMessage: () => void;
    formatDate: (date: string) => string;
    postCount: number;
    followerCount: number;
    followingCount: number;
    onFollowersClick: () => void;
    onFollowingClick: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    profileData,
    isOwnProfile,
    onEditClick,
    onFollow,
    onMessage,
    formatDate,
    postCount,
    followerCount,
    followingCount,
    onFollowersClick,
    onFollowingClick,
}) => {
    return (
        <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
            {/* Avatar Section */}
            <div className="relative group">
                <div className="h-40 w-40 rounded-full bg-linear-to-tr from-indigo-500 via-purple-500 to-pink-500 p-1 flex items-center justify-center shadow-xl">
                    {profileData.fileURL ? (
                        <img
                            src={profileData.fileURL}
                            alt={profileData.userName}
                            className="h-full w-full rounded-full border-4 border-white dark:border-zinc-900 object-cover"
                        />
                    ) : (
                        <div className="h-full w-full rounded-full border-4 border-white dark:border-zinc-900 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-600 text-5xl font-bold">
                            {profileData.userName?.[0].toUpperCase()}
                        </div>
                    )}
                </div>
            </div>

            {/* User Details Section */}
            <div className="flex-1 space-y-5 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                        {profileData.userName}
                    </h1>

                    <div className="flex items-center justify-center md:justify-start gap-3">
                        {isOwnProfile ? (
                            <Button
                                variant="outline"
                                size="sm"
                                className="cursor-pointer h-9 px-6 font-semibold dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                                onClick={onEditClick}
                            >
                                Редактировать профиль
                            </Button>
                        ) : (
                            <>
                                <Button
                                    variant={profileData.isFollow ? "outline" : "primary"}
                                    size="sm"
                                    className={`cursor-pointer h-9 px-6 font-semibold transition-all ${profileData.isFollow
                                        ? "dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                                        : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
                                        }`}
                                    onClick={onFollow}
                                >
                                    {profileData.isFollow ? (
                                        <span className="flex items-center gap-2 font-bold">
                                            <UserCheck className="h-4 w-4" /> Вы подписаны
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2 font-bold">
                                            <UserPlus className="h-4 w-4" /> Подписаться
                                        </span>
                                    )}
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="cursor-pointer h-9 px-6 font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                    onClick={onMessage}
                                >
                                    <MessageCircle className="h-4 w-4 mr-2" /> Написать
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                <ProfileStats
                    postCount={postCount}
                    followerCount={followerCount}
                    followingCount={followingCount}
                    onFollowersClick={onFollowersClick}
                    onFollowingClick={onFollowingClick}
                />



                {/* Bio Section */}
                <div className="space-y-1.5">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-md mx-auto md:mx-0">
                        {profileData.description || "Нет описания"}
                    </p>
                </div>

                {/* Registration Meta */}
                <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium bg-zinc-50 dark:bg-zinc-800/50 px-3 py-1.5 rounded-full border border-zinc-100 dark:border-zinc-800">
                        <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                        <span>Регистрация: {formatDate(profileData.createdAt)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
