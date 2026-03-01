import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useChat, buildKey } from '../contexts/ChatContext';
import { tripsAPI } from '../services/api';
import chatAPI from '../services/chatAPI';
import Layout from '../components/Layout';
import ChatSidebar from '../components/ChatSidebar';
import ChatWindow from '../components/ChatWindow';
import ChatInput from '../components/ChatInput';

const ChatPage = () => {
   const { id: tripId } = useParams();
   const navigate = useNavigate();
   const { user } = useAuth();
   const { connected, messages, unreadCounts, joinTrip, sendMessage, markAsRead, loadHistory } = useChat();

   const [trip, setTrip] = useState(null);
   const [loading, setLoading] = useState(true);
   const [historyLoading, setHistoryLoading] = useState(false);
   const [activeChat, setActiveChat] = useState({ type: 'group' });

   const activeKey = activeChat.type === 'group'
      ? buildKey('group', tripId)
      : buildKey('dm', activeChat.partner?._id);

   const currentMessages = messages[activeKey] || [];

   // Load trip details — runs once
   useEffect(() => {
      let cancelled = false;
      const loadTrip = async () => {
         try {
            const data = await tripsAPI.getTripDetails(tripId);
            if (!cancelled) setTrip(data);
         } catch {
            if (!cancelled) navigate('/');
         } finally {
            if (!cancelled) setLoading(false);
         }
      };
      loadTrip();
      return () => { cancelled = true; };
   }, [tripId, navigate]);

   // Join trip room when socket connects
   useEffect(() => {
      if (connected && tripId) joinTrip(tripId);
   }, [connected, tripId, joinTrip]);

   // Load message history — stable deps: tripId, activeChat type/partner, loadHistory
   useEffect(() => {
      if (!tripId) return;
      let cancelled = false;

      const fetch = async () => {
         setHistoryLoading(true);
         try {
            if (activeChat.type === 'group') {
               const { messages: msgs } = await chatAPI.getGroupMessages(tripId);
               if (!cancelled) loadHistory(buildKey('group', tripId), msgs);
            } else if (activeChat.partner?._id) {
               const { messages: msgs } = await chatAPI.getDirectMessages(tripId, activeChat.partner._id);
               if (!cancelled) loadHistory(buildKey('dm', activeChat.partner._id), msgs);
            }
         } catch (err) {
            console.error('loadHistory error:', err);
         } finally {
            if (!cancelled) setHistoryLoading(false);
         }
      };

      fetch();
      return () => { cancelled = true; };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [tripId, activeChat.type, activeChat.partner?._id]);
   // NOTE: loadHistory is stable (useCallback with []), buildKey is a module constant.
   // We intentionally omit them from deps to avoid loop. ESLint suppressed above.

   // Mark as read when switching conversations
   useEffect(() => {
      if (!tripId) return;
      markAsRead({
         tripId,
         type: activeChat.type,
         partnerId: activeChat.partner?._id
      });
   }, [activeChat.type, activeChat.partner?._id, tripId, markAsRead]);

   const handleSend = useCallback((content) => {
      sendMessage({
         tripId,
         type: activeChat.type,
         receiverId: activeChat.partner?._id,
         content
      });
   }, [tripId, activeChat.type, activeChat.partner?._id, sendMessage]);

   // Get all members including creator
   const members = trip ? [
      ...(trip.createdBy ? [trip.createdBy] : []),
      ...(trip.members?.filter(m => m._id !== trip.createdBy?._id) || [])
   ] : [];

   if (loading) {
      return (
         <Layout>
            <div className="flex items-center justify-center min-h-[70vh]">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary" />
            </div>
         </Layout>
      );
   }

   return (
      <Layout>
         <div className="max-w-6xl mx-auto mt-20 mb-6 px-4">
            {/* Back button + title */}
            <div className="flex items-center gap-3 mb-4">
               <button
                  onClick={() => navigate(`/trips/${tripId}`)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 transition"
               >
                  <span className="material-icons-round">arrow_back</span>
               </button>
               <div>
                  <h1 className="font-bold text-xl text-slate-800 dark:text-white">{trip?.title}</h1>
                  <p className="text-xs text-slate-400">
                     {connected
                        ? <span className="text-emerald-500 font-semibold">● Đã kết nối</span>
                        : <span className="text-red-400 font-semibold">● Đang kết nối...</span>
                     }
                  </p>
               </div>
            </div>

            {/* Main Chat UI */}
            <div
               className="flex rounded-3xl overflow-hidden border border-slate-100 dark:border-zinc-800 shadow-2xl shadow-slate-200/50 dark:shadow-none"
               style={{ height: 'calc(100vh - 220px)', minHeight: '500px' }}
            >
               {/* Sidebar */}
               <ChatSidebar
                  tripTitle={trip?.title}
                  members={members}
                  activeChat={{ type: activeChat.type, partnerId: activeChat.partner?._id }}
                  onSelectGroup={() => setActiveChat({ type: 'group' })}
                  onSelectDM={(member) => setActiveChat({ type: 'direct', partner: member })}
                  unreadCounts={unreadCounts}
                  tripId={tripId}
                  currentUserId={user?._id}
               />

               {/* Chat Area */}
               <div className="flex flex-col flex-1 min-w-0 bg-white dark:bg-zinc-900">
                  <ChatWindow
                     messages={currentMessages}
                     currentUserId={user?._id}
                     chatTitle={activeChat.type === 'group' ? 'Chat nhóm' : activeChat.partner?.displayName}
                     chatSubtitle={activeChat.type === 'group' ? `${members.length} thành viên` : 'Tin nhắn riêng'}
                     loading={historyLoading}
                  />
                  <ChatInput onSend={handleSend} disabled={!connected} />
               </div>
            </div>
         </div>
      </Layout>
   );
};

export default ChatPage;
