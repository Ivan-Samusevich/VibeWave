export interface User {
  userId?: number;
  userName: string;
  email: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile {
  userProfileId: number;
  description?: string;
  avatar_url?: string;
  is_active: boolean;
}

export interface Post {
  postId: number;
  userId: number;
  text: string;
  location?: string;
  createdAt: string;
  updatedAt?: string;
  media?: Media[];
  user?: User; 
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

export interface Message {
  messageId: number;
  senderId: number;
  receiverId: number;
  text: string;
  createdAt: string;
}

export interface ApiError {
  message: string;
  errorCode: string;
  status: number;
}
