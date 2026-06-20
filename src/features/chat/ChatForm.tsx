import React from 'react';
import { Send } from 'lucide-react';
import { motion } from 'motion/react';
import { Navbar } from '../../components/NavBar';
import { useChatForm } from './hooks/useChatForm';
import { ChatSidebar } from './components/ChatSidebar';
import { ChatHeader } from './components/ChatHeader';
import { ChatMessages } from './components/ChatMessages';
import { ChatInput } from './components/ChatInput';

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
    handleEditMessage,
    handleDeleteMessage,
    navigate
  } = useChatForm();

  return (
    <div className="h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col transition-colors duration-200 overflow-hidden">
      <Navbar />

      <div className="flex-1 flex overflow-hidden pt-16">
        <ChatSidebar 
          chats={chats}
          chatsLoading={chatsLoading}
          targetUserName={targetUserName}
          onChatClick={(uname) => navigate(`/chat?user=${uname}`)}
        />

        <section className={`flex-1 ${targetUserName ? 'flex' : 'hidden md:flex'} flex-col bg-zinc-50 dark:bg-zinc-950 overflow-hidden`}>
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
              <ChatHeader 
                targetUserName={targetUserName}
                onRefresh={fetchMessages}
                onBackClick={() => navigate('/chat')}
              />

              <ChatMessages 
                messages={messages}
                currentUser={user}
                scrollRef={scrollRef}
                onEditMessage={handleEditMessage}
                onDeleteMessage={handleDeleteMessage}
              />

              <ChatInput 
                input={input}
                setInput={setInput}
                onSendMessage={handleSendMessage}
                loading={loading}
              />
            </>
          )}
        </section>
      </div>
    </div>
  );
};
