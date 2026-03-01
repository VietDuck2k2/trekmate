import React, { useState, useRef } from 'react';

const ChatInput = ({ onSend, disabled }) => {
   const [text, setText] = useState('');
   const inputRef = useRef(null);

   const handleSubmit = (e) => {
      e.preventDefault();
      if (!text.trim()) return;
      onSend(text.trim());
      setText('');
      inputRef.current?.focus();
   };

   const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(e);
      }
   };

   return (
      <form onSubmit={handleSubmit} className="flex items-center gap-3 px-4 py-3 border-t border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
         <div className="flex-1 flex items-center bg-slate-100 dark:bg-zinc-800 rounded-full px-4 py-2">
            <textarea
               ref={inputRef}
               value={text}
               onChange={(e) => setText(e.target.value)}
               onKeyDown={handleKeyDown}
               placeholder="Nhập tin nhắn..."
               disabled={disabled}
               rows={1}
               className="flex-1 bg-transparent text-sm text-slate-800 dark:text-white placeholder:text-slate-400 resize-none outline-none max-h-32 leading-relaxed"
               style={{ paddingTop: '2px' }}
            />
         </div>
         <button
            type="submit"
            disabled={!text.trim() || disabled}
            className="w-10 h-10 rounded-full bg-primary hover:bg-emerald-700 disabled:bg-slate-200 dark:disabled:bg-zinc-700 text-white disabled:text-slate-400 flex items-center justify-center transition-all shadow-lg shadow-primary/20 shrink-0"
         >
            <span className="material-icons-round text-[20px]">send</span>
         </button>
      </form>
   );
};

export default ChatInput;
