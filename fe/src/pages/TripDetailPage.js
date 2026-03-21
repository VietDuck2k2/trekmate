import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tripsAPI, reviewAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import Layout from '../components/Layout';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const TripDetailPage = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const { user } = useAuth();
   const { refreshNotifications } = useNotifications();

   const [trip, setTrip] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [actionLoading, setActionLoading] = useState(false);

   // Reviews state
   const [reviews, setReviews] = useState([]);
   const [reviewStats, setReviewStats] = useState({ totalReviews: 0, averageRating: 0 });
   const [userReview, setUserReview] = useState(null);
   const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
   const [reviewLoading, setReviewLoading] = useState(false);
   const [reviewEligibility, setReviewEligibility] = useState({ isReviewable: false, reason: null, loading: true });

   // Join request state
   const [joinMessage, setJoinMessage] = useState('');
   const [showJoinForm, setShowJoinForm] = useState(false);

   const { isLoaded } = useJsApiLoader({
      id: 'google-map-script',
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
   });

   const mapContainerStyle = {
      width: '100%',
      height: '350px',
      borderRadius: '1rem'
   };


   const loadTripDetails = useCallback(async () => {
      try {
         setLoading(true);
         setError(null);
         if (!id) throw new Error('Thiếu ID chuyến đi từ URL');
         const tripData = await tripsAPI.getTripDetails(id);
         setTrip(tripData);
      } catch (err) {
         console.error('Error loading trip details:', err);
         setError(err.message || 'Không thể tải chi tiết chuyến đi');
      } finally {
         setLoading(false);
      }
   }, [id]);

   // Logic Handlers (Keep exactly as is)
   const handleJoinTrip = async () => {
      if (!user) {
         navigate('/login');
         return;
      }
      try {
         setActionLoading(true);
         await tripsAPI.requestToJoin(id, joinMessage);
         setJoinMessage('');
         setShowJoinForm(false);
         await loadTripDetails();
         refreshNotifications();
         alert('Yêu cầu tham gia đã được gửi! Người tổ chức sẽ xem xét yêu cầu của bạn.');
      } catch (err) {
         alert('Nhận yêu cầu tham gia thất bại: ' + err.message);
      } finally {
         setActionLoading(false);
      }
   };

   const handleLeaveTrip = async () => {
      if (!window.confirm('Bạn có chắc chắn muốn rời khỏi chuyến đi này không?')) return;
      try {
         setActionLoading(true);
         await tripsAPI.leaveTrip(id);
         await loadTripDetails();
      } catch (err) {
         alert('Rời khỏi chuyến đi thất bại: ' + err.message);
      } finally {
         setActionLoading(false);
      }
   };

   const handleApproveRequest = async (requestUserId) => {
      try {
         setActionLoading(true);
         await tripsAPI.approveJoinRequest(id, requestUserId);
         await loadTripDetails();
         refreshNotifications();
         alert('Yêu cầu tham gia đã được phê duyệt!');
      } catch (err) {
         alert('Phê duyệt yêu cầu thất bại: ' + err.message);
      } finally {
         setActionLoading(false);
      }
   };

   const handleRejectRequest = async (requestUserId) => {
      if (!window.confirm('Bạn có chắc chắn muốn từ chối yêu cầu tham gia này không?')) return;
      try {
         setActionLoading(true);
         await tripsAPI.rejectJoinRequest(id, requestUserId);
         await loadTripDetails();
         refreshNotifications();
         alert('Yêu cầu tham gia đã bị từ chối.');
      } catch (err) {
         alert('Từ chối yêu cầu thất bại: ' + err.message);
      } finally {
         setActionLoading(false);
      }
   };

   const loadReviews = useCallback(async () => {
      try {
         const data = await reviewAPI.getReviews(id);
         setReviews(data.reviews || []);
         setReviewStats(data.stats || { totalReviews: 0, averageRating: 0 });
      } catch (err) {
         console.error('Error loading reviews:', err);
      }
   }, [id]);

   const loadUserReview = useCallback(async () => {
      try {
         const review = await reviewAPI.getMyReview(id);
         setUserReview(review);
         if (review) {
            setReviewForm({ rating: review.rating, comment: review.comment || '' });
         }
      } catch (err) {
         console.error('Error loading user review:', err);
      }
   }, [id]);

   const loadReviewEligibility = useCallback(async () => {
      try {
         setReviewEligibility(prev => ({ ...prev, loading: true }));
         const data = await tripsAPI.checkReviewEligibility(id);
         setReviewEligibility({
            isReviewable: data.isReviewable,
            reason: data.reason,
            loading: false
         });
      } catch (err) {
         console.error('Error loading review eligibility:', err);
         setReviewEligibility({ isReviewable: false, reason: 'Không thể xác minh tính hợp lệ', loading: false });
      }
   }, [id]);

   useEffect(() => {
      loadTripDetails();
      loadReviews();
      if (user) {
         loadUserReview();
         loadReviewEligibility();
      } else {
         setReviewEligibility({ isReviewable: false, reason: 'Vui lòng đăng nhập để đánh giá', loading: false });
      }
   }, [loadTripDetails, loadReviews, loadUserReview, loadReviewEligibility, user]);

   const handleReviewSubmit = async (e) => {
      e.preventDefault();
      try {
         setReviewLoading(true);
         if (userReview) {
            await reviewAPI.updateReview(id, reviewForm);
         } else {
            await reviewAPI.createReview(id, reviewForm);
         }
         await loadReviews();
         await loadUserReview();
      } catch (err) {
         alert('Lỗi lưu đánh giá: ' + err.message);
      } finally {
         setReviewLoading(false);
      }
   };

   // Helpers
   const formatDate = (dateString, simple = false) => {
      if (!dateString) return 'Sắp tới';
      const date = new Date(dateString);
      if (simple) {
         return {
            month: date.toLocaleDateString('vi-VN', { month: 'short' }),
            day: date.getDate()
         };
      }
      return date.toLocaleDateString('vi-VN', {
         weekday: 'long',
         year: 'numeric',
         month: 'long',
         day: 'numeric'
      });
   };

   const difficultyLabels = { easy: "Dễ", moderate: "Vừa", hard: "Khó", extreme: "Cực khó" };

   const getDifficultyStyle = (difficulty) => {
      switch (difficulty?.toLowerCase()) {
         case 'easy': return 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/30';
         case 'moderate': return 'bg-orange-500/20 text-orange-600 dark:text-orange-300 border-orange-500/30';
         case 'hard': return 'bg-red-500/20 text-red-600 dark:text-red-300 border-red-500/30';
         case 'extreme': return 'bg-rose-600/20 text-rose-600 dark:text-rose-300 border-rose-600/30';
         default: return 'bg-slate-500/20 text-slate-600 dark:text-slate-300 border-slate-500/30';
      }
   };

   const isUserJoined = () => trip?.members?.some(member => member._id === user?._id);
   const isOwner = () => trip?.createdBy?._id === user?._id;
   const getUserJoinRequest = () => user && trip?.joinRequests?.find(req => req.user._id === user._id && req.status === 'PENDING');
   const getPendingRequests = () => trip?.joinRequests?.filter(req => req.status === 'PENDING') || [];

   const canReview = () => {
      return reviewEligibility.isReviewable;
   };

   const renderStars = (rating, interactive = false) => {
      return [...Array(5)].map((_, i) => (
         <span
            key={i}
            className={`text-2xl ${i < rating ? 'text-amber-400' : 'text-slate-300'} ${interactive ? 'cursor-pointer hover:text-amber-300' : ''}`}
            onClick={() => interactive && setReviewForm(prev => ({ ...prev, rating: i + 1 }))}
         >
            ★
         </span>
      ));
   };

   if (loading) {
      return (
         <Layout>
            <div className="flex items-center justify-center min-h-[60vh]">
               <div className="text-xl text-slate-500 animate-pulse">Đang tải chi tiết chuyến đi...</div>
            </div>
         </Layout>
      );
   }

   if (error || !trip) {
      return (
         <Layout>
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
               <div className="text-red-500 text-xl font-bold">Lỗi: {error || 'Không tìm thấy chuyến đi'}</div>
               <button onClick={loadTripDetails} className="px-6 py-2 bg-primary text-white rounded-lg">Thử lại</button>
            </div>
         </Layout>
      );
   }

   // --- RENDER UI ---
   return (
      <Layout>
         <div className="max-w-7xl mx-auto px-6 py-8 mt-20">
            {/* Hero Section */}
            <div className="relative h-[500px] rounded-2xl overflow-hidden mb-12 shadow-2xl group">
               <img
                  src={trip.coverImageUrl || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'}
                  alt={trip.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'; }}
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

               <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="glass-overlay p-6 md:p-8 rounded-2xl max-w-3xl backdrop-blur-md bg-white/10 border border-white/20 text-white">
                     <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`px-3 py-1 text-xs font-bold border rounded-full flex items-center gap-1 uppercase tracking-wider backdrop-blur-sm ${getDifficultyStyle(trip.difficulty)} shadow-sm`}>
                           {difficultyLabels[trip.difficulty] || trip.difficulty}
                        </span>
                        <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold border border-white/20 rounded-full flex items-center gap-1 uppercase tracking-wider backdrop-blur-sm shadow-sm">
                           <span className="material-icons-outlined text-sm">location_on</span>
                           {trip.location}
                        </span>
                        {trip.costPerPerson && (
                           <span className="px-3 py-1 bg-emerald-500/80 text-white text-xs font-bold border border-emerald-400/50 rounded-full flex items-center gap-1 shadow-sm">
                              💰 {Number(trip.costPerPerson).toLocaleString('vi-VN')} VNĐ
                           </span>
                        )}
                     </div>
                     <h1 className="text-4xl md:text-5xl font-display font-bold mb-3 leading-tight shadow-black drop-shadow-lg">{trip.title}</h1>
                     <p className="text-white/90 text-lg line-clamp-2 md:line-clamp-none font-light max-w-2xl">
                        {trip.description?.substring(0, 150)}{trip.description?.length > 150 ? '...' : ''}
                     </p>
                  </div>

                  {/* Hero Actions (Owner or User) */}
                  <div className="flex flex-col gap-3">
                     {isOwner() ? (
                        <button
                           onClick={() => navigate(`/trips/${trip._id}/edit`)}
                           className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-transform active:scale-95 whitespace-nowrap"
                        >
                           <span className="material-icons-outlined">edit</span>
                           Sửa Chuyến Đi
                        </button>
                     ) : !user ? (
                        <button
                           onClick={() => navigate('/login')}
                           className="bg-primary hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-transform active:scale-95 whitespace-nowrap"
                        >
                           Đăng nhập để Tham gia
                        </button>
                     ) : isUserJoined() ? (
                        <div className="px-8 py-4 bg-emerald-500/90 backdrop-blur-md text-white rounded-xl font-bold flex items-center gap-2 shadow-lg">
                           <span className="material-icons-outlined">check_circle</span>
                           Thành viên
                        </div>
                     ) : getUserJoinRequest() ? (
                        <div className="px-8 py-4 bg-amber-500/90 backdrop-blur-md text-white rounded-xl font-bold flex items-center gap-2 shadow-lg">
                           <span className="material-icons-outlined">hourglass_empty</span>
                           Đang chờ phê duyệt
                        </div>
                     ) : (
                        <button
                           onClick={() => setShowJoinForm(true)}
                           disabled={trip.maxMembers && trip.members?.length >= trip.maxMembers}
                           className={`${trip.maxMembers && trip.members?.length >= trip.maxMembers ? 'bg-slate-500' : 'bg-primary hover:bg-emerald-700'} text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-transform active:scale-95 whitespace-nowrap`}
                        >
                           <span className="material-icons-outlined">person_add</span>
                           {trip.maxMembers && trip.members?.length >= trip.maxMembers ? 'Chuyến đi đã đầy' : 'Tham gia Chuyến đi'}
                        </button>
                     )}

                     {/* Chat button: visible only to members and owner */}
                     {user && (isOwner() || isUserJoined()) && (
                        <button
                           onClick={() => navigate(`/trips/${trip._id}/chat`)}
                           className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all whitespace-nowrap"
                        >
                           <span className="material-icons-round">chat</span>
                           Chat nhóm
                        </button>
                     )}
                  </div>
               </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

               {/* Left Column (Details) */}
               <div className="lg:col-span-2 space-y-12">

                  {/* Organizer Banner */}
                  {isOwner() && (
                     <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 p-6 rounded-2xl flex items-center gap-5 shadow-sm">
                        <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                           <span className="material-icons-round text-3xl">stars</span>
                        </div>
                        <div>
                           <p className="font-bold text-emerald-900 dark:text-emerald-100 text-xl">Bạn là người tổ chức</p>
                           <p className="text-emerald-700/70 dark:text-emerald-400/70">Bạn có toàn quyền kiểm soát việc quản lý người tham gia và chi tiết chuyến đi.</p>
                        </div>
                     </div>
                  )}

                  {/* Join Request Form (Modal-ish inline) */}
                  {showJoinForm && (
                     <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-8 rounded-2xl shadow-xl animate-fade-in relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                           <span className="material-icons-round text-primary">send</span>
                           Yêu Cầu Tham Gia
                        </h3>
                        <textarea
                           value={joinMessage}
                           onChange={(e) => setJoinMessage(e.target.value)}
                           placeholder="Hãy cho người tổ chức biết lý do bạn muốn tham gia..."
                           className="w-full p-4 border border-slate-200 dark:border-slate-600 rounded-xl mb-4 min-h-[120px] focus:ring-2 focus:ring-primary/50 outline-none dark:bg-slate-900 dark:text-white"
                        />
                        <div className="flex gap-3 justify-end">
                           <button
                              onClick={() => setShowJoinForm(false)}
                              className="px-6 py-2.5 rounded-lg font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                           >
                              Hủy
                           </button>
                           <button
                              onClick={handleJoinTrip}
                              disabled={actionLoading}
                              className="px-6 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-primary/30 flex items-center gap-2"
                           >
                              {actionLoading ? 'Đang gửi...' : 'Gửi Yêu Cầu'}
                              <span className="material-icons-round text-sm">send</span>
                           </button>
                        </div>
                     </div>
                  )}

                  {/* Admin Area: Pending Requests */}
                  {user && (isOwner() || isUserJoined()) && getPendingRequests().length > 0 && (
                     <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-sm">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                           <span className="material-icons-round text-amber-500">pending_actions</span>
                           Yêu Cầu Đang Chờ <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">{getPendingRequests().length}</span>
                        </h3>
                        <div className="space-y-4">
                           {getPendingRequests().map(request => (
                              <div key={request.user._id} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                                 <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200">
                                       {request.user.avatarUrl ? (
                                          <img src={request.user.avatarUrl} alt={request.user.displayName} className="w-full h-full object-cover" />
                                       ) : (
                                          <div className="w-full h-full flex items-center justify-center bg-primary text-white font-bold text-lg">
                                             {request.user.displayName[0].toUpperCase()}
                                          </div>
                                       )}
                                    </div>
                                    <div>
                                       <p className="font-bold dark:text-white">{request.user.displayName}</p>
                                       <p className="text-xs text-slate-500">Đã yêu cầu: {new Date(request.createdAt).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                 </div>
                                 <div className="flex-1 w-full md:w-auto">
                                    {request.message && (
                                       <div className="bg-white dark:bg-slate-700 p-3 rounded-lg text-sm italic text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-600">
                                          "{request.message}"
                                       </div>
                                    )}
                                 </div>
                                 {isOwner() && (
                                    <div className="flex gap-2 w-full md:w-auto justify-end">
                                       <button
                                          onClick={() => handleRejectRequest(request.user._id)}
                                          className="px-4 py-2 text-sm font-bold text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                       >
                                          Từ chối
                                       </button>
                                       <button
                                          onClick={() => handleApproveRequest(request.user._id)}
                                          className="px-4 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-sm"
                                       >
                                          Phê duyệt
                                       </button>
                                    </div>
                                 )}
                              </div>
                           ))}
                        </div>
                     </div>
                  )}

                  {/* Description Section */}
                  <section>
                     <h2 className="text-3xl font-display font-bold mb-6 flex items-center gap-3 dark:text-white">
                        <span className="material-icons-round text-primary text-4xl">auto_stories</span>
                        Hành Trình
                     </h2>
                     <div className="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                        {trip.description}
                     </div>
                  </section>

                  {/* Meeting Point & Map */}
                  {(trip.meetingPoint || (trip.locationCoords && trip.locationCoords.lat)) && (
                     <section>
                        <h2 className="text-3xl font-display font-bold mb-6 flex items-center gap-3 dark:text-white">
                           <span className="material-icons-round text-primary text-4xl">place</span>
                           Địa Điểm & Điểm Hẹn
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                           {/* Address Cards */}
                           <div className="space-y-4">
                              {trip.location && (
                                 <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
                                       <span className="material-icons-round text-2xl">exploration</span>
                                    </div>
                                    <div>
                                       <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đích Đến</p>
                                       <p className="font-bold text-lg dark:text-white">{trip.location}</p>
                                    </div>
                                 </div>
                              )}

                              {trip.meetingPoint && (
                                 <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0">
                                       <span className="material-icons-round text-2xl">location_on</span>
                                    </div>
                                    <div>
                                       <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Điểm Hẹn</p>
                                       <p className="font-bold text-lg dark:text-white">{trip.meetingPoint}</p>
                                       <p className="text-xs text-slate-500 font-medium mt-0.5">Vui lòng đến đúng giờ</p>
                                    </div>
                                 </div>
                              )}
                           </div>

                           {/* Map Container */}
                           <div className="rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 min-h-[350px]">
                              {isLoaded ? (
                                 <GoogleMap
                                    mapContainerStyle={mapContainerStyle}
                                    center={trip.meetingPointCoords?.lat ? trip.meetingPointCoords : (trip.locationCoords?.lat ? trip.locationCoords : { lat: 10.762622, lng: 106.660172 })}
                                    zoom={14}
                                 >
                                    {trip.locationCoords?.lat && (
                                       <Marker
                                          position={trip.locationCoords}
                                          label="Đích Đến"
                                       />
                                    )}
                                    {trip.meetingPointCoords?.lat && (
                                       <Marker
                                          position={trip.meetingPointCoords}
                                          label="Điểm Hẹn"
                                          icon={{
                                             url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                                          }}
                                       />
                                    )}
                                 </GoogleMap>
                              ) : (
                                 <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 animate-pulse">
                                    <span className="material-icons-round text-4xl mb-2">map</span>
                                    <p className="font-bold">Đang tải Bản đồ...</p>
                                 </div>
                              )}
                           </div>
                        </div>
                     </section>
                  )}

                  {/* Requirements */}
                  {trip.requirements && (
                     <section>
                        <h2 className="text-3xl font-display font-bold mb-6 flex items-center gap-3 dark:text-white">
                           <span className="material-icons-round text-amber-500 text-4xl">warning</span>
                           Yêu Cầu
                        </h2>
                        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 p-8 rounded-2xl">
                           <p className="text-amber-900 dark:text-amber-100 text-lg leading-relaxed whitespace-pre-line">
                              {trip.requirements}
                           </p>
                        </div>
                     </section>
                  )}

                  {/* Trip Photos */}
                  {trip.photos && trip.photos.length > 0 && (
                     <section>
                        <h2 className="text-3xl font-display font-bold mb-6 flex items-center gap-3 dark:text-white">
                           <span className="material-icons-round text-primary text-4xl">perm_media</span>
                           Thư Viện Ảnh
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                           {trip.photos.map((photo, index) => (
                              <div key={index} className="aspect-square rounded-xl overflow-hidden group relative cursor-pointer shadow-sm">
                                 <img src={photo} alt="Trip" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                              </div>
                           ))}
                        </div>
                     </section>
                  )}

                  {/* Reviews Section */}
                  <section>
                     <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-display font-bold flex items-center gap-3 dark:text-white">
                           <span className="material-icons-round text-yellow-500 text-4xl">star</span>
                           Đánh Giá
                        </h2>
                        {reviewStats.totalReviews > 0 && (
                           <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-full border border-yellow-100">
                              <span className="text-yellow-600 font-bold text-lg">{reviewStats.averageRating.toFixed(1)}</span>
                              <span className="text-yellow-400">★</span>
                              <span className="text-slate-400 text-sm">({reviewStats.totalReviews} đánh giá)</span>
                           </div>
                        )}
                     </div>

                     {canReview() ? (
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-10">
                           <h3 className="text-xl font-bold mb-4 dark:text-white">Viết Đánh Giá</h3>
                           <form onSubmit={handleReviewSubmit} className="space-y-4">
                              <div className="flex items-center gap-2 mb-2">
                                 {renderStars(reviewForm.rating, true)}
                              </div>
                              <textarea
                                 className="w-full p-4 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none dark:bg-slate-800 dark:text-white"
                                 rows="3"
                                 placeholder="Chia sẻ trải nghiệm của bạn..."
                                 value={reviewForm.comment}
                                 onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                              />
                              <button
                                 type="submit"
                                 disabled={reviewLoading}
                                 className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-emerald-700 transition-colors"
                              >
                                 {reviewLoading ? 'Đang gửi...' : (userReview ? 'Cập Nhật Đánh Giá' : 'Đăng Đánh Giá')}
                              </button>
                           </form>
                        </div>
                     ) : !reviewEligibility.loading && reviewEligibility.reason && isUserJoined() && (
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 mb-10 flex items-center gap-4 text-slate-500">
                           <span className="material-icons-round text-amber-500">info</span>
                           <p>Lưu ý: {reviewEligibility.reason}. Bạn sẽ có thể viết đánh giá sau khi chuyến đi kết thúc.</p>
                        </div>
                     )}

                     <div className="grid gap-6">
                        {reviews.length > 0 ? reviews.map(review => (
                           <div key={review._id} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                              <div className="flex items-center justify-between mb-3">
                                 <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                                       {review.user?.avatarUrl ? (
                                          <img src={review.user.avatarUrl} alt={review.user.displayName} className="w-full h-full object-cover" />
                                       ) : (
                                          <div className="w-full h-full flex items-center justify-center bg-slate-400 text-white font-bold">
                                             {review.user?.displayName?.[0] || 'U'}
                                          </div>
                                       )}
                                    </div>
                                    <span className="font-bold text-slate-800 dark:text-white">{review.user?.displayName || 'Ẩn danh'}</span>
                                 </div>
                                 <div className="flex text-yellow-400 text-sm">
                                    {[...Array(5)].map((_, i) => (
                                       <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                                    ))}
                                 </div>
                              </div>
                              <p className="text-slate-600 dark:text-slate-300 italic">"{review.comment}"</p>
                              <p className="text-xs text-slate-400 mt-3">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</p>
                           </div>
                        )) : (
                           <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-2xl border border-dotted border-slate-300">
                              Chưa có đánh giá nào. Hãy là người đầu tiên chia sẻ trải nghiệm của bạn!
                           </div>
                        )}
                     </div>
                  </section>

               </div>

               {/* Right Column (Sidebar) */}
               <div className="space-y-8 h-fit lg:sticky lg:top-28">
                  {/* Join/Leave Card (for non-owners who joined) */}
                  {user && isUserJoined() && !isOwner() && (
                     <div className="bg-white dark:bg-slate-900 rounded-2xl border border-emerald-100 dark:border-emerald-900 p-8 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                           <span className="material-icons-round text-9xl text-emerald-500">check_circle</span>
                        </div>
                        <h3 className="font-display text-2xl font-bold mb-2 flex items-center gap-2 text-emerald-700">
                           <span className="material-icons-round">luggage</span>
                           Bạn Sẽ Đi!
                        </h3>
                        <p className="text-slate-500 mb-6 relative z-10">Hãy chuẩn bị cho một cuộc thám hiểm tuyệt vời.</p>
                        <button
                           onClick={handleLeaveTrip}
                           disabled={actionLoading}
                           className="w-full py-3 border border-red-200 text-red-500 rounded-xl font-bold hover:bg-red-50 transition-colors relative z-10"
                        >
                           {actionLoading ? 'Đang rời khỏi...' : 'Hủy Đặt Chỗ'}
                        </button>
                     </div>
                  )}

                  {/* Dates Card */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                     <h3 className="font-display text-xl mb-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 dark:text-white">
                        <span className="material-icons-round text-primary">calendar_today</span>
                        Ngày Của Chuyến Đi
                     </h3>
                     <div className="space-y-6">
                        <div className="flex items-start gap-4">
                           <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-xl flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700">
                              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                                 {formatDate(trip.startDate, true)?.month}
                              </span>
                              <span className="text-xl font-bold text-primary">
                                 {formatDate(trip.startDate, true)?.day}
                              </span>
                           </div>
                           <div>
                              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Ngày Bắt Đầu</p>
                              <p className="font-bold text-lg dark:text-white">{formatDate(trip.startDate)}</p>
                           </div>
                        </div>
                        {trip.endDate && (
                           <div className="flex items-start gap-4">
                              <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-xl flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700">
                                 <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                                    {formatDate(trip.endDate, true)?.month}
                                 </span>
                                 <span className="text-xl font-bold text-slate-600 dark:text-slate-400">
                                    {formatDate(trip.endDate, true)?.day}
                                 </span>
                              </div>
                              <div>
                                 <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Ngày Kết Thúc</p>
                                 <p className="font-bold text-lg dark:text-white">{formatDate(trip.endDate)}</p>
                              </div>
                           </div>
                        )}
                     </div>
                  </div>

                  {/* Participants Card */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                     <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="font-display text-xl flex items-center gap-2 dark:text-white">
                           <span className="material-icons-round text-primary">group</span>
                           Người Tham Gia
                        </h3>
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${trip.maxMembers && trip.members?.length >= trip.maxMembers ? 'bg-red-100 text-red-600' : 'bg-primary/10 text-primary'}`}>
                           {trip.members?.length || 0} {trip.maxMembers ? `/ ${trip.maxMembers}` : 'Đã Tham Gia'}
                        </span>
                     </div>

                     <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {/* Organizer */}
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold shadow-md shrink-0">
                              {trip.createdBy?.avatarUrl ? (
                                 <img src={trip.createdBy.avatarUrl} alt="Org" className="w-full h-full object-cover rounded-full" />
                              ) : (trip.createdBy?.displayName?.[0] || 'O')}
                           </div>
                           <div className="min-w-0">
                              <p className="text-sm font-bold truncate dark:text-white">{trip.createdBy?.displayName || 'Người Tổ Chức'}</p>
                              <span className="text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wide">Người Tổ Chức</span>
                           </div>
                        </div>

                        {/* Members */}
                        {trip.members?.map(member => (
                           <div key={member._id} className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold shrink-0 overflow-hidden">
                                 {member.avatarUrl ? (
                                    <img src={member.avatarUrl} alt={member.displayName} className="w-full h-full object-cover" />
                                 ) : (member.displayName?.[0] || 'U')}
                              </div>
                              <div className="min-w-0">
                                 <p className="text-sm font-medium truncate dark:text-slate-300">{member.displayName}</p>
                              </div>
                           </div>
                        ))}

                        {(!trip.members || trip.members.length === 0) && (
                           <p className="text-sm text-slate-400 italic">Chưa có thành viên nào khác.</p>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </Layout>
   );
};

export default TripDetailPage;