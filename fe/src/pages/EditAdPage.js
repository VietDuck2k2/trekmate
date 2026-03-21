import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';

const EditAdPage = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const { user, hasRole } = useAuth();
   const [loading, setLoading] = useState(false);
   const [fetching, setFetching] = useState(true);
   const [error, setError] = useState(null);
   const [success, setSuccess] = useState(false);
   const [ad, setAd] = useState(null);

   const [formData, setFormData] = useState({
      title: '',
      description: '',
      imageUrl: '',
      linkUrl: '',
      status: 'PENDING',
      category: 'OTHER'
   });

   useEffect(() => {
      const fetchAd = async () => {
         try {
            setFetching(true);
            setError(null);
            const data = await adsAPI.getAdDetails(id);

            const brandIdString = typeof data.brandId === 'object' ? data.brandId._id : data.brandId;
            const userIdString = user?._id;

            if (brandIdString !== userIdString && !hasRole('ADMIN')) {
               setError('Bạn không có quyền chỉnh sửa quảng cáo này');
               return;
            }

            setAd(data);
            setFormData({
               title: data.title,
               description: data.description,
               imageUrl: data.imageUrl || '',
               linkUrl: data.linkUrl || '',
               status: data.status,
               category: data.category || 'OTHER'
            });
         } catch (err) {
            setError(err.message || 'Không thể tải chi tiết quảng cáo');
         } finally {
            setFetching(false);
         }
      };

      fetchAd();
   }, [id, user, hasRole]);

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
         ...prev,
         [name]: value
      }));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      if (!formData.title.trim()) { setError('Tiêu đề là bắt buộc'); return; }
      if (!formData.description.trim()) { setError('Mô tả là bắt buộc'); return; }

      try {
         setLoading(true);
         setError(null);

         const updatedData = {
            title: formData.title.trim(),
            description: formData.description.trim(),
            imageUrl: formData.imageUrl.trim() || undefined,
            linkUrl: formData.linkUrl.trim() || undefined,
            status: formData.status,
            category: formData.category
         };

         await adsAPI.updateAd(id, updatedData);
         setSuccess(true);
         setTimeout(() => { navigate('/brand'); }, 2000);
      } catch (err) {
         setError(err.message || 'Cập nhật quảng cáo thất bại');
      } finally {
         setLoading(false);
      }
   };

   if (fetching) {
      return (
         <Layout>
            <div className="flex justify-center items-center min-h-[60vh]">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
         </Layout>
      );
   }

   if (error && !ad) {
      return (
         <Layout>
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
               <span className="material-icons-round text-6xl text-red-300 mb-4">gpp_bad</span>
               <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Từ Chối Quyền Truy Cập</h2>
               <p className="text-red-500 mb-6">{error}</p>
               <button onClick={() => navigate('/brand')} className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-emerald-700 transition">Quay Lại Quảng Cáo Của Tôi</button>
            </div>
         </Layout>
      );
   }

   if (success) {
      return (
         <Layout>
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
               <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <span className="material-icons-round text-5xl text-green-600">check</span>
               </div>
               <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Cập Nhật Quảng Cáo Thành Công!</h2>
               <p className="text-slate-500 mb-6">Các thay đổi của bạn đã được lưu. Đang chuyển hướng...</p>
            </div>
         </Layout>
      );
   }

   return (
      <Layout>
         <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 mt-12">
            <div className="mb-12">
               <div className="flex items-center gap-4 mb-2">
                  <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                     <span className="material-icons-round">arrow_back</span>
                  </button>
                  <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Chỉnh Sửa Quảng Cáo</h1>
               </div>
               <p className="text-slate-500 dark:text-slate-400 ml-14">Cập nhật chi tiết và trạng thái quảng cáo của bạn.</p>
            </div>

            {error && (
               <div className="mb-8 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl flex items-center gap-3">
                  <span className="material-icons-round">error</span>
                  {error}
               </div>
            )}

            <form onSubmit={handleSubmit}>
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  <div className="lg:col-span-7 space-y-8">
                     <div className="bg-white dark:bg-slate-900/50 p-8 rounded-2xl shadow-sm space-y-6 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2 mb-2">
                           <span className="material-icons-round text-primary">campaign</span>
                           <h2 className="text-xl font-bold text-slate-800 dark:text-white">Chi Tiết Quảng Cáo</h2>
                        </div>

                        <div className="space-y-6">
                           <div>
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Tiêu Đề Quảng Cáo *</label>
                              <input
                                 name="title"
                                 value={formData.title}
                                 onChange={handleInputChange}
                                 className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary placeholder-slate-300 dark:placeholder-slate-600 dark:text-white transition-all"
                                 placeholder="VD: Giảm Giá Trang Bị Trekking Cao Cấp"
                                 type="text"
                                 required
                              />
                           </div>

                           <div>
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Mô Tả *</label>
                              <textarea
                                 name="description"
                                 value={formData.description}
                                 onChange={handleInputChange}
                                 className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary placeholder-slate-300 dark:placeholder-slate-600 dark:text-white transition-all resize-y min-h-[120px]"
                                 placeholder="Mô tả sản phẩm hoặc dịch vụ của bạn..."
                                 required
                                 rows={4}
                              ></textarea>
                           </div>

                           <div>
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">URL Hình Ảnh</label>
                              <input
                                 name="imageUrl"
                                 value={formData.imageUrl}
                                 onChange={handleInputChange}
                                 className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary dark:text-white transition-all"
                                 placeholder="https://example.com/image.jpg"
                                 type="url"
                              />
                           </div>

                           <div>
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">URL Liên Kết Đích</label>
                              <input
                                 name="linkUrl"
                                 value={formData.linkUrl}
                                 onChange={handleInputChange}
                                 className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary dark:text-white transition-all"
                                 placeholder="https://your-website.com"
                                 type="url"
                              />
                           </div>

                           <div>
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Trạng Thái Quảng Cáo</label>
                              <div className="relative">
                                 <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary dark:text-white transition-all appearance-none"
                                 >
                                    {hasRole('ADMIN') ? (
                                       <>
                                          <option value="ACTIVE">Hoạt Động</option>
                                          <option value="INACTIVE">Tạm Ngừng</option>
                                          <option value="PENDING">Chờ Duyệt</option>
                                          <option value="HIDDEN">Đã Ẩn</option>
                                       </>
                                    ) : (
                                       <>
                                          <option value="ACTIVE">Hoạt Động</option>
                                          <option value="INACTIVE">Tạm Ngừng</option>
                                       </>
                                    )}
                                 </select>
                                 <span className="material-icons-round absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">expand_more</span>
                              </div>
                              <p className="mt-2 text-xs text-slate-400">
                                 {hasRole('ADMIN') ? 'Quản trị viên có thể thiết lập bất kỳ trạng thái nào.' : 'Chuyển đổi giữa Hoạt Động và Tạm Ngừng để kiểm soát việc hiển thị.'}
                              </p>
                           </div>
                        </div>

                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-xl text-sm flex gap-3">
                           <span className="material-icons-round">info</span>
                           <p><strong>Lưu ý:</strong> Các thay đổi sẽ được lưu ngay lập tức.</p>
                        </div>
                     </div>
                  </div>

                  {/* Live Preview */}
                  <div className="lg:col-span-5">
                     <div className="sticky top-32">
                        <div className="flex items-center justify-between mb-4 px-2">
                           <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Xem Trước Quảng Cáo</h3>
                           <div className="flex gap-2">
                              <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase ${formData.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                                 formData.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-slate-100 text-slate-700'
                                 }`}>
                                 {formData.status === 'ACTIVE' ? 'Hoạt Động' : formData.status === 'PENDING' ? 'Chờ Duyệt' : formData.status === 'INACTIVE' ? 'Tạm Ngừng' : 'Đã Ẩn'}
                              </span>
                           </div>
                        </div>

                        {/* Ad Card Preview */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-xl">
                           <div className="relative h-64 overflow-hidden">
                              <img
                                 alt="Ad Preview"
                                 className="w-full h-full object-cover"
                                 src={formData.imageUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb7d5c73?auto=format&fit=crop&q=80'}
                                 onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542601906990-b4d3fb7d5c73?auto=format&fit=crop&q=80'; }}
                              />
                              <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary flex items-center gap-1">
                                 <span className="material-icons-round text-xs">star</span> 5.0
                              </div>
                           </div>
                           <div className="p-6">
                              <div className="flex items-center gap-3 mb-4">
                                 <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shadow-md">
                                    {ad?.brandId?.brandInfo?.brandName?.[0] || 'B'}
                                 </div>
                                 <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                                    {ad?.brandId?.brandInfo?.brandName || 'Tên Thương Hiệu'}
                                 </span>
                              </div>
                              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">
                                 {formData.title || 'Tiêu Đề Quảng Cáo'}
                              </h3>
                              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-2 min-h-[2.5rem]">
                                 {formData.description || 'Mô tả quảng cáo sẽ hiển thị ở đây...'}
                              </p>
                              <button className="inline-flex items-center justify-center w-full py-3 border-2 border-primary text-primary font-bold rounded-xl pointer-events-none opacity-80">
                                 Tìm Hiểu Thêm
                                 <span className="material-icons-round ml-2 text-sm">arrow_forward</span>
                              </button>
                           </div>
                        </div>

                        {/* Floating Action Buttons */}
                        <div className="mt-8 flex gap-4 justify-end">
                           <button
                              type="button"
                              onClick={() => navigate('/brand')}
                              className="px-6 py-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-bold transition-all"
                           >
                              Hủy
                           </button>
                           <button
                              type="submit"
                              disabled={loading}
                              className="px-8 py-4 bg-primary hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-xl shadow-primary/20 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                           >
                              <span className="material-icons-round">save</span>
                              {loading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </form>
         </div>
      </Layout>
   );
};

export default EditAdPage;
