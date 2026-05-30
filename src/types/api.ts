export interface User {
  userId?: number;
  userName: string;
  email: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfileResponse {
  userName: string;
  postCount: number;
  followerCount: number;
  followingCount: number;
  description?: string;
  fileURL?: string;
  createdAt?: string;
  isFollowing?: boolean;
}

export interface UserResponse {
  userName: string;
  fileURL?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface FollowResponse {
  userName: string;
  fileURL?: string;
}

export interface PostResponse {
  id: number;
  userName: string;
  text: string;
  likesCount: number;
  likeStatus?: boolean;
  isLiked?: boolean;
  imageURL: string;
  fileType: 'image' | 'video' | string;
  avatarURL?: string;
  isSaved?: boolean;
  commentsCount?: number;
}

export interface CommentResponse {
  commentId: number;
  userName: string;
  text: string;
  avatarURL?: string;
  userAvatarUrl?: string;
}

export interface Media {
  mediaId: number;
  postId: number;
  mediaUrl: string;
  mediaType: 'IMAGE' | 'VIDEO';
  createdAt: string;
}

export interface ChatResponse {
  chatId: number;
  userName: string;
}

export interface MessageResponse {
  messageId: number;
  userName: string;
  text: string;
  createdAt: string;
}

export interface SendMessageRequest {
  receiverUserName: string;
  text: string;
}

export interface ApiError {
  message: string;
  errorCode: string;
  status: number;
}
