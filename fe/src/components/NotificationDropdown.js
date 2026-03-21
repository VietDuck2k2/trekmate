import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext';

const NotificationDropdown = ({ onClose }) => {
   const navigate = useNavigate();
   const { notifications, totalUnread, loading, error, markAsRead, markAllAsRead } = useNotifications();

   const handleNotificationClick = async (notification) => {
      // Mark as read if not already read
      if (!notification.isRead) {
         await markAsRead(notification._id);
      }

      // Navigate based on notification type and metadata
      if (notification.trip?._id) {
         navigate(`/trips/${notification.trip._id}`);
      } else if (notification.type === 'JOIN_REQUEST_RECEIVED') {
         // Could navigate to a manage requests page or trip detail
         navigate('/my-trips');
      }

      onClose();
   };

   const handleMarkAllAsRead = async () => {
      await markAllAsRead();
   };

   const handleViewAll = () => {
      navigate('/notifications');
      onClose();
   };

   const getNotificationIcon = (type) => {
      switch (type) {
         case 'JOIN_REQUEST_RECEIVED': return '👥';
         case 'JOIN_REQUEST_APPROVED': return '✅';
         case 'JOIN_REQUEST_REJECTED': return '❌';
         case 'MEMBER_JOINED': return '🎉';
         default: return '🔔';
      }
   };

   const getNotificationTypeLabel = (type) => {
      switch (type) {
         case 'JOIN_REQUEST_RECEIVED': return 'Yêu cầu Tham gia';
         case 'JOIN_REQUEST_APPROVED': return 'Yêu cầu đã được Chấp thuận';
         case 'JOIN_REQUEST_REJECTED': return 'Yêu cầu đã bị Từ chối';
         case 'MEMBER_JOINED': return 'Thành viên mới';
         default: return 'Thông báo';
      }
   };

   const getNotificationTypeColor = (type) => {
      switch (type) {
         case 'JOIN_REQUEST_RECEIVED': return '#007bff';
         case 'JOIN_REQUEST_APPROVED': return '#28a745';
         case 'JOIN_REQUEST_REJECTED': return '#dc3545';
         case 'MEMBER_JOINED': return '#17a2b8';
         default: return '#6c757d';
      }
   };

   const formatTimeAgo = (createdAt) => {
      const now = new Date();
      const created = new Date(createdAt);
      const diffInMinutes = Math.floor((now - created) / (1000 * 60));

      if (diffInMinutes < 1) return 'Vừa xong';
      if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours} giờ trước`;

      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays === 1) return 'Hôm qua';
      if (diffInDays < 7) return `${diffInDays} ngày trước`;

      const diffInWeeks = Math.floor(diffInDays / 7);
      if (diffInWeeks === 1) return '1 tuần trước';
      if (diffInWeeks < 4) return `${diffInWeeks} tuần trước`;

      return created.toLocaleDateString('vi-VN');
   };

   return (
      <div className="absolute top-full right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-80 sm:w-96 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-300">
         {/* Header */}
         <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
            <h4 className="font-bold text-slate-800 dark:text-white text-base">
               Thông báo {totalUnread > 0 && <span className="ml-1 text-primary">({totalUnread})</span>}
            </h4>
            {totalUnread > 0 && (
               <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs font-bold text-primary hover:text-emerald-700 transition-colors"
               >
                  Đánh dấu tất cả đã đọc
               </button>
            )}
         </div>

         {/* Content */}
         <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {loading ? (
               <div className="py-12 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm font-medium text-slate-500">Đang cập nhật...</span>
               </div>
            ) : error ? (
               <div className="p-8 text-center">
                  <span className="material-icons-round text-3xl text-red-400 mb-2">error_outline</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{error}</p>
               </div>
            ) : notifications.length === 0 ? (
               <div className="py-16 px-6 text-center">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                     <span className="material-icons-round text-3xl text-slate-400">notifications_off</span>
                  </div>
                  <h5 className="font-bold text-slate-800 dark:text-white mb-1">Chưa có thông báo nào</h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Chúng tôi sẽ thông báo cho bạn khi có gì đó xảy ra.</p>
               </div>
            ) : (
               <div className="divide-y divide-slate-50 dark:divide-slate-800">
                  {notifications.slice(0, 8).map((notification) => (
                     <div
                        key={notification._id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`group px-5 py-4 cursor-pointer transition-all relative flex gap-4 items-start ${notification.isRead
                           ? 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                           : 'bg-primary/5 dark:bg-primary/10 hover:bg-primary/10 dark:hover:bg-primary/20'
                           }`}
                     >
                        {/* Status Icon Wrapper */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-xl shadow-sm ${notification.isRead ? 'bg-slate-100 dark:bg-slate-800' : 'bg-white dark:bg-slate-800'
                           }`}>
                           {getNotificationIcon(notification.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                           <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{
                                 backgroundColor: `${getNotificationTypeColor(notification.type)}15`,
                                 color: getNotificationTypeColor(notification.type)
                              }}>
                                 {getNotificationTypeLabel(notification.type)}
                              </span>
                              <span className="text-[10px] font-bold text-slate-400 ml-auto">
                                 {formatTimeAgo(notification.createdAt)}
                              </span>
                           </div>

                           <p className={`text-sm leading-snug mb-2 ${notification.isRead
                              ? 'text-slate-600 dark:text-slate-400 font-medium'
                              : 'text-slate-900 dark:text-white font-bold'
                              }`}>
                              {notification.message}
                           </p>

                           <div className="flex items-center gap-2">
                              {notification.trip?.title && (
                                 <div className="flex items-center gap-1 text-[11px] font-bold text-primary truncate max-w-[150px]">
                                    <span className="material-icons-round text-[12px]">terrain</span>
                                    {notification.trip.title}
                                 </div>
                              )}
                              <div className="text-[10px] font-medium text-slate-400 italic shrink-0">
                                 bởi {notification.fromUser?.displayName || 'TrekMate'}
                              </div>
                           </div>
                        </div>

                        {/* Unread dot (Facebook style) */}
                        {!notification.isRead && (
                           <div className="absolute right-4 top-1/2 -translate-y-1/2">
                              <div className="w-2.5 h-2.5 bg-primary rounded-full shadow-sm ring-4 ring-white dark:ring-slate-900"></div>
                           </div>
                        )}
                     </div>
                  ))}
               </div>
            )}
         </div>

         {/* Footer */}
         {notifications.length > 0 && (
            <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
               <button
                  onClick={handleViewAll}
                  className="w-full py-2 text-sm font-bold text-primary hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
               >
                  Xem tất cả hoạt động
               </button>
            </div>
         )}
      </div>
   );
};

export default NotificationDropdown;