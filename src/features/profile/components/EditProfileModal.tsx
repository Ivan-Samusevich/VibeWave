import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Camera } from 'lucide-react';
import { Button } from '../../../components/Button';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: any;
  editDescription: string;
  editPreview: string | null;
  setEditDescription: (val: string) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpdate: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profileData,
  editDescription,
  editPreview,
  setEditDescription,
  onFileChange,
  onUpdate,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl shadow-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold dark:text-zinc-100">
                Редактировать профиль
              </h2>
              <button
                onClick={onClose}
                className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 cursor-pointer"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col items-center gap-4">
                <div className="relative h-24 w-24">
                  <div className="h-full w-full rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700">
                    {editPreview || profileData?.fileURL ? (
                      <img
                        src={editPreview || profileData?.fileURL}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                        <User className="h-12 w-12 text-zinc-300" />
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-lg border-2 border-white dark:border-zinc-900 cursor-pointer transition-colors">
                    <Camera className="h-4 w-4" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={onFileChange}
                    />
                  </label>
                </div>
                <p className="text-xs text-zinc-500 font-medium whitespace-nowrap">
                  Нажмите на камеру, чтобы загрузить аватар
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold dark:text-zinc-300">
                  О себе
                </label>
                <textarea
                  autoFocus
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none min-h-25 dark:text-zinc-100"
                  placeholder="Расскажите о себе..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="cursor-pointer flex-1"
                  onClick={onClose}
                >
                  Отмена
                </Button>
                <Button
                  className="cursor-pointer flex-1 bg-indigo-600 hover:bg-indigo-700"
                  onClick={onUpdate}
                >
                  Сохранить
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
