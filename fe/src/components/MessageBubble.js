import React from 'react';

const MessageBubble = ({ msg, isOwn, showAvatar }) => {
   const time = new Date(msg.createdAt).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
   });

   return (
      <div className={`flex items-end gap-2 mb-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
         {/* Avatar (shown for others) */}
         {!isOwn && (
            <div className="w-8 h-8 shrink-0">
               {showAvatar ? (
                  msg.sender.avatarUrl
                     ? <img src={msg.sender.avatarUrl} alt={msg.sender.displayName} className="w-8 h-8 rounded-full object-cover" />
                     : <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                        {msg.sender.displayName?.[0]?.toUpperCase()}
                     </div>
               ) : <div className="w-8 h-8" />}
            </div>
         )}

         <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[70%]`}>
            {/* Sender name (group chat, not own) */}
            {showAvatar && !isOwn && (
               <span className="text-[10px] font-bold text-slate-400 mb-1 px-1">
                  {msg.sender.displayName}
               </span>
            )}

            {/* Bubble */}
            <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${isOwn
                  ? 'bg-primary text-white rounded-br-sm'
                  : 'bg-white dark:bg-zinc-800 text-slate-800 dark:text-white rounded-bl-sm border border-slate-100 dark:border-zinc-700'
               }`}>
               {msg.content}
            </div>

            {/* Timestamp */}
            <span className="text-[10px] text-slate-400 mt-1 px-1">{time}</span>
         </div>
      </div>
   );
};

export default MessageBubble;
