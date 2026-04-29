import React from 'react';
import { Send, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Navbar } from '../../components/NavBar';
import { useChatForm } from './hooks/useChatForm';

export const ChatForm: React.FC = () => {
  const {
    user,
    targetUserId,
    messages,
    input,
    setInput,
    loading,
    scrollRef,
    fetchMessages,
    handleSendMessage
  } = useChatForm();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col transition-colors duration-200">
      <Navbar />

      {/* Header Info */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 flex items-center justify-between sticky top-16 z-10 transition-colors">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
            {targetUserId}
          </div>
          <div>
            <h1 className="font-bold text-zinc-900 dark:text-zinc-100">Чат с пользователем #{targetUserId}</h1>
            <p className="text-xs text-green-500 font-medium flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
              Онлайн
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={fetchMessages} className="text-zinc-400 dark:text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400">
            <RefreshCw size={18} />
          </Button>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-hidden flex flex-col max-w-4xl mx-auto w-full p-4 gap-4">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800"
        >
          <AnimatePresence initial={false}>
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600 gap-2 opacity-50">
                <div className="h-16 w-16 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                  <Send size={24} />
                </div>
                <p>Нет сообщений. Начните общение!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <motion.div
                  key={msg.messageId}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className={`flex ${msg.senderId === user?.userId ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-sm ${
                      msg.senderId === user?.userId
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-100 dark:border-zinc-800 rounded-tl-none'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <span className={`text-[10px] mt-1 block text-right ${
                      msg.senderId === user?.userId ? 'text-indigo-200' : 'text-zinc-500'
                    }`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="flex gap-2 items-end pb-4">
          <div className="flex-1">
            <Input
              placeholder="Введите сообщение..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
              disabled={loading}
            />
          </div>
          <Button type="submit" disabled={!input.trim() || loading} className="h-11 w-11 p-0 rounded-full shrink-0">
            <Send size={18} className={loading ? 'animate-pulse' : ''} />
          </Button>
        </form>
      </main>
    </div>
  );
};
