import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { notificationAPI } from '../services/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => {
   const context = useContext(NotificationContext);
   if (!context) {
      throw new Error('useNotifications must be used within a NotificationProvider');
   }
   return context;
};

export const NotificationProvider = ({ children }) => {
   const [notifications, setNotifications] = useState([]);
   const [totalUnread, setTotalUnread] = useState(0);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   const { user } = useAuth();

   const fetchNotifications = useCallback(async () => {
      if (!user) return;

      try {
         setLoading(true);
         setError(null);
         const response = await notificationAPI.getNotifications();
         setNotifications(response.notifications);
         setTotalUnread(response.totalUnread);
      } catch (err) {
         setError(err.message);
         console.error('Error fetching notifications:', err);
      } finally {
         setLoading(false);
      }
   }, [user]);

   const markAsRead = async (notificationId) => {
      try {
         await notificationAPI.markAsRead(notificationId);
         setNotifications(prev => 
            prev.map(notif => 
               notif._id === notificationId 
                  ? { ...notif, isRead: true }
                  : notif
            )
         );
         setTotalUnread(prev => Math.max(0, prev - 1));
      } catch (err) {
         console.error('Error marking notification as read:', err);
      }
   };

   const markAllAsRead = async () => {
      try {
         await notificationAPI.markAllAsRead();
         setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
         setTotalUnread(0);
      } catch (err) {
         console.error('Error marking all notifications as read:', err);
      }
   };

   // Fetch notifications when user logs in
   useEffect(() => {
      if (user) {
         fetchNotifications();
      } else {
         // Clear notifications when user logs out
         setNotifications([]);
         setTotalUnread(0);
      }
   }, [user, fetchNotifications]);

   // Polling for notifications every 30 seconds
   useEffect(() => {
      if (!user) return;

      const interval = setInterval(() => {
         fetchNotifications();
      }, 30000); // Poll every 30 seconds

      return () => clearInterval(interval);
   }, [user, fetchNotifications]);

   const refreshNotifications = () => {
      fetchNotifications();
   };

   const value = {
      notifications,
      totalUnread,
      loading,
      error,
      fetchNotifications,
      refreshNotifications,
      markAsRead,
      markNotificationRead: markAsRead, // Alias for consistency
      markAllAsRead
   };

   return (
      <NotificationContext.Provider value={value}>
         {children}
      </NotificationContext.Provider>
   );
};