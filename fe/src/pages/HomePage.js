import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tripsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useDebounce } from '../hooks/useDebounce';
// import { groupTripsByTimeStatus, getGroupDisplayInfo } from '../utils/tripGrouping'; // Not using grouping for now to match UI grid
import Layout from '../components/Layout';
import TrekCard from '../components/TrekCard';

const HomePage = () => {
   const [trips, setTrips] = useState([]);
   const [filters, setFilters] = useState({
      search: '',
      location: '',
      difficulty: '',
      dateFrom: '',
      dateTo: '',
      status: 'ACTIVE'
   });
   const [activeTab, setActiveTab] = useState('upcoming');
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   // Debounce text inputs (search and location) to avoid API spam
   const debouncedSearch = useDebounce(filters.search, 500);
   const debouncedLocation = useDebounce(filters.location, 500);

   // Trigger API call when debounced text filters or immediate filters change
   useEffect(() => {
      loadTrips();
   }, [debouncedSearch, debouncedLocation, filters.difficulty, filters.dateFrom, filters.dateTo, filters.status, activeTab]);

   const loadTrips = async () => {
      try {
         setLoading(true);
         setError(null);

         // Build query params
         const queryParams = {
            search: debouncedSearch,
            location: debouncedLocation,
            difficulty: filters.difficulty,
            dateFrom: filters.dateFrom,
            dateTo: filters.dateTo,
            status: filters.status
         };

         // Apply logic for tabs if no specific dates are set (or combining them)
         // For simplification, let's assume the Tab drives a basic date filter if the user hasn't set custom ranges
         // OR, we can filter client-side if the API doesn't support complex "Upcoming vs Ongoing" easily without Date params.
         // Let's rely on API date filters, but pre-fill or adjust based on Tab? 
         // ACTUALLY, sticking to the MyTrips pattern: Fetch ALL (filtered by search/loc) then client-side categorize is safest for "grouping",
         // BUT for a public homepage with potential pagination, server-side is better.
         // However, existing tripsAPI.getTrips takes filters.
         // Let's implement Client-Side categorization for the "Tabs" to be consistent with MyTrips visually,
         // but use the API for the hard filters (Location, Difficulty).
         // Wait, if we have thousands of trips, client side is bad.
         // Let's add specific params for the tabs to the API call if needed, or just standard "dateFrom = now" for upcoming.

         // ADJUSTMENT: Map Tabs to Date Filters implicitely
         const now = new Date().toISOString();
         if (activeTab === 'upcoming' && !filters.dateFrom) {
            queryParams.dateFrom = now;
         } else if (activeTab === 'ongoing') {
            // Ongoing is tricky via simple "from/to" params unless API supports "active at date".
            // Let's fetch broader range or rely on client filtering for the "3 groups" visual, 
            // but for the "HomePage" which is "Discover", usually we just want Upcoming. 
            // The user asked for "3 groups" similar to MyTrips.
            // Let's try to filter the RESULT of the API call for the tabs.
         }

         // Only include non-empty values
         const cleanParams = {};
         Object.entries(queryParams).forEach(([key, value]) => {
            if (value && value.toString().trim() !== '') {
               cleanParams[key] = value.toString().trim();
            }
         });

         const data = await tripsAPI.getTrips(cleanParams);
         let fetchedTrips = data.trips || data || [];
         fetchedTrips = Array.isArray(fetchedTrips) ? fetchedTrips : [];

         // Client-side Tab Filtering (to perfectly match MyTrips logic on the current set)
         const nowObj = new Date();
         if (activeTab === 'upcoming') {
            fetchedTrips = fetchedTrips.filter(t => new Date(t.startDate) > nowObj);
         } else if (activeTab === 'ongoing') {
            fetchedTrips = fetchedTrips.filter(t => new Date(t.startDate) <= nowObj && new Date(t.endDate) >= nowObj);
         } else if (activeTab === 'past') {
            fetchedTrips = fetchedTrips.filter(t => new Date(t.endDate) < nowObj);
         }

         setTrips(fetchedTrips);
      } catch (err) {
         setError(err.message || 'Failed to load trips');
         setTrips([]);
      } finally {
         setLoading(false);
      }
   };

   const handleFilterChange = (field, value) => {
      setFilters(prev => ({ ...prev, [field]: value }));
   };

   const clearFilters = () => {
      setFilters({
         search: '',
         location: '',
         difficulty: '',
         dateFrom: '',
         dateTo: '',
         status: 'ACTIVE'
      });
      setActiveTab('upcoming'); // Reset tab too? Maybe keep tab. Let's keep tab.
   };

   const tabs = [
      { id: 'upcoming', label: 'Upcoming', icon: 'calendar_today', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
      { id: 'ongoing', label: 'Happening Now', icon: 'rocket_launch', color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' },
      { id: 'past', label: 'Past Trips', icon: 'history', color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-zinc-800' }
   ];

   return (
      <Layout transparentNav>
         {/* Simplified Hero */}
         <section className="relative h-[40vh] min-h-[400px] w-full overflow-hidden">
            <img
               alt="Cinematic mountain lake"
               className="absolute inset-0 w-full h-full object-cover"
               src="https://lh3.googleusercontent.com/aida-public/AB6AXuAI5j42jC2RpjCUzkARsbcAU3cPX1EBgJ2_5STRqIH5OSiic-iNR8u-CSU0FueZItWy8c4XCwkfkgO2ISSaJ-hnecA0VpuC5KmYXNuKtN4CWH4-AydGade0QN7nbvSx8mMaDW_jatxEBw5aYyL82JhidG6deCeN7ef-xelcse5PHrfAVkQezNaY5FWC7hSBSfWnliOlnMLdnlhNBMPW0FU4Vskndxxl9o64CU0eoY5oqKICq2NOp4wTeDanahzQSG987aLfzXwSaow"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-slate-50/90 dark:to-slate-900/90"></div>
            <div className="relative h-full flex flex-col items-center justify-center text-center px-4 pt-10">
               <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 font-display tracking-tight">
                  Explore the <span className="text-emerald-400">Journeys Ahead</span>
               </h1>
               <div className="w-full max-w-xl relative">
                  <input
                     type="text"
                     className="w-full pl-6 pr-14 py-4 rounded-full bg-white/90 backdrop-blur-sm text-slate-800 placeholder:text-slate-400 font-medium shadow-2xl focus:ring-4 focus:ring-primary/20 outline-none transition-all"
                     placeholder="Search for a trip..."
                     value={filters.search}
                     onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                  <button className="absolute right-2 top-2 p-2 bg-primary rounded-full text-white shadow-lg hover:bg-emerald-600 transition-colors">
                     <span className="material-icons-round">search</span>
                  </button>
               </div>
            </div>
         </section>

         <main className="max-w-7xl mx-auto px-6 pb-20 -mt-20 relative z-10">
            <div className="flex flex-col lg:flex-row gap-8">

               {/* Sidebar Filters */}
               <aside className="w-full lg:w-72 shrink-0 space-y-8">

                  {/* Category Tabs */}
                  <div className="bg-white dark:bg-zinc-900 rounded-3xl p-4 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-zinc-800">
                     <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Categories</h3>
                     <div className="flex flex-col gap-2">
                        {tabs.map(tab => (
                           <button
                              key={tab.id}
                              onClick={() => setActiveTab(tab.id)}
                              className={`flex items-center gap-3 p-3 rounded-xl transition-all font-bold text-sm ${activeTab === tab.id
                                 ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                 : 'hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-600 dark:text-slate-400'
                                 }`}
                           >
                              <span className={`material-icons-round text-lg ${activeTab === tab.id ? 'text-white' : tab.color}`}>{tab.icon}</span>
                              {tab.label}
                           </button>
                        ))}
                     </div>
                  </div>

                  {/* Filter Panel */}
                  <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-zinc-800">
                     <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Filters</h3>
                        <button onClick={clearFilters} className="text-xs font-bold text-primary hover:underline">Clear</button>
                     </div>

                     <div className="space-y-6">
                        {/* Location */}
                        <div>
                           <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 block">Location</label>
                           <div className="relative">
                              <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">location_on</span>
                              <input
                                 type="text"
                                 className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-800 rounded-xl text-sm font-medium text-slate-700 dark:text-white border-2 border-transparent focus:border-primary/20 outline-none transition-all placeholder:text-slate-400"
                                 placeholder="Where to?"
                                 value={filters.location}
                                 onChange={(e) => handleFilterChange('location', e.target.value)}
                              />
                           </div>
                        </div>

                        {/* Date Range */}
                        <div>
                           <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 block">Date Range</label>
                           <div className="grid grid-cols-2 gap-2">
                              <div className="relative">
                                 <input
                                    type="date"
                                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-zinc-800 rounded-xl text-xs font-bold text-slate-700 dark:text-white border-2 border-transparent focus:border-primary/20 outline-none"
                                    value={filters.dateFrom}
                                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                                 />
                              </div>
                              <div className="relative">
                                 <input
                                    type="date"
                                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-zinc-800 rounded-xl text-xs font-bold text-slate-700 dark:text-white border-2 border-transparent focus:border-primary/20 outline-none"
                                    value={filters.dateTo}
                                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                                 />
                              </div>
                           </div>
                        </div>

                        {/* Difficulty */}
                        <div>
                           <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 block">Difficulty</label>
                           <div className="space-y-2">
                              {['easy', 'moderate', 'hard', 'extreme'].map(level => (
                                 <label key={level} className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${filters.difficulty === level ? 'border-primary' : 'border-slate-300 dark:border-zinc-700'}`}>
                                       {filters.difficulty === level && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                    </div>
                                    <input
                                       type="radio"
                                       name="difficulty"
                                       className="hidden"
                                       checked={filters.difficulty === level}
                                       onChange={() => handleFilterChange('difficulty', level)}
                                    />
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400 capitalize group-hover:text-primary transition-colors">{level}</span>
                                 </label>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>
               </aside>

               {/* Main Grid */}
               <div className="flex-1">
                  <div className="flex items-center justify-between mb-8">
                     <h2 className="text-3xl font-bold dark:text-white">
                        {activeTab === 'upcoming' && 'Upcoming Adventures'}
                        {activeTab === 'ongoing' && 'Happening Now'}
                        {activeTab === 'past' && 'Past Trips'}
                     </h2>
                     <span className="px-3 py-1 bg-white dark:bg-zinc-900 rounded-full text-sm font-bold text-slate-500 shadow-sm border border-slate-100 dark:border-zinc-800">
                        {trips.length} results
                     </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {loading ? (
                        [1, 2, 3, 4].map(i => (
                           <div key={i} className="h-[400px] bg-white dark:bg-slate-800 rounded-3xl animate-pulse"></div>
                        ))
                     ) : error ? (
                        <div className="col-span-full text-red-500 text-center py-12 bg-red-50 rounded-3xl">
                           <span className="material-icons-round text-3xl mb-2">error_outline</span>
                           <p className="font-bold">{error}</p>
                           <button onClick={loadTrips} className="text-primary underline mt-2">Retry</button>
                        </div>
                     ) : trips.length > 0 ? (
                        trips.map(trip => (
                           <TrekCard key={trip._id} trek={trip} />
                        ))
                     ) : (
                        <div className="col-span-full text-center py-20">
                           <div className="w-24 h-24 bg-slate-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6">
                              <span className="material-icons-round text-4xl text-slate-300">search_off</span>
                           </div>
                           <h3 className="text-xl font-bold dark:text-white mb-2">No trips found</h3>
                           <p className="text-slate-500 mb-6">Try adjusting your filters or category.</p>
                           <button onClick={clearFilters} className="px-6 py-2 bg-slate-200 dark:bg-zinc-800 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-300 transition-colors">
                              Clear all filters
                           </button>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </main>
      </Layout>
   );
};

export default HomePage;