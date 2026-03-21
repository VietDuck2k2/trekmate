import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';

const CreateAdPage = () => {
   const navigate = useNavigate();
   const { user } = useAuth();
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   const [success, setSuccess] = useState(false);

   const [formData, setFormData] = useState({
      title: '',
      description: '',
      imageUrl: '',
      linkUrl: '',
      category: 'OTHER'
   });

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

         const adData = {
            title: formData.title.trim(),
            description: formData.description.trim(),
            imageUrl: formData.imageUrl.trim() || undefined,
            linkUrl: formData.linkUrl.trim() || undefined,
            category: formData.category
         };

         await adsAPI.createAd(adData);
         setSuccess(true);
         setTimeout(() => { navigate('/brand'); }, 2000);
      } catch (err) {
         setError(err.message || 'Tạo quảng cáo thất bại');
         setLoading(false);
      }
   };

   if (success) {
      return (
         <Layout>
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
               <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <span className="material-icons-round text-5xl text-green-600">check</span>
               </div>
               <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Quảng Cáo Đã Được Tạo Thành Công!</h2>
               <p className="text-slate-500 mb-6">Quảng cáo của bạn đã được gửi để xét duyệt. Đang chuyển hướng...</p>
            </div>
         </Layout>
      );
   }

   return (
      <Layout>
         <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 mt-12">
            <div className="mb-12">
               <h1 className="text-4xl font-bold mb-2 text-slate-900 dark:text-white">Tạo Quảng Cáo</h1>
               <p className="text-slate-500 dark:text-slate-400">Quảng bá trang bị, tour du lịch hoặc dịch vụ của bạn cho cộng đồng TrekMate.</p>
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
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Danh Mục *</label>
                              <select
                                 name="category"
                                 value={formData.category}
                                 onChange={handleInputChange}
                                 className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary dark:text-white transition-all"
                                 required
                              >
                                 <option value="OTHER">Khác</option>
                                 <option value="STAY">Chỗ ở (Khách sạn, Homestay...)</option>
                                 <option value="EAT">Ăn uống (Nhà hàng, Quán...)</option>
                                 <option value="PLAY">Giải trí (Địa điểm, Công viên...)</option>
                              </select>
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
                        </div>

                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-xl text-sm flex gap-3">
                           <span className="material-icons-round">info</span>
                           <p>Quảng cáo của bạn sẽ được nộp với trạng thái <strong>ĐANG CHỜ DUYỆT</strong> và sẽ được quản trị viên xét duyệt trước khi hiển thị.</p>
                        </div>
                     </div>
                  </div>

                  {/* Live Preview */}
                  <div className="lg:col-span-5">
                     <div className="sticky top-32">
                        <div className="flex items-center justify-between mb-4 px-2">
                           <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Bản Xem Trước Quảng Cáo</h3>
                           <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-bold">Bản Nháp</span>
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
                                    {user?.brandInfo?.brandName?.[0] || user?.displayName?.[0] || 'B'}
                                 </div>
                                 <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                                    {user?.brandInfo?.brandName || user?.displayName || 'Thương Hiệu Của Bạn'}
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
                              <span className="material-icons-round">add_circle</span>
                              {loading ? 'Đang Tạo...' : 'Tạo Quảng Cáo'}
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

export default CreateAdPage;
