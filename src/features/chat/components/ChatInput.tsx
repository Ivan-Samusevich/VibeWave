import React from 'react';
import { Send } from 'lucide-react';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';

interface ChatInputProps {
  input: string;
  setInput: (val: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  loading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ input, setInput, onSendMessage, loading }) => {
  return (
    <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
      <form onSubmit={onSendMessage} className="flex gap-2 items-end max-w-4xl mx-auto">
        <div className="flex-1">
          <Input
            placeholder="Введите сообщение..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
            disabled={loading}
          />
        </div>
        <Button 
          type="submit" 
          disabled={!input.trim() || loading} 
          className="cursor-pointer h-11 w-11 p-0 rounded-full shrink-0"
        >
          <Send size={18} className={loading ? 'animate-pulse' : ''} />
        </Button>
      </form>
    </div>
  );
};
