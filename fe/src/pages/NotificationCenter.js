import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext';
import { notificationAPI } from '../services/api';
import Layout from '../components/Layout';

const NotificationCenter = () => {
   const navigate = useNavigate();
   const { markAsRead, markAllAsRead } = useNotifications();

   const [notifications, setNotifications] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [filter, setFilter] = useState('all'); // 'all', 'unread'
   const [page, setPage] = useState(1);
   const [hasMore, setHasMore] = useState(false);
   const [totalUnread, setTotalUnread] = useState(0);

   const loadNotifications = useCallback(async (currentPage = 1, currentFilter = filter) => {
      try {
         setLoading(true);
         setError(null);

         const params = {
            page: currentPage,
            limit: 20
         };

         if (currentFilter === 'unread') {
            params.unread = 'true';
         }

         const response = await notificationAPI.getNotifications(params);

         if (currentPage === 1) {
            setNotifications(response.notifications);
         } else {
            setNotifications(prev => [...prev, ...response.notifications]);
         }

         setHasMore(response.pagination.hasMore);
         setTotalUnread(response.totalUnread);
      } catch (err) {
         setError(err.message || 'Failed to load notifications');
         console.error('Error loading notifications:', err);
      } finally {
         setLoading(false);
      }
   }, [filter]);

   useEffect(() => {
      loadNotifications(1, filter);
      setPage(1);
   }, [filter, loadNotifications]);

   const handleLoadMore = () => {
      const nextPage = page + 1;
      setPage(nextPage);
      loadNotifications(nextPage, filter);
   };

   const handleNotificationClick = async (notification) => {
      if (!notification.isRead) {
         await markAsRead(notification._id);
         setNotifications(prev =>
            prev.map(n => n._id === notification._id ? { ...n, isRead: true } : n)
         );
         setTotalUnread(prev => Math.max(0, prev - 1));
      }

      if (notification.trip?._id) {
         navigate(`/trips/${notification.trip._id}`);
      } else if (notification.type === 'JOIN_REQUEST_RECEIVED') {
         navigate('/my-trips');
      }
   };

   const handleMarkAllAsRead = async () => {
      try {
         await markAllAsRead();
         setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
         setTotalUnread(0);
      } catch (err) {
         console.error('Error marking all as read:', err);
         alert('Failed to mark all as read. Please try again.');
      }
   };

   const handleMarkSingleAsRead = async (notificationId, e) => {
      e.stopPropagation();
      try {
         await markAsRead(notificationId);
         setNotifications(prev =>
            prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
         );
         setTotalUnread(prev => Math.max(0, prev - 1));
      } catch (err) {
         console.error('Error marking as read:', err);
      }
   };

   const getNotificationIcon = (type) => {
      switch (type) {
         case 'JOIN_REQUEST_RECEIVED': return 'group_add';
         case 'JOIN_REQUEST_APPROVED': return 'check_circle';
         case 'JOIN_REQUEST_REJECTED': return 'cancel';
         case 'MEMBER_JOINED': return 'celebration';
         default: return 'notifications';
      }
   };

   const getNotificationTypeLabel = (type) => {
      switch (type) {
         case 'JOIN_REQUEST_RECEIVED': return 'Join Request';
         case 'JOIN_REQUEST_APPROVED': return 'Request Approved';
         case 'JOIN_REQUEST_REJECTED': return 'Request Rejected';
         case 'MEMBER_JOINED': return 'New Member';
         default: return 'Notification';
      }
   };

   const getNotificationTypeStyles = (type) => {
      switch (type) {
         case 'JOIN_REQUEST_RECEIVED': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
         case 'JOIN_REQUEST_APPROVED': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
         case 'JOIN_REQUEST_REJECTED': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
         case 'MEMBER_JOINED': return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300';
         default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
      }
   };

   const formatTimeAgo = (createdAt) => {
      const now = new Date();
      const created = new Date(createdAt);
      const diffInMinutes = Math.floor((now - created) / (1000 * 60));

      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;

      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;

      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays === 1) return 'Yesterday';
      if (diffInDays < 7) return `${diffInDays} days ago`;

      const diffInWeeks = Math.floor(diffInDays / 7);
      if (diffInWeeks === 1) return '1 week ago';
      if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;

      const diffInMonths = Math.floor(diffInDays / 30);
      if (diffInMonths === 1) return '1 month ago';
      if (diffInMonths < 12) return `${diffInMonths} months ago`;

      return created.toLocaleDateString();
   };

   return (
      <Layout>
         <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 mt-12">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
               <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                     <span className="material-icons-round text-primary">notifications</span>
                     Notifications
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400">
                     Stay updated with your trip activities
                     {totalUnread > 0 && <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs font-bold">{totalUnread} unread</span>}
                  </p>
               </div>
               {totalUnread > 0 && (
                  <button
                     onClick={handleMarkAllAsRead}
                     className="text-sm font-bold text-primary hover:text-emerald-700 transition-colors flex items-center gap-1"
                  >
                     <span className="material-icons-round text-sm">done_all</span>
                     Mark All as Read
                  </button>
               )}
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-8 w-fit">
               <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'all'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                     }`}
               >
                  All Notifications
               </button>
               <button
                  onClick={() => setFilter('unread')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${filter === 'unread'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                     }`}
               >
                  Unread
                  {totalUnread > 0 && (
                     <span className="w-5 h-5 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center">
                        {totalUnread}
                     </span>
                  )}
               </button>
            </div>

            {/* Content */}
            {loading && page === 1 ? (
               <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
               </div>
            ) : error ? (
               <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 flex items-center gap-4">
                  <span className="material-icons-round text-2xl">error_outline</span>
                  <div className="flex-grow">
                     <p className="font-bold">Error loading notifications</p>
                     <p className="text-sm">{error}</p>
                  </div>
                  <button onClick={() => loadNotifications(1, filter)} className="px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-red-50 font-bold text-sm">Retry</button>
               </div>
            ) : notifications.length === 0 ? (
               <div className="text-center py-24 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed">
                  <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                     <span className="material-icons-round text-4xl text-slate-300">notifications_off</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                     {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                     {filter === 'unread'
                        ? "You're all caught up! Check back later for updates."
                        : "You'll be notified about trip activities here"}
                  </p>
                  {filter === 'unread' && (
                     <button
                        onClick={() => setFilter('all')}
                        className="mt-6 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white rounded-xl font-bold hover:shadow-lg transition-all"
                     >
                        View All Notifications
                     </button>
                  )}
               </div>
            ) : (
               <>
                  <div className="space-y-4">
                     {notifications.map((notification) => {
                        const typeStyles = getNotificationTypeStyles(notification.type);

                        return (
                           <div
                              key={notification._id}
                              onClick={() => handleNotificationClick(notification)}
                              className={`group relative p-5 rounded-2xl border transition-all cursor-pointer ${notification.isRead
                                    ? 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                                    : 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30'
                                 }`}
                           >
                              <div className="flex items-start gap-4">
                                 {/* Icon */}
                                 <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${typeStyles}`}>
                                    <span className="material-icons-round text-xl">
                                       {getNotificationIcon(notification.type)}
                                    </span>
                                 </div>

                                 {/* Content */}
                                 <div className="flex-1 min-w-0">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                       <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full w-fit ${typeStyles}`}>
                                          {getNotificationTypeLabel(notification.type)}
                                       </span>
                                       <span className="text-xs text-slate-400">
                                          {formatTimeAgo(notification.createdAt)}
                                       </span>
                                    </div>

                                    <p className={`text-base mb-3 ${notification.isRead ? 'text-slate-600 dark:text-slate-300' : 'text-slate-900 dark:text-white font-semibold'}`}>
                                       {notification.message}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                                       {notification.trip && (
                                          <div className="flex items-center gap-1.5">
                                             <span className="material-icons-round text-sm text-slate-400">map</span>
                                             <span className="font-medium text-primary hover:underline">
                                                {notification.trip.title}
                                             </span>
                                          </div>
                                       )}
                                       {notification.fromUser && (
                                          <div className="flex items-center gap-1.5">
                                             <span className="material-icons-round text-sm text-slate-400">person</span>
                                             <span>{notification.fromUser.displayName}</span>
                                          </div>
                                       )}
                                    </div>
                                 </div>

                                 {/* Actions */}
                                 <div className="shrink-0 flex flex-col items-end gap-2">
                                    {!notification.isRead && (
                                       <button
                                          onClick={(e) => handleMarkSingleAsRead(notification._id, e)}
                                          className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                                          title="Mark as read"
                                       >
                                          <span className="material-icons-round text-sm">done</span>
                                       </button>
                                    )}
                                 </div>
                              </div>
                           </div>
                        );
                     })}
                  </div>

                  {hasMore && (
                     <div className="text-center mt-12">
                        <button
                           onClick={handleLoadMore}
                           disabled={loading}
                           className="px-8 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
                        >
                           {loading ? 'Loading...' : 'Load More'}
                        </button>
                     </div>
                  )}
               </>
            )}
         </div>
      </Layout>
   );
};

export default NotificationCenter;
