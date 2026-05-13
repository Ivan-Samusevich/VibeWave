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
    targetUserName,
    messages,
    chats,
    chatsLoading,
    input,
    setInput,
    loading,
    scrollRef,
    fetchMessages,
    handleSendMessage,
    navigate
  } = useChatForm();

  return (
    <div className="h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col transition-colors duration-200 overflow-hidden">
      <Navbar />

      <div className="flex-1 flex overflow-hidden pt-16">
        {/* Sidebar - Chat List */}
        <aside className="w-80 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hidden md:flex flex-col">
          <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
            <h2 className="font-bold text-lg dark:text-zinc-100">Чаты</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {chatsLoading ? (
              <div className="p-8 flex justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
              </div>
            ) : chats.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-sm">
                Нет активных чатов
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {chats.map((chat) => (
                  <button
                    key={chat.chatId}
                    onClick={() => navigate(`/chat?user=${chat.userName}`)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                      targetUserName === chat.userName
                        ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                        : 'hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      targetUserName === chat.userName
                        ? 'bg-indigo-600 text-white'
                        : 'bg-zinc-100 dark:bg-zinc-800'
                    }`}>
                      {chat.userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="font-bold truncate">{chat.userName}</p>
                      <p className="text-xs opacity-60 truncate">Нажмите, чтобы открыть</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Chat Main Area */}
        <section className="flex-1 flex flex-col bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
          {!targetUserName ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-zinc-900 md:bg-transparent">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md space-y-4"
              >
                <div className="h-24 w-24 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto">
                  <Send size={40} />
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Ваши сообщения</h3>
                <p className="text-zinc-500 dark:text-zinc-400">
                  Выберите собеседника из списка слева или перейдите в профиль пользователя, чтобы начать общение.
                </p>
              </motion.div>
            </div>
          ) : (
            <>
              {/* Header Info */}
              <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 flex items-center justify-between z-10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                    {targetUserName?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div>
                    <h1 className="font-bold text-zinc-900 dark:text-zinc-100">Чат с {targetUserName}</h1>
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

              {/* Messages Area */}
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800"
              >
                <AnimatePresence initial={false}>
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600 gap-2 opacity-50">
                      <p>Нет сообщений. Начните общение!</p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <motion.div
                        key={msg.messageId}
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className={`flex ${msg.userName === user?.userName ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-sm ${
                            msg.userName === user?.userName
                              ? 'bg-indigo-600 text-white rounded-tr-none'
                              : 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-100 dark:border-zinc-800 rounded-tl-none'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{msg.text}</p>
                          <span className={`text-[10px] mt-1 block text-right ${
                            msg.userName === user?.userName ? 'text-indigo-200' : 'text-zinc-500'
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
              <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
                <form onSubmit={handleSendMessage} className="flex gap-2 items-end max-w-4xl mx-auto">
                  <div className="flex-1">
                    <Input
                      placeholder="Введите сообщение..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                      disabled={loading}
                    />
                  </div>
                  <Button type="submit" disabled={!input.trim() || loading} className="h-11 w-11 p-0 rounded-full shrink-0 cursor-pointer">
                    <Send size={18} className={loading ? 'animate-pulse' : ''} />
                  </Button>
                </form>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};
