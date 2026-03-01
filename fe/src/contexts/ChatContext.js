import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const ChatContext = createContext(null);

const SOCKET_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

// Pure utility — defined OUTSIDE component so reference never changes
export const buildKey = (type, identifier) =>
   type === 'group' ? `group:${identifier}` : `dm:${identifier}`;

export const ChatProvider = ({ children }) => {
   const { user } = useAuth();
   const socketRef = useRef(null);
   const [connected, setConnected] = useState(false);
   const [messages, setMessages] = useState({});
   const [unreadCounts, setUnreadCounts] = useState({});

   const addMessage = useCallback((msg) => {
      const isMine = msg.sender._id === user?._id || msg.sender === user?._id;
      const key = msg.type === 'group'
         ? buildKey('group', msg.trip)
         : buildKey('dm', isMine ? (msg.receiver?._id || msg.receiver) : (msg.sender?._id || msg.sender));

      setMessages(prev => ({
         ...prev,
         [key]: [...(prev[key] || []), msg]
      }));
   }, [user?._id]);

   useEffect(() => {
      if (!user) return;
      const token = localStorage.getItem('token');

      const socket = io(SOCKET_URL, {
         auth: { token },
         transports: ['websocket', 'polling']
      });

      socket.on('connect', () => {
         setConnected(true);
         console.log('[ChatContext] Socket connected');
      });
      socket.on('disconnect', () => setConnected(false));
      socket.on('new_message', (msg) => {
         addMessage(msg);
         const isMine = msg.sender._id === user._id || msg.sender === user._id;
         const key = msg.type === 'group'
            ? `group:${msg.trip}`
            : `dm:${isMine ? (msg.receiver?._id || msg.receiver) : (msg.sender?._id || msg.sender)}`;
         setUnreadCounts(prev => ({ ...prev, [key]: (prev[key] || 0) + 1 }));
      });
      socket.on('messages_read', ({ type, partnerId, tripId }) => {
         const key = type === 'group' ? `group:${tripId}` : `dm:${partnerId}`;
         setUnreadCounts(prev => ({ ...prev, [key]: 0 }));
      });

      socketRef.current = socket;

      return () => {
         socket.disconnect();
         socketRef.current = null;
      };
   }, [user, addMessage]);

   const joinTrip = useCallback((tripId) => {
      socketRef.current?.emit('join_trip', { tripId });
   }, []);

   const sendMessage = useCallback(({ tripId, type, receiverId, content }) => {
      socketRef.current?.emit('send_message', { tripId, type, receiverId, content });
   }, []);

   const markAsRead = useCallback(({ tripId, type, partnerId }) => {
      socketRef.current?.emit('mark_as_read', { tripId, type, partnerId });
      const key = type === 'group' ? `group:${tripId}` : `dm:${partnerId}`;
      setUnreadCounts(prev => ({ ...prev, [key]: 0 }));
   }, []);

   // Stable reference: only depends on setMessages which never changes
   const loadHistory = useCallback((key, msgs) => {
      setMessages(prev => ({ ...prev, [key]: msgs }));
   }, []);

   return (
      <ChatContext.Provider value={{
         connected,
         messages,
         unreadCounts,
         joinTrip,
         sendMessage,
         markAsRead,
         loadHistory
         // buildKey removed from context — import it directly
      }}>
         {children}
      </ChatContext.Provider>
   );
};

export const useChat = () => useContext(ChatContext);
