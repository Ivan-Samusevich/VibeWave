import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { RootState } from '../../../store';
import { userService } from '../../../services/userService';
import { UserProfileResponse, PostResponse, UserResponse } from '../../../types/api';

export const useProfileForm = () => {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState<UserProfileResponse | null>(null);
  const [userPosts, setUserPosts] = useState<PostResponse[]>([]);
  const [savedPosts, setSavedPosts] = useState<PostResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'tagged'>('posts');
  
  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostResponse | null>(null);
  
  // Follow lists state
  const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
  const [followModalType, setFollowModalType] = useState<'followers' | 'following'>('followers');
  const [followList, setFollowList] = useState<UserResponse[]>([]);
  const [isFollowListLoading, setIsFollowListLoading] = useState(false);
  
  // Edit form state
  const [editDescription, setEditDescription] = useState('');
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState<string | null>(null);

  const isOwnProfile = currentUser?.userName === username;

  const loadProfile = async (targetUsername: string) => {
    setIsLoading(true);
    try {
      const data = await userService.getProfile(targetUsername);
      setProfileData(data);
      setEditDescription(data.description || '');
      
      const posts = await userService.getUserPosts(targetUsername);
      setUserPosts(posts);

      if (isOwnProfile) {
        const saved = await userService.getSavedPosts(targetUsername);
        setSavedPosts(saved);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openFollowModal = async (type: 'followers' | 'following') => {
    if (!username) return;
    setFollowModalType(type);
    setIsFollowModalOpen(true);
    setIsFollowListLoading(true);
    try {
      const data = type === 'followers' 
        ? await userService.getFollowers(username) 
        : await userService.getFollowing(username);
      setFollowList(data);
    } catch (error) {
      console.error('Failed to load follow list:', error);
    } finally {
      setIsFollowListLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      loadProfile(username);
    }
  }, [username]);

  const handleUpdateProfile = async () => {
    try {
      await userService.updateProfile(editDescription, editFile);
      setIsEditModalOpen(false);
      if (username) loadProfile(username);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setEditPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleFollow = async () => {
    if (!username) return;
    try {
      await userService.toggleFollow(username);
      // Toggle state locally
      setProfileData(prev => prev ? {
        ...prev,
        isFollow: !prev.isFollow,
        followerCount: prev.isFollow ? prev.followerCount - 1 : prev.followerCount + 1
      } : null);
    } catch (error) {
      console.error('Follow failed:', error);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Неизвестно';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return {
    username,
    currentUser,
    profileData,
    userPosts,
    savedPosts,
    isLoading,
    activeTab,
    setActiveTab,
    isEditModalOpen,
    setIsEditModalOpen,
    isPostModalOpen,
    setIsPostModalOpen,
    selectedPost,
    setSelectedPost,
    editDescription,
    setEditDescription,
    editPreview,
    handleUpdateProfile,
    handleFileChange,
    handleFollow,
    formatDate,
    isOwnProfile,
    navigate,
    isFollowModalOpen,
    setIsFollowModalOpen,
    followModalType,
    followList,
    isFollowListLoading,
    openFollowModal
  };
};
