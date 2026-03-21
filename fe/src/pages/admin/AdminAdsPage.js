import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import Layout from '../../components/Layout';

const AdminAdsPage = () => {
   const [ads, setAds] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [actionLoading, setActionLoading] = useState({});

   useEffect(() => {
      loadAds();
   }, []);

   const loadAds = async () => {
      try {
         setLoading(true);
         setError(null);
         const data = await adminAPI.getAds();
         setAds(data);
      } catch (err) {
         setError(err.message || 'Không thể tải quảng cáo');
      } finally {
         setLoading(false);
      }
   };

   const handleApproveAd = async (adId) => {
      try {
         setActionLoading(prev => ({ ...prev, [adId]: 'approving' }));
         await adminAPI.approveAd(adId);
         loadAds();
      } catch (err) {
         alert('Lỗi khi phê duyệt quảng cáo: ' + err.message);
      } finally {
         setActionLoading(prev => ({ ...prev, [adId]: null }));
      }
   };

   const handleHideAd = async (adId) => {
      try {
         setActionLoading(prev => ({ ...prev, [adId]: 'hiding' }));
         await adminAPI.hideAd(adId);
         loadAds();
      } catch (err) {
         alert('Lỗi khi ẩn quảng cáo: ' + err.message);
      } finally {
         setActionLoading(prev => ({ ...prev, [adId]: null }));
      }
   };

   const handleUnhideAd = async (adId) => {
      try {
         setActionLoading(prev => ({ ...prev, [adId]: 'unhiding' }));
         await adminAPI.unhideAd(adId);
         loadAds();
      } catch (err) {
         alert('Lỗi khi bỏ ẩn quảng cáo: ' + err.message);
      } finally {
         setActionLoading(prev => ({ ...prev, [adId]: null }));
      }
   };

   const handleDeleteAd = async (adId, adTitle) => {
      if (!window.confirm(`Bạn có chắc chắn muốn xóa "${adTitle}" không? Hành động này không thể hoàn tác.`)) {
         return;
      }

      try {
         setActionLoading(prev => ({ ...prev, [adId]: 'deleting' }));
         await adminAPI.deleteAd(adId);
         loadAds();
      } catch (err) {
         alert('Lỗi khi xóa quảng cáo: ' + err.message);
      } finally {
         setActionLoading(prev => ({ ...prev, [adId]: null }));
      }
   };

   const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('vi-VN', {
         year: 'numeric',
         month: 'short',
         day: 'numeric'
      });
   };

   const getStatusBadgeStyle = (status) => {
      switch (status) {
         case 'ACTIVE': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
         case 'PENDING': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
         case 'HIDDEN': return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
         default: return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      }
   };

   const getAvailableActions = (ad) => {
      const actions = [];
      if (ad.status === 'PENDING') actions.push({ type: 'approve', label: 'Phê Duyệt', color: 'bg-green-100 text-green-700 hover:bg-green-200' });
      if (ad.status === 'ACTIVE') actions.push({ type: 'hide', label: 'Ẩn', color: 'bg-slate-100 text-slate-700 hover:bg-slate-200' });
      if (ad.status === 'HIDDEN') actions.push({ type: 'unhide', label: 'Bỏ Ẩn', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' });
      actions.push({ type: 'delete', label: 'Xóa', color: 'bg-red-100 text-red-700 hover:bg-red-200' });
      return actions;
   };

   return (
      <Layout>
         <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 mt-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
               <div>
                  <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Quản Lý Quảng Cáo</h1>
                  <p className="text-slate-500 dark:text-slate-400">Xem xét và quản lý nội dung được tài trợ.</p>
               </div>
               <button
                  onClick={loadAds}
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
                     <p className="font-bold">Lỗi tải quảng cáo</p>
                     <p className="text-sm">{error}</p>
                  </div>
                  <button onClick={loadAds} className="px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-red-50 font-bold text-sm">Thử Lại</button>
               </div>
            ) : (!ads || ads.length === 0) ? (
               <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed">
                  <p className="text-slate-500 font-bold">Không tìm thấy quảng cáo nào.</p>
               </div>
            ) : (
               <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                     <table className="w-full text-left border-collapse">
                        <thead>
                           <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                              <th className="p-6 font-bold">Chi Tiết Quảng Cáo</th>
                              <th className="p-6 font-bold">Thương Hiệu</th>
                              <th className="p-6 font-bold">Trạng Thái</th>
                              <th className="p-6 font-bold">Ngày Tạo</th>
                              <th className="p-6 font-bold">Thao Tác</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                           {ads.map(ad => (
                              <tr key={ad._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                 <td className="p-6 max-w-xs">
                                    <div className="font-bold text-slate-900 dark:text-white">{ad.title}</div>
                                    {ad.description && (
                                       <div className="text-xs text-slate-500 line-clamp-1 mt-1">
                                          {ad.description}
                                       </div>
                                    )}
                                    {ad.targetUrl && (
                                       <a href={ad.targetUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-1 block truncate">
                                          {ad.targetUrl}
                                       </a>
                                    )}
                                 </td>
                                 <td className="p-6">
                                    <div className="flex items-center gap-2">
                                       <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold shrink-0">
                                          {(ad.brand?.displayName || ad.brand?.brandName || ad.brand?.email || 'B')[0].toUpperCase()}
                                       </div>
                                       <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate max-w-[120px]">
                                          {ad.brand?.displayName || ad.brand?.brandName || ad.brand?.email || 'Không rõ'}
                                       </span>
                                    </div>
                                 </td>
                                 <td className="p-6">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusBadgeStyle(ad.status)}`}>
                                       {ad.status}
                                    </span>
                                 </td>
                                 <td className="p-6 text-sm text-slate-500 whitespace-nowrap">
                                    {formatDate(ad.createdAt)}
                                 </td>
                                 <td className="p-6">
                                    <div className="flex items-center gap-2 flex-wrap">
                                       {getAvailableActions(ad).map(action => (
                                          <button
                                             key={action.type}
                                             onClick={() => {
                                                if (action.type === 'approve') handleApproveAd(ad._id);
                                                else if (action.type === 'hide') handleHideAd(ad._id);
                                                else if (action.type === 'unhide') handleUnhideAd(ad._id);
                                                else if (action.type === 'delete') handleDeleteAd(ad._id, ad.title);
                                             }}
                                             disabled={actionLoading[ad._id]}
                                             className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 ${action.color}`}
                                          >
                                             {actionLoading[ad._id] === `${action.type}ing` ? '...' : action.label}
                                          </button>
                                       ))}
                                    </div>
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

export default AdminAdsPage;