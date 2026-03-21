import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tripsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const CreateTripPage = () => {
   const navigate = useNavigate();
   const { user } = useAuth();
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);

   const [formData, setFormData] = useState({
      title: '',
      description: '',
      location: '',
      difficulty: 'moderate',
      maxParticipants: '',
      startDate: '',
      endDate: '',
      meetingPoint: '',
      requirements: '',
      costPerPerson: '',
      coverImageUrl: '',
      photos: ['', '', ''],
      locationCoords: null,
      meetingPointCoords: null
   });

   const { isLoaded } = useJsApiLoader({
      id: 'google-map-script',
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
   });

   const mapContainerStyle = {
      width: '100%',
      height: '300px',
      borderRadius: '0.75rem',
      marginTop: '1rem'
   };

   const defaultCenter = { lat: 10.762622, lng: 106.660172 }; // HCM City

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
         ...prev,
         [name]: value
      }));
   };

   const handlePhotoChange = (index, value) => {
      const newPhotos = [...formData.photos];
      newPhotos[index] = value;
      setFormData(prev => ({ ...prev, photos: newPhotos }));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      if (!formData.title.trim()) { setError('Tiêu đề chuyến đi là bắt buộc'); return; }
      if (!formData.location.trim()) { setError('Địa điểm là bắt buộc'); return; }
      if (!formData.startDate) { setError('Ngày bắt đầu là bắt buộc'); return; }

      try {
         setLoading(true);
         setError(null);

         const tripData = {
            title: formData.title.trim(),
            description: formData.description.trim(),
            location: formData.location.trim(),
            difficulty: formData.difficulty,
            maxMembers: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
            startDate: formData.startDate,
            endDate: formData.endDate || undefined,
            meetingPoint: formData.meetingPoint.trim(),
            requirements: formData.requirements.trim(),
            costPerPerson: formData.costPerPerson ? parseFloat(formData.costPerPerson) : undefined,
            coverImageUrl: formData.coverImageUrl.trim() || undefined,
            photos: formData.photos.filter(url => url && url.trim().length > 0),
            locationCoords: formData.locationCoords,
            meetingPointCoords: formData.meetingPointCoords
         };

         const response = await tripsAPI.createTrip(tripData);

         if (response && response.trip && response.trip._id) {
            navigate(`/trips/${response.trip._id}`);
         } else {
            setError('Đã tạo chuyến đi nhưng không thể chuyển hướng đến trang chi tiết');
         }
      } catch (err) {
         setError(err.message || 'Tạo chuyến đi thất bại');
      } finally {
         setLoading(false);
      }
   };

   if (!user) {
      return (
         <Layout>
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
               <span className="material-icons-round text-6xl text-slate-300 mb-4">lock</span>
               <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Yêu cầu đăng nhập</h1>
               <p className="text-slate-500 mb-6">Bạn cần đăng nhập để tạo chuyến đi.</p>
               <button onClick={() => navigate('/login')} className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-emerald-700 transition">Đăng nhập ngay</button>
            </div>
         </Layout>
      );
   }

   const difficultyLabels = { easy: "Dễ", moderate: "Vừa", hard: "Khó", extreme: "Cực khó" };

   return (
      <Layout>
         <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 mt-12">
            <div className="mb-12">
               <h1 className="text-4xl font-bold mb-2 text-slate-900 dark:text-white">Tạo Chuyến Đi Mới</h1>
               <p className="text-slate-500 dark:text-slate-400">Thiết kế chuyến thám hiểm trekking hoàn hảo của bạn và tìm những người bạn đồng hành phù hợp.</p>
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
                     {/* General Info */}
                     <div className="bg-white dark:bg-slate-900/50 p-8 rounded-2xl shadow-sm space-y-6 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2 mb-2">
                           <span className="material-icons-round text-primary">info</span>
                           <h2 className="text-xl font-bold text-slate-800 dark:text-white">Thông Tin Chung</h2>
                        </div>
                        <div className="space-y-6">
                           <div className="group">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Tiêu Đề Chuyến Đi *</label>
                              <input
                                 name="title"
                                 value={formData.title}
                                 onChange={handleInputChange}
                                 className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary placeholder-slate-300 dark:placeholder-slate-600 dark:text-white transition-all"
                                 placeholder="VD: Trekking Sơn Đoòng"
                                 type="text"
                                 required
                              />
                           </div>
                           <div className="group">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Mô Tả</label>
                              <textarea
                                 name="description"
                                 value={formData.description}
                                 onChange={handleInputChange}
                                 className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary placeholder-slate-300 dark:placeholder-slate-600 dark:text-white transition-all resize-y min-h-[120px]"
                                 placeholder="Mô tả chuyến đi của bạn, những gì mong đợi, điểm nổi bật, v.v."
                                 rows={4}
                              ></textarea>
                           </div>
                        </div>
                     </div>

                     {/* Logistics */}
                     <div className="bg-white dark:bg-slate-900/50 p-8 rounded-2xl shadow-sm space-y-8 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                           <span className="material-icons-round text-primary">explore</span>
                           <h2 className="text-xl font-bold text-slate-800 dark:text-white">Logistics & Chi Tiết</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                           {/* Location */}
                           <div>
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Địa Điểm *</label>
                              <div className="relative">
                                 <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">place</span>
                                 <input
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary dark:text-white transition-all"
                                    placeholder="Sơn Đoòng, Việt Nam"
                                    type="text"
                                    required
                                 />
                              </div>
                              {isLoaded && (
                                 <div className="mt-4">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Hoặc chọn trên bản đồ</p>
                                    <GoogleMap
                                       mapContainerStyle={mapContainerStyle}
                                       center={formData.locationCoords || defaultCenter}
                                       zoom={10}
                                       onClick={(e) => setFormData(prev => ({ ...prev, locationCoords: { lat: e.latLng.lat(), lng: e.latLng.lng() } }))}
                                    >
                                       {formData.locationCoords && <Marker position={formData.locationCoords} />}
                                    </GoogleMap>
                                 </div>
                              )}
                           </div>

                           {/* Difficulty */}
                           <div>
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Mức Độ Khó</label>
                              <div className="relative">
                                 <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">leaderboard</span>
                                 <select
                                    name="difficulty"
                                    value={formData.difficulty}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary dark:text-white transition-all appearance-none"
                                 >
                                    <option value="easy">Dễ</option>
                                    <option value="moderate">Vừa</option>
                                    <option value="hard">Khó</option>
                                    <option value="extreme">Cực khó</option>
                                 </select>
                                 <span className="material-icons-round absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">expand_more</span>
                              </div>
                           </div>

                           {/* Start Date */}
                           <div>
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Ngày Bắt Đầu *</label>
                              <div className="relative">
                                 <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">calendar_today</span>
                                 <input
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary dark:text-white transition-all"
                                    type="date"
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                 />
                              </div>
                           </div>

                           {/* End Date */}
                           <div>
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Ngày Kết Thúc</label>
                              <div className="relative">
                                 <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">event</span>
                                 <input
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary dark:text-white transition-all"
                                    type="date"
                                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                                 />
                              </div>
                           </div>

                           {/* Max Participants */}
                           <div>
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Số Người Tham Gia Tối Đa</label>
                              <div className="relative">
                                 <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">group</span>
                                 <input
                                    name="maxParticipants"
                                    value={formData.maxParticipants}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary dark:text-white transition-all"
                                    placeholder="10"
                                    type="number"
                                    min="1"
                                 />
                              </div>
                           </div>

                           {/* Cost */}
                           <div>
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Chi Phí Mỗi Người</label>
                              <div className="relative">
                                 <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">payments</span>
                                 <input
                                    name="costPerPerson"
                                    value={formData.costPerPerson}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary dark:text-white transition-all"
                                    placeholder="1000000"
                                    type="number"
                                    min="0"
                                    step="1000"
                                 />
                              </div>
                           </div>

                           {/* Meeting Point */}
                           <div className="md:col-span-2">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Điểm Hẹn</label>
                              <div className="relative">
                                 <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">near_me</span>
                                 <input
                                    name="meetingPoint"
                                    value={formData.meetingPoint}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary dark:text-white transition-all"
                                    placeholder="Nhóm sẽ gặp nhau ở đâu?"
                                    type="text"
                                 />
                              </div>
                              {isLoaded && (
                                 <div className="mt-4">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Hoặc chọn trên bản đồ</p>
                                    <GoogleMap
                                       mapContainerStyle={mapContainerStyle}
                                       center={formData.meetingPointCoords || formData.locationCoords || defaultCenter}
                                       zoom={13}
                                       onClick={(e) => setFormData(prev => ({ ...prev, meetingPointCoords: { lat: e.latLng.lat(), lng: e.latLng.lng() } }))}
                                    >
                                       {formData.meetingPointCoords && (
                                          <Marker
                                             position={formData.meetingPointCoords}
                                             icon={{ url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }}
                                          />
                                       )}
                                    </GoogleMap>
                                 </div>
                              )}
                           </div>

                           {/* Requirements */}
                           <div className="md:col-span-2">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Yêu Cầu & Trang Bị</label>
                              <textarea
                                 name="requirements"
                                 value={formData.requirements}
                                 onChange={handleInputChange}
                                 className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary dark:text-white transition-all resize-y min-h-[100px]"
                                 placeholder="Liệt kê bất kỳ thiết bị, mức độ thể lực hoặc sự chuẩn bị nào cần thiết..."
                                 rows={3}
                              ></textarea>
                           </div>
                        </div>
                     </div>

                     {/* Media */}
                     <div className="bg-white dark:bg-slate-900/50 p-8 rounded-2xl shadow-sm space-y-6 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2 mb-2">
                           <span className="material-icons-round text-primary">image</span>
                           <h2 className="text-xl font-bold text-slate-800 dark:text-white">Hình Ảnh</h2>
                        </div>

                        <div className="space-y-4">
                           <div>
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">URL Ảnh Bìa</label>
                              <input
                                 name="coverImageUrl"
                                 value={formData.coverImageUrl}
                                 onChange={handleInputChange}
                                 className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary dark:text-white transition-all"
                                 placeholder="https://example.com/cover.jpg"
                                 type="url"
                              />
                           </div>

                           <div>
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Ảnh Thư Viện Bổ Sung (Tối Đa 3)</label>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                 {formData.photos.map((photo, index) => (
                                    <input
                                       key={index}
                                       value={photo}
                                       onChange={(e) => handlePhotoChange(index, e.target.value)}
                                       className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary dark:text-white transition-all text-sm"
                                       placeholder={`URL Ảnh ${index + 1}`}
                                       type="url"
                                    />
                                 ))}
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Live Preview */}
                  <div className="lg:col-span-5">
                     <div className="sticky top-32">
                        <div className="flex items-center justify-between mb-4 px-2">
                           <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Xem Trước</h3>
                           <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-bold">Bản Nháp</span>
                        </div>
                        <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white dark:border-slate-800">
                           <div className="relative h-64 bg-slate-200 dark:bg-slate-800 group">
                              <img
                                 alt="Cover Preview"
                                 className="w-full h-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                                 src={formData.coverImageUrl || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b'}
                                 onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b'; }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                              <div className="absolute bottom-6 left-6 right-6 text-white">
                                 <span className="bg-primary/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Người Tổ Chức</span>
                                 <h4 className="text-2xl font-bold mt-2 leading-tight drop-shadow-md">{formData.title || 'Tiêu Đề Chuyến Đi Của Bạn'}</h4>
                                 <div className="flex items-center gap-2 mt-2 text-sm text-white/90">
                                    <span className="material-icons-round text-sm">place</span>
                                    {formData.location || 'Địa điểm'}
                                 </div>
                              </div>
                           </div>
                           <div className="p-6 space-y-6">
                              <div className="flex gap-2">
                                 <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold uppercase text-slate-500">{difficultyLabels[formData.difficulty] || formData.difficulty}</span>
                                 {formData.costPerPerson && <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-lg text-xs font-bold uppercase text-green-600">{Number(formData.costPerPerson).toLocaleString('vi-VN')} VNĐ</span>}
                              </div>
                              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-3 min-h-[3rem]">
                                 {formData.description || 'Bắt đầu nhập mô tả của bạn để thấy nó xuất hiện ở đây. Hãy chia sẻ những điều làm cho chuyến đi này trở nên đặc biệt...'}
                              </p>
                              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                       {user?.displayName?.[0] || 'B'}
                                    </div>
                                    <div className="text-xs">
                                       <p className="font-bold text-slate-800 dark:text-white">{user?.displayName || 'Bạn'}</p>
                                       <p className="text-slate-400">Người Tổ Chức</p>
                                    </div>
                                 </div>
                                 <div className="text-right">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Bắt Đầu</p>
                                    <p className="text-sm font-bold text-primary">{formData.startDate ? new Date(formData.startDate).toLocaleDateString() : 'Sắp tới'}</p>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Floating Action Buttons */}
                        <div className="mt-8 flex gap-4 justify-end">
                           <button
                              type="button"
                              onClick={() => navigate('/')}
                              className="px-6 py-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-bold transition-all"
                           >
                              Hủy
                           </button>
                           <button
                              type="submit"
                              disabled={loading}
                              className="px-8 py-4 bg-primary hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-xl shadow-primary/20 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                           >
                              <span className="material-icons-round">rocket_launch</span>
                              {loading ? 'Đang tạo...' : 'Tạo Chuyến Đi'}
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

export default CreateTripPage;