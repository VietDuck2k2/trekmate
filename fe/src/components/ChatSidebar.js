import React from 'react';

const ChatSidebar = ({
   tripTitle,
   members,
   activeChat, // { type: 'group' | 'direct', partnerId? }
   onSelectGroup,
   onSelectDM,
   unreadCounts,
   tripId,
   currentUserId
}) => {
   return (
      <div className="w-72 shrink-0 bg-white dark:bg-zinc-900 border-r border-slate-100 dark:border-zinc-800 flex flex-col h-full">
         {/* Header */}
         <div className="px-4 py-4 border-b border-slate-100 dark:border-zinc-800">
            <h2 className="font-bold text-slate-800 dark:text-white truncate text-sm">{tripTitle || 'Chat'}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{members?.length || 0} thành viên</p>
         </div>

         {/* Conversations list */}
         <div className="flex-1 overflow-y-auto py-2">
            {/* Group Chat */}
            <button
               onClick={onSelectGroup}
               className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors ${activeChat?.type === 'group' ? 'bg-primary/5 dark:bg-primary/10' : ''
                  }`}
            >
               <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shrink-0">
                  <span className="material-icons-round text-white text-lg">group</span>
               </div>
               <div className="flex-1 text-left min-w-0">
                  <p className={`text-sm font-bold truncate ${activeChat?.type === 'group' ? 'text-primary' : 'text-slate-800 dark:text-white'}`}>
                     Chat nhóm
                  </p>
                  <p className="text-xs text-slate-400 truncate">Tất cả thành viên</p>
               </div>
               {(unreadCounts?.[`group:${tripId}`] || 0) > 0 && (
                  <span className="min-w-5 h-5 bg-primary rounded-full text-[10px] font-bold text-white flex items-center justify-center px-1">
                     {unreadCounts[`group:${tripId}`]}
                  </span>
               )}
            </button>

            {/* Separator */}
            <div className="px-4 py-2">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tin nhắn riêng</p>
            </div>

            {/* DM list — other members */}
            {(members || [])
               .filter(m => m._id !== currentUserId)
               .map(member => (
                  <button
                     key={member._id}
                     onClick={() => onSelectDM(member)}
                     className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors ${activeChat?.type === 'direct' && activeChat.partnerId === member._id ? 'bg-primary/5 dark:bg-primary/10' : ''
                        }`}
                  >
                     <div className="w-10 h-10 rounded-full shrink-0 bg-slate-200 overflow-hidden">
                        {member.avatarUrl
                           ? <img src={member.avatarUrl} alt={member.displayName} className="w-full h-full object-cover" />
                           : <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-primary font-bold text-sm">
                              {member.displayName?.[0]?.toUpperCase()}
                           </div>
                        }
                     </div>
                     <div className="flex-1 text-left min-w-0">
                        <p className={`text-sm font-bold truncate ${activeChat?.type === 'direct' && activeChat.partnerId === member._id
                              ? 'text-primary' : 'text-slate-800 dark:text-white'
                           }`}>
                           {member.displayName}
                        </p>
                        <p className="text-xs text-slate-400 truncate">Nhắn tin riêng</p>
                     </div>
                     {(unreadCounts?.[`dm:${member._id}`] || 0) > 0 && (
                        <span className="min-w-5 h-5 bg-primary rounded-full text-[10px] font-bold text-white flex items-center justify-center px-1">
                           {unreadCounts[`dm:${member._id}`]}
                        </span>
                     )}
                  </button>
               ))}
         </div>
      </div>
   );
};

export default ChatSidebar;
