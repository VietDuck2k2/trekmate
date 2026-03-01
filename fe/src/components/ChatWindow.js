import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

const ChatWindow = ({ messages = [], currentUserId, chatTitle, chatSubtitle, loading }) => {
   const bottomRef = useRef(null);

   useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages]);

   if (loading) {
      return (
         <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" />
         </div>
      );
   }

   return (
      <div className="flex-1 flex flex-col min-h-0">
         {/* Chat Header */}
         <div className="px-5 py-3.5 border-b border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
               <span className="material-icons-round text-primary text-lg">
                  {chatTitle === 'Chat nhóm' ? 'group' : 'person'}
               </span>
            </div>
            <div>
               <p className="font-bold text-sm text-slate-800 dark:text-white">{chatTitle}</p>
               {chatSubtitle && <p className="text-[10px] text-slate-400">{chatSubtitle}</p>}
            </div>
         </div>

         {/* Messages area */}
         <div className="flex-1 overflow-y-auto px-4 py-4 space-y-0.5 bg-slate-50 dark:bg-zinc-950">
            {messages.length === 0 && (
               <div className="flex flex-col items-center justify-center h-full text-slate-400 py-12">
                  <span className="material-icons-round text-5xl mb-3 opacity-30">chat_bubble_outline</span>
                  <p className="text-sm">Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện!</p>
               </div>
            )}

            {messages.map((msg, idx) => {
               const isOwn = msg.sender._id === currentUserId || msg.sender === currentUserId;
               const prevMsg = messages[idx - 1];
               // Show avatar only for first message in a cluster from same sender
               const showAvatar = !prevMsg || prevMsg.sender._id !== msg.sender._id;
               return (
                  <MessageBubble
                     key={msg._id || idx}
                     msg={msg}
                     isOwn={isOwn}
                     showAvatar={showAvatar}
                  />
               );
            })}
            <div ref={bottomRef} />
         </div>
      </div>
   );
};

export default ChatWindow;
