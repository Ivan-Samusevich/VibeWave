export interface User {
  userId?: number;
  userName: string;
  email: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
}

// export interface UserProfile {
//   userProfileId: number;
//   description?: string;
//   avatar_url?: string;
//   is_active: boolean;
// }

// export interface Post {
//   postId: number;
//   userId: number;
//   text: string;
//   likesCount: number;
//   likeStatus: boolean;
//   imageURL: string;
//   userName: string;
//   createdAt: string;
//   updatedAt?: string;
//   user?: User;
// }

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

export interface PostResponse {
  id: number;
  userName: string;
  text: string;
  likesCount: number;
  likeStatus: boolean;
  imageURL: string;
  fileType: 'image' | 'video' | string;
  userAvatarUrl?: string;
  isSaved?: boolean;
}

export interface CommentResponse {
  commentId: number;
  userName: string;
  text: string;
  userAvatarUrl?: string; // Avatar
}

export interface Media {
  mediaId: number;
  postId: number;
  mediaUrl: string;
  mediaType: 'IMAGE' | 'VIDEO';
  createdAt: string;
}

// export interface Comment {
//   commentId: number;
//   postId: number;
//   userId: number;
//   parentId?: number;
//   content: string;
//   createdAt: string;
//   user?: User;
// }

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
