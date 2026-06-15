import React from 'react';

interface PostMediaProps {
  mediaUrl: string;
  mediaType: 'image' | 'video' | string;
}

export const PostMedia: React.FC<PostMediaProps> = React.memo(({ mediaUrl, mediaType }) => {
  return (
    <div className="aspect-square bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center overflow-hidden">
      {mediaType === 'video' ? (
        <video 
          src={mediaUrl} 
          className="h-full w-full object-cover" 
          controls 
          autoPlay 
          muted 
          loop 
        />
      ) : (
        <img 
          src={mediaUrl} 
          alt="Post content" 
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
      )}
    </div>
  );
});

PostMedia.displayName = 'PostMedia';
