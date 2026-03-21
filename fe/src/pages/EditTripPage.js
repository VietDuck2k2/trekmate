import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tripsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const EditTripPage = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const { user } = useAuth();
   const [loading, setLoading] = useState(true);
   const [saving, setSaving] = useState(false);
   const [error, setError] = useState(null);

   const [formData, setFormData] = useState({
      title: '',
      description: '',
      location: '',
      difficulty: 'moderate',
      maxMembers: '',
      startDate: '',
      endDate: '',
      meetingPoint: '',
      requirements: '',
      costPerPerson: '',
      coverImageUrl: '',
      photos: [],
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

   useEffect(() => {
      loadTripData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [id]);

   const loadTripData = async () => {
      try {
         setLoading(true);
         const trip = await tripsAPI.getTripDetails(id);

         if (!trip || !trip.createdBy) {
            setError('Dữ liệu chuyến đi không hợp lệ');
            return;
         }

         if (trip.createdBy._id !== user._id) {
            setError('Bạn chỉ có thể chỉnh sửa các chuyến đi do bạn tạo');
            return;
         }

         setFormData({
            title: trip.title || '',
            description: trip.description || '',
            location: trip.location || '',
            difficulty: trip.difficulty || 'moderate',
            maxMembers: trip.maxMembers || '',
            startDate: trip.startDate ? trip.startDate.split('T')[0] : '',
            endDate: trip.endDate ? trip.endDate.split('T')[0] : '',
            meetingPoint: trip.meetingPoint || '',
            requirements: trip.requirements || '',
            costPerPerson: trip.costPerPerson || '',
            coverImageUrl: trip.coverImageUrl || '',
            photos: trip.photos || [],
            locationCoords: trip.locationCoords || null,
            meetingPointCoords: trip.meetingPointCoords || null
         });
      } catch (error) {
         setError(error.message);
      } finally {
         setLoading(false);
      }
   };

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

   const handleAddPhoto = () => {
      if (formData.photos.length < 3) {
         setFormData(prev => ({ ...prev, photos: [...prev.photos, ''] }));
      }
   };

   const handleRemovePhoto = (index) => {
      const newPhotos = formData.photos.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, photos: newPhotos }));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      if (!formData.title.trim()) { setError('Tiêu đề chuyến đi là bắt buộc'); return; }
      if (!formData.location.trim()) { setError('Địa điểm là bắt buộc'); return; }
      if (!formData.startDate) { setError('Ngày bắt đầu là bắt buộc'); return; }

      try {
         setSaving(true);
         setError(null);

         const tripData = {
            ...formData,
            maxMembers: formData.maxMembers ? parseInt(formData.maxMembers) : null,
            costPerPerson: formData.costPerPerson ? parseFloat(formData.costPerPerson) : null,
            photos: formData.photos.filter(url => url && url.trim().length > 0)
         };

         await tripsAPI.updateTrip(id, tripData);
         navigate(`/trips/${id}`);
      } catch (error) {
         setError(error.message);
      } finally {
         setSaving(false);
      }
   };

   if (loading) {
      return (
         <Layout>
            <div className="flex justify-center items-center min-h-[60vh]">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
         </Layout>
      );
   }

   if (error && !formData.title) {
      return (
         <Layout>
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
               <span className="material-icons-round text-6xl text-red-300 mb-4">error_outline</span>
               <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Lỗi Tải Chuyến Đi</h1>
               <p className="text-red-500 mb-6">{error}</p>
               <button onClick={() => navigate('/')} className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-emerald-700 transition">Quay Lại Trang Chủ</button>
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
                  <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Chỉnh Sửa Chuyến Đi</h1>
               </div>
               <p className="text-slate-500 dark:text-slate-400 ml-14">Cập nhật chi tiết cho chuyến thám hiểm sắp tới của bạn.</p>
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
                                 placeholder="VD: Trekking Trại Cơ Sở Everest"
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
                                 placeholder="Mô tả chuyến đi của bạn, những gì đáng mong đợi, điểm nổi bật, v.v."
                                 rows={4}
                              ></textarea>
                           </div>
                        </div>
                     </div>

                     {/* Logistics */}
                     <div className="bg-white dark:bg-slate-900/50 p-8 rounded-2xl shadow-sm space-y-8 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                           <span className="material-icons-round text-primary">explore</span>
                           <h2 className="text-xl font-bold text-slate-800 dark:text-white">Hậu Cần & Chi Tiết</h2>
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
                                    placeholder="Himalayas, Nepal"
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
                                    <option value="moderate">Trung Bình</option>
                                    <option value="hard">Khó</option>
                                    <option value="extreme">Cực Khó</option>
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
                                    min={formData.startDate || ''}
                                 />
                              </div>
                           </div>

                           {/* Max Participants */}
                           <div>
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Số Người Gian Gia Tối Đa</label>
                              <div className="relative">
                                 <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">group</span>
                                 <input
                                    name="maxMembers"
                                    value={formData.maxMembers}
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
                                    placeholder="0"
                                    type="number"
                                    min="0"
                                    step="0.01"
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
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">URL Hình Ảnh Bìa</label>
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
                              <div className="flex justify-between items-center mb-2">
                                 <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Thư Viện Ảnh (Tối Đa 3)</label>
                                 {formData.photos.length < 3 && (
                                    <button
                                       type="button"
                                       onClick={handleAddPhoto}
                                       className="text-primary text-xs font-bold uppercase hover:bg-primary/10 px-2 py-1 rounded transition-colors"
                                    >
                                       + Thêm Ảnh
                                    </button>
                                 )}
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                 {formData.photos.map((photo, index) => (
                                    <div key={index} className="relative group">
                                       <input
                                          value={photo}
                                          onChange={(e) => handlePhotoChange(index, e.target.value)}
                                          className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-primary dark:text-white transition-all text-sm"
                                          placeholder={`URL Ảnh ${index + 1}`}
                                          type="url"
                                       />
                                       <button
                                          type="button"
                                          onClick={() => handleRemovePhoto(index)}
                                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 p-1"
                                       >
                                          <span className="material-icons-round text-sm">close</span>
                                       </button>
                                    </div>
                                 ))}
                                 {formData.photos.length === 0 && (
                                    <div className="text-slate-400 text-sm italic col-span-3 text-center py-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                       Không có ảnh bổ sung. Nhấp vào "Thêm Ảnh" để thêm.
                                    </div>
                                 )}
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Live Preview */}
                  <div className="lg:col-span-5">
                     <div className="sticky top-32">
                        <div className="flex items-center justify-between mb-4 px-2">
                           <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Xem Trước Trực Tiếp</h3>
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
                                 <h4 className="text-2xl font-bold mt-2 leading-tight drop-shadow-md">{formData.title || 'Tiêu Đề Trekking Của Bạn Ở Đây'}</h4>
                                 <div className="flex items-center gap-2 mt-2 text-sm text-white/90">
                                    <span className="material-icons-round text-sm">place</span>
                                    {formData.location || 'Địa Điểm'}
                                 </div>
                              </div>
                           </div>
                           <div className="p-6 space-y-6">
                              <div className="flex gap-2">
                                 <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold uppercase text-slate-500">
                                    {formData.difficulty === 'easy' ? 'Dễ' : formData.difficulty === 'moderate' ? 'Trung Bình' : formData.difficulty === 'hard' ? 'Khó' : formData.difficulty === 'extreme' ? 'Cực Khó' : formData.difficulty}
                                 </span>
                                 {formData.costPerPerson && <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-lg text-xs font-bold uppercase text-green-600">${formData.costPerPerson}</span>}
                              </div>
                              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-3 min-h-[3rem]">
                                 {formData.description || 'Bắt đầu nhập mô tả của bạn để xem nó hiển thị ở đây. Chia sẻ điều gì làm cho chuyến đi này đặc biệt...'}
                              </p>
                              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                       {user?.displayName?.[0] || 'U'}
                                    </div>
                                    <div className="text-xs">
                                       <p className="font-bold text-slate-800 dark:text-white">{user?.displayName || 'Bạn'}</p>
                                       <p className="text-slate-400">Người Tổ Chức</p>
                                    </div>
                                 </div>
                                 <div className="text-right">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Bắt đầu</p>
                                    <p className="text-sm font-bold text-primary">{formData.startDate ? new Date(formData.startDate).toLocaleDateString() : 'Chưa xác định'}</p>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Floating Action Buttons */}
                        <div className="mt-8 flex gap-4 justify-end">
                           <button
                              type="button"
                              onClick={() => navigate(`/trips/${id}`)}
                              className="px-6 py-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-bold transition-all"
                           >
                              Hủy
                           </button>
                           <button
                              type="submit"
                              disabled={saving}
                              className="px-8 py-4 bg-primary hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-xl shadow-primary/20 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                           >
                              <span className="material-icons-round">save</span>
                              {saving ? 'Đang Lưu...' : 'Cập Nhật Chuyến Đi'}
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

export default EditTripPage;