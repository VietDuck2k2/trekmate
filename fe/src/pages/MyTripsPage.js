import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { tripsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';

const MyTripsPage = () => {
   const { user } = useAuth();
   const navigate = useNavigate();
   const [allTrips, setAllTrips] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [activeTab, setActiveTab] = useState('upcoming');

   useEffect(() => {
      if (user) {
         loadUserTrips();
      }
   }, [user]);

   const loadUserTrips = async () => {
      try {
         setLoading(true);
         setError(null);

         const [joinedData, createdData] = await Promise.all([
            tripsAPI.getMyJoinedTrips(),
            tripsAPI.getMyCreatedTrips()
         ]);

         const joinedTrips = Array.isArray(joinedData) ? joinedData : [];
         const createdTrips = Array.isArray(createdData) ? createdData : [];

         // Combine all trips with role information
         const allTripsWithRoles = [
            ...createdTrips.map(trip => ({ ...trip, userRole: 'ORGANIZER' })),
            ...joinedTrips.map(trip => ({ ...trip, userRole: 'MEMBER' }))
         ];

         // Remove duplicates (prioritize ORGANIZER role)
         const uniqueTrips = allTripsWithRoles.reduce((acc, current) => {
            const existingIndex = acc.findIndex(trip => trip._id === current._id);
            if (existingIndex === -1) {
               acc.push(current);
            } else if (current.userRole === 'ORGANIZER') {
               acc[existingIndex] = current;
            }
            return acc;
         }, []);

         setAllTrips(uniqueTrips);

         // Auto-select ongoing if there are any, otherwise default to upcoming
         const now = new Date();
         const hasOngoing = uniqueTrips.some(t => new Date(t.startDate) <= now && new Date(t.endDate) >= now);
         if (hasOngoing) setActiveTab('ongoing');

      } catch (err) {
         setError(err.message || 'Không thể tải chuyến đi');
         setAllTrips([]);
      } finally {
         setLoading(false);
      }
   };

   // Helper to categorize trips
   const categorizeTrips = (trips) => {
      const now = new Date();
      return {
         ongoing: trips.filter(t => new Date(t.startDate) <= now && new Date(t.endDate) >= now),
         upcoming: trips.filter(t => new Date(t.startDate) > now),
         completed: trips.filter(t => new Date(t.endDate) < now)
      };
   };

   const { ongoing, upcoming, completed } = categorizeTrips(allTrips);

   // Helper to format dates
   const formatDateRange = (start, end) => {
      if (!start) return 'Sắp tới';
      const startDate = new Date(start);
      const endDate = end ? new Date(end) : null;

      const options = { month: 'short', day: 'numeric' };
      if (endDate) {
         return `${startDate.toLocaleDateString('vi-VN', options)} - ${endDate.toLocaleDateString('vi-VN', options)}`;
      }
      return startDate.toLocaleDateString('vi-VN', options);
   };

   if (!user) {
      return (
         <Layout>
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
               <span className="material-icons-round text-6xl text-slate-300 mb-4">lock</span>
               <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Yêu Cầu Đăng Nhập</h1>
               <p className="text-slate-500 mb-6">Bạn cần đăng nhập để xem các chuyến đi của mình.</p>
               <Link to="/login" className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-emerald-700 transition">Đăng Nhập Ngay</Link>
            </div>
         </Layout>
      );
   }

   if (loading) {
      return (
         <Layout>
            <div className="flex items-center justify-center min-h-screen pt-20">
               <div className="text-xl text-slate-500 animate-pulse">Đang tải các chuyến thám hiểm của bạn...</div>
            </div>
         </Layout>
      );
   }

   const tabs = [
      { id: 'ongoing', label: 'Đang Diễn Ra', icon: 'rocket_launch', count: ongoing.length, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' },
      { id: 'upcoming', label: 'Sắp Tới', icon: 'calendar_today', count: upcoming.length, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
      { id: 'completed', label: 'Đã Kết Thúc', icon: 'check_circle', count: completed.length, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30' }
   ];

   return (
      <Layout>
         <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 mt-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
               <div>
                  <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
                     <span>Bảng Điều Khiển</span>
                     <span className="material-icons-round text-xs">chevron_right</span>
                     <span className="text-primary font-medium">Chuyến Đi Của Tôi</span>
                  </nav>
                  <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white">Cuộc Thám Hiểm Của Tôi</h1>
                  <p className="text-slate-500 dark:text-slate-400 mt-2">Quản lý các hành trình trekking của bạn và kết nối với cộng đồng.</p>
               </div>
               <Link to="/trips/create" className="bg-primary hover:bg-emerald-800 text-white px-8 py-4 rounded-2xl flex items-center gap-2 font-semibold shadow-xl shadow-primary/20 transition-all transform hover:-translate-y-1 active:scale-95">
                  <span className="material-icons-round">add</span>
                  Tạo Chuyến Đi Mới
               </Link>
            </header>

            {error && (
               <div className="mb-8 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl flex items-center gap-3">
                  <span className="material-icons-round">error</span>
                  {error}
                  <button onClick={loadUserTrips} className="underline font-bold ml-auto">Thử Lại</button>
               </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8">
               {/* Sidebar Tabs */}
               <aside className="w-full lg:w-72 shrink-0">
                  <div className="bg-white dark:bg-zinc-900 rounded-3xl p-4 shadow-sm border border-slate-100 dark:border-zinc-800 sticky top-28">
                     <div className="flex flex-col gap-2">
                        {tabs.map(tab => (
                           <button
                              key={tab.id}
                              onClick={() => setActiveTab(tab.id)}
                              className={`flex items-center justify-between p-4 rounded-2xl transition-all ${activeTab === tab.id
                                 ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                 : 'hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-600 dark:text-slate-400'
                                 }`}
                           >
                              <div className="flex items-center gap-3">
                                 <span className={`material-icons-round ${activeTab === tab.id ? 'text-white' : tab.color}`}>{tab.icon}</span>
                                 <span className="font-bold">{tab.label}</span>
                              </div>
                              <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${activeTab === tab.id
                                 ? 'bg-white/20 text-white'
                                 : 'bg-slate-100 dark:bg-zinc-800 text-slate-500'
                                 }`}>
                                 {tab.count}
                              </span>
                           </button>
                        ))}
                     </div>
                  </div>
               </aside>

               {/* Main Content Area */}
               <div className="flex-1 min-h-[500px]">
                  {activeTab === 'ongoing' && (
                     <div className="animate-fade-in">
                        <div className="flex items-center gap-3 mb-6">
                           <h2 className="text-2xl font-bold dark:text-white">Các Chuyến Đi Đang Diễn Ra</h2>
                        </div>
                        {ongoing.length > 0 ? (
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {ongoing.map(trip => (
                                 <div key={trip._id} className="group relative rounded-[32px] overflow-hidden shadow-2xl cursor-pointer" onClick={() => navigate(`/trips/${trip._id}`)}>
                                    <img
                                       alt={trip.title}
                                       className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-110"
                                       src={trip.coverImageUrl || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b'}
                                       onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b'; }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                    <div className="absolute top-6 right-6">
                                       <span className="px-4 py-2 bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-full text-xs font-bold tracking-widest uppercase">Đang Diễn Ra</span>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-8">
                                       <h3 className="text-2xl font-bold text-white mb-2">{trip.title}</h3>
                                       <div className="flex items-center gap-2 text-white/80 text-sm mb-4">
                                          <span className="material-icons-round text-sm">location_on</span>
                                          <span>{trip.location}</span>
                                       </div>
                                       <div className="flex gap-2">
                                          <span className="px-3 py-1 bg-white/20 text-white text-[10px] font-bold rounded-lg uppercase">{trip.difficulty}</span>
                                          <span className="px-3 py-1 bg-white/20 text-white text-[10px] font-bold rounded-lg uppercase">{formatDateRange(trip.startDate, trip.endDate)}</span>
                                       </div>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        ) : (
                           <div className="text-center py-20 bg-slate-50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-zinc-800">
                              <span className="material-icons-round text-4xl text-slate-300 mb-4">rocket_launch</span>
                              <p className="text-slate-500">Hiện tại không có chuyến đi nào đang diễn ra.</p>
                           </div>
                        )}
                     </div>
                  )}

                  {activeTab === 'upcoming' && (
                     <div className="animate-fade-in">
                        <div className="flex items-center gap-3 mb-6">
                           <h2 className="text-2xl font-bold dark:text-white">Các Cuộc Thám Hiểm Sắp Tới</h2>
                        </div>
                        {upcoming.length > 0 ? (
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {upcoming.map(trip => (
                                 <div key={trip._id} className="group bg-white dark:bg-zinc-900 rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 dark:border-zinc-800 transition-all cursor-pointer" onClick={() => navigate(`/trips/${trip._id}`)}>
                                    <div className="relative h-48 overflow-hidden">
                                       <img
                                          alt={trip.title}
                                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                          src={trip.coverImageUrl || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4'}
                                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4'; }}
                                       />
                                       {trip.userRole === 'ORGANIZER' && (
                                          <div className="absolute top-4 left-4">
                                             <span className="bg-primary text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg">Người Tổ Chức</span>
                                          </div>
                                       )}
                                       <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-slate-800 flex items-center gap-1">
                                          <span className="material-icons-round text-[14px] text-primary">calendar_today</span>
                                          {new Date(trip.startDate).toLocaleDateString('vi-VN')}
                                       </div>
                                    </div>
                                    <div className="p-6">
                                       <h3 className="text-xl font-bold dark:text-white mb-2 group-hover:text-primary transition-colors line-clamp-1">{trip.title}</h3>
                                       <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-4">{trip.description || 'Không có mô tả được cung cấp.'}</p>
                                       <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-zinc-800">
                                          <div className="flex -space-x-2">
                                             {trip.members?.slice(0, 3).map((m, i) => (
                                                <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white dark:border-zinc-900 flex items-center justify-center text-xs font-bold overflow-hidden">
                                                   {m.avatarUrl ? <img src={m.avatarUrl} className="w-full h-full object-cover" /> : m.displayName?.[0] || 'U'}
                                                </div>
                                             ))}
                                             {(trip.members?.length || 0) > 3 && (
                                                <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-500">+{trip.members.length - 3}</div>
                                             )}
                                          </div>
                                          <span className="text-primary font-bold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                             Xem Chi Tiết <span className="material-icons-round text-sm">arrow_forward</span>
                                          </span>
                                       </div>
                                    </div>
                                 </div>
                              ))}

                              {/* Create New Card */}
                              <div
                                 onClick={() => navigate('/trips/create')}
                                 className="border-2 border-dashed border-slate-300 dark:border-zinc-700 rounded-[32px] flex flex-col items-center justify-center p-8 text-center group cursor-pointer hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all min-h-[300px]"
                              >
                                 <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors text-slate-400 group-hover:text-white">
                                    <span className="material-icons-round text-2xl">add</span>
                                 </div>
                                 <h3 className="text-lg font-bold dark:text-white mb-1">Lên Kế Hoạch Chuyến Đi Mới</h3>
                                 <p className="text-slate-400 text-sm">Bắt đầu một chuyến thám hiểm mới</p>
                              </div>
                           </div>
                        ) : (
                           <div className="text-center py-20 bg-slate-50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-zinc-800">
                              <span className="material-icons-round text-4xl text-slate-300 mb-4">calendar_today</span>
                              <p className="text-slate-500 mb-4">Không có chuyến đi nào sắp tới được lên lịch.</p>
                              <Link to="/trips/create" className="text-primary font-bold hover:underline">Lên kế hoạch ngay bây giờ</Link>
                           </div>
                        )}
                     </div>
                  )}

                  {activeTab === 'completed' && (
                     <div className="animate-fade-in">
                        <div className="flex items-center gap-3 mb-6">
                           <h2 className="text-2xl font-bold dark:text-white">Kỷ Niệm Cũ</h2>
                        </div>
                        {completed.length > 0 ? (
                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {completed.map(trip => (
                                 <div key={trip._id} className="bg-white dark:bg-zinc-900 rounded-3xl p-4 border border-slate-100 dark:border-zinc-800 group hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate(`/trips/${trip._id}`)}>
                                    <div className="relative h-48 rounded-2xl overflow-hidden mb-4">
                                       <img
                                          alt={trip.title}
                                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                          src={trip.coverImageUrl || 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05'}
                                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05'; }}
                                       />
                                       <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                                       <div className="absolute bottom-3 left-3 flex gap-2">
                                          <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-slate-800 flex items-center gap-1">
                                             <span className="material-icons-round text-[12px] text-emerald-600">check_circle</span>
                                             {new Date(trip.endDate).toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' })}
                                          </span>
                                       </div>
                                    </div>
                                    <h4 className="font-bold text-lg dark:text-white truncate mb-1">{trip.title}</h4>
                                    <p className="text-sm text-slate-400 mb-4 flex items-center gap-1">
                                       <span className="material-icons-round text-xs">location_on</span>
                                       {trip.location}
                                    </p>
                                    <div className="flex items-center justify-end">
                                       <span className="text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                          Hồi Tưởng <span className="material-icons-round text-sm">history</span>
                                       </span>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        ) : (
                           <div className="text-center py-20 bg-slate-50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-zinc-800">
                              <span className="material-icons-round text-4xl text-slate-300 mb-4">history</span>
                              <p className="text-slate-500">Chưa có chuyến đi nào đã kết thúc.</p>
                           </div>
                        )}
                     </div>
                  )}
               </div>
            </div>
         </div>
      </Layout>
   );
};

export default MyTripsPage;