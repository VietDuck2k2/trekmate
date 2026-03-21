import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { adsAPI } from '../services/api';
import Layout from '../components/Layout';

const BrandDashboard = () => {
   const { user } = useAuth();
   const navigate = useNavigate();
   const [ads, setAds] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [deleteConfirm, setDeleteConfirm] = useState(null);
   const [deleting, setDeleting] = useState(false);

   useEffect(() => {
      loadAds();
   }, []);

   const loadAds = async () => {
      try {
         setLoading(true);
         setError(null);
         const response = await adsAPI.getMyAds({ limit: 50 });
         const adsData = Array.isArray(response?.ads) ? response.ads : [];
         setAds(adsData);
      } catch (err) {
         console.error('Error loading ads:', err);
         setError(err.message || 'Không thể tải quảng cáo của bạn');
         setAds([]);
      } finally {
         setLoading(false);
      }
   };

   const handleDelete = async (adId) => {
      try {
         setDeleting(true);
         await adsAPI.deleteAd(adId);
         setAds(ads.filter(ad => ad._id !== adId));
         setDeleteConfirm(null);
      } catch (err) {
         alert('Lỗi khi xóa quảng cáo: ' + err.message);
      } finally {
         setDeleting(false);
      }
   };

   const getStatusParams = (status) => {
      switch (status) {
         case 'ACTIVE': return { color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30', icon: 'check_circle', text: 'Hoạt động' };
         case 'PENDING': return { color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: 'hourglass_empty', text: 'Đang chờ duyệt' };
         case 'INACTIVE': return { color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-800', icon: 'pause_circle', text: 'Không hoạt động' };
         case 'HIDDEN': return { color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30', icon: 'visibility_off', text: 'Đã ẩn' };
         default: return { color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-800', icon: 'help', text: status };
      }
   };

   return (
      <Layout>
         <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 mt-12">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
               <div>
                  <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Quảng Cáo Của Tôi</h1>
                  <p className="text-slate-500 dark:text-slate-400">Quản lý quảng cáo và khuyến mãi thương hiệu của bạn.</p>
               </div>
               <button
                  onClick={() => navigate('/brand/ads/create')}
                  className="bg-primary hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
               >
                  <span className="material-icons-round">add</span>
                  Tạo Quảng Cáo Mới
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
            ) : ads.length === 0 ? (
               <div className="text-center py-24 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed">
                  <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                     <span className="material-icons-round text-4xl text-slate-300">campaign</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Chưa có quảng cáo nào</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">Tạo quảng cáo đầu tiên của bạn để bắt đầu quảng bá thương hiệu của bạn cho cộng đồng.</p>
                  <button
                     onClick={() => navigate('/brand/ads/create')}
                     className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white rounded-xl font-bold hover:shadow-lg transition-all"
                  >
                     Tạo Quảng Cáo
                  </button>
               </div>
            ) : (
               <div className="grid gap-6">
                  {ads.map(ad => {
                     const status = getStatusParams(ad.status);
                     return (
                        <div key={ad._id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-6 items-start hover:shadow-md transition-shadow">
                           {/* Thumbnail */}
                           <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                              <img
                                 src={ad.imageUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb7d5c73?auto=format&fit=crop&q=80'}
                                 alt={ad.title}
                                 className="w-full h-full object-cover"
                                 onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542601906990-b4d3fb7d5c73?auto=format&fit=crop&q=80'; }}
                              />
                           </div>

                           {/* Content */}
                           <div className="flex-grow min-w-0 w-full">
                              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
                                 <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 truncate">{ad.title}</h3>
                                    <div className="flex flex-wrap gap-3 items-center text-sm">
                                       <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1 ${status.bg} ${status.color}`}>
                                          <span className="material-icons-round text-[14px]">{status.icon}</span>
                                          {status.text}
                                       </span>
                                       <span className="text-slate-400">Đã tạo: {new Date(ad.createdAt).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                 </div>

                                 {/* Actions */}
                                 <div className="flex gap-2 shrink-0">
                                    <button
                                       onClick={() => navigate(`/brand/ads/edit/${ad._id}`)}
                                       className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                       title="Chỉnh Sửa"
                                    >
                                       <span className="material-icons-round">edit</span>
                                    </button>
                                    <button
                                       onClick={() => setDeleteConfirm(ad)}
                                       className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                       title="Xóa"
                                    >
                                       <span className="material-icons-round">delete</span>
                                    </button>
                                 </div>
                              </div>

                              <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-3">{ad.description}</p>

                              {ad.linkUrl && (
                                 <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="text-primary text-sm font-bold hover:underline flex items-center gap-1 w-fit">
                                    <span className="material-icons-round text-sm">link</span>
                                    {ad.linkUrl}
                                 </a>
                              )}
                           </div>
                        </div>
                     );
                  })}
               </div>
            )}

            {/* Delete Modal */}
            {deleteConfirm && (
               <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                  <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl transform transition-all scale-100">
                     <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
                        <span className="material-icons-round text-2xl">warning</span>
                     </div>
                     <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Xóa Quảng Cáo?</h3>
                     <p className="text-slate-500 dark:text-slate-400 mb-6">
                        Bạn có chắc chắn muốn xóa "<strong>{deleteConfirm.title}</strong>"? Hành động này không thể hoàn tác.
                     </p>
                     <div className="flex gap-3 justify-end">
                        <button
                           onClick={() => setDeleteConfirm(null)}
                           className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                        >
                           Hủy
                        </button>
                        <button
                           onClick={() => handleDelete(deleteConfirm._id)}
                           disabled={deleting}
                           className="px-5 py-2.5 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center gap-2"
                        >
                           {deleting ? 'Đang xóa...' : 'Xóa Quảng Cáo'}
                        </button>
                     </div>
                  </div>
               </div>
            )}

         </div>
      </Layout>
   );
};

export default BrandDashboard;