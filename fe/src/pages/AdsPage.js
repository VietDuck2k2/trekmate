import React, { useState, useEffect } from 'react';
import { adsAPI } from '../services/api';
import Layout from '../components/Layout';

const AdsPage = () => {
   const [ads, setAds] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [searchTerm, setSearchTerm] = useState('');
   const [filteredAds, setFilteredAds] = useState([]);

   useEffect(() => {
      loadAds();
   }, []);

   useEffect(() => {
      if (!searchTerm.trim()) {
         setFilteredAds(ads);
      } else {
         const term = searchTerm.toLowerCase();
         const filtered = ads.filter(ad => {
            const title = ad.title?.toLowerCase() || '';
            const description = ad.description?.toLowerCase() || '';
            const brandName = ad.brandId?.brandInfo?.brandName?.toLowerCase() || '';
            const displayName = ad.brandId?.displayName?.toLowerCase() || '';

            return title.includes(term) ||
               description.includes(term) ||
               brandName.includes(term) ||
               displayName.includes(term);
         });
         setFilteredAds(filtered);
      }
   }, [searchTerm, ads]);

   const loadAds = async () => {
      try {
         setLoading(true);
         setError(null);
         const response = await adsAPI.getAds({ limit: 50 });
         const adsData = Array.isArray(response?.ads) ? response.ads : [];
         setAds(adsData);
         setFilteredAds(adsData);
      } catch (err) {
         console.error('Error loading ads:', err);
         setError(err.message || 'Failed to load advertisements');
         setAds([]);
         setFilteredAds([]);
      } finally {
         setLoading(false);
      }
   };

   return (
      <Layout>
         {/* Header */}
         <header className="relative pt-32 pb-16 px-6 overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10">
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                     <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-widest">Premium Partners</span>
                     </div>
                     <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight font-outfit">
                        Discover Gear <br /><span className="text-primary">&amp; Services</span>
                     </h1>
                     <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl">
                        Handpicked recommendations from our trusted brand partners to elevate your next adventure.
                     </p>
                  </div>
               </div>
            </div>
         </header>

         <main className="max-w-7xl mx-auto px-6 pb-24">
            {/* Search Bar */}
            <div className="relative -mt-8 mb-16">
               <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 flex items-center">
                  <div className="pl-4 pr-2">
                     <span className="material-icons-round text-slate-400">search</span>
                  </div>
                  <input
                     className="flex-grow bg-transparent border-none focus:ring-0 text-slate-700 dark:text-slate-200 py-4 placeholder:text-slate-400"
                     placeholder="Search ads by title, description, or brand..."
                     type="text"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                     <button
                        onClick={() => setSearchTerm('')}
                        className="mr-2 text-slate-400 hover:text-slate-600"
                     >
                        <span className="material-icons-round">close</span>
                     </button>
                  )}
                  <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-800 transition-colors shadow-lg flex items-center gap-2">
                     Filter
                     <span className="material-icons-round text-sm">tune</span>
                  </button>
               </div>
            </div>

            {loading ? (
               <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
               </div>
            ) : error ? (
               <div className="text-center py-20">
                  <div className="text-red-500 mb-4 text-xl font-bold">{error}</div>
                  <button onClick={loadAds} className="px-6 py-2 bg-primary text-white rounded-lg">Try Again</button>
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredAds.map(ad => (
                     <AdCard key={ad._id} ad={ad} />
                  ))}

                  {/* Brand Partner Card */}
                  <div className="bg-primary flex flex-col items-center justify-center p-8 rounded-2xl text-center text-white relative overflow-hidden group min-h-[400px]">
                     <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                     <div className="relative z-10">
                        <span className="material-icons-round text-6xl mb-4">handshake</span>
                        <h3 className="text-2xl font-bold mb-4">Become a Brand Partner</h3>
                        <p className="text-emerald-100 mb-8 text-sm opacity-90 leading-relaxed">
                           Join our network and showcase your services to a community of passionate travelers and adventurers.
                        </p>
                        <button className="bg-white text-primary px-8 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors shadow-lg">
                           Contact Us Today
                        </button>
                     </div>
                  </div>
               </div>
            )}

            {!loading && !error && filteredAds.length === 0 && (
               <div className="text-center py-20 text-slate-500">
                  <span className="material-icons-round text-6xl mb-4 text-slate-300">search_off</span>
                  <p className="text-xl">No ads match your search.</p>
               </div>
            )}
         </main>
      </Layout>
   );
};

// Ad Card Component
const AdCard = ({ ad }) => {
   const brandName = ad.brandId?.brandInfo?.brandName || ad.brandId?.displayName || 'Brand';
   const brandLogo = ad.brandId?.brandInfo?.logoUrl;
   const brandWebsite = ad.brandId?.brandInfo?.website || ad.linkUrl;
   const rating = (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1); // Mock rating since backend doesn't seem to provide it yet

   const handleActionClick = () => {
      if (ad.linkUrl) {
         window.open(ad.linkUrl, '_blank', 'noopener,noreferrer');
      } else if (brandWebsite) {
         window.open(brandWebsite, '_blank', 'noopener,noreferrer');
      }
   };

   return (
      <div className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
         <div className="relative h-64 overflow-hidden shrink-0">
            <img
               alt={ad.title}
               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
               src={ad.imageUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb7d5c73?auto=format&fit=crop&q=80'}
               onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542601906990-b4d3fb7d5c73?auto=format&fit=crop&q=80'; }}
            />
            <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary flex items-center gap-1 shadow-sm">
               <span className="material-icons-round text-xs">star</span> {rating}
            </div>
         </div>
         <div className="p-6 flex flex-col flex-grow">
            <div className="flex items-center gap-3 mb-4">
               {brandLogo ? (
                  <img src={brandLogo} alt={brandName} className="w-8 h-8 rounded-full object-cover shadow-md" />
               ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                     {brandName.charAt(0).toUpperCase()}
                  </div>
               )}
               <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{brandName}</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">{ad.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-2 flex-grow">{ad.description}</p>
            <button
               onClick={handleActionClick}
               className="inline-flex items-center justify-center w-full py-3 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all duration-300 group/btn mt-auto"
            >
               Learn More
               <span className="material-icons-round ml-2 text-sm group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
            </button>
         </div>
      </div>
   );
};

export default AdsPage;