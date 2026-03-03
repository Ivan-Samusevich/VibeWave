export interface User {
  userId?: number;
  username: string;
  email: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile {
  userProfileId: number;
  description?: string;
  avatarUrl?: string;
  isActive: boolean;
}

export interface Post {
  postId: number;
  userId: number;
  caption: string;
  location?: string;
  createdAt: string;
  updatedAt?: string;
  media?: Media[];
  user?: User; // Для отображения автора поста
}

export interface Media {
  mediaId: number;
  postId: number;
  mediaUrl: string;
  mediaType: 'IMAGE' | 'VIDEO';
  createdAt: string;
}

export interface Comment {
  commentId: number;
  postId: number;
  userId: number;
  parentId?: number;
  content: string;
  createdAt: string;
  user?: User;
}

export interface ApiError {
  message: string;
  errorCode: string;
  status: number;
}
