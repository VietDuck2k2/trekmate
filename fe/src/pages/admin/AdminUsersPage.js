import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import Layout from '../../components/Layout';

const AdminUsersPage = () => {
   const [users, setUsers] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [actionLoading, setActionLoading] = useState({});

   useEffect(() => {
      loadUsers();
   }, []);

   const loadUsers = async () => {
      try {
         setLoading(true);
         setError(null);
         const data = await adminAPI.getUsers();
         setUsers(data);
      } catch (err) {
         setError(err.message || 'Không thể tải người dùng');
      } finally {
         setLoading(false);
      }
   };

   const handleBlockUser = async (userId) => {
      try {
         setActionLoading(prev => ({ ...prev, [userId]: 'blocking' }));
         await adminAPI.blockUser(userId);
         loadUsers();
      } catch (err) {
         alert('Lỗi khi khóa người dùng: ' + err.message);
      } finally {
         setActionLoading(prev => ({ ...prev, [userId]: null }));
      }
   };

   const handleUnblockUser = async (userId) => {
      try {
         setActionLoading(prev => ({ ...prev, [userId]: 'unblocking' }));
         await adminAPI.unblockUser(userId);
         loadUsers();
      } catch (err) {
         alert('Lỗi khi mở khóa người dùng: ' + err.message);
      } finally {
         setActionLoading(prev => ({ ...prev, [userId]: null }));
      }
   };

   const getRoleBadgeStyle = (role) => {
      switch (role) {
         case 'ADMIN': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-900';
         case 'BRAND': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-900';
         case 'TREKKER': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900';
         default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700';
      }
   };

   const getStatusBadgeStyle = (status) => {
      switch (status) {
         case 'ACTIVE': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
         case 'BLOCKED': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
         default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
      }
   };

   return (
      <Layout>
         <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 mt-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
               <div>
                  <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Quản Lý Người Dùng</h1>
                  <p className="text-slate-500 dark:text-slate-400">Xem và quản lý tất cả người dùng và thương hiệu đã đăng ký.</p>
               </div>
               <button
                  onClick={loadUsers}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg font-bold transition-all flex items-center gap-2"
               >
                  <span className="material-icons-round text-sm">refresh</span>
                  Làm Mới Danh Sách
               </button>
            </div>

            {loading ? (
               <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
               </div>
            ) : error ? (
               <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 flex items-center gap-4">
                  <span className="material-icons-round text-2xl">error_outline</span>
                  <div className="flex-grow">
                     <p className="font-bold">Lỗi tải người dùng</p>
                     <p className="text-sm">{error}</p>
                  </div>
                  <button onClick={loadUsers} className="px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-red-50 font-bold text-sm">Thử Lại</button>
               </div>
            ) : (!users || users.length === 0) ? (
               <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed">
                  <p className="text-slate-500 font-bold">Không tìm thấy người dùng nào.</p>
               </div>
            ) : (
               <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                     <table className="w-full text-left border-collapse">
                        <thead>
                           <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                              <th className="p-6 font-bold">Người Dùng</th>
                              <th className="p-6 font-bold">Vai Trò</th>
                              <th className="p-6 font-bold">Trạng Thái</th>
                              <th className="p-6 font-bold">Thao Tác</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                           {users.map(user => (
                              <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                 <td className="p-6">
                                    <div className="flex items-center gap-4">
                                       <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                                          {user.avatarUrl ? (
                                             <img src={user.avatarUrl} alt={user.displayName} className="w-full h-full object-cover" />
                                          ) : (
                                             <span className="font-bold text-slate-500 dark:text-slate-300 text-sm">
                                                {(user.displayName || user.email || 'U')[0].toUpperCase()}
                                             </span>
                                          )}
                                       </div>
                                       <div>
                                          <p className="font-bold text-slate-900 dark:text-white">{user.displayName || 'Không Có Tên'}</p>
                                          <p className="text-sm text-slate-500">{user.email}</p>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="p-6">
                                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${getRoleBadgeStyle(user.role)}`}>
                                       {user.role}
                                    </span>
                                 </td>
                                 <td className="p-6">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold fle items-center gap-1 w-fit ${getStatusBadgeStyle(user.status)}`}>
                                       {user.status}
                                    </span>
                                 </td>
                                 <td className="p-6">
                                    {user.role !== 'ADMIN' ? (
                                       user.status === 'ACTIVE' ? (
                                          <button
                                             onClick={() => handleBlockUser(user._id)}
                                             disabled={actionLoading[user._id]}
                                             className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
                                          >
                                             {actionLoading[user._id] === 'blocking' ? 'Đang Khóa...' : 'Khóa'}
                                          </button>
                                       ) : (
                                          <button
                                             onClick={() => handleUnblockUser(user._id)}
                                             disabled={actionLoading[user._id]}
                                             className="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
                                          >
                                             {actionLoading[user._id] === 'unblocking' ? 'Đang Mở Khóa...' : 'Mở Khóa'}
                                          </button>
                                       )
                                    ) : (
                                       <span className="text-slate-400 text-sm italic">Quản trị viên</span>
                                    )}
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            )}
         </div>
      </Layout>
   );
};

export default AdminUsersPage;