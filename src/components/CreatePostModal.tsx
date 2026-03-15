import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, Film, Upload, User } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { motion, AnimatePresence } from 'motion/react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPost: (post: { text: string; mediaUrl: string; mediaType: 'image' | 'video' }) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onAddPost }) => {
  const [text, setText] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      const url = URL.createObjectURL(file);
      setMediaPreview(url);
      setMediaType(file.type.startsWith('video/') ? 'video' : 'image');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mediaPreview) {
      onAddPost({
        text,
        mediaUrl: mediaPreview,
        mediaType,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setText('');
    setMediaFile(null);
    setMediaPreview(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800"
          >
            <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-lg font-semibold dark:text-zinc-100">Создать публикацию</h3>
              <button onClick={handleClose} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                <X className="h-6 w-6 text-zinc-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div 
                className={`relative aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden ${
                  mediaPreview 
                    ? 'border-transparent bg-zinc-100 dark:bg-zinc-950' 
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-indigo-400'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                {mediaPreview ? (
                  mediaType === 'image' ? (
                    <img src={mediaPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <video src={mediaPreview} className="w-full h-full object-cover" controls />
                  )
                ) : (
                  <div className="flex flex-col items-center gap-3 text-zinc-400">
                    <div className="flex gap-2">
                      <ImageIcon className="h-8 w-8" />
                      <Film className="h-8 w-8" />
                    </div>
                    <p className="text-sm font-medium">Нажмите, чтобы выбрать фото или видео</p>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*,video/*" 
                  onChange={handleFileChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Описание</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Добавьте подпись..."
                  className="w-full min-h-100px p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-sm dark:text-zinc-100"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full py-6 text-base font-semibold"
                disabled={!mediaPreview}
              >
                <Upload className="mr-2 h-5 w-5" />
                Опубликовать
              </Button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
